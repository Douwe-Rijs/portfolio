// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Canonical URL drives SEO, sitemap and Open Graph. Configurable via env so we
// can switch from the free *.vercel.app domain to standofl.nl without code changes.
const SITE_URL = process.env.SITE_URL ?? 'https://portfolio.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    react(),
    // Keep internal preview routes out of the public sitemap.
    sitemap({ filter: (page) => !page.includes('/preview/') }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
