// scripts/import-tutors.mjs
// Built from your actual Tutor Google Form CSV
//
// HOW TO RUN:
//   1. Save your tutor CSV as scripts/tutors.csv
//   2. node scripts/import-tutors.mjs

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const csvFile = readFileSync('./scripts/tutors.csv', 'utf-8');
const rows = parse(csvFile, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_column_count: true,
});

console.log(`\n📋 Found ${rows.length} tutor records in CSV\n`);

// Find column by partial match
function col(row, ...partials) {
  for (const partial of partials) {
    const key = Object.keys(row).find(k =>
      k.toLowerCase().replace(/\s+/g, ' ').includes(partial.toLowerCase())
    );
    if (key && row[key]?.trim()) return row[key].trim();
  }
  return '';
}

function cleanPhone(phone) {
  if (!phone) return '';
  // Handle multiple numbers like "8319481320 , 9202257940" — take first
  const first = phone.split(',')[0].split('/')[0];
  return first.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
}

function normaliseSource(raw) {
  const s = (raw || '').toLowerCase();
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('facebook'))  return 'facebook';
  if (s.includes('whatsapp'))  return 'whatsapp';
  if (s.includes('friend') || s.includes('reference')) return 'referral';
  if (s.includes('google'))    return 'google';
  return 'other';
}

function normaliseExperience(raw) {
  if (!raw) return '0';
  const s = raw.toLowerCase();
  if (s.includes('6 month') || s.includes('0 - 6')) return '0-6 months';
  if (s.includes('1 year') || s === '1') return '1 year';
  if (s.includes('2')) return '2+ years';
  if (s.includes('3') || s.includes('4') || s.includes('5')) return '3-5 years';
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('8+')) return '6+ years';
  if (s.toLowerCase().includes('running') || s.toLowerCase().includes('currently')) return '5+ years';
  return raw;
}

function mapRow(row) {
  const phone = cleanPhone(col(row, 'Contact Number'));

  return {
    // Core fields (match existing TutorLead interface)
    name:          col(row, 'Full Name'),
    phone:         phone,
    gender:        col(row, 'Gender'),
    area:          col(row, 'Area / Location'),
    qualification: col(row, 'Highest Qualification', 'Qualification'),
    subjects:      col(row, 'Subjects You Can Teach', 'Subjects'),
    classes:       col(row, 'Classes You Can Teach', 'Classes'),
    status:        'new',

    // Extra rich fields
    age:           col(row, 'Age'),
    email:         col(row, 'Email ID', 'Email'),
    address:       col(row, 'Full Address'),
    college:       col(row, 'Name of College', 'College'),
    graduationYear: col(row, 'Year of Graduation'),
    specialSkills: col(row, 'Special Training', 'skills'),
    timeSlots:     col(row, 'Available Time Slots'),
    expectedFee:   col(row, 'Expected Fee'),
    experience:    normaliseExperience(col(row, 'Teaching Experience')),
    resumeLink:    col(row, 'resume or CV'),
    photoLink:     col(row, 'Recent Photo'),
    whyJoin:       col(row, 'Why do you want'),
    source:        normaliseSource(col(row, 'How Did You Hear')),

    // Meta
    dataSource:    'google_form_import',
    originalTimestamp: col(row, 'Timestamp'),
    createdAt:     admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function importAll() {
  let batch   = db.batch();
  let count   = 0;
  let skipped = 0;

  for (const row of rows) {
    const data = mapRow(row);
    if (!data.name && !data.phone) { skipped++; continue; }
    const ref = db.collection('tutors').doc();
    batch.set(ref, data);
    count++;
    if (count % 400 === 0) {
      await batch.commit();
      console.log(`  ✓ Committed ${count} records...`);
      batch = db.batch();
    }
  }

  if (count % 400 !== 0) await batch.commit();

  console.log('\n─────────────────────────────────');
  console.log(`✅ Imported : ${count} tutors`);
  console.log(`⏭️  Skipped  : ${skipped}`);
  console.log('─────────────────────────────────\n');

  // Preview
  const preview = await db.collection('tutors')
    .where('dataSource', '==', 'google_form_import')
    .limit(5).get();
  console.log('First 5 imported tutors:');
  preview.forEach(doc => {
    const d = doc.data();
    console.log(`  • ${d.name} | ${d.phone} | ${d.area} | ${d.subjects?.substring(0,30)} | ${d.experience} | source: ${d.source}`);
  });
}

await importAll();
