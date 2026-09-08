'use client';
// src/app/parent/attendance/page.tsx
//
// Read-only attendance & fee tracking portal for parents.
// Server-verified authentication via /api/parent-attendance/report.
// Built with pure Vanilla CSS/Inline styling for guaranteed universal rendering.

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'cancelled';

interface ActiveClass {
  id: string;
  tutorName: string;
  tutorPhone: string;
  subject: string;
  classLevel: string;
  classesPerWeek?: number;
  studentName: string;
  startDate: string;
  area: string;
  cycleLabel: string;
}

interface Fee {
  studentName: string;
  tutorName: string;
  subject: string;
  amount: number;
  status: string;
  month: string;
}

interface Record_ {
  id: string;
  tutorName: string;
  subject: string;
  classLevel: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  sessionDuration?: number;
}

const STATUS_META: Record<
  AttendanceStatus,
  { label: string; icon: string; color: string; bg: string; border: string; dot: string }
> = {
  present: {
    label: 'Present',
    icon: '✓',
    color: '#047857',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    dot: '#10B981',
  },
  absent: {
    label: 'Absent',
    icon: '✕',
    color: '#B91C1C',
    bg: '#FEF2F2',
    border: '#FECACA',
    dot: '#EF4444',
  },
  holiday: {
    label: 'Holiday',
    icon: '★',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A',
    dot: '#F59E0B',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '⊘',
    color: '#4B5563',
    bg: '#F3F4F6',
    border: '#E5E7EB',
    dot: '#9CA3AF',
  },
};

