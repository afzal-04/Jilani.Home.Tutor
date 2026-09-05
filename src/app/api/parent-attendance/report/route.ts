// src/app/api/parent-attendance/report/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getCurrentCycle } from '../../../../lib/attendanceCycle';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }
    const cleaned = phone.trim();
    const db = getAdminDb();

    // 1) Verify the parent exists — this is the ONLY thing that identifies the caller.
    const parentSnap = await db.collection('parents').where('phone', '==', cleaned).limit(1).get();
    if (parentSnap.empty) {
      return NextResponse.json({ error: 'No parent found with that phone number' }, { status: 404 });
    }
    const parentData = parentSnap.docs[0].data();
    const parentName = (parentData.name || parentData.studentName || '') as string;

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

    const now = new Date();

    // Each class gets its OWN cycle window, anchored to its own startDate —
    // not a shared calendar month across every class.
    const classesWithCycle = classesRaw.map(a => ({ ...a, cycle: getCurrentCycle(a.startDate, now) }));

    const classes = classesWithCycle.map(a => ({
      id: a.id, tutorName: a.tutorName, tutorPhone: a.tutorPhone || '', subject: a.subject, classLevel: a.classLevel,
      classesPerWeek: a.classesPerWeek, studentName: a.parentName,
      startDate: a.startDate || '', area: a.area || '', cycleLabel: a.cycle.label,
    }));

    const studentNames = Array.from(new Set(classesRaw.map(a => a.parentName as string)));

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

    // 4) This month's fee status per child/subject — amount owed and
    //    payment status ONLY. Deliberately never selecting tutorFee or
    //    profit here; a parent should never see what the tutor is paid.
    //    Fees stay tied to the CALENDAR month (not the tuition cycle),
    //    since that's how fee records are actually generated in the CRM
    //    ("Start New Month" creates one fee doc per calendar month).
    const feeMonthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    const feeSnaps = await Promise.all(studentNames.map(name =>
      db.collection('fees').where('parentName', '==', name).where('month', '==', feeMonthLabel).get()
    ));
    const fees = feeSnaps.flatMap(snap => snap.docs).map(d => {
      const data = d.data();
      return {
        studentName: data.parentName as string,
        tutorName: data.tutorName as string,
        subject: data.subject as string,
        amount: data.parentFee as number,
        status: data.paymentStatus as string,
        month: data.month as string,
      };
    });

    return NextResponse.json({
      parentName,
      classes,
      cycleLabel,
      feeMonthLabel,
      records: records.map(r => ({ id: r.id, studentName: r.studentName, tutorName: r.tutorName, subject: r.subject, classLevel: r.classLevel, date: r.date, status: r.status, sessionDuration: r.sessionDuration || 1 })),
      summary: Object.values(summaryMap),
      fees,
    });
  } catch (err) {
    console.error('Parent attendance report error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}