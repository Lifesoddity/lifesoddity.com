// Buy controls: any element with data-buy holds a product's size stamps and an ADD TO BAG
// button. The button stays disabled until a size is chosen; adding opens nothing, it stamps
// ADDED! on the bag in the header and says what went in.

import { addToBag } from './bag';

export function initBuy(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-buy]').forEach((box) => {
    const btn = box.querySelector<HTMLButtonElement>('[data-add]');
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

    stamps.forEach((stamp) => {
      stamp.addEventListener('click', () => {
        if (stamp.getAttribute('aria-disabled') === 'true') return;
        if (quick) {
          add(stamp);
          box.dispatchEvent(new CustomEvent('lo:added', { bubbles: true, detail: { title: box.dataset.title, size: stamp.dataset.size } }));
          return;
        }
        stamps.forEach((s) => s.setAttribute('aria-pressed', String(s === stamp)));
        chosen = stamp;
        if (btn) btn.disabled = false;
        if (note) note.textContent = `Size ${stamp.dataset.size}. Add it to your bag.`;
      });
    });
    btn?.addEventListener('click', () => { if (chosen) add(chosen); });
  });
}
