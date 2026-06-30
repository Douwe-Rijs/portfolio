# Portfolio Website — Project Plan

**Owner:** Douwe Rijs — Robotics & ML Engineer (MSc Robotics, TU Delft; R&D, Allseas)
**Status:** Home page polished into an editorial layout (commit `5a98113`) — refined hero + credibility strip, image-led featured story, focus areas, approach, closing CTA, 0-JS entrance motion. Prior: design system `b99423c`, first case study `5ead4b4`, scaffold `41d3cb2`. Next: editorial components, About/Resume/Contact content, or more case studies.
**Last updated:** 2026-06-30

---

## 1. Project goals

- A **modular, extensible, exploratory** portfolio whose centerpiece is **project case studies**.
- Primary outcome: **land MSc thesis placements and robotics/ML jobs**.
- Each project is fed from source material (PDF / PPTX / images / text) and converted by an **AI agent pipeline** into a polished, schema-validated case study.
- Feels **bespoke and editorial** — explicitly _not_ a generic AI/template developer portfolio.
- Portable context: design rules + pipeline documented in-repo (`AGENTS.md`, `docs/`) so work continues on any machine.

## 2. Target audience

1. **Recruiters / hiring managers** (robotics, ML, perception, software) — scanning fast, need signal in 5s.
2. **Thesis supervisors / research leads** — care about technical depth, rigor, real-world problem solving.
3. **Peers / collaborators** — GitHub, demos, write-ups.

## 3. Information architecture

- **Home** — bold, visual; in 5s: who/what/why. Curated featured projects → exploration.
- **Work** — filterable project index (by tech/category). Large editorial entries, _not_ thumbnails.
- **Project detail** — full case study (one reusable template).
- **About** — narrative bio, approach, photo, skills.
- **Resume/CV** — structured experience + `cv.pdf` download.
- **Contact** — obfuscated email + LinkedIn + GitHub.
- **Blog** _(scaffolded, hidden until first post; enables RSS)_.
- System: `sitemap.xml`, `robots.txt`, OG images, JSON-LD, 404.

### Navigation

Simple, no dropdowns: **Work · About · Resume · Contact** + logo→home + theme toggle. Native page transitions (View Transitions API).

## 4. Sitemap

```
/
/work                      (project index, filter by tech/category)
/work/[slug]               (case study)
/about
/resume
/contact
/blog        (hidden until first post)
/blog/[slug] (hidden until first post)
/rss.xml     (when blog enabled)
/sitemap-index.xml
/robots.txt
/404
```

## 5. User journeys

- **Recruiter (2 min):** Home hero → understands focus → scans 3 featured projects → opens 1 case study → skims metrics/impact → Resume → Contact/LinkedIn.
- **Supervisor (5 min):** Home → Work → filters "Perception" → reads architecture + challenges + lessons → GitHub/paper link → Contact.
- **Peer:** Lands on a deep-linked case study (shared URL) → GitHub/demo → explores other work.

## 6. Design system (the "design constitution")

Editorial, image-driven, typography-first, restrained palette, premium-but-purposeful motion, anti-template. Every section has a purpose; rhythm alternates image-heavy / text-focused / showcase / whitespace. Images occupy 40–70% of viewport in case studies. **Justify every major decision with alternatives.**

### 6.1 Typography (creates visual interest _before_ color)

- **Display/Headings:** `Space Grotesk` (variable grotesque) → distinctive, engineered, editorial character. _(FINAL — chosen via live previews; `Fraunces` variable serif was the main alternative considered.)_
- **Body/UI:** `Inter` (or `Geist Sans`) → neutral, highly legible.
- **Mono/Technical accents:** `JetBrains Mono` (or `Geist Mono`) → labels, metrics, code; signals engineering.
- Fluid type scale via `clamp()`; generous line-height; large headings.
- **Self-hosted** (Fontsource) — performance + GDPR (no Google Fonts CDN).
- _Alternative:_ serif display (`Fraunces`) for a warmer, more literary feel.

### 6.2 Color palette (restrained, one accent)

- Composition/typography/spacing/photography lead; color supports.
- **Light:** ink `#0E0F11` on warm paper `#FAFAF8`; neutral gray scale.
- **Dark:** off-white on deep charcoal `#0B0C0E`.
- **One accent:** deep **botanical green** (`#15803d` light / `#4ade80` dark) for links/emphasis/data. _(FINAL — chosen via live side-by-side previews; calm, bespoke, deliberately non-techy so imagery + type lead.)_
  - _Considered:_ measured cobalt/ink blue; warm amber/ochre; clay oxblood.
- All colors are **CSS variable tokens** → trivial theming, future-proof. Finalized with live previews in the design-system milestone.

### 6.3 Motion

- **Astro View Transitions API** for page transitions (JS-light, native-feeling).
- **Framer Motion** (React islands) for in-page choreography: image reveals, staggered text, subtle parallax on hero media, hover/microinteractions.
- No gimmicks (no bouncing/spinning/floating). Motion guides attention.
- **Global `prefers-reduced-motion` respect** (animations degrade to instant/opacity).

