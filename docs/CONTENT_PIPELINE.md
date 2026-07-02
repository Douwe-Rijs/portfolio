# Content pipeline — source → case study

This is the repeatable workflow that turns raw project material (a PDF report, a
slide deck, screenshots, notes) into a polished, schema-validated case study.
It is designed so **any agent on any machine** can pick up the work.

```
content/_sources/<slug>/        raw drop zone        (gitignored, private)
        │  npm run ingest -- <slug>
        ▼
content/_staging/<slug>/        text.md + images/ + manifest.json   (gitignored)
        │  author by hand / with an agent
        ▼
src/assets/projects/<slug>/     curated, committed, optimised images
src/content/projects/<slug>.mdx final case study (frontmatter + MDX body)
        │  npm run build  (Zod schema validates; missing alt text fails)
        ▼
/work/<slug>                    the published page
```

## Step 1 — Drop sources

Create `content/_sources/<slug>/` and drop in any mix of:

| Format                       | Extracted                                    |
| :--------------------------- | :------------------------------------------- |
| `.pdf`                       | text per page + deduped embedded images      |
| `.pptx` (`.ppt`)             | text per slide + embedded pictures           |
| `.png .jpg .jpeg .webp .gif` | optimised copy (EXIF stripped, width-capped) |
| `.txt .md`                   | text, normalised                             |
| `.docx` _(optional)_         | text + images                                |

Choose a **kebab-case slug** that will be the URL, e.g. `autonomous-drone-mav`.

## Step 2 — Ingest

```sh
npm run ingest -- <slug>
# or directly, with overrides:
python3 scripts/ingest.py <slug> --max-width 2000
```

This writes `content/_staging/<slug>/`:

- **`text.md`** — all extracted text, with `### <source> — page/slide N` markers.
- **`images/`** — deduped (by content hash), EXIF-stripped, width-capped
  (default 2400px) images named `<source>-p<page>-<n>.jpg|png`.
- **`manifest.json`** — every image with `source`, `location` (page/slide),
  `width`, `height`, `bytes`, `sha256`. Use this to choose and place imagery.

Dependencies live in `scripts/requirements.txt` (each only needed for the
formats you use). Install once: `pip install -r scripts/requirements.txt`.

### Shortcut: ingest + AI hand-off in one command

`npm run author -- <slug>` runs the ingest above, then prints a ready-to-paste
prompt that tells an AI assistant to author the `.mdx` from the staging output.
Use it when you have real sources and want the agent to write the story:

```sh
npm run author -- <slug>
# extra flags pass through to ingest, e.g. --max-width 2000
```

It never calls an AI itself — it prepares staging and hands you the exact
instruction, so the authoring step stays in your editor/chat for review.

## Step 3 — Author the case study

**Scaffold fast (optional but recommended for batches).** To stub out one or many
case studies at once — before you have any content — run:

```bash
npm run new:project -- <slug> [<slug> ...] [--preset <vibe>] [--title "…"]
# e.g. npm run new:project -- lidar-fusion rrt-planner --preset technical
```

Each slug gets a schema-valid `status: draft` MDX wired to a shared placeholder
hero (so `check`/`build` stay green with zero real assets) plus an empty
`src/assets/projects/<slug>/` folder. Drafts never appear on the site, sitemap or
RSS until you set `status: published`. Then fill in the frontmatter and body below.

Create `src/content/projects/<slug>.mdx`. **Frontmatter** must satisfy the Zod
schema in `src/content.config.ts`:

```mdx
---
title: 'Autonomous Drone Racing (MAV)'
summary: 'A vision-only micro air vehicle that detects and races through gates autonomously.' # ≤200 chars
role: 'Perception & Control'
timeframe: 'Sep–Dec 2024'
teamSize: 8
preset: 'editorial' # the project's "vibe" — see below
contributions:
  - 'Built the gate-detection vision pipeline'
  - 'Tuned the state estimation + control loop'
tech: ['Python', 'OpenCV', 'Computer Vision', 'Control']
categories: ['Robotics', 'Perception']
featured: true
order: 1
heroImage: '../../assets/projects/autonomous-drone-mav/hero.jpg' # resolved & optimised at build
heroAlt: 'Parrot Bebop drone hovering before a racing gate in the MAVLab arena' # REQUIRED
links:
  repo: 'https://github.com/Douwe-Rijs/...'
  paper: 'https://...'
results:
  - { label: 'Gate detection', value: '94% recall' }
  - { label: 'Lap time', value: '12.4 s' }
gallery: # optional; used by the `gallery` preset and as a fallback image strip
  - {
      src: '../../assets/projects/autonomous-drone-mav/pipeline.jpg',
      alt: 'Six-stage vision pipeline from raw frame to gate pose',
      caption: 'Vision pipeline',
    }
status: 'published'
publishedDate: 2024-12-15
---

## Overview

...
```

### Choose a "vibe" (`preset`)

Every project renders with its **own vibe** so no two case studies feel like the
same template. Pick the `preset` that fits the work; layer optional `theme{}`
overrides on top.

| `preset`    | Feel                          | Hero       | Type    | Motion         |
| :---------- | :---------------------------- | :--------- | :------ | :------------- |
| `editorial` | refined default, interleaved  | boxed      | grotesk | none           |
| `showcase`  | big imagery, bold type, dark  | full-bleed | grotesk | none           |
| `paper`     | academic, quiet, serif column | split      | serif   | none           |
| `gallery`   | image-first, click-to-zoom    | full-bleed | grotesk | lazy lightbox  |
| `motion`    | scroll reveals / parallax     | boxed      | grotesk | lazy IO island |
| `technical` | engineering log, dark, dense  | boxed      | mono    | none           |
| `minimal`   | whitespace, oversized type    | boxed      | grotesk | none           |
| `feature`   | magazine feature, warm serif  | split      | serif   | scroll reveals |
| `brutalist` | raw, bold, dark, filmstrip    | full-bleed | mono    | lazy lightbox  |

