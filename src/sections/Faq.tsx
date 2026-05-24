'use client';
// src/sections/Faq.tsx
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import styles from './Faq.module.css';

const categories = [
  { label: 'All',              key: 'all' },
  { label: '💰 Fees',          key: 'fees' },
  { label: '📚 Subjects',      key: 'subjects' },
  { label: '🏆 Competitive',   key: 'competitive' },
  { label: '🎨 Summer / Arts', key: 'summer' },
  { label: '👩‍🏫 Tutors',       key: 'tutors' },
];

const faqs = [
  { cat: 'fees',        q: 'What is the fee for a home tutor in Raipur?',          a: 'Fees depend on the class, subject, and sessions per week. We first provide a FREE demo class. Generally fees range from ₹1500–₹5000/month depending on the class level.' },
  { cat: 'fees',        q: 'Is the first demo class really free?',                   a: 'Yes, absolutely! The first demo class is 100% free with no obligation. Evaluate the tutor and decide if you want to continue. Only after you are satisfied do you pay.' },
  { cat: 'fees',        q: 'How do I pay the tutor fees?',                           a: 'You need to pay fees to us via cash, UPI, or bank transfer. We recommend monthly payments. Our team guides you on the fee structure after the demo class.' },
  { cat: 'subjects',    q: 'How quickly will you find a tutor for my child?',        a: 'We match parents with the right tutor within 24 hours of registration. In most cases, the demo class is scheduled within 2 days of your enquiry.' },
  { cat: 'subjects',    q: 'Do you provide tutors across all areas of Raipur?',      a: 'Yes! We have tutors across Shankar Nagar, Civil Lines, Pandri, Telibandha, Tatibandh, Devendra Nagar, Pachpedi Naka, Avanti Vihar, Mowa, Rajendra Nagar, and most other areas in Raipur.' },
  { cat: 'subjects',    q: 'What subjects do your tutors teach?',                    a: 'Our tutors cover Maths, Science (Physics, Chemistry, Biology), English, Hindi, Social Science, Computer Science, Accountancy, and most school subjects for Class 1–12. We also offer competitive exam coaching and activity classes.' },
  { cat: 'subjects',    q: 'Do you provide tutors for Class 10 and Class 12 boards?', a: 'Yes! Board exam preparation is our specialty. We have experienced tutors specifically for Class 10 and 12 boards with focus on Maths, Science, English. Mock tests and revision sessions are included.' },
  { cat: 'competitive', q: 'Do you provide coaching for JEE and NEET?',              a: 'Yes! We have expert tutors for JEE (Maths, Physics, Chemistry) and NEET (Physics, Chemistry, Biology) at home. 1-on-1 personal coaching ensures focused preparation.' },
  { cat: 'competitive', q: 'Do you provide coaching for government job exams?',      a: 'Yes, we provide home tutoring for SSC, Railway, Bank exams, and state-level exams. Our tutors help with Maths, Reasoning, General Knowledge, and English sections.' },
  { cat: 'competitive', q: 'From which class should I start JEE / NEET preparation?', a: 'Ideally from Class 11 for best results. We also offer crash courses for Class 12 students. Early preparation from Class 9–10 with strong Maths and Science foundation is highly recommended.' },
  { cat: 'summer',      q: 'Do you offer summer classes for children?',              a: 'Yes! We offer summer classes during school holidays covering academic subjects, drawing and art, music and singing, and dance. Great for keeping children engaged during vacations.' },
  { cat: 'summer',      q: 'Do you provide drawing and art classes at home?',        a: 'Yes! We have trained art tutors who come to your home. Classes cover pencil sketching, watercolor, poster making, and more — suitable for all age groups from Class 1 to 12.' },
  { cat: 'summer',      q: 'Do you offer music and singing classes at home?',        a: 'Yes! We provide home-based music classes including vocal/singing training, harmonium, and basic instruments. Tutors are trained in both classical and contemporary styles.' },
  { cat: 'summer',      q: 'Do you offer dance classes at home?',                   a: 'Yes! We provide home dance classes covering classical dance (Bharatnatyam, Kathak), Bollywood, and western styles. Available for children and adults at flexible timings.' },
  { cat: 'tutors',      q: 'Are your tutors verified and trustworthy?',              a: 'Yes! All tutors go through verification before onboarding. We check qualifications, experience, and conduct a personal interview. Your child\'s safety and quality education is our top priority.' },
  { cat: 'tutors',      q: 'Can I request a female tutor for my daughter?',          a: 'Absolutely! You can specify your gender preference when registering. We will do our best to match you with a tutor of your preferred gender.' },
  { cat: 'tutors',      q: 'I am a teacher. How do I join Jilani Home Tutor?',       a: 'Click the "I\'m a Tutor" tab in the registration section, fill in your details. Our team will contact you within 24 hours to complete onboarding.' },
];

const INITIAL_SHOW = 4;

export default function Faq() {
  const [open,      setOpen]      = useState<number | null>(null);
  const [activecat, setActivecat] = useState('all');
  const [showAll,   setShowAll]   = useState(false);

  const filtered  = activecat === 'all' ? faqs : faqs.filter(f => f.cat === activecat);
  const visible   = showAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const remaining = filtered.length - INITIAL_SHOW;

  function handleCatChange(key: string) {
    setActivecat(key);
    setOpen(null);
    setShowAll(false);
  }

  return (
    <section className={styles.section} id="faq">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Common Questions</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title">Frequently Asked Questions</h2></Reveal>
        <Reveal delay={120}>
          <p className="sec-sub">Everything you need to know about our home tutoring service in Raipur.</p>
        </Reveal>

        {/* Category filters */}
        <Reveal delay={150}>
          <div className={styles.filters}>
            {categories.map(c => (
              <button
                key={c.key}
                className={`${styles.filterBtn} ${activecat === c.key ? styles.filterActive : ''}`}
                onClick={() => handleCatChange(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* FAQ list */}
        <div className={styles.list}>
          {visible.map((f, i) => (
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

        {/* View More / View Less */}
        {filtered.length > INITIAL_SHOW && (
          <Reveal delay={80}>
            <button
              className={styles.viewMoreBtn}
              onClick={() => { setShowAll(!showAll); setOpen(null); }}
            >
              {showAll
                ? '▲  Show Less'
                : `▼  View ${remaining} More Question${remaining > 1 ? 's' : ''}`}
            </button>
          </Reveal>
        )}

        {/* CTA Box */}
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