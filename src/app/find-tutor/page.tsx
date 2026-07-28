'use client';

export const dynamic = 'force-dynamic';

import { useState } from "react";
import Link from "next/link";
import { registerParent } from "@/lib/firestore";

export default function FindTutor() {
  const [form, setForm] = useState({
    name: "", phone: "", area: "", class: "", subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerParent(form);
      setSuccess(true);
      setForm({ name: "", phone: "", area: "", class: "", subject: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, #1E293B 0%, #0F172A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px 80px',
      position: 'relative'
    }}>
      {/* Top back button */}
      <div style={{ width: '100%', maxWidth: 620, marginBottom: 24 }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#94A3B8',
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 600,
          transition: 'color 0.2s ease'
        }}>
          ← Back to Home
        </Link>
      </div>

      <div style={{
        background: 'rgba(30, 41, 59, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: '44px 36px',
        width: '100%',
        maxWidth: 620,
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(37, 99, 235, 0.2))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontSize: 32,
            marginBottom: 16
          }}>
            🎓
          </div>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 30px)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: 10,
            lineHeight: 1.2,
            fontFamily: 'var(--font-display)'
          }}>
            Find Your Expert Home Tutor
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
            Tell us what subject you need and we&apos;ll match you with verified Raipur home tutors within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div className="form-group">
            <label>Parent / Guardian Name *</label>
            <input
              type="text" placeholder="Your full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required
            />
          </div>

          <div className="form-group">
            <label>Area / Locality in Raipur *</label>
            <input
              type="text" placeholder="e.g. Shankar Nagar, Civil Lines, Pandri" value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })} required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Class *</label>
              <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required>
                <option value="">Select Class</option>
                <option>Class 1–5</option>
                <option>Class 6–8</option>
                <option>Class 9–10</option>
                <option>Class 11–12</option>
                <option>Competitive Exam</option>
                <option>Summer Class</option>
                <option>Drawing</option>
                <option>Music</option>
                <option>Dance</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                <option value="">Select Subject</option>
                <option>Maths</option>
                <option>Science</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Social Science</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Maths + Science</option>
                <option>All Subjects</option>
                <option>Drawing / Art</option>
                <option>Music / Singing</option>
                <option>Dance</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 8, padding: '16px', fontSize: 16 }}>
            {loading ? "Submitting…" : "📅 Find My Tutor — FREE DEMO"}
          </button>

          {success && (
            <div className="success-msg">
              ✅ Thank you! We&apos;ll call you within 24 hours to confirm your free demo class.
            </div>
          )}
        </form>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            ✨ 100% Verified Tutors
          </span>
          <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            🆓 1st Class Demo Free
          </span>
          <span style={{ fontSize: 13, color: '#CBD5E1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚡ 24hr Quick Matching
          </span>
        </div>

      </div>
    </main>
  );
}

