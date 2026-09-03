'use client';
// src/app/attendance/page.tsx
//
// This page no longer talks to Firestore directly — it calls the API routes
// at /api/attendance/lookup and /api/attendance/submit, which run server-side
// with the Admin SDK and re-verify everything (tutor identity, assignment
// ownership, valid status values, today's date). Nothing here can read or
// write Firestore on its own.

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

const todayDisplay = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_OPTIONS: { key: AttendanceStatus; label: string; icon: string; color: string }[] = [
  { key: 'present', label: 'Present', icon: '✅', color: '#1A7A4A' },
  { key: 'absent', label: 'Absent', icon: '❌', color: '#C0392B' },
  { key: 'holiday', label: 'Holiday', icon: '🏖️', color: '#C8941A' },
  { key: 'cancelled', label: 'Cancelled', icon: '🚫', color: '#888' },
];

export default function TutorAttendancePage() {
  const [phone, setPhone] = useState('');
  const [tutorName, setTutorName] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [existing, setExisting] = useState<Record<string, { id: string; status: AttendanceStatus }>>({});
  const [selections, setSelections] = useState<Record<string, AttendanceStatus>>({});
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Monthly history tab
  const [view, setView] = useState<'mark' | 'history'>('mark');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [monthLabel, setMonthLabel] = useState('');
  const [historyRecords, setHistoryRecords] = useState<{ id: string; studentName: string; subject: string; classLevel: string; date: string; status: AttendanceStatus }[]>([]);
  const [historySummary, setHistorySummary] = useState<{ studentName: string; subject: string; present: number; absent: number; holiday: number; cancelled: number; total: number }[]>([]);

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
        setHistorySummary(data.summary);
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
          ? "We couldn't find a tutor with that phone number. Please check and try again."
          : 'Something went wrong. Please try again.');
        setLoadingLogin(false);
        return;
      }
      setTutorName(data.tutorName);
      setAssignments(data.assignments);
      setExisting(data.existing);
      const preFilled: Record<string, AttendanceStatus> = {};
      Object.entries(data.existing as Record<string, { status: AttendanceStatus }>).forEach(([id, rec]) => { preFilled[id] = rec.status; });
      setSelections(preFilled);
    } catch (err) {
      console.error(err);
      setLoginError('Something went wrong. Please try again.');
    }
    setLoadingLogin(false);
  }

  // Clicking the already-selected status again clears it; clicking a
  // different status switches to it. No double-click needed — this avoids
  // the stale-closure timing issue double-click had (the button's "selected"
  // value could still reflect the pre-click render when the second click of
  // a dblclick fired, since React state updates aren't synchronous).
  function selectStatus(assignmentId: string, status: AttendanceStatus) {
    setSelections(prev => {
      if (prev[assignmentId] === status) {
        const next = { ...prev };
        delete next[assignmentId];
        return next;
      }
      return { ...prev, [assignmentId]: status };
    });
    setSubmitted(false);
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
    } catch (err) {
      console.error(err);
      alert('Could not save attendance. Please check your connection and try again.');
    }
    setSubmitting(false);
  }

  function switchAccount() {
    setTutorName(null); setPhone(''); setAssignments([]); setExisting({}); setSelections({}); setSubmitted(false);
    setView('mark'); setHistoryLoaded(false); setHistoryRecords([]); setHistorySummary([]); setHistoryError('');
  }

  const markedCount = Object.keys(selections).length;
  const totalCount = assignments.length;
  const allMarked = totalCount > 0 && markedCount === totalCount;

  // ── UI ──

  const wrap: React.CSSProperties = {
    minHeight: '100vh', background: '#0A0F1E', display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '32px 16px', fontFamily: 'inherit', position: 'relative',
  };
  const card: React.CSSProperties = {
    width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 20px 60px -20px rgba(0,0,0,.5)',
  };
  const backBtn: React.CSSProperties = {
    position: 'absolute', top: 16, left: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', color: '#fff',
    fontSize: 12.5, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)',
  };

  if (!tutorName) {
    return (
      <div style={wrap}>
        <Link href="/" style={backBtn}>← Back to Website</Link>
        <div style={{ marginBottom: 24, textAlign: 'center', color: '#fff', marginTop: 36 }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📚</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Jilani Home Tutor</div>
          <div style={{ fontSize: 12.5, opacity: .6 }}>Daily Attendance Check-in</div>
        </div>
        <div style={card}>
          <h1 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>Tutor Login</h1>
          <p style={{ fontSize: 12.5, color: '#6B7280', margin: '0 0 18px' }}>Enter your registered phone number to mark today's attendance.</p>
          <form onSubmit={handleLogin}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}
              required
            />
            {loginError && <p style={{ color: '#C0392B', fontSize: 12.5, marginBottom: 12 }}>{loginError}</p>}
            <button
              type="submit"
              disabled={loadingLogin}
              style={{ width: '100%', padding: '13px', fontSize: 14.5, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#1A6FBF,#2c8ce0)', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: loadingLogin ? .6 : 1 }}
            >
              {loadingLogin ? 'Checking…' : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <Link href="/" style={backBtn}>← Back to Website</Link>
      <div style={{ marginBottom: 20, textAlign: 'center', color: '#fff', marginTop: 36 }}>
        <div style={{ fontSize: 15, opacity: .6 }}>{todayDisplay()}</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Hi, {tutorName} 👋</div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: 'rgba(255,255,255,0.06)', padding: 4, borderRadius: 10, width: '100%', maxWidth: 560 }}>
        <button
          onClick={() => setView('mark')}
          style={{
            flex: 1, padding: '9px 4px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: 'none',
            background: view === 'mark' ? '#fff' : 'transparent', color: view === 'mark' ? '#111827' : 'rgba(255,255,255,0.7)',
          }}
        >
          Mark Attendance
        </button>
        <button
          onClick={() => { setView('history'); loadHistory(); }}
          style={{
            flex: 1, padding: '9px 4px', borderRadius: 7, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: 'none',
            background: view === 'history' ? '#fff' : 'transparent', color: view === 'history' ? '#111827' : 'rgba(255,255,255,0.7)',
          }}
        >
          This Month
        </button>
      </div>

      {view === 'mark' && (
      <div style={{ ...card, maxWidth: 560 }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Attendance Submitted</h2>
            <p style={{ fontSize: 12.5, color: '#6B7280', margin: '0 0 18px' }}>Marked {markedCount} of {totalCount} classes for today. Thank you!</p>
            <Link href="/" style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: '#1A6FBF', textDecoration: 'none' }}>← Back to Website</Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Mark Today's Attendance</h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 18px' }}>
              Tap a status for each class, then press <strong>Done</strong> at the bottom to submit. Double-tap a selected status to clear it.
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
              const selected = selections[a.id];
              return (
                <div key={a.id} style={{ border: '1.5px solid #eef1f5', borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{a.parentName}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{a.subject} · {a.classLevel}</div>
                    </div>
                    {selected && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 100,
                        background: STATUS_OPTIONS.find(s => s.key === selected)?.color + '20',
                        color: STATUS_OPTIONS.find(s => s.key === selected)?.color,
                      }}>
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
                </div>
              );
            })}
          </div>
        )}

        {!submitted && !loadingAssignments && assignments.length > 0 && (
          <>
            <p style={{ fontSize: 11.5, color: '#9CA3AF', textAlign: 'center', margin: '14px 0 8px' }}>
              {markedCount} of {totalCount} marked
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting || markedCount === 0}
              style={{
                width: '100%', padding: '13px', fontSize: 14.5, fontWeight: 700, color: '#fff',
                background: allMarked ? 'linear-gradient(135deg,#1A7A4A,#2ba85f)' : 'linear-gradient(135deg,#1A6FBF,#2c8ce0)',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                opacity: submitting || markedCount === 0 ? .5 : 1,
              }}
            >
              {submitting ? 'Saving…' : `Done — Submit Attendance (${markedCount}/${totalCount})`}
            </button>
          </>
        )}

        {!submitted && (
          <button
            onClick={switchAccount}
            style={{ marginTop: 16, width: '100%', padding: '10px', fontSize: 12.5, fontWeight: 600, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Not you? Switch account
          </button>
        )}
      </div>
      )}

      {view === 'history' && (
        <div style={{ ...card, maxWidth: 560 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Attendance — {monthLabel || 'This Month'}</h2>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 18px' }}>Your attendance records for the current month, per student.</p>

          {historyLoading && <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>Loading your history…</p>}

          {historyError && (
            <p style={{ fontSize: 12.5, color: '#C0392B', textAlign: 'center', padding: '16px 0' }}>{historyError}</p>
          )}

          {!historyLoading && historyLoaded && historySummary.length === 0 && (
            <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>No attendance marked yet this month.</p>
          )}

          {!historyLoading && historySummary.length > 0 && (
            <>
              {/* Per-student summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                {historySummary.map(s => (
                  <div key={`${s.studentName}::${s.subject}`} style={{ border: '1.5px solid #eef1f5', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.studentName}</div>
                    <div style={{ fontSize: 11.5, color: '#6B7280', marginBottom: 8 }}>{s.subject}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, color: '#1A7A4A', fontWeight: 700 }}>✅ {s.present} present</span>
                      <span style={{ fontSize: 11.5, color: '#C0392B', fontWeight: 700 }}>❌ {s.absent} absent</span>
                      <span style={{ fontSize: 11.5, color: '#C8941A', fontWeight: 700 }}>🏖️ {s.holiday} holiday</span>
                      <span style={{ fontSize: 11.5, color: '#888', fontWeight: 700 }}>🚫 {s.cancelled} cancelled</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full day-by-day list */}
              <div style={{ borderTop: '1.5px solid #eef1f5', paddingTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Day-by-day</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflowY: 'auto' }}>
                  {historyRecords.map(r => {
                    const opt = STATUS_OPTIONS.find(o => o.key === r.status);
                    return (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '6px 0', borderBottom: '1px dashed #eef1f5' }}>
                        <span>{r.date} · {r.studentName} ({r.subject})</span>
                        <span style={{ fontWeight: 700, color: opt?.color }}>{opt?.icon} {r.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <button
            onClick={switchAccount}
            style={{ marginTop: 16, width: '100%', padding: '10px', fontSize: 12.5, fontWeight: 600, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Not you? Switch account
          </button>
        </div>
      )}
    </div>
  );
}