Optional fine-grain overrides (all optional, layered over the preset):

```yaml
theme:
  accent: '#b45309' # light-mode accent (also shows on the index card)
  accentDark: '#fbbf24' # dark-mode accent
  surface: '#f5f1ea'
  font: 'serif' # grotesk | serif | mono
  radius: 'sharp' # sharp | soft | round
  density: 'tight' # airy | normal | tight  (reading width + rhythm)
heroLayout: 'split' # full-bleed | split | boxed
forceTheme: 'dark' # pin the article frame to light/dark
```

### Compose the body with the editorial kit

Write the **MDX body** as an editorial narrative, in this order:

**Overview → Problem → Design decisions → Technical architecture → Challenges →
Solutions → Results → Lessons learned**

To stay **image-centric** (not "rendered Markdown"), weave imagery through the
prose with the kit in `src/components/case/` — these are available in every MDX
body **without importing the component** (just `import` the image asset):

```mdx
import pipeline from '../../assets/projects/<slug>/pipeline.jpg';

<Figure src={pipeline} alt="…" figNumber="1" caption="…" /> {/* responsive image + caption */}
<FullBleed src={pipeline} alt="…" caption="…" /> {/* edge-to-edge breakout */}
<Split src={pipeline} alt="…" reverse>
  Markdown text beside the image…
</Split>
<Gallery images={[{ src: pipeline, alt: '…' }]} variant="masonry" lightbox />
<Metrics items={[{ label: 'FPS', value: '11' }]} variant="bold" />
<PullQuote cite="…">A line worth enlarging.</PullQuote>
<SectionLabel>Method</SectionLabel>

{/* Interactive islands (lazy, reduced-motion safe) */}

<ScrollParallax src={hero} alt="…" /> {/* scroll-linked parallax image */}
<Compare one={raw} two={overlay} altOne="…" altTwo="…" labelOne="Input" labelTwo="Detected" />
<Pano360 src={pano} alt="…" caption="…" /> {/* drag-to-pan 360° equirectangular viewer */}
```

The interactive pieces (`ScrollParallax`, `Compare`, `Pano360`, and the
count-up animation in `Metrics variant="bold"`) hydrate **only on the pages
that use them** and all honour `prefers-reduced-motion`, so quiet presets stay
~0 KB JS.

Authoring rules:

- **Metrics must be meaningful outcomes, not attributes.** A `results` chip
  earns its place only if a recruiter can interpret it without reading the
  report: a change (`~1% → ~80%`), a comparison (`−50% RMS error`), or a
  concrete achievement (`clinically tested`). Never inputs, tool counts, team
  size, parameter values or abstract counts ("climate signals per bed: 5",
  "waypoints per edge: 100") — if a number needs the report to make sense, it
  is not a result.
- **Every number needs context.** Pair each figure with its baseline,
  comparison or consequence in the surrounding sentence. A bare number is a
  red flag.
- **Lead with the finding that matters, not the material that was easiest to
  extract.** Select figures by narrative importance: the graph that proves the
  headline result belongs on the page. If the decisive figure wasn't extracted
  (e.g. a native PPT chart), go back to the source and recover it rather than
  substituting a weaker one.
- **Weight the narrative by what made the project significant, not by report
  chapter length.** A clinical device's story is ergonomics, user feedback and
  the regulatory pathway more than its mechanical calculations; an R&D
  pipeline's story is the accuracy jump and its diagnosis more than the tool
  benchmark. Ask "what would the reader remember?" and give that the space.
- **Curate images.** Copy only the strongest images from `_staging/<slug>/images/`
  into `src/assets/projects/<slug>/`, rename them meaningfully (`hero.jpg`,
  `pipeline.jpg`), and reference them with paths **relative to the `.mdx` file**
  (`../../assets/projects/<slug>/…`). The `image()` schema helper validates and
  optimises them; broken paths fail the build.
- **Alt text is mandatory** on `heroAlt` and every kit/gallery image — describe
  the content, not "image of…". Missing alt = failed build (a11y gate).
- **Write honestly.** Clear, concise, recruiter-appropriate. State _your_
  contribution on team projects. Never exaggerate metrics or scope.
- **Follow the design constitution** (`docs/DESIGN.md`): editorial rhythm, large
  imagery, restrained tone. Any custom `theme.accent` must pass AA contrast in
  both light and dark.
- Keep `summary` ≤ 200 characters (used in the index and meta description).
- Use `status: draft` while iterating; only `published` projects are routed and
  listed.

## Step 4 — Validate & preview

```sh
npm run check   # type-check + content schema validation
npm run dev     # preview at /work/<slug>
npm run build   # full build; schema errors (e.g. missing alt) fail here
```

## Worked example

The **Autonomous Drone (MAV)** project is the reference. Its source
(`Report_MAV(2).pdf`) is already staged under
`content/_staging/autonomous-drone-mav/` (12 images incl. the Bebop hero,
4-panel perception, 6-stage vision pipeline, and GATELOCK tracking sequence),
ready to become the first published case study.

## Why this design

- **Separation of concerns:** raw/staging stay private and gitignored; only
  curated, optimised assets and the final MDX are committed.
- **Schema as a quality gate:** required fields + required alt text mean a
  half-finished or inaccessible case study cannot ship.
- **Agent-friendly:** `text.md` + `manifest.json` are exactly what an authoring
  agent needs to write an accurate, well-illustrated page without the original
  binaries.
