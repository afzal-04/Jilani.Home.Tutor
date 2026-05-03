// src/app/layout.tsx
// CHANGES: Added import for VisitorTracker + <VisitorTracker /> inside <body>
// Everything else is UNCHANGED.

import type { Metadata } from 'next';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker'; // ← ADD THIS LINE

export const metadata: Metadata = {
  title: 'Best Home Tutor in Raipur | Jilani Home Tutor – Guaranteed Results',
  description:
    'Looking for the best home tutor in Raipur? Jilani Home Tutor provides expert 1-on-1 home tuition for Class 1–12. Maths, Science, English. Book a FREE demo today!',
  keywords:
    'home tutor in raipur, best tutor raipur, home tuition raipur, maths tutor raipur, science tutor raipur, class 10 tutor raipur, board exam tutor raipur',
  robots: 'index, follow',
  openGraph: {
    title: 'Best Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Expert home tutors for Class 1–12 in Raipur. Personalized attention. Guaranteed improvement. Book FREE demo!',
    type: 'website',
  },
};

// JSON-LD schema scripts for SEO
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Jilani Home Tutor',
  description: 'Best home tutor service in Raipur for Class 1-12.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Raipur',
    addressRegion: 'Chhattisgarh',
    addressCountry: 'IN',
  },
  telephone: '+917999854628',
  serviceType: 'Home Tutoring',
  areaServed: 'Raipur',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the fee for home tutor in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fees vary by class and subject. We offer a FREE demo class first. Contact us for a quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide home tutors for Class 10 board exams in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We have specialized tutors for Class 9-10 board exam preparation in Maths, Science, and English in Raipur.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I get a home tutor in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We match you with the right tutor within 24 hours of registration.',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <VisitorTracker /> {/* ← ADD THIS LINE */}
        {children}
      </body>
    </html>
  );
}
