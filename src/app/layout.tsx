import type { Metadata, Viewport } from 'next';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';

// ─── Site URL (change ONLY here if domain ever changes) ───────────────────────

const SITE_URL = 'https://www.jilanihometutor.in';

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// ─── Open Graph & Metadata ────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ── Title & Description ──
  title: 'Home Tutor in Raipur | Jilani Home Tutor',
  description:
    'Find suitable home tutors in Raipur for Classes 1–12, Maths, Science and English. Connect with Jilani Home Tutor for personalised home tuition.',

  // ── Keywords ──
  keywords:
    'home tutor in raipur, home tuition raipur, maths tutor raipur, science tutor raipur, english tutor raipur, class 10 tutor raipur, board exam tutor raipur, tutor near me raipur, shankar nagar tutor, tatibandh tutor, class 9 tutor raipur, private tutor raipur, 1 on 1 tuition raipur',

  // ── Indexing ──
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // ── Canonical ──
  alternates: {
    canonical: '/',
  },

  // ── Open Graph (WhatsApp, Facebook, LinkedIn previews) ──
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Jilani Home Tutor',
    title: 'Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Find suitable home tutors in Raipur for Classes 1–12, Maths, Science and English. Connect with Jilani Home Tutor for personalised home tuition.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Jilani Home Tutor – Home Tutor in Raipur',
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card: 'summary_large_image',
    title: 'Home Tutor in Raipur | Jilani Home Tutor',
    description:
      'Find suitable home tutors in Raipur for Classes 1–12, Maths, Science and English. Connect with Jilani Home Tutor for personalised home tuition.',
    images: [`${SITE_URL}/og-image.png`],
  },

  // ── Icons / Favicons ──
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // ── App metadata ──
  authors: [{ name: 'Jilani Home Tutor', url: SITE_URL }],
  creator: 'Jilani Home Tutor',
  publisher: 'Jilani Home Tutor',
};

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'EducationalOrganization'],
  '@id': `${SITE_URL}/#business`,
  name: 'Jilani Home Tutor',
  alternateName: 'Jilani Home Tuition Raipur',
  description:
    'Jilani Home Tutor connects parents and students with verified 1-on-1 home tutors for Class 1 to 12 in Raipur, covering Maths, Science, English, and competitive exams.',
  url: SITE_URL,
  telephone: '+917999854628',
  email: 'jilanihometutor@gmail.com',
  priceRange: '₹₹',
  image: `${SITE_URL}/og-image.png`,
  logo: `${SITE_URL}/logo.png`,
  address: {
    '@type': 'PostalAddress',
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
    { '@type': 'Place', name: 'Civil Lines, Raipur' },
    { '@type': 'Place', name: 'Pandri, Raipur' },
    { '@type': 'Place', name: 'Telibandha, Raipur' },
    { '@type': 'Place', name: 'Tatibandh, Raipur' },
    { '@type': 'Place', name: 'Devendra Nagar, Raipur' },
    { '@type': 'Place', name: 'Pachpedi Naka, Raipur' },
    { '@type': 'Place', name: 'Avanti Vihar, Raipur' },
    { '@type': 'Place', name: 'Byron Bazar, Raipur' },
    { '@type': 'Place', name: 'Mowa, Raipur' },
    { '@type': 'Place', name: 'Rajendra Nagar, Raipur' },
    { '@type': 'Place', name: 'Khamardih, Raipur' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
  '@id': `${SITE_URL}/#service`,
  name: 'Home Tutoring Service in Raipur',
  provider: { '@id': `${SITE_URL}/#business` },
  serviceType: 'Home Tutoring',
  description:
    '1-on-1 home tutors for Class 1 to 12 in Raipur covering Maths, Science, English, JEE/NEET prep and school subjects with personalised study plans.',
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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'JEE & NEET Preparation Tutor Raipur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Primary Class Tutor Raipur (Class 1–5)' } },
    ],
  },
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicons & Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

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
      </head>
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}