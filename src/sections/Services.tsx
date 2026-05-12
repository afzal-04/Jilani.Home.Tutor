// src/sections/Services.tsx
import Reveal from '@/components/Reveal';
import styles from './Services.module.css';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  book: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="12" y1="6" x2="16" y2="6"/>
      <line x1="12" y1="10" x2="16" y2="10"/>
    </svg>
  ),
  beaker: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v11l4 7H5l4-7V3z"/>
      <line x1="9" y1="3" x2="15" y2="3"/>
      <circle cx="10" cy="15" r="1" fill="#fff" stroke="none"/>
      <circle cx="13" cy="17" r="0.7" fill="#fff" stroke="none"/>
    </svg>
  ),
  trophy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <path d="M7 4H17v7a5 5 0 0 1-10 0V4z"/>
      <path d="M7 4H4v3a3 3 0 0 0 3 3"/>
      <path d="M17 4h3v3a3 3 0 0 1-3 3"/>
    </svg>
  ),
  atom: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5" fill="#fff" stroke="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="4"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
    </svg>
  ),
  target: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  palette: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1" fill="#fff" stroke="none"/>
      <circle cx="17.5" cy="10.5" r="1" fill="#fff" stroke="none"/>
      <circle cx="8.5"  cy="7.5"  r="1" fill="#fff" stroke="none"/>
      <circle cx="6.5"  cy="12.5" r="1" fill="#fff" stroke="none"/>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.55-.45-1-1-1-.55 0-1-.45-1-1 0-.55.45-1 1-1h1.5c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
    </svg>
  ),
};

const services = [
  {
    icon: Icons.book,
    num: '1–5',
    title: 'Primary Classes',
    desc: 'Build strong foundations early. Our patient, child-friendly tutors make learning fun and effective.',
    subjects: ['All Subjects', 'English', 'Maths', 'EVS', 'Hindi'],
    popular: false,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: Icons.beaker,
    num: '6–8',
    title: 'Middle School',
    desc: 'Critical years where concepts get harder. We strengthen Maths & Science before the board years arrive.',
    subjects: ['Maths', 'Science', 'English', 'Hindi', 'Social Science'],
    popular: false,
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    icon: Icons.trophy,
    num: '9–10',
    title: 'Board Exam Prep',
    desc: 'Dedicated Class 10 board preparation with chapter-wise revision, mock tests, and past paper practice.',
    subjects: ['Maths', 'Science', 'English', 'Hindi', 'S. Science'],
    popular: true,
    badge: '🔥 Most Popular',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    icon: Icons.atom,
    num: '11–12',
    title: 'Senior Classes',
    desc: 'Expert tutors for Class 12 boards and college entrance. Science and Commerce streams both covered.',
    subjects: ['Physics', 'Chemistry', 'Maths', 'Biology', 'Accounts'],
    popular: false,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    icon: Icons.target,
    num: 'JEE / NEET',
    title: 'Competitive Exams',
    desc: 'Structured preparation for JEE Mains, NEET, and government job exams with expert subject tutors.',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Maths', 'Reasoning'],
    popular: false,
    color: '#ef4444',
    bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  {
    icon: Icons.palette,
    num: 'Special',
    title: 'Arts & Summer Classes',
    desc: 'Drawing, music, dance, and summer skill classes for kids. Fun, structured, and taught at home.',
    subjects: ['Drawing', 'Music', 'Dance', 'Summer Batch', 'Craft'],
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
        <Reveal delay={80}><h2 className="sec-title">Home Tuition for Every Class</h2></Reveal>
        <Reveal delay={120}>
          <p className="sec-sub">Expert home tutors for every grade in Raipur — from Class 1 to competitive exams</p>
        </Reveal>
        <div className={styles.grid}>
          {services.map((s, i) => (
            <Reveal key={s.num} delay={i * 70}>
              <div className={styles.card} style={{ '--color': s.color } as React.CSSProperties}>
                {s.popular && (
                  <div className={styles.ribbon} style={{ background: s.bg }}>{s.badge}</div>
                )}
                <div className={styles.cardTop}>
                  <div className={styles.iconBox} style={{ background: s.bg }}>
                    {s.icon}
                  </div>
                  <div className={styles.num}>{s.num}</div>
                </div>
                <h3 className={styles.title}>{s.title}</h3>
                <p className={styles.desc}>{s.desc}</p>
                <div className={styles.pills}>
                  {s.subjects.map(sub => (
                    <span key={sub} className={styles.pill} style={{ color: s.color, background: s.color + '12', borderColor: s.color + '30' }}>
                      {sub}
                    </span>
                  ))}
                </div>
                <a href="#register" className={styles.cta} style={{ '--btn-bg': s.bg } as React.CSSProperties}>
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