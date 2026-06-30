# Contributing / working on this repo

This is a personal, proprietary project (see [`LICENSE`](LICENSE)) — it is not
open for outside contributions. This guide is the working reference for the
owner and any AI agents collaborating on the codebase.

## Prerequisites

- **Node** ≥ 22.12 (see `engines` in `package.json`)
- **npm** (lockfile committed; use `npm ci` for clean installs)
- **Python** ≥ 3.10 (only for the content pipeline, `scripts/ingest.py`)

## Setup

```sh
npm install
npm run dev          # http://localhost:4321
```

For the content pipeline:

```sh
python -m venv .venv && source .venv/bin/activate
pip install -r scripts/requirements.txt
```

## Day-to-day commands

| Command            | What it does                                   |
| :----------------- | :--------------------------------------------- |
| `npm run dev`      | Dev server with HMR                            |
| `npm run check`    | `astro check` — TS + content schema validation |
| `npm run lint`     | ESLint + Prettier check (CI-equivalent)        |
| `npm run lint:fix` | Auto-fix lint issues                           |
| `npm run format`   | Prettier write                                 |
| `npm run build`    | Production build to `dist/`                    |

## Conventions

Read [`AGENTS.md`](AGENTS.md) and [`docs/DESIGN.md`](docs/DESIGN.md) first — they
are the source of truth for architecture and the design constitution.

- Use the `@/` import alias for `src/`.
- Style with semantic tokens (`bg-base`, `text-ink`, `text-accent`, …), never
  hard-coded hex.
- Keep JS minimal: prefer static Astro components; reach for a React island only
  when interactivity demands it, with the smallest `client:*` directive.
- Every image goes through Astro `<Image>` and **must** have meaningful alt text.
- Add a project via the [content pipeline](docs/CONTENT_PIPELINE.md), not by
  hand-placing files ad hoc.

## Commit & branch workflow

- Branch names: `username/short-description` (e.g. `douwe-rijs/work-index`).
- Husky + lint-staged run ESLint + Prettier on staged files at commit time. Do
  not bypass with `--no-verify` unless unblocking an emergency.
- Keep commits focused and message subjects imperative ("Add work index page").
- CI (`.github/workflows/ci.yml`) runs lint, type/content check and build on push
  and PR; keep it green.

## Milestone workflow

Work proceeds in milestones (see the project plan). For each: explain what will
be built, implement it, explain the structure, then pause for approval before
moving on. Don't batch unrelated milestones into one change.
