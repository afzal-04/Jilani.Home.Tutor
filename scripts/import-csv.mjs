// scripts/import-csv.mjs
// Built from your actual Google Form CSV — 19 parent records
//
// HOW TO RUN:
//   1. npm install csv-parse firebase-admin
//   2. Firebase Console → Project Settings → Service Accounts
//      → Generate new private key → save as scripts/serviceAccount.json
//   3. Save your CSV as scripts/parents.csv
//   4. node scripts/import-csv.mjs

import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const csvFile = readFileSync('./scripts/parents.csv', 'utf-8');
const rows = parse(csvFile, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  relax_column_count: true,
});

console.log(`\n📋 Found ${rows.length} records in CSV\n`);

// Find column by partial match — handles spaces/newlines in headers
function col(row, ...partials) {
  for (const partial of partials) {
    const key = Object.keys(row).find(k =>
      k.toLowerCase().replace(/\s+/g, ' ').includes(partial.toLowerCase())
    );
    if (key && row[key]?.trim()) return row[key].trim();
  }
  return '';
}

function extractArea(fullAddress) {
  if (!fullAddress) return '';
  const parts = fullAddress.split(',');
  return parts[parts.length - 3]?.trim() || parts[0]?.trim() || fullAddress;
}

function cleanPhone(phone) {
  return phone?.replace(/\s+/g, '').replace(/[^0-9+]/g, '') || '';
}

function normaliseStatus(raw) {
  const s = (raw || '').toLowerCase();
  if (s === 'active')   return 'converted';
  if (s === 'inactive') return 'contacted';
  return 'new';
}

function normaliseSource(raw) {
  const s = (raw || '').toLowerCase();
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('google'))    return 'google';
  if (s.includes('whatsapp'))  return 'whatsapp';
  if (s.includes('friend') || s.includes('relative')) return 'referral';
  if (s.includes('isha') || s.includes('mam')) return 'referral';
  return 'other';
}

function mapRow(row) {
  const phone    = cleanPhone(col(row, 'Phone Number'));
  const whatsapp = cleanPhone(col(row, 'WhatsApp Number'));
  const address  = col(row, 'Full Address');

  return {
    name:          col(row, 'Parent Name'),
    phone:         phone,
    whatsapp:      whatsapp && whatsapp !== 'No' && whatsapp !== phone ? whatsapp : phone,
    email:         col(row, 'Email address', 'Email ID'),
    address:       address,
    area:          extractArea(address),
    studentName:   col(row, 'Student Full Name'),
    studentAge:    col(row, 'Age'),
    studentGender: col(row, 'Gender'),
    class:         col(row, 'Class / Grade'),
    school:        col(row, 'School Name'),
    board:         col(row, 'Board'),
    subject:       col(row, 'Subjects Required'),
    preferredTeacherGender: col(row, 'Preferred Teacher Gender'),
    timeSlot:      col(row, 'Preferred Time Slot'),
    daysPerWeek:   col(row, 'Days per Week'),
    duration:      col(row, 'Duration per Class'),
    specialNote:   col(row, 'special preference'),
    wantsDemo:     col(row, 'free demo'),
    preferredContact: col(row, 'Preferred Communication'),
    feesParent:    col(row, 'Fees Parent') || '',
    feesTutor:     col(row, 'Fees Tutor')  || '',
    source:        normaliseSource(col(row, 'How did you hear')),
    status:        normaliseStatus(col(row, 'Status')),
    originalTimestamp: col(row, 'Timestamp'),
    dataSource:    'google_form_import',
    importedAt:    admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function importAll() {
  let batch   = db.batch();
  let count   = 0;
  let skipped = 0;

  for (const row of rows) {
    const data = mapRow(row);
    if (!data.name && !data.phone) { skipped++; continue; }
    const ref = db.collection('parents').doc();
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
  console.log(`✅ Imported : ${count}`);
  console.log(`⏭️  Skipped  : ${skipped}`);
  console.log('─────────────────────────────────\n');

  // Preview
  const preview = await db.collection('parents')
    .where('dataSource', '==', 'google_form_import')
    .limit(5).get();
  console.log('First 5 imported records:');
  preview.forEach(doc => {
    const d = doc.data();
    console.log(`  • ${d.name} | ${d.phone} | ${d.area} | Class ${d.class} | ${d.status} | source: ${d.source}`);
  });
}

await importAll();
