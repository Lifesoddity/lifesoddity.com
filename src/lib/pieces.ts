// Every piece the site shows, live or archive, in one shape. One status function feeds every
// page, so the cover, the story, the shop and the product page never disagree.

import type { ImageMetadata } from 'astro';
import { getProducts, type Product, type ProductImage } from './shopify';
import { layoutWord, type WordLayout } from './words';
import { acts, liveAct, type Act } from '../content/acts';
import { archivePieces, defaultGrounds, garmentWords, productArt, type PieceArt } from '../content/pieces';

export type Status = 'live' | 'soldout' | 'archive';

export interface Piece {
  key: string;
  title: string;
  status: Status;
  act: Act;
  /** The Shopify product, for live and sold-out pieces. */
  product: Product | null;
  /** Product page, for Shopify pieces only. */
  href: string | null;
  /** The main photo: a Shopify image or one of his campaign photos. */
  photo: { kind: 'shopify'; image: ProductImage } | { kind: 'local'; image: ImageMetadata; alt: string } | null;
  photos: ({ kind: 'shopify'; image: ProductImage } | { kind: 'local'; image: ImageMetadata; alt: string })[];
  description: string | null;
  word: WordLayout;
  art: Required<Pick<PieceArt, 'ground' | 'ink' | 'dot' | 'tag'>> & PieceArt;
}

/** The one status function. */
export function statusOf(product: Product | null): Status {
  if (!product) return 'archive';
  return product.available ? 'live' : 'soldout';
}

export const statusLabel: Record<Status, string> = {
  live: 'Out now',
  soldout: 'Sold out',
  archive: 'Archive',
};

function wordFromTitle(title: string): string {
  const words = title.split(/\s+/);
  const last = words[words.length - 1]?.toLowerCase();
  return words.length > 1 && garmentWords.includes(last) ? words.slice(0, -1).join(' ') : title;
}

function actFor(product: Product, art: PieceArt | undefined): Act {
  const tagged = product.tags.find((t) => t.toLowerCase().startsWith('act:'))?.slice(4).trim().toLowerCase();
  return acts.find((a) => a.slug === (art?.act ?? tagged)) ?? liveAct();
}

let cache: Promise<Piece[]> | null = null;

/** Live and sold-out products first (newest first), then the archive, act by act. */
export function getPieces(): Promise<Piece[]> {
  cache ??= getProducts().then((products) => {
    let rotation = 0;
    const live: Piece[] = products.map((product) => {
      const art = productArt[product.handle];
      const fallback = defaultGrounds[rotation++ % defaultGrounds.length];
      const photos = product.images.map((image) => ({ kind: 'shopify' as const, image }));
      return {
        key: product.handle,
        title: product.title,
        status: statusOf(product),
        act: actFor(product, art),
        product,
        href: `/products/${product.handle}`,
        photo: photos[0] ?? null,
        photos,
        description: product.description,
        word: layoutWord(art?.word ?? wordFromTitle(product.title)),
        art: { ...fallback, tag: product.title, ...art } as Piece['art'],
      };
    });
    const archive: Piece[] = archivePieces.map((p) => {
      const photos = p.photos.map((ph) => ({ kind: 'local' as const, image: ph.image, alt: ph.alt }));
      return {
        key: p.key,
        title: p.title,
        status: 'archive',
        act: acts.find((a) => a.slug === p.act) ?? acts[acts.length - 1],
        product: null,
        href: null,
        photo: photos[0] ?? null,
        photos,
        description: p.description,
        word: layoutWord(p.word ?? wordFromTitle(p.title)),
        art: { ground: '#FFE500', ink: 'ink', dot: 'rgb(11 11 11 / .1)', tag: p.title, ...p } as Piece['art'],
      };
    });
    const order: Record<Status, number> = { live: 0, soldout: 1, archive: 2 };
    return [...live, ...archive].sort((a, b) => order[a.status] - order[b.status]);
  });
  return cache;
}

/** The piece the cover sells: the newest live product, else the newest product. */
export async function getCoverPiece(): Promise<Piece | null> {
  const pieces = await getPieces();
  return pieces.find((p) => p.status === 'live') ?? pieces.find((p) => p.product) ?? null;
}
