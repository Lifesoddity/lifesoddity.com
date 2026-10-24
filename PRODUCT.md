# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, static output, deployed on Netlify from this repo (chosen by the site's builder on 23 Oct
2026). Products, prices, sizes, stock, orders and checkout stay on Shopify (Starter plan). The site
reads products from Shopify at build time and refreshes price and stock in the page; the cart is
the site's own and hands off to Shopify's checkout page. No Shopify apps. Product photos load from
Shopify's image CDN and are never copied into the repo. A Shopify product webhook calls a Netlify
build hook so new products appear without a code change; it fires on product creation and
deletion only, never on stock or price edits (each production build costs Netlify credits).

## Users

Young streetwear buyers who follow Life's Oddity on Instagram (@lifesoddity) and TikTok
(@lifes.oddity). They arrive from a post, a story link or the bio link, on a phone, inside the
app's in-app browser, often at night and often during a drop. Their job: see the piece, believe
it is worth it, pick a size, and pay before it sells out, or join the list for the next one.

Second audience: the store owner, who is not technical and edits products only in Shopify. The
site must keep working when he adds a product, with no code change.

## Product Purpose

The storefront for Life's Oddity at lifesoddity.com. It sells the current drop, tells the story of
each collection, and collects sign-ups for the next drop. Success: a visitor from Instagram can go
from the link to Shopify's checkout in under a minute on a phone, and new products show up by
themselves.

## Positioning

A streetwear label that releases its clothes like a film: the collection is told in acts, each
drop has a name, a sin or a vice, a dictionary definition, a campaign shoot and its own soundtrack
playlist. The theme in his own words: "Hollywood dream turned nightmare". The tagline: "Life Is
Odd". The line: "Highlighting the oddities of everyday life".

## Operating Context

- Drops are announced on Instagram with a date and time ("12pm est Jan 30"), a campaign shoot, a
  short reel and a playlist on Apple Music ("life's oddity radio, the sound behind the
  collection").
- First collection, Act 1, "Party Animal - Gluttony", dropped 30 Jan 2026: Showtime hoodie,
  Spotlight tee, Party Animal jacket. Then "She Devil", 14 Feb 2026 ("A love letter to Mutsumi").
- Live today: one product, the She Devil tee ($20, black, XS to 2XL). He plans five to ten new
  products, released as drops.
- Shopify Starter has no collections: drops are grouped by product tags or product type set in
  Shopify.

## Capabilities and Constraints

- Pages: home, shop, product page (one per Shopify product, pre-rendered, at Shopify's own
  `/products/<handle>` paths so shared links keep working), cart drawer, drop page per act with a
  waitlist (Netlify Forms: free and unlimited on Netlify's credit plans, 100 a month on legacy
  plans; which one this team is on is unconfirmed), About ("Life Is Odd"), lookbook from his own
  posts, 404.
- Checkout is Shopify's own page; its look follows Shopify's branding settings (logo, colours,
  roughly fonts), which should match the site.
- Sizes must show in the order XS, S, M, L, XL, 2XL (Shopify returns them out of order).
- Free hosting budget: keep the site light; no large video served from Netlify.
- Checkout opens in the same tab (never a popup: in-app browsers block them). Which handoff keeps
  Apple Pay and Shop Pay (cart link or Storefront cart) is tested on a real phone before launch.
- Undecided: the next drop's name and date; whether She Devil is "Act 2" (he never numbered it);
  whether Act 1 pieces come back; the Storefront API token (it comes from creating a Buy Button in
  his admin, which needs his yes; the site can run on public product data and cart links
  without it).

## Brand Commitments

- Name: Life's Oddity. Logo: a single mountain-ridge line over drippy, stencil-cut hand lettering
  "LIFE'S ODDITY". Keep it as drawn.
- Lines: "Life Is Odd"; "Highlighting the oddities of everyday life"; "Hollywood dream turned
  nightmare".
- The owner's brief for the look: "Hollywood theme, dream turned nightmare. Golden age of
  Hollywood." One of the three directions shown must be built on it. A reference he likes:
  thestreamerawards.com (Art Deco awards night).
- Voice, from his captions: the dictionary entry ("Gluttony: the excessive hunger for more than
  you need"); second person and cinematic ("Press play. Showtime starts now."); collections in
  acts; every drop has a soundtrack.

## Evidence on Hand

- Logo, black on transparent, 564x212: `.bunshin/harvest/img/logo-black.png`.
- She Devil tee product photo, 2300x2300, a flat mockup on a pink-to-red gradient (Shopify).
- His Instagram campaign photos (Showtime hoodie, Spotlight tee, She Devil letter), the Party
  Animal radio cover and three reel covers: `.bunshin/harvest/img/`, sources in
  `.bunshin/harvest/sources.json`, captions and credits in `.bunshin/harvest/facts.md`.
- None of these exist and must never be invented: reviews or testimonials, follower or sales
  numbers on the page, press, stockists, a city or founding story, fabric or fit details, a
  shipping promise, a next-drop date, discount codes.

## Product Principles

1. Every drop is an event: the site stages it (name, definition, soundtrack, date), not only lists
   it.
2. From the link to checkout fast, on a phone, inside Instagram's browser.
3. Shopify stays the source of truth: nothing about a product is typed twice.
4. His words and his photos, or nothing: what is missing stays generic and is listed for him.
5. Built so a non-technical owner can keep it alive by using Shopify as he does today.

## Accessibility & Inclusion

WCAG 2.2 AA: readable contrast on every ground the directions use, keyboard paths through the
cart and size picker, reduced-motion versions of every effect.
