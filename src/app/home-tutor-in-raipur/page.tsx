// src/app/home-tutor-in-raipur/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import RegisterForm from '@/components/RegisterForm';
import styles from '../LandingPage.module.css';

export const metadata: Metadata = {
  title: 'Home Tutor in Raipur | Jilani Home Tutor',
  description:
    'Find trusted home tutors in Raipur for Classes 1–12, Maths, Science, English and competitive exam preparation with Jilani Home Tutor.',
  alternates: {
    canonical: '/home-tutor-in-raipur',
  },
  openGraph: {
    title: 'Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Find trusted home tutors in Raipur for Classes 1–12, Maths, Science, English and competitive exam preparation with Jilani Home Tutor.',
    url: 'https://www.jilanihometutor.in/home-tutor-in-raipur',
  },
};

const VERIFIED_AREAS = [
  'Shankar Nagar',
  'Civil Lines',
  'Pandri',
  'Telibandha',
  'Tatibandh',
  'Devendra Nagar',
  'Raipur Station Road',
  'Pachpedi Naka',
  'Avanti Vihar',
  'Byron Bazar',
  'Mowa',
  'Khamardih',
  'Fafadih',
  'Rajendra Nagar',
  'Kabir Nagar',
  'Gopal Nagar',
  'New Rajendra Nagar',
  'Shanti Nagar',
];

const FAQS = [
  {
    q: 'How does Jilani Home Tutor connect parents with suitable home tutors in Raipur?',
    a: 'Parents share their child’s class, subject requirements, and locality in Raipur. Our academic coordination team evaluates the student’s academic syllabus and identifies a suitable, verified tutor from our network to conduct a free demo class at your home.',
  },
  {
    q: 'Which classes and curriculums are covered?',
    a: 'We coordinate home tuition for students from Class 1 through Class 12, covering CBSE, ICSE, and CG Board curriculums, as well as foundation preparation for competitive exams.',
  },
  {
    q: 'Can parents request a free demo class before finalizing regular sessions?',
    a: 'Yes. Every parent can schedule a complimentary 1-on-1 demo session at home. This allows you and your child to assess the tutor’s teaching style, communication, and approach before committing.',
  },
  {
    q: 'What subjects can we find home tutors for in Raipur?',
    a: 'We coordinate specialized tutors for Mathematics, Science (Physics, Chemistry, Biology), English, Social Studies, Hindi, Computer Science, and Commerce stream subjects (Accountancy, Economics, Business Studies).',
  },
  {
    q: 'How are home tutors verified by Jilani Home Tutor?',
    a: 'Each tutor undergoes identity verification, academic qualification checks, and an interview process to evaluate teaching proficiency and pedagogical approach before assignment to student homes.',
  },
];

