'use client';
// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>📚</div>
          <div className={styles.logoText}>
            Jilani <span>Tutor</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={styles.links}>
          <Link href="#services">Services</Link>
          <Link href="#register">Register</Link>
          <Link href="#testimonials">Results</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="#register" className={styles.cta}>Book Free Demo</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="#services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="#register" onClick={() => setMenuOpen(false)}>Register</Link>
          <Link href="#testimonials" onClick={() => setMenuOpen(false)}>Results</Link>
          <Link href="#faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link href="#register" className={styles.cta} onClick={() => setMenuOpen(false)}>
            Book Free Demo
          </Link>
        </div>
      )}
    </nav>
  );
}
