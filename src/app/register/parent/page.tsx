'use client';
// src/app/register/parent/page.tsx

import Link from 'next/link';

const PARENT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeaNy5RkMb-MOTuF_zfAseY02_DE3XeWrro1B8-_w8v-ohMGQ/viewform';
const PARENT_FORM_EMBED_URL = `${PARENT_FORM_URL}?embedded=true`;

function ScrollToFormButton({ label, style }: { label: string; style?: React.CSSProperties }) {
  return (
    <a
      href="#registration-form"
      style={{
        display: 'inline-block', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15,
        color: '#0A0F1E', background: 'linear-gradient(135deg, oklch(0.9 0.14 88) 0%, oklch(0.82 0.17 78) 100%)',
        textDecoration: 'none', boxShadow: '0 12px 30px -10px oklch(0.78 0.17 75 / 0.6)',
        ...style,
      }}
    >
      {label}
    </a>
  );
}

export default function ParentRegistrationPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, oklch(0.15 0.03 265) 0%, oklch(0.11 0.03 265) 55%, oklch(0.14 0.04 260) 100%)',
        padding: '20px 20px 64px',
      }}>
        <div aria-hidden style={{ position: 'absolute', left: -80, top: -80, height: 280, width: 280, borderRadius: '50%', background: 'oklch(0.58 0.19 258 / 0.35)', filter: 'blur(60px)' }} />
        <div aria-hidden style={{ position: 'absolute', right: -80, bottom: -100, height: 320, width: 320, borderRadius: '50%', background: 'oklch(0.78 0.17 75 / 0.18)', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <img src="/logo.png" alt="Jilani Home Tutor" style={{ height: 34, width: 'auto' }} />
          <Link href="/" style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8 }}>← Back to Website</Link>
        </div>

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '.1em', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 100, marginBottom: 20 }}>
            <span style={{ height: 6, width: 6, borderRadius: '50%', background: 'oklch(0.78 0.17 75)' }} />
            Trusted by families across Raipur
          </span>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 14px' }}>
            Right Tutor, Bright Future
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 28px' }}>
            Register in under 2 minutes and we'll match your child with a verified home tutor.
          </p>
          <ScrollToFormButton label="Register My Child →" />

          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
            {[['1000+', 'Students Taught'], ['4.8★', 'Parent Rating'], ['24hr', 'Response Time']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form section ── */}
      <div id="registration-form" style={{ maxWidth: 760, margin: '0 auto', padding: '48px 16px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Register Your Child</h2>
          <p style={{ fontSize: 13.5, color: '#6B7280', margin: 0 }}>Takes less than 2 minutes. No payment required to register.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #eef1f5', overflow: 'hidden', padding: 8, boxShadow: '0 30px 60px -35px rgba(0,0,0,.25)' }}>
          <iframe
            src={PARENT_FORM_EMBED_URL}
            width="100%"
            height={900}
            style={{ border: 'none', display: 'block', maxWidth: '100%', borderRadius: 14 }}
            title="Parent Registration Form"
          >
            Loading…
          </iframe>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 14 }}>
          🔒 Your information is safe with us · Form not loading? <a href={PARENT_FORM_URL} target="_blank" rel="noreferrer" style={{ color: '#1A6FBF', fontWeight: 600, textDecoration: 'none' }}>Open in a new tab →</a>
        </p>
      </div>

      {/* ── Footer trust strip ── */}
      <div style={{ background: '#F7F9FC', borderTop: '1px solid #eef1f5', padding: '24px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>
          Have questions before registering? <a href="/" style={{ color: '#1A6FBF', fontWeight: 700, textDecoration: 'none' }}>Visit our website</a> or reach out directly — we're happy to help you find the right tutor.
        </p>
      </div>
    </div>
  );
}