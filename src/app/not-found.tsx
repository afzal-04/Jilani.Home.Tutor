// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#F59E0B', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '460px', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '10px',
          fontWeight: 700,
          textDecoration: 'none'
        }}
      >
        Return to Home Page
      </Link>
    </div>
  );
}
