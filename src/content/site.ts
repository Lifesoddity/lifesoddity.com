// The facts the whole site shares: names, lines, links. One source, so a change here changes
// every page. Products (titles, prices, sizes, photos) are NOT here: they come from Shopify.

export const site = {
  name: "Life's Oddity",
  tagline: 'Life Is Odd',
  line: 'Highlighting the oddities of everyday life',
  bio: 'Hollywood dream turned nightmare',
  url: 'https://lifesoddity.com',
  /** Where checkout happens: Shopify's own checkout, on the store's Shopify address. The same
   *  address drives the in-page price refresh and the build (src/lib/shopify.ts STORE_DOMAIN). */
  checkoutDomain: (import.meta.env.PUBLIC_SHOPIFY_DOMAIN as string | undefined) || 'lifesoddity.myshopify.com',
  description:
    'Streetwear released in acts, each with its own soundtrack. Highlighting the oddities of everyday life.',
};

export const nav = [
  { label: 'Shop', href: '/shop/' },
  { label: 'Drop', href: '/drop/' },
  { label: 'Lookbook', href: '/lookbook/' },
  { label: 'About', href: '/about/' },
];

/** His profiles, without tracking parameters. YouTube and X stay out until he confirms the
 *  handles: the ones linked from his old store returned "not found" on 23 Oct 2026. */
export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/lifesoddity/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@lifes.oddity' },
  { label: 'Pinterest', href: 'https://www.pinterest.com/lifesoddity/' },
];

/** How to reach him: an Instagram message, his main channel. No email address on the site. */
export const contact = {
  label: 'DM @lifesoddity',
  href: 'https://ig.me/m/lifesoddity',
};
