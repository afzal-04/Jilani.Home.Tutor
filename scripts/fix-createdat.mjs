// scripts/fix-createdat.mjs
// Adds createdAt to all imported records that are missing it
// Run once: node scripts/fix-createdat.mjs

import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function fix() {
  // Get all parents that were imported but have no createdAt
  const snap = await db.collection('parents')
    .where('dataSource', '==', 'google_form_import')
    .get();

  console.log(`Found ${snap.size} imported records to fix...`);

  let batch = db.batch();
  let count = 0;

  snap.forEach(doc => {
    const data = doc.data();
    // Use importedAt as createdAt, or fallback to now
    batch.update(doc.ref, {
      createdAt: data.importedAt || admin.firestore.FieldValue.serverTimestamp(),
    });
    count++;
  });

  await batch.commit();
  console.log(`✅ Fixed ${count} records — refresh your admin page!`);
}

await fix();
