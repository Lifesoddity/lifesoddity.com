# Working on lifesoddity.com

Read this before changing anything. It is for whoever maintains the site next, person or AI.

The site is the storefront of Life's Oddity, a small streetwear label. Its look is a 2000s gossip
weekly where every drop is the cover story ("Spotted"). Shopify keeps the products, stock,
orders and checkout. This site reads the products from Shopify when it builds, refreshes price
and stock in the page, keeps the bag in the visitor's browser, and sends the bag to Shopify's
own checkout. It is static (Astro), hosted on Netlify, deployed from `main`.

`DESIGN.md` is the design reference: colours, type, components, motion. `README.md` has the
going-live steps and the waitlist how-to.

## Commands

| What | Command |
|---|---|
| Install (once, Node 22.12 or newer) | `npm install` |
| Work on it locally | `npm run dev` |
| Build what Netlify builds | `npm run build` (output in `dist/`) |
| Type check | `npm run check` |
| Save the current Shopify products as the offline fallback | `npm run snapshot` |

Do not add a dependency without the owner's yes. Astro is pinned to 7.3 on purpose: 7.4 needs a
newer Node than the owner's machine has.

## Where each kind of change is made

| Change | Where |
|---|---|
| A new product, a price, sizes, stock, product photos | Shopify admin only. The site picks it up on the next build. |
| Which drop a product belongs to | Its Shopify tag `act:<slug>`. Untagged products are shown as part of a new, unnamed drop. |
| A new drop (its name, date, definition, playlist, credits, campaign photos) | `src/content/acts.ts`, one new entry. Photos go in `src/assets/campaign/` and are listed in `src/assets/index.ts`. |
| The next drop's name and date | `src/content/acts.ts`, `nextDrop`. Until both are set, the next-drop cover is stamped UNCONFIRMED. |
| A playlist's Spotify link | `src/content/acts.ts`, the act's `playlist.spotify`. With a link, the strip becomes the full player with PLAY. |
| How a product looks in the story and the shop (giant word, ground colour, cut-out) | `src/content/pieces.ts`, keyed by the Shopify handle. Optional: a product with no entry still shows everywhere. |
| Archive pieces no longer in Shopify | `src/content/pieces.ts`, `archivePieces`. |
| Words on a page | `src/content/copy/<page>.ts`. Words shared by several pages: `copy/common.ts`. The brand's name, lines and links: `src/content/site.ts`. |
| Colours, type, spacing, motion timings | The tokens at the top of `src/styles/global.css`. |
| A page's layout | `src/components/<page>/`. The route files in `src/pages/` only assemble them. |
| Parts every page uses (buy box, player, page head, print, waitlist form, header, footer, bag) | `src/components/ui/` and `src/components/layout/`. A change there shows on every page: check them all. |
| Behaviour in the browser (bag, buy button, live price, scroll story, player, waitlist) | `src/scripts/`. |
| The way in (the ALL ACCESS pass, once per visit) | `src/components/layout/Gate.astro`; its words in `copy/common.ts` (`gate`). ENTER NOW starts the radio (`lo:enter`, `src/scripts/player.ts`). On an iPhone only a tap on Spotify's own play button can start its music, so Spotify's real play button, cut out of its player, lies under the white disc on ENTER NOW, with our disc drawn over it and the tap passing through (`.radio[data-mode="gate"]` in `Radio.astro`, `PLAY_AT` in `player.ts`). The owner chose this knowing Spotify's embed terms ask for the player to be shown unaltered. If Spotify moves its button, measure it again and update both. |
| The radio that keeps playing between pages | `src/components/layout/Radio.astro` (the docked strip) and `src/scripts/player.ts`. A playlist marked `standIn` in `acts.ts` is a placeholder until the real link is in. |
| Reading Shopify | `src/lib/shopify.ts`. It uses the Storefront API when `SHOPIFY_STOREFRONT_TOKEN` is set, otherwise the store's public product pages, and falls back to `src/data/products.snapshot.json` if Shopify cannot be reached. |
| Headers, redirects, build settings | `netlify.toml`. |

