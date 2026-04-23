'use client';
// src/components/WhatsappButton.tsx
import { useEffect, useState } from 'react';
import { getSiteConfig } from '@/lib/firestore';
import styles from './WhatsappButton.module.css';

export default function WhatsappButton() {
  const [href, setHref] = useState('https://wa.me/917999854628');

  useEffect(() => {
    getSiteConfig().then(cfg => {
      if (cfg?.whatsappNumber) setHref(`https://wa.me/${cfg.whatsappNumber}`);
    });
  }, []);

  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.btn} aria-label="Chat on WhatsApp">
      💬
    </a>
  );
}
