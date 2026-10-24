// Price and stock in the page are as fresh as the last build. This refreshes them from Shopify
// after the page loads, so a size that sold out an hour ago is struck through, not sold twice,
// and a price changed since the build is the one that goes into the bag.
// Shopify's public product data answers any origin (Access-Control-Allow-Origin: *).

import { formatPrice } from '../lib/money';
import { status } from '../content/copy/common';

interface LiveProduct {
  available: boolean;
  price: number;
  variants: { id: number; available: boolean; price: number }[];
}

export function initLive(domain: string) {
  const boxes = [...document.querySelectorAll<HTMLElement>('[data-live]')];
  const handles = [...new Set(boxes.map((b) => b.dataset.live!).filter(Boolean))];
  handles.forEach(async (handle) => {
    let data: LiveProduct;
    try {
      const res = await fetch(`https://${domain}/products/${handle}.js`, { headers: { Accept: 'application/json' } });
      if (!res.ok) return;
      data = await res.json();
    } catch {
      return; // offline or blocked: the built page stands
    }
    boxes.filter((b) => b.dataset.live === handle).forEach((box) => {
      box.querySelectorAll<HTMLElement>('[data-live-price]').forEach((el) => { el.textContent = formatPrice(data.price); });
      const add = box.querySelector<HTMLButtonElement>('[data-add]');
      const note = box.querySelector<HTMLElement>('[data-note]');
      box.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach((stamp) => {
        const v = data.variants.find((x) => x.id === Number(stamp.dataset.variant));
        if (v) stamp.dataset.price = String(v.price);
        const out = !v || !v.available;
        stamp.setAttribute('aria-disabled', String(out));
        stamp.title = out ? status.soldout : '';
        const label = stamp.querySelector('.vh');
        if (label) label.textContent = out ? `, ${status.soldout.toLowerCase()}` : '';
        // the size chosen before the refresh answered has just sold out: un-choose it
        if (out && stamp.getAttribute('aria-pressed') === 'true') {
          stamp.setAttribute('aria-pressed', 'false');
          if (add) add.disabled = true;
          if (note && note.dataset.noteInitial !== undefined) note.textContent = note.dataset.noteInitial;
        }
      });
      if (!data.available) {
        box.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((b) => {
          b.disabled = true;
          const span = b.querySelector('span');
          if (span) span.textContent = status.soldout;
        });
      }
      box.toggleAttribute('data-soldout', !data.available);
    });
  });
}
