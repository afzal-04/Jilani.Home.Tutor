// src/lib/firebaseAdmin.ts
//
// Server-only. Never import this from a 'use client' file or a client
// component — it uses the Admin SDK, which has full read/write access
// bypassing all Firestore Security Rules. It must only ever run inside
// API routes (src/app/api/**/route.ts) or Server Components.

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Service account keys have literal \n in the JSON; env vars need it re-escaped
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const getAdminDb = () => getFirestore(getAdminApp());