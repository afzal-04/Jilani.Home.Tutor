// src/app/api/attendance/history/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

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

    // Current month range as YYYY-MM-DD strings — works with Firestore's
    // lexicographic ordering since dates are stored in ISO format.
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`;

    const snap = await db.collection('attendance')
      .where('tutorName', '==', tutorName)
      .where('date', '>=', monthStart)
      .where('date', '<', monthEnd)
      .get();

    const records = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .sort((a, b) => b.date.localeCompare(a.date)); // most recent first

    // Group by student+subject for a per-student summary
    const summaryMap: Record<string, { studentName: string; subject: string; present: number; absent: number; holiday: number; cancelled: number; total: number }> = {};
    records.forEach(r => {
      const key = `${r.studentName}::${r.subject}`;
      if (!summaryMap[key]) summaryMap[key] = { studentName: r.studentName, subject: r.subject, present: 0, absent: 0, holiday: 0, cancelled: 0, total: 0 };
      summaryMap[key][r.status as 'present' | 'absent' | 'holiday' | 'cancelled']++;
      summaryMap[key].total++;
    });

    return NextResponse.json({
      tutorName,
      monthLabel: now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      records: records.map(r => ({ id: r.id, studentName: r.studentName, subject: r.subject, classLevel: r.classLevel, date: r.date, status: r.status })),
      summary: Object.values(summaryMap),
    });
  } catch (err) {
    console.error('Attendance history error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}