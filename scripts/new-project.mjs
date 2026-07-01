#!/usr/bin/env node
// @ts-check
/**
 * Scaffold new case-study drafts so a batch of projects can be stubbed out fast,
 * long before the real content or images exist.
 *
 *   npm run new:project -- <slug> [<slug> ...]
 *   npm run new:project -- gate-detection lidar-fusion rrt-planner
 *
 * For each slug it writes a schema-valid, `status: draft` MDX file wired to a
 * shared placeholder hero (so `astro check`/`build` stay green with zero real
 * assets) plus an empty `src/assets/projects/<slug>/` folder to drop images in.
 * Drafts never appear on the site, in the sitemap, or in the RSS feed until you
 * flip `status` to `published`.
 *
 * Flags:
 *   --preset <name>   initial vibe (default: editorial). One of:
 *                     editorial · showcase · paper · gallery · motion ·
 *                     technical · minimal · feature · brutalist
 *   --title "..."     human title (only meaningful with a single slug)
 *   --force           overwrite an existing MDX for the slug
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_DIR = join(ROOT, 'src/content/projects');
const ASSETS_DIR = join(ROOT, 'src/assets/projects');

const PRESETS = [
  'editorial',
  'showcase',
  'paper',
  'gallery',
  'motion',
  'technical',
  'minimal',
  'feature',
  'brutalist',
];

/**
 * Parse `--flag value` / `--flag` and positional args.
 * @param {string[]} argv
 */
function parseArgs(argv) {
  /** @type {string[]} */
  const slugs = [];
  /** @type {{ preset: string, title: string | undefined, force: boolean }} */
  const opts = { preset: 'editorial', title: undefined, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') opts.force = true;
    else if (a === '--preset') opts.preset = argv[++i];
    else if (a === '--title') opts.title = argv[++i];
    else if (a.startsWith('--')) fail(`Unknown flag: ${a}`);
    else slugs.push(a);
  }
  return { slugs, opts };
}

/** @param {string} msg */
function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

/**
 * kebab-case slug → Title Case fallback title.
 * @param {string} slug
 */
function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/** @param {string} slug */
function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/** @param {string} path */
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Full frontmatter + body skeleton mirroring the design constitution's order.
 * @param {{ slug: string, title: string, preset: string }} params
 */
function template({ slug, title, preset }) {
  const today = new Date().toISOString().slice(0, 10);
  return `---
title: '${title.replace(/'/g, '’')}'
summary: 'One or two sentences a recruiter can grasp in five seconds. Keep it under 200 characters and honest.'
role: 'Your role — e.g. Perception & Integration'
timeframe: 'Season YYYY'
teamSize: 1
preset: '${preset}'
contributions:
  - 'What *you* specifically did — one concrete bullet per contribution.'
tech:
  - 'Python'
categories:
  - 'Robotics'
featured: false
order: 99
# Shared placeholder so the build stays green — swap for a real hero once you
# drop images into src/assets/projects/${slug}/.
heroImage: '../../assets/placeholder.png'
heroAlt: 'TODO: describe the hero image for screen readers (required).'
links: {}
results: []
gallery: []
# Draft = hidden from the site, sitemap and RSS. Flip to 'published' when ready.
status: 'draft'
publishedDate: ${today}
---

{/*
  Editorial kit available in the body without imports: Figure, FullBleed, Split,
  Gallery, Metrics, PullQuote, SectionLabel, ScrollParallax, Compare.
  Keep it image-centric — never leave a case study as plain prose.
*/}

## Overview

Set the scene: what was built, for whom, and the one hard constraint that shaped
everything.

## Problem

The real engineering problem, with the messy real-world detail that made it hard.

## Design decisions

The key choices and the alternatives you weighed. Justify them.

## Technical architecture

How the pieces fit together. Weave in a diagram with \`<Figure>\` or \`<Split>\`.

## Challenges

Where it got difficult.

## Solutions

How you got through — measured, honest.

## Results

What actually happened. Prefer concrete numbers in frontmatter \`results\`.

## Lessons learned

What you'd carry into the next project.
`;
}

async function main() {
  const { slugs, opts } = parseArgs(process.argv.slice(2));

  if (slugs.length === 0) {
    fail(
      'Provide at least one slug.\n\n' +
        '  npm run new:project -- <slug> [<slug> ...]\n' +
        '  npm run new:project -- gate-detection lidar-fusion --preset technical',
    );
  }
  if (!PRESETS.includes(opts.preset)) {
    fail(`Unknown preset "${opts.preset}". Choose one of:\n  ${PRESETS.join(' · ')}`);
  }
  if (opts.title && slugs.length > 1) {
    fail('--title only makes sense with a single slug.');
  }

  for (const slug of slugs) {
    if (!isValidSlug(slug)) {
      fail(`Invalid slug "${slug}" — use lowercase kebab-case (e.g. lidar-fusion).`);
    }
    const mdxPath = join(PROJECTS_DIR, `${slug}.mdx`);
    if (!opts.force && (await exists(mdxPath))) {
      fail(`${slug}.mdx already exists. Pass --force to overwrite.`);
    }

    const title = opts.title ?? titleFromSlug(slug);
    await mkdir(PROJECTS_DIR, { recursive: true });
    await mkdir(join(ASSETS_DIR, slug), { recursive: true });
    await writeFile(mdxPath, template({ slug, title, preset: opts.preset }), 'utf8');

    console.log(`✓ ${slug}  (${opts.preset})  → src/content/projects/${slug}.mdx`);
  }

  console.log(
    `\nScaffolded ${slugs.length} draft${slugs.length > 1 ? 's' : ''}. ` +
      `Add images to src/assets/projects/<slug>/, write the story, then set status: published.\n`,
  );
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
