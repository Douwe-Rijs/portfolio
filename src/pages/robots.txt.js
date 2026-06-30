/**
 * Dynamic robots.txt so the sitemap URL always follows the configured site
 * (SITE_URL). Written in plain JS + JSDoc because the `.txt.ts` double
 * extension skips the TS transform during build.
 *
 * @type {import('astro').APIRoute}
 */
export const GET = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
