// Products come from Shopify when the site is built. Nothing about a product is typed into this
// repo: title, price, sizes, stock, photos and description all come from the Shopify admin.
//
// Two ways in, tried in this order:
// 1. The Storefront API, when SHOPIFY_STOREFRONT_TOKEN is set (in Netlify's environment
//    variables, never in this repo). It comes from the Buy Button sales channel.
// 2. The store's public product data (its sitemap and /products/<handle>.js), which every
//    Shopify store serves. It needs no token.
// If both fail (Shopify down, no network), the build uses the last snapshot saved in
// src/data/products.snapshot.json and says so in the build log, so a deploy never breaks.

import snapshot from '../data/products.snapshot.json';
import { bySize, normalizeSize } from './sizes';

/** The store's own Shopify address: it keeps working after the domain moves to this site. */
export const STORE_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_DOMAIN ?? 'lifesoddity.myshopify.com';
const TOKEN = import.meta.env.SHOPIFY_STOREFRONT_TOKEN as string | undefined;
// Storefront API version: Shopify supports each for a year; bump it when the build log warns.
const API_VERSION = '2026-07';

export interface Variant {
  /** Numeric variant id, as Shopify's cart links use it. */
  id: number;
  size: string;
  available: boolean;
  price: number;
}

export interface ProductImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Product {
  id: number;
  handle: string;
  title: string;
  /** Plain text of the description, or null when Shopify has none. */
  description: string | null;
  type: string;
  tags: string[];
  available: boolean;
  /** Lowest variant price, in cents. */
  price: number;
  /** Compare-at price in cents, only when Shopify has one above the price (a real sale). */
  compareAt: number | null;
  currency: string;
  images: ProductImage[];
  variants: Variant[];
  createdAt: string;
}

/* ---------- public product JSON (/products/<handle>.js) ---------- */

interface RawPublicProduct {
  id: number;
  title: string;
  handle: string;
  description?: string;
  type?: string;
  tags?: string[] | string;
  available: boolean;
  price: number;
  compare_at_price?: number | null;
  created_at?: string;
  published_at?: string;
  variants: { id: number; title: string; option1?: string | null; available: boolean; price: number }[];
  media?: { media_type?: string; src?: string; width?: number; height?: number; alt?: string | null }[];
  images?: string[];
}

const absolute = (src: string) => (src.startsWith('//') ? `https:${src}` : src);

/** Description HTML to plain text: paragraphs kept as line breaks, entities decoded. */
export function htmlToText(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text || null;
}

export function fromPublic(raw: RawPublicProduct): Product {
  const tags = Array.isArray(raw.tags) ? raw.tags : (raw.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);
  const images: ProductImage[] = (raw.media ?? [])
    .filter((m) => (m.media_type ?? 'image') === 'image' && m.src)
    .map((m) => ({ src: absolute(m.src!), width: m.width ?? 2000, height: m.height ?? 2000, alt: m.alt ?? '' }));
  if (!images.length) {
    for (const src of raw.images ?? []) images.push({ src: absolute(src), width: 2000, height: 2000, alt: '' });
  }
  const variants = bySize(
    raw.variants.map((v) => ({ id: v.id, size: normalizeSize(v.option1 ?? v.title), available: v.available, price: v.price })),
    (v) => v.size,
  );
  const compare = raw.compare_at_price ?? null;
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: htmlToText(raw.description),
    type: raw.type ?? '',
    tags,
    available: raw.available,
    price: raw.price,
    compareAt: compare && compare > raw.price ? compare : null,
    currency: 'USD',
    images,
    variants,
    createdAt: raw.created_at ?? raw.published_at ?? '',
  };
}

