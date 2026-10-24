// Words used on more than one page: the header, the buy box, the bag, the waitlist, the
// playlist. The site speaks as Life's Oddity: short, second person, a little loud, never about
// the founder in the third person. Nothing here promises what has not been confirmed.

export const header = {
  menu: 'Menu',
  bag: 'Bag',
  added: 'Added!',
  skip: 'Skip to the page',
  home: "Life's Oddity, home",
};

/** The buy box (components/ui/BuyBox.astro, scripts/buy.ts). Its main button is never dead:
 *  PICK A SIZE, then ADD TO BAG, then CHECKOUT · BAG (n) (bag.goCheckout). */
export const buy = {
  /** The size row's group label. */
  size: 'Size',
  /** The main button before a size is chosen: pressing it points at the sizes. */
  pick: 'Pick a size',
  add: 'Add to bag',
  chosen: (size: string) => `Size ${size}. Add it to your bag.`,
  added: (title: string, size: string) => `In your bag: ${title}, size ${size}.`,
  /** The one fit line under the size stamps, followed by the contact link (site.ts contact). */
  between: 'Between sizes?',
};

export const bag = {
  title: 'Your bag',
  close: 'Close the bag',
  empty: 'Your bag is empty. The story is still going.',
  emptyLink: 'See what is out now',
  remove: 'Remove',
  less: 'One less',
  more: 'One more',
  size: 'Size',
  subtotal: 'Subtotal',
  shipping: 'Shipping and taxes are calculated at checkout.',
  checkout: 'Checkout',
  checkoutNote: 'You pay on Shopify’s checkout page.',
  missingItem: 'Item from your bag',
  lessFor: (t: string, s: string) => `One less: ${t}, size ${s}`,
  moreFor: (t: string, s: string) => `One more: ${t}, size ${s}`,
  removeFor: (t: string, s: string) => `Remove ${t}, size ${s}`,
  qtyNow: (n: number) => `Quantity ${n}`,
  removed: (t: string) => `${t} removed`,
  /** The ADD TO BAG button after an add: it opens the bag. */
  goCheckout: (n: number) => `Checkout · Bag (${n})`,
  /** The price box's way to buy when script does not run. */
  noScript: 'Buy it on Shopify',
};

export const waitlist = {
  label: 'Your email',
  placeholder: 'Spill it here',
  button: 'Tip me off',
  ok: 'You’re on the list.',
  consent: 'Drop emails only. Reply to any of them to be taken off.',
  invalid: 'That email looks off. Check it and try again.',
  empty: 'Type your email first, then hit Tip me off.',
  /** The contact link and a full stop follow it (src/scripts/waitlist.ts). */
  failed: 'That did not go through. Try again in a minute, or',
};

/**
 * A fact not given yet is left out, not stamped (D1). The UNCONFIRMED stamp has one job: the
 * next drop (its name and date), once per page, where the next drop is presented.
 */
export const pending = {
  stamp: 'Unconfirmed',
};

/** The playlist (components/ui/Player.astro, scripts/player.ts). */
export const player = {
  /** The bar over the box and the strip: the brand's own name for its soundtrack. */
  bar: "Life's Oddity radio",
  sub: (n: number | null, title: string) => (n ? `The soundtrack of Act ${n}: ${title}` : `The soundtrack of ${title}`),
  /** The known track, then where it was heard: "G wagon, Godsflyestsoldier," */
  track: (title: string, artist: string) => `${title}, ${artist},`,
  heardOn: (where: string) => `heard on ${where}`,
  /** How screen readers name the playlist: "the Showtime playlist". */
  name: (title: string) => `the ${title} playlist`,
  play: 'Play',
  pause: 'Pause',
  playName: (name: string) => `Play ${name}`,
  pauseName: (name: string) => `Pause ${name}`,
  loading: 'Loading Spotify…',
  playing: (name: string) => `Now playing: ${name}`,
  paused: (name: string) => `Paused: ${name}`,
  here: 'listen here',
  honest: 'Not logged in to Spotify here? You’ll hear previews. Open in Spotify for the full songs.',
  open: 'Open in Spotify',
  error: 'Spotify did not load here. Open the playlist in Spotify instead.',
};

export const status = {
  live: 'Out now',
  soldout: 'Sold out',
  archive: 'Archive',
  exclusive: 'exclusive',
};
