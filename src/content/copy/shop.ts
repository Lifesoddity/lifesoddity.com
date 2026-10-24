// The shop page, ALL THE PIECES: the magazine's inside spread of every piece. What is in the
// Shopify store comes first (out now, or sold out), then the archive act by act, then the next
// drop. Product names, prices, sizes and photos come from Shopify; act names, vices,
// definitions and dates come from content/acts.ts. Nothing here names a product, a price or a
// date, so a product added in Shopify needs no change in this file.
//
// For the store owner: when the next drop has a name and a date (content/acts.ts, nextDrop),
// the last card prints them instead of the UNCONFIRMED stamp.

/** "A", "A and B", "A, B and C". */
export const andList = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** Up to three names, then "A, B and 8 more". */
const fewNames = (items: string[]) =>
  items.length <= 3 ? andList(items) : `${items.slice(0, 2).join(', ')} and ${items.length - 2} more`;

export const shop = {
  title: 'All the pieces',
  script: 'spotted',
  /** The title card's deck, from what is in the store and in the archive. */
  deck: (d: { out: string[]; sold: string[]; acts: string[] }) => {
    const parts = [
      d.out.length ? `Out now: ${fewNames(d.out)}.` : '',
      d.sold.length ? `Sold out: ${fewNames(d.sold)}.` : '',
      d.acts.length ? `In the archive: ${andList(d.acts)}.` : '',
    ].filter(Boolean);
    return parts.length ? parts.join(' ') : 'The store is between drops.';
  },
  /** An act as the page names it: "Act 1: Party Animal", or "She Devil" (never numbered). */
  actName: (number: number | null, title: string) => (number ? `Act ${number}: ${title}` : title),
  /** The drop a piece came out in, for its issue line: "Act 1: Party Animal", "The She Devil drop". */
  dropName: (number: number | null, title: string) => (number ? `Act ${number}: ${title}` : `The ${title} drop`),

  /** The coverlines on the title card: one per part of the page. */
  contents: {
    label: 'In this issue',
    out: 'Out now',
    sold: 'Sold out',
    /** After the price of the one piece in the store: its size range. */
    sizes: (first: string, last: string) => (first === last ? `, ${first}` : `, ${first} to ${last}`),
    /** Several pieces in the store. */
    many: (n: number) => `${n} pieces in the store`,
    archive: 'The archive',
    archiveLine: (n: number, acts: string[]) => `${n} ${n === 1 ? 'piece' : 'pieces'} from ${andList(acts)}`,
    next: 'Who’s next?',
    nextLine: 'Get on the list',
  },

  /** The pieces in the Shopify store. */
  out: {
    title: (anyLive: boolean) => (anyLive ? 'Out now' : 'Sold out'),
    exclusive: 'Exclusive',
    see: (title: string) => `${title}, see the piece`,
    from: 'From',
    hint: 'Tap a size. It goes straight in your bag.',
    sizes: (title: string) => `${title}: tap a size to add it to your bag`,
    soldLine: 'Every size is gone. The full story is still up.',
    more: 'The full story',
  },

  /** Past acts: his photos, no prices. */
  archive: {
    title: 'The archive',
    deck: 'Past acts, on the record. No price tags, just the pics.',
    act: (n: number) => `Act ${n}`,
    dropped: 'Dropped',
    /** The script caption over each print: "spotted: the Showtime hoodie, Act 1". */
    spotted: (tag: string) => `spotted: ${tag.charAt(0).toLowerCase()}${tag.slice(1)}`.replace(/\bAct (\d+)/g, 'Act\u00a0$1'),
  },

  /** The last card: the next drop, which links to the drop page and its waitlist. */
  next: {
    title: 'Who’s next?',
    noPics: 'No pics (yet)',
    pending: 'No name, no date on the record yet. Be the first to know.',
    named: (name: string, date: string | null) =>
      date ? `${name}. ${date}. Be the first to know.` : `${name}. No date on the record yet. Be the first to know.`,
    go: 'Get on the list',
  },
};