const FEE_STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: 'Pending',
    color: '#B91C1C',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  received: {
    label: 'Received',
    color: '#047857',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  paid: {
    label: 'Paid',
    color: '#047857',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateWithDay(iso: string): { day: string; date: string; monthYear: string } {
  if (!iso) return { day: '—', date: '—', monthYear: '—' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: '—', date: iso, monthYear: '' };
  return {
    day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    date: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    monthYear: d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
  };
}

function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}

function waLink(phone: string, studentName?: string, tutorName?: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  const text = encodeURIComponent(
    `Hello ${tutorName || 'Sir/Ma\'am'}, I am the parent of ${studentName || 'your student'} from Jilani Home Tutor. Reaching out regarding our upcoming home tuition sessions.`
  );
  return `https://wa.me/91${digits}?text=${text}`;
}

export default function ParentAttendancePage() {
  const [phone, setPhone] = useState('');
  const [parentName, setParentName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [classes, setClasses] = useState<ActiveClass[]>([]);
  const [cycleLabel, setCycleLabel] = useState('');
  const [feeMonthLabel, setFeeMonthLabel] = useState('');
  const [records, setRecords] = useState<Record_[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [studentFilter, setStudentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const cleaned = phone.trim();
    if (!cleaned) return;
    setLoading(true);
    try {
      const res = await fetch('/api/parent-attendance/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === 'No parent found with that phone number'
            ? "We couldn't find a registration with that phone number. Please verify your 10-digit registered number."
            : 'Unable to load attendance report. Please check and try again.'
        );
        setLoading(false);
        return;
      }
      setParentName(data.parentName);
      setClasses(data.classes || []);
      setCycleLabel(data.cycleLabel || 'Current Cycle');
      setFeeMonthLabel(data.feeMonthLabel || 'This Month');
      setRecords(data.records || []);
      setFees(data.fees || []);
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again in a few moments.');
    }
    setLoading(false);
  }

  function switchAccount() {
    setParentName(null);
    setPhone('');
    setClasses([]);
    setRecords([]);
    setError('');
    setFees([]);
    setStudentFilter('all');
    setStatusFilter('all');
    setCycleLabel('');
    setFeeMonthLabel('');
    setSearchQuery('');
  }

  const studentNames = useMemo(
    () => Array.from(new Set(classes.map((c) => c.studentName).filter(Boolean))),
    [classes]
  );

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchStudent = studentFilter === 'all' || r.studentName === studentFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchQuery =
        !searchQuery.trim() ||
        r.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tutorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStudent && matchStatus && matchQuery;
    });
  }, [records, studentFilter, statusFilter, searchQuery]);

  const totalSessions = records.length;
  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const holidayCount = records.filter((r) => r.status === 'holiday').length;
  const cancelledCount = records.filter((r) => r.status === 'cancelled').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  const pendingFees = fees.filter((f) => f.status === 'pending');
  const totalPendingFee = pendingFees.reduce((sum, f) => sum + (f.amount || 0), 0);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LOGIN SCREEN (Atmospheric Midnight Navy, Glassmorphic Card, Ultra-Premium)
  // ─────────────────────────────────────────────────────────────────────────────
  if (!parentName) {
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
              transition: 'all 0.2s ease',
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
            Live Parent Portal
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
              Parent Attendance Portal
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: '#94A3B8',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Verified insight into your child&apos;s daily tuition logs, schedules, and fee receipts.
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
                  Enter the phone number given during tuition registration.
                </p>
              </div>

              {error && (
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
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  border: 'none',
                  borderRadius: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? 'Verifying Phone…' : 'View Attendance Report →'}
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
                <div style={{ fontSize: 16, marginBottom: 2 }}>🧾</div>
                <div style={{ fontWeight: 600, color: '#CBD5E1' }}>Fee Clarity</div>
              </div>
            </div>
          </div>

          {/* Help link */}
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 12.5, color: '#64748B' }}>
            Need login assistance?{' '}
            <a
              href="https://wa.me/917999854628?text=Hello%20Jilani%20Home%20Tutor,%20I%20need%20assistance%20logging%20into%20the%20Parent%20Attendance%20Portal."
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. MAIN LOGGED-IN ATTENDANCE DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        color: '#0F172A',
        fontFamily: "var(--font-body), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: 60,
      }}
    >
      {/* ── Top Header Navigation ── */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Logo & Portal Identity */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src="/logo.png"
              alt="Jilani Home Tutor"
              style={{ height: 38, width: 'auto', objectFit: 'contain' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                  Jilani Home Tutor
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #DBEAFE',
                  }}
                >
                  Parent Portal
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                Academic Attendance & Progress
              </div>
            </div>
          </Link>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              🖨️ Print / Save PDF
            </button>
            <Link
              href="/"
              style={{
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                color: '#475569',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Website
            </Link>
            <button
              onClick={switchAccount}
              style={{
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: '#B91C1C',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Body Container ── */}
      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Welcome Banner Card */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #172554 100%)',
            borderRadius: 24,
            padding: '28px 24px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 35px -10px rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#93C5FD',
                  marginBottom: 10,
                }}
              >
                <span>🗓️</span>
                <span>Active Cycle: {cycleLabel || 'Current Cycle'}</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Welcome, {parentName}
              </h1>
              <p style={{ fontSize: 13.5, color: '#CBD5E1', margin: 0, maxWidth: 550 }}>
                Verified monthly attendance logs for{' '}
                <strong style={{ color: '#FFFFFF' }}>
                  {studentNames.length > 0 ? studentNames.join(', ') : 'your child'}
                </strong>
                .
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 16,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: 24 }}>🎓</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8' }}>
                  Enrolled Classes
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>
                  {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} ({studentNames.length} {studentNames.length > 1 ? 'Students' : 'Student'})
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Metrics & Stats Grid ── */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {/* Card 1: Total Sessions */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#3B82F6' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Total Classes
              </span>
              <span style={{ fontSize: 16 }}>📋</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginTop: 8, lineHeight: 1 }}>
              {totalSessions}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
              In {cycleLabel || 'cycle'}
            </div>
          </div>

          {/* Card 2: Attendance Rate */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#10B981' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Attendance %
              </span>
              <span style={{ fontSize: 16 }}>📈</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#047857', lineHeight: 1 }}>
                {attendanceRate}%
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: attendanceRate >= 85 ? '#ECFDF5' : '#FFFBEB',
                  color: attendanceRate >= 85 ? '#047857' : '#B45309',
                  border: `1px solid ${attendanceRate >= 85 ? '#A7F3D0' : '#FDE68A'}`,
                }}
              >
                {attendanceRate >= 85 ? 'Excellent' : 'Good'}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
              {presentCount} sessions attended
            </div>
          </div>

          {/* Card 3: Present */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#059669' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Present
              </span>
              <span style={{ fontSize: 16 }}>✅</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', marginTop: 8, lineHeight: 1 }}>
              {presentCount}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
              Completed sessions
            </div>
          </div>

          {/* Card 4: Absences */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#EF4444' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Absences
              </span>
              <span style={{ fontSize: 16 }}>❌</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#B91C1C', marginTop: 8, lineHeight: 1 }}>
              {absentCount}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
              {holidayCount > 0 ? `+${holidayCount} holidays` : 'Missed classes'}
            </div>
          </div>

          {/* Card 5: Fees Summary */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 15px -3px rgba(15, 23, 42, 0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#F59E0B' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Fee Due
              </span>
              <span style={{ fontSize: 16 }}>💳</span>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: totalPendingFee > 0 ? '#B91C1C' : '#047857',
                marginTop: 8,
                lineHeight: 1,
              }}
            >
              {totalPendingFee > 0 ? inr(totalPendingFee) : 'Cleared'}
            </div>
            <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 6 }}>
              {totalPendingFee > 0 ? `Due for ${feeMonthLabel}` : `Paid for ${feeMonthLabel}`}
            </div>
          </div>
        </section>

        {/* ── Active Classes & Tutor Contact Section ── */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            padding: 22,
            boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📚</span> Enrolled Classes & Assigned Tutors
            </h2>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
              {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} Active
            </span>
          </div>

          {classes.length === 0 ? (
            <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>No active classes found.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 14,
              }}
            >
              {classes.map((c) => (
                <div
                  key={c.id}
                  style={{
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 8,
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          border: '1px solid #DBEAFE',
                        }}
                      >
                        {c.subject} · {c.classLevel}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: '#E2E8F0',
                          color: '#334155',
                        }}
                      >
                        {c.studentName}
                      </span>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                      👨‍🏫 Tutor: {c.tutorName}
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11.5, color: '#64748B', marginTop: 6 }}>
                      {c.classesPerWeek && <span>⏱️ {c.classesPerWeek}×/week</span>}
                      {c.startDate && <span>📅 Since {formatDate(c.startDate)}</span>}
                      {c.area && <span>📍 {c.area}</span>}
                    </div>
                  </div>

                  {c.tutorPhone && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 10, borderTop: '1px solid #E2E8F0' }}>
                      <a
                        href={telLink(c.tutorPhone)}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '7px 10px',
                          borderRadius: 10,
                          background: '#F1F5F9',
                          color: '#1E293B',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          border: '1px solid #CBD5E1',
                        }}
                      >
                        📞 Call
                      </a>
                      <a
                        href={waLink(c.tutorPhone, c.studentName, c.tutorName)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '7px 10px',
                          borderRadius: 10,
                          background: '#ECFDF5',
                          color: '#047857',
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: 'none',
                          border: '1px solid #A7F3D0',
                        }}
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Monthly Fees Card ── */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            padding: 22,
            boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>💳</span> Monthly Tuition Fees ({feeMonthLabel || 'Current Month'})
            </h2>
            {fees.length > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                Total: {inr(fees.reduce((s, f) => s + (f.amount || 0), 0))}
              </span>
            )}
          </div>

          {fees.length === 0 ? (
            <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>No fee records generated for this cycle.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 12,
              }}
            >
              {fees.map((f, i) => {
                const meta =
                  FEE_STATUS_META[f.status.toLowerCase()] || {
                    label: f.status,
                    color: '#475569',
                    bg: '#F1F5F9',
                    border: '#CBD5E1',
                  };
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        {f.studentName} · {f.subject}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                        Tutor: {f.tutorName}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                        {inr(f.amount)}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Attendance Log Table & Interactive Filters ── */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Header & Filter Controls */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #E2E8F0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📅</span> Attendance Records — {cycleLabel}
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
                  Showing {filteredRecords.length} of {records.length} logged sessions
                </p>
              </div>

              {/* Search Box */}
              <input
                type="text"
                placeholder="🔍 Search tutor, subject, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px',
                  fontSize: 12.5,
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  outline: 'none',
                  minWidth: 220,
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {/* Child Filter (if > 1 student) */}
              {studentNames.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>Child:</span>
                  {['all', ...studentNames].map((name) => (
                    <button
                      key={name}
                      onClick={() => setStudentFilter(name)}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: studentFilter === name ? '#0F172A' : '#E2E8F0',
                        background: studentFilter === name ? '#0F172A' : '#F8FAFC',
                        color: studentFilter === name ? '#FFFFFF' : '#334155',
                      }}
                    >
                      {name === 'all' ? 'All' : name}
                    </button>
                  ))}
                </div>
              )}

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748B' }}>Status:</span>
                {(['all', 'present', 'absent', 'holiday', 'cancelled'] as const).map((s) => {
                  const isSelected = statusFilter === s;
                  const count =
                    s === 'all'
                      ? records.length
                      : records.filter((r) => r.status === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: isSelected ? '#0F172A' : '#E2E8F0',
                        background: isSelected ? '#0F172A' : '#F8FAFC',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{s}</span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          borderRadius: 999,
                          background: isSelected ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                          color: isSelected ? '#FFFFFF' : '#475569',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Student
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Tutor & Subject
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Duration
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#94A3AF' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🔍</div>
                      <div style={{ fontWeight: 600, color: '#64748B' }}>No attendance records match your filter.</div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const meta = STATUS_META[r.status] || STATUS_META.present;
                    const dateParts = formatDateWithDay(r.date);
                    return (
                      <tr
                        key={r.id}
                        style={{ borderBottom: '1px solid #F1F5F9' }}
                      >
                        {/* Date */}
                        <td style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: '#EFF6FF',
                                border: '1px solid #DBEAFE',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1,
                              }}
                            >
                              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#2563EB' }}>
                                {dateParts.day}
                              </span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#1E3A8A', marginTop: 2 }}>
                                {dateParts.date}
                              </span>
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A' }}>{r.date}</div>
                              <div style={{ fontSize: 11, color: '#94A3B8' }}>{dateParts.monthYear}</div>
                            </div>
                          </div>
                        </td>

                        {/* Student */}
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                          {r.studentName}
                        </td>

                        {/* Tutor & Subject */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>
                            {r.subject} <span style={{ fontWeight: 500, color: '#64748B', fontSize: 11.5 }}>({r.classLevel})</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: '#64748B' }}>
                            Tutor: {r.tutorName}
                          </div>
                        </td>

                        {/* Duration */}
                        <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {r.sessionDuration ? `${r.sessionDuration} hr` : '1 hr'}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '4px 10px',
                              borderRadius: 999,
                              fontSize: 11.5,
                              fontWeight: 700,
                              background: meta.bg,
                              color: meta.color,
                              border: `1px solid ${meta.border}`,
                            }}
                          >
                            <span>{meta.icon}</span>
                            <span>{meta.label}</span>
                          </span>
                        </td>

                        {/* Remarks */}
                        <td style={{ padding: '12px 18px', textAlign: 'right', color: '#64748B', fontSize: 12 }}>
                          {r.notes ? (
                            <span style={{ fontStyle: 'italic', color: '#334155' }}>
                              &ldquo;{r.notes}&rdquo;
                            </span>
                          ) : (
                            <span style={{ color: '#CBD5E1' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Coordinator Concierge / Help Card ── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
            border: '1px solid #BFDBFE',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)',
              }}
            >
              💬
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                Questions regarding attendance or fees?
              </div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                Our Academic Coordinator is available to help 7 days a week.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/917999854628?text=Hello%20Academic%20Coordinator,%20I%20have%20a%20query%20regarding%20my%20child's%20attendance."
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                background: '#10B981',
                color: '#FFFFFF',
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 6px 15px -3px rgba(16, 185, 129, 0.4)',
              }}
            >
              WhatsApp Coordinator
            </a>
            <a
              href="tel:917999854628"
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                background: '#FFFFFF',
                color: '#1E293B',
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid #CBD5E1',
              }}
            >
              Call Coordinator
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}