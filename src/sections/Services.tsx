// src/sections/Services.tsx
import Reveal from '@/components/Reveal';
import styles from './Services.module.css';

const services = [
  { num: '1–5',  title: 'Primary Classes',   desc: 'Build strong foundations in all subjects with patient, child-friendly tutors', badge: 'All Subjects', featured: false },
  { num: '6–8',  title: 'Middle School',     desc: 'Critical years for Maths & Science. We strengthen concepts before board years', badge: '🔥 Most Popular', featured: true  },
  { num: '9–10', title: 'Board Exam Prep',   desc: 'Focused preparation for Class 10 boards with mock tests and revision', badge: 'Board Prep', featured: false },
  { num: '11–12',title: 'Senior Classes',    desc: 'Physics, Chemistry, Maths & Biology for science stream students', badge: 'PCM / PCB', featured: false },
];

export default function Services() {
  return (
    <section className={styles.section} id="services">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Our Classes</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title">Home Tuition for Every Class</h2></Reveal>
        <Reveal delay={120}><p className="sec-sub">Specialized tutors for every grade level in Raipur</p></Reveal>
        <div className={styles.grid}>
          {services.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className={`${styles.card} ${s.featured ? styles.featured : ''}`}>
                <div className={styles.num}>{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className={styles.badge}>{s.badge}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
