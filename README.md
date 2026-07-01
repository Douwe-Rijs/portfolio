# Douwe Rijs — Portfolio

A personal portfolio website that shows off robotics & machine-learning
projects as rich, magazine-style **case studies**. Built to be fast, good-looking,
and easy to add to over time.

Made with [Astro](https://astro.build), TypeScript and Tailwind CSS.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) (version 22 or newer). Then:

```sh
npm install      # do this once
npm run dev      # start the site
```

Open **http://localhost:4321** in your browser. The page updates automatically
as you edit files.

To stop it, press `Ctrl + C` in the terminal.

---

## Add a new project

The fastest way — this creates a ready-to-fill project for you:

```sh
npm run new:project -- my-project-name
```

That gives you a new file at `src/content/projects/my-project-name.mdx` and an
empty image folder at `src/assets/projects/my-project-name/`.

You can even create several at once:

```sh
npm run new:project -- gate-detection lidar-fusion path-planner
```

Then, for each project:

1. **Open the new `.mdx` file** and fill in the details at the top (title,
   summary, your role, etc.) and write the story below it.
2. **Drop your images** into that project's folder in `src/assets/projects/…`
   and point the `heroImage` to one of them.
3. When it's ready to go live, change `status: 'draft'` to `status: 'published'`.

That's it — the new project shows up on the site automatically. Until you set it
to `published`, it stays hidden (so half-finished projects are never public).

> Tip: not sure what to write? Each new file comes with headings and hints
> already filled in to guide you.

---

## Let an AI write it from your documents

If you have the real source material for a project — a PDF report, a slide deck,
screenshots, notes — an AI assistant can turn it into a case study for you.

1. Put your files in a folder: `content/_sources/my-project-name/`
2. Run one command:

   ```sh
   npm run author -- my-project-name
   ```

   This reads your files, pulls out the text and images, and then prints a
   ready-made instruction.

3. **Copy that instruction into your AI chat (e.g. Copilot).** The AI writes the
   full story, picks the images, and creates the project file for you.

4. Read it over, check the facts are right, preview it, and publish.

The AI only rewrites _your_ material into a polished story — it doesn't invent
your projects. You always get the final say before anything goes live.

> Images stay real: the pictures come from your own documents, not AI-generated
> art — that keeps your portfolio honest and credible.

---

## Pick a look ("preset")

Every project can have its own style so they don't all look the same. Just set
`preset:` at the top of the project file. Choose from:

| Preset      | Vibe                                     |
| :---------- | :--------------------------------------- |
| `editorial` | clean and balanced (the default)         |
| `showcase`  | big bold images, dark background         |
| `paper`     | quiet, academic, serif — like a report   |
| `gallery`   | image-first, click images to zoom        |
| `motion`    | gentle animations as you scroll          |
| `technical` | dark "engineer's logbook", monospace     |
| `minimal`   | lots of white space, huge text           |
| `feature`   | warm magazine feature with serif type    |
| `brutalist` | raw, bold, dark, with an image filmstrip |

Want to preview them all with real content? Run `npm run dev` and visit
`/preview/editorial`, `/preview/technical`, and so on.

---

## Write a blog post (optional)

The blog is built and ready but hidden until you write your first post. Add a
file to `src/content/posts/` (for example `hello-world.md`), fill in the title
and date, and set `draft: false`. It then appears at `/blog` with an RSS feed at
`/rss.xml`.

---

## Publish it online

The site is made to run on [Vercel](https://vercel.com) for free. Connect the
repository, and every time you push changes it redeploys automatically. Set a
`SITE_URL` value in the Vercel settings to use your own domain — no code changes
needed.

To build the final site yourself:

```sh
npm run build       # creates the finished site in ./dist
npm run preview     # look at the finished site locally
```

---

## Handy commands

| Command                    | What it does                                    |
| :------------------------- | :---------------------------------------------- |
| `npm run dev`              | Start the site while you work                   |
| `npm run new:project -- x` | Create a new project called `x`                 |
| `npm run author -- x`      | Turn source files into an AI-written case study |
| `npm run build`            | Build the finished site                         |
| `npm run preview`          | Preview the finished site                       |
| `npm run check`            | Check everything is valid                       |
| `npm run format`           | Tidy up the code formatting                     |

---

## Where things live

```text
src/
├── content/projects/   ← your case studies (the main content)
├── content/posts/      ← blog posts (optional)
├── assets/projects/    ← images for each project
├── pages/              ← the site's pages (home, work, about, resume…)
├── styles/global.css   ← colours, fonts and styling
└── consts.ts           ← your name, links and site info
```

Want the deeper details? See [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md)
(adding content), [`docs/DESIGN.md`](docs/DESIGN.md) (design rules) and
[`AGENTS.md`](AGENTS.md) (notes for AI assistants).

---

## License

All rights reserved. See [`LICENSE`](LICENSE). Published for viewing only.
