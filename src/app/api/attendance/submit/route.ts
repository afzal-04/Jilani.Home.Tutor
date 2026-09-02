// src/app/api/attendance/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

const VALID_STATUSES = ['present', 'absent', 'holiday', 'cancelled'];

function today(): string {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: NextRequest) {
  try {
    const { phone, selections } = await req.json();
    if (!phone || typeof phone !== 'string' || !selections || typeof selections !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const cleaned = phone.trim();
    const db = getAdminDb();

    // 1) Re-verify the tutor — never trust a tutor name sent from the client.
    const tutorSnap = await db.collection('tutors').where('phone', '==', cleaned).limit(1).get();
    if (tutorSnap.empty) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }
    const tutorName = tutorSnap.docs[0].data().name as string;

    // 2) Re-fetch THIS tutor's actual active assignments server-side — the only
    //    valid targets for a write. A client can't submit attendance for an
    //    assignment that isn't really theirs, no matter what assignmentId it sends.
    const aSnap = await db.collection('classes')
      .where('tutorPhone', '==', cleaned)
      .where('status', '==', 'active')
      .get();
    const validAssignments = new Map(aSnap.docs.map(d => [d.id, { id: d.id, ...d.data() } as any]));

    // 3) Existing attendance today, so we update instead of duplicating
    const attSnap = await db.collection('attendance')
      .where('tutorName', '==', tutorName)
      .where('date', '==', today())
      .get();
    const existingByKey = new Map<string, string>(); // "parentName::subject" -> doc id
    attSnap.docs.forEach(d => {
      const data = d.data();
      existingByKey.set(`${data.studentName}::${data.subject}`, d.id);
    });

    const results: { assignmentId: string; ok: boolean }[] = [];

    for (const [assignmentId, status] of Object.entries(selections)) {
      const a = validAssignments.get(assignmentId);
      if (!a) { results.push({ assignmentId, ok: false }); continue; } // not really this tutor's assignment — skip
      if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) { results.push({ assignmentId, ok: false }); continue; }

      const key = `${a.parentName}::${a.subject}`;
      const existingId = existingByKey.get(key);

      if (existingId) {
        await db.collection('attendance').doc(existingId).update({ status });
      } else {
        await db.collection('attendance').add({
          studentName: a.parentName,
          tutorName: a.tutorName,
          subject: a.subject,
          classLevel: a.classLevel,
          date: today(),          // always server's today — a client can't backdate/forward-date
          status,
          sessionDuration: a.hoursPerSession || 1,
          notes: '',
          createdAt: new Date(),
        });
      }
      results.push({ assignmentId, ok: true });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('Attendance submit error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}