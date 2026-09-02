'use client';

// src/app/attendance/page.tsx

import { useState } from 'react';
import Link from 'next/link';

type AttendanceStatus = 'present' | 'absent' | 'holiday' | 'cancelled';

interface Assignment {
  id: string;
  parentName: string;
  subject: string;
  classLevel: string;
  tutorName: string;
}

const todayDisplay = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const STATUS_OPTIONS: {
  key: AttendanceStatus;
  label: string;
  icon: string;
  color: string;
}[] = [
  {
    key: 'present',
    label: 'Present',
    icon: '✅',
    color: '#1A7A4A',
  },
  {
    key: 'absent',
    label: 'Absent',
    icon: '❌',
    color: '#C0392B',
  },
  {
    key: 'holiday',
    label: 'Holiday',
    icon: '🏖️',
    color: '#C8941A',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    icon: '🚫',
    color: '#888',
  },
];

export default function TutorAttendancePage() {
  const [phone, setPhone] = useState('');
  const [tutorName, setTutorName] = useState<string | null>(null);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [existing, setExisting] = useState<
    Record<string, { id: string; status: AttendanceStatus }>
  >({});

  const [selections, setSelections] = useState<
    Record<string, AttendanceStatus>
  >({});

  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ─────────────────────────────────────────────
  // STEP 1: LOOK UP TUTOR
  // ─────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoginError('');

    const cleaned = phone.trim();

    if (!cleaned) return;

    setLoadingLogin(true);

    try {
      const res = await fetch('/api/attendance/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: cleaned,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(
          data.error === 'No tutor found with that phone number'
            ? "We couldn't find a tutor with that phone number. Please check and try again."
            : 'Something went wrong. Please try again.'
        );

        setLoadingLogin(false);
        return;
      }

      setTutorName(data.tutorName);
      setAssignments(data.assignments);
      setExisting(data.existing);

      const preFilled: Record<string, AttendanceStatus> = {};

      Object.entries(
        data.existing as Record<
          string,
          { status: AttendanceStatus }
        >
      ).forEach(([id, rec]) => {
        preFilled[id] = rec.status;
      });

      setSelections(preFilled);
    } catch (err) {
      console.error(err);

      setLoginError(
        'Something went wrong. Please try again.'
      );
    }

    setLoadingLogin(false);
  }

  // ─────────────────────────────────────────────
  // SELECT STATUS
  //
  // Single click:
  // - Selects the status
  // - Switches from another status
  //
  // Double click:
  // - Handled separately below
  // ─────────────────────────────────────────────

  function selectStatus(
    assignmentId: string,
    status: AttendanceStatus
  ) {
    setSelections((prev) => ({
      ...prev,
      [assignmentId]: status,
    }));

    setSubmitted(false);
  }

  // ─────────────────────────────────────────────
  // DESELECT STATUS
  //
  // Double-clicking / double-tapping the currently
  // selected status clears it.
  // ─────────────────────────────────────────────

  function deselectStatus(assignmentId: string) {
    setSelections((prev) => {
      const next = { ...prev };

      delete next[assignmentId];

      return next;
    });

    setSubmitted(false);
  }

  // ─────────────────────────────────────────────
  // SUBMIT ATTENDANCE
  // ─────────────────────────────────────────────

  async function handleSubmit() {
    if (Object.keys(selections).length === 0) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/attendance/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          selections,
        }),
      });

      if (!res.ok) {
        throw new Error('Submit failed');
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);

      alert(
        'Could not save attendance. Please check your connection and try again.'
      );
    }

    setSubmitting(false);
  }

  // ─────────────────────────────────────────────
  // SWITCH ACCOUNT
  // ─────────────────────────────────────────────

  function switchAccount() {
    setTutorName(null);
    setPhone('');
    setAssignments([]);
    setExisting({});
    setSelections({});
    setSubmitted(false);
  }

  // ─────────────────────────────────────────────
  // COUNTS
  // ─────────────────────────────────────────────

  const markedCount = Object.keys(selections).length;
  const totalCount = assignments.length;

  const allMarked =
    totalCount > 0 && markedCount === totalCount;

  // ─────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────

  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0A0F1E',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px',
    fontFamily: 'inherit',
    position: 'relative',
  };

  const card: React.CSSProperties = {
    width: '100%',
    maxWidth: 480,
    background: '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 20px 60px -20px rgba(0,0,0,.5)',
  };

  const backBtn: React.CSSProperties = {
    position: 'absolute',
    top: 16,
    left: 16,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 12.5,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
  };

  // ─────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────

  if (!tutorName) {
    return (
      <div style={wrap}>
        <Link href="/" style={backBtn}>
          ← Back to Website
        </Link>

        <div
          style={{
            marginBottom: 24,
            textAlign: 'center',
            color: '#fff',
            marginTop: 36,
          }}
        >
          <div
            style={{
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/logo.png"
              alt="Jilani Home Tutor Logo"
              style={{
                width: 72,
                height: 72,
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Jilani Home Tutor
          </div>

          <div
            style={{
              fontSize: 12.5,
              opacity: 0.6,
            }}
          >
            Daily Attendance Check-in
          </div>
        </div>

        <div style={card}>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: '0 0 6px',
            }}
          >
            Tutor Login
          </h1>

          <p
            style={{
              fontSize: 12.5,
              color: '#6B7280',
              margin: '0 0 18px',
            }}
          >
            Enter your registered phone number to mark
            today&apos;s attendance.
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: 15,
                border: '1.5px solid #e5e7eb',
                borderRadius: 10,
                marginBottom: 12,
              }}
              required
            />

            {loginError && (
              <p
                style={{
                  color: '#C0392B',
                  fontSize: 12.5,
                  marginBottom: 12,
                }}
              >
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 14.5,
                fontWeight: 700,
                color: '#fff',
                background:
                  'linear-gradient(135deg,#1A6FBF,#2c8ce0)',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                opacity: loadingLogin ? 0.6 : 1,
              }}
            >
              {loadingLogin
                ? 'Checking…'
                : 'Continue →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // ATTENDANCE SCREEN
  // ─────────────────────────────────────────────

  return (
    <div style={wrap}>
      <Link href="/" style={backBtn}>
        ← Back to Website
      </Link>

      <div
        style={{
          marginBottom: 20,
          textAlign: 'center',
          color: '#fff',
          marginTop: 36,
        }}
      >
        <div
          style={{
            fontSize: 15,
            opacity: 0.6,
          }}
        >
          {todayDisplay()}
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          Hi, {tutorName} 👋
        </div>
      </div>

      <div
        style={{
          ...card,
          maxWidth: 560,
        }}
      >
        {submitted ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 8px',
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 10,
              }}
            >
              ✅
            </div>

            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: '0 0 4px',
              }}
            >
              Attendance Submitted
            </h2>

            <p
              style={{
                fontSize: 12.5,
                color: '#6B7280',
                margin: '0 0 18px',
              }}
            >
              Marked {markedCount} of {totalCount}{' '}
              classes for today. Thank you!
            </p>

            <Link
              href="/"
              style={{
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 700,
                color: '#1A6FBF',
                textDecoration: 'none',
              }}
            >
              ← Back to Website
            </Link>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                margin: '0 0 4px',
              }}
            >
              Mark Today&apos;s Attendance
            </h2>

            <p
              style={{
                fontSize: 12,
                color: '#6B7280',
                margin: '0 0 18px',
              }}
            >
              Tap a status for each class. Tap another
              status to switch. Double-tap the selected
              status to clear it.
            </p>
          </>
        )}

        {loadingAssignments && (
          <p
            style={{
              fontSize: 13,
              color: '#6B7280',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            Loading your classes…
          </p>
        )}

        {!loadingAssignments &&
          assignments.length === 0 && (
            <p
              style={{
                fontSize: 13,
                color: '#6B7280',
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              No active assignments found for your
              account. Contact Jilani if this looks wrong.
            </p>
          )}

        {!submitted &&
          !loadingAssignments &&
          assignments.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {assignments.map((a) => {
                const selected = selections[a.id];

                return (
                  <div
                    key={a.id}
                    style={{
                      border: '1.5px solid #eef1f5',
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {a.parentName}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: '#6B7280',
                          }}
                        >
                          {a.subject} · {a.classLevel}
                        </div>
                      </div>

                      {selected && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: 100,
                            background:
                              (STATUS_OPTIONS.find(
                                (s) =>
                                  s.key === selected
                              )?.color || '#888') +
                              '20',
                            color:
                              STATUS_OPTIONS.find(
                                (s) =>
                                  s.key === selected
                              )?.color,
                          }}
                        >
                          {selected}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(2, 1fr)',
                        gap: 8,
                      }}
                    >
                      {STATUS_OPTIONS.map((opt) => {
                        const isSelected =
                          selected === opt.key;

                        return (
                          <button
                            key={opt.key}
                            type="button"

                            // SINGLE CLICK / TAP
                            onClick={() =>
                              selectStatus(
                                a.id,
                                opt.key
                              )
                            }

                            // DOUBLE CLICK / DOUBLE TAP
                            onDoubleClick={() => {
                              if (isSelected) {
                                deselectStatus(a.id);
                              }
                            }}

                            title={
                              isSelected
                                ? 'Double-click to deselect'
                                : undefined
                            }

                            style={{
                              padding: '9px 4px',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',

                              border: isSelected
                                ? `2px solid ${opt.color}`
                                : '1.5px solid #e5e7eb',

                              background: isSelected
                                ? opt.color + '15'
                                : '#fff',

                              color: isSelected
                                ? opt.color
                                : '#374151',

                              // Better mobile touch behavior
                              touchAction: 'manipulation',

                              // Prevent text selection while
                              // double tapping
                              userSelect: 'none',

                              WebkitUserSelect:
                                'none',

                              WebkitTapHighlightColor:
                                'transparent',
                            }}
                          >
                            {opt.icon} {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {!submitted &&
          !loadingAssignments &&
          assignments.length > 0 && (
            <>
              <p
                style={{
                  fontSize: 11.5,
                  color: '#9CA3AF',
                  textAlign: 'center',
                  margin: '14px 0 8px',
                }}
              >
                {markedCount} of {totalCount} marked
              </p>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  submitting || markedCount === 0
                }
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#fff',

                  background: allMarked
                    ? 'linear-gradient(135deg,#1A7A4A,#2ba85f)'
                    : 'linear-gradient(135deg,#1A6FBF,#2c8ce0)',

                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',

                  opacity:
                    submitting || markedCount === 0
                      ? 0.5
                      : 1,
                }}
              >
                {submitting
                  ? 'Saving…'
                  : `Done — Submit Attendance (${markedCount}/${totalCount})`}
              </button>
            </>
          )}

        {!submitted && (
          <button
            type="button"
            onClick={switchAccount}
            style={{
              marginTop: 16,
              width: '100%',
              padding: '10px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#6B7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Not you? Switch account
          </button>
        )}
      </div>
    </div>
  );
}