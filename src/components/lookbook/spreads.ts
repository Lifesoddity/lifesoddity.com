// The lookbook's data: one spread per act, built from the content files and Shopify, so a new
// act or a new product photo lands on the contact sheet by itself.
//
// Per act, the photos run in this order, each photo once:
// 1. the act's products in Shopify (their Shopify photos),
// 2. the act's campaign photos (acts.ts), with the photographer credit his captions give,
// 3. the archive pieces' own photos (pieces.ts).
// Credits come only from acts.ts: a photo with no named photographer carries none.

import { getImage } from 'astro:assets';
import { acts, type Act } from '../../content/acts';
import { campaign } from '../../assets';
import { getPieces, type Piece, type Status } from '../../lib/pieces';
import { shopifyImage, shopifySrcset } from '../../lib/shopify';
import { layoutWord, type WordLayout } from '../../lib/words';
import { lookbook as copy } from '../../content/copy/lookbook';

export type Photo = NonNullable<Piece['photo']>;

/** A pink marker circle: centre and radii as fractions of the photo's width and height. */
export interface Mark { x: number; y: number; rx: number; ry: number }

/** Where a print sits on the 12-column sheet (phone and from 700px) and how it lies. */
export interface Place { pc: number | 'auto'; ps: number; dc: number | 'auto'; ds: number; tilt: number; y: number }

export interface Shot {
  key: string;
  photo: Photo;
  alt: string;
  w: number;
  h: number;
  credit: string | null;
  caption: string | null;
  piece: Piece | null;
  mark: Mark | null;
  full: { src: string; srcset: string };
  place: Place;
}

export interface Ground {
  /** The field's CSS background. */
  bg: string;
  dark: boolean;
  /** The giant word's colour. */
  word: string;
  /** The quote mark and other accents. */
  accent: string;
  dot: string;
}

export interface Spread {
  act: Act;
  word: WordLayout;
  status: Status | null;
  pieces: Piece[];
  shots: Shot[];
  ground: Ground;
  quote: string | null;
}

/* ---------- each act's field, from its own material ---------- */

const grounds: Record<string, Ground> = {
  // the She Devil tee's own pink-to-red (the cover's gradient)
  'she-devil': { bg: 'var(--cover)', dark: false, word: 'var(--white)', accent: 'var(--white)', dot: 'rgb(81 42 52 / .34)' },
  // Act 1 was a party at night: the black of the Party Animal radio cover, flash-lit
  'party-animal': { bg: 'var(--ink)', dark: true, word: 'var(--yellow)', accent: 'var(--pink)', dot: 'rgb(255 46 110 / .22)' },
};
/** Fields for acts added later, in turn. */
const rotation: Ground[] = [
  { bg: 'var(--white)', dark: false, word: 'var(--ink)', accent: 'var(--pink)', dot: 'rgb(255 46 110 / .35)' },
  { bg: 'var(--red)', dark: true, word: 'var(--white)', accent: 'var(--yellow)', dot: 'rgb(0 0 0 / .22)' },
  { bg: 'var(--ink)', dark: true, word: 'var(--pink)', accent: 'var(--yellow)', dot: 'rgb(255 46 110 / .22)' },
];

/* ---------- marker circles drawn on his photos ---------- */

// Extra circles on photos that are not a piece's first photo (fractions of the photo).
const extraMarks = new Map<string, Mark>([
  [campaign.spotlightTeeCloseup.src, { x: 0.577, y: 0.774, rx: 0.2, ry: 0.085 }],
  [campaign.partyAnimalJacketBack.src, { x: 0.485, y: 0.53, rx: 0.21, ry: 0.3 }],
]);

/* ---------- the contact sheet's layout ---------- */

const TILTS = [-3, 2.5, -1.5, 3.5, -2.5, 2, -4, 1.5, -2, 3];
const DROPS = [0, 4, 1.5, 5, 2.5, 0.5, 4.5, 1, 3, 2];
// rows of three on the 12-column sheet from 700px, in turn
const THREES = [[5, 4, 3], [3, 5, 4], [4, 3, 5]];
const TWOS = [[5, 4], [4, 5]];
const PAIRS = [[7, 5], [5, 7]];

/** From 700px: rows of three; a remainder of one becomes two rows of two. */
function rowsWide(n: number): number[] {
  if (n <= 2) return n ? [n] : [];
  if (n === 4) return [2, 2];
  const threes = Math.floor(n / 3);
  const rem = n % 3;
  if (rem === 0) return Array(threes).fill(3);
  if (rem === 2) return [...Array(threes).fill(3), 2];
  return [...Array(threes - 1).fill(3), 2, 2];
}

/** On a phone: pairs, with one big print first when the count is odd. */
function rowsPhone(n: number): number[] {
  const pairs = Array(Math.floor(n / 2)).fill(2);
  return n % 2 ? [1, ...pairs] : pairs;
}

