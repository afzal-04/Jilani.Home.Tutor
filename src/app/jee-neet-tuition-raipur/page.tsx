// src/app/jee-neet-tuition-raipur/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'JEE & NEET Home Tutor in Raipur | 1-on-1 Entrance Coaching | Jilani Home Tutor',
  description:
    '1-on-1 JEE Main, JEE Advanced & NEET home tuition in Raipur. Experienced tutors for Physics, Chemistry, Maths & Biology. Book a FREE Demo Class Today!',
  alternates: {
    canonical: '/jee-neet-tuition-raipur',
  },
  openGraph: {
    title: 'JEE & NEET Home Tuition in Raipur | Jilani Home Tutor',
    description: 'Personalized 1-on-1 home coaching for JEE & NEET in Raipur. Expert Physics, Chemistry, Maths & Biology tutors.',
    url: 'https://www.jilanihometutor.in/jee-neet-tuition-raipur',
  },
};

const JEE_NEET_FAQS = [
  {
    q: 'How does 1-on-1 home coaching benefit JEE and NEET aspirants?',
    a: 'In large classroom coaching centres, students often hesitate to stop lectures for personal doubts. A dedicated home tutor focuses entirely on the student’s weak areas, walks through complex numerical derivations, and tracks revision schedules closely.',
  },
  {
    q: 'Which subjects can we request home tutors for?',
    a: 'We coordinate subject tutors for Physics, Chemistry, Mathematics (for JEE), and Biology (Botany & Zoology for NEET). You can request single-subject focus or comprehensive guidance.',
  },
  {
    q: 'Is a free demo class available for competitive exam coaching?',
    a: 'Yes, parents can book an initial free 1-on-1 demo session at home to evaluate the tutor’s problem-solving methods and conceptual clarity.',
  },
];

export default function JeeNeetPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: JEE_NEET_FAQS.map((item) => ({
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
              <Link href="/">Home</Link> &gt; <span>JEE & NEET Home Tuition Raipur</span>
            </div>
            <div className={styles.badge}>🚀 Competitive Exam Specialist</div>
            <h1 className={styles.h1Title}>JEE & NEET Home Tuition in Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Rigorous 1-on-1 Personal Home Coaching for Engineering & Medical Entrance Aspirants
            </h2>
            <p className={styles.desc}>
              Large coaching batches often leave student doubt backlogs unaddressed. Our specialized JEE (Physics, Chemistry, Maths) and NEET (Physics, Chemistry, Biology) home tutors provide targeted problem-solving techniques, numerical shortcuts, and continuous mock evaluation at home.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              <h2 className={styles.sectionHeading}>Why 1-on-1 JEE & NEET Home Coaching Works Best</h2>
              
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🧪</span>
                <div>
                  <h3>Deep Conceptual Problem Solving</h3>
                  <p>Master complex Physics numericals, Organic Chemistry mechanisms, and Advanced Calculus step-by-step.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>📝</span>
                <div>
                  <h3>NTA Pattern Mock Paper Series</h3>
                  <p>Simulated JEE Main / NEET timed tests to improve speed, accuracy, and eliminate negative marking errors.</p>
                </div>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>💡</span>
                <div>
                  <h3>Individual Doubt Elimination</h3>
                  <p>Clear every single doubt promptly during your private 1-on-1 home sessions without classroom pressure.</p>
                </div>
              </div>

              {/* FAQs */}
              <div className={styles.faqSection}>
                <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
                {JEE_NEET_FAQS.map((faq) => (
                  <div key={faq.q} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Related Landing Pages Internal Links */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Related Academic Services in Raipur</h3>
                <ul>
                  <li><Link href="/home-tutor-in-raipur">🏠 Home Tutor in Raipur (Classes 1–12 Overview)</Link></li>
                  <li><Link href="/class-12-tutor-raipur">🎓 Class 12 Board & Entrance Home Tutor</Link></li>
                  <li><Link href="/maths-home-tutor-raipur">🧮 Dedicated Maths Home Tutor in Raipur</Link></li>
                  <li><Link href="/class-10-tutor-raipur">📘 Class 10 Board Prep Home Tutor</Link></li>
                  <li><Link href="/shankar-nagar-home-tutor">📍 Home Tutor in Shankar Nagar, Raipur</Link></li>
                  <li><Link href="/find-tutor">🎓 Request Custom Tutor Match</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Book JEE / NEET Free Demo</h3>
                <p className={styles.formSub}>Get matched with an expert entrance exam mentor in Raipur within 24 hours.</p>
                <RegisterForm defaultClass="Competitive Exam (JEE / NEET)" defaultSubject="JEE Preparation" pageSource="JEE NEET Landing Page" />
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
