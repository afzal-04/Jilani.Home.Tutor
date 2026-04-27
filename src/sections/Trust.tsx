// src/sections/Trust.tsx
import Reveal from '@/components/Reveal';
import styles from './Trust.module.css';

const items = [
  { icon: '✅', text: 'Verified Tutors' },
  { icon: '🎯', text: '1-on-1 at Your Home' },
  { icon: '📞', text: '24hr Response' },
  { icon: '🆓', text: 'First Demo FREE' },
  { icon: '📈', text: 'Guaranteed Improvement' },
];

export default function Trust() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {items.map(item => (
          <Reveal key={item.text} className={styles.item}>
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
