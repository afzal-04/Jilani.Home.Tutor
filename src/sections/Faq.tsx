'use client';
// src/sections/Faq.tsx
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import styles from './Faq.module.css';

// ── FAQ Data with Categories ──────────────────────────────────────────────────

const categories = [
  { label: 'All',              key: 'all' },
  { label: '💰 Fees',          key: 'fees' },
  { label: '📚 Subjects',      key: 'subjects' },
  { label: '🏆 Competitive',   key: 'competitive' },
  { label: '🎨 Summer / Arts', key: 'summer' },
  { label: '👩‍🏫 Tutors',       key: 'tutors' },
];

const faqs = [
  // ── Fees
  {
    cat: 'fees',
    q: 'What is the fee for a home tutor in Raipur?',
    a: 'Fees depend on the class, subject, and number of sessions per week. We first provide a FREE demo class. After that, you can discuss the fee directly with the tutor. Generally fees range from ₹1500–₹5000/month depending on the class level.',
  },
  {
    cat: 'fees',
    q: 'Is the first demo class really free?',
    a: 'Yes, absolutely! The first demo class is 100% free with no obligation. You can evaluate the tutor and decide if you want to continue. Only after you are satisfied do you pay.',
  },
  {
    cat: 'fees',
    q: 'How do I pay the tutor fees?',
    a: 'You can pay the tutor directly via cash, UPI, or bank transfer. We recommend monthly payments. Our team will guide you on the fee structure after the demo class.',
  },

  // ── General / Areas
  {
    cat: 'subjects',
    q: 'How quickly will you find a tutor for my child?',
    a: 'We match parents with the right tutor within 24 hours of registration. In most cases, the demo class is scheduled within 2 days of your enquiry.',
  },
  {
    cat: 'subjects',
    q: 'Do you provide tutors across all areas of Raipur?',
    a: 'Yes! We have tutors across Shankar Nagar, Civil Lines, Pandri, Telibandha, Tatibandh, Devendra Nagar, Pachpedi Naka, Avanti Vihar, Mowa, Rajendra Nagar, and most other areas in Raipur.',
  },
  {
    cat: 'subjects',
    q: 'What subjects do your tutors teach?',
    a: 'Our tutors cover Maths, Science (Physics, Chemistry, Biology), English, Hindi, Social Science, Computer Science, Accountancy, and most other school subjects for Class 1 to 12. We also offer coaching for competitive exams and activity classes.',
  },
  {
    cat: 'subjects',
    q: 'Do you provide tutors for Class 10 and Class 12 board exams?',
    a: 'Yes! Board exam preparation is one of our specialties. We have experienced tutors specifically for Class 10 and Class 12 boards with a focus on Maths, Science, English and other subjects. Mock tests and revision sessions are included.',
  },

  // ── Competitive Exams
  {
    cat: 'competitive',
    q: 'Do you provide coaching for JEE and NEET?',
    a: 'Yes! We have expert tutors for JEE (Maths, Physics, Chemistry) and NEET (Physics, Chemistry, Biology) preparation at home. 1-on-1 personal coaching ensures focused preparation for these competitive exams.',
  },
  {
    cat: 'competitive',
    q: 'Do you provide coaching for government job exams?',
    a: 'Yes, we provide home tutoring for government job competitive exams including SSC, Railway, Bank exams, and state-level exams. Our tutors help with Maths, Reasoning, General Knowledge, and English sections.',
  },
  {
    cat: 'competitive',
    q: 'From which class should I start JEE / NEET preparation?',
    a: 'Ideally from Class 11 for best results. However we also offer crash courses and intensive preparation for students in Class 12. Early preparation from Class 9–10 with strong foundation in Maths and Science is highly recommended.',
  },

  // ── Summer / Arts / Activity Classes
  {
    cat: 'summer',
    q: 'Do you offer summer classes for children?',
    a: 'Yes! We offer summer classes during school holidays covering academic subjects, drawing and art, music and singing, and dance. These are great for keeping children engaged and learning new skills during vacations.',
  },
  {
    cat: 'summer',
    q: 'Do you provide drawing and art classes at home?',
    a: 'Yes! We have trained drawing and art tutors who come to your home. Classes cover pencil sketching, watercolor, poster making, and more — suitable for all age groups from Class 1 to 12.',
  },
  {
    cat: 'summer',
    q: 'Do you offer music and singing classes at home?',
    a: 'Yes! We provide home-based music classes including vocal/singing training, harmonium, and basic instruments. Our music tutors are trained and experienced in both classical and contemporary styles.',
  },
  {
    cat: 'summer',
    q: 'Do you offer dance classes at home?',
    a: 'Yes! We provide home dance classes covering classical dance (Bharatnatyam, Kathak), Bollywood dance, and western styles. Classes are available for children and adults at flexible timings.',
  },

  // ── Tutors
  {
    cat: 'tutors',
    q: 'Are your tutors verified and trustworthy?',
    a: 'Yes! All tutors go through a verification process before being onboarded. We check their qualifications, experience, and conduct a personal interview. Your child\'s safety and quality education is our top priority.',
  },
  {
    cat: 'tutors',
    q: 'Can I request a female tutor for my daughter?',
    a: 'Absolutely! You can specify your preference for a male or female tutor when registering. We will do our best to match you with a tutor of your preferred gender.',
  },
  {
    cat: 'tutors',
    q: 'I am a teacher. How do I join Jilani Home Tutor?',
    a: 'Click the "I\'m a Tutor" tab in the registration section and fill in your details including your qualification, subjects, and area. Our team will contact you within 24 hours to complete the onboarding process.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Faq() {
  const [open,      setOpen]      = useState<number | null>(null);
  const [activecat, setActivecat] = useState('all');

  const filtered = activecat === 'all' ? faqs : faqs.filter(f => f.cat === activecat);

  return (
    <section className={styles.section} id="faq">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Common Questions</span></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-title">Frequently Asked Questions</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="sec-sub">
            Everything you need to know about our home tutoring service in Raipur.
          </p>
        </Reveal>

        {/* Category filters */}
        <Reveal delay={150}>
          <div className={styles.filters}>
            {categories.map(c => (
              <button
                key={c.key}
                className={`${styles.filterBtn} ${activecat === c.key ? styles.filterActive : ''}`}
                onClick={() => { setActivecat(c.key); setOpen(null); }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* FAQ list */}
        <div className={styles.list}>
          {filtered.map((f, i) => (
            <Reveal key={`${activecat}-${i}`} delay={i * 40}>
              <div className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}>
                <button
                  className={styles.question}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className={`${styles.icon} ${open === i ? styles.rotated : ''}`}>+</span>
                </button>
                <div className={`${styles.answer} ${open === i ? styles.answerOpen : ''}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA below FAQ */}
        <Reveal delay={100}>
          <div className={styles.ctaBox}>
            <p>Still have questions? We&apos;re happy to help!</p>
            <div className={styles.ctaBtns}>
              <a href="#register" className={styles.ctaPrimary}>📅 Book Free Demo</a>
              <a href="https://wa.me/917999854628" target="_blank" rel="noreferrer" className={styles.ctaWa}>
                💬 Ask on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}