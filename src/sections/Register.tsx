'use client';
// src/sections/Register.tsx
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { registerParent, registerTutor } from '@/lib/firestore';
import styles from './Register.module.css';

type Tab = 'parent' | 'tutor';

// ── Dropdown Options ──────────────────────────────────────────────────────────

export const PARENT_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10 (Board)',
  'Class 11', 'Class 12 (Board)',
  'Competitive Exam (JEE / NEET)',
  'Competitive Exam (Government Job)',
  'Summer Classes',
  'Drawing / Art Classes',
  'Music / Singing Classes',
  'Dance Classes',
  'Other',
];

export const PARENT_SUBJECTS = [
  'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Computer Science',
  'Maths + Science (Both)', 'All Subjects (Primary)',
  'All Subjects (Secondary)', 'JEE Preparation', 'NEET Preparation',
  'Drawing / Art', 'Music / Singing', 'Dance', 'Other',
];

export const RAIPUR_AREAS = [
  'Shankar Nagar', 'Civil Lines', 'Pandri', 'Telibandha', 'Tatibandh',
  'Devendra Nagar', 'Raipur Station Road', 'Pachpedi Naka', 'Avanti Vihar',
  'Byron Bazar', 'Mowa', 'Khamardih', 'Fafadih', 'Rajendra Nagar',
  'Kabir Nagar', 'Gopal Nagar', 'New Rajendra Nagar', 'Shanti Nagar',
  'Other Area',
];

export const TUTOR_CLASSES = [
  'Pre-Primary (Nursery / LKG / UKG)',
  'Class 1–5 (Primary)',
  'Class 6–8 (Middle)',
  'Class 9–10 (Board)',
  'Class 11–12 (Senior)',
  'Competitive Exams',
  'Summer / Activity Classes',
];

export const TUTOR_SUBJECTS = [
  'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Computer Science',
  'Accountancy / Commerce', 'Economics',
  'JEE Coaching', 'NEET Coaching',
  'Drawing / Art', 'Music / Singing', 'Dance',
];

export const QUALIFICATIONS = [
  '12th Pass', 'Pursuing Graduation',
  'B.A', 'B.Sc', 'B.Com', 'B.Tech / B.E', 'BCA', 'B.Ed',
  'M.A', 'M.Sc', 'M.Com', 'M.Tech', 'MBA', 'PhD', 'Other',
];

const GENDERS = ['Male', 'Female', 'Other'];

// ── Reusable Area Selector ────────────────────────────────────────────────────

function AreaSelect({ value, customValue, onChange, onCustomChange }: {
  value: string; customValue: string;
  onChange: (v: string) => void; onCustomChange: (v: string) => void;
}) {
  return (
    <>
      <select value={value} onChange={e => onChange(e.target.value)} required>
        <option value="">Select Your Area</option>
        {RAIPUR_AREAS.map(a => <option key={a}>{a}</option>)}
      </select>
      {value === 'Other Area' && (
        <input
          type="text" value={customValue}
          onChange={e => onCustomChange(e.target.value)}
          placeholder="Please type your area / locality name"
          required className={styles.otherInput}
        />
      )}
    </>
  );
}

// ── Multi-Select Checkbox Group ───────────────────────────────────────────────