export default function HomeTutorInRaipurPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
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
              <Link href="/">Home</Link> &gt; <span>Home Tutor in Raipur</span>
            </div>
            <div className={styles.badge}>📍 1-on-1 Home Tuition Across Raipur</div>
            <h1 className={styles.h1Title}>Home Tutor in Raipur</h1>
            <h2 className={styles.h2Subtitle}>
              Personalized 1-on-1 Home Tuition for School Students in Raipur, Chhattisgarh
            </h2>
            <p className={styles.desc}>
              Jilani Home Tutor connects parents in Raipur with verified, experienced home tutors for Classes 1 to 12.
              Whether your child needs foundational clarity, board exam preparation, or subject-specific guidance in Maths and Science, our team coordinates the right tutor directly to your doorstep.
            </p>
          </div>
        </section>

        {/* Content & Form Grid */}
        <section className={styles.contentSection}>
          <div className={styles.gridInner}>
            <div className={styles.leftCol}>
              {/* Introduction */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Trusted In-Home Academic Mentoring in Raipur</h2>
                <p className={styles.paragraph}>
                  At Jilani Home Tutor, we understand that every student learns at a different pace. Large classroom batches often make it difficult for quiet or struggling learners to ask questions openly. Our home tuition model provides dedicated one-on-one attention in the comfort and safety of your home, allowing tutors to adapt lesson plans directly to your child’s school syllabus.
                </p>
              </div>

              {/* Classes Covered */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Home Tuition Services for Classes 1–12</h3>
                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>🌱</span>
                  <div>
                    <h3>Primary Classes (Class 1–5)</h3>
                    <p>Building core reading, writing, mathematical arithmetic, and curiosity with patient, child-friendly home tutors.</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>📐</span>
                  <div>
                    <h3>Middle School (Class 6–8)</h3>
                    <p>Strengthening foundational concepts in Mathematics, Science, and English before high school transitions.</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>🎯</span>
                  <div>
                    <h3>Secondary School (Class 9–10 Board Prep)</h3>
                    <p>Rigorous revision, NCERT exercise mastery, theorem proofs, and previous-year question practice for CBSE & CG Board.</p>
                  </div>
                </div>

                <div className={styles.featureCard}>
                  <span className={styles.featureIcon}>🔬</span>
                  <div>
                    <h3>Senior Secondary (Class 11–12)</h3>
                    <p>Specialized subject faculty for Science (Physics, Chemistry, Maths, Biology) and Commerce streams.</p>
                  </div>
                </div>
              </div>

              {/* Subject Options */}
              <div className={styles.textBlock}>
                <h3 className={styles.subheading}>Subject-Wise Tutoring Available</h3>
                <ul className={styles.bulletList}>
                  <li><strong>Mathematics:</strong> Conceptual problem-solving, arithmetic, algebra, geometry, trigonometry, and calculus.</li>
                  <li><strong>Science:</strong> Physics mechanics and numericals, Chemistry equations, and Biology diagrammatic revision.</li>
                  <li><strong>Languages:</strong> English grammar, comprehension, literature, and Hindi curriculum assistance.</li>
                  <li><strong>Commerce & Humanities:</strong> Accountancy journal entries, Economics diagrams, and Social Science history/civics.</li>
                </ul>
              </div>

              {/* Verified Areas */}
              <div className={styles.areasBox}>
                <h3 className={styles.areasTitle}>📍 Verified Service Localities in Raipur</h3>
                <div className={styles.areaPills}>
                  {VERIFIED_AREAS.map((area) => (
                    <span key={area} className={styles.areaPill}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* How Parents Request a Tutor */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>How to Request a Home Tutor in Raipur</h2>
                <div className={styles.stepsGrid}>
                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <h4 className={styles.stepTitle}>Submit Your Requirements</h4>
                      <p className={styles.stepDesc}>Fill in the parent inquiry form or reach out to us via call or WhatsApp at +91 79998 54628.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <h4 className={styles.stepTitle}>Academic Assessment & Matching</h4>
                      <p className={styles.stepDesc}>Our team reviews your child’s class, board, locality, and learning objectives to coordinate a qualified tutor.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <h4 className={styles.stepTitle}>Free In-Home Demo Session</h4>
                      <p className={styles.stepDesc}>Attend a scheduled 1-on-1 demo class at your home to evaluate tutor compatibility and teaching approach.</p>
                    </div>
                  </div>

                  <div className={styles.stepCard}>
                    <div className={styles.stepNum}>4</div>
                    <div>
                      <h4 className={styles.stepTitle}>Begin Regular Tuition</h4>
                      <p className={styles.stepDesc}>Once satisfied, confirm your weekly class schedule with continuous progress updates from the tutor.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Jilani Home Tutor */}
              <div className={styles.textBlock}>
                <h2 className={styles.sectionHeading}>Why Raipur Parents Trust Jilani Home Tutor</h2>
                <ul className={styles.bulletList}>
                  <li><strong>Verified In-Home Mentors:</strong> Academic background checks and credential verification prior to student home visits.</li>
                  <li><strong>Customized 1-on-1 Pace:</strong> Tutors adjust explanations to suit individual student comprehension speeds.</li>
                  <li><strong>Convenience & Safety:</strong> Learn in the quiet, focused environment of your own home with no travel stress.</li>
                  <li><strong>Flexible Timings:</strong> Evening and morning session slots arranged according to the student’s school schedule.</li>
                </ul>
              </div>

              {/* Direct Contact CTA */}
              <div className={styles.directCtaBox}>
                <h3 className={styles.directCtaTitle}>Need Immediate Guidance?</h3>
                <p className={styles.directCtaSub}>Speak directly with our academic coordinator in Raipur to discuss your child’s needs.</p>
                <div className={styles.ctaButtons}>
                  <a href="tel:+917999854628" className={styles.phoneCtaBtn}>
                    📞 Call +91 79998 54628
                  </a>
                  <a
                    href="https://wa.me/917999854628?text=Hello%20Jilani%20Home%20Tutor,%20I%20am%20looking%20for%20a%20home%20tutor%20in%20Raipur."
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
                {FAQS.map((faq) => (
                  <div key={faq.q} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Internal Links Box */}
              <div className={styles.internalLinksBox}>
                <h3>Explore Related Tutoring Programs in Raipur</h3>
                <ul>
                  <li><Link href="/class-10-tutor-raipur">📘 Class 10 Board Exam Home Tutor in Raipur</Link></li>
                  <li><Link href="/class-12-tutor-raipur">🎓 Class 12 Board & Entrance Home Tutor in Raipur</Link></li>
                  <li><Link href="/maths-home-tutor-raipur">🧮 Dedicated Maths Home Tutor in Raipur</Link></li>
                  <li><Link href="/shankar-nagar-home-tutor">📍 Home Tutor in Shankar Nagar, Raipur</Link></li>
                  <li><Link href="/jee-neet-tuition-raipur">🚀 JEE & NEET Entrance Home Tuition in Raipur</Link></li>
                  <li><Link href="/find-tutor">🔍 Submit Detailed Tutor Request</Link></li>
                  <li><Link href="/">🏠 Return to Homepage</Link></li>
                </ul>
              </div>
            </div>

            {/* Right Column Form */}
            <div className={styles.rightCol}>
              <div className={styles.formCard}>
                <h3 className={styles.formTitle}>Request a Home Tutor</h3>
                <p className={styles.formSub}>Share your requirements to book a free 1-on-1 demo session at home in Raipur.</p>
                <RegisterForm defaultClass="Class 9" defaultSubject="Maths + Science (Both)" pageSource="Home Tutor in Raipur Page" />
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
