// src/sections/Problems.tsx
import Reveal from '@/components/Reveal';
import styles from './Problems.module.css';

const problems = [
  { icon: '📉', title: 'Low Marks Despite Studying', desc: 'Your child spends hours with books but scores don\'t improve. Effort without the right guidance is wasted.', sol: 'Our tutors identify weak areas and target them specifically' },
  { icon: '😵', title: 'Can\'t Focus in Big Classrooms', desc: '40+ students per class means your child\'s doubts never get answered in school.', sol: '1-on-1 attention means every doubt gets solved immediately' },
  { icon: '🔢', title: 'Weak in Maths & Science', desc: 'These subjects build on each other. One missed concept creates confusion for years.', sol: 'We rebuild foundations from the ground up, patiently' },
  { icon: '😰', title: 'Board Exam Pressure', desc: 'Class 10 & 12 results decide college admissions. The pressure is real and parents worry.', sol: 'Dedicated board exam preparation with mock tests' },
];

export default function Problems() {
  return (
    <section className={styles.section}>
      <div className="sec-inner">
        <Reveal><span className="sec-tag sec-tag--gold">We Understand Your Struggle</span></Reveal>
        <Reveal delay={100}><h2 className="sec-title sec-title--white">Is Your Child Facing<br />These Problems?</h2></Reveal>
        <Reveal delay={150}><p className="sec-sub sec-sub--muted">Every parent in Raipur faces these challenges. We have the solution.</p></Reveal>
        <div className={styles.grid}>
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className={styles.card}>
                <div className={styles.icon}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className={styles.sol}>✓ {p.sol}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
