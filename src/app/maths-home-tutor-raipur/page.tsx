// src/app/maths-home-tutor-raipur/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'Maths Home Tutor in Raipur | Jilani Home Tutor',
  description:
    'Find a Maths home tutor in Raipur for school students. Jilani Home Tutor helps parents connect with suitable mathematics tutors.',
  alternates: {
    canonical: '/maths-home-tutor-raipur',
  },
  openGraph: {
    title: 'Maths Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Find a Maths home tutor in Raipur for school students. Jilani Home Tutor helps parents connect with suitable mathematics tutors.',
    url: 'https://www.jilanihometutor.in/maths-home-tutor-raipur',
  },
};

const MATHS_FAQS = [
  {
    q: 'How does a 1-on-1 home tutor help students overcome fear of Mathematics?',
    a: 'Math anxiety usually stems from unaddressed basic doubts in earlier grades. A dedicated home tutor works at the child’s pace, identifies underlying gaps in arithmetic or algebraic concepts, and builds confidence through gradual, step-by-step problem-solving.',
  },
  {
    q: 'Which classes and curriculums are covered for Maths tuition in Raipur?',
    a: 'We coordinate Maths home tutors for students from Class 1 through Class 12 across CBSE, ICSE, and CG Board syllabuses, as well as foundation preparation for Olympiads and competitive entrance tests.',
  },
  {
    q: 'Do tutors help with reference books like R.D. Sharma and R.S. Aggarwal?',
    a: 'Yes. In addition to thorough NCERT textbook coverage, tutors guide students through higher-order thinking problems from standard reference books such as R.D. Sharma and R.S. Aggarwal, depending on the student’s academic goals.',
  },
  {
    q: 'How does Jilani Home Tutor help parents evaluate a Maths tutor before starting?',
    a: 'Parents can schedule a free 1-on-1 demo class at home. This allows you to observe how the tutor explains difficult formulas and theorems, and see how well your child responds to their teaching style.',
  },
  {
    q: 'How frequently are Maths home tuition classes conducted?',
    a: 'Most parents choose 4 to 6 sessions per week, with each class typically lasting 1 to 1.5 hours, providing consistent practice without overwhelming the student.',
  },
];

