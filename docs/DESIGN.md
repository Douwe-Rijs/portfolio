# Design system & constitution

This is the visual and interaction contract for the portfolio. It exists to keep
the site **bespoke and editorial** — and to keep every contributor (human or
agent) from sliding back toward a generic template look. When in doubt, optimise
for _clarity, restraint and craft_, not for adding more.

## 1. Principles

1. **Case studies are the product.** Layouts exist to make project stories
   compelling. Imagery is large (40–70% of the viewport on project pages),
   never reduced to a grid of tiny thumbnails.
2. **Typography before colour.** Visual interest comes first from type scale,
   hierarchy and whitespace; colour is a quiet supporting actor.
3. **Restraint.** One accent. Generous negative space. Remove before you add.
4. **Rhythm.** Alternate image-heavy / text-focused / showcase / breathing-room
   sections. No wall of identical stacked cards.
5. **Motion with purpose.** Premium, subtle, attention-guiding — and always
   degradable under `prefers-reduced-motion`.

### Anti-patterns (do not ship)

Glassmorphism · neon/cyberpunk gradients · floating generic cards · animated
particle backgrounds · spinning/bouncing icons · "Hi, I'm X + 3 buttons" heroes
· default Tailwind/Bootstrap aesthetics · endless repeated identical sections.

## 2. Colour tokens

All colour is expressed as CSS variables in `src/styles/global.css`, surfaced to
Tailwind via `@theme inline`. **Never hard-code hex values in components** — use
the semantic utilities so theming and dark mode stay free.

| Token         | Light     | Dark      | Use                                     |
| :------------ | :-------- | :-------- | :-------------------------------------- |
| `--base`      | `#faf9f6` | `#0b0c0e` | Page background (warm paper / charcoal) |
| `--surface`   | `#f1efe9` | `#14161a` | Subtle raised surfaces, code bg         |
| `--ink`       | `#14151a` | `#f4f3ef` | Primary text / headings                 |
| `--muted`     | `#5b5e66` | `#a3a7af` | Secondary text, labels                  |
| `--line`      | `#e4e1d9` | `#24272d` | Borders, hairlines                      |
| `--accent`    | `#2f54eb` | `#7d97ff` | Links, emphasis, data accents           |
| `--on-accent` | `#ffffff` | `#0b0c0e` | Text/!icons on an accent fill           |

Tailwind utilities: `bg-base`, `bg-surface`, `text-ink`, `text-muted`,
`border-line`, `text-accent`, `bg-accent`, `text-on-accent`.

> **Accent is provisional.** Cobalt is the default; alternatives under review are
> warm amber/ochre and deep botanical green / oxblood. Finalised in the
> design-system milestone with live previews. Because everything is tokenised, a
> re-skin is a few variable edits.

## 3. Typography

Self-hosted variable fonts (Fontsource) — performance + GDPR (no Google CDN).

| Role            | Family                                        | Utility / var         |
| :-------------- | :-------------------------------------------- | :-------------------- |
| Display/Heading | **Fraunces Variable** (serif, optical sizing) | `font-display`        |
| Body/UI         | **Inter Variable**                            | default (`font-sans`) |
| Technical/Mono  | **JetBrains Mono Variable**                   | `font-mono`           |

- Fluid display sizes via `clamp()`: `display-xl` (hero) and `display-lg`
  (page/section titles) utilities. Headings use tight tracking (`-0.02em`) and
  `text-wrap: balance`.
- Mono is reserved for labels, metrics, timeframes and code — it signals
  engineering rigour without shouting.

## 4. Motion

- **Page transitions:** Astro View Transitions API (native-feeling, JS-light).
- **In-page choreography:** Framer Motion in React islands for image reveals,
  staggered text, subtle hero parallax and hover microinteractions.
- **Budget:** motion is short (150–400ms), eased, and never blocks reading.
- **Reduced motion:** a global media query in `global.css` collapses animations
  to ~0ms. Any new animation must remain usable when this is active.

## 5. Layout

- 8px spacing rhythm; content max-widths: prose `max-w-2xl`, media/editorial
  `max-w-6xl`. Intentional full-bleed breakouts for hero/feature imagery.
- Mobile-first; multi-column editorial layouts collapse to a single readable
  column. Compose fluidly with `clamp()` rather than leaning on breakpoints.
- Asymmetry is encouraged where it serves the story; symmetry where it aids
  scanning (e.g. the metric row).

## 6. Accessibility (WCAG 2.2 AA)

- Semantic landmarks, a skip link, visible `:focus-visible` rings (accent),
  full keyboard operability, focus-trapped dialogs.
- **Image alt text is a required schema field** — the build fails without it.
- AA contrast verified on tokens; respect `prefers-color-scheme` plus a
  persisted manual toggle; never convey meaning by colour or motion alone.

## 7. Theming & dark mode

Dark mode is driven by `data-theme="dark"` on `<html>`, set **before paint** by
an inline script in `BaseLayout` (no flash). The toggle (`ThemeToggle.tsx`)
persists the choice and falls back to `prefers-color-scheme`. Prefer semantic
tokens over the `dark:` variant so both themes stay in sync automatically.

## 8. Performance budget

Lighthouse ≥ 95 (mobile) · LCP < 2.0s · CLS < 0.05 · INP < 200ms. Content pages
ship ~0 KB JS except islands. Images go through Astro `<Image>` (AVIF/WebP,
responsive `widths`/`sizes`, lazy below the fold, eager hero). Fonts are
self-hosted variable subsets.
