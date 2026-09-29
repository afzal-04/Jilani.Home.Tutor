// src/app/class-12-tutor-raipur/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'Class 12 Home Tutor in Raipur | Jilani Home Tutor',
  description:
    'Looking for a Class 12 home tutor in Raipur? Connect with suitable tutors for board preparation, Maths, Physics, Chemistry and Biology.',
  alternates: {
    canonical: '/class-12-tutor-raipur',
  },
  openGraph: {
    title: 'Class 12 Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Looking for a Class 12 home tutor in Raipur? Connect with suitable tutors for board preparation, Maths, Physics, Chemistry and Biology.',
    url: 'https://www.jilanihometutor.in/class-12-tutor-raipur',
  },
};

const CLASS_12_FAQS = [
  {
    q: 'How does Jilani Home Tutor select a Class 12 tutor for my child in Raipur?',
    a: 'We evaluate your child’s educational board (CBSE or CG Board), academic stream (Science or Commerce), and specific weak chapters. We then connect you with an experienced subject tutor in your locality who specializes in the senior secondary syllabus.',
  },
  {
    q: 'Can we get individual subject tutors, such as only for Physics or Maths?',
    a: 'Yes. Parents can request tutoring for a single core subject (e.g. Physics, Chemistry, Mathematics, Accountancy) or multi-subject combinations depending on the student’s requirements.',
  },
  {
    q: 'How do tutors help students prepare for Class 12 board examinations?',
    a: 'Tutors emphasize NCERT syllabus completion, derivation proofs, formula mapping, numerical practice, solving past 10 years’ board papers, and timed mock tests with constructive feedback on answer presentation.',
  },
  {
    q: 'Do you offer a free demo class for Class 12 tuition?',
    a: 'Yes. We arrange an initial free 1-on-1 demo session at your home so the student and parents can review the tutor’s conceptual clarity and teaching methodology before confirming the schedule.',
  },
  {
    q: 'Which areas in Raipur do Class 12 tutors visit?',
    a: 'Our tutors visit major residential localities across Raipur, including Shankar Nagar, Civil Lines, Pandri, Telibandha, Devendra Nagar, Avanti Vihar, Khamardih, and surrounding areas.',
  },
];

