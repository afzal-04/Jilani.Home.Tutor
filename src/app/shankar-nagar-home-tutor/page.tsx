// src/app/shankar-nagar-home-tutor/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'Home Tutor in Shankar Nagar Raipur | 1-on-1 Tuition | Jilani Home Tutor',
  description:
    'Looking for a home tutor in Shankar Nagar, Raipur? Verified expert 1-on-1 home tutors for Class 1 to 12 & entrance prep in Shankar Nagar locality. Book FREE Demo!',
  alternates: {
    canonical: 'https://jilani-home-tutor.vercel.app/shankar-nagar-home-tutor',
  },
  openGraph: {
    title: 'Home Tutor in Shankar Nagar, Raipur | Jilani Home Tutor',
    description: 'Verified 1-on-1 home tutors available in Shankar Nagar, Raipur for Class 1 to 12. Book a FREE demo class today!',
    url: 'https://jilani-home-tutor.vercel.app/shankar-nagar-home-tutor',
  },
};

export default function ShankarNagarPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Breadcrumb & Hero */}
        <section className={styles.heroSection}>
          <div className={styles.inner}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link> &gt; <span>Home Tutor in Shankar Nagar Raipur</span>
            </div>
            <div className={styles.badge}>📍 Shankar Nagar Locality Specialist</div>
            <h1 className={styles.h1Title}>Best Home Tutor in Shankar Nagar, Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Top-Rated Verified 1-on-1 Personal Home Tuition Right at Your Doorstep in Shankar Nagar
            </h2>
            <p className={styles.desc}>
              Shankar Nagar is one of Raipur&apos;s premier educational hubs. We have over 50+ background-verified home tutors active in Shankar Nagar, Khamardih, Katora Talaab, and TV Tower Road area ready to teach your child in the comfort of your home.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              <h2 className={styles.sectionHeading}>Why Families in Shankar Nagar Prefer Jilani Home Tutor</h2>
              
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🚗</span>
                <div>
                  <h3>Local Tutors for On-Time Classes</h3>
                  <p>Tutors reside in or near Shankar Nagar, ensuring punctual daily sessions without traffic delays.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🏫</span>
                <div>
                  <h3>CBSE & ICSE School Curriculum Experts</h3>
                  <p>Experienced tutors familiar with syllabus of DPS, KPS, NH Goel, and St. Xavier&apos;s schools in Raipur.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🛡️</span>
                <div>
                  <h3>Verified & Trusted In-Home Mentors</h3>
                  <p>Thorough ID verification, academic check, and safety onboarding for total peace of mind for parents.</p>
                </div>
              </div>

              {/* Related Landing Pages Internal Links */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Other Tutoring Options</h3>
                <ul>
                  <li><Link href="/class-10-tutor-raipur">📘 Class 10 Board Exam Specialist Tutors</Link></li>
                  <li><Link href="/jee-neet-tuition-raipur">🚀 JEE & NEET Entrance Home Tuition in Raipur</Link></li>
                  <li><Link href="/find-tutor">🎓 Find Tutors in Civil Lines, Pandri & Telibandha</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Book Demo in Shankar Nagar</h3>
                <p className={styles.formSub}>Get matched with a Shankar Nagar tutor within 24 hours.</p>
                <RegisterForm defaultArea="Shankar Nagar" defaultClass="Class 9" defaultSubject="Maths + Science (Both)" pageSource="Shankar Nagar Landing Page" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
