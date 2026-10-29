// The lookbook: the paparazzi spread. Every act's photos as a contact sheet of flash-lit prints,
// the act's name as a giant word, and the credits his captions give. Only words live here: the
// photos, credits, dates and definitions come from content/acts.ts, content/pieces.ts and Shopify.
//
// For the owner of the project (never shown on the page):
// - Photo rights: the credit lines printed here are exactly the ones his captions name
//   (acts.ts credits and photo credits). He should confirm the photographers agree to their
//   photos on the site and how they want the credit written. A photo with no named
//   photographer carries no credit line.
// - An act with no photos yet shows no sheet at all: nothing stands in for the photos (D1).
// - She Devil's quote ("To every woman that has loved me for who I am, thank you.") comes from
//   a personal caption: it stays off this page until he says yes (see heldQuotes).
// - "A love letter to Mutsumi" is not printed until he confirms it (acts.ts subtitleConfirmed).
// - The two Instagram images of unclear origin are not in the site's assets and never appear.

/** "Showtime hoodie" -> "the Showtime hoodie"; "The Spotlight tee" -> "the Spotlight tee". */
const the = (title: string) => (/^the\s/i.test(title) ? `the ${title.slice(4)}` : `the ${title}`);

export const lookbook = {
  title: 'Lookbook',
  /** The pink script over the title card (decorative, hidden from screen readers). */
  script: 'all the pics',
  deck: 'Every drop, caught on camera. Open any pic to see it big.',
  jumpLabel: 'The acts in this spread',

  /** The act's issue line. */
  act: (n: number) => `Act ${n}`,
  dropped: (date: string) => `Dropped ${date}`,

  /** Script captions on the prints. */
  spotted: 'spotted:',
  the,
  /** A caption for the first photo of an act that shows no piece, by act slug. */
  campaignCaption: { 'she-devil': 'the letter' } as Record<string, string>,
  /** The credit printed along a print's edge, before the handle from acts.ts. */
  shotBy: 'Shot by',
  /** Read after a photo's description by screen readers: what the tap does. */
  seeBig: 'see it big',
  /** Alt text for a Shopify photo that has none in Shopify. */
  photoAlt: (title: string, n: number) => `${title}, photo ${n}`,
  creditsTitle: 'Credits',

  look: {
    title: 'Get the look',
    /** The title when nothing in the act can be bought. */
    titleArchive: 'In this act',
    shopLive: (act: string) => `Shop ${act}`,
    shopArchive: (act: string) => `See ${act} in the shop`,
  },

  /** Acts whose quote waits on his yes before it is printed. */
  heldQuotes: ['she-devil'],

  viewer: {
    label: 'Photo viewer',
    close: 'Close the photo',
    prev: 'Previous photo',
    next: 'Next photo',
    /** Read by screen readers when the photo changes. */
    announce: (i: number, n: number, alt: string) => `Photo ${i} of ${n}. ${alt}`,
    piece: (title: string) => `See ${the(title)}`,
  },

  galleryName: "Life's Oddity lookbook",
};
