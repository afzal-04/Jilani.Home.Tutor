// src/app/api/tutor-lead/route.ts
// Receives new tutor leads from Google Apps Script

import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';

const SECRET = process.env.LEAD_API_SECRET;

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-api-secret');
    if (SECRET && secret !== SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const data = {
      name:           body.name           || '',
      phone:          cleanPhone(body.phone || ''),
      gender:         body.gender         || '',
      age:            body.age            || '',
      email:          body.email          || '',
      address:        body.address        || '',
      area:           body.area           || '',
      qualification:  body.qualification  || '',
      college:        body.college        || '',
      graduationYear: body.graduationYear || '',
      specialSkills:  body.specialSkills  || '',
      subjects:       body.subjects       || '',
      classes:        body.classes        || '',
      timeSlots:      body.timeSlots      || '',
      expectedFee:    body.expectedFee    || '',
      experience:     body.experience     || '',
      whyJoin:        body.whyJoin        || '',
      source:         normaliseSource(body.source || ''),
      status:         'new',
      dataSource:     'google_form_live',
      createdAt:      serverTimestamp(),
    };

    if (!data.name && !data.phone) {
      return NextResponse.json({ error: 'Empty record' }, { status: 400 });
    }

    const db  = getDbInstance();
    const ref = await addDoc(collection(db, 'tutors'), data);

    console.log(`New tutor lead: ${data.name} | ${data.phone}`);
    return NextResponse.json({ ok: true, id: ref.id });

  } catch (error) {
    console.error('Tutor lead error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function cleanPhone(phone: string) {
  const first = phone.split(',')[0].split('/')[0];
  return first.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
}

function normaliseSource(raw: string) {
  const s = raw.toLowerCase();
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('facebook'))  return 'facebook';
  if (s.includes('whatsapp'))  return 'whatsapp';
  if (s.includes('friend') || s.includes('reference')) return 'referral';
  if (s.includes('google'))    return 'google';
  return 'other';
}
