// Pages change without a reload (Astro's ClientRouter, Base.astro), so the radio keeps playing
// from page to page. A script therefore cannot run once and be done: whatever binds to the page
// goes through onPage(), which runs it now and again after every page change. Its signal aborts
// just before the page is swapped out: listeners on window or document take { signal }, and
// observers and timers stop on its "abort" event. Listeners on the page's own elements need
// nothing, they leave with the elements.

let page = new AbortController();
document.addEventListener('astro:before-swap', () => {
  page.abort();
  page = new AbortController();
});

export function onPage(name: string, init: (signal: AbortSignal) => void) {
  let ranFor: AbortSignal | null = null;
  const run = () => {
    // once per page: a script first loaded by a page change runs at once, then hears that same
    // change's page-load event
    if (ranFor === page.signal) return;
    ranFor = page.signal;
    try { init(page.signal); } catch (err) { console.error(`[${name}]`, err); }
  };
  run();
  document.addEventListener('astro:page-load', run);
}
