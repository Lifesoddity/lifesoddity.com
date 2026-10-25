// The pen marks (the circles and arrows drawn on photos, .mark) draw themselves: CSS slides a dash
// along each line with the scroll (global.css). The home page is left out (the owner's call): its
// marks simply show, drawn, and nothing pink moves there. The marks keep one pen width at any size (vector-effect: non-scaling-stroke), so the browser lays
// that dash out on screen, not along the drawing: each line's length as drawn is measured here,
// in px, and handed over as --len (data-inked says it is there). Without this the marks simply
// show, fully drawn.

import { reduceMotion } from './motion';

/** The home page (the only one with the scroll story) keeps its own motion. */
const onHome = () => document.querySelector('.ss') !== null;

/** A line's length as drawn on screen: points along it, through its transforms, added up. */
function drawnLength(path: SVGPathElement): number {
  const ctm = path.getScreenCTM();
  const total = path.getTotalLength();
  if (!ctm || !total) return 0;
  // the most one unit of the drawing can stretch to on screen: a longer hop between two samples
  // is the pen lifting between strokes (an arrow's head), not ink
  const reach = Math.max(Math.hypot(ctm.a, ctm.b), Math.hypot(ctm.c, ctm.d));
  const n = 120;
  const step = total / n;
  let len = 0;
  let prev: DOMPoint | null = null;
  for (let i = 0; i <= n; i++) {
    const q = path.getPointAtLength(Math.min(total, i * step)).matrixTransform(ctm);
    if (prev) {
      const d = Math.hypot(q.x - prev.x, q.y - prev.y);
      if (d <= step * reach * 1.5) len += d;
    }
    prev = q;
  }
  return len;
}

export function inkMarks(signal: AbortSignal) {
  if (onHome()) return;
  const marks = [...document.querySelectorAll<SVGSVGElement>('svg.mark')];
  if (!marks.length) return;
  const measure = (svg: SVGSVGElement) => {
    svg.querySelectorAll('path').forEach((p) => {
      const len = drawnLength(p);
      if (!len) return;
      p.style.setProperty('--len', `${len.toFixed(1)}px`);
      p.setAttribute('data-inked', '');
    });
  };
  // again whenever a photo changes size (the window, a phone turning)
  const ro = new ResizeObserver((entries) => entries.forEach((e) => measure(e.target as SVGSVGElement)));
  marks.forEach((svg) => { measure(svg); ro.observe(svg); });
  signal.addEventListener('abort', () => ro.disconnect());
}

// The pink on a page's first screen: everything pink draws itself as it comes up the screen
// (global.css), but what is already on screen when a page opens has nothing left to scroll
// through, so it does it once here as the page loads, top to bottom. It stays drawn after.
type Intro = { sel: string; name: string; frames: Keyframe[] | ((el: Element) => Keyframe[]); duration?: number; easing?: string; pseudo?: string };
const INTRO: Intro[] = [
  { sel: '.pc-tape, .nx-tag, .gl-tape, .is-tape, .lb-tape, .lp-tape, .cr-act-name', name: 'unroll', frames: [
    { clipPath: 'polygon(0 8%, 0 0, 0 5%, 0 0, 0 4%, 0 0, 0 52%, 0 100%, 0 95%, 0 100%, 0 94%, 0 100%, 0 50%)' },
    { clipPath: 'polygon(0 8%, 4% 0, 30% 5%, 62% 0, 96% 4%, 100% 0, 98% 52%, 100% 100%, 70% 95%, 38% 100%, 3% 94%, 0 100%, 2% 50%)' },
  ] },
  { sel: '.phead.tone-pink.t-slab .phead-ink, .phead-script, .act-vice, .ap-cap, .st-printed, .pl-here, .act-line, .lb-jump a', name: 'write', frames: [
    { clipPath: 'inset(-60% 100% -60% -25%)' }, { clipPath: 'inset(-60% -25% -60% -25%)' },
  ] },
  { sel: '.nx-q, .tl-q', name: 'draw-down', frames: [
    { clipPath: 'inset(-30% -60% 100% -60%)' }, { clipPath: 'inset(-30% -60% -30% -60%)' },
  ] },
  { sel: '.ln-q em', name: 'sweep', frames: [{ backgroundPosition: '100% 0' }, { backgroundPosition: '0 0' }] },
  { sel: '.buy-help a', name: 'underline', frames: [{ backgroundSize: '0% 2px' }, { backgroundSize: '100% 2px' }] },
  { sel: '.cr-at', name: 'spin-on', frames: [
    { rotate: '-320deg', scale: '.2', opacity: 0 }, { opacity: 1, offset: 0.3 }, { rotate: '0deg', scale: '1', opacity: 1 },
  ] },
  // the outline title's pink second pass lands: it comes in from up and to the left of its letters
  // and settles into its offset, like the second colour going through the press
  { sel: '.t-outline .phead-ink', name: 'pass', duration: 760, frames: (el) => {
    const cs = getComputedStyle(el);
    const em = parseFloat(cs.fontSize);
    const end = cs.textShadow;
    const start = end.replace(/(-?[\d.]+px) (-?[\d.]+px)/, `${-0.22 * em}px ${-0.14 * em}px`);
    return [{ textShadow: start }, { textShadow: end }];
  } },
  // the pen marks, a little slower
  { sel: '.mark path[data-inked]', name: 'ink', duration: 700, frames: (el) => {
    const len = (el as SVGPathElement).style.getPropertyValue('--len');
    return [{ strokeDashoffset: len }, { strokeDashoffset: '0px' }];
  } },
  // the pink quote marks slap on
  { sel: '.ln-q, .lb-quote', name: 'slap-on', pseudo: '::before', duration: 420, easing: 'ease-out', frames: [
    { transform: 'scale(2.4) rotate(-24deg)', opacity: 0 }, { transform: 'scale(.92) rotate(4deg)', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1 },
  ] },
];

export function inkIntro(signal: AbortSignal) {
  if (reduceMotion() || typeof Element.prototype.animate !== 'function' || onHome()) return;
  const run = () => {
    if (signal.aborted) return;
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    const due: { el: Element; top: number; it: Intro }[] = [];
    for (const it of INTRO) {
      document.querySelectorAll(it.sel).forEach((el) => {
        if (el.closest('.ss, [data-gate]')) return;
        const r = el.getBoundingClientRect();
        if (r.bottom <= head || r.top >= innerHeight || !r.width) return;
        // only what the scroll has already drawn in full: pink lower down still draws as it comes up
        const own = el.getAnimations({ subtree: true }).find((a) => a instanceof CSSAnimation && a.animationName === it.name);
        if (own && (own.effect?.getComputedTiming().progress ?? 1) < 0.999) return;
        due.push({ el, top: r.top + r.left / 4, it });
      });
    }
    due.sort((a, b) => a.top - b.top).forEach(({ el, it }, i) => {
      const frames = typeof it.frames === 'function' ? it.frames(el) : it.frames;
      try {
        el.animate(frames, { duration: it.duration ?? 620, delay: 200 + i * 140, easing: it.easing ?? 'cubic-bezier(.45, .05, .35, 1)', fill: 'both', pseudoElement: it.pseudo });
      } catch { /* a browser that cannot animate a ::before: it shows as it is */ }
    });
  };
  // on a first visit the pass is up: draw once it lifts, so nothing happens behind it
  if (document.documentElement.classList.contains('gate-on')) {
    document.addEventListener('lo:gate-lift', () => setTimeout(run, 420), { once: true, signal });
  } else {
    // two frames in, once the scroll timelines have a position
    requestAnimationFrame(() => requestAnimationFrame(run));
  }
}
