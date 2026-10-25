// The pen marks (the circles and arrows drawn on photos, .mark) draw themselves: CSS slides a dash
// along each line, with the scroll (global.css) or during a story scene's hold (Story.astro). The
// marks keep one pen width at any size (vector-effect: non-scaling-stroke), so the browser lays
// that dash out on screen, not along the drawing: each line's length as drawn is measured here,
// in px, and handed over as --len (data-inked says it is there). Without this the marks simply
// show, fully drawn.

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
