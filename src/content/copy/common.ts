// Words used on more than one page: the header, the bag, the waitlist, the pending facts.
// The magazine's voice: short, second person, a little loud. Nothing here promises what he
// has not confirmed.

export const header = {
  menu: 'Menu',
  bag: 'Bag',
  added: 'Added!',
  skip: 'Skip to the page',
  home: "Life's Oddity, home",
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

/** How a fact he has not given yet is shown, in the tabloid's voice. */
export const pending = {
  stamp: 'Unconfirmed',
  details: 'Fabric and fit are not posted yet. Ask before you order.',
  sizeGuide: 'No size chart yet. Ask for measurements.',
  shipping: 'Shipping and taxes are calculated at checkout.',
  playlist: 'The playlist link is not in yet. Check back.',
  /** The playlist box's stand-in print when a playlist has no artwork. */
  noRecord: 'No record (yet)',
};

/** The playlist box. */
export const player = {
  /** The caption under the one known track. */
  heardOn: (where: string) => `heard on ${where}`,
};

export const status = {
  live: 'Out now',
  soldout: 'Sold out',
  archive: 'Archive',
  exclusive: 'exclusive',
};
