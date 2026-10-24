// Price and stock in the page are as fresh as the last build. This refreshes them from Shopify
// after the page loads, so a size that sold out an hour ago is struck through, not sold twice.
// Shopify's public product data answers any origin (Access-Control-Allow-Origin: *).

import { formatPrice } from '../lib/money';

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
      box.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach((stamp) => {
        const v = data.variants.find((x) => x.id === Number(stamp.dataset.variant));
        const out = !v || !v.available;
        stamp.setAttribute('aria-disabled', String(out));
        stamp.title = out ? 'Sold out' : '';
        const label = stamp.querySelector('.vh');
        if (label) label.textContent = out ? ', sold out' : '';
      });
      box.toggleAttribute('data-soldout', !data.available);
    });
  });
}
