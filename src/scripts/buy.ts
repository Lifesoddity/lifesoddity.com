// Buy controls: any element with data-buy holds a product's size stamps and, in a box, its main
// button. The button is never dead (D6): it reads PICK A SIZE until a size is chosen, and then
// pressing it focuses the first size in stock and nudges the row instead of adding. With a size
// chosen it reads ADD TO BAG; adding opens nothing, it stamps ADDED! on the bag in the header and
// says what went in. After an add it reads CHECKOUT · BAG (n) and opens the bag, until another
// size is picked. Only a sold-out piece disables it.
//
// The button's state lives in data-state ("pick" | "add" | "added" | "soldout"). The live stock
// check (live.ts) sends "lo:stock" to each box after it updates the stamps.

import { addToBag, bagCount } from './bag';
import { nudge } from './motion';
import { bag, buy, status } from '../content/copy/common';

type State = 'pick' | 'add' | 'added' | 'soldout';

export function initBuy(signal: AbortSignal, root: ParentNode = document) {
  const announcer = document.querySelector<HTMLElement>('[data-announce]');
  const variantParam = new URLSearchParams(location.search).get('variant');

  root.querySelectorAll<HTMLElement>('[data-buy]').forEach((box) => {
    const btn = box.querySelector<HTMLButtonElement>('[data-add]');
    const label = btn?.querySelector<HTMLElement>('span') ?? null;
    const note = box.querySelector<HTMLElement>('[data-note]');
    const row = box.querySelector<HTMLElement>('[data-sizes]');
    const stamps = [...box.querySelectorAll<HTMLButtonElement>('[data-variant]')];
    const quick = box.hasAttribute('data-quick');
    const out = (stamp: HTMLButtonElement) => stamp.getAttribute('aria-disabled') === 'true';
    let chosen: HTMLButtonElement | null = null;

    const set = (state: State) => {
      if (!btn) return;
      btn.dataset.state = state;
      btn.disabled = state === 'soldout';
      const text =
        state === 'pick' ? btn.dataset.labelPick :
        state === 'add' ? btn.dataset.labelAdd :
        state === 'added' ? bag.goCheckout(bagCount()) :
        status.soldout;
      if (label && text) label.textContent = text;
    };
    const say = (text: string) => { if (note) note.textContent = text; };

    const add = (stamp: HTMLButtonElement) => {
      addToBag({
        v: Number(stamp.dataset.variant),
        h: box.dataset.handle ?? '',
        t: box.dataset.title ?? '',
        s: stamp.dataset.size ?? '',
        p: Number(stamp.dataset.price ?? box.dataset.price ?? 0),
        i: box.dataset.image ?? '',
      });
      say(buy.added(box.dataset.title ?? '', stamp.dataset.size ?? ''));
    };

    const choose = (stamp: HTMLButtonElement) => {
      stamps.forEach((s) => s.setAttribute('aria-pressed', String(s === stamp)));
      chosen = stamp;
      set('add');
      say(buy.chosen(stamp.dataset.size ?? ''));
    };

    const unchoose = () => {
      chosen = null;
      stamps.forEach((s) => s.setAttribute('aria-pressed', 'false'));
      say('');
    };

    stamps.forEach((stamp) => {
      stamp.addEventListener('click', () => {
        if (out(stamp)) return;
        if (quick) {
          add(stamp);
          box.dispatchEvent(new CustomEvent('lo:added', { bubbles: true, detail: { title: box.dataset.title, size: stamp.dataset.size } }));
          // the visible notes of quick boxes appear only now; one persistent region says it
          if (announcer) {
            announcer.textContent = '';
            requestAnimationFrame(() => { announcer.textContent = buy.added(box.dataset.title ?? '', stamp.dataset.size ?? ''); });
          }
          return;
        }
        choose(stamp);
      });
    });

    if (quick || !btn) return;

    // the button's look and label come from its state alone, whatever ran before this
    set((btn.dataset.state as State | undefined) ?? 'pick');

    btn.addEventListener('click', () => {
      switch (btn.dataset.state) {
        case 'added':
          document.dispatchEvent(new CustomEvent('lo:open-bag'));
          return;
        case 'add':
          if (!chosen || out(chosen)) { unchoose(); set('pick'); return; }
          add(chosen);
          set('added');
          return;
        case 'pick':
          // point at the sizes: focus the first one in stock and nudge the row
          stamps.find((s) => !out(s))?.focus();
          nudge(row);
          return;
      }
    });

    document.addEventListener('lo:bag', () => {
      if (btn.dataset.state !== 'added') return;
      // the bag was emptied: nothing to check out, the chosen size can go in again
      if (bagCount() === 0) set(chosen ? 'add' : 'pick');
      else set('added');
    }, { signal });

    // the live stock check answered: a chosen size that has just sold out is un-chosen, a piece
    // that sold out since the build is disabled, one restocked since the build comes back
    box.addEventListener('lo:stock', (e) => {
      const available = (e as CustomEvent<{ available: boolean }>).detail.available;
      if (!available) { unchoose(); set('soldout'); return; }
      if (chosen && out(chosen)) { unchoose(); set('pick'); return; }
      if (btn.dataset.state === 'soldout') set(chosen ? 'add' : 'pick');
    });

    // Shopify's variant links (?variant=<id>) arrive with that size chosen
    if (variantParam && btn.dataset.state === 'pick') {
      const linked = stamps.find((s) => s.dataset.variant === variantParam);
      if (linked && !out(linked)) choose(linked);
    }
  });
}
