// The playlist player. Nothing from Spotify loads until the visitor presses play: then
// Spotify's own player (an iframe, its design) is set into the print, and our PLAY sticker
// drives it through Spotify's iFrame API. Visitors not logged into Spotify in this browser
// (most, inside Instagram) hear 30-second previews; the honest line under it says so.

import { flash, slap } from './motion';

interface Controller {
  togglePlay(): void;
  play(): void;
  addListener(event: 'playback_update', cb: (e: { data: { isPaused: boolean; position: number; duration: number } }) => void): void;
}
interface IFrameAPI {
  createController(el: HTMLElement, options: { uri: string; width: string; height: number }, cb: (c: Controller) => void): void;
}
declare global {
  interface Window { onSpotifyIframeApiReady?: (api: IFrameAPI) => void }
}

let apiPromise: Promise<IFrameAPI> | null = null;
function loadApi(): Promise<IFrameAPI> {
  apiPromise ??= new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    s.onerror = () => reject(new Error('Spotify did not load'));
    document.head.appendChild(s);
  });
  return apiPromise;
}

/** "https://open.spotify.com/playlist/ID?si=..." to "spotify:playlist:ID". */
const toUri = (url: string) => {
  const m = url.match(/open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/);
  return m ? `spotify:${m[1]}:${m[2]}` : url;
};

export function initPlayers() {
  document.querySelectorAll<HTMLElement>('[data-player]').forEach((pl) => {
    const btn = pl.querySelector<HTMLButtonElement>('[data-play]');
    const label = pl.querySelector<HTMLElement>('[data-play-label]');
    const slot = pl.querySelector<HTMLElement>('[data-slot]');
    const mount = pl.querySelector<HTMLElement>('[data-mount]');
    const now = pl.querySelector<HTMLElement>('[data-now]');
    const err = pl.querySelector<HTMLElement>('[data-error]');
    const url = pl.dataset.spotify;
    const name = pl.dataset.name ?? 'the playlist';
    if (!btn || !slot || !mount || !url) return;

    let controller: Controller | null = null;
    let loading = false;
    const set = (playing: boolean) => {
      pl.classList.toggle('is-playing', playing);
      btn.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${name}`);
      if (label) label.textContent = playing ? 'Pause' : 'Play';
      if (now) now.textContent = playing ? `Now playing: ${name}` : `Paused: ${name}`;
    };

    btn.addEventListener('click', async () => {
      slap(btn);
      if (controller) { controller.togglePlay(); return; }
      if (loading) return;
      loading = true;
      slot.hidden = false;
      if (now) now.textContent = 'Loading Spotify…';
      flash(slot.querySelector('.ph'));
      try {
        const api = await loadApi();
        api.createController(mount, { uri: toUri(url), width: '100%', height: 152 }, (c) => {
          controller = c;
          c.addListener('playback_update', (e) => set(!e.data.isPaused));
          c.play();
        });
      } catch {
        if (err) err.hidden = false;
        if (now) now.textContent = '';
      }
    });
  });
}
