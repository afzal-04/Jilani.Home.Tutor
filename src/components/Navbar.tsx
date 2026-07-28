'use client';
// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '#services',     label: 'Services' },
  { href: '/find-tutor',   label: 'Find Tutor' },
  { href: '#register',     label: 'Register' },
  { href: '#testimonials', label: 'Results'  },
  { href: '#faq',          label: 'FAQ'      },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [imgError,  setImgError]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>

        {/* ── Logo ── */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoImgWrap}>
            {!imgError ? (
              <Image
                src="/logo.png"
                alt="Jilani Home Tutor"
                width={56}
                height={56}
                className={styles.logoImg}
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              <span className={styles.logoFallback}>📚</span>
            )}
          </div>
          <div className={styles.logoTextWrap}>
            <span className={styles.logoMain}>Jilani Home Tutor</span>
            <span className={styles.logoSub}>Home Tutor · Raipur</span>
          </div>
        </Link>

        {/* ── Desktop Links ── */}
        <div className={styles.links}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
          <Link href="tel:+917999854628" className={styles.phoneLink}>
            📞 Call Us
          </Link>
          <Link href="#register" className={styles.cta}>
            Book Free Demo
          </Link>
        </div>

        {/* ── Hamburger ── */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.mobileLinks}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="tel:+917999854628" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            📞 Call Us
          </Link>
          <Link href="#register" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
            📅 Book Free Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
