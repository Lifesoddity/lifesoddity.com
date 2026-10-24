// SPOTTED!, the pinned scroll story. One passive scroll listener; inside requestAnimationFrame
// it reads the track's position and writes one number per scene, --p from 0 to 1 over its
// stretch of scroll. CSS turns that number into every transform. With reduced motion there is
// no listener and no pin: the scenes stand still, one after another.

import { flash, reduceMotion, slap } from './motion';
import { buy } from '../content/copy/common';

export function initStory() {
  const track = document.querySelector<HTMLElement>('.ss-track');
  const stage = track?.querySelector<HTMLElement>('.ss-stage');
  const scenes = track ? [...track.querySelectorAll<HTMLElement>('.ss-scene')] : [];
  const sizesBox = document.querySelector<HTMLElement>('.ss-sizes');
  const sizesBtn = document.querySelector<HTMLButtonElement>('.ss-badge-buy');
  const buyScene = sizesBtn?.closest('.ss-scene');
  const buyIndex = buyScene ? scenes.indexOf(buyScene as HTMLElement) : -1;

  const closeSizes = () => {
    if (sizesBox && !sizesBox.hidden) {
      sizesBox.hidden = true;
      sizesBtn?.setAttribute('aria-expanded', 'false');
    }
  };

  if (track && stage && scenes.length && !reduceMotion()) {
    // the pinned styles apply only once this runs (.ss.is-pinned): without script the scenes
    // stand as still panels instead of a blank, pinned stage
    track.closest('.ss')?.classList.add('is-pinned');
    const last = scenes.map(() => NaN);
    let queued = false;
    const gMax = scenes.length - 0.5;
    const frame = () => {
      queued = false;
      const r = track.getBoundingClientRect();
      const layoutH = track.offsetHeight;
      const sh = stage.offsetHeight;
      if (!layoutH || !sh) return;
      const scale = r.height / layoutH;
      const g = Math.max(0, Math.min(gMax, -r.top / scale / (1.5 * sh)));
      scenes.forEach((scene, i) => {
        const p = Math.round(Math.max(0, Math.min(1, (g - (i - 0.5)) / 1.5)) * 1000) / 1000;
        if (p === last[i]) return;
        const was = last[i];
        last[i] = p;
        scene.style.setProperty('--p', String(p));
        if (i > 0 && was < 0.32 && p >= 0.32) flash(scene.querySelector('.ss-prod'));
        if (i === buyIndex && (p < 0.3 || p > 0.7)) closeSizes();
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    queue();
  }

  if (sizesBtn && sizesBox) {
    sizesBtn.addEventListener('click', () => {
      const open = sizesBox.hidden;
      sizesBox.hidden = !open;
      sizesBtn.setAttribute('aria-expanded', String(open));
      if (open) sizesBox.querySelector<HTMLButtonElement>('[data-variant]:not([aria-disabled="true"])')?.focus();
    });
    sizesBox.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSizes(); sizesBtn.focus(); } });
    const note = document.querySelector<HTMLElement>('.ss-note');
    sizesBox.addEventListener('lo:added', (e) => {
      const { title, size } = (e as CustomEvent<{ title: string; size: string }>).detail;
      closeSizes();
      if (note) { note.textContent = buy.added(title, size); slap(note); }
      sizesBtn.focus();
    });
  }
}
