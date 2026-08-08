// src/app/api/tutor-lead/route.ts
// Receives new tutor leads from Google Apps Script

import { NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';

const SECRET = process.env.LEAD_API_SECRET;

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-api-secret');
    if (SECRET) {
      if (!secret || secret !== SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();

    const data = {
      name:           String(body.name || ''),
      phone:          cleanPhone(body.phone),
      gender:         String(body.gender || ''),
      age:            String(body.age || ''),
      email:          String(body.email || ''),
      address:        String(body.address || ''),
      area:           String(body.area || ''),
      qualification:  String(body.qualification || ''),
      college:        String(body.college || ''),
      graduationYear: String(body.graduationYear || ''),
      specialSkills:  String(body.specialSkills || ''),
      subjects:       String(body.subjects || ''),
      classes:        String(body.classes || ''),
      timeSlots:      String(body.timeSlots || ''),
      expectedFee:    String(body.expectedFee || ''),
      experience:     String(body.experience || ''),
      whyJoin:        String(body.whyJoin || ''),
      source:         normaliseSource(String(body.source || '')),
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

function cleanPhone(phone: any) {
  const str = String(phone || '');
  const first = str.split(',')[0].split('/')[0];
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
