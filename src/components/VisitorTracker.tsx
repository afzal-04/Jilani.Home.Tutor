'use client';
// src/components/VisitorTracker.tsx
// Paste this as a NEW file. Then add <VisitorTracker /> to layout.tsx (see Step 3).

import { useEffect } from 'react';
import { trackVisit } from '@/lib/firestore';

export default function VisitorTracker() {
  useEffect(() => {
    trackVisit(); // fire-and-forget, errors are caught inside trackVisit
  }, []);

  return null; // renders nothing visible
}
