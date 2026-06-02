// src/app/api/lead/route.ts
// Receives new parent leads from Google Apps Script
// Every new Google Form submission auto-hits this endpoint

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
      name:           body.parentName        || body.name    || '',
      phone:          cleanPhone(body.phone  || ''),
      whatsapp:       cleanPhone(body.whatsapp || body.phone || ''),
      email:          body.email             || '',
      address:        body.address           || '',
      area:           extractArea(body.address || ''),
      studentName:    body.studentName       || '',
      studentAge:     body.age               || '',
      studentGender:  body.gender            || '',
      class:          body.class             || body.grade   || '',
      school:         body.school            || '',
      board:          body.board             || '',
      subject:        body.subject           || body.subjects || '',
      preferredTeacherGender: body.preferredTeacherGender || '',
      timeSlot:       body.timeSlot          || '',
      daysPerWeek:    body.daysPerWeek       || '',
      duration:       body.duration          || '',
      specialNote:    body.specialNote       || '',
      wantsDemo:      body.wantsDemo         || 'Yes',
      preferredContact: body.preferredContact || '',
      source:         normaliseSource(body.source || ''),
      status:         'new',
      dataSource:     'google_form_live',
      createdAt:      serverTimestamp(),
    };

    if (!data.name && !data.phone) {
      return NextResponse.json({ error: 'Empty record' }, { status: 400 });
    }

    const db  = getDbInstance();
    const ref = await addDoc(collection(db, 'parents'), data);

    console.log(`New lead: ${data.name} | ${data.phone}`);
    return NextResponse.json({ ok: true, id: ref.id });

  } catch (error) {
    console.error('Lead import error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function cleanPhone(phone: string) {
  return phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
}

function extractArea(address: string) {
  if (!address) return '';
  const parts = address.split(',');
  return parts[parts.length - 3]?.trim() || parts[0]?.trim() || address;
}

function normaliseSource(raw: string) {
  const s = raw.toLowerCase();
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('google'))    return 'google';
  if (s.includes('whatsapp'))  return 'whatsapp';
  if (s.includes('friend') || s.includes('relative')) return 'referral';
  return 'other';
}
