'use client';
// src/app/attendance/page.tsx  (or src/app/tutor/attendance/page.tsx — wherever you placed it)

import { useState, useEffect } from 'react';
import {
  collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';

const db = () => getDbInstance();

type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'cancelled';

interface Assignment {
  id: string;
  tutorName: string;
  tutorPhone: string;
  parentName: string;
  subject: string;
  classLevel: string;
  hoursPerSession?: number;
  status: string;
}

interface ExistingRecord {
  id: string;
  status: AttendanceStatus;
}

const today = () => new Date().toISOString().split('T')[0];
const todayDisplay = () => new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_OPTIONS: { key: AttendanceStatus; label: string; icon: string; color: string }[] = [
  { key: 'present', label: 'Present', icon: '✅', color: '#1A7A4A' },
  { key: 'absent', label: 'Absent', icon: '❌', color: '#C0392B' },
  { key: 'cancelled', label: 'Cancelled', icon: '🚫', color: '#888' },
];

export default function TutorAttendancePage() {
  const [phone, setPhone] = useState('');
  const [tutorName, setTutorName] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [existing, setExisting] = useState<Record<string, ExistingRecord>>({}); // already-saved records, keyed by assignment.id
  const [selections, setSelections] = useState<Record<string, AttendanceStatus>>({}); // local taps, not yet saved
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Step 1: look up tutor by phone ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const cleaned = phone.trim();
    if (!cleaned) return;
    setLoadingLogin(true);
    try {
      const snap = await getDocs(query(collection(db(), 'tutors'), where('phone', '==', cleaned)));
      if (snap.empty) {
        setLoginError("We couldn't find a tutor with that phone number. Please check and try again.");
        setLoadingLogin(false);
        return;
      }
      const data = snap.docs[0].data();
      setTutorName(data.name);
    } catch (err) {
      console.error(err);
      setLoginError('Something went wrong. Please try again.');
    }
    setLoadingLogin(false);
  }

  // ── Step 2: once logged in, load today's active assignments + any already-marked records ──
  useEffect(() => {
    if (!tutorName) return;
    (async () => {
      setLoadingAssignments(true);
      try {
        const aSnap = await getDocs(query(
          collection(db(), 'classes'),
          where('tutorPhone', '==', phone.trim()),
          where('status', '==', 'active'),
        ));
        const list = aSnap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
        setAssignments(list);

        const attSnap = await getDocs(query(
          collection(db(), 'attendance'),
          where('tutorName', '==', tutorName),
          where('date', '==', today()),
        ));
        const map: Record<string, ExistingRecord> = {};
        attSnap.docs.forEach(d => {
          const data = d.data();
          const match = list.find(a => a.parentName === data.studentName && a.subject === data.subject);
          if (match) map[match.id] = { id: d.id, status: data.status };
        });
        setExisting(map);
        // Pre-fill selections with whatever's already saved, so re-visiting shows current state
        const preFilled: Record<string, AttendanceStatus> = {};
        Object.entries(map).forEach(([id, rec]) => { preFilled[id] = rec.status; });
        setSelections(preFilled);
      } catch (err) {
        console.error(err);
      }
      setLoadingAssignments(false);
    })();
  }, [tutorName, phone]);

  // ── Tap a status: only updates local state, nothing saved yet ──
  function selectStatus(assignmentId: string, status: AttendanceStatus) {
    setSelections(prev => ({ ...prev, [assignmentId]: status }));
    setSubmitted(false); // if they change something after submitting, un-confirm
  }

  // ── Submit / Done: saves every selection to Firestore in one go ──
  async function handleSubmit() {
    const entries = Object.entries(selections);
    if (entries.length === 0) return;
    setSubmitting(true);
    try {
      await Promise.all(entries.map(async ([assignmentId, status]) => {
        const a = assignments.find(x => x.id === assignmentId);
        if (!a) return;
        const already = existing[assignmentId];
        if (already) {
          if (already.status === status) return; // nothing changed for this one
          await updateDoc(doc(db(), 'attendance', already.id), { status });
        } else {
          const ref = await addDoc(collection(db(), 'attendance'), {
            studentName: a.parentName,
            tutorName: a.tutorName,
            subject: a.subject,
            classLevel: a.classLevel,
            date: today(),
            status,
            sessionDuration: a.hoursPerSession || 1,
            notes: '',
            createdAt: serverTimestamp(),
          });
          setExisting(prev => ({ ...prev, [assignmentId]: { id: ref.id, status } }));
        }
      }));
      setExisting(prev => {
        const next = { ...prev };
        entries.forEach(([id, status]) => { next[id] = { id: next[id]?.id || '', status }; });
        return next;
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Could not save attendance. Please check your connection and try again.');
    }
    setSubmitting(false);
  }

  const markedCount = Object.keys(selections).length;
  const totalCount = assignments.length;
  const allMarked = totalCount > 0 && markedCount === totalCount;

  // ── UI ──

  const wrap: React.CSSProperties = {
    minHeight: '100vh', background: '#0A0F1E', display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '32px 16px', fontFamily: 'inherit',
  };
  const card: React.CSSProperties = {
    width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 20px 60px -20px rgba(0,0,0,.5)',
  };

  if (!tutorName) {
    return (
      <div style={wrap}>
        <div style={{ marginBottom: 24, textAlign: 'center', color: '#fff' }}>
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
      <div style={{ marginBottom: 20, textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 15, opacity: .6 }}>{todayDisplay()}</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>Hi, {tutorName} 👋</div>
      </div>

      <div style={{ ...card, maxWidth: 560 }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Attendance Submitted</h2>
            <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>Marked {markedCount} of {totalCount} classes for today. Thank you!</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>Mark Today's Attendance</h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 18px' }}>
              Tap a status for each class, then press <strong>Done</strong> at the bottom to submit.
            </p>
          </>
        )}

        {loadingAssignments && <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>Loading your classes…</p>}

        {!loadingAssignments && assignments.length === 0 && (
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: '20px 0' }}>No active assignments found for your account. Contact Jilani if this looks wrong.</p>
        )}

        {!loadingAssignments && assignments.length > 0 && (
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
                  <div style={{ display: 'flex', gap: 8 }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => selectStatus(a.id, opt.key)}
                        style={{
                          flex: 1, padding: '9px 4px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
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

        {!loadingAssignments && assignments.length > 0 && (
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
              {submitting ? 'Saving…' : submitted ? '✅ Update Submission' : `Done — Submit Attendance (${markedCount}/${totalCount})`}
            </button>
          </>
        )}

        <button
          onClick={() => { setTutorName(null); setPhone(''); setAssignments([]); setExisting({}); setSelections({}); setSubmitted(false); }}
          style={{ marginTop: 16, width: '100%', padding: '10px', fontSize: 12.5, fontWeight: 600, color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Not you? Switch account
        </button>
      </div>
    </div>
  );
}