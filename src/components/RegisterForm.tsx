'use client';
// src/components/RegisterForm.tsx
import { useState } from 'react';
import { registerParent } from '@/lib/firestore';
import { isValidIndianMobile, cleanPhoneForStorage } from '@/lib/phone';
import { PARENT_CLASSES, PARENT_SUBJECTS, RAIPUR_AREAS } from '@/sections/Register';

interface RegisterFormProps {
  defaultClass?: string;
  defaultSubject?: string;
  defaultArea?: string;
  pageSource?: string;
}

export default function RegisterForm({
  defaultClass = '',
  defaultSubject = '',
  defaultArea = '',
  pageSource = 'Landing Page',
}: RegisterFormProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: defaultArea,
    class: defaultClass,
    subject: defaultSubject,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isValidIndianMobile(form.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await registerParent({
        ...form,
        phone: cleanPhoneForStorage(form.phone),
        source: pageSource,
      });
      setSuccess(true);
      setForm({ name: '', phone: '', area: defaultArea, class: defaultClass, subject: defaultSubject });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-group">
        <label htmlFor="rf-name" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Parent / Guardian Name *</label>
        <input
          id="rf-name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, color: '#FFFFFF', fontSize: 14 }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rf-phone" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Mobile Phone Number *</label>
        <input
          id="rf-phone"
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, color: '#FFFFFF', fontSize: 14 }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="rf-area" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Area / Locality in Raipur *</label>
        <select
          id="rf-area"
          value={form.area}
          onChange={e => setForm({ ...form, area: e.target.value })}
          required
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, color: '#FFFFFF', fontSize: 14 }}
        >
          <option value="">Select Locality</option>
          {RAIPUR_AREAS.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="form-group">
          <label htmlFor="rf-class" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Class *</label>
          <select
            id="rf-class"
            value={form.class}
            onChange={e => setForm({ ...form, class: e.target.value })}
            required
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, color: '#FFFFFF', fontSize: 14 }}
          >
            <option value="">Select Class</option>
            {PARENT_CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rf-subject" style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Subject *</label>
          <select
            id="rf-subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            required
            style={{ width: '100%', padding: '12px 14px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10, color: '#FFFFFF', fontSize: 14 }}
          >
            <option value="">Select Subject</option>
            {PARENT_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? <div style={{ color: '#FCA5A5', fontSize: 13, fontWeight: 600 }}>{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 8,
          padding: '14px',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          borderRadius: 10,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
        }}
      >
        {loading ? 'Submitting...' : '📅 Book FREE Demo Class'}
      </button>

      {success && (
        <div style={{ color: '#34D399', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
          ✅ Thank you! We&apos;ll call you within 24 hours to confirm your free demo class.
        </div>
      )}
    </form>
  );
}
