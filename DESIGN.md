---
name: Life's Oddity
description: The storefront told as a 2000s celebrity gossip weekly on the night of the scandal.
colors:
  white: "#FFFFFF"
  yellow: "#FFE500"
  pink: "#FF2E6E"
  ink: "#0B0B0B"
  red: "#E10600"
  red-press: "#C10500"
  paper: "#EEEDE6"
  muted: "rgb(11 11 11 / .68)"
  shadow: "rgb(11 11 11 / .58)"
typography:
  display:
    fontFamily: "League Gothic, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "clamp(84px, 24vw, 220px)"
    fontWeight: 400
    lineHeight: 0.8
    letterSpacing: "0.005em"
  headline:
    fontFamily: "League Gothic, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "normal"
  title:
    fontFamily: "League Gothic, Arial Narrow, Roboto Condensed, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  script:
    fontFamily: "Mr Dafoe, Brush Script MT, cursive"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  deck:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  caption:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Libre Franklin, Franklin Gothic Medium, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  full: "50%"
spacing:
  stamp-gap: "6px"
  gutter: "12px"
  pad: "clamp(16px, 4vw, 56px)"
  header: "60px"
  header-wide: "72px"
components:
  button-buy:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    height: "54px"
    width: "100%"
  button-buy-hover:
    backgroundColor: "{colors.red-press}"
    textColor: "{colors.white}"
  button-buy-disabled:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
  size-stamp:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "46px"
  size-stamp-hover:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
  size-stamp-selected:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
  bag-chip:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    padding: "10px 12px 9px"
    height: "44px"
  bag-chip-hover:
    backgroundColor: "{colors.red-press}"
    textColor: "{colors.white}"
  tape:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.pink}"
    typography: "{typography.script}"
    padding: "2px 18px 8px 14px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.red}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "5px 8px 4px"
  input-waitlist:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "0 14px"
  button-waitlist:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "2px 20px 0"
  page-head:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    padding: "28px {spacing.pad} 30px"
---

# Design System: Life's Oddity

## Overview

**Creative North Star: "The Scandal Issue"**

Every page is a page of the same cheap, loud gossip weekly, printed the night the story broke. The current drop is the cover story: its piece is cut out along its own edge, hit with an on-camera flash, and slapped under coverlines in tall condensed caps. Campaign photos are the paparazzi prints, the brand's own captions are the coverlines and pull quotes, and real states (sold out, archive, the next drop not yet named) arrive as rubber stamps. The density is the point: every screen is full of real material, never a lone column with empty space beside it.

Colour does not decorate; it owns whole regions and switches section by section, the way a weekly flips from a yellow coverline field to a black gossip column to a red banner. Each colour field carries one static halftone layer, so the grounds read as print rather than as screen fills. Depth comes from the flash: every photo and sticker sits on paper with a slightly blurred offset shadow, as if lit from the camera.

Motion is short, physical and never loops: a flash pop on a photo, a sticker slapped on with a small overshoot, a size row nudged, the home's pinned scroll story where each piece takes over the screen the same way. All of it moves transform and opacity only, and every effect has a still version under reduced motion. The system is light only (no dark scheme).

**Key Characteristics:**
- Whole regions in one of five inks: flash white, tabloid yellow, hot pink, ink black, banner red.
- League Gothic set huge and tight for every headline; Libre Franklin for every reading and control line; Mr Dafoe only on tape and rare overlays.
- Square corners everywhere; edges are torn, notched or cut by clip-path instead of rounded.
- Flash shadows with a slight blur behind photos, cut-outs and stickers; doubled inset keylines on stamps and controls.
- Tilts between -11 and +9 degrees, most at -4 and -3.
- Static halftone on colour fields; a Riso second-colour pass behind giant words.

## Colors

Five saturated print inks on white, each used as a whole field, plus one pressed red for hover and a newsprint grey for disabled states.

### Primary
- **Banner Red** (red): the buy colour. ADD TO BAG, PICK A SIZE, the bag chip, the waitlist button, a chosen size stamp, the EXCLUSIVE banner, rubber stamps and the issue banner page head. The buy button is full red in every state but sold out.
- **Pressed Red** (red-press): hover and press state of every red control. Never a resting fill.

### Secondary
- **Tabloid Yellow** (yellow): coverline fields, page heads, the open phone menu (torn bottom edge), the desktop nav highlighter swipe, the MENU tab, the footer's LIFE IS ODD word and its top rule, the ADDED! sticker, size stamp hover, and the focus ring on dark grounds. Also the browser theme colour.

