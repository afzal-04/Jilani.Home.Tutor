// src/sections/Footer.tsx
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="#services">Services</Link>
        <Link href="#register">Register</Link>
        <Link href="#faq">FAQ</Link>
        <a href="https://wa.me/917999854628" target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
      <p>© {new Date().getFullYear()} Jilani Home Tutor, Raipur, Chhattisgarh · Best Home Tutor in Raipur</p>
      <p className={styles.areas}>Serving: Shankar Nagar · Civil Lines · Pandri · Telibandha · Tatibandh · Devendra Nagar</p>
    </footer>
  );
}
