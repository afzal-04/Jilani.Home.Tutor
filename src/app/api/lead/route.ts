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
    if (SECRET) {
      if (!secret || secret !== SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();

    const data = {
      name:           String(body.parentName || body.name || ''),
      phone:          cleanPhone(body.phone),
      whatsapp:       cleanPhone(body.whatsapp || body.phone),
      email:          String(body.email || ''),
      address:        String(body.address || ''),
      area:           extractArea(String(body.address || '')),
      studentName:    String(body.studentName || ''),
      studentAge:     String(body.age || ''),
      studentGender:  String(body.gender || ''),
      class:          String(body.class || body.grade || ''),
      school:         String(body.school || ''),
      board:          String(body.board || ''),
      subject:        String(body.subject || body.subjects || ''),
      preferredTeacherGender: String(body.preferredTeacherGender || ''),
      timeSlot:       String(body.timeSlot || ''),
      daysPerWeek:    String(body.daysPerWeek || ''),
      duration:       String(body.duration || ''),
      specialNote:    String(body.specialNote || ''),
      wantsDemo:      String(body.wantsDemo || 'Yes'),
      preferredContact: String(body.preferredContact || ''),
      source:         normaliseSource(String(body.source || '')),
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

function cleanPhone(phone: any) {
  const str = String(phone || '');
  return str.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
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
