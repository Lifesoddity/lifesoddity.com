// LIFE'S ODDITY RADIO. The playlist boxes exist only once an act has a Spotify link (without
// one, Player.astro prints a coverline strip and nothing here runs). Nothing from Spotify loads
// until the visitor presses PLAY: then Spotify's own player (an iframe, its design) is made once,
// inside the docked radio (layout/Radio.astro), which stays put while pages change, and our PLAY
// sticker drives it through Spotify's iFrame API.
//
// Where the player shows:
// - "box": the box it was played from is on screen. The radio is laid over that box's print,
//   placed in the page (not on the screen), so it scrolls with it at no cost.
// - "dock": that box has scrolled away, or the visitor went to another page. A strip under the
//   masthead (phones) or along the bottom (wider), with Open in Spotify and a stop.
// - "off": never played, or stopped.
// Visitors not logged into Spotify in this browser (most, inside Instagram) hear 30-second
// previews; the honest line under the box says so, and Open in Spotify has the full songs.

import { flash, reduceMotion, slap } from './motion';
import { player } from '../content/copy/common';

interface Controller {
  play(): void;
  pause(): void;
  resume(): void;
  loadUri(uri: string): void;
  addListener(event: 'playback_update', cb: (e: { data: { isPaused: boolean; playingURI: string } }) => void): void;
}
interface IFrameAPI {
  createController(el: HTMLElement, options: { uri: string; width: string; height: number }, cb: (c: Controller) => void): void;
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

/** "https://open.spotify.com/playlist/ID?si=..." to "spotify:playlist:ID". */
const toUri = (url: string) => {
  const m = url.match(/open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/);
  return m ? `spotify:${m[1]}:${m[2]}` : url;
};

type Mode = 'off' | 'box' | 'dock';

const radio = document.querySelector<HTMLElement>('[data-radio]');
const frame = radio?.querySelector<HTMLElement>('.radio-frame') ?? null;
const openLink = radio?.querySelector<HTMLAnchorElement>('[data-radio-open]') ?? null;

let controller: Controller | null = null;
let making: Promise<Controller> | null = null;
/** What is loaded in Spotify's player: the box's link and its spoken name. */
let current: { url: string; name: string } | null = null;
let on = false;
let paused = true;
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
  const mode: Mode = !on ? 'off' : anchor && anchorSeen ? 'box' : 'dock';
  radio.dataset.mode = mode;
  radio.hidden = mode === 'off';
  if (mode === 'box') {
    place();
  } else {
    radio.style.removeProperty('width');
    radio.style.removeProperty('translate');
    radio.style.removeProperty('--frame-h');
  }
  // docked on a phone, the strip hangs from the masthead and anchor jumps land below it; on
  // wider screens it runs along the bottom and the page keeps that much room at its end
  const root = document.documentElement.style;
  const phone = matchMedia('(max-width: 699px)').matches;
  const docked = mode === 'dock';
  if (docked && phone) root.setProperty('--radio-top', `${document.querySelector<HTMLElement>('.mast')?.offsetHeight ?? 0}px`);
  root.setProperty('--radio-h', docked && phone ? `${radio.offsetHeight}px` : '0px');
  root.setProperty('--radio-b', docked && !phone ? `${radio.offsetHeight}px` : '0px');
  if (docked && was !== 'dock' && !reduceMotion()) {
    radio.animate(
      [{ transform: `translateY(${phone ? '-100%' : '100%'})` }, { transform: 'none' }],
      { duration: 160, easing: 'cubic-bezier(.2, .7, .2, 1)' },
    );
  }
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
    api.createController(mount, { uri: toUri(url), width: '100%', height: DOCK_H }, (c) => {
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

async function start(box: HTMLElement) {
  const url = box.dataset.spotify;
  if (!url || !radio) return;
  const name = box.dataset.name ?? player.name('');
  const fresh = !controller;
  on = true;
  attach(box);
  const now = box.querySelector<HTMLElement>('[data-now]');
  if (fresh && now) now.textContent = player.loading;
  flash(box.querySelector('[data-slot] .ph'));
  try {
    const c = controller ?? (controller = await make(url));
    if (current?.url !== url) {
      // another playlist: load it and play it from the top
      if (!fresh) c.loadUri(toUri(url));
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
    const err = box.querySelector<HTMLElement>('[data-error]');
    if (err) err.hidden = false;
    if (now) now.textContent = '';
  }
}

function stop() {
  controller?.pause();
  on = false;
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
  radio.querySelector('[data-radio-stop]')?.addEventListener('click', stop);
  // the box moved (a picture above it loaded, the window changed): follow it
  const follow = () => { if (radio.dataset.mode === 'box') place(); else if (radio.dataset.mode === 'dock') setMode(); };
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
      if (!on || !mine || !controller) { start(box); return; }
      if (paused) controller.resume(); else controller.pause();
    });
  }
  // the cover's PRESS PLAY coverline jumps to the soundtrack and starts it
  document.querySelectorAll<HTMLAnchorElement>('[data-press-play]').forEach((link) => {
    link.addEventListener('click', () => {
      const box = document.querySelector<HTMLElement>(`${link.hash} [data-player]`);
      // after the jump, so the radio opens in the box, not docked first
      if (box && !(on && current?.url === box.dataset.spotify && !paused)) requestAnimationFrame(() => start(box));
    });
  });

  if (on && current) attach(boxFor(current.url));
  sync();
  // the page is about to go: its box goes with it, and the radio docks
  signal.addEventListener('abort', () => {
    watch?.disconnect();
    watch = null;
    anchor = null;
    setMode();
  });
}