async function get(url: string): Promise<Response> {
  const res = await fetch(url, { headers: { Accept: 'application/json, text/xml, */*' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

/** The handles of every published product, from the store's sitemap. */
async function publicHandles(): Promise<string[]> {
  const index = await (await get(`https://${STORE_DOMAIN}/sitemap.xml`)).text();
  const productMaps = [...index.matchAll(/<loc>([^<]*sitemap_products[^<]*)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const handles = new Set<string>();
  for (const map of productMaps) {
    const xml = await (await get(map)).text();
    for (const m of xml.matchAll(/<loc>[^<]*\/products\/([^<?#/]+)<\/loc>/g)) handles.add(decodeURIComponent(m[1]));
  }
  return [...handles];
}

export async function fetchPublicRaw(): Promise<RawPublicProduct[]> {
  const handles = await publicHandles();
  return Promise.all(handles.map(async (h) => (await get(`https://${STORE_DOMAIN}/products/${h}.js`)).json() as Promise<RawPublicProduct>));
}

/* ---------- Storefront API ---------- */

const QUERY = /* GraphQL */ `
  query Products {
    products(first: 100, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id handle title descriptionHtml productType tags availableForSale createdAt
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { maxVariantPrice { amount } }
        images(first: 12) { nodes { url altText width height } }
        variants(first: 60) { nodes { id availableForSale price { amount } selectedOptions { name value } } }
      }
    }
  }`;

const cents = (amount: string) => Math.round(parseFloat(amount) * 100);
const numericId = (gid: string) => Number(gid.split('/').pop());

async function fetchStorefront(token: string): Promise<Product[]> {
  const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query: QUERY }),
  });
  if (!res.ok) throw new Error(`Storefront API ${res.status} ${res.statusText}`);
  const body = await res.json();
  if (body.errors) throw new Error(`Storefront API: ${JSON.stringify(body.errors).slice(0, 300)}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return body.data.products.nodes.map((n: any): Product => {
    const price = cents(n.priceRange.minVariantPrice.amount);
    const compare = cents(n.compareAtPriceRange.maxVariantPrice.amount);
    return {
      id: numericId(n.id),
      handle: n.handle,
      title: n.title,
      description: htmlToText(n.descriptionHtml),
      type: n.productType ?? '',
      tags: n.tags ?? [],
      available: n.availableForSale,
      price,
      compareAt: compare > price ? compare : null,
      currency: n.priceRange.minVariantPrice.currencyCode,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      images: n.images.nodes.map((i: any) => ({ src: i.url, width: i.width, height: i.height, alt: i.altText ?? '' })),
      variants: bySize(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        n.variants.nodes.map((v: any) => ({
          id: numericId(v.id),
          size: normalizeSize(v.selectedOptions.find((o: { name: string }) => /size/i.test(o.name))?.value ?? v.selectedOptions[0]?.value ?? ''),
          available: v.availableForSale,
          price: cents(v.price.amount),
        })),
        (v: Variant) => v.size,
      ),
      createdAt: n.createdAt,
    };
  });
}

/* ---------- the one function the site calls ---------- */

let cache: Promise<Product[]> | null = null;

/** Every published product, newest first. Fetched once per build. */
export function getProducts(): Promise<Product[]> {
  cache ??= (async () => {
    try {
      if (TOKEN) return await fetchStorefront(TOKEN);
      const raw = await fetchPublicRaw();
      return raw.map(fromPublic);
    } catch (err) {
      console.warn(`[shopify] Could not read products from Shopify (${(err as Error).message}). Using the saved snapshot from src/data/products.snapshot.json.`);
      return (snapshot as unknown as RawPublicProduct[]).map(fromPublic);
    }
  })().then((list) => [...list].sort((a, b) => (b.createdAt > a.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0)));
  return cache;
}

/** Shopify's image CDN resizes on request: one URL per width, for srcset. */
export function shopifyImage(src: string, width: number): string {
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  return url.toString();
}

export function shopifySrcset(src: string, widths: number[] = [400, 640, 900, 1200, 1600]): string {
  return widths.map((w) => `${shopifyImage(src, w)} ${w}w`).join(', ');
}
