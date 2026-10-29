// The order sizes are always shown in. Shopify returns them in the order they were created
// (the She Devil tee comes back as S, M, XL, L, XS, 2XL), so every list is sorted here.

const LADDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', 'OS'];

const ALIASES: Record<string, string> = {
  XXL: '2XL',
  XXXL: '3XL',
  'ONE SIZE': 'OS',
  OSFA: 'OS',
};

/** The size label as the site prints it ("xxl" becomes "2XL"). */
export function normalizeSize(raw: string): string {
  const s = raw.trim().toUpperCase();
  return ALIASES[s] ?? s;
}

/** Sort anything that has a size along the ladder; unknown sizes keep their order at the end. */
export function bySize<T>(items: T[], sizeOf: (item: T) => string): T[] {
  const rank = (item: T) => {
    const i = LADDER.indexOf(normalizeSize(sizeOf(item)));
    return i === -1 ? LADDER.length : i;
  };
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => rank(a.item) - rank(b.item) || a.index - b.index)
    .map(({ item }) => item);
}
