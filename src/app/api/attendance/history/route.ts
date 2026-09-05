// src/app/api/attendance/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getCurrentCycle } from '@/lib/attendanceCycle';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }
    const cleaned = phone.trim();
    const db = getAdminDb();

    // Re-verify tutor identity — same pattern as lookup/submit, never trust a
    // tutor name sent from the client.
    const tutorSnap = await db.collection('tutors').where('phone', '==', cleaned).limit(1).get();
    if (tutorSnap.empty) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }
    const tutorName = tutorSnap.docs[0].data().name as string;

    // Fetch this tutor's active assignments so we know each class's own
    // start date — that's what the billing cycle is anchored to, not the
    // calendar month.
    const aSnap = await db.collection('classes')
      .where('tutorPhone', '==', cleaned)
      .where('status', '==', 'active')
      .get();

    const seen = new Set<string>();
    const classesRaw = aSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter(a => {
        const key = `${a.parentName}::${a.subject}::${a.tutorName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const now = new Date();
    const classesWithCycle = classesRaw.map(a => ({ ...a, cycle: getCurrentCycle(a.startDate, now) }));

    // Query attendance per DISTINCT cycle window for this tutor (several
    // classes may share an identical window and reuse one query).
    const uniqueCycleQueries = new Map<string, { startStr: string; endStr: string }>();
    classesWithCycle.forEach(a => {
      const key = `${a.cycle.startStr}::${a.cycle.endStr}`;
      if (!uniqueCycleQueries.has(key)) uniqueCycleQueries.set(key, { startStr: a.cycle.startStr, endStr: a.cycle.endStr });
    });

    const attResults = await Promise.all(Array.from(uniqueCycleQueries.values()).map(async q => {
      const snap = await db.collection('attendance')
        .where('tutorName', '==', tutorName)
        .where('date', '>=', q.startStr)
        .where('date', '<', q.endStr)
        .get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    }));
    const allAttendanceDocs = new Map<string, any>();
    attResults.flat().forEach(doc => allAttendanceDocs.set(doc.id, doc));

    // Attribute each attendance doc to its matching class (student + subject
    // + falling inside THAT class's own cycle window) — this is what makes
    // sessions from before the 1st of the calendar month (but after the
    // class's actual start date) count correctly instead of being cut off.
    const records: any[] = [];
    classesWithCycle.forEach(a => {
      const matches = Array.from(allAttendanceDocs.values()).filter(doc =>
        doc.studentName === a.parentName && doc.subject === a.subject &&
        doc.date >= a.cycle.startStr && doc.date < a.cycle.endStr
      );
      matches.forEach(doc => records.push(doc));
    });
    // Dedupe (shouldn't normally happen, but a doc id could theoretically match twice)
    const uniqueRecords = Array.from(new Map(records.map(r => [r.id, r])).values())
      .sort((a, b) => b.date.localeCompare(a.date));

    // Overall label: if every active class shares the same cycle, show that
    // range; otherwise (mixed start dates), use a neutral label.
    const distinctLabels = new Set(classesWithCycle.map(a => a.cycle.label));
    const monthLabel = distinctLabels.size === 1
      ? Array.from(distinctLabels)[0]
      : (distinctLabels.size === 0 ? now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Current Billing Cycle');

    return NextResponse.json({
      tutorName,
      monthLabel,
      records: uniqueRecords.map(r => ({ id: r.id, studentName: r.studentName, subject: r.subject, classLevel: r.classLevel, date: r.date, status: r.status, notes: r.notes || '', sessionDuration: r.sessionDuration || 1 })),
    });
  } catch (err) {
    console.error('Attendance history error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}