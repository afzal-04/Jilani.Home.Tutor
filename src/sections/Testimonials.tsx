'use client';
// src/sections/Testimonials.tsx
import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import styles from './Testimonials.module.css';

const ALL_TESTIMONIALS = [
  {
    initial: 'R',
    name: 'Ramesh Verma',
    location: 'Shankar Nagar, Raipur',
    subject: 'Maths · Class 9',
    score: '55% → 85%',
    text: 'My son was scoring 55 in Maths and I was very worried. After 2 months with Jilani Home Tutor, he got 85 in his half-yearly exam. The tutor comes on time, explains patiently, and gives weekly notes. Highly recommend.',
  },
  {
    initial: 'S',
    name: 'Sunita Agarwal',
    location: 'Civil Lines, Raipur',
    subject: 'Science · Class 10',
    score: 'Class 10 · 91%',
    text: 'We tried online classes for 6 months but my daughter could never focus on a screen. Jilani Home Tutor was completely different. The tutor built her confidence step by step. She cleared Class 10 boards with 91% and we are so proud.',
  },
  {
    initial: 'P',
    name: 'Priya Chandrakar',
    location: 'Pandri, Raipur',
    subject: 'Science · Class 7 & 8',
    score: 'Both twins improved',
    text: 'I have twins in Class 7 and 8 and managing their studies was becoming impossible. Jilani matched us with a tutor within one day. Both children improved in Science within the first month. Very professional and reliable service.',
  },
  {
    initial: 'A',
    name: 'Anjali Sahu',
    location: 'Tatibandh, Raipur',
    subject: 'Maths + English · Class 6',
    score: 'Failed → Distinction',
    text: 'My daughter failed in Maths last year. I was really stressed. The tutor from Jilani was so patient — she never scolded, always explained in simple Hindi. This year my daughter got distinction. I tell every parent in my colony about this service.',
  },
  {
    initial: 'M',
    name: 'Mohit Kesharwani',
    location: 'Devendra Nagar, Raipur',
    subject: 'Physics + Maths · Class 12',
    score: '48% → 78%',
    text: 'Class 12 Physics was a nightmare for my son. He was scoring below 50. We contacted Jilani Home Tutor and they sent a very experienced sir within 2 days. In 3 months, my son scored 78 in Physics. He is now preparing for engineering entrance.',
  },
  {
    initial: 'N',
    name: 'Neha Tiwari',
    location: 'Avanti Vihar, Raipur',
    subject: 'All Subjects · Class 4',
    score: 'Rank improved to Top 5',
    text: 'My daughter was always nervous in class and never participated. The home tutor gave her so much confidence. Within one semester she went from middle of the class to Top 5. The tutor also teaches in a fun way which my daughter enjoys.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Testimonials() {
  const [visible, setVisible] = useState(ALL_TESTIMONIALS.slice(0, 3));
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setVisible(shuffle(ALL_TESTIMONIALS).slice(0, 3));
  }, []);

  function handleShuffle() {
    setAnimating(true);
    setTimeout(() => {
      setVisible(shuffle(ALL_TESTIMONIALS).slice(0, 3));
      setAnimating(false);
    }, 300);
  }

  return (
    <section id="testimonials">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Success Stories</span></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-title">What Raipur Parents Say</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="sec-sub">Real results from real families across Raipur</p>
        </Reveal>

        <div className={`${styles.grid} ${animating ? styles.fadeOut : styles.fadeIn}`}>
          {visible.map((t) => (
            <div key={t.name} className={styles.card}>
              <div className={styles.topRow}>
                <div className={styles.stars}>★★★★★</div>
                <span className={styles.scoreBadge}>{t.score}</span>
              </div>
              <div className={styles.subjectTag}>{t.subject}</div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.initial}</div>
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.loc}>Parent · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Reveal delay={200}>
          <div className={styles.shuffleRow}>
            <span className={styles.countText}>Showing 3 of {ALL_TESTIMONIALS.length} reviews</span>
            <button onClick={handleShuffle} className={styles.shuffleBtn} disabled={animating}>
              🔄 Show Different Reviews
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}