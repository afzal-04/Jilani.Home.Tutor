// src/sections/Trust.tsx
import styles from './Trust.module.css';

const items = [
  { stat: '1000+', label: 'Students Taught',   sub: 'across Raipur'        },
  { stat: '95%',  label: 'Score Improvement', sub: 'within 3 months'      },
  { stat: '24hr', label: 'Tutor Matching',    sub: 'guaranteed'           },
  { stat: '100%', label: 'Verified Tutors',   sub: 'background checked'   },
  { stat: '₹0',  label: 'First Demo Class',  sub: 'no commitment needed' },
];

export default function Trust() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {items.map((item, i) => (
          <div key={item.label} className={styles.item}>
            <div className={styles.stat}>{item.stat}</div>
            <div className={styles.texts}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.sub}>{item.sub}</span>
            </div>
            {i < items.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
}