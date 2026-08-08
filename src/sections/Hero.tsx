'use client';
// src/sections/Hero.tsx
import { useEffect, useState } from 'react';
import { getSiteConfig, registerParent } from '@/lib/firestore';
import { RAIPUR_AREAS, PARENT_CLASSES, PARENT_SUBJECTS, DEFAULT_WHATSAPP_HREF } from '@/lib/options';
import { isValidIndianMobile, cleanPhoneForStorage } from '@/lib/phone';
import styles from './Hero.module.css';

const DEFAULT_SUBTEXT =
  'Personalized 1-on-1 home tuition for Class 1–12. Maths, Science, English & more. Real teachers, real results.';

export default function Hero() {
  const [heroSubtext, setHeroSubtext] = useState(DEFAULT_SUBTEXT);
  const [offerBanner, setOfferBanner] = useState('');
  const [whatsappHref, setWhatsappHref] = useState(DEFAULT_WHATSAPP_HREF);

  const [form, setForm] = useState({ name: '', phone: '', area: '', class: '', subject: '' });
  const [customArea, setCustomArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteConfig().then(cfg => {
      if (!cfg) return;
      if (cfg.heroSubtext) setHeroSubtext(cfg.heroSubtext);
      if (cfg.offerBanner) setOfferBanner(cfg.offerBanner);
      if (cfg.whatsappNumber) setWhatsappHref(`https://wa.me/${cfg.whatsappNumber}`);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isValidIndianMobile(form.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    const finalArea = form.area === 'Other Area' ? (customArea.trim() || 'Other Area') : form.area;
    try {
      await registerParent({
        ...form,
        phone: cleanPhoneForStorage(form.phone),
        area: finalArea,
        source: 'Website Hero Form',
      });
      setSuccess(true);
      setForm({ name: '', phone: '', area: '', class: '', subject: '' });
      setCustomArea('');
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us.');
    }
    setLoading(false);
  }

  return (
    <>
      {offerBanner ? <div className={styles.offerStrip}>{offerBanner}</div> : null}

      <section className={styles.hero}>
        <div className={styles.bg} />
        <div className={styles.dots} />

        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.badge}>✨ Trusted Home Tutors in Raipur</div>
            <h1 className={styles.heading}>
              Your Child Deserves <em>Expert</em> Attention at Home
            </h1>
            <p className={styles.sub}>{heroSubtext}</p>
            <div className={styles.btns}>
              <a href="#demo-form" className="btn-primary">📅 Book FREE Demo</a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline">
                💬 WhatsApp Us
              </a>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>500+</span>
                <span className={styles.statLabel}>Students</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>95%</span>
                <span className={styles.statLabel}>Pass Rate</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>5+</span>
                <span className={styles.statLabel}>Years</span>
              </div>
            </div>
          </div>

          <div className={styles.card} id="demo-form">
            <h3>🎯 Quick Enquiry</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label htmlFor="hero-name">Parent Name</label>
                <input
                  id="hero-name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hero-phone">Phone Number</label>
                <input
                  id="hero-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="hero-area">Area in Raipur</label>
                <select
                  id="hero-area"
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  required
                >
                  <option value="">Select Your Area</option>
                  {RAIPUR_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
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
                <label htmlFor="hero-class">Class</label>
                <select
                  id="hero-class"
                  value={form.class}
                  onChange={e => setForm({ ...form, class: e.target.value })}
                  required
                >
                  <option value="">Select Class</option>
                  {PARENT_CLASSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hero-subject">Subject Needed</label>
                <select
                  id="hero-subject"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {PARENT_SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {error ? <div className="error-msg" role="alert">{error}</div> : null}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : '📅 Book Free Demo'}
              </button>

              {success ? (
                <div className="success-msg">✅ Submitted! We&apos;ll call you within 24 hours.</div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
