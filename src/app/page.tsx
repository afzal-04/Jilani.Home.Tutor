// src/app/page.tsx
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import WhatsappButton from '@/components/WhatsappButton';
import Hero from '@/sections/Hero';
import Problems from '@/sections/Problems';
import WhyUs from '@/sections/WhyUs';
import Services from '@/sections/Services';
import Register from '@/sections/Register';
import Testimonials from '@/sections/Testimonials';
import Faq from '@/sections/Faq';
import CtaBand from '@/sections/CtaBand';
import Footer from '@/sections/Footer';

export const metadata: Metadata = {
  title: 'Home Tutor in Raipur | Jilani Home Tutor',
  description:
    'Find suitable home tutors in Raipur for Classes 1–12, Maths, Science and English. Connect with Jilani Home Tutor for personalised home tuition.',
  alternates: {
    canonical: '/',
  },
};

const HOMEPAGE_FAQS = [
  {
    q: 'What is the fee for a home tutor in Raipur?',
    a: 'Fees depend on the class, subject, and sessions per week. We first provide a FREE demo class. Generally fees range from ₹1500–₹5000/month depending on the class level.',
  },
  {
    q: 'Is the first demo class really free?',
    a: 'Yes, absolutely! The first demo class is 100% free with no obligation. Evaluate the tutor and decide if you want to continue. Only after you are satisfied do you pay.',
  },
  {
    q: 'How do I pay the tutor fees?',
    a: 'You need to pay fees to us via cash, UPI, or bank transfer. We recommend monthly payments. Our team guides you on the fee structure after the demo class.',
  },
  {
    q: 'How quickly will you find a tutor for my child?',
    a: 'We match parents with the right tutor within 24 hours of registration. In most cases, the demo class is scheduled within 2 days of your enquiry.',
  },
  {
    q: 'Do you provide tutors across all areas of Raipur?',
    a: 'Yes! We have tutors across Shankar Nagar, Civil Lines, Pandri, Telibandha, Tatibandh, Devendra Nagar, Pachpedi Naka, Avanti Vihar, Mowa, Rajendra Nagar, and most other areas in Raipur.',
  },
  {
    q: 'What subjects do your tutors teach?',
    a: 'Our tutors cover Maths, Science (Physics, Chemistry, Biology), English, Hindi, Social Science, Computer Science, Accountancy, and most school subjects for Class 1–12. We also offer competitive exam coaching and activity classes.',
  },
  {
    q: 'Do you provide tutors for Class 10 and Class 12 boards?',
    a: 'Yes! Board exam preparation is our specialty. We have experienced tutors specifically for Class 10 and 12 boards with focus on Maths, Science, English. Mock tests and revision sessions are included.',
  },
  {
    q: 'Do you provide coaching for JEE and NEET?',
    a: 'Yes! We have expert tutors for JEE (Maths, Physics, Chemistry) and NEET (Physics, Chemistry, Biology) at home. 1-on-1 personal coaching ensures focused preparation.',
  },
  {
    q: 'Are your tutors verified and trustworthy?',
    a: 'Yes! All tutors go through verification before onboarding. We check qualifications, experience, and conduct a personal interview. Your child’s safety and quality education is our top priority.',
  },
  {
    q: 'Can I request a female tutor for my daughter?',
    a: 'Absolutely! You can specify your gender preference when registering. We will do our best to match you with a tutor of your preferred gender.',
  },
];

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
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
      <main>
        <Hero />
        <Problems />
        <WhyUs />
        <Services />
        <Register />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