export default function Class12TutorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CLASS_12_FAQS.map((item) => ({
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
              <Link href="/">Home</Link> &gt; <span>Class 12 Home Tutor Raipur</span>
            </div>
            <div className={styles.badge}>🎯 Senior Secondary & Board Examination Focus</div>
            <h1 className={styles.h1Title}>Class 12 Home Tutor in Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Targeted 1-on-1 In-Home Guidance for CBSE & CG Board Class 12 Students
            </h2>
            <p className={styles.desc}>
              Class 12 is a pivotal academic year that determines higher education admissions and competitive exam readiness.
              Jilani Home Tutor assists parents in connecting with experienced, background-verified home tutors in Raipur for Science and Commerce streams.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              {/* Introduction */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Focused 1-on-1 Mentoring for Class 12 Success</h2>
                <p className={styles.paragraph}>
                  Senior secondary subjects involve dense theory, intricate multi-step numericals, and extensive board marking criteria. In conventional coaching classes, students often hesitate to clarify recurring doubts. A private home tutor ensures 100% individual attention, helping students master every chapter methodically without rushing through concepts.
                </p>
              </div>

              {/* Streams & Subjects */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Available Stream & Subject Options</h3>
                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>⚡</span>
                  <div>
                    <h3>Science Stream (PCM / PCB)</h3>
                    <p>Rigorous coaching in Physics (Electromagnetism, Optics, Mechanics), Chemistry (Organic Mechanisms, Physical Numericals), Mathematics (Calculus, Vectors, Probability), and Biology (Diagrams & Terminology).</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>📊</span>
                  <div>
                    <h3>Commerce Stream</h3>
                    <p>Structured support in Accountancy (Partnership & Company Accounts), Economics (Micro & Macroeconomics concepts, graphs), Business Studies, and Applied Mathematics.</p>
                  </div>
                </div>
              </div>

              {/* Board Exam Preparation */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Structured Board Examination Strategy</h2>
                <p className={styles.paragraph}>
                  Our tutors structure preparation according to CBSE and Chhattisgarh Board (CGBSE) blueprints:
                </p>
                <ul className={styles.bulletList}>
                  <li><strong>NCERT Line-by-Line Mastery:</strong> Comprehensive coverage of core textbook theory and in-text solved examples.</li>
                  <li><strong>Previous Years’ Question Papers (PYQs):</strong> Detailed analysis of questions from the last 10 years to understand examiner patterns.</li>
                  <li><strong>Answer Writing Techniques:</strong> Training on step marking, formula substitution, unit checks, and neat diagram presentation under 3-hour timed constraints.</li>
                  <li><strong>Formula & Reaction Revision Maps:</strong> Chapter-wise revision summaries to facilitate quick recall before school pre-boards and final exams.</li>
                </ul>
              </div>

              {/* Concept-Based Learning */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Concept-Based Learning & Systematic Revision</h3>
                <p className={styles.paragraph}>
                  Rather than encouraging rote memorization, our tutors focus on foundational derivations and real-world applications. Regular weekend quizzes and chapter assessments allow tutors to identify gaps early and revisit difficult topics before tests.
                </p>
              </div>

              {/* How to Connect */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>How Parents Can Request a Class 12 Tutor</h2>
                <div className={styles.stepsGrid}>
                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <h4 className={styles.stepTitle}>Submit Subject & Board Details</h4>
                      <p className={styles.stepDesc}>Share your child’s stream (Science/Commerce), board (CBSE/CG Board), and locality via our online form or direct phone call.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <h4 className={styles.stepTitle}>Academic Tutor Matching</h4>
                      <p className={styles.stepDesc}>Our coordination team matches your student with a verified subject tutor experienced in the Class 12 curriculum.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <h4 className={styles.stepTitle}>Complimentary Home Demo</h4>
                      <p className={styles.stepDesc}>Experience a dedicated demo session at home so the student can evaluate the tutor’s explanations and comfort level.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>4</div>
                    <div>
                      <h4 className={styles.stepTitle}>Establish Study Schedule</h4>
                      <p className={styles.stepDesc}>Finalize weekly session days and timings to commence regular, focused preparation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact CTA */}
              <div className={styles.directCtaBox}>
                <h3 className={styles.directCtaTitle}>Have Questions About Class 12 Tuition?</h3>
                <p className={styles.directCtaSub}>Connect with our academic team to discuss syllabus schedules and tutor availability in Raipur.</p>
                <div className={styles.ctaButtons}>
                  <a href="tel:+917999854628" className={styles.phoneCtaBtn}>
                    📞 Call +91 79998 54628
                  </a>
                  <a
                    href="https://wa.me/917999854628?text=Hello%20Jilani%20Home%20Tutor,%20I%20am%20enquiring%20about%20a%20Class%2012%20home%20tutor%20in%20Raipur."
                    target="_blank"
                    rel="noreferrer"
                    className={styles.waCtaBtn}
                  >
                    💬 WhatsApp Us
                  </a>
                </div>
              </div>

              {/* FAQs */}
              <div className={styles.faqSection}>
                <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
                {CLASS_12_FAQS.map((faq) => (
                  <div key={faq.q} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Internal Links Box */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Related Academic Services in Raipur</h3>
                <ul>
                  <li><Link href="/home-tutor-in-raipur">🏠 Home Tutor in Raipur (Classes 1–12 Overview)</Link></li>
                  <li><Link href="/maths-home-tutor-raipur">🧮 Specialized Maths Home Tutor in Raipur</Link></li>
                  <li><Link href="/jee-neet-tuition-raipur">🚀 JEE & NEET Entrance Coaching at Home</Link></li>
                  <li><Link href="/class-10-tutor-raipur">📘 Class 10 Board Exam Home Tutor</Link></li>
                  <li><Link href="/shankar-nagar-home-tutor">📍 Home Tutor in Shankar Nagar, Raipur</Link></li>
                  <li><Link href="/find-tutor">🔍 Request Custom Tutor Consultation</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            {/* Right Column Form */}
            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Book Class 12 Free Demo</h3>
                <p className={styles.formSub}>Get matched with a qualified Class 12 subject tutor in Raipur for your child.</p>
                <RegisterForm defaultClass="Class 12 (Board)" defaultSubject="Physics" pageSource="Class 12 Landing Page" />
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