### 6.4 Layout

- 8px spacing system; fluid 12-col grid; generous margins; intentional full-bleed breakouts.
- Asymmetric editorial layouts; mix full-width imagery, split layouts, oversized type, whitespace.
- **No stacked identical cards.**

## 7. Component library

Static Astro components by default; React islands only where interactive.

- **Editorial primitives:** `CaseStudyHero`, `FullBleedMedia`, `SplitFeature`, `EditorialText`, `ImageFigure`, `MetricRow`, `Gallery/Lightbox`, `ProjectIndexItem` (large), `Prose` (MDX styles), `SectionLabel`, `Tag/Pill`, `Nav`, `Footer`, `ThemeToggle`.
- **React islands (shadcn/ui base):** theme toggle, project filter, image lightbox/dialog, optional ⌘K.

## 8. Responsive strategy

- **Mobile-first**, fluid typography (`clamp`), reflow multi-col editorial → single column.
- Responsive images via Astro `<Image>`/`<Picture>` (AVIF/WebP, srcset); art-directed hero.
- Tailwind breakpoints sm/md/lg/xl/2xl, but compose fluidly (not breakpoint-driven cards).

## 9. Accessibility (WCAG 2.2 AA)

- Semantic landmarks, skip link, visible focus rings, full keyboard nav, focus-trapped dialogs.
- **Alt text is a _required_ schema field** → build fails without it.
- AA contrast verified on tokens; `prefers-reduced-motion`; `prefers-color-scheme` + persisted manual toggle; no meaning conveyed by motion/color alone.

## 10. SEO strategy

- Per-page `<title>`/description; canonical via `SITE_URL`.
- Open Graph + Twitter cards; **per-project dynamic OG images** (satori/Astro OG).
- **JSON-LD:** `Person` (home/about), `CreativeWork`/`Article` (projects/blog), `BreadcrumbList`.
- `@astrojs/sitemap`, `robots.txt`, semantic headings, fast LCP. RSS when blog enabled.

## 11. Performance goals

- Lighthouse **≥ 95** all categories (mobile).
- **LCP < 2.0s**, **CLS < 0.05**, **INP < 200ms**.
- Content pages ship **~0 KB JS** except islands (<~50KB where used).
- Image optimization (AVIF/WebP, responsive, lazy, hero `priority`), self-hosted subset fonts, hover-prefetch, View Transitions, island code-splitting.

## 12. Analytics strategy

- **Privacy-first, cookieless:** Vercel Web Analytics (default) or Plausible. No consent banner needed (GDPR-friendly). Optional Vercel Speed Insights for field perf.

## 13. Future extensibility

- Add a project = drop source → `ingest` → MDX (pipeline).
- Blog ready to enable; RSS auto-wires.
- i18n-ready (EN/NL) via Astro i18n if desired.
- Optional git-based CMS later (Keystatic/TinaCMS) for non-code editing.
- Token-based theming for re-skins.

## 14. Technology stack & justification

| Layer         | Choice                               | Why                                                                | Alternative considered      |
| ------------- | ------------------------------------ | ------------------------------------------------------------------ | --------------------------- |
| Framework     | **Astro**                            | Content Collections (schema), ~0 JS, best SEO/perf, islands        | Next.js (heavier, more JS)  |
| Language      | **TypeScript**                       | Type-safe content + components                                     | JS (less safe)              |
| Styling       | **Tailwind CSS** + design tokens     | Fast, consistent, themable; tokens prevent "default Tailwind" look | Vanilla CSS/SCSS            |
| Content       | **MDX + Content Collections (Zod)**  | Rich pages + validated, modular schema                             | Headless CMS (overkill now) |
| UI primitives | **shadcn/ui (React islands)**        | Accessible primitives only where needed                            | Full React app (perf cost)  |
| Motion        | **Framer Motion + View Transitions** | Premium choreography + native, JS-light transitions                | GSAP (heavier)              |
| Images        | **Astro Image (sharp)**              | Build-time AVIF/WebP, responsive                                   | Manual/`next/image`         |
| Hosting       | **Vercel (free Hobby)**              | Best Astro DX, free custom domain, previews                        | Cloudflare/Netlify/GH Pages |
| Analytics     | **Vercel Web Analytics / Plausible** | Cookieless, GDPR-friendly                                          | GA4 (cookies/consent)       |
| Fonts         | **Fontsource (self-host)**           | Perf + privacy                                                     | Google Fonts CDN            |

## 15. Agent content pipeline (multi-format, verified)

**Goal:** any agent on any machine turns raw source (PDF/PPTX/PNG/text) into a schema-valid, on-brand case study. Documented in `AGENTS.md` + `docs/CONTENT_PIPELINE.md`.

### 15.1 Supported inputs (verified)

