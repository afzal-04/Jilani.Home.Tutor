// src/sections/WhyUs.tsx
import Reveal from '@/components/Reveal';
import styles from './WhyUs.module.css';

const Icons = {
  shield: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  home: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  chart: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  ),
  gift: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  zap: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  message: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

const reasons = [
  {
    icon: Icons.shield,
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    shadow: 'rgba(245,158,11,0.35)',
    accent: '#f59e0b',
    title: 'Experienced & Verified Tutors',
    stat: '3+ Years',
    statLabel: 'avg. experience',
    desc: 'Every tutor is background-verified and tested before joining. Only the top 10% make it through our selection.',
  },
  {
    icon: Icons.home,
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    shadow: 'rgba(16,185,129,0.35)',
    accent: '#10b981',
    title: 'Learning at Your Home',
    stat: '0 min',
    statLabel: 'travel time',
    desc: 'No commute, no stress. Your child learns in the comfort of home — the best environment for focused study.',
  },
  {
    icon: Icons.chart,
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    shadow: 'rgba(59,130,246,0.35)',
    accent: '#3b82f6',
    title: 'Regular Progress Reports',
    stat: 'Weekly',
    statLabel: 'parent updates',
    desc: 'You always know how your child is doing. Weekly reports sent directly to your WhatsApp — transparent and honest.',
  },
  {
    icon: Icons.gift,
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    shadow: 'rgba(239,68,68,0.35)',
    accent: '#ef4444',
    title: 'Free First Demo Class',
    stat: '₹0',
    statLabel: 'first session',
    desc: 'Try us with zero risk. One full demo class, completely free. Pay only when you are 100% satisfied.',
  },
  {
    icon: Icons.zap,
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    shadow: 'rgba(139,92,246,0.35)',
    accent: '#8b5cf6',
    title: 'Matched in 24 Hours',
    stat: '24 hrs',
    statLabel: 'tutor matching',
    desc: 'Register today, get your tutor tomorrow. We match based on area, class, subject and your schedule.',
  },
  {
    icon: Icons.message,
    gradient: 'linear-gradient(135deg, #25d366, #128c7e)',
    shadow: 'rgba(37,211,102,0.35)',
    accent: '#25d366',
    title: 'WhatsApp Support',
    stat: '24/7',
    statLabel: 'response time',
    desc: 'Direct line to your tutor and our support team. Questions, reschedules, feedback — all on WhatsApp.',
  },
];

export default function WhyUs() {
  return (
    <section className={styles.section}>
      <div className="sec-inner">
        <div className={styles.header}>
          <Reveal><span className="sec-tag">Why Parents Trust Us</span></Reveal>
          <Reveal delay={80}><h2 className="sec-title" style={{ textAlign: 'center' }}>Why Choose Jilani Home Tutor?</h2></Reveal>
          <Reveal delay={120}><p className="sec-sub" style={{ margin: '0 auto', textAlign: 'center' }}>The best home tutoring service in Raipur, trusted by hundreds of families</p></Reveal>
          <Reveal delay={160}>
            <div className={styles.trustBar}>
              <div className={styles.trustItem}><strong>1000+</strong><span>Happy Students</span></div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}><strong>95%</strong><span>Score Improved</span></div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}><strong>4+</strong><span>Years in Raipur</span></div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}><strong>24hr</strong><span>Tutor Matching</span></div>
            </div>
          </Reveal>
        </div>
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div className={styles.card} style={{ '--accent': r.accent, '--shadow': r.shadow } as React.CSSProperties}>
                <div className={styles.accentLine} style={{ background: r.gradient }} />
                <div className={styles.iconWrap} style={{ background: r.gradient, boxShadow: `0 8px 24px ${r.shadow}` }}>
                  {r.icon}
                </div>
                <div className={styles.statBadge} style={{ color: r.accent, borderColor: r.accent + '33', background: r.accent + '0f' }}>
                  <span className={styles.statNum}>{r.stat}</span>
                  <span className={styles.statLabel}>{r.statLabel}</span>
                </div>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardDesc}>{r.desc}</p>
                <div className={styles.checkRow}>
                  <span className={styles.check} style={{ background: r.gradient }}>✓</span>
                  <span className={styles.checkText}>Guaranteed</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}