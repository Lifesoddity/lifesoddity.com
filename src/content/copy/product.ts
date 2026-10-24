// The product page: each product is a cover story. Every line is his (his captions, the tee's
// own print) or a plain label. What he has not given (fabric, fit, measurements) comes from
// copy/common.ts `pending` with an UNCONFIRMED stamp, never invented here. Shipping is a known
// fact (taxes and shipping are calculated at Shopify's checkout), so it carries no stamp.
//
// For the owner of the project:
// - "Printed on the tee" is true of the She Devil tee only (its print carries the she-devil
//   dictionary entry, seen on the product photo). A new product gets no such line unless it is
//   added below under its Shopify handle.
// - The campaign inset's title per act: "The love letter" for She Devil (the letter in his
//   shoot), "Life of the party" for Act 1 (his caption and the jacket's back print). A new act
//   falls back to "The shoot" until it gets its own title here.
// - The next drop has no name or date yet (content/acts.ts nextDrop): the end of the page runs
//   the waitlist with no date. "In the works" rests on his plan for more drops.

export const product = {
  sizeLabel: 'Size',
  sizeRange: (from: string, to: string) => `${from} to ${to}`,
  /** Before the price when sizes cost different amounts. */
  from: 'From',
  addToBag: 'Add to bag',

  /** A script tag after the deck's last word, when the deck is printed on the piece itself.
   *  Keyed by Shopify handle. */
  printedOn: { 'she-devil-tee': 'printed on the tee' } as Record<string, string>,

  dropLead: 'The drop:',
  actName: (n: number, title: string) => `Act ${n}: ${title}`,

  facts: { details: 'Details:', sizeGuide: 'Size guide:', shipping: 'Shipping:' },

  helpLead: 'Got a question?',

  gallery: {
    label: (title: string) => `Photos of the ${title}`,
    /** Alt text when Shopify has none for a photo (he can add his own in the Shopify admin). */
    alt: (title: string, i: number, n: number) => (n > 1 ? `The ${title}, photo ${i} of ${n}` : `The ${title}`),
    prev: 'Previous photo',
    next: 'Next photo',
  },

  inset: {
    titles: { 'she-devil': 'The love letter', 'party-animal': 'Life of the party' } as Record<string, string>,
    fallback: 'The shoot',
  },

  more: {
    title: 'More from this act',
    see: (title: string) => `${title}, see the piece`,
  },

  next: {
    title: ['To be', 'continued'],
    tag: 'next drop',
    deck: 'The next drop is in the works. Be the first to know when it drops.',
    named: (name: string, when: string | null) => `Next drop: ${name}${when ? `, ${when}` : ''}. Be the first to know.`,
    all: 'See all the pieces',
  },

  bar: {
    open: 'Pick a size',
    sizes: 'Pick your size',
    close: 'Close the sizes',
    added: (title: string, size: string) => `In your bag: ${title}, size ${size}.`,
  },
};
