// src/sections/WhyUs.tsx
import Reveal from '@/components/Reveal';
import styles from './WhyUs.module.css';

const reasons = [
  {
    icon: '🎓',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    shadow: 'rgba(245,158,11,0.35)',
    accent: '#f59e0b',
    title: 'Experienced & Verified Tutors',
    stat: '3+ Years',
    statLabel: 'avg. experience',
    desc: 'Every tutor is background-verified and tested before joining. Only the top 10% make it through our selection.',
  },
  {
    icon: '🏠',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    shadow: 'rgba(16,185,129,0.35)',
    accent: '#10b981',
    title: 'Learning at Your Home',
    stat: '0 min',
    statLabel: 'travel time',
    desc: 'No commute, no stress. Your child learns in the comfort of home — the best environment for focused study.',
  },
  {
    icon: '📊',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    shadow: 'rgba(59,130,246,0.35)',
    accent: '#3b82f6',
    title: 'Regular Progress Reports',
    stat: 'Weekly',
    statLabel: 'parent updates',
    desc: 'You always know how your child is doing. Weekly reports sent directly to your WhatsApp — transparent and honest.',
  },
  {
    icon: '🆓',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    shadow: 'rgba(239,68,68,0.35)',
    accent: '#ef4444',
    title: 'Free First Demo Class',
    stat: '₹0',
    statLabel: 'first session',
    desc: 'Try us with zero risk. One full demo class, completely free. Pay only when you are 100% satisfied.',
  },
  {
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    shadow: 'rgba(139,92,246,0.35)',
    accent: '#8b5cf6',
    title: 'Matched in 24 Hours',
    stat: '24 hrs',
    statLabel: 'tutor matching',
    desc: 'Register today, get your tutor tomorrow. We match based on area, class, subject and your schedule.',
  },
  {
    icon: '💬',
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

        {/* Header */}
        <div className={styles.header}>
          <Reveal><span className="sec-tag">Why Parents Trust Us</span></Reveal>
          <Reveal delay={80}>
            <h2 className="sec-title" style={{ textAlign: 'center' }}>
              Why Choose Jilani Home Tutor?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="sec-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
              The best home tutoring service in Raipur, trusted by hundreds of families
            </p>
          </Reveal>

          {/* Trust bar */}
          <Reveal delay={160}>
            <div className={styles.trustBar}>
              <div className={styles.trustItem}>
                <strong>500+</strong><span>Happy Students</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <strong>95%</strong><span>Score Improved</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <strong>5+</strong><span>Years in Raipur</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <strong>24hr</strong><span>Tutor Matching</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 70}>
              <div
                className={styles.card}
                style={{ '--accent': r.accent, '--shadow': r.shadow } as React.CSSProperties}
              >
                {/* Top accent line */}
                <div className={styles.accentLine} style={{ background: r.gradient }} />

                {/* Icon */}
                <div className={styles.iconWrap} style={{ background: r.gradient, boxShadow: `0 8px 24px ${r.shadow}` }}>
                  <span className={styles.iconEmoji}>{r.icon}</span>
                </div>

                {/* Stat badge */}
                <div className={styles.statBadge} style={{ color: r.accent, borderColor: r.accent + '33', background: r.accent + '0f' }}>
                  <span className={styles.statNum}>{r.stat}</span>
                  <span className={styles.statLabel}>{r.statLabel}</span>
                </div>

                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardDesc}>{r.desc}</p>

                {/* Bottom checkmark */}
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