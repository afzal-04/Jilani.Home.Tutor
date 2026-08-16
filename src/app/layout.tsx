import type { Metadata, Viewport } from 'next';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ─── Open Graph & Metadata ────────────────────────────────────────────────────

export const metadata: Metadata = {
  // ── Title & Description ──
  title: 'Best Home Tutor in Raipur | Jilani Home Tutor – Guaranteed Results',
  description:
    'Looking for the best home tutor in Raipur? Jilani Home Tutor provides expert 1-on-1 home tuition for Class 1–12 in Maths, Science & English. Book a FREE demo class today!',

  // ── Keywords (helps Bing + older crawlers) ──
  keywords:
    'home tutor in raipur, best tutor raipur, home tuition raipur, maths tutor raipur, science tutor raipur, english tutor raipur, class 10 tutor raipur, board exam tutor raipur, tutor near me raipur, shankar nagar tutor, tatibandh tutor, class 9 tutor raipur, private tutor raipur, 1 on 1 tuition raipur',

  // ── Indexing ──
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // ── Canonical ──
  alternates: {
    canonical: 'https://jilani-home-tutor.vercel.app',
  },

  // ── Open Graph (WhatsApp, Facebook, LinkedIn previews) ──
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jilani-home-tutor.vercel.app',
    siteName: 'Jilani Home Tutor',
    title: 'Best Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Expert home tutors for Class 1–12 in Raipur. Personalised 1-on-1 attention. Guaranteed improvement in marks. Book your FREE demo class today!',
    images: [
      {
        url: 'https://jilani-home-tutor.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jilani Home Tutor – Best Home Tutor in Raipur',
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card: 'summary_large_image',
    title: 'Best Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Expert home tutors for Class 1–12 in Raipur. Book a FREE demo class today!',
    images: ['https://jilani-home-tutor.vercel.app/og-image.jpg'],
  },

  // ── App metadata ──
  authors: [{ name: 'Jilani Home Tutor', url: 'https://jilani-home-tutor.vercel.app' }],
  creator: 'Jilani Home Tutor',
  publisher: 'Jilani Home Tutor',
};

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EducationalOrganization'],
  '@id': 'https://jilani-home-tutor.vercel.app/#business',
  name: 'Jilani Home Tutor',
  alternateName: 'Jilani Home Tuition Raipur',
  description:
    'Jilani Home Tutor provides the best 1-on-1 home tuition for Class 1 to 12 students in Raipur. Specialised in Maths, Science, and English with guaranteed results.',
  url: 'https://jilani-home-tutor.vercel.app',
  telephone: '+917999854628',
  email: 'jilanihometutor@gmail.com',
  priceRange: '₹₹',
  image: 'https://jilani-home-tutor.vercel.app/og-image.jpg',
  logo: 'https://jilani-home-tutor.vercel.app/favicon.ico',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Raipur',
    addressLocality: 'Raipur',
    addressRegion: 'Chhattisgarh',
    postalCode: '492001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '21.2514',
    longitude: '81.6296',
  },
  areaServed: [
    { '@type': 'City', name: 'Raipur' },
    { '@type': 'Place', name: 'Shankar Nagar, Raipur' },
    { '@type': 'Place', name: 'Tatibandh, Raipur' },
    { '@type': 'Place', name: 'Pandri, Raipur' },
    { '@type': 'Place', name: 'Telibandha, Raipur' },
    { '@type': 'Place', name: 'Devendra Nagar, Raipur' },
    { '@type': 'Place', name: 'Avanti Vihar, Raipur' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '07:00',
      closes: '21:00',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+917999854628',
    contactType: 'Customer Service',
    availableLanguage: ['Hindi', 'English'],
  },
  sameAs: [],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://jilani-home-tutor.vercel.app/#service',
  name: 'Home Tutoring Service in Raipur',
  provider: { '@id': 'https://jilani-home-tutor.vercel.app/#business' },
  serviceType: 'Home Tutoring',
  description:
    'Expert 1-on-1 home tutors for Class 1 to 12 in Raipur covering Maths, Science, English, Hindi and more. We provide personalised study plans and guaranteed score improvement.',
  areaServed: { '@type': 'City', name: 'Raipur' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'First demo class is FREE. No commitment required.',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tutoring Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maths Home Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Science Home Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'English Home Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Class 10 Board Exam Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Class 12 Board Exam Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Primary Class Tutor Raipur (Class 1–5)' } },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the fee for a home tutor in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fees depend on the class and subject. We offer a FREE demo class with no commitment. Contact us for a personalised quote — most families find our rates affordable and worth it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide home tutors for Class 10 board exams in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We specialise in Class 9 and 10 board exam preparation in Maths, Science, and English. Our students consistently score 80–95% in their boards.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can I get a home tutor in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We match you with the right tutor within 24 hours of registration. Fill the form on our website and we will call you back within 2 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which areas in Raipur do you cover for home tutoring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cover all major areas of Raipur including Shankar Nagar, Tatibandh, Pandri, Telibandha, Devendra Nagar, Avanti Vihar, Kota, Moudhapara, and more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide female home tutors in Raipur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we have both male and female tutors available. You can specify your preference when registering and we will match accordingly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the demo class really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! The first demo class is completely free with no obligation. You only continue if you and your child are satisfied with the tutor.',
      },
    },
  ],
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Geo tags */}
        <meta name="geo.region" content="IN-CT" />
        <meta name="geo.placename" content="Raipur, Chhattisgarh" />
        <meta name="geo.position" content="21.2514;81.6296" />
        <meta name="ICBM" content="21.2514, 81.6296" />

        {/* Schema.org JSON-LD blocks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}