### Tertiary
- **Hot Pink** (pink): the script ink on black tape, marker circles and arrows drawn on photos, the Riso offset pass, quote marks and hit words in coverlines, underline colour on hover, and text selection. It is the gossip highlight, not a ground for controls.
- **Cover Gradient** (the cover token, a 100 degree run from #D74570 through #FC2E5F to #FD0522): the live piece's own studio pink-to-red, used for the home cover and the pink page head tone only. Story scenes take their ground from each piece's own material (set per piece in the content files, not in the system).

### Neutral
- **Ink** (ink): all body text, the masthead rules, size stamp borders, the price box border, the black coverline column, the footer, the tape strip, the default focus ring.
- **Flash White** (white): the page ground, the masthead, white print borders, the price box, text on red and black.
- **Newsprint** (paper): the sold-out buy button under a hatch, and the scrollbar track.
- **Muted Ink** (muted): consent and secondary notes only.
- **Flash Shadow** (shadow): the offset shadow under photos.

### Named Rules
**The Whole Region Rule.** A colour fills a section edge to edge or not at all; adjacent sections switch inks. No tinted cards floating on white, no colour used as a thin accent line.

**The Red Means Buy Rule.** Banner red is the only fill for buying and joining. A red control never fades or greys out before a size is chosen; it changes its words (PICK A SIZE, ADD TO BAG, CHECKOUT, BAG (n)), and only a sold-out piece greys it to hatched newsprint.

**The Printed Field Rule.** Every colour field carries one static halftone layer (7px grid, dots of about 1.2px, offset half a cell), its dot tinted for the ground and faded by a mask. It never moves and never repaints on scroll.

## Typography

**Display Font:** League Gothic (with Arial Narrow, Roboto Condensed)
**Body Font:** Libre Franklin, variable 400 to 900 (with Franklin Gothic Medium, Helvetica Neue, Arial)
**Script Font:** Mr Dafoe (with Brush Script MT)

All three are self-hosted through Astro's font pipeline.

**Character:** The tabloid's own tall condensed caps, shouted at poster scale, against a newsprint gothic that stays readable at caption size; the brush script is the gossip writer's scrawl on tape.

### Hierarchy
- **Display** (League Gothic 400, clamp(84px, 24vw, 220px), line-height .8, uppercase): page head titles, the cover word, the story's giant words (sized from the word's measured width to run the width of the screen, capped by screen height), the footer's LIFE IS ODD.
- **Headline** (League Gothic 400, 40 to 68px, line-height .82 to .9, uppercase): coverlines, pull quotes, section titles such as WHO'S NEXT? and the price figure.
- **Title** (League Gothic 400, 30px, line-height 1, letter-spacing .04em, uppercase): every primary button label and sticker text.
- **Script** (Mr Dafoe 400, 30 to 42px, line-height 1): words on the black tape, the rare pink overlay on a page head, photo captions in the story.
- **Deck** (Libre Franklin 700, 17px, 19px from 1000px, line-height 1.4, up to 46ch): the one line under a page title.
- **Body** (Libre Franklin 400 to 600, 14.5 to 16px, line-height 1.42 to 1.45): reading copy and coverline bodies.
- **Caption** (Libre Franklin 600, 12 to 13px, line-height 1.3 to 1.4): notes under the buy box, legal, consent.
- **Label** (Libre Franklin 800, 11.5 to 13px, letter-spacing .1 to .16em, uppercase): nav links, the bag chip, stamps, size stamps, field labels, the issue line with middle dots.

Prices and counts use tabular lining numerals.

### Named Rules
**The Coverline Rule.** Anything that shouts is League Gothic in caps, set tight (line-height .8 to .9) and as large as the space allows without clipping. Libre Franklin never shouts; League Gothic never runs a paragraph.

