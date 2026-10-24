// LIFE'S ODDITY RADIO. The playlist boxes exist only once an act has a Spotify link (without
// one, Player.astro prints a coverline strip and nothing here runs). Nothing from Spotify loads
// until the visitor presses PLAY: then Spotify's own player (an iframe, its design, in its dark
// version: near-black whatever the playlist's cover) is made once, inside the docked radio
// (layout/Radio.astro), which stays put while pages change, and our PLAY sticker drives it
// through Spotify's iFrame API.
//
// Where the player shows:
// - "ready": the visitor has scrolled and nothing plays yet. The strip along the bottom offers
//   the soundtrack (layout/Radio.astro) with PLAY. Browsers allow sound only after a tap, so it
//   waits for one; Spotify is not loaded until then.
// - "box": the box it was played from is on screen. The radio is laid over that box's print,
//   placed in the page (not on the screen), so it scrolls with it at no cost.
// - "dock": that box has scrolled away, or the visitor went to another page. A strip along the
//   bottom, with Open in Spotify and a stop.
// - "off": before the first scroll, or put away with the ✕ (for the rest of the visit).
// Visitors not logged into Spotify in this browser (most, inside Instagram) hear 30-second
// previews; the honest line under the box says so, and Open in Spotify has the full songs.

import { flash, reduceMotion, slap } from './motion';
import { player } from '../content/copy/common';

interface Controller {
  play(): void;
  pause(): void;
  resume(): void;
  loadEntity(url: string): void;
  addListener(event: 'playback_update', cb: (e: { data: { isPaused: boolean; playingURI: string } }) => void): void;
}
interface IFrameAPI {
  createController(el: HTMLElement, options: { url: string; width: string; height: number }, cb: (c: Controller) => void): void;
}
declare global {
  interface Window { onSpotifyIframeApiReady?: (api: IFrameAPI) => void }
}

/** Spotify's compact player, the height it is docked at. */
const DOCK_H = 80;

let apiPromise: Promise<IFrameAPI> | null = null;
function loadApi(): Promise<IFrameAPI> {
  apiPromise ??= new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    s.onerror = () => { apiPromise = null; reject(new Error('Spotify did not load')); };
    document.head.appendChild(s);
  });
  return apiPromise;
}

/** The link without its sharing tags, asking for Spotify's dark player (theme=0). */
const dark = (url: string) => {
  const u = new URL(url);
  u.search = '';
  u.searchParams.set('theme', '0');
  return u.href;
};

type Mode = 'off' | 'ready' | 'box' | 'dock';
const strip = (m: string | undefined) => m === 'ready' || m === 'dock';

const radio = document.querySelector<HTMLElement>('[data-radio]');
const frame = radio?.querySelector<HTMLElement>('.radio-frame') ?? null;
const openLink = radio?.querySelector<HTMLAnchorElement>('[data-radio-open]') ?? null;
const stopBtn = radio?.querySelector<HTMLButtonElement>('[data-radio-stop]') ?? null;
const playBtn = radio?.querySelector<HTMLButtonElement>('[data-radio-play]') ?? null;
/** What the strip offers before anything plays: the home page's soundtrack (acts.ts radioAct). */
const offer = radio?.dataset.url ? { url: radio.dataset.url, name: radio.dataset.name ?? player.name('') } : null;
const AWAY = 'lo-radio-away';

let controller: Controller | null = null;
let making: Promise<Controller> | null = null;
/** What is loaded in Spotify's player: the box's link and its spoken name. */
let current: { url: string; name: string } | null = null;
let on = false;
let paused = true;
/** The strip has come up (first scroll), or was put away for this visit. */
let revealed = false;
let away = (() => { try { return sessionStorage.getItem(AWAY) === '1'; } catch { return false; } })();
/** The print of this page's box for the loaded playlist, and whether it is on screen. */
let anchor: HTMLElement | null = null;
let anchorSeen = false;
let watch: IntersectionObserver | null = null;

