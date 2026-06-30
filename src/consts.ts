/** Single source of truth for site-wide metadata, navigation and socials. */

export const SITE = {
  name: 'Douwe Rijs',
  role: 'Robotics & Machine Learning Engineer',
  title: 'Douwe Rijs — Robotics & Machine Learning Engineer',
  description:
    'Robotics & ML engineer (MSc, TU Delft) building real-world perception, planning and software systems across the autonomy stack.',
  // Resolved from astro.config `site` (driven by SITE_URL env).
  url: import.meta.env.SITE ?? 'https://portfolio.vercel.app',
  locale: 'en',
  email: 'Douwe@standofl.nl',
} as const;

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Douwe-Rijs' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/douwe-rijs-7990b2259/' },
] as const;

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const;
