import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

/**
 * Build-time Open Graph images, one per published project. Generated with
 * canvaskit (no SSR adapter needed) so every case study gets a branded social
 * card instead of the shared static fallback. Palette mirrors the dark brand
 * tokens in `global.css` (ink #f4f3ef on #0b0c0e, botanical-green accent).
 */
const projects = await getCollection('projects', (p) => p.data.status === 'published');

const pages = Object.fromEntries(
  projects.map((project) => [
    project.id,
    { title: project.data.title, description: project.data.summary },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_id, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [11, 12, 14],
      [17, 22, 19],
    ],
    border: { color: [74, 222, 128], width: 12, side: 'inline-start' },
    padding: 80,
    font: {
      title: { color: [244, 243, 239], size: 62, weight: 'Bold', lineHeight: 1.1 },
      description: { color: [163, 167, 175], size: 30, lineHeight: 1.4 },
    },
  }),
});
