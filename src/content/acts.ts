// The collection, told in acts. Each act is one drop: its name, its vice, its definition, the
// day it opened, its soundtrack and its campaign. All of it from his own Instagram captions.
// A new drop is one new entry here (and its products tagged in Shopify with `act:<slug>`).
// `null` means it has not been given yet: the pages leave it out, never invent it.

import type { ImageMetadata } from 'astro';
import { campaign } from '../assets';

export interface Credit {
  role: string;
  /** Instagram handles, as his captions credit them. */
  names: string[];
}

export interface Act {
  slug: string;
  /** "Act 1". She Devil was never numbered in his captions, so it has no number. */
  number: number | null;
  title: string;
  /** The vice of the act, when his captions name one. */
  vice: string | null;
  /** The dictionary entry for the act, in his words. */
  definition: string | null;
  subtitle: string | null;
  /** Whether the subtitle may be printed large. "A love letter to Mutsumi" waits on his OK. */
  subtitleConfirmed: boolean;
  /** When it opened, as an ISO date (with time when he gave one). */
  opened: string;
  openedLabel: string;
  status: 'live' | 'archive';
  /** A line from his captions that closes or frames the act. */
  line: string | null;
  quote: string | null;
  /** A line from a personal caption, kept off every page until he says yes. To print it, move it into quote. */
  heldQuote?: string;
  /** The act's soundtrack; `cover` is its playlist artwork when he has one. `standIn`: the
   *  link is a placeholder playlist so the player can be seen; the launch check lists it. */
  playlist: { name: string; spotify: string | null; apple: string | null; standIn?: boolean; cover?: { image: ImageMetadata; alt: string } };
  credits: Credit[];
  photos: { image: ImageMetadata; alt: string; credit: string | null }[];
}

export const acts: Act[] = [
  {
    slug: 'she-devil',
    number: null,
    title: 'She Devil',
    vice: null,
    definition:
      'she-devil: a woman with a seductive voice and enchanting appearance, she has a dangerous or evil reputation',
    subtitle: 'A love letter to Mutsumi',
    subtitleConfirmed: false,
    opened: '2026-02-14',
    openedLabel: 'Feb 14, 2026',
    status: 'live',
    line: null,
    quote: null,
    heldQuote: 'To every woman that has loved me for who I am, thank you.',
    playlist: { name: 'A love letter to Mutsumi', spotify: null, apple: null },
    credits: [{ role: 'Creative directed and shot by', names: ['_shaysstudio'] }],
    photos: [
      { image: campaign.sheDevilLetterRoses, alt: 'A handwritten letter on aged paper among red rose petals', credit: '@_shaysstudio' },
      { image: campaign.sheDevilLetter, alt: 'The handwritten letter, close', credit: '@_shaysstudio' },
    ],
  },
  {
    slug: 'party-animal',
    number: 1,
    title: 'Party Animal',
    vice: 'Gluttony',
    definition: 'Gluttony: the excessive hunger for more than you need',
    subtitle: null,
    subtitleConfirmed: true,
    opened: '2026-01-30T12:00:00-05:00',
    openedLabel: 'Jan 30, 2026, 12pm EST',
    status: 'archive',
    line: 'This concludes Act 1.',
    quote: 'Have you ever wanted to be him? The one who walks into the room and everything stops.',
    playlist: { name: 'Showtime', spotify: 'https://open.spotify.com/playlist/340JJSSTULljlnDn9FrMmd', standIn: true, apple: null, cover: { image: campaign.partyAnimalRadio, alt: "Illustrated cover for Life's Oddity radio: a house party under two spotlights, PARTY ANIMAL bunting" } },
    credits: [
      { role: 'Act 1 film shot by', names: ['sixomo'] },
      { role: 'Gluttony reel shot by', names: ['flyceoproductions'] },
      { role: 'Models', names: ['jb.worldd', 'timmybecton', 'kevreal', 'leekkyy_', 'brianathomas__', 'bonegracie'] },
      { role: 'Music', names: ['godsflyestsoldier'] },
    ],
    photos: [
      { image: campaign.showtimeHoodieBack, alt: 'Back of a black zip hoodie printed SECURITY and LIFE OF THE PARTY, worn with red patent trousers against a white wall', credit: null },
      { image: campaign.showtimeHoodieSide, alt: 'The zip hoodie worn open with red patent trousers in a concrete corner', credit: null },
      { image: campaign.spotlightTeeFront, alt: "Black tee with the white mountain-line Life's Oddity logo on the chest, worn against a concrete wall", credit: null },
      { image: campaign.spotlightTeeCloseup, alt: 'Close on the Spotlight tee and its white mountain-line logo', credit: null },
    ],
  },
];

/** The next drop. Name and date unknown: no countdown until he sets them. */
export const nextDrop: { name: string | null; opens: string | null; opensLabel: string | null } = {
  name: null,
  opens: null,
  opensLabel: null,
};

/** The one known track, from his caption on the Gluttony reel. */
export const knownTrack = { title: 'G wagon', artist: 'Godsflyestsoldier', heardOn: 'the Gluttony reel', act: 'party-animal' };

/** A product not yet tagged with an act (`act:<slug>` in Shopify) belongs here, so it never
 *  borrows another drop's story. Tag it in Shopify and add its act above to give it one. */
export const newDropAct: Act = {
  slug: 'new',
  number: null,
  title: 'The new drop',
  vice: null,
  definition: null,
  subtitle: null,
  subtitleConfirmed: true,
  opened: '',
  openedLabel: '',
  status: 'live',
  line: null,
  quote: null,
  playlist: { name: '', spotify: null, apple: null },
  credits: [],
  photos: [],
};

export const actBySlug = (slug: string) => acts.find((a) => a.slug === slug);
export const liveAct = () => acts.find((a) => a.status === 'live') ?? acts[0];
/** The playlist the docked radio offers before anything plays (layout/Radio.astro): the home
 *  page's soundtrack, Act 1's Showtime, while it has a link, else any act's that has one. */
export const radioAct = () => [actBySlug('party-animal'), ...acts].find((a) => a?.playlist.spotify) ?? null;
