// src/sections/CtaBand.tsx
import Reveal from '@/components/Reveal';
import styles from './CtaBand.module.css';

export default function CtaBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <Reveal><h2>Ready to Transform Your Child&apos;s Performance?</h2></Reveal>
        <Reveal delay={80}><p>Join 1000+ happy families in Raipur. First demo class is completely FREE!</p></Reveal>
        <Reveal delay={140}>
          <div className={styles.btns}>
            <a href="#register" className={styles.btnWhite}>📅 Book Free Demo Now</a>
            <a href="https://wa.me/917999854628" target="_blank" rel="noreferrer" className="btn-outline">
              💬 Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
