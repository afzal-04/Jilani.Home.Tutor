// src/app/class-10-tutor-raipur/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'Class 10 Home Tutor in Raipur | Board Exam Specialist | Jilani Home Tutor',
  description:
    'Top-rated Class 10 home tuition in Raipur for CBSE, CG Board & ICSE. 1-on-1 personal tutoring in Maths, Science & English with guaranteed 85%+ board results. Book FREE Demo!',
  alternates: {
    canonical: 'https://jilani-home-tutor.vercel.app/class-10-tutor-raipur',
  },
  openGraph: {
    title: 'Class 10 Board Exam Home Tutor in Raipur | Jilani Home Tutor',
    description: 'Expert Class 10 home tutors in Raipur for Maths, Science & English. Guaranteed score improvement.',
    url: 'https://jilani-home-tutor.vercel.app/class-10-tutor-raipur',
  },
};

export default function Class10Page() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Breadcrumb & Hero */}
        <section className={styles.heroSection}>
          <div className={styles.inner}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link> &gt; <span>Class 10 Home Tutor Raipur</span>
            </div>
            <div className={styles.badge}>🎯 Class 10 Board Exam Specialist</div>
            <h1 className={styles.h1Title}>Class 10 Board Exam Home Tutor in Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Boost Board Exam Results with Dedicated 1-on-1 Personal Home Tuition in CBSE & CG Board
            </h2>
            <p className={styles.desc}>
              Class 10 Board exams decide stream selection for Class 11 & 12. Our verified Raipur tutors build strong conceptual clarity in Maths, Science, and English through daily practice, revision notes, and timed sample paper tests.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              <h2 className={styles.sectionHeading}>Why Class 10 Students in Raipur Excel with Us</h2>
              
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>📈</span>
                <div>
                  <h3>Targeted Board Exam Mock Tests</h3>
                  <p>Weekly chapter-wise tests and 5 full-length board paper mocks with detailed performance analysis.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🧮</span>
                <div>
                  <h3>Class 10 Maths & Science Focus</h3>
                  <p>Step-by-step guidance on NCERT exercises, theorem proofs, formula memory maps, and numerical solving.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>⏱️</span>
                <div>
                  <h3>Time Management & Answer Writing</h3>
                  <p>Train students how to structure answers for maximum marks under actual board exam timing constraints.</p>
                </div>
              </div>

              {/* Related Landing Pages Internal Links */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Related Tutoring Programs in Raipur</h3>
                <ul>
                  <li><Link href="/shankar-nagar-home-tutor">📍 Home Tutor in Shankar Nagar, Raipur</Link></li>
                  <li><Link href="/jee-neet-tuition-raipur">🚀 JEE & NEET Entrance Home Tuition in Raipur</Link></li>
                  <li><Link href="/find-tutor">🎓 Find Expert Tutors Across All Classes</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Book Class 10 Free Demo Class</h3>
                <p className={styles.formSub}>Get matched with an experienced Class 10 tutor in Raipur within 24 hours.</p>
                <RegisterForm defaultClass="Class 10 (Board)" defaultSubject="Maths + Science (Both)" pageSource="Class 10 Landing Page" />
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