function MultiCheckGroup({ options, selected, onChange, label }: {
  options: string[]; selected: string[];
  onChange: (vals: string[]) => void; label: string;
}) {
  function toggle(val: string) {
    onChange(selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]
    );
  }
  return (
    <div className={styles.checkGroup}>
      <div className={styles.checkLabel}>{label}</div>
      <div className={styles.checkGrid}>
        {options.map(opt => (
          <label key={opt} className={`${styles.checkItem} ${selected.includes(opt) ? styles.checkSelected : ''}`}>
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className={styles.checkInput} />
            {opt}
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className={styles.selectedCount}>
          ✅ {selected.length} selected: {selected.join(', ')}
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Register() {
  const [tab, setTab] = useState<Tab>('parent');

  // Parent form
  const [pForm, setPForm]             = useState({ name: '', phone: '', area: '', class: '', subject: '' });
  const [pCustomArea, setPCustomArea] = useState('');
  const [pCustomClass, setPCustomClass] = useState('');
  const [pCustomSubject, setPCustomSubject] = useState('');
  const [pLoading, setPLoading]       = useState(false);
  const [pSuccess, setPSuccess]       = useState(false);

  // Tutor form
  const [tForm, setTForm]             = useState({ name: '', phone: '', gender: '', area: '', qualification: '' });
  const [tCustomArea, setTCustomArea] = useState('');
  const [tCustomQual, setTCustomQual] = useState('');
  const [tClasses,    setTClasses]    = useState<string[]>([]);
  const [tSubjects,   setTSubjects]   = useState<string[]>([]);
  const [tLoading, setTLoading]       = useState(false);
  const [tSuccess, setTSuccess]       = useState(false);

  function resolveArea(area: string, custom: string) {
    return area === 'Other Area' ? (custom.trim() || 'Other Area') : area;
  }

  async function handleParent(e: React.FormEvent) {
    e.preventDefault();
    const finalClass   = pForm.class   === 'Other' ? (pCustomClass.trim()   || 'Other') : pForm.class;
    const finalSubject = pForm.subject === 'Other' ? (pCustomSubject.trim() || 'Other') : pForm.subject;
    setPLoading(true);
    try {
      await registerParent({ ...pForm, area: resolveArea(pForm.area, pCustomArea), class: finalClass, subject: finalSubject });
      setPSuccess(true);
      setPForm({ name: '', phone: '', area: '', class: '', subject: '' });
      setPCustomArea(''); setPCustomClass(''); setPCustomSubject('');
      setTimeout(() => setPSuccess(false), 5000);
    } catch { alert('Something went wrong. Please try again.'); }
    setPLoading(false);
  }

  async function handleTutor(e: React.FormEvent) {
    e.preventDefault();
    if (tClasses.length === 0)  { alert('Please select at least one class you can teach.');   return; }
    if (tSubjects.length === 0) { alert('Please select at least one subject you can teach.'); return; }
    const finalQual = tForm.qualification === 'Other' ? (tCustomQual.trim() || 'Other') : tForm.qualification;
    setTLoading(true);
    try {
      await registerTutor({
        ...tForm, qualification: finalQual,
        area: resolveArea(tForm.area, tCustomArea),
        classes: tClasses.join(', '),
        subjects: tSubjects.join(', '),
      });
      setTSuccess(true);
      setTForm({ name: '', phone: '', gender: '', area: '', qualification: '' });
      setTCustomArea(''); setTCustomQual('');
      setTClasses([]); setTSubjects([]);
      setTimeout(() => setTSuccess(false), 5000);
    } catch { alert('Something went wrong. Please try again.'); }
    setTLoading(false);
  }

  return (
    <section className={styles.section} id="register">
      <div className="sec-inner">
        <Reveal><span className="sec-tag sec-tag--gold">Get Started Today</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title sec-title--white">Register Now — It&apos;s Free!</h2></Reveal>
        <Reveal delay={120}>
          <p className="sec-sub sec-sub--muted" style={{ marginBottom: 36 }}>
            Are you a parent looking for a tutor, or a tutor looking for students?
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={160}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'parent' ? styles.active : ''}`} onClick={() => setTab('parent')}>
              👨‍👩‍👧 I&apos;m a Parent
            </button>
            <button className={`${styles.tab} ${tab === 'tutor' ? styles.active : ''}`} onClick={() => setTab('tutor')}>
              👩‍🏫 I&apos;m a Tutor
            </button>
          </div>
        </Reveal>

        {/* ── Parent Form ── */}
        {tab === 'parent' && (
          <Reveal delay={80}>
            <form onSubmit={handleParent} className={styles.formGrid}>

              <div className="form-group">
                <label>Parent / Guardian Name *</label>
                <input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} placeholder="Your full name" required />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={pForm.phone} onChange={e => setPForm({ ...pForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>

              <div className="form-group">
                <label>Area in Raipur *</label>
                <AreaSelect value={pForm.area} customValue={pCustomArea}
                  onChange={v => setPForm({ ...pForm, area: v })} onCustomChange={setPCustomArea} />
              </div>

              {/* Class with Nursery/LKG/UKG + Other */}
              <div className="form-group">
                <label>Class / Grade Needed *</label>
                <select value={pForm.class} onChange={e => setPForm({ ...pForm, class: e.target.value })} required>
                  <option value="">Select Class</option>
                  {PARENT_CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
                {pForm.class === 'Other' && (
                  <input type="text" value={pCustomClass}
                    onChange={e => setPCustomClass(e.target.value)}
                    placeholder="Please describe the class / grade"
                    required className={styles.otherInput} />
                )}
              </div>

              {/* Subject with Other option */}
              <div className={`form-group ${styles.fullCol}`}>
                <label>Subject Needed *</label>
                <select value={pForm.subject} onChange={e => setPForm({ ...pForm, subject: e.target.value })} required>
                  <option value="">Select Subject</option>
                  {PARENT_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                {pForm.subject === 'Other' && (
                  <input type="text" value={pCustomSubject}
                    onChange={e => setPCustomSubject(e.target.value)}
                    placeholder="Please describe the subject you need"
                    required className={styles.otherInput} />
                )}
              </div>

              <div className={styles.fullCol}>
                <button type="submit" className="btn-primary" disabled={pLoading}>
                  {pLoading ? 'Submitting...' : '📅 Book My Free Demo'}
                </button>
                {pSuccess && <div className="success-msg">✅ Thank you! We&apos;ll call you within 24 hours to confirm your free demo class.</div>}
              </div>

            </form>
          </Reveal>
        )}

        {/* ── Tutor Form ── */}
        {tab === 'tutor' && (
          <Reveal delay={80}>
            <form onSubmit={handleTutor} className={styles.formGrid}>

              <div className="form-group">
                <label>Full Name *</label>
                <input value={tForm.name} onChange={e => setTForm({ ...tForm, name: e.target.value })} placeholder="Your full name" required />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={tForm.phone} onChange={e => setTForm({ ...tForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select value={tForm.gender} onChange={e => setTForm({ ...tForm, gender: e.target.value })} required>
                  <option value="">Select Gender</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Area in Raipur *</label>
                <AreaSelect value={tForm.area} customValue={tCustomArea}
                  onChange={v => setTForm({ ...tForm, area: v })} onCustomChange={setTCustomArea} />
              </div>

              {/* Qualification with Other */}
              <div className={`form-group ${styles.fullCol}`}>
                <label>Highest Qualification *</label>
                <select value={tForm.qualification} onChange={e => setTForm({ ...tForm, qualification: e.target.value })} required>
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                </select>
                {tForm.qualification === 'Other' && (
                  <input type="text" value={tCustomQual}
                    onChange={e => setTCustomQual(e.target.value)}
                    placeholder="Please enter your qualification"
                    required className={styles.otherInput} />
                )}
              </div>

              {/* Multi-select: Classes — includes Pre-Primary */}
              <div className={styles.fullCol}>
                <MultiCheckGroup
                  label="Classes You Can Teach * (select all that apply)"
                  options={TUTOR_CLASSES}
                  selected={tClasses}
                  onChange={setTClasses}
                />
              </div>

              {/* Multi-select: Subjects */}
              <div className={styles.fullCol}>
                <MultiCheckGroup
                  label="Subjects You Can Teach * (select all that apply)"
                  options={TUTOR_SUBJECTS}
                  selected={tSubjects}
                  onChange={setTSubjects}
                />
              </div>

              <div className={styles.fullCol}>
                <button type="submit" className="btn-primary" disabled={tLoading}>
                  {tLoading ? 'Submitting...' : '🎓 Join as Tutor'}
                </button>
                {tSuccess && <div className="success-msg">✅ Thank you! Our team will contact you within 24 hours.</div>}
              </div>

            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}