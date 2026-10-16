// src/app/api/parent-attendance/report/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getCurrentCycle, toDateStr, formatCycleLabel } from '../../../../lib/attendanceCycle';

/**
 * Returns the cycle window for browsing attendance history.
 *
 * - cycleOffset === 0  →  current start-date-anchored cycle (e.g. 05 Oct – 04 Nov)
 * - cycleOffset  <  0  →  FULL CALENDAR MONTH N months ago (e.g. offset -1 = whole
 *                          of September, Sept 1 – Sept 30).
 *
 * Why calendar months for history?  The start-date-anchored cycle only makes sense
 * for the *current* month — it ensures the rolling window is correct right now.
 * For past months, parents think in "September", "August", etc., and attendance
 * records are stored with real calendar dates.  Using the anchored offset would
 * silently drop records from the start of a month (e.g. Sept 1–4 when anchor is
 * Sept 5), which is exactly what caused the "only 2 days" bug.
 */
function getCycleAtOffset(
  startDateStr: string,
  today: Date,
  cycleOffset: number,
): { startStr: string; endStr: string; label: string } {
  // ── Past months: full calendar month ─────────────────────────────────────
  if (cycleOffset < 0) {
    const base = new Date(today.getFullYear(), today.getMonth() + cycleOffset, 1);
    const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    return {
      startStr: toDateStr(base),
      endStr:   toDateStr(next),
      label:    base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
  }

  // ── Current cycle: start-date-anchored rolling window ────────────────────
  if (!startDateStr) {
    const base = new Date(today.getFullYear(), today.getMonth(), 1);
    const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    return {
      startStr: toDateStr(base),
      endStr:   toDateStr(next),
      label:    today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
  }
  return getCurrentCycle(startDateStr, today);
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, cycleOffset: rawOffset } = body as { phone: string; cycleOffset?: number };
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }
    // clamp offset to a safe range (0 down to -12)
    const cycleOffset = Math.max(-12, Math.min(0, typeof rawOffset === 'number' ? rawOffset : 0));
    const cleaned = phone.trim();
    const db = getAdminDb();

    // 1) Verify the parent exists — this is the ONLY thing that identifies the caller.
    const parentSnap = await db.collection('parents').where('phone', '==', cleaned).limit(1).get();
    if (parentSnap.empty) {
      return NextResponse.json({ error: 'No parent found with that phone number' }, { status: 404 });
    }
    const parentData = parentSnap.docs[0].data();
    const parentDocName = (parentData.name || '').trim();
    const parentDocStudent = (parentData.studentName || '').trim();

    // 2) Their child's active classes — matched by parentPhone, server-side.
    //    Dedupe in case a duplicate assignment doc exists (e.g. from "duplicate
    //    for new month" without the old one marked completed).
    const aSnap = await db.collection('classes')
      .where('parentPhone', '==', cleaned)
      .where('status', '==', 'active')
      .get();

    const seen = new Set<string>();
    const classesRaw = aSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter(a => {
        const key = `${a.tutorName}::${a.subject}::${a.parentName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    // Resolve Student & Parent Names:
    // - parentData.studentName stores the student's name.
    // - parentData.name stores the parent's actual name if given.
    const resolvedStudentName =
      parentDocStudent ||
      classesRaw.find(a => a.studentName)?.studentName ||
      classesRaw[0]?.parentName ||
      '';

    const parentName = (parentDocName && parentDocName.toLowerCase() !== resolvedStudentName.toLowerCase())
      ? parentDocName
      : 'Parent';

    const now = new Date();

    // Each class gets its OWN cycle window (possibly in the past when
    // cycleOffset < 0), anchored to its own startDate.
    const classesWithCycle = classesRaw.map(a => ({ ...a, cycle: getCycleAtOffset(a.startDate, now, cycleOffset) }));

    const classes = classesWithCycle.map(a => ({
      id: a.id,
      tutorName: a.tutorName,
      tutorPhone: a.tutorPhone || '',
      subject: a.subject,
      classLevel: a.classLevel,
      classesPerWeek: a.classesPerWeek,
      studentName: resolvedStudentName || a.studentName || a.parentName || '',
      startDate: a.startDate || '',
      area: a.area || '',
      cycleLabel: a.cycle.label,
    }));

    const studentNames = Array.from(new Set(classes.map(a => a.studentName as string).filter(Boolean)));

    // 3) Fetch attendance per DISTINCT (student, cycle window) pair — several
    //    classes for the same child may share an identical cycle and can
    //    reuse one query; classes with different start dates get their own.
    const cycleKeyFor = (studentName: string, c: { startStr: string; endStr: string }) => `${studentName}::${c.startStr}::${c.endStr}`;
    const uniqueCycleQueries = new Map<string, { studentName: string; startStr: string; endStr: string }>();
    classesWithCycle.forEach(a => {
      const key = cycleKeyFor(a.parentName, a.cycle);
      if (!uniqueCycleQueries.has(key)) uniqueCycleQueries.set(key, { studentName: a.parentName, startStr: a.cycle.startStr, endStr: a.cycle.endStr });
    });

    const attResults = await Promise.all(Array.from(uniqueCycleQueries.values()).map(async q => {
      const snap = await db.collection('attendance')
        .where('studentName', '==', q.studentName)
        .where('date', '>=', q.startStr)
        .where('date', '<', q.endStr)
        .get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    }));
    const allAttendanceDocs = new Map<string, any>();
    attResults.flat().forEach(doc => allAttendanceDocs.set(doc.id, doc));

    // Attribute each attendance doc to its matching class (studentName + subject
    // + tutorName + falling inside that class's own cycle window) — this is what
    // makes sessions from before the 1st of the calendar month (but after the
    // class's actual start date) count correctly instead of being cut off.
    const records: any[] = [];
    const summaryMap: Record<string, { tutorName: string; subject: string; studentName: string; cycleLabel: string; present: number; absent: number; holiday: number; cancelled: number; total: number }> = {};

    classesWithCycle.forEach(a => {
      const matches = Array.from(allAttendanceDocs.values()).filter(doc =>
        doc.studentName === a.parentName && doc.subject === a.subject && doc.tutorName === a.tutorName &&
        doc.date >= a.cycle.startStr && doc.date < a.cycle.endStr
      );
      matches.forEach(doc => records.push(doc));
      const key = `${a.tutorName}::${a.subject}::${a.parentName}`;
      if (!summaryMap[key]) summaryMap[key] = { tutorName: a.tutorName, subject: a.subject, studentName: a.parentName, cycleLabel: a.cycle.label, present: 0, absent: 0, holiday: 0, cancelled: 0, total: 0 };
      matches.forEach(doc => {
        summaryMap[key][doc.status as 'present' | 'absent' | 'holiday' | 'cancelled']++;
        summaryMap[key].total++;
      });
    });
    records.sort((a, b) => b.date.localeCompare(a.date));

    // Overall label for the top stat cards: if every active class happens to
    // share the same cycle window, show that range; otherwise (mixed start
    // dates), use a neutral label since one date range wouldn't be accurate.
    const distinctLabels = new Set(classesWithCycle.map(a => a.cycle.label));
    const cycleLabel = distinctLabels.size === 1 ? Array.from(distinctLabels)[0] : 'Current Billing Cycle';

    // 4) Fee status for the selected cycle's calendar month — amount owed and
    //    payment status ONLY.  Deliberately never selecting tutorFee or
    //    profit here; a parent should never see what the tutor is paid.
    //    We derive the calendar month from the (possibly offset) cycle start.
    const anyClassCycle = classesWithCycle[0]?.cycle;
    let feeMonthLabel: string;
    if (anyClassCycle) {
      const cycleStartDate = new Date(anyClassCycle.startStr);
      feeMonthLabel = cycleStartDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    } else {
      feeMonthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    }

    const feeSnaps = await Promise.all(studentNames.map(name =>
      db.collection('fees').where('parentName', '==', name).where('month', '==', feeMonthLabel).get()
    ));

    // Aggregate per-student: sum amounts, derive combined payment status
    // (pending if any entry is pending, received/paid otherwise).
    // This deliberately hides the per-tutor breakdown from the parent.
    const rawFees = feeSnaps.flatMap(snap => snap.docs).map(d => {
      const data = d.data();
      return {
        studentName: data.parentName as string,
        amount: data.parentFee as number,
        status: data.paymentStatus as string,
        month: data.month as string,
      };
    });
    const feeByStudent = new Map<string, { studentName: string; totalAmount: number; month: string; status: string }>();
    rawFees.forEach(f => {
      const existing = feeByStudent.get(f.studentName);
      if (existing) {
        existing.totalAmount += f.amount || 0;
        if (f.status === 'pending') existing.status = 'pending';
      } else {
        feeByStudent.set(f.studentName, {
          studentName: f.studentName,
          totalAmount: f.amount || 0,
          month: f.month,
          status: f.status,
        });
      }
    });
    const fees = Array.from(feeByStudent.values()).map(f => ({
      studentName: f.studentName,
      amount: f.totalAmount,
      status: f.status,
      month: f.month,
    }));

    return NextResponse.json({
      parentName,
      classes,
      cycleLabel,
      cycleOffset,
      feeMonthLabel,
      records: records.map(r => {
        const remark = (r.remark || r.remarks || r.notes || r.note || '') as string;
        const student = resolvedStudentName || r.studentName || '';
        return {
          id: r.id,
          studentName: student,
          tutorName: r.tutorName,
          subject: r.subject,
          classLevel: r.classLevel,
          date: r.date,
          status: r.status,
          sessionDuration: r.sessionDuration || 1,
          notes: remark,
          remark: remark,
          remarks: remark,
        };
      }),
      summary: Object.values(summaryMap),
      fees,
    });
  } catch (err) {
    console.error('Parent attendance report error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}