// The site's pages for search engines, built with the site: the sections and one page per
// Shopify product, so a product added in Shopify is listed on the next build. /joined and the
// 404 page stay out (noindex).

import type { APIRoute } from 'astro';
import { site } from '../content/site';
import { getPieces } from '../lib/pieces';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const pieces = await getPieces();
  const paths = ['/', '/shop/', '/drop/', '/lookbook/', '/about/', ...pieces.filter((p) => p.product).map((p) => `/products/${p.product!.handle}/`)];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${escape(`${site.url}${path}`)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