## Design rules (the short version; DESIGN.md has the rest)

- Colour owns whole regions: yellow, pink, red, black, white. League Gothic for coverlines,
  Libre Franklin for reading, Mr Dafoe script on tape, used sparingly.
- Each photo has one main place. Product shots appear as their cut-out or straight on a
  contrasting ground. The tilted, white-bordered print is for campaign photos (people, places,
  the letter), never for a product shot.
- The home page's scroll story uses one composition for every product: the giant word, the piece
  over it, its tag and its price badge. A new product gets a new scene in the same composition,
  not a new layout.
- Use the width: no lone narrow column with half the screen empty.
- Motion: animate only `transform` and `opacity`, nothing loops, nothing page-tall repaints, and
  every effect has a still version under reduced motion. The owner notices lag.
- The parallax drift (what moves on scroll, and how fast) is one block in `global.css`, scaled by
  `--dk` on wider screens; the About timeline's self-drawing rails are in `Timeline.astro`. Moving a
  layer next to text: check that the two part as the page scrolls, never meet, at 375, 768, 1024,
  1280 and 1440. The pen marks (`.mark`) draw with the scroll too: `src/scripts/ink.ts` measures each
  line's length on screen, global.css slides the ink along it.
- Everything pink draws itself (the pink block in `global.css`): lettering writes on, tapes unroll,
  question marks are drawn, pink words sweep in, quote marks slap on. Pink on a page's first screen
  has no scroll left, so `inkIntro` in `ink.ts` plays it once on load (after the entry pass lifts),
  top to bottom. New pink goes in both lists. None of this, pen marks included, runs on the home
  page (the owner's call): it keeps its own motion and its marks simply show.
- The buy button is never greyed out unless the piece is sold out: PICK A SIZE, then ADD TO BAG,
  then CHECKOUT · BAG (n).

## Pages change without a reload

So the radio keeps playing, moving between pages swaps the page in place (Astro's ClientRouter,
set up in `Base.astro`). The bag drawer, the radio and the announcer are marked `data-keep` and
never leave. Two rules follow:

- A script that binds to the page runs through `onPage()` from `src/scripts/page.ts`, never just
  once at load: it runs again after every page change. Listeners on `window` or `document` take
  the `signal` it gives, and observers and timers stop on that signal's `abort`.
- A form or link that must do a full page load gets `data-astro-reload` (the waitlist form has it).

## Writing rules

- The site speaks as Life's Oddity, in the brand's own words: "Highlighting the oddities of
  everyday life", "Hollywood dream turned nightmare", "Life Is Odd". Never "he", "his" or "him"
  about the founder.
- Never invent a fact. A fact not given yet is left out. The UNCONFIRMED stamp is only for the
  next drop's name and date, once per page.
- Nothing technical on screen: no "null", no raw decimals, no labels like "from API". Prices are
  whole dollars.
- No em dashes. Short, plain sentences.

## Before pushing

1. `npm run build` exits 0. Read the `[launch]` lines in its log: what the site still waits on.
2. `npm run check` shows 0 errors.
3. Look at every page you touched at 375, 768, 1024, 1280x720 and 1440 wide: no sideways
   scroll, no text over text, no empty boxes.
4. Work on a branch: a pull request gets a free Netlify preview. Merge to `main` in batches:
   every production deploy costs Netlify credits.

## Public repository

This repository is public. Never commit tokens, emails, account ids, IP addresses or DNS values.
Secrets live in a git-ignored `.env` locally and in Netlify's environment variables. The
variables the site reads:

- `PUBLIC_SHOPIFY_DOMAIN`: the store's Shopify address for checkout and the live price refresh.
- `SHOPIFY_STOREFRONT_TOKEN` (optional): read products through the Storefront API.
- `LAUNCH_STRICT=1`: a build that is missing a launch fact stops instead of deploying.
