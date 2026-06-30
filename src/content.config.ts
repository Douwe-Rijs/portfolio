import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

/**
 * Projects = case studies. Structured metadata lives in frontmatter; the
 * narrative (problem, design decisions, architecture, challenges, lessons)
 * lives in the MDX body for editorial flexibility.
 *
 * Alt text is REQUIRED on every image so the build fails if accessibility is
 * neglected — a hard quality gate, not a guideline.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(200),
      role: z.string(),
      timeframe: z.string(),
      teamSize: z.union([z.number(), z.string()]).optional(),
      contributions: z.array(z.string()).default([]),
      tech: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(0),
      heroImage: image(),
      heroAlt: z.string().min(1, 'heroAlt is required for accessibility'),
      links: z
        .object({
          repo: z.string().url().optional(),
          demo: z.string().url().optional(),
          paper: z.string().url().optional(),
        })
        .default({}),
      results: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1, 'gallery image alt is required'),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      status: z.enum(['draft', 'published']).default('draft'),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      seo: z
        .object({ title: z.string().optional(), description: z.string().optional() })
        .optional(),
    }),
});

/** Blog posts — collection is ready; pages stay hidden until the first post. */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projects, posts };
