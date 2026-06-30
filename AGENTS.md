# AGENTS.md — context & rules for AI agents

This file is the portable "source of truth" so any agent, on any machine, can
continue the work with full context. **Read this before writing code.**

---

## What this project is

A bespoke, editorial portfolio for **Douwe Rijs** (Robotics & ML Engineer, MSc
Robotics @ TU Delft, R&D @ Allseas). Goal: land **MSc thesis placements and
robotics/ML jobs**. Audience: recruiters, hiring managers, thesis supervisors.
The centrepiece is **project case studies**, generated from source documents
(PDF/PPTX/images/text) via the content pipeline below.

## Design constitution (non-negotiable)

The owner explicitly does **not** want a stereotypical AI-generated developer
portfolio. **Avoid** these tropes — if a layout would be instantly recognisable
as an AI/template portfolio, redesign it:

- ❌ Glassmorphism, neon/cyberpunk gradients, excessive blur
- ❌ Generic floating cards, animated background particles, spinning/bouncing icons
- ❌ "Hi, I'm… + three buttons" hero, endless repeated identical card sections
- ❌ Default Tailwind/Bootstrap looks, cookie-cutter template layouts

**Instead**, design like Apple / Stripe / Linear / Notion / Figma / Vercel /
Framer / Awwwards-winning sites:

- ✅ Editorial, image-driven, **case-study-led**. Images occupy 40–70% of the
  viewport on project pages — never tiny thumbnails.
- ✅ **Typography creates interest before colour.** Large headings, clear
  hierarchy, generous line-height. Display grotesque (Space Grotesk) + body sans
  (Inter) + mono (JetBrains Mono).
- ✅ **Restrained palette, one accent** (botanical green). Composition, spacing
  and photography lead; colour supports. All colours are CSS variable tokens.
- ✅ **Premium, purposeful motion**: smooth scroll, tasteful fades, image
  reveals, staggered loads, subtle parallax, microinteractions. Motion guides
  attention; never gimmicky. **Always respect `prefers-reduced-motion`.**
- ✅ Asymmetric, curated layouts with rhythm: alternate image-heavy / text /
  showcase / whitespace. Every section has a clear purpose.

**For every major design decision: explain the reasoning, offer alternatives,
and justify why the choice supports the owner's professional brand.** Do not
default to the easy/template solution.

## Tech stack

Astro 7 · TypeScript (strict) · Tailwind CSS v4 (CSS-first `@theme` tokens) ·
MDX + Content Collections (Zod) · React 19 islands · Framer Motion · Astro View
Transitions · self-hosted variable fonts (Fontsource) · Vercel hosting +
cookieless Web Analytics.

Accessibility target **WCAG 2.2 AA**; performance target **Lighthouse ≥ 95,
LCP < 2 s, ~0 KB JS on content pages** (islands only where needed).

## Project structure

See `README.md`. Key: case studies are `.mdx` in `src/content/projects/`,
schema in `src/content.config.ts`, design tokens + prose in
`src/styles/global.css`, site metadata in `src/consts.ts`.

## Conventions

- **Imports** use the `@/` alias → `src/` (e.g. `@/components/Nav.astro`).
- **Styling**: use the semantic Tailwind tokens — `bg-base`, `bg-surface`,
  `text-ink`, `text-muted`, `border-line`, `text-accent`, `bg-accent`,
  `text-on-accent`, `font-display`, `font-mono`, and `display-xl` / `display-lg`
  utilities. Do not hard-code hex colours in components.
- **Dark mode** is driven by `data-theme="dark"` on `<html>` (set pre-paint in
  `BaseLayout`). Use the `dark:` variant only when a token can't express it.
- **Images**: always via Astro `<Image>` (responsive `widths` + `sizes`). Every
  image **must** have meaningful `alt` text — the content schema enforces it and
  the build fails without it.
- **React islands**: keep them minimal; add the smallest `client:*` directive
  that works (`client:load` for the theme toggle, `client:visible` when below
  the fold).
- Run `npm run lint` and `npm run check` before committing (Husky + lint-staged
  enforce this on staged files).

## Content pipeline (summary)

Full detail in `docs/CONTENT_PIPELINE.md`. To add a case study:

1. Drop sources into `content/_sources/<slug>/` (PDF, PPTX, PNG/JPG, TXT/MD).
2. `npm run ingest -- <slug>` → writes `content/_staging/<slug>/` with
   `text.md`, optimised `images/`, and `manifest.json`.
3. **Author** `src/content/projects/<slug>.mdx`:
   - Fill frontmatter per the schema (`src/content.config.ts`). Required:
     `title, summary, role, timeframe, heroImage, heroAlt, publishedDate`.
   - Copy the chosen images from staging into
     `src/assets/projects/<slug>/` and reference them in frontmatter/body.
   - Write the narrative in the MDX body using these sections, in order:
     **Overview → Problem → Design decisions → Technical architecture →
     Challenges → Solutions → Results → Lessons learned**. Keep prose clear,
     concise, recruiter-appropriate, and **honest — never exaggerate**.
   - Set `status: published` and `featured: true` for homepage projects.
4. `npm run build` validates everything.

The first case study is the **Autonomous Drone (MAV)** project (TU Delft
MAVLab) — source `Report_MAV(2).pdf`, assets already extracted.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
