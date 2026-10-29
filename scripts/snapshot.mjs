// Saves the store's current public product data to src/data/products.snapshot.json.
// The build falls back to this file when Shopify cannot be reached. Run: npm run snapshot
import { writeFileSync } from 'node:fs';

const DOMAIN = process.env.PUBLIC_SHOPIFY_DOMAIN ?? 'lifesoddity.myshopify.com';
const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res;
};
const index = await (await get(`https://${DOMAIN}/sitemap.xml`)).text();
const maps = [...index.matchAll(/<loc>([^<]*sitemap_products[^<]*)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const handles = new Set();
for (const map of maps) {
  const xml = await (await get(map)).text();
  for (const m of xml.matchAll(/<loc>[^<]*\/products\/([^<?#/]+)<\/loc>/g)) handles.add(decodeURIComponent(m[1]));
}
const products = await Promise.all([...handles].map(async (h) => (await get(`https://${DOMAIN}/products/${h}.js`)).json()));
writeFileSync(new URL('../src/data/products.snapshot.json', import.meta.url), JSON.stringify(products, null, 1) + '\n');
console.log(`Saved ${products.length} product(s): ${products.map((p) => p.handle).join(', ')}`);