const boxes = () => [...document.querySelectorAll<HTMLElement>('[data-player]')];
const boxFor = (url: string) => boxes().find((b) => b.dataset.spotify === url) ?? null;

/** Every box on the page says what the radio is doing. */
function sync() {
  for (const box of boxes()) {
    const mine = on && current?.url === box.dataset.spotify;
    const playing = mine && !paused;
    const name = box.dataset.name ?? player.name('');
    box.classList.toggle('is-playing', playing);
    const btn = box.querySelector<HTMLButtonElement>('[data-play]');
    btn?.setAttribute('aria-label', playing ? player.pauseName(name) : player.playName(name));
    const label = box.querySelector<HTMLElement>('[data-play-label]');
    if (label) label.textContent = playing ? player.pause : player.play;
    const now = box.querySelector<HTMLElement>('[data-now]');
    if (now && mine && controller) now.textContent = playing ? player.playing(name) : player.paused(name);
    else if (now && !mine) now.textContent = '';
    // the white print stays open only under the radio
    const slot = box.querySelector<HTMLElement>('[data-slot]');
    if (slot && !(on && anchor && box.contains(anchor))) slot.hidden = true;
  }
}

/** Lay the radio exactly over the box's print, in page coordinates. */
function place() {
  if (!radio || !anchor) return;
  const r = anchor.getBoundingClientRect();
  radio.style.width = `${r.width}px`;
  radio.style.translate = `${r.left + scrollX}px ${r.top + scrollY}px`;
  radio.style.setProperty('--frame-h', `${r.height}px`);
}

function setMode() {
  if (!radio) return;
  const was = radio.dataset.mode as Mode;
  const mode: Mode = on ? (anchor && anchorSeen ? 'box' : 'dock') : revealed && offer && !away ? 'ready' : 'off';
  radio.dataset.mode = mode;
  radio.hidden = mode === 'off';
  stopBtn?.setAttribute('aria-label', mode === 'ready' ? player.close : player.stop);
  if (mode === 'box') {
    place();
  } else {
    radio.style.removeProperty('width');
    radio.style.removeProperty('translate');
    radio.style.removeProperty('--frame-h');
  }
  // the strip along the bottom: the page keeps that much room at its end, so nothing stays hidden
  document.documentElement.style.setProperty('--radio-b', strip(mode) ? `${radio.offsetHeight}px` : '0px');
  if (strip(mode) && !strip(was) && !reduceMotion()) {
    radio.animate(
      [{ transform: 'translateY(100%)' }, { transform: 'none' }],
      { duration: 160, easing: 'cubic-bezier(.2, .7, .2, 1)' },
    );
  }
  // PLAY slaps on once as the strip comes up
  if (mode === 'ready' && was !== 'ready') window.setTimeout(() => slap(playBtn), 120);
}

/** This page's box for the loaded playlist holds the radio while it is on screen. */
function attach(box: HTMLElement | null) {
  watch?.disconnect();
  watch = null;
  anchor = box?.querySelector<HTMLElement>('[data-anchor]') ?? null;
  anchorSeen = false;
  const slot = box?.querySelector<HTMLElement>('[data-slot]');
  if (slot) slot.hidden = false;
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    anchorSeen = rect.bottom > 0 && rect.top < innerHeight;
    // the masthead covers the top of the screen: the print is gone once it slides under it
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    watch = new IntersectionObserver(([e]) => {
      anchorSeen = e.isIntersecting;
      setMode();
    }, { rootMargin: `-${head}px 0px 0px 0px` });
    watch.observe(anchor);
  }
  setMode();
}

function make(url: string): Promise<Controller> {
  making ??= loadApi().then((api) => new Promise<Controller>((resolve) => {
    const mount = radio!.querySelector<HTMLElement>('[data-radio-mount]')!;
    api.createController(mount, { url: dark(url), width: '100%', height: DOCK_H }, (c) => {
      c.addListener('playback_update', (e) => {
        paused = e.data.isPaused;
        sync();
      });
      resolve(c);
    });
  }));
  making.catch(() => { making = null; });
  return making;
}

