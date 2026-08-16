// src/sections/Problems.tsx
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import styles from './Problems.module.css';

// ── Problem Data ──────────────────────────────────────────────────────────────

const problems = [
  {
    id: '01',
    badge: '📉 Low Performance',
    image: '/low-marks.png',
    alt: 'Student struggling with low marks',
    title: 'Low Marks Despite Studying',
    desc: "Your child spends hours with books but scores don't improve. Effort without targeted guidance gets wasted.",
    sol: 'Personalized 1-on-1 strategy focusing directly on weak areas',
  },
  {
    id: '02',
    badge: '🔊 Overcrowded Batches',
    image: '/classroom.png',
    alt: 'Overcrowded classroom with distracted students',
    title: "Can't Focus in Big Classrooms",
    desc: "40+ students per class means your child's doubts are ignored in school and large coaching institutes.",
    sol: 'Zero distractions with 100% focused home tutoring',
  },
  {
    id: '03',
    badge: '🧮 Conceptual Fear',
    image: '/maths.png',
    alt: 'Student confused by maths and science problems',
    title: 'Weak in Maths & Science',
    desc: 'STEM subjects build recursively. One missed basic concept creates long-term fear and anxiety.',
    sol: 'Rebuilding core fundamentals from scratch with infinite patience',
  },
  {
    id: '04',
    badge: '📝 Board Exam Anxiety',
    image: '/board-exam.png',
    alt: 'Student stressed about board exams',
    title: 'Board & Competitive Pressure',
    desc: 'Class 10 & 12 results define career paths. Pressure mounts without structured daily mentoring.',
    sol: 'Targeted board prep, timed mock tests & regular feedback',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Problems() {
  return (
    <section className={styles.section} id="problems">
      <div className="sec-inner">
        <div className={styles.headerWrap}>
          <Reveal>
            <span className={styles.secBadge}>
              <span className={styles.badgePulse} /> We Understand Your Struggle
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className={styles.title}>
              Is Your Child Facing <span className={styles.highlightTitle}>These Academic Challenges?</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className={styles.subtitle}>
              Every parent in Raipur wants the best for their child. Discover how personalized 1-on-1 home tutoring solves these common hurdles.
            </p>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {problems.map(({ id, badge, image, alt, title, desc, sol }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className={styles.card}>

                {/* Image Wrap */}
                <div className={styles.imageWrap}>
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className={styles.imageBadgeTop}>
                    <span className={styles.numTag}>#{id}</span>
                    <span className={styles.categoryBadge}>{badge}</span>
                  </div>
                  <div className={styles.overlay} />
                </div>

                {/* Body Content */}
                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDesc}>{desc}</p>
                  
                  <div className={styles.solBox}>
                    <div className={styles.solBadge}>
                      <span className={styles.checkIcon}>✓</span>
                      <span className={styles.solHeading}>Jilani Solution</span>
                    </div>
                    <p className={styles.solText}>{sol}</p>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

