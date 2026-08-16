'use client';
// src/app/error.tsx
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: '#090D16',
      color: '#FFFFFF'
    }}>
      <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#EF4444', marginBottom: '16px' }}>500</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Something went wrong!</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '460px', marginBottom: '24px' }}>
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => reset()}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
