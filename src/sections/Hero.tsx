'use client';
// src/sections/Hero.tsx
import { useEffect, useState } from 'react';
import { getSiteConfig, registerParent } from '@/lib/firestore';
import { RAIPUR_AREAS, PARENT_CLASSES, PARENT_SUBJECTS } from './Register';
import styles from './Hero.module.css';

export default function Hero() {
  const [heroSubtext, setHeroSubtext] = useState(
    'Personalized 1-on-1 home tuition for Class 1–12. Maths, Science, English & more. Real teachers, real results.'
  );
  const [offerBanner,  setOfferBanner]  = useState('');
  const [whatsappHref, setWhatsappHref] = useState('https://wa.me/917999854628');

  // Form state
  const [form, setForm]           = useState({ name: '', phone: '', area: '', class: '', subject: '' });
  const [customArea, setCustomArea] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    getSiteConfig().then(cfg => {
      if (!cfg) return;
      if (cfg.heroSubtext)    setHeroSubtext(cfg.heroSubtext);
      if (cfg.offerBanner)    setOfferBanner(cfg.offerBanner);
      if (cfg.whatsappNumber) setWhatsappHref(`https://wa.me/${cfg.whatsappNumber}`);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const finalArea = form.area === 'Other Area' ? (customArea.trim() || 'Other Area') : form.area;
    try {
      await registerParent({ ...form, area: finalArea });
      setSuccess(true);
      setForm({ name: '', phone: '', area: '', class: '', subject: '' });
      setCustomArea('');
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      {offerBanner && (
        <div className={styles.offerStrip}>{offerBanner}</div>
      )}

      <section className={styles.hero}>
        <div className={styles.bg} />
        <div className={styles.dots} />

        <div className={styles.content}>
          {/* Left: headline */}
          <div className={styles.left}>
            <div className={styles.badge}>⭐ #1 Home Tutor Service in Raipur</div>
            <h1 className={styles.heading}>
              Your Child Deserves <em>Expert</em> Attention at Home
            </h1>
            <p className={styles.sub}>{heroSubtext}</p>
            <div className={styles.btns}>
              <a href="#register" className="btn-primary">📅 Book FREE Demo</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline">
                💬 WhatsApp Us
              </a>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><span className={styles.statNum}>500+</span><span className={styles.statLabel}>Students</span></div>
              <div className={styles.stat}><span className={styles.statNum}>95%</span><span className={styles.statLabel}>Pass Rate</span></div>
              <div className={styles.stat}><span className={styles.statNum}>5+</span><span className={styles.statLabel}>Years</span></div>
            </div>
          </div>

          {/* Right: quick enquiry form */}
          <div className={styles.card}>
            <h3>🎯 Quick Enquiry</h3>
            <form onSubmit={handleSubmit} className={styles.form}>

              <div className="form-group">
                <label>Parent Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label>Area in Raipur</label>
                <select
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  required
                >
                  <option value="">Select Your Area</option>
                  {RAIPUR_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
                {/* Show text input when Other Area is selected */}
                {form.area === 'Other Area' && (
                  <input
                    type="text"
                    value={customArea}
                    onChange={e => setCustomArea(e.target.value)}
                    placeholder="Type your area name"
                    required
                    className={styles.otherInput}
                  />
                )}
              </div>

              <div className="form-group">
                <label>Class</label>
                <select
                  value={form.class}
                  onChange={e => setForm({ ...form, class: e.target.value })}
                  required
                >
                  <option value="">Select Class</option>
                  {PARENT_CLASSES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Subject Needed</label>
                <select
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {PARENT_SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : '📅 Book Free Demo'}
              </button>

              {success && (
                <div className="success-msg">✅ Submitted! We&apos;ll call you within 24 hours.</div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
