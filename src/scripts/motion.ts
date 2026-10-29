// The magazine's motions: the flash, the shadow snap, the sticker slap and the nudge. Transform
// and opacity only, never looping, none at all when the visitor asks for reduced motion.

export const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastFlash = 0;

/** The on-camera flash: a white layer 0 to .85 to 0 in 180 ms over a photo, at most once a second. */
export function flash(ph: Element | null) {
  if (!ph || reduceMotion()) return;
  const now = Date.now();
  if (now - lastFlash < 1000) return;
  lastFlash = now;
  const layer = ph.querySelector<HTMLElement>('.ph-flash');
  layer?.animate(
    [{ opacity: 0, easing: 'linear' }, { opacity: 0.85, offset: 0.3, easing: 'ease-out' }, { opacity: 0 }],
    { duration: 180 },
  );
  snap(ph.querySelector('.ph-sh'));
}

/** The flash shadow snaps out to its offset in 120 ms. */
export function snap(shadow: Element | null) {
  if (!shadow || reduceMotion()) return;
  (shadow as HTMLElement).animate([{ translate: '0px 0px', offset: 0 }], { duration: 120, easing: 'ease-out' });
}

/** A sticker slaps on: scale 1.25 to 1, from -10 degrees to its resting tilt. The only overshoot. */
export function slap(el: Element | null) {
  if (!el || reduceMotion()) return;
  (el as HTMLElement).animate(
    [{ scale: 1.25, rotate: '-10deg', opacity: 0, offset: 0 }],
    { duration: 220, easing: 'cubic-bezier(.3,1.6,.5,1)' },
  );
}

/** A short sideways nudge (160 ms) that points at a row: PICK A SIZE nudges the size stamps. */
export function nudge(el: Element | null) {
  if (!el || reduceMotion()) return;
  (el as HTMLElement).animate(
    [
      { translate: '0px 0px' },
      { translate: '-7px 0px', offset: 0.25 },
      { translate: '6px 0px', offset: 0.55 },
      { translate: '-2px 0px', offset: 0.82 },
      { translate: '0px 0px' },
    ],
    { duration: 160, easing: 'ease-out' },
  );
}

/** Photos flash when they first appear, when the pointer arrives (mouse) or on touch. */
export function bindFlash(signal: AbortSignal, root: ParentNode = document) {
  const prints = [...root.querySelectorAll<HTMLElement>('.ph[data-flash]')];
  prints.forEach((ph) => {
    snap(ph.querySelector('.ph-sh'));
    ph.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') flash(ph); });
    ph.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') flash(ph); });
  });
  // the first time each print scrolls in; flash()'s once-a-second rule keeps a row from strobing
  if (!reduceMotion() && typeof IntersectionObserver === 'function') {
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        flash(entry.target);
        seen.unobserve(entry.target);
      }
    }, { threshold: 0.45 });
    prints.filter((ph) => !ph.hasAttribute('data-flash-first')).forEach((ph) => seen.observe(ph));
    signal.addEventListener('abort', () => seen.disconnect());
  }
  const hero = root.querySelector('.ph[data-flash-first]');
  if (hero) {
    const img = hero.querySelector('img');
    const fire = () => requestAnimationFrame(() => flash(hero));
    if (!img || img.complete) fire();
    else img.addEventListener('load', fire, { once: true });
  }
}
