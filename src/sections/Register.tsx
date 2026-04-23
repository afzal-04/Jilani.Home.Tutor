'use client';
// src/sections/Register.tsx
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import { registerParent, registerTutor } from '@/lib/firestore';
import styles from './Register.module.css';

type Tab = 'parent' | 'tutor';

const CLASSES  = ['Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12'];
const SUBJECTS = ['Maths', 'Science', 'English', 'Maths + Science', 'All Subjects'];
const QUALS    = ['B.Sc', 'B.Com', 'B.A', 'B.Tech / B.E', 'M.Sc', 'M.Tech', 'B.Ed', 'Other'];
const T_CLASSES = [...CLASSES, 'All Classes'];

export default function Register() {
  const [tab, setTab] = useState<Tab>('parent');

  // Parent form
  const [pForm, setPForm] = useState({ name: '', phone: '', area: '', class: '', subject: '' });
  const [pLoading, setPLoading] = useState(false);
  const [pSuccess, setPSuccess] = useState(false);

  // Tutor form
  const [tForm, setTForm] = useState({ name: '', phone: '', area: '', qualification: '', subjects: '', classes: '' });
  const [tLoading, setTLoading] = useState(false);
  const [tSuccess, setTSuccess] = useState(false);

  async function handleParent(e: React.FormEvent) {
    e.preventDefault();
    setPLoading(true);
    try {
      await registerParent(pForm);
      setPSuccess(true);
      setPForm({ name: '', phone: '', area: '', class: '', subject: '' });
      setTimeout(() => setPSuccess(false), 5000);
    } catch { alert('Something went wrong. Please try again.'); }
    setPLoading(false);
  }

  async function handleTutor(e: React.FormEvent) {
    e.preventDefault();
    setTLoading(true);
    try {
      await registerTutor(tForm);
      setTSuccess(true);
      setTForm({ name: '', phone: '', area: '', qualification: '', subjects: '', classes: '' });
      setTimeout(() => setTSuccess(false), 5000);
    } catch { alert('Something went wrong. Please try again.'); }
    setTLoading(false);
  }

  return (
    <section className={styles.section} id="register">
      <div className="sec-inner">
        <Reveal><span className="sec-tag sec-tag--gold">Get Started Today</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title sec-title--white">Register Now — It&apos;s Free!</h2></Reveal>
        <Reveal delay={120}><p className="sec-sub sec-sub--muted" style={{ marginBottom: 36 }}>Are you a parent looking for a tutor, or a tutor looking for students?</p></Reveal>

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

        {/* Parent Form */}
        {tab === 'parent' && (
          <Reveal delay={80}>
            <form onSubmit={handleParent} className={styles.formGrid}>
              <div className="form-group">
                <label>Parent / Guardian Name *</label>
                <input value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} placeholder="Full name" required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={pForm.phone} onChange={e => setPForm({ ...pForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-group">
                <label>Area / Locality in Raipur *</label>
                <input value={pForm.area} onChange={e => setPForm({ ...pForm, area: e.target.value })} placeholder="e.g. Shankar Nagar, Pandri" required />
              </div>
              <div className="form-group">
                <label>Class Needed *</label>
                <select value={pForm.class} onChange={e => setPForm({ ...pForm, class: e.target.value })} required>
                  <option value="">Select Class</option>
                  {CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={`form-group ${styles.fullCol}`}>
                <label>Subject(s) Needed *</label>
                <select value={pForm.subject} onChange={e => setPForm({ ...pForm, subject: e.target.value })} required>
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
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

        {/* Tutor Form */}
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
                <label>Area / Locality in Raipur *</label>
                <input value={tForm.area} onChange={e => setTForm({ ...tForm, area: e.target.value })} placeholder="Where can you teach?" required />
              </div>
              <div className="form-group">
                <label>Highest Qualification *</label>
                <select value={tForm.qualification} onChange={e => setTForm({ ...tForm, qualification: e.target.value })} required>
                  <option value="">Select</option>
                  {QUALS.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subjects You Can Teach *</label>
                <input value={tForm.subjects} onChange={e => setTForm({ ...tForm, subjects: e.target.value })} placeholder="e.g. Maths, Physics, Chemistry" required />
              </div>
              <div className="form-group">
                <label>Classes You Can Teach *</label>
                <select value={tForm.classes} onChange={e => setTForm({ ...tForm, classes: e.target.value })} required>
                  <option value="">Select</option>
                  {T_CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
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
