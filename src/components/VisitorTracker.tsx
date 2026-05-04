'use client';
// src/components/VisitorTracker.tsx

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisit } from '@/lib/firestore';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only count real visitors — skip /admin and /find-tutor internal pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/find-tutor')) return;
    trackVisit();
  }, [pathname]);

  return null;
}