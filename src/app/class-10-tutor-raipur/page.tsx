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
    'Dedicated Class 10 home tuition in Raipur for CBSE, CG Board & ICSE. 1-on-1 personal tutoring in Maths, Science & English for board exam preparation. Book a FREE Demo!',
  alternates: {
    canonical: '/class-10-tutor-raipur',
  },
  openGraph: {
    title: 'Class 10 Board Exam Home Tutor in Raipur | Jilani Home Tutor',
    description: 'Expert Class 10 home tutors in Raipur for Maths, Science & English board preparation.',
    url: 'https://www.jilanihometutor.in/class-10-tutor-raipur',
  },
};

const CLASS_10_FAQS = [
  {
    q: 'How do home tutors help students prepare for Class 10 board exams?',
    a: 'Tutors cover NCERT chapter-wise exercises, clarify conceptual doubts in Maths and Science, conduct weekly mock tests, and train students on time management and board answer writing formatting.',
  },
  {
    q: 'Which boards are supported for Class 10 tuition in Raipur?',
    a: 'Our tutors support CBSE, Chhattisgarh Board (CGBSE), and ICSE curriculums with syllabus-aligned lesson plans.',
  },
  {
    q: 'Can we schedule a free demo class for Class 10 home tuition?',
    a: 'Yes, Jilani Home Tutor provides a complimentary initial demo session at your home so that you and your child can evaluate the tutor before confirming.',
  },
  {
    q: 'What subjects are covered for Class 10 students?',
    a: 'We provide specialized home tutors for Mathematics, Science (Physics, Chemistry, Biology), English, Hindi, and Social Science.',
  },
];

export default function Class10Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CLASS_10_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              Structured 1-on-1 Personal Home Tuition in CBSE & CG Board for High School Students
            </h2>
            <p className={styles.desc}>
              Class 10 Board exams set the foundation for future stream selection. Our verified Raipur tutors build strong conceptual clarity in Maths, Science, and English through daily practice, structured revision notes, and timed sample paper tests.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              <h2 className={styles.sectionHeading}>Why Class 10 Students in Raipur Benefit from 1-on-1 Tuition</h2>
              
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>📈</span>
                <div>
                  <h3>Targeted Board Exam Mock Tests</h3>
                  <p>Weekly chapter-wise tests and full-length sample paper mocks with constructive performance reviews.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🧮</span>
                <div>
                  <h3>Class 10 Maths & Science Focus</h3>
                  <p>Step-by-step guidance on NCERT exercises, theorem proofs, formula memory maps, and numerical problem solving.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>⏱️</span>
                <div>
                  <h3>Time Management & Answer Structuring</h3>
                  <p>Train students how to present step-wise answers clearly within the 3-hour examination timeframe.</p>
                </div>
              </div>

              {/* FAQs */}
              <div className={styles.faqSection}>
                <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
                {CLASS_10_FAQS.map((faq) => (
                  <div key={faq.q} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Related Landing Pages Internal Links */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Related Tutoring Programs in Raipur</h3>
                <ul>
                  <li><Link href="/home-tutor-in-raipur">🏠 Home Tutor in Raipur (Classes 1–12 Overview)</Link></li>
                  <li><Link href="/class-12-tutor-raipur">🎓 Class 12 Board & Entrance Home Tutor</Link></li>
                  <li><Link href="/maths-home-tutor-raipur">🧮 Dedicated Maths Home Tutor in Raipur</Link></li>
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