function layout(n: number): Place[] {
  const out: Place[] = Array.from({ length: n }, (_, i) => ({
    pc: 'auto', ps: 6, dc: 'auto', ds: 4, tilt: TILTS[i % TILTS.length], y: DROPS[i % DROPS.length],
  }));
  let i = 0;
  rowsPhone(n).forEach((size, r) => {
    if (size === 1) { out[i].pc = 2; out[i].ps = 9; i++; return; }
    PAIRS[r % 2].forEach((s, j) => { out[i].pc = j === 0 ? 1 : 'auto'; out[i].ps = s; i++; });
  });
  i = 0;
  let r3 = 0;
  let r2 = 0;
  rowsWide(n).forEach((size) => {
    if (size === 1) { out[i].dc = 4; out[i].ds = 5; i++; return; }
    const spans = size === 3 ? THREES[r3++ % THREES.length] : TWOS[r2++ % TWOS.length];
    const start = size === 3 ? 1 : 2 + (r2 % 2);
    spans.forEach((s, j) => { out[i].dc = j === 0 ? start : 'auto'; out[i].ds = s; i++; });
  });
  return out;
}

/* ---------- building the spreads ---------- */

const keyOf = (p: Photo) => p.image.src;

async function fullSize(photo: Photo): Promise<{ src: string; srcset: string }> {
  if (photo.kind === 'shopify') {
    return { src: shopifyImage(photo.image.src, 1200), srcset: shopifySrcset(photo.image.src, [640, 900, 1200, 1600, 2000]) };
  }
  const max = photo.image.width;
  const widths = [...[640, 960, 1280].filter((w) => w < max), max];
  const img = await getImage({ src: photo.image, widths, format: 'webp', quality: 72 });
  return { src: img.src, srcset: img.srcSet.attribute };
}

function statusOfAct(pieces: Piece[]): Status | null {
  if (pieces.some((p) => p.status === 'live')) return 'live';
  if (pieces.some((p) => p.status === 'soldout')) return 'soldout';
  return pieces.length ? 'archive' : null;
}

export async function getSpreads(): Promise<Spread[]> {
  const pieces = await getPieces();
  let turn = 0;
  return Promise.all(
    acts.map(async (act) => {
      const own = pieces.filter((p) => p.act.slug === act.slug);
      const ownerOf = (src: string) => own.find((p) => p.photos.some((ph) => keyOf(ph) === src)) ?? null;
      const seen = new Set<string>();
      const drafts: Omit<Shot, 'full' | 'place' | 'caption' | 'mark'>[] = [];
      const add = (photo: Photo, alt: string, credit: string | null, piece: Piece | null) => {
        const key = keyOf(photo);
        if (seen.has(key)) return;
        seen.add(key);
        drafts.push({ key, photo, alt, w: photo.image.width, h: photo.image.height, credit, piece });
      };

      for (const p of own.filter((x) => x.product)) {
        p.photos.forEach((ph, i) => {
          const alt = ph.kind === 'shopify' ? ph.image.alt || (i === 0 && p.art.cutout?.alt) || copy.photoAlt(p.title, i + 1) : ph.alt;
          add(ph, alt, null, p);
        });
      }
      for (const ph of act.photos) add({ kind: 'local', image: ph.image, alt: ph.alt }, ph.alt, ph.credit, ownerOf(ph.image.src));
      for (const p of own.filter((x) => !x.product)) {
        p.photos.forEach((ph) => add(ph, ph.kind === 'local' ? ph.alt : ph.image.alt || p.title, null, p));
      }

      // captions: the first photo of each piece names it; the act's first photo of no piece
      // takes the act's campaign caption, when there is one
      const named = new Set<string>();
      let campaignNamed = false;
      const places = layout(drafts.length);
      const shots: Shot[] = await Promise.all(
        drafts.map(async (d, i) => {
          let caption: string | null = null;
          let mark: Mark | null = extraMarks.get(d.key) ?? null;
          if (d.piece && !named.has(d.piece.key)) {
            named.add(d.piece.key);
            caption = copy.the(d.piece.title);
            const m = d.piece.art.mark;
            if (m && keyOf(d.piece.photos[0]) === d.key) mark = { x: m.x / 300, y: m.y / 400, rx: m.rx / 300, ry: m.ry / 400 };
          } else if (!d.piece && !campaignNamed && copy.campaignCaption[act.slug]) {
            campaignNamed = true;
            caption = copy.campaignCaption[act.slug];
          }
          return { ...d, caption, mark, full: await fullSize(d.photo), place: places[i] };
        }),
      );

      const ground = grounds[act.slug] ?? rotation[turn++ % rotation.length];
      return {
        act,
        word: layoutWord(act.title),
        status: statusOfAct(own),
        pieces: own,
        shots,
        ground,
        quote: act.quote && !copy.heldQuotes.includes(act.slug) ? act.quote : null,
      };
    }),
  );
}

/** How wide a print shows, for its srcset. */
export function shotSizes(p: Place): string {
  const d = Math.round((p.ds / 12) * 70);
  const t = Math.round((p.ds / 12) * 88);
  const m = Math.round((p.ps / 12) * 84);
  return `(min-width: 1000px) ${d}vw, (min-width: 700px) ${t}vw, ${m}vw`;
}
