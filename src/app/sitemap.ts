
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

    // Class-specific SEO landing pages
    {
      path: '/class-10-tutor-raipur',
    },

    // Location-specific SEO landing pages
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