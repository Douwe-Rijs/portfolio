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

## Step 3 — Author the case study

Create `src/content/projects/<slug>.mdx`. **Frontmatter** must satisfy the Zod
schema in `src/content.config.ts`:

```mdx
---
title: 'Autonomous Drone Racing (MAV)'
summary: 'A vision-only micro air vehicle that detects and races through gates autonomously.' # ≤200 chars
role: 'Perception & Control'
timeframe: 'Sep–Dec 2024'
teamSize: 8
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
gallery:
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

Then write the **MDX body** as an editorial narrative, in this order:

**Overview → Problem → Design decisions → Technical architecture → Challenges →
Solutions → Results → Lessons learned**

Authoring rules:

- **Curate images.** Copy only the strongest images from `_staging/<slug>/images/`
  into `src/assets/projects/<slug>/`, rename them meaningfully (`hero.jpg`,
  `pipeline.jpg`), and reference them with paths **relative to the `.mdx` file**
  (`../../assets/projects/<slug>/…`). The `image()` schema helper validates and
  optimises them; broken paths fail the build.
- **Alt text is mandatory** on `heroAlt` and every gallery image — describe the
  content, not "image of…". Missing alt = failed build (a11y gate).
- **Write honestly.** Clear, concise, recruiter-appropriate. State _your_
  contribution on team projects. Never exaggerate metrics or scope.
- **Follow the design constitution** (`docs/DESIGN.md`): editorial rhythm, large
  imagery, restrained tone.
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
