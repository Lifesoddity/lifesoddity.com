// The bag. It lives in this browser (localStorage) as variant ids and quantities, and hands off
// to Shopify's own checkout through a cart link, in the same tab: in-app browsers block popups.
// If storage is blocked (a private window), the bag still works for the visit.

import { slap } from './motion';

export interface BagItem {
  /** Shopify variant id. */
  v: number;
  /** Product handle, title, size, price in cents, image URL. */
  h: string;
  t: string;
  s: string;
  p: number;
  q: number;
  i: string;
}

const KEY = 'lo-bag';
const REF_KEY = 'lo-ref';
let items: BagItem[] = [];
let memoryOnly = false;

function load() {
  try {
    items = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    if (!Array.isArray(items)) items = [];
  } catch {
    memoryOnly = true;
    items = [];
  }
}
function save() {
  if (memoryOnly) return;
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { memoryOnly = true; }
}

export const bagCount = () => items.reduce((n, i) => n + i.q, 0);
export const bagItems = () => items.slice();

function emit() {
  save();
  document.dispatchEvent(new CustomEvent('lo:bag', { detail: { count: bagCount() } }));
}

export function addToBag(item: Omit<BagItem, 'q'>, qty = 1) {
  const found = items.find((i) => i.v === item.v);
  if (found) found.q = Math.min(found.q + qty, 9);
  else items.push({ ...item, q: qty });
  emit();
  const added = document.querySelector('.bag-added');
  if (added) {
    added.classList.add('is-on');
    slap(added);
    window.setTimeout(() => added.classList.remove('is-on'), 1900);
  }
}

export function setQty(variant: number, qty: number) {
  items = qty <= 0 ? items.filter((i) => i.v !== variant) : items.map((i) => (i.v === variant ? { ...i, q: Math.min(qty, 9) } : i));
  emit();
}

/** Where a visitor came from (?ref= or utm_source), kept for the visit and passed to Shopify. */
function rememberRef() {
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref') ?? params.get('utm_source');
  if (!ref) return;
  try { sessionStorage.setItem(REF_KEY, ref.slice(0, 40)); } catch { /* storage blocked */ }
}
export function currentRef(): string | null {
  try { return sessionStorage.getItem(REF_KEY); } catch { return null; }
}

/** A bag link carried in the URL (?cart=id:qty,id:qty) is merged in: the escape from an in-app
 *  browser to Safari loses storage, so the link carries the bag across. */
function restoreFromUrl() {
  const cart = new URLSearchParams(location.search).get('cart');
  if (!cart) return;
  for (const part of cart.split(',')) {
    const [v, q] = part.split(':').map(Number);
    if (v && q && !items.some((i) => i.v === v)) items.push({ v, q, h: '', t: 'Item from your bag', s: '', p: 0, i: '' });
  }
  emit();
}

export function checkoutUrl(domain: string): string {
  const lines = items.map((i) => `${i.v}:${i.q}`).join(',');
  const ref = currentRef();
  return `https://${domain}/cart/${lines}${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`;
}

export function initBag() {
  load();
  rememberRef();
  restoreFromUrl();
  const sync = () => {
    const n = bagCount();
    document.querySelectorAll('[data-bag-count]').forEach((el) => { el.textContent = String(n); });
    document.querySelectorAll('[data-bag-button]').forEach((el) => el.setAttribute('aria-label', `Bag, ${n} ${n === 1 ? 'item' : 'items'}`));
  };
  document.addEventListener('lo:bag', sync);
  window.addEventListener('storage', (e) => { if (e.key === KEY) { load(); sync(); document.dispatchEvent(new CustomEvent('lo:bag-render')); } });
  sync();
}
