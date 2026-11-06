// src/app/api/parent-attendance/report/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getCurrentCycle, toDateStr, formatCycleLabel } from '../../../../lib/attendanceCycle';

/**
 * Returns the cycle window for browsing attendance history.
 *
 * All offsets use start-date-anchored billing cycles:
 * - cycleOffset === 0  →  current billing cycle  (e.g. 05 Oct – 04 Nov)
 * - cycleOffset === -1 →  previous billing cycle (e.g. 05 Sep – 04 Oct)
 * - cycleOffset === -2 →  two cycles ago, etc.
 *
 * This ensures "Previous Cycle" always shows the actual billing period that
 * the class was running, not a calendar month that may not match the real window.
 */
function getCycleAtOffset(
  startDateStr: string,
  today: Date,
  cycleOffset: number,
): { startStr: string; endStr: string; label: string } {
  // Fallback when there's no start date: use calendar months
  if (!startDateStr) {
    const base = new Date(today.getFullYear(), today.getMonth() + cycleOffset, 1);
    const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    return {
      startStr: toDateStr(base),
      endStr:   toDateStr(next),
      label:    base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    };
  }

  // ── Start-date-anchored cycle at the given offset ────────────────────────
  // First find the current cycle, then step back |cycleOffset| months.
  const currentCycle = getCurrentCycle(startDateStr, today);
  if (cycleOffset === 0) return currentCycle;

  // Walk backwards from the assignment's start date by |cycleOffset| months
  const anchor = new Date(startDateStr);
  const cycleStart = new Date(anchor);
  cycleStart.setMonth(cycleStart.getMonth() + cycleOffset); // cycleOffset is negative
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setMonth(cycleEnd.getMonth() + 1);
  const startStr = toDateStr(cycleStart);
  const endStr = toDateStr(cycleEnd);
  return { startStr, endStr, label: formatCycleLabel(startStr, endStr) };
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

    // 2) Fetch ALL class assignments for this parent (active, completed, paused).
    // Each assignment document represents a specific tuition cycle/month.
    const aSnap = await db.collection('classes')
      .where('parentPhone', '==', cleaned)
      .get();

    if (aSnap.empty) {
      return NextResponse.json({
        parentName: parentDocName || 'Parent',
        classes: [],
        studentNames: [],
        cycleLabel: 'No Cycles Available',
        feeMonthLabel: 'This Month',
        records: [],
        summary: [],
        fees: [],
        cycleOffset: 0,
        minCycleOffset: 0,
      });
    }

    const allAssignmentDocs = aSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

    // ── Group assignments by subject + student (NOT tutorName) ───────────────
    // Using subject::parentName as the key means that when a tutor is replaced
    // the new assignment is added to the SAME timeline as the old one, so
    // cycleOffset=-1 navigates to the previous tutor's actual assignment window
    // (startDate→nextStartDate) instead of falling into the calendar-month
    // fallback that fires when each tutor forms a separate single-entry group.
    //
    // For the CURRENT view (cycleOffset === 0) we exclude completed assignments
    // so they don't appear alongside active ones.  For past browsing we keep all
    // statuses so the parent can see the full history.
    const classGroups = new Map<string, any[]>();
    allAssignmentDocs.forEach(doc => {
      // On the current cycle skip completed — only visible in past records.
      if (cycleOffset === 0 && doc.status === 'completed') return;
      const key = `${doc.subject}::${doc.parentName || ''}`;
      if (!classGroups.has(key)) classGroups.set(key, []);
      classGroups.get(key)!.push(doc);
    });

    // If the parent has ONLY completed classes, fall back to showing them on the
    // current view rather than showing a blank screen.
    if (classGroups.size === 0 && cycleOffset === 0) {
      allAssignmentDocs.forEach(doc => {
        const key = `${doc.subject}::${doc.parentName || ''}`;
        if (!classGroups.has(key)) classGroups.set(key, []);
        classGroups.get(key)!.push(doc);
      });
    }

    // Sort every group chronologically ascending so index 0 = oldest assignment.
    classGroups.forEach(groupDocs => {
      groupDocs.sort((a, b) => {
        const dateA = (a.startDate || '').split('T')[0];
        const dateB = (b.startDate || '').split('T')[0];
        if (dateA && dateB) return dateA.localeCompare(dateB);
        return (a.createdAt?._seconds || 0) - (b.createdAt?._seconds || 0);
      });
    });

    const now = new Date();

    // minCycleOffset is computed from ALL assignments (same subject::parentName key,
    // all statuses) so "Previous Cycle" navigation reaches the full history.
    const allGroupsForHistory = new Map<string, any[]>();
    allAssignmentDocs.forEach(doc => {
      const key = `${doc.subject}::${doc.parentName || ''}`;
      if (!allGroupsForHistory.has(key)) allGroupsForHistory.set(key, []);
      allGroupsForHistory.get(key)!.push(doc);
    });
    const maxCycles = Math.max(...Array.from(allGroupsForHistory.values()).map(g => g.length), 1);
    const minCycleOffset = -(maxCycles - 1);

    // For the requested cycleOffset (0 = current/latest, -1 = previous assignment, etc.),
    // pick the exact assignment document and derive its start and end window directly from the assignments.
    const classesWithCycle: any[] = [];
    classGroups.forEach(groupDocs => {
      const latestIndex = groupDocs.length - 1;
      const targetIndex = latestIndex + cycleOffset;

      if (targetIndex >= 0 && targetIndex <= latestIndex) {
        const assignment = groupDocs[targetIndex];
        const startStr = (assignment.startDate || '').split('T')[0] || toDateStr(now);

        let endStr: string;
        let label: string;

        if (targetIndex < latestIndex) {
          // Completed past cycle: end is the start date of the NEXT assignment
          const nextStartStr = (groupDocs[targetIndex + 1].startDate || '').split('T')[0];
          if (nextStartStr) {
            endStr = nextStartStr;
            label = formatCycleLabel(startStr, endStr);
          } else {
            const sDate = new Date(startStr);
            sDate.setMonth(sDate.getMonth() + 1);
            endStr = toDateStr(sDate);
            label = formatCycleLabel(startStr, endStr);
          }
        } else {
          // Current / latest assignment cycle: continues until marked completed
          const sDate = new Date(startStr);
          const nominalEnd = new Date(sDate);
          nominalEnd.setMonth(nominalEnd.getMonth() + 1);
          const nominalEndStr = toDateStr(nominalEnd);
          // Query allows ongoing sessions while active
          const queryEnd = new Date(Math.max(nominalEnd.getTime(), now.getTime() + 86400000 * 60));
          endStr = toDateStr(queryEnd);
          label = formatCycleLabel(startStr, nominalEndStr);
        }

        classesWithCycle.push({
          ...assignment,
          cycle: { startStr, endStr, label },
        });
      } else {
        // Offset extends beyond existing assignment records: step backwards from the oldest assignment
        const oldestAssignment = groupDocs[0];
        const oldestStart = (oldestAssignment.startDate || '').split('T')[0] || toDateStr(now);
        const sDate = new Date(oldestStart);
        sDate.setMonth(sDate.getMonth() + (targetIndex)); // targetIndex is negative
        const eDate = new Date(sDate);
        eDate.setMonth(eDate.getMonth() + 1);

        const startStr = toDateStr(sDate);
        const endStr = toDateStr(eDate);
        const label = formatCycleLabel(startStr, endStr);

        classesWithCycle.push({
          ...oldestAssignment,
          cycle: { startStr, endStr, label },
        });
      }
    });

    // Resolve Student & Parent Names:
    const resolvedStudentName =
      parentDocStudent ||
      classesWithCycle.find(a => a.studentName)?.studentName ||
      classesWithCycle[0]?.parentName ||
      '';

    const parentName = (parentDocName && parentDocName.toLowerCase() !== resolvedStudentName.toLowerCase())
      ? parentDocName
      : 'Parent';

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
      status: a.status || 'active',
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
      minCycleOffset,
    });
  } catch (err) {
    console.error('Parent attendance report error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}