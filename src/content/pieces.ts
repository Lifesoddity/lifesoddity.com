// How each piece looks in the magazine. Two kinds of pieces:
// - Shopify products (by handle): price, sizes, stock and photos come from Shopify; this file
//   only adds the art (the giant word, the ground, the cut-out) and which act it belongs to.
//   A product with no entry here still appears everywhere, with sensible defaults.
// - Archive pieces from past acts that are no longer in the Shopify store: they live here in
//   full, with his photos, and never show a price.

import type { ImageMetadata } from 'astro';
import { campaign, cutouts } from '../assets';

export interface PieceArt {
  /** The giant word of its story scene. Default: the product title without its garment word. */
  word?: string;
  /** The act slug. Default: the product's Shopify tag `act:<slug>`, else the live act. */
  act?: string;
  /** Ground of its scene: any CSS background. Default: a rotation of the magazine's colours. */
  ground?: string;
  /** Text and word colours on that ground. */
  ink?: 'ink' | 'white';
  /** Halftone dot colour on that ground. */
  dot?: string;
  /** A cut-out of the piece (its own edge), its flash shadow and the shadow's overhang. */
  cutout?: { front: ImageMetadata; back?: ImageMetadata; shadow: ImageMetadata; overhang: string; alt: string; backAlt?: string };
  /** The black tape tag over the scene. Default: the title. */
  tag?: string;
  /** One line along the bottom of its scene, in his words. */
  line?: string;
  /** The marker circle drawn on a photo print: centre and radii in a 300x400 box. */
  mark?: { x: number; y: number; rx: number; ry: number };
}

export const productArt: Record<string, PieceArt> = {
  'she-devil-tee': {
    word: 'She Devil',
    act: 'she-devil',
    ground: 'linear-gradient(100deg, #D74570 0%, #E3416F 26%, #FC2E5F 50%, #FD1A3E 74%, #FD0522 100%)',
    ink: 'ink',
    dot: 'rgb(81 42 52 / .34)',
    cutout: {
      front: cutouts.sheDevil,
      shadow: cutouts.sheDevilShadow,
      overhang: '-3.14% -2.4%',
      alt: 'Black tee with a red She Devil graphic: a figure in a red corset with white barbed wings, a pink barbed bar, and a dictionary entry',
    },
    tag: 'The She Devil tee',
    line: 'she-devil: a woman with a seductive voice and enchanting appearance, she has a dangerous or evil reputation',
  },
};

export interface ArchivePiece extends PieceArt {
  key: string;
  title: string;
  act: string;
  /** What the piece is, from his photos (never fabric or fit claims). */
  description: string;
  photos: { image: ImageMetadata; alt: string }[];
}

export const archivePieces: ArchivePiece[] = [
  {
    key: 'showtime-hoodie',
    title: 'Showtime hoodie',
    act: 'party-animal',
    word: 'Showtime',
    description: 'A black hoodie printed on the back SECURITY and LIFE OF THE PARTY.',
    ground: '#BA0B19',
    ink: 'white',
    dot: 'rgb(0 0 0 / .22)',
    tag: 'The Showtime hoodie, Act 1',
    line: 'Act 1: Party Animal. Gluttony: the excessive hunger for more than you need.',
    mark: { x: 131, y: 134, rx: 66, ry: 76 },
    photos: [
      { image: campaign.showtimeHoodieBack, alt: 'Back of a black zip hoodie printed SECURITY and LIFE OF THE PARTY, worn with red patent trousers against a white wall' },
      { image: campaign.showtimeHoodieSide, alt: 'The zip hoodie worn open with red patent trousers in a concrete corner' },
    ],
  },
  {
    key: 'spotlight-tee',
    title: 'The Spotlight tee',
    act: 'party-animal',
    word: 'Spotlight',
    description: "A black tee with the white mountain-line Life's Oddity logo on the chest.",
    ground: '#C1C0B6',
    ink: 'ink',
    dot: 'rgb(11 11 11 / .1)',
    tag: 'The Spotlight tee, Act 1',
    line: 'Be the life of the party.',
    mark: { x: 145, y: 183, rx: 44, ry: 26 },
    photos: [
      { image: campaign.spotlightTeeFront, alt: "Black tee with the white mountain-line Life's Oddity logo on the chest, worn against a concrete wall" },
      { image: campaign.spotlightTeeCloseup, alt: 'Close on the Spotlight tee and its white mountain-line logo' },
    ],
  },
  {
    key: 'party-animal-jacket',
    title: 'Party Animal jacket',
    act: 'party-animal',
    word: 'Party Animal',
    description: "A black zip hoodie: SECURITY on the chest and the back, LIFE'S ODDITY down both sleeves.",
    ground: 'linear-gradient(90deg, #C03B4F 0%, #6D5D7E 52%, #566B91 100%)',
    ink: 'white',
    dot: 'rgb(20 10 30 / .26)',
    cutout: {
      front: cutouts.jacketFront,
      back: cutouts.jacketBack,
      shadow: cutouts.jacketShadow,
      overhang: '-2.11% -2.67%',
      alt: "The Party Animal jacket, front: a washed black zip hoodie with SECURITY on the chest and LIFE'S ODDITY down both sleeves",
      backAlt: 'The Party Animal jacket, back: SECURITY and LIFE OF THE PARTY over a party collage',
    },
    tag: 'The Party Animal jacket, Act 1',
    line: 'This concludes Act 1.',
    photos: [
      { image: campaign.partyAnimalJacketBack, alt: "Back of the Party Animal jacket: SECURITY and LIFE OF THE PARTY over a party collage, LIFE'S ODDITY down the sleeves" },
      { image: campaign.partyAnimalJacketFront, alt: "Front of the Party Animal jacket: a washed black zip hoodie with SECURITY on the chest" },
    ],
  },
];

/** Grounds for products that have no art yet, in turn. */
export const defaultGrounds: Pick<PieceArt, 'ground' | 'ink' | 'dot'>[] = [
  { ground: '#FFE500', ink: 'ink', dot: 'rgb(11 11 11 / .1)' },
  { ground: '#FF2E6E', ink: 'ink', dot: 'rgb(81 42 52 / .3)' },
  { ground: '#0B0B0B', ink: 'white', dot: 'rgb(255 46 110 / .22)' },
  { ground: '#E10600', ink: 'white', dot: 'rgb(0 0 0 / .22)' },
];

/** Garment words dropped from a title to make its giant word ("She Devil tee" -> "SHE DEVIL"). */
export const garmentWords = ['tee', 't-shirt', 'shirt', 'hoodie', 'jacket', 'crewneck', 'sweatshirt', 'hat', 'cap', 'beanie', 'pants', 'shorts', 'tank', 'longsleeve'];
