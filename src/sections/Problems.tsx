// src/sections/Problems.tsx
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import styles from './Problems.module.css';

// ── Problem Data ──────────────────────────────────────────────────────────────

const problems = [
  {
    image: '/low-marks.jpg',
    alt: 'Student struggling with low marks',
    title: 'Low Marks Despite Studying',
    desc: "Your child spends hours with books but scores don't improve. Effort without the right guidance is wasted.",
    sol: 'Our tutors identify weak areas and target them specifically',
  },
  {
    image: '/classroom.jpg',
    alt: 'Overcrowded classroom with distracted students',
    title: "Can't Focus in Big Classrooms",
    desc: "40+ students per class means your child's doubts never get answered in school.",
    sol: '1-on-1 attention means every doubt gets solved immediately',
  },
  {
    image: '/maths.jpg',
    alt: 'Student confused by maths and science problems',
    title: 'Weak in Maths & Science',
    desc: 'These subjects build on each other. One missed concept creates confusion for years.',
    sol: 'We rebuild foundations from the ground up, patiently',
  },
  {
    image: '/board-exam.jpg',
    alt: 'Student stressed about board exams',
    title: 'Board Exam Pressure',
    desc: 'Class 10 & 12 results decide college admissions. The pressure is real and parents worry.',
    sol: 'Dedicated board exam preparation with mock tests',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Problems() {
  return (
    <section className={styles.section}>
      <div className="sec-inner">
        <Reveal>
          <span className="sec-tag sec-tag--gold">We Understand Your Struggle</span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="sec-title sec-title--white">
            Is Your Child Facing<br />These Problems?
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="sec-sub sec-sub--muted">
            Every parent in Raipur faces these challenges. We have the solution.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {problems.map(({ image, alt, title, desc, sol }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className={styles.card}>

                {/* Image */}
                <div className={styles.imageWrap}>
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* Dark overlay so text below stays readable */}
                  <div className={styles.overlay} />
                </div>

                {/* Text */}
                <div className={styles.body}>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className={styles.sol}>✓ {sol}</div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
