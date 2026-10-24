// Buy controls: any element with data-buy holds a product's size stamps and an ADD TO BAG
// button. The button stays disabled until a size is chosen; adding opens nothing, it stamps
// ADDED! on the bag in the header and says what went in. After an add, the box's button reads
// CHECKOUT · BAG (n) and opens the bag, until another size is picked.

import { addToBag, bagCount } from './bag';
import { bag } from '../content/copy/common';

export function initBuy(root: ParentNode = document) {
  const announcer = document.querySelector<HTMLElement>('[data-announce]');
  const variantParam = new URLSearchParams(location.search).get('variant');

  root.querySelectorAll<HTMLElement>('[data-buy]').forEach((box) => {
    const btn = box.querySelector<HTMLButtonElement>('[data-add]');
    const label = btn?.querySelector<HTMLElement>('span') ?? null;
    const addLabel = label?.textContent ?? '';
    const note = box.querySelector<HTMLElement>('[data-note]');
    const stamps = [...box.querySelectorAll<HTMLButtonElement>('[data-variant]')];
    const quick = box.hasAttribute('data-quick');
    let chosen: HTMLButtonElement | null = null;

    const add = (stamp: HTMLButtonElement) => {
      addToBag({
        v: Number(stamp.dataset.variant),
        h: box.dataset.handle ?? '',
        t: box.dataset.title ?? '',
        s: stamp.dataset.size ?? '',
        p: Number(stamp.dataset.price ?? box.dataset.price ?? 0),
        i: box.dataset.image ?? '',
      });
      if (note) note.textContent = `In your bag: ${box.dataset.title}, size ${stamp.dataset.size}.`;
    };

    /** Back to ADD TO BAG: another size was picked. */
    const reset = () => {
      if (!btn || btn.dataset.state !== 'added') return;
      delete btn.dataset.state;
      if (label) label.textContent = addLabel;
    };

    const choose = (stamp: HTMLButtonElement) => {
      reset();
      stamps.forEach((s) => s.setAttribute('aria-pressed', String(s === stamp)));
      chosen = stamp;
      if (btn) btn.disabled = false;
      if (note) note.textContent = `Size ${stamp.dataset.size}. Add it to your bag.`;
    };

    stamps.forEach((stamp) => {
      stamp.addEventListener('click', () => {
        if (stamp.getAttribute('aria-disabled') === 'true') return;
        if (quick) {
          add(stamp);
          box.dispatchEvent(new CustomEvent('lo:added', { bubbles: true, detail: { title: box.dataset.title, size: stamp.dataset.size } }));
          // the visible notes of quick boxes appear only now; one persistent region says it
          if (announcer) {
            announcer.textContent = '';
            requestAnimationFrame(() => { announcer.textContent = `In your bag: ${box.dataset.title}, size ${stamp.dataset.size}.`; });
          }
          return;
        }
        choose(stamp);
      });
    });

    if (quick || !btn) return;

    btn.addEventListener('click', () => {
      if (btn.dataset.state === 'added') {
        document.dispatchEvent(new CustomEvent('lo:open-bag'));
        return;
      }
      if (!chosen || chosen.getAttribute('aria-disabled') === 'true') return;
      add(chosen);
      btn.dataset.state = 'added';
      if (label) label.textContent = bag.goCheckout(bagCount());
    });

    document.addEventListener('lo:bag', () => {
      if (btn.dataset.state !== 'added') return;
      const n = bagCount();
      if (n === 0) reset(); // the bag was emptied: nothing to check out
      else if (label) label.textContent = bag.goCheckout(n);
    });

    // Shopify's variant links (?variant=<id>) arrive with that size chosen
    if (variantParam) {
      const linked = stamps.find((s) => s.dataset.variant === variantParam);
      if (linked && linked.getAttribute('aria-disabled') !== 'true') choose(linked);
    }
  });
}
