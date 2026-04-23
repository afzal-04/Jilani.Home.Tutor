// src/sections/Testimonials.tsx
import Reveal from '@/components/Reveal';
import styles from './Testimonials.module.css';

const testimonials = [
  { initial: 'R', name: 'Ramesh Verma', location: 'Shankar Nagar, Raipur', text: 'My son was failing in Maths in Class 9. After just 2 months with Jilani Home tutor, he scored 85 in his exams. The tutor explained concepts so patiently.' },
  { initial: 'S', name: 'Sunita Agarwal', location: 'Civil Lines, Raipur', text: 'We tried online classes but my daughter could not focus. Jilani Home tutor was a game changer. She cleared Class 10 boards with 91%!' },
  { initial: 'P', name: 'Priya Chandrakar', location: 'Pandri, Raipur', text: 'Very professional service. They matched us with the right tutor in less than a day. My twins both improved in Science this semester.' },
];

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="sec-inner">
        <Reveal><span className="sec-tag">Success Stories</span></Reveal>
        <Reveal delay={80}><h2 className="sec-title">What Raipur Parents Say</h2></Reveal>
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className={styles.card}>
                <div className={styles.stars}>★★★★★</div>
                <p>{t.text}</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>{t.initial}</div>
                  <div>
                    <div className={styles.name}>{t.name}</div>
                    <div className={styles.loc}>Parent · {t.location}</div>
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
