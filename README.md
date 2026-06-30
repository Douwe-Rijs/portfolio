# Douwe Rijs — Portfolio

A bespoke, editorial, content-driven portfolio for showcasing robotics & ML
case studies. Built with **Astro + TypeScript + Tailwind CSS v4 + MDX**, with
React islands for interactive bits. Each project is a case study generated from
source material (PDF / PPTX / images / text) via a documented agent pipeline.

> Design philosophy, decisions and the full plan live in [`docs/DESIGN.md`](docs/DESIGN.md),
> [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`AGENTS.md`](AGENTS.md). The content
> workflow is in [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md).

## Quickstart

```sh
npm install
npm run dev          # http://localhost:4321
```

## Scripts

| Command           | Action                                              |
| :---------------- | :-------------------------------------------------- |
| `npm run dev`     | Start the local dev server                          |
| `npm run build`   | Build the production site to `./dist/`              |
| `npm run preview` | Preview the production build locally                |
| `npm run check`   | Type-check + validate content (`astro check`)       |
| `npm run lint`    | ESLint + Prettier check                             |
| `npm run format`  | Format all files with Prettier                      |
| `npm run ingest`  | Ingest source files into staging (see pipeline doc) |

## Tech stack

- **Astro 7** — content-first, ships ~0 KB JS by default
- **TypeScript** (strict) + **Content Collections** (Zod-validated case studies)
- **Tailwind CSS v4** (CSS-first tokens) + self-hosted variable fonts
- **MDX** for rich case-study bodies
- **React islands** (theme toggle, future filters) + **Framer Motion**
- **Astro View Transitions** for JS-light page transitions
- **@astrojs/sitemap**, JSON-LD, dynamic `robots.txt`, per-page SEO/OG
- **Vercel** (free Hobby tier) for hosting + cookieless Web Analytics

## Project structure

```text
src/
├── components/        # Astro components + React islands (ThemeToggle.tsx)
├── content/
│   ├── projects/      # Case studies (.mdx) — the centrepiece
│   └── posts/         # Blog (ready, hidden until first post)
├── content.config.ts  # Zod schema for collections (alt text required)
├── layouts/           # BaseLayout (head, nav, footer, transitions)
├── pages/             # Routes: /, /work, /work/[slug], /about, /resume, /contact
├── styles/global.css  # Design tokens, fonts, prose styling
└── consts.ts          # Site metadata, nav, socials
content/_sources/      # (gitignored) raw source drops for the pipeline
content/_staging/      # (gitignored) ingest output
scripts/ingest.py      # Multi-format source → staging
docs/                  # DESIGN.md, CONTENT_PIPELINE.md, ROADMAP.md
```

## Deployment

Hosted on **Vercel**. The canonical URL is configurable via the `SITE_URL`
environment variable (see `.env.example`) so we can move from the free
`*.vercel.app` domain to `standofl.nl` with no code change. Set `SITE_URL` in
the Vercel project settings; analytics are cookieless and auto-enabled.

## Adding a project (TL;DR)

1. Drop source files into `content/_sources/<slug>/`.
2. `npm run ingest -- <slug>` → produces `content/_staging/<slug>/`.
3. Author `src/content/projects/<slug>.mdx` from the staging text + images
   (full protocol in [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md)).
4. `npm run build` validates the schema (missing alt text fails the build).

## License

All rights reserved. See [`LICENSE`](LICENSE). Published for viewing only.
