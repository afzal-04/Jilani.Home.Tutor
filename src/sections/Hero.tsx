'use client';
// src/sections/Hero.tsx
import { useEffect, useState } from 'react';
import { getSiteConfig } from '@/lib/firestore';
import { addParentLead, addTutorLead } from '@/lib/firestore';
import styles from './Hero.module.css';

export default function Hero() {
  const [heroSubtext, setHeroSubtext] = useState(
    'Looking for the best home tutor in Raipur? We provide experienced tutors for Class 1–12. Maths, Science, English. Get a FREE demo class today and see real improvement.'
  );
  const [offerBanner, setOfferBanner] = useState('');
  const [whatsappHref, setWhatsappHref] = useState('https://wa.me/917999854628');

  // Form state
  const [form, setForm] = useState({ name: '', phone: '', area: '', class: '', subject: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    setLoading(true);
    try {
      await addParentLead(form);
      setSuccess(true);
      setForm({ name: '', phone: '', area: '', class: '', subject: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <>
      {/* Dynamic offer strip from admin config */}
      {offerBanner && (
        <div className={styles.offerStrip}>{offerBanner}</div>
      )}

      <section className={styles.hero}>
        <div className={styles.bg} />
        <div className={styles.dots} />

        <div className={styles.content}>
          {/* Left: headline */}
          <div className={styles.left}>
            <div className={styles.badge}>⭐ Trusted Home Tutor Service in Raipur</div>
            <h1 className={styles.heading}>
              Your Child Deserves <em>Expert</em> Attention at Home
            </h1>
            <p className={styles.sub}>{heroSubtext}</p>
            <div className={styles.btns}>
              <a href="#register" className="btn-primary">📅 Book FREE Demo </a>
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
            <h3>🎯 Book Your Free Demo Class</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label>Parent Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="form-group">
                <label>Area in Raipur</label>
                <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. Shankar Nagar, Civil Lines" required />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required>
                  <option value="">Select Class</option>
                  <option>Class 1</option>
                  <option>Class 2</option>
                  <option>Class 3</option>
                  <option>Class 4</option>
                  <option>Class 5</option>
                  <option>Class 6</option>
                  <option>Class 7</option>
                  <option>Class 8</option>
                  <option>Class 9</option>
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                  <option> Competative Exam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject Needed</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select Subject</option>
                  <option>Maths</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>All Subjects</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Submitting...' : '📅 Book Free Demo'}
              </button>
              {success && (
                <div className="success-msg">
                  ✅ Request submitted! Our team will contact you within 24 hours.
                </div>
              )}            
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