| Format                       | Extractor                                                       | Extracts                                |
| ---------------------------- | --------------------------------------------------------------- | --------------------------------------- |
| `.pdf`                       | PyMuPDF (`fitz`)                                                | text per page + deduped embedded images |
| `.pptx/.ppt`                 | python-pptx (+ optional LibreOffice→PDF for full-slide renders) | text per slide + embedded picture blobs |
| `.png/.jpg/.jpeg/.webp/.gif` | Pillow                                                          | optimized copy, strip EXIF, dims        |
| `.txt/.md`                   | direct                                                          | normalized text                         |
| `.docx` _(optional later)_   | python-docx                                                     | text + images                           |

### 15.2 Folder convention

```
content/_sources/<slug>/      raw drop zone (PDF/PPTX/img/text)  [gitignored by default]
content/_staging/<slug>/      ingest output: text.md + images/ + manifest.json
src/assets/projects/<slug>/   curated, committed, optimized images
src/content/projects/<slug>.mdx   final case study (frontmatter + body)
```

### 15.3 Steps

1. **Drop** source files into `content/_sources/<slug>/`.
2. **Ingest:** `python scripts/ingest.py <slug>` → normalizes every source into `_staging/<slug>/` (`text.md` concatenated w/ source markers, deduped+optimized `images/`, `manifest.json` with dims + source page/slide + suggested usage).
3. **Author (agent):** read staging text + image manifest → write `src/content/projects/<slug>.mdx` from `project-template.mdx`, selecting/placing images (with **required alt text**), following the design constitution. Protocol spelled out in `AGENTS.md`.
4. **Validate:** Content Collections Zod schema validates frontmatter at build; `scripts/validate-content` in CI. Missing alt/required fields → **build fails** (quality + a11y gate).
5. **Optimize at build:** Astro `<Image>` (sharp) emits responsive AVIF/WebP.

### 15.4 Case-study schema (frontmatter)

```yaml
title: string
summary: string            # <=200, used in index + meta
role: string               # e.g. "Perception & Control"
timeframe: string          # "Sep–Dec 2024"
teamSize: number | string
contributions: string[]    # what *I* did
tech: string[]             # filter tags
categories: string[]       # ["Robotics","Perception"]
featured: boolean
order: number
heroImage: { src: string, alt: string }   # alt REQUIRED
links: { repo?: url, demo?: url, paper?: url }
results: [{ label: string, value: string }]   # metric chips
gallery: [{ src, alt, caption? }]
status: "draft" | "published"
publishedDate: date
updatedDate?: date
seo?: { title?, description?, ogImage? }
```

Narrative (problem, design decisions, architecture, challenges, solutions, lessons) lives in the **MDX body** via section components for editorial flexibility.

### 15.5 Worked example (already extracted)

**Autonomous Drone (MAV) — TU Delft MAVLab.** From `Report_MAV(2).pdf`: 12 images incl. Parrot Bebop hero, 4-panel perception (depth/obstacle + gate detection), 6-stage vision pipeline, GATELOCK tracking sequence. Staged in session `files/mav-extract/`. Becomes the first published case study.

## 16. Repository setup (next milestone)

Production-ready scaffold: clear structure, ESLint + Prettier + TypeScript strict, Astro check, Husky + lint-staged, GitHub Actions CI (lint/typecheck/build/content-validate), README, CONTRIBUTING, LICENSE (TBD), `.gitignore`, `.env.example` (`SITE_URL`, analytics id), `AGENTS.md`, `docs/` (DESIGN.md, CONTENT_PIPELINE.md), `scripts/ingest.py`.

## 17. Milestones / roadmap

1. **Plan** (this doc) — ✅ approved.
2. **Repo scaffold + tooling + CI + agent files** — ✅ DONE (commit `41d3cb2`).
3. **Design system** (tokens, fonts, type scale, base layout) — ✅ DONE (commit `b99423c`). Botanical-green accent + Space Grotesk display, chosen via live previews.
4. **Core layouts & components** (Nav, Footer, Home shell, Work index, Case-study template). Home page polished into editorial layout — ✅ (commit `5a98113`).
5. **First case study** (Drone/MAV) via the pipeline — ✅ DONE (commit `5ead4b4`). Live at /work/autonomous-drone-mav.
6. **About / Resume / Contact** — write real content (bio, experience, education, skills).
7. **SEO/OG/sitemap/analytics/perf hardening**.
8. **Remaining projects** + optional blog.

## 18. Open decisions (track here)

- License — ✅ resolved (proprietary, All rights reserved).
- Repo name + local path — ✅ resolved (`portfolio` at /home/drijs/portfolio). GitHub remote: not yet created.
- Final accent color + type pairing — ✅ resolved (botanical green + Space Grotesk).
- Analytics provider — Vercel Web Analytics (default; cookieless).
- Owned domain (standofl.nl) — deferred; SITE_URL is configurable.