**The Rare Script Rule.** The pink script appears on at most one page head in three (today only the lookbook's) and never crosses the letters of a title; below 1000px it takes its own line above the title.

**The Riso Pass Rule.** A giant word is printed solid in a pale ink of its own ground, at least 3:1 against every colour of that ground, with the same word again behind it offset .035em right and down in a second ink (black, pink or yellow, picked for contrast). The pass is a zero-blur text shadow that moves with the letters.

## Layout

Full-bleed bands stacked one per section, each a single colour region. The side margin is one fluid token (pad, clamp(16px, 4vw, 56px)), honouring safe-area insets. Two breakpoints: 700px (the masthead nav comes out of the menu, two-column covers and grids) and 1000px (spreads: the cover splits two thirds to one third with the coverlines on a black right column, page head scripts move to the top right). A short-phone query (under 700px wide and 760px tall) shrinks the cover star so the price box lands in the first screen. Headlines are sized by min(vw, svh) on wide screens so short laptops never collide text. Gaps are small and dense (6px between size stamps, 8 to 16px inside blocks, about 30px between coverlines). The masthead is sticky (60px, 72px from 700px) and focus scrolling keeps 12px clear of it. The home's story is a pinned stage of one screen's height, one composition for every scene.

### Named Rules
**The Full Page Rule.** Use the width: photos, prints, coverlines and grids fill the band. No narrow text column with half the screen empty.

## Elevation & Depth

Depth is the on-camera flash, not a UI elevation scale. Photos and cut-outs sit over an offset shadow with a slight blur, cut-outs over their own blurred silhouette baked into an image so nothing blurs at run time. Stickers, prints and the price box lift off the page with soft drop shadows, warmed with a wine-red tint on pink grounds. Controls and stamps use doubled inset keylines (an outer border, a thin gap in the ground colour, an inner rule) to read as printed or stamped, with no outer shadow on stamps.

### Shadow Vocabulary
- **Flash shadow** (`box-shadow: 0 0 5px 2px rgb(11 11 11 / .58)` on a layer translated 11px 13px): behind every photo print.
- **Cut-out shadow** (the piece's own silhouette, pre-blurred, translated 13px 15px): behind every cut-out.
- **Sticker lift** (`box-shadow: 0 8px 14px rgb(11 11 11 / .3)`): stickers, the ADDED! note, the waitlist confirmation.
- **Price box lift** (`box-shadow: 0 12px 20px -8px rgb(60 0 18 / .55)`): the cover's price box on the pink cover.
- **Stamp keyline** (`box-shadow: inset 0 0 0 1.5px #FFFFFF, inset 0 0 0 2.5px #E10600`): rubber stamps; size stamps use the same idea at 2px and 3px.

### Named Rules
**The Flash Not Block Rule.** Every photo shadow is offset and slightly blurred. Never a zero-blur offset block behind a photo or card. Zero-blur offsets are kept for the Riso pass on type and the 2px printed edge under the phone's MENU tab.

## Shapes

Square corners throughout (0px): buttons, fields, stamps, cards and prints. Shape character comes from clip-path cuts instead: the buy button and banners have notched arrow ends (cut in 2.5 to 3% at mid-height), the tape strip and the open menu have torn, irregular edges, the MENU tab a zigzag bottom. Circles (50%) are reserved for drawn things: marker circles and round seals. Almost everything printed sits at a tilt: stickers rest at -4 degrees, stamps at -3, banners -2 to -5, prints up to 9 either way.

### Named Rules
**The Cut Not Round Rule.** Edges are cut, torn or notched, never rounded.

## Components

### Buttons
Full-strength, loud, stuck on.
- **Shape:** square, with notched arrow ends drawn by clip-path on a red layer behind the label.
- **Primary (button-buy):** banner red, white League Gothic caps at 30px, 54px tall, full width of its box. Labels change with state: PICK A SIZE (pressing it focuses the first available size and nudges the row 160ms), ADD TO BAG, CHECKOUT with the bag count.
- **Hover / Focus:** pressed red on hover; a 3px ink focus ring offset 3px (yellow on dark grounds); press moves it down 1px.
- **Disabled:** sold out only, hatched newsprint with half-strength ink.
- **Waitlist join:** the same red and type, 56px tall beside the field.

### Chips
- **Bag chip:** red, white uppercase label with tabular count, doubled inset keyline, tilted -3 degrees; on hover it darkens and straightens to -1 degree. An ADDED! yellow sticker drops under it after an add.
- **Size stamps (size-stamp):** a six-column row, XS to 2XL, 46px tall, white with a 2px ink border and an inner keyline. Hover goes yellow; the chosen size turns red with white type and tilts -4 degrees; an unavailable size is struck through over a hatch.

### Cards / Containers
- **Price box:** white, 3px ink border, price-box lift, holding the price in League Gothic, the piece's name in label caps, barcode-like bars without digits, the size stamps and the buy button.
- **Print:** a campaign photo with a 6px white border, tilted, over its flash shadow. Product shots are never prints: they show as a cut-out or straight on a contrasting ground (yellow, black or white).
- **Internal padding:** 12px in the price box; bands use pad.

### Inputs / Fields
- **Style:** square, 56px tall, 3px ink border, white, Libre Franklin 600 at 16px; label above in label caps.
- **Focus:** the 3px ink ring offset 2px.
- **Error:** border turns red; the message sits on white with a 4px red rule on its left, readable on every ground.

### Navigation
- **Masthead:** sticky white strip with a 3px ink rule and a 1px rule just above it, the logo at 34px (42px from 700px), the nav centred, the bag chip at the right.
- **Desktop:** label caps at 12.5px; a yellow highlighter swipe tilted -2 degrees scales in from the left on hover, focus and the current page.
- **Phone:** a yellow MENU tab with a zigzag edge opens a yellow sheet with a torn bottom edge, links in 46px League Gothic over 2px ink rules, the current page in red.
- **Footer:** ink ground under a 6px yellow rule, LIFE IS ODD in yellow League Gothic sized to the full content width, the logo inverted to white.

### Tape
A black strip with torn ends carrying a word in pink Mr Dafoe at 36px, tilted -7 degrees, laid over a photo or scene.

### Rubber Stamp
Red uppercase label caps in a 2px red border with an inner white and red keyline, tilted -3 degrees. Only for real states: SOLD OUT, ARCHIVE, an act number, and UNCONFIRMED on the next drop's blank cover (at most one per page, only where the next drop is shown). Slapped on once with the sticker overshoot.

### EXCLUSIVE Banner
Red League Gothic caps with a doubled white keyline and sticker lift, tilted -5 degrees across a live piece's corner. Live pieces only.

### Page Head
A colour field with halftone, the page title in display caps and one deck line. The title treatment varies so neighbours in the nav never match: plain, slab (reversed out of a black block), bar (yellow caps on a full-width black bar), outline (stroked caps over a Riso pass), banner (white caps on a notched red banner, tilted -2 degrees).

### Scroll Story (signature)
The home's pinned stage: one composition for every scene. The ground floods up, the giant word's letters roll in, the piece flies in tilted and lands centred with the flash, the tape, badge and line arrive last and leave first. Native scrolling with one passive listener per story; transform and opacity only. Under reduced motion it becomes still stacked panels.

### Radio
LIFE'S ODDITY RADIO, an act's playlist. With a Spotify link: a yellow box with a 4px ink border, the red bar, the playlist name in display caps, the cover print and the red PLAY sticker; Spotify's own player is laid over the white print below ("listen here" and the pink arrow point at it). Scrolled away or on another page, the player docks and keeps playing: a yellow strip with a 3px ink border along the bottom of the screen (the red RADIO bar leads it from 1000px), with Open in Spotify and a stop. The page keeps room for it at its end; on a phone's product page it rides above the buy bar. Spotify's player keeps its own design, in its dark version (near-black whatever the playlist's cover); it is never restyled or hidden while it plays. Without a link: one coverline strip, no PLAY.

### Motion
Controls 120 to 220ms on ease-out (fast 120ms, base 160ms, slap 220ms). The flash: a white layer 0 to .85 to 0 opacity in 180ms over a photo when it first appears and on pointer hover or tap, at most once a second, with the shadow snapping out over 120ms. The sticker slap is the only overshoot: scale 1.25 to 1, from -10 degrees to rest, 220ms on cubic-bezier(.3, 1.6, .5, 1). Nothing loops.

## Do's and Don'ts

### Do:
- **Do** fill each section with one ink, edge to edge, and switch inks from section to section.
- **Do** set every shouting line in League Gothic caps at line-height .8 to .9, sized to the space, with no text colliding at 375, 768, 1024, 1280x720 or 1440.
- **Do** keep every buying control full banner red (#E10600) and let its words carry the state.
- **Do** put a slightly blurred offset flash shadow behind photos and cut-outs (11 to 15px offset).
- **Do** use the tilted white-bordered print for campaign photos only; show product shots as cut-outs or straight on yellow, black or white.
- **Do** give every effect a still version under reduced motion and animate only transform and opacity.
- **Do** theme every browser surface: pink selection, red caret, ink and newsprint scrollbar, ink or yellow focus ring, tabular price numerals.

### Don't:
- **Don't** round corners; cut, notch or tear edges instead.
- **Don't** use news tickers, marquees, infinite loops, smooth-scroll or scroll-jacking libraries, glow, gradient text, blur filters, or anything page-tall that repaints on scroll.
- **Don't** put a zero-blur offset block shadow behind a photo or card.
- **Don't** stamp a missing fact: what the brand has not given is left out, and UNCONFIRMED is only for the next drop, once per page.
- **Don't** use the pink script on more than one page head in three, or let it cross a title's letters.
- **Don't** set any text below 10.5px.
- **Don't** show a product shot that sits on its studio gradient over another gradient field.
