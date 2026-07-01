import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@/consts';

/**
 * RSS feed over published (non-draft) blog posts. Valid even while empty, so
 * autodiscovery works the moment the first post ships — no wiring changes.
 */
export async function GET(context) {
  const posts = (await getCollection('posts', (p) => !p.data.draft)).sort(
    (a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
  );

  return rss({
    title: `${SITE.name} — Writing`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en</language>`,
  });
}