/** Play a playlist; this page's box for it, when there is one, holds the radio while on screen. */
async function start(url: string, name: string, box: HTMLElement | null) {
  if (!radio) return;
  const fresh = !controller;
  on = true;
  attach(box);
  const now = box?.querySelector<HTMLElement>('[data-now]') ?? null;
  if (fresh && now) now.textContent = player.loading;
  if (box) flash(box.querySelector('[data-slot] .ph'));
  try {
    const c = controller ?? (controller = await make(url));
    if (current?.url !== url) {
      // another playlist: load it and play it from the top
      if (!fresh) c.loadEntity(dark(url));
      current = { url, name };
      if (openLink) {
        openLink.href = url;
        openLink.setAttribute('aria-label', `${player.open}: ${name}`);
      }
      c.play();
    } else {
      // the same one, stopped earlier: carry on where it stopped
      c.resume();
    }
    sync();
  } catch {
    on = false;
    setMode();
    const err = box?.querySelector<HTMLElement>('[data-error]');
    if (err) err.hidden = false;
    if (now) now.textContent = '';
  }
}

/** The ✕: the music stops and the radio goes away for the rest of the visit (a box's PLAY still works). */
function stop() {
  controller?.pause();
  on = false;
  away = true;
  try { sessionStorage.setItem(AWAY, '1'); } catch { /* storage blocked: away for this page's life */ }
  watch?.disconnect();
  watch = null;
  anchor = null;
  setMode();
  for (const box of boxes()) {
    const slot = box.querySelector<HTMLElement>('[data-slot]');
    if (slot) slot.hidden = true;
  }
  sync();
}

// once per visit: the radio itself, which outlives every page
if (radio && frame) {
  stopBtn?.addEventListener('click', stop);
  playBtn?.addEventListener('click', () => {
    slap(playBtn);
    if (offer) start(offer.url, offer.name, boxFor(offer.url));
  });
  // the strip comes up as soon as the visitor scrolls
  if (offer && !away) {
    const reveal = () => {
      if (scrollY < 12) return;
      revealed = true;
      removeEventListener('scroll', reveal);
      if (!on) setMode();
    };
    addEventListener('scroll', reveal, { passive: true });
  }
  // the box moved (a picture above it loaded, the window changed): follow it
  const follow = () => { if (radio.dataset.mode === 'box') place(); else if (strip(radio.dataset.mode)) setMode(); };
  addEventListener('resize', follow, { passive: true });
  new ResizeObserver(follow).observe(document.body);
}

/** Each page: its boxes play, pause and switch; a box of the playing playlist takes the radio. */
export function initPlayers(signal: AbortSignal) {
  for (const box of boxes()) {
    const btn = box.querySelector<HTMLButtonElement>('[data-play]');
    btn?.addEventListener('click', () => {
      slap(btn);
      const mine = current?.url === box.dataset.spotify;
      if (!on || !mine || !controller) { start(box.dataset.spotify ?? '', box.dataset.name ?? player.name(''), box); return; }
      if (paused) controller.resume(); else controller.pause();
    });
  }
  // the cover's PRESS PLAY coverline jumps to the soundtrack and starts it
  document.querySelectorAll<HTMLAnchorElement>('[data-press-play]').forEach((link) => {
    link.addEventListener('click', () => {
      const box = document.querySelector<HTMLElement>(`${link.hash} [data-player]`);
      // after the jump, so the radio opens in the box, not docked first
      if (box && !(on && current?.url === box.dataset.spotify && !paused)) requestAnimationFrame(() => start(box.dataset.spotify ?? '', box.dataset.name ?? player.name(''), box));
    });
  });

  if (on && current) attach(boxFor(current.url));
  else setMode();
  sync();
  // the page is about to go: its box goes with it, and the radio docks
  signal.addEventListener('abort', () => {
    watch?.disconnect();
    watch = null;
    anchor = null;
    setMode();
  });
}