export default function MathsHomeTutorPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: MATHS_FAQS.map((item) => ({
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
              <Link href="/">Home</Link> &gt; <span>Maths Home Tutor Raipur</span>
            </div>
            <div className={styles.badge}>🧮 Concept-Building & Problem Solving</div>
            <h1 className={styles.h1Title}>Maths Home Tutor in Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Develop Clear Mathematical Foundations, Speed & Exam Confidence with 1-on-1 Guidance
            </h2>
            <p className={styles.desc}>
              Mathematics requires continuous practice, conceptual clarity, and patient step-by-step guidance.
              Jilani Home Tutor connects parents in Raipur with verified, experienced mathematics home tutors who help students build confidence from foundational arithmetic to advanced calculus.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              {/* Introduction */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Overcome Maths Anxiety with Personalized 1-on-1 Attention</h2>
                <p className={styles.paragraph}>
                  Mathematics is a subject where each chapter builds directly upon the previous one. If a student misses a key concept in fractions, linear equations, or trigonometry, future chapters quickly feel overwhelming. In crowded classrooms, asking repeated questions can feel intimidating. A private home tutor provides an encouraging space where every doubt is resolved patiently before moving forward.
                </p>
              </div>

              {/* Classes Covered */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Mathematics Curriculum Covered (Classes 1–12)</h3>
                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>🌱</span>
                  <div>
                    <h3>Primary Maths (Class 1–5)</h3>
                    <p>Mental arithmetic, multiplication tables, basic fractions, word problem visualization, and building positive interest in numbers.</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>📐</span>
                  <div>
                    <h3>Middle School Maths (Class 6–8)</h3>
                    <p>Integers, rational numbers, basic algebra, exponents, geometric constructions, and commercial arithmetic (profit/loss, percentages).</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>🎯</span>
                  <div>
                    <h3>Secondary & Board Maths (Class 9–10)</h3>
                    <p>Quadratic equations, arithmetic progressions, coordinate geometry, trigonometry proofs, circles, surface areas, and statistics.</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>📈</span>
                  <div>
                    <h3>Senior Secondary & Applied Maths (Class 11–12)</h3>
                    <p>Relations & functions, differential and integral calculus, 3D geometry, vectors, matrices, determinants, and probability distributions.</p>
                  </div>
                </div>
              </div>

              {/* Concept Building & Practice */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Proven Method: From Concepts to Daily Practice</h2>
                <p className={styles.paragraph}>
                  Our tutors follow a systematic three-phase approach to help students gain genuine mastery:
                </p>
                <ul className={styles.bulletList}>
                  <li><strong>Concept Derivation:</strong> Understanding why formulas work rather than blindly memorizing steps.</li>
                  <li><strong>Structured NCERT Problem Solving:</strong> Solving every textbook exercise along with miscellaneous questions.</li>
                  <li><strong>Higher-Order Reference Work:</strong> Practicing selected problems from R.D. Sharma and R.S. Aggarwal for enhanced analytical rigor.</li>
                  <li><strong>Speed & Accuracy Drills:</strong> Short timed quizzes to reduce calculation slips and careless sign errors.</li>
                </ul>
              </div>

              {/* Board Examination Preparation */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Board Exam Answer Presentation & Step-Marking</h3>
                <p className={styles.paragraph}>
                  In board exams, correct steps, explicit formula statements, clear geometry diagrams, and neat rough-work margins carry marks even when calculation answers differ. Tutors train students in examiner-friendly answer sheet formatting to maximize board exam scores.
                </p>
              </div>

              {/* How Parents Can Request */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>How to Find the Right Maths Tutor in Raipur</h2>
                <div className={styles.stepsGrid}>
                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <h4 className={styles.stepTitle}>Tell Us the Grade & Focus Area</h4>
                      <p className={styles.stepDesc}>Share your child’s class, board, and specific challenges (e.g. algebra, geometry, speed) through our form or WhatsApp.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <h4 className={styles.stepTitle}>Tutor Matching</h4>
                      <p className={styles.stepDesc}>We coordinate an experienced, verified mathematics teacher residing in or near your locality in Raipur.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <h4 className={styles.stepTitle}>Free Demo Class at Home</h4>
                      <p className={styles.stepDesc}>Attend an initial 1-on-1 demo session at your residence to assess the tutor’s problem-solving explanations.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>4</div>
                    <div>
                      <h4 className={styles.stepTitle}>Regular Scheduled Practice</h4>
                      <p className={styles.stepDesc}>Establish a consistent weekly timetable with routine tests and monthly performance updates.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact CTA */}
              <div className={styles.directCtaBox}>
                <h3 className={styles.directCtaTitle}>Looking for a Maths Tutor in Raipur?</h3>
                <p className={styles.directCtaSub}>Talk to our team to discuss your child’s mathematics curriculum and schedule a free demo.</p>
                <div className={styles.ctaButtons}>
                  <a href="tel:+917999854628" className={styles.phoneCtaBtn}>
                    📞 Call +91 79998 54628
                  </a>
                  <a
                    href="https://wa.me/917999854628?text=Hello%20Jilani%20Home%20Tutor,%20I%20am%20looking%20for%20a%20Maths%20home%20tutor%20in%20Raipur."
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
                {MATHS_FAQS.map((faq) => (
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
                  <li><Link href="/class-10-tutor-raipur">📘 Class 10 Board Exam Home Tutor</Link></li>
                  <li><Link href="/class-12-tutor-raipur">🎓 Class 12 Board & Entrance Home Tutor</Link></li>
                  <li><Link href="/jee-neet-tuition-raipur">🚀 JEE & NEET Entrance Coaching in Raipur</Link></li>
                  <li><Link href="/shankar-nagar-home-tutor">📍 Home Tutor in Shankar Nagar, Raipur</Link></li>
                  <li><Link href="/find-tutor">🔍 Request Custom Tutor Consultation</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            {/* Right Column Form */}
            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Book Maths Free Demo</h3>
                <p className={styles.formSub}>Get matched with a dedicated Maths home tutor in Raipur for your child.</p>
                <RegisterForm defaultClass="Class 10 (Board)" defaultSubject="Maths" pageSource="Maths Landing Page" />
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
