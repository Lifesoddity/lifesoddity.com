// The site's own images and where each may appear. Product photos are NOT here: they load from
// Shopify's image CDN. These are his campaign photos (from his Instagram, 23 Oct 2026) and the
// cut-outs made from his product shots. Sources and dates: .bunshin/harvest/sources.json.
//
// file                                   subject                                    used on
// brand/logo-black.png                   the Life's Oddity wordmark                 every page (header, cover, footer)
// campaign/showtime-hoodie-back.jpg      Showtime hoodie, back, red patent trousers home story, shop, lookbook, drop
// campaign/showtime-hoodie-side.jpg      the hoodie worn open, concrete corner      lookbook
// campaign/spotlight-tee-front.jpg       Spotlight tee on a model, concrete wall    home story, shop, lookbook, drop
// campaign/spotlight-tee-closeup.jpg     Spotlight tee close-up                     lookbook
// campaign/she-devil-letter-roses.jpg    the love letter on rose petals             product page (She Devil), lookbook
// campaign/she-devil-letter.jpg          the handwritten letter                     product page (She Devil), lookbook
// campaign/party-animal-radio.jpg        Life's Oddity radio cover, Party Animal    player, about
// campaign/gluttony-reel-still.jpg       still from the Gluttony reel (640x360)     small use only: cover coverline
// campaign/party-animal-jacket-*.png     jacket product shots, red-to-blue ground   shop, lookbook, drop
// cutouts/she-devil-cutout.webp          the She Devil tee cut out                  cover, story
// cutouts/she-devil-shadow.webp          its flash shadow (blurred once)            cover, story
// cutouts/jacket-front|back-cutout.webp  the jacket cut out, front and back         story
// cutouts/jacket-shadow.webp             its flash shadow                           story
// cutouts/bust-shadow.webp               shadow of the WHO'S NEXT? silhouette       home, drop

import logo from './brand/logo-black.png';
import showtimeHoodieBack from './campaign/showtime-hoodie-back.jpg';
import showtimeHoodieSide from './campaign/showtime-hoodie-side.jpg';
import spotlightTeeFront from './campaign/spotlight-tee-front.jpg';
import spotlightTeeCloseup from './campaign/spotlight-tee-closeup.jpg';
import sheDevilLetterRoses from './campaign/she-devil-letter-roses.jpg';
import sheDevilLetter from './campaign/she-devil-letter.jpg';
import partyAnimalRadio from './campaign/party-animal-radio.jpg';
import gluttonyReelStill from './campaign/gluttony-reel-still.jpg';
import partyAnimalJacketFront from './campaign/party-animal-jacket-front.png';
import partyAnimalJacketBack from './campaign/party-animal-jacket-back.png';
import sheDevilCutout from './cutouts/she-devil-cutout.webp';
import sheDevilShadow from './cutouts/she-devil-shadow.webp';
import jacketFrontCutout from './cutouts/jacket-front-cutout.webp';
import jacketBackCutout from './cutouts/jacket-back-cutout.webp';
import jacketShadow from './cutouts/jacket-shadow.webp';
import bustShadow from './cutouts/bust-shadow.webp';

export const brand = { logo };

export const campaign = {
  showtimeHoodieBack,
  showtimeHoodieSide,
  spotlightTeeFront,
  spotlightTeeCloseup,
  sheDevilLetterRoses,
  sheDevilLetter,
  partyAnimalRadio,
  gluttonyReelStill,
  partyAnimalJacketFront,
  partyAnimalJacketBack,
};

export const cutouts = {
  sheDevil: sheDevilCutout,
  sheDevilShadow,
  jacketFront: jacketFrontCutout,
  jacketBack: jacketBackCutout,
  jacketShadow,
  bustShadow,
};
