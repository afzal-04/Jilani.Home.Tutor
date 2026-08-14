'use client';
// src/sections/Footer.tsx
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { registerParent } from '@/lib/firestore';
import { isValidIndianMobile, cleanPhoneForStorage } from '@/lib/phone';
import styles from './Footer.module.css';

export default function Footer() {
  const [quickPhone, setQuickPhone] = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');

  async function handleQuickCallback(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!isValidIndianMobile(quickPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      await registerParent({
        name: 'Footer Quick Lead',
        phone: cleanPhoneForStorage(quickPhone),
        area: 'Raipur',
        class: 'General Enquiry',
        subject: 'General Enquiry',
        source: 'Footer Interactive Widget',
      });
      setSuccess(true);
      setQuickPhone('');
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Failed to submit. Please WhatsApp us directly.');
    }
    setLoading(false);
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* ── Left Interactive Brand Column ── */}
        <div className={styles.colBrandCard}>
          <div className={styles.brandHeader}>
            <div className={styles.logoWrap}>
              <div className={styles.logoIcon}>📚</div>
              <div>
                <span className={styles.brandTitle}>Jilani Home Tutor</span>
                <span className={styles.brandTagline}>Raipur &bull; Chhattisgarh</span>
              </div>
            </div>
            <div className={styles.liveStatus}>
              <span className={styles.pulseDot} />
              <span>Available Now</span>
            </div>
          </div>

          <p className={styles.brandDesc}>
            Raipur&apos;s premier 1-on-1 home tuition service. Trusted by 1000+ families for verified tutors and guaranteed score improvements.
          </p>

          {/* Interactive Instant Callback Form */}
          <div className={styles.quickBox}>
            <div className={styles.quickHeader}>
              <span className={styles.quickTitle}>⚡ Request Instant Callback</span>
              <span className={styles.quickSub}>We call back within 15 mins</span>
            </div>

            <form onSubmit={handleQuickCallback} className={styles.quickForm}>
              <input
                type="tel"
                value={quickPhone}
                onChange={e => setQuickPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                required
                className={styles.quickInput}
              />
              <button type="submit" className={styles.quickSubmitBtn} disabled={loading}>
                {loading ? 'Sending...' : 'Call Me 📞'}
              </button>
            </form>

            {error ? <div className={styles.quickError}>{error}</div> : null}
            {success ? (
              <div className={styles.quickSuccess}>
                ✅ Received! We&apos;ll call you within 15 mins.
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className={styles.ctaBtns}>
            <a href="tel:+917999854628" className={styles.phoneBtn}>
              📞 Call: +91 79998 54628
            </a>
            <a
              href="https://wa.me/917999854628"
              target="_blank"
              rel="noreferrer"
              className={styles.waBtn}
            >
              💬 WhatsApp Us
            </a>
          </div>

          {/* Social Links & Location */}
          <div className={styles.socialBar}>
            <span className={styles.socialLabel}>Direct Connect:</span>
            <div className={styles.socialLinks}>
              <a href="https://wa.me/917999854628" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="WhatsApp" title="Chat on WhatsApp">
                💬 WhatsApp
              </a>
              <a href="tel:+917999854628" className={styles.socialIcon} aria-label="Phone" title="Call directly">
                📞 Call
              </a>
              <a href="https://www.google.com/maps/place/Jilani+Home+Tutor+-+Home+Tuition+in+Raipur/data=!4m2!3m1!1s0x0:0x43920a5ba8fc6790?sa=X&ved=1t:2428&hl=en-GB&ictx=111" target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Location" title="Raipur, Chhattisgarh">
                📍 Raipur HQ
              </a>
            </div>
          </div>
        </div>

        <div className={styles.colLinks}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="#services">Our Services</Link></li>
            <li><Link href="/find-tutor">Find a Tutor</Link></li>
            <li><Link href="#register">Register (Parent / Tutor)</Link></li>
            <li><Link href="#testimonials">Parent Reviews</Link></li>
            <li><Link href="#faq">Frequently Asked Questions</Link></li>
          </ul>
        </div>

        <div className={styles.colServices}>
          <h4 className={styles.colTitle}>Classes Covered</h4>
          <ul className={styles.linkList}>
            <li><Link href="#services">Primary (Class 1–5)</Link></li>
            <li><Link href="#services">Middle School (Class 6–8)</Link></li>
            <li><Link href="#services">Class 10 Board Prep</Link></li>
            <li><Link href="#services">Class 12 Boards & Entrance</Link></li>
            <li><Link href="#services">JEE & NEET Home Tuition</Link></li>
            <li><Link href="#services">Drawing, Music & Dance</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.areasRow}>
        <span className={styles.areasLabel}>📍 Serving All Areas in Raipur:</span>
        <div className={styles.areaTags}>
          <span>Shankar Nagar</span>
          <span>Civil Lines</span>
          <span>Pandri</span>
          <span>Telibandha</span>
          <span>Tatibandh</span>
          <span>Devendra Nagar</span>
          <span>Pachpedi Naka</span>
          <span>Avanti Vihar</span>
          <span>Mowa</span>
          <span>Rajendra Nagar</span>
          <span>Khamardih</span>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.legalLinks}>
          <a href="#faq">Privacy Policy</a>
          <span className={styles.legalDot}>&bull;</span>
          <a href="#faq">Terms of Service</a>
          <span className={styles.legalDot}>&bull;</span>
          <a href="#register">Tutor Verification Guidelines</a>
        </div>
        <p>© {new Date().getFullYear()} Jilani Home Tutor, Raipur, Chhattisgarh. All rights reserved.</p>
        <p className={styles.subtext}>Best Home Tutor in Raipur · Guaranteed 1-on-1 Personal Attention</p>
      </div>
    </footer>
  );
}
