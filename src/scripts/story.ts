// SPOTTED!, the pinned scroll story. One passive scroll listener; inside requestAnimationFrame
// it reads where the track is and writes, per scene, how far it has come in, held, and gone out.
// Every stretch is measured in screens of scroll so the motion keeps pace with the finger:
// - --e, coming in: one screen. Its ground rises exactly as fast as the page scrolls.
// - --h, the hold: --hold of a screen (the opening card: --hold0). A piece with a back turns here.
// - --x, going out: the next scene's coming in, so one screen while the next ground covers it.
// - --p: 0 before it starts, 1 once it is covered, .5 between (CSS draws only scenes in between).
// CSS turns these into every transform, linearly, so nothing runs ahead of the scroll or keeps
// moving after it stops. With reduced motion there is no listener and no pin: the scenes stand
// still, one after another. The listener leaves with the page (signal, scripts/page.ts).

import { flash, reduceMotion, slap } from './motion';
import { buy } from '../content/copy/common';

export function initStory(signal: AbortSignal) {
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
    const ss = track.closest<HTMLElement>('.ss')!;
    const n = scenes.length;
    const css = getComputedStyle(ss);
    const hold = parseFloat(css.getPropertyValue('--hold')) || 0.35;
    const hold0 = parseFloat(css.getPropertyValue('--hold0')) || 0.35;
    // the track, in screens: the opening hold, each later scene's coming in and hold, and the
    // screen the stage itself fills (the same sum as the track's height in Story.astro)
    const total = hold0 + (n - 1) * (1 + hold) + 1;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const round = (v: number) => Math.round(v * 1000) / 1000;
    const last = scenes.map(() => '');
    let queued = false;
    const frame = () => {
      queued = false;
      const r = track.getBoundingClientRect();
      const layoutH = track.offsetHeight;
      if (!layoutH) return;
      const screen = layoutH / total;
      const scale = r.height / layoutH;
      // u: how many screens of the track have scrolled past its top
      const u = Math.max(0, Math.min(total - 1, -r.top / scale / screen));
      scenes.forEach((scene, i) => {
        const start = i === 0 ? -Infinity : hold0 + (i - 1) * (1 + hold);
        const held = i === 0 ? 0 : start + 1;
        const out = i === 0 ? hold0 : held + hold;
        const e = i === 0 ? 1 : round(clamp(u - start));
        const h = round(clamp((u - held) / (i === 0 ? hold0 : hold)));
        const x = i === n - 1 ? 0 : round(clamp(u - out));
        const p = e === 0 ? 0 : x === 1 ? 1 : 0.5;
        const key = `${e} ${h} ${x}`;
        if (key === last[i]) return;
        const was = last[i] ? Number(last[i].split(' ')[0]) : NaN;
        last[i] = key;
        scene.style.setProperty('--e', String(e));
        scene.style.setProperty('--h', String(h));
        scene.style.setProperty('--x', String(x));
        scene.style.setProperty('--p', String(p));
        // the flash fires as the piece lands
        if (i > 0 && was < 0.85 && e >= 0.85) flash(scene.querySelector('.ss-prod'));
        if (i === buyIndex && (e < 1 || x > 0)) closeSizes();
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
    window.addEventListener('scroll', queue, { passive: true, signal });
    window.addEventListener('resize', queue, { passive: true, signal });
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
