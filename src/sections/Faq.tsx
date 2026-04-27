'use client';
// src/sections/Faq.tsx
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import styles from './Faq.module.css';

const faqs = [
  { q: 'What is the fee for a home tutor in Raipur?', a: 'Fees depend on the class, subject, and number of sessions per week. We first provide a FREE demo class. After that, you can discuss the fee directly with the tutor. Contact us for a rough estimate.' },
  { q: 'How quickly will you find a tutor for my child?', a: 'We match parents with the right tutor within 24 hours of registration. In most cases, the demo class is scheduled within 2 days.' },
  { q: 'Do you provide tutors across all areas of Raipur?', a: 'Yes! We have tutors across Shankar Nagar, Civil Lines, Pandri, Telibandha, Tatibandh, Devendra Nagar, and most other areas in Raipur.' },
  { q: 'What subjects do your tutors teach?', a: 'Our tutors cover Maths, Science (Physics, Chemistry, Biology), English, Hindi, Social Science, and most other school subjects for Class 1 to 12.' },
  { q: 'I am a teacher. How do I join Jilani Home Tutor?', a: 'Click the "I\'m a Tutor" tab in the registration section and fill in your details. Our team will contact you within 24 hours to onboard you.' },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section} id="faq">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Common Questions</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title">Frequently Asked Questions</h2></Reveal>
        <div className={styles.list}>
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className={styles.item}>
                <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
                  {f.q}
                  <span className={`${styles.icon} ${open === i ? styles.rotated : ''}`}>+</span>
                </button>
                <div className={`${styles.answer} ${open === i ? styles.answerOpen : ''}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
