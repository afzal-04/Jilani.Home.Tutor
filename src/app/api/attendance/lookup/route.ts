// src/app/api/attendance/lookup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }
    const cleaned = phone.trim();
    const db = getAdminDb();

    // 1) Verify the tutor exists — this is the ONLY thing that identifies the caller.
    const tutorSnap = await db.collection('tutors').where('phone', '==', cleaned).limit(1).get();
    if (tutorSnap.empty) {
      return NextResponse.json({ error: 'No tutor found with that phone number' }, { status: 404 });
    }
    const tutorDoc = tutorSnap.docs[0];
    const tutorName = tutorDoc.data().name as string;

    // 2) Fetch their active assignments, server-side, deduped by student+subject+tutor
    //    so a stray duplicate assignment record can't show two cards for one class.
    const aSnap = await db.collection('classes')
      .where('tutorPhone', '==', cleaned)
      .where('status', '==', 'active')
      .get();

    const seen = new Set<string>();
    const assignments = aSnap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter(a => {
        const key = `${a.parentName}::${a.subject}::${a.tutorName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map(a => ({
        id: a.id,
        parentName: a.parentName,
        subject: a.subject,
        classLevel: a.classLevel,
        tutorName: a.tutorName,
        hoursPerSession: a.hoursPerSession || 1,
      }));

    // 3) Any attendance already marked today for this tutor
    const attSnap = await db.collection('attendance')
      .where('tutorName', '==', tutorName)
      .where('date', '==', today())
      .get();

    const existing: Record<string, { id: string; status: string; notes: string }> = {};
    attSnap.docs.forEach(d => {
      const data = d.data();
      const match = assignments.find(a => a.parentName === data.studentName && a.subject === data.subject);
      if (match) existing[match.id] = { id: d.id, status: data.status, notes: data.notes || '' };
    });

    return NextResponse.json({ tutorName, assignments, existing });
  } catch (err) {
    console.error('Attendance lookup error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}