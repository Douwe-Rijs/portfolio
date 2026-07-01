#!/usr/bin/env node
// @ts-check
/**
 * One-liner "ingest → let an AI write the case study" helper.
 *
 *   npm run author -- <slug>
 *   npm run author -- autonomous-drone-mav
 *
 * What it does:
 *   1. Checks you dropped source files into content/_sources/<slug>/.
 *   2. Runs the ingest step (scripts/ingest.py) to extract clean text + images
 *      into content/_staging/<slug>/.
 *   3. Summarises what was extracted.
 *   4. Prints a ready-to-paste instruction you hand to your AI assistant, which
 *      then writes src/content/projects/<slug>.mdx from that staging material.
 *
 * It does NOT call any AI itself — it just prepares everything and tells you
 * exactly what to say. That keeps the AI step in your editor/chat where you can
 * review every line.
 *
 * Flags are passed straight through to the ingest script, e.g.
 *   npm run author -- my-project --max-width 2000
 */
import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string} msg */
function fail(msg) {
  console.error(`\n\u2716 ${msg}\n`);
  process.exit(1);
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

/** @param {string} slug */
function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function main() {
  const [slug, ...passthrough] = process.argv.slice(2);

  if (!slug || slug.startsWith('--')) {
    fail(
      'Provide a project slug.\n\n' +
        '  npm run author -- <slug>\n' +
        '  npm run author -- autonomous-drone-mav\n\n' +
        'First drop your source files (PDF, slides, images, notes) into\n' +
        'content/_sources/<slug>/, then run this.',
    );
  }
  if (!isValidSlug(slug)) {
    fail(`Invalid slug "${slug}" — use lowercase kebab-case, e.g. lidar-fusion.`);
  }

  const sourceDir = join(ROOT, 'content', '_sources', slug);
  const stagingDir = join(ROOT, 'content', '_staging', slug);

  // 1. Make sure there is something to ingest.
  if (!(await exists(sourceDir))) {
    fail(
      `No sources found at content/_sources/${slug}/.\n\n` +
        'Create that folder and drop in your material (PDF report, slide deck,\n' +
        'screenshots, notes), then run this again.\n\n' +
        `No source material yet? Start an empty draft instead:\n` +
        `  npm run new:project -- ${slug}`,
    );
  }
  const sourceFiles = (await readdir(sourceDir)).filter((f) => !f.startsWith('.'));
  if (sourceFiles.length === 0) {
    fail(`content/_sources/${slug}/ is empty — add your source files first.`);
  }

  // 2. Run the ingest step (Python).
  console.log(`\n\u2699  Ingesting ${sourceFiles.length} source file(s) for "${slug}"\u2026\n`);
  const py = spawnSync('python3', [join('scripts', 'ingest.py'), slug, ...passthrough], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (py.status !== 0) {
    fail(
      'Ingest failed. If it is a missing-dependency error, install the tools:\n' +
        '  pip install -r scripts/requirements.txt',
    );
  }

  // 3. Summarise what came out of staging.
  let imageCount = 0;
  let textBlocks = 0;
  const manifestPath = join(stagingDir, 'manifest.json');
  if (await exists(manifestPath)) {
    try {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      imageCount = manifest?.counts?.images ?? 0;
      textBlocks = manifest?.counts?.text_blocks ?? 0;
    } catch {
      /* summary is best-effort */
    }
  }

  // 4. Build the AI hand-off prompt, save it to a file, and print it.
  const rel = `content/_staging/${slug}`;
  const line = '\u2500'.repeat(64);

  const prompt = `Write the case study for "${slug}".

Read content/_staging/${slug}/text.md and content/_staging/${slug}/manifest.json,
then author src/content/projects/${slug}.mdx following docs/CONTENT_PIPELINE.md
and the design rules in AGENTS.md. Specifically:

- Fill the frontmatter (required: title, summary, role, timeframe, heroImage,
  heroAlt, publishedDate) and pick a preset that fits the work.
- Copy the strongest images from content/_staging/${slug}/images/ into
  src/assets/projects/${slug}/, rename them meaningfully, and weave them through
  the prose with the editorial kit (Figure, Split, Gallery, Metrics, ...).
- Write real alt text for every image (the build fails without it).
- Structure the body: Overview, Problem, Design decisions, Technical
  architecture, Challenges, Solutions, Results, Lessons learned.
- Keep it honest and recruiter-appropriate. Leave status: draft.

Then run npm run check to validate.
`;

  // Persist the prompt next to the staging material so you can reopen or reuse
  // it later instead of scrolling back through the terminal.
  const promptPath = join(stagingDir, 'PROMPT.md');
  await writeFile(
    promptPath,
    `# AI authoring prompt — ${slug}\n\n` +
      `Generated by \`npm run author -- ${slug}\`. ` +
      `Paste the block below into your AI assistant (e.g. Copilot Chat).\n\n` +
      '```text\n' +
      prompt +
      '```\n',
    'utf8',
  );

  console.log(`\n${line}`);
  console.log('  READY FOR THE AI  \u2014  copy the prompt below into Copilot Chat');
  console.log(line);
  console.log(
    `\nStaging is ready in ${rel}/ ` + `(${textBlocks} text block(s), ${imageCount} image(s)).`,
  );
  console.log(`Prompt saved to ${rel}/PROMPT.md\n`);

  console.log('\u250c\u2500 Paste this to your AI assistant ' + '\u2500'.repeat(30));
  console.log('\n' + prompt);
  console.log('\u2514' + '\u2500'.repeat(62));

  console.log('\nAfterwards, you review:');
  console.log('  \u2022 Is every fact/metric true and your own contribution clear?');
  console.log('  \u2022 Do the chosen images look good and have accurate alt text?');
  console.log('  \u2022 Preview it:  npm run dev   \u2192  /work/' + slug);
  console.log('  \u2022 Go live: set status: published, then  npm run build\n');
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
