// src/sections/Services.tsx
import Reveal from '@/components/Reveal';
import styles from './Services.module.css';

const services = [
  {
    icon: '📚',
    num: '1–5',
    title: 'Primary Classes',
    desc: 'Build strong foundations early. Our patient, child-friendly tutors make learning fun and effective.',
    subjects: ['All Subjects', 'English', 'Maths', 'EVS', 'Hindi'],
    badge: null,
    popular: false,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: '🔬',
    num: '6–8',
    title: 'Middle School',
    desc: 'Critical years where concepts get harder. We strengthen Maths & Science before the board years arrive.',
    subjects: ['Maths', 'Science', 'English', 'Hindi', 'Social Science'],
    badge: null,
    popular: false,
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    icon: '🏆',
    num: '9–10',
    title: 'Board Exam Prep',
    desc: 'Dedicated Class 10 board preparation with chapter-wise revision, mock tests, and past paper practice.',
    subjects: ['Maths', 'Science', 'English', 'Hindi', 'S. Science'],
    badge: '🔥 Most Popular',
    popular: true,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    icon: '🧪',
    num: '11–12',
    title: 'Senior Classes',
    desc: 'Expert tutors for Class 12 boards and college entrance. Science and Commerce streams both covered.',
    subjects: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Accounts'],
    badge: null,
    popular: false,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    icon: '🎯',
    num: 'JEE / NEET',
    title: 'Competitive Exams',
    desc: 'Structured preparation for JEE Mains, NEET, and government job exams with expert subject tutors.',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'Reasoning'],
    badge: null,
    popular: false,
    color: '#ef4444',
    bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  {
    icon: '🎨',
    num: 'Special',
    title: 'Arts & Summer Classes',
    desc: 'Drawing, music, dance, and summer skill classes for kids. Fun, structured, and taught at home.',
    subjects: ['Drawing', 'Music', 'Dance', 'Summer Batch', 'Craft'],
    badge: null,
    popular: false,
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #ec4899, #db2777)',
  },
];

export default function Services() {
  return (
    <section className={styles.section} id="services">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Our Classes</span></Reveal>
        <Reveal delay={80}>
          <h2 className="sec-title">Home Tuition for Every Class</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="sec-sub">
            Expert home tutors for every grade in Raipur — from Class 1 to competitive exams
          </p>
        </Reveal>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <Reveal key={s.num} delay={i * 70}>
              <div className={styles.card} style={{ '--color': s.color } as React.CSSProperties}>

                {/* Popular ribbon */}
                {s.popular && (
                  <div className={styles.ribbon} style={{ background: s.bg }}>
                    {s.badge}
                  </div>
                )}

                {/* Top row: icon + class number */}
                <div className={styles.cardTop}>
                  <div className={styles.iconBox} style={{ background: s.bg }}>
                    <span className={styles.iconEmoji}>{s.icon}</span>
                  </div>
                  <div className={styles.num}>{s.num}</div>
                </div>

                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.desc}>{s.desc}</p>

                {/* Subject pills */}
                <div className={styles.pills}>
                  {s.subjects.map(sub => (
                    <span
                      key={sub}
                      className={styles.pill}
                      style={{ color: s.color, background: s.color + '12', borderColor: s.color + '30' }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#register"
                  className={styles.cta}
                  style={{ '--btn-bg': s.bg } as React.CSSProperties}
                >
                  Book Free Demo →
                </a>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}