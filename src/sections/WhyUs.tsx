// src/sections/WhyUs.tsx
import Reveal from '@/components/Reveal';
import styles from './WhyUs.module.css';

const reasons = [
  { icon: '🎓', bg: '#fff3cd', title: 'Experienced & Verified Tutors', desc: 'All tutors have 3+ years experience and go through background verification before joining.' },
  { icon: '🏠', bg: '#d4edda', title: 'Learning at Your Home', desc: 'No travel stress. Your child learns in a comfortable, familiar environment.' },
  { icon: '📊', bg: '#cce5ff', title: 'Regular Progress Reports', desc: 'Weekly updates so parents always know how their child is improving.' },
  { icon: '🆓', bg: '#f8d7da', title: 'Free First Demo Class', desc: 'Try before you commit. See the difference in just one session, absolutely free.' },
  { icon: '⚡', bg: '#e2d9f3', title: 'Matched in 24 Hours', desc: "Tell us your need and we'll find the perfect tutor within one day." },
  { icon: '💬', bg: '#fff3cd', title: 'WhatsApp Support', desc: 'Direct communication with your tutor and our support team anytime.' },
];

export default function WhyUs() {
  return (
    <section>
      <div className="sec-inner">
        <div className={styles.header}>
          <Reveal><span className="sec-tag">Why Parents Trust Us</span></Reveal>
          <Reveal delay={80}><h2 className="sec-title" style={{ textAlign: 'center' }}>Why Choose Jilani Home Tutor?</h2></Reveal>
          <Reveal delay={120}><p className="sec-sub" style={{ margin: '0 auto', textAlign: 'center' }}>The best home tutoring service in Raipur, trusted by hundreds of families</p></Reveal>
        </div>
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div className={styles.card}>
                <div className={styles.icon} style={{ background: r.bg }}>{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
