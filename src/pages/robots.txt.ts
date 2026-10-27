import type { APIRoute } from 'astro';

// Points crawlers at the sitemap from @astrojs/sitemap. Its URL has to be absolute,
// so it's built from `site`, which the deploy workflow passes in.
export const GET: APIRoute = ({ site }) => {
  const sitemap = site && new URL('sitemap-index.xml', new URL(import.meta.env.BASE_URL, site));
  return new Response(['User-agent: *', 'Allow: /', ...(sitemap ? [`Sitemap: ${sitemap}`] : [])].join('\n') + '\n');
};
