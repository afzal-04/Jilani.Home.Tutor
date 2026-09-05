'use client';
// src/app/parent/attendance/page.tsx
//
// Read-only for parents — no marking, just viewing. Same security pattern as
// the tutor page: the browser never talks to Firestore directly, only to
// /api/parent-attendance/report, which re-verifies the parent's phone number
// server-side before returning anything.

import { useState } from 'react';
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

const STATUS_META: Record<AttendanceStatus, { icon: string; color: string; bg: string }> = {
  present: { icon: '✅', color: '#166534', bg: '#f0fdf4' },
  absent: { icon: '❌', color: '#9f1239', bg: '#fff1f2' },
  holiday: { icon: '🏖️', color: '#92400e', bg: '#fffbeb' },
  cancelled: { icon: '🚫', color: '#4b5563', bg: '#f3f4f6' },
};

const FEE_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#9f1239', bg: '#fff1f2' },
  received: { label: 'Received', color: '#166534', bg: '#f0fdf4' },
  paid: { label: 'Paid', color: '#166534', bg: '#f0fdf4' },
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}
function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return `https://wa.me/91${digits}`;
}

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
        setError(data.error === 'No parent found with that phone number'
          ? "We couldn't find a registration with that phone number. Please check and try again."
          : 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      setParentName(data.parentName);
      setClasses(data.classes);
      setCycleLabel(data.cycleLabel);
      setFeeMonthLabel(data.feeMonthLabel);
      setRecords(data.records);
      setFees(data.fees || []);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  function switchAccount() {
    setParentName(null); setPhone(''); setClasses([]); setRecords([]); setError(''); setFees([]);
    setStudentFilter('all'); setStatusFilter('all'); setCycleLabel(''); setFeeMonthLabel('');
  }

  const studentNames = Array.from(new Set(classes.map(c => c.studentName)));
  const filteredRecords = records
    .filter(r => studentFilter === 'all' || r.studentName === studentFilter)
    .filter(r => statusFilter === 'all' || r.status === statusFilter);

  const totalSessions = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'present').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

  // ── Login screen — keep this compact/mobile, it's a quick action ──

  if (!parentName) {
    const wrap: React.CSSProperties = { minHeight: '100vh', background: '#0A0F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', position: 'relative' };
    const card: React.CSSProperties = { width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 60px -20px rgba(0,0,0,.5)' };
    const backBtn: React.CSSProperties = { position: 'absolute', top: 16, left: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12.5, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' };
    return (
      <div style={wrap}>
        <Link href="/" style={backBtn}>← Back to Website</Link>
        <div style={{ marginBottom: 24, textAlign: 'center', color: '#fff', marginTop: 36 }}>
          <img src="/logo.png" alt="Jilani Home Tutor" style={{ height: 48, width: 'auto', marginBottom: 8 }} />
          <div style={{ fontSize: 18, fontWeight: 700 }}>Jilani Home Tutor</div>
          <div style={{ fontSize: 12.5, opacity: .6 }}>Your Child's Attendance Report</div>
        </div>
        <div style={card}>
          <h1 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>Parent Login</h1>
          <p style={{ fontSize: 12.5, color: '#6B7280', margin: '0 0 18px' }}>Enter your registered phone number to view your child's attendance for this month.</p>
          <form onSubmit={handleLogin}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}
              required
            />
            {error && <p style={{ color: '#C0392B', fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 14.5, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#1A6FBF,#2c8ce0)', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: loading ? .6 : 1 }}>
              {loading ? 'Checking…' : 'View Attendance →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Full report page — light theme, matches your CRM's report style ──

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      {/* Header bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef1f5', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <img src="/logo.png" alt="Jilani Home Tutor" style={{ height: 30, width: 'auto' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>Attendance Report</div>
          <div style={{ fontSize: 11.5, color: '#6B7280' }}>{parentName} · {cycleLabel}</div>
        </div>
        <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textDecoration: 'none', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}>← Website</Link>
        <button onClick={switchAccount} style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>Switch Account</button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          <StatCard icon="📋" num={String(totalSessions)} label={`Sessions — ${cycleLabel}`} sub="all statuses" accent="#1A6FBF" />
          <StatCard icon="✅" num={`${attendanceRate}%`} label="Attendance Rate" sub={`${presentCount} present`} accent="#1A7A4A" />
          <StatCard icon="❌" num={String(absentCount)} label="Absences" sub={cycleLabel} accent="#C0392B" />
          <StatCard icon="🎓" num={String(classes.length)} label="Active Classes" sub={studentNames.length > 1 ? `${studentNames.length} children` : '1 child'} accent="#C8941A" />
          <StatCard
            icon="💳"
            num={inr(fees.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0))}
            label="Fees Due"
            sub={`${fees.filter(f => f.status === 'pending').length} pending — ${feeMonthLabel}`}
            accent="#C0392B"
          />
        </div>

        {/* Active classes */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>📚 Active Classes</div>
          {classes.length === 0 ? (
            <p style={{ fontSize: 12.5, color: '#6B7280' }}>No active classes found for your account.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {classes.map(c => (
                <div key={c.id} style={{ border: '1px solid #eef1f5', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{c.subject} <span style={{ fontWeight: 500, color: '#6B7280' }}>· {c.classLevel}</span></div>
                  <div style={{ fontSize: 11.5, color: '#6B7280' }}>{c.studentName} · with {c.tutorName}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 10.5, color: '#9CA3AF', flexWrap: 'wrap' }}>
                    {c.classesPerWeek && <span>{c.classesPerWeek}×/week</span>}
                    {c.startDate && <span>Since {formatDate(c.startDate)}</span>}
                    {c.area && <span>{c.area}</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#1A6FBF', fontWeight: 600, marginTop: 2 }}>Current cycle: {c.cycleLabel}</div>
                  {c.tutorPhone && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <a href={telLink(c.tutorPhone)} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '6px 8px', borderRadius: 7, background: '#EFF6FF', color: '#1D4ED8', textDecoration: 'none' }}>📞 Call</a>
                      <a href={waLink(c.tutorPhone)} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '6px 8px', borderRadius: 7, background: '#F0FDF4', color: '#166534', textDecoration: 'none' }}>💬 WhatsApp</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* This month's fees — parent's amount and status only, never the tutor's cut */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>💳 Fees — {feeMonthLabel}</div>
          {fees.length === 0 ? (
            <p style={{ fontSize: 12.5, color: '#6B7280' }}>No fee record generated yet for this month.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {fees.map((f, i) => {
                const meta = FEE_STATUS_META[f.status] || { label: f.status, color: '#4b5563', bg: '#f3f4f6' };
                return (
                  <div key={i} style={{ border: '1px solid #eef1f5', borderRadius: 10, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{f.subject}</div>
                      <div style={{ fontSize: 11.5, color: '#6B7280' }}>{f.studentName} · with {f.tutorName}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', marginTop: 4 }}>{inr(f.amount)}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: meta.bg, color: meta.color, whiteSpace: 'nowrap' }}>{meta.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Report table */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eef1f5', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 12 }}>📅 Attendance Records — {cycleLabel} ({filteredRecords.length})</div>

            {studentNames.length > 1 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', alignSelf: 'center', marginRight: 2 }}>Child:</span>
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
                  {['Date', 'Child', 'Tutor', 'Subject', 'Duration', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px 14px', color: '#9CA3AF' }}>No attendance records match this filter.</td></tr>
                )}
                {filteredRecords.map(r => {
                  const meta = STATUS_META[r.status];
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 14px', color: '#1A6FBF', whiteSpace: 'nowrap' }}>{r.date}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#111827' }}>{r.studentName}</td>
                      <td style={{ padding: '10px 14px' }}>{r.tutorName}</td>
                      <td style={{ padding: '10px 14px' }}>{r.subject} <span style={{ color: '#9CA3AF', fontSize: 11 }}>({r.classLevel})</span></td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{r.sessionDuration}hr</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: meta.bg, color: meta.color }}>
                          {meta.icon} {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}