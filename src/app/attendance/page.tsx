'use client';
// src/app/attendance/page.tsx
//
// This page no longer talks to Firestore directly — it calls the API routes
// at /api/attendance/lookup, /api/attendance/submit, and /api/attendance/history,
// which run server-side with the Admin SDK and re-verify everything (tutor
// identity, assignment ownership, valid status values, today's date).
// Nothing here can read or write Firestore on its own.

import { useState, useEffect } from 'react';
import Link from 'next/link';

type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'cancelled';

interface Assignment {
  id: string;
  parentName: string;
  subject: string;
  classLevel: string;
  tutorName: string;
}

interface HistoryRecord {
  id: string;
  studentName: string;
  subject: string;
  classLevel: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  sessionDuration?: number;
}

const todayDisplay = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_OPTIONS: { key: AttendanceStatus; label: string; icon: string; color: string }[] = [
  { key: 'present', label: 'Present', icon: '✅', color: '#1A7A4A' },
  { key: 'absent', label: 'Absent', icon: '❌', color: '#C0392B' },
  { key: 'holiday', label: 'Holiday', icon: '🏖️', color: '#C8941A' },
  { key: 'cancelled', label: 'Cancelled', icon: '🚫', color: '#888' },
];

const STATUS_META: Record<AttendanceStatus, { icon: string; color: string; bg: string }> = {
  present: { icon: '✅', color: '#166534', bg: '#f0fdf4' },
  absent: { icon: '❌', color: '#9f1239', bg: '#fff1f2' },
  holiday: { icon: '🏖️', color: '#92400e', bg: '#fffbeb' },
  cancelled: { icon: '🚫', color: '#4b5563', bg: '#f3f4f6' },
};

function StatCard({ icon, num, label, sub, accent }: { icon: string; num: string; label: string; sub: string; accent: string }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid #eef1f5', background: '#fff', padding: 20 }}>
      <span aria-hidden style={{ position: 'absolute', insetInline: 0, top: 0, height: 3, background: accent }} />
      <div style={{ display: 'flex', height: 36, width: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: accent + '20', fontSize: 17, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{num}</div>
      <div style={{ marginTop: 6, fontSize: 10.5, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
      <div style={{ marginTop: 2, fontSize: 11.5, color: '#9CA3AF' }}>{sub}</div>
    </div>
  );
}

export default function TutorAttendancePage() {
  const [phone, setPhone] = useState('');
  const [tutorName, setTutorName] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [existing, setExisting] = useState<Record<string, { id: string; status: AttendanceStatus; notes: string }>>({});
  const [selections, setSelections] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // "This Month" report tab
  const [view, setView] = useState<'mark' | 'history'>('mark');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [monthLabel, setMonthLabel] = useState('');
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');

  async function loadHistory() {
    if (historyLoaded) return; // don't re-fetch every tab switch
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await fetch('/api/attendance/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setHistoryRecords(data.records);
        setMonthLabel(data.monthLabel);
        setHistoryLoaded(true);
      } else {
        setHistoryError(data.error || 'Could not load your attendance history.');
      }
    } catch (err) {
      console.error(err);
      setHistoryError('Could not load your attendance history. Please try again.');
    }
    setHistoryLoading(false);
  }

  // ── Step 1: look up tutor by phone via the API route ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const cleaned = phone.trim();
    if (!cleaned) return;
    setLoadingLogin(true);
    try {
      const res = await fetch('/api/attendance/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error === 'No tutor found with that phone number'
          ? "We couldn't find a tutor with that phone number. Please verify your 10-digit registered number."
          : 'Unable to verify. Please check and try again.');
        setLoadingLogin(false);
        return;
      }
      setTutorName(data.tutorName);
      setAssignments(data.assignments);
      setExisting(data.existing);
      const preFilled: Record<string, { status: AttendanceStatus; notes: string }> = {};
      Object.entries(data.existing as Record<string, { status: AttendanceStatus; notes: string }>).forEach(([id, rec]) => { preFilled[id] = { status: rec.status, notes: rec.notes || '' }; });
      setSelections(preFilled);
    } catch (err) {
      console.error(err);
      setLoginError('Connection error. Please try again in a few moments.');
    }
    setLoadingLogin(false);
  }

  // Clicking the already-selected status again clears it; clicking a
  // different status switches to it, keeping whatever note is already typed.
  function selectStatus(assignmentId: string, status: AttendanceStatus) {
    setSelections(prev => {
      if (prev[assignmentId]?.status === status) {
        const next = { ...prev };
        delete next[assignmentId];
        return next;
      }
      return { ...prev, [assignmentId]: { status, notes: prev[assignmentId]?.notes || '' } };
    });
    setSubmitted(false);
  }

  function setNote(assignmentId: string, notes: string) {
    setSelections(prev => {
      if (!prev[assignmentId]) return prev; // can't attach a note before a status is picked
      return { ...prev, [assignmentId]: { ...prev[assignmentId], notes } };
    });
  }

  // ── Submit everything via the API route ──
  async function handleSubmit() {
    if (Object.keys(selections).length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/attendance/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), selections }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setSubmitted(true);
      setHistoryLoaded(false); // force a refresh next time "This Month" is opened
    } catch (err) {
      console.error(err);
      alert('Could not save attendance. Please check your connection and try again.');
    }
    setSubmitting(false);
  }

  function switchAccount() {
    setTutorName(null); setPhone(''); setAssignments([]); setExisting({}); setSelections({}); setSubmitted(false);
    setView('mark'); setHistoryLoaded(false); setHistoryRecords([]); setHistoryError('');
    setStudentFilter('all'); setStatusFilter('all');
  }

  const markedCount = Object.keys(selections).length;
  const totalCount = assignments.length;
  const allMarked = totalCount > 0 && markedCount === totalCount;

  const studentNames = Array.from(new Set(historyRecords.map(r => r.studentName)));
  const filteredHistory = historyRecords
    .filter(r => studentFilter === 'all' || r.studentName === studentFilter)
    .filter(r => statusFilter === 'all' || r.status === statusFilter);
  const totalSessions = filteredHistory.length;
  const presentCount = filteredHistory.filter(r => r.status === 'present').length;
  const absentCount = filteredHistory.filter(r => r.status === 'absent').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LOGIN SCREEN — Atmospheric Midnight Navy, Glassmorphic Card, Ultra-Premium
  // ─────────────────────────────────────────────────────────────────────────────
  if (!tutorName) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(ellipse at 50% -20%, #1E3A8A 0%, #0B0F19 65%, #05070B 100%)',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          position: 'relative',
          fontFamily: "var(--font-body), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Navbar */}
        <div
          style={{
            maxWidth: 1100,
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#E2E8F0',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← Back to Website
          </Link>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34D399',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            Live Tutor Portal
          </div>
        </div>

        {/* Center Card Container */}
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            margin: '40px auto',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '12px 20px',
                borderRadius: 20,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(12px)',
                marginBottom: 16,
              }}
            >
              <img
                src="/logo.png"
                alt="Jilani Home Tutor"
                style={{ height: 44, width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                margin: '0 0 8px',
              }}
            >
              Tutor Attendance Portal
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: '#94A3B8',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Mark today&apos;s sessions and review your monthly attendance log.
            </p>
          </div>

          {/* Form Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              borderRadius: 24,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
              padding: '32px 28px',
              backdropFilter: 'blur(20px)',
              position: 'relative',
            }}
          >
            {/* Top Glowing Gradient Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 32,
                right: 32,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #3B82F6, #60A5FA, transparent)',
              }}
            />

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#CBD5E1',
                    marginBottom: 8,
                  }}
                >
                  Registered Mobile Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 14,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#94A3B8',
                      pointerEvents: 'none',
                    }}
                  >
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 72px',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 14,
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                  />
                </div>
                <p style={{ fontSize: 11.5, color: '#64748B', marginTop: 6, marginBottom: 0 }}>
                  Enter the phone number given during tutor registration.
                </p>
              </div>

              {loginError && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#FCA5A5',
                    fontSize: 12.5,
                    lineHeight: 1.4,
                    marginBottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  border: 'none',
                  borderRadius: 14,
                  cursor: loadingLogin ? 'not-allowed' : 'pointer',
                  opacity: loadingLogin ? 0.7 : 1,
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loadingLogin ? 'Verifying Phone…' : 'View Attendance Dashboard →'}
              </button>
            </form>

            {/* Feature Trust Pills */}
            <div
              style={{
                marginTop: 26,
                paddingTop: 20,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                textAlign: 'center',
                fontSize: 11,
                color: '#94A3B8',
              }}
            >
              <div>
                <div style={{ fontSize: 16, marginBottom: 2 }}>🔒</div>
                <div style={{ fontWeight: 600, color: '#CBD5E1' }}>100% Private</div>
              </div>
              <div>
                <div style={{ fontSize: 16, marginBottom: 2 }}>⚡</div>
                <div style={{ fontWeight: 600, color: '#CBD5E1' }}>Daily Sync</div>
              </div>
              <div>
                <div style={{ fontSize: 16, marginBottom: 2 }}>📋</div>
                <div style={{ fontWeight: 600, color: '#CBD5E1' }}>Accurate Logs</div>
              </div>
            </div>
          </div>

          {/* Help link */}
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: '#64748B' }}>
            Need login assistance?{' '}
            <a
              href="https://wa.me/917999854628?text=Hello%20Jilani%20Home%20Tutor,%20I%20need%20assistance%20logging%20into%20the%20Tutor%20Attendance%20Portal."
              target="_blank"
              rel="noreferrer"
              style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'underline' }}
            >
              WhatsApp Academic Coordinator
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 11.5,
            color: '#475569',
            paddingTop: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            zIndex: 10,
          }}
        >
          © {new Date().getFullYear()} Jilani Home Tutor · Raipur, CG. All Rights Reserved.
        </div>
      </div>
    );
  }

  // ── Full page after login — original light theme, header bar + tabs ──

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      {/* Header bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef1f5', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <img src="/logo.png" alt="Jilani Home Tutor" style={{ height: 30, width: 'auto' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Attendance</div>
          <div style={{ fontSize: 11.5, color: '#6B7280' }}>Hi, {tutorName} · {todayDisplay()}</div>
        </div>
        <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textDecoration: 'none', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>← Website</Link>
        <button onClick={switchAccount} style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Switch Account</button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', gap: 4, background: '#eef1f5', padding: 4, borderRadius: 10, width: 'fit-content' }}>
          <button
            onClick={() => setView('mark')}
            style={{ padding: '8px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: 'none', background: view === 'mark' ? '#fff' : 'transparent', color: view === 'mark' ? '#111827' : '#6B7280', boxShadow: view === 'mark' ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => { setView('history'); loadHistory(); }}
            style={{ padding: '8px 16px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: 'none', background: view === 'history' ? '#fff' : 'transparent', color: view === 'history' ? '#111827' : '#6B7280', boxShadow: view === 'history' ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}
          >
            This Month
          </button>
        </div>

        {/* ── Mark Attendance tab ── */}
        {view === 'mark' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', padding: 22, maxWidth: 640 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 8px' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Attendance Submitted</h2>
                <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>Marked {markedCount} of {totalCount} classes for today. Thank you!</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Mark Today&apos;s Attendance</h2>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 18px' }}>
                  Tap a status for each class, then press <strong>Done</strong> at the bottom to submit. Tap a selected status again to clear it.
                </p>
              </>
            )}

            {loadingAssignments && <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>Loading your classes…</p>}

            {!loadingAssignments && assignments.length === 0 && (
              <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>No active assignments found for your account. Contact Jilani if this looks wrong.</p>
            )}

            {!submitted && !loadingAssignments && assignments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map(a => {
                  const selected = selections[a.id]?.status;
                  const note = selections[a.id]?.notes || '';
                  return (
                    <div key={a.id} style={{ border: '1.5px solid #eef1f5', borderRadius: 12, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{a.parentName}</div>
                          <div style={{ fontSize: 12, color: '#6B7280' }}>{a.subject} · {a.classLevel}</div>
                        </div>
                        {selected && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100, background: STATUS_OPTIONS.find(s => s.key === selected)?.color + '20', color: STATUS_OPTIONS.find(s => s.key === selected)?.color }}>
                            {selected}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt.key}
                            onClick={() => selectStatus(a.id, opt.key)}
                            style={{
                              padding: '9px 4px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              border: selected === opt.key ? `2px solid ${opt.color}` : '1.5px solid #e5e7eb',
                              background: selected === opt.key ? opt.color + '15' : '#fff',
                              color: selected === opt.key ? opt.color : '#374151',
                            }}
                          >
                            {opt.icon} {opt.label}
                          </button>
                        ))}
                      </div>
                      {selected && (
                        <div style={{ marginTop: 10 }}>
                          <textarea
                            value={note}
                            onChange={e => setNote(a.id, e.target.value)}
                            placeholder={selected === 'absent' ? "Reason for absence (optional)…" : selected === 'cancelled' ? "Reason for cancellation (optional)…" : "Note (optional)…"}
                            maxLength={500}
                            rows={2}
                            style={{ width: '100%', padding: '8px 10px', fontSize: 12.5, border: '1.5px solid #e5e7eb', borderRadius: 8, resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!submitted && !loadingAssignments && assignments.length > 0 && (
              <>
                <p style={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', margin: '14px 0 8px' }}>{markedCount} of {totalCount} marked</p>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || markedCount === 0}
                  style={{
                    width: '100%', padding: '13px', fontSize: 14.5, fontWeight: 700, color: '#fff',
                    background: allMarked ? 'linear-gradient(135deg,#1A7A4A,#2ba85f)' : 'linear-gradient(135deg,#1A6FBF,#2c8ce0)',
                    border: 'none', borderRadius: 10, cursor: 'pointer', opacity: submitting || markedCount === 0 ? .5 : 1,
                  }}
                >
                  {submitting ? 'Saving…' : `Done — Submit Attendance (${markedCount}/${totalCount})`}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── This Month tab — full report, matches parent report style ── */}
        {view === 'history' && (
          <>
            {historyError && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 12, padding: 16, color: '#9f1239', fontSize: 12.5 }}>{historyError}</div>
            )}

            {historyLoading && (
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', padding: 40, textAlign: 'center', color: '#6B7280', fontSize: 13 }}>Loading your history…</div>
            )}

            {!historyLoading && !historyError && historyLoaded && (
              <>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                  <StatCard icon="📋" num={String(totalSessions)} label={`Sessions — ${monthLabel}`} sub="all statuses" accent="#1A6FBF" />
                  <StatCard icon="✅" num={`${attendanceRate}%`} label="Attendance Rate" sub={`${presentCount} present`} accent="#1A7A4A" />
                  <StatCard icon="❌" num={String(absentCount)} label="Absences" sub={monthLabel} accent="#C0392B" />
                  <StatCard icon="🎓" num={String(studentNames.length)} label="Students Tracked" sub="with records" accent="#C8941A" />
                </div>

                {/* Report table */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 18px 0' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>📅 Attendance Records — {monthLabel} ({filteredHistory.length})</div>

                    {studentNames.length > 1 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', alignSelf: 'center', marginRight: 2 }}>Student:</span>
                        {['all', ...studentNames].map(name => (
                          <button key={name} onClick={() => setStudentFilter(name)}
                            style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 12px', borderRadius: 100, cursor: 'pointer', border: '1px solid', borderColor: studentFilter === name ? '#111827' : '#e5e7eb', background: studentFilter === name ? '#111827' : '#fff', color: studentFilter === name ? '#fff' : '#374151' }}>
                            {name === 'all' ? 'All' : name}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', alignSelf: 'center', marginRight: 2 }}>Status:</span>
                      {(['all', 'present', 'absent', 'holiday', 'cancelled'] as const).map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                          style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 12px', borderRadius: 100, cursor: 'pointer', border: '1px solid', borderColor: statusFilter === s ? '#111827' : '#e5e7eb', background: statusFilter === s ? '#111827' : '#fff', color: statusFilter === s ? '#fff' : '#374151', textTransform: 'capitalize' }}>
                          {s === 'all' ? 'All' : `${STATUS_META[s].icon} ${s}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                      <thead>
                        <tr style={{ background: '#fafbfc', borderTop: '1px solid #eef1f5', borderBottom: '1px solid #eef1f5' }}>
                          {['Date', 'Student', 'Subject', 'Duration', 'Status', 'Notes'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.length === 0 && (
                          <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px 14px', color: '#9CA3AF' }}>No attendance records match this filter.</td></tr>
                        )}
                        {filteredHistory.map(r => {
                          const meta = STATUS_META[r.status];
                          return (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '10px 14px', color: '#1A6FBF', whiteSpace: 'nowrap' }}>{r.date}</td>
                              <td style={{ padding: '10px 14px', fontWeight: 600, color: '#111827' }}>{r.studentName}</td>
                              <td style={{ padding: '10px 14px' }}>{r.subject} <span style={{ color: '#9CA3AF', fontSize: 11 }}>({r.classLevel})</span></td>
                              <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{r.sessionDuration || 1}hr</td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: meta.bg, color: meta.color }}>
                                  {meta.icon} {r.status}
                                </span>
                              </td>
                              <td style={{ padding: '10px 14px', color: '#6B7280', maxWidth: 200, fontStyle: r.notes ? 'italic' : 'normal' }}>{r.notes || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}