import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.jilanihometutor.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    // Main landing page
    {
      path: '/',
    },

    // Parent / tutor enquiry page
    {
      path: '/find-tutor',
    },

    // City-wide SEO landing page
    {
      path: '/home-tutor-in-raipur',
    },

    // Class-specific SEO landing pages
    {
      path: '/class-10-tutor-raipur',
    },
    {
      path: '/class-12-tutor-raipur',
    },

    // Subject-specific SEO landing page
    {
      path: '/maths-home-tutor-raipur',
    },

    // Location-specific SEO landing page
    {
      path: '/shankar-nagar-home-tutor',
    },

    // Competitive exam tuition
    {
      path: '/jee-neet-tuition-raipur',
    },
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
  }));
}