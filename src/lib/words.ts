// The giant words of the scroll story (SHE DEVIL, SHOWTIME...) are sized to fill the screen's
// width. The size needs each word's width in League Gothic, measured once in Chrome (in em, at
// letter-spacing 0) so any new product's word is laid out at build time, with no measuring in
// the visitor's browser.

const ADVANCE: Record<string, number> = {
  A: 0.389, B: 0.364, C: 0.358, D: 0.372, E: 0.327, F: 0.301, G: 0.363, H: 0.38, I: 0.188,
  J: 0.212, K: 0.375, L: 0.295, M: 0.484, N: 0.395, O: 0.358, P: 0.352, Q: 0.358, R: 0.357,
  S: 0.338, T: 0.332, U: 0.368, V: 0.362, W: 0.512, X: 0.374, Y: 0.358, Z: 0.316,
  '0': 0.354, '1': 0.24, '2': 0.363, '3': 0.352, '4': 0.351, '5': 0.342, '6': 0.342,
  '7': 0.307, '8': 0.34, '9': 0.342,
  '!': 0.177, '?': 0.343, "'": 0.151, '’': 0.151, ',': 0.151, '.': 0.157, '&': 0.423,
  '-': 0.217, ':': 0.177, $: 0.306, '#': 0.614, '/': 0.352,
};
const FALLBACK = 0.36;
/** The gap between the words of a two-word line, in em. */
export const WORD_GAP = 0.2;

const width = (letters: string) =>
  [...letters].reduce((sum, ch) => sum + (ADVANCE[ch] ?? FALLBACK), 0);

export interface WordLayout {
  /** The word's lines on a phone (two at most); each line is a list of letters. */
  lines: string[][];
  /** Width of the whole word on one line, in em (with the gap between words). */
  w: number;
  /** Width of the widest phone line, in em. */
  wl: number;
  /** The gap on one line, in em: WORD_GAP for two words, 0 for one word split in half. */
  gap: number;
}

/** Lay out a word for the story: two words become two lines; one word is split in two halves. */
export function layoutWord(raw: string): WordLayout {
  const word = raw.toUpperCase().replace(/\s+/g, ' ').trim();
  const parts = word.split(' ');
  let lines: string[];
  let gap = 0;
  if (parts.length >= 2) {
    // two lines: balance the words between them
    let best = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < parts.length; i++) {
      const diff = Math.abs(width(parts.slice(0, i).join('')) - width(parts.slice(i).join('')));
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    }
    lines = [parts.slice(0, best).join(' '), parts.slice(best).join(' ')];
    gap = WORD_GAP;
  } else if (word.length > 5) {
    // one long word: split where the two halves are closest in width
    let best = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < word.length; i++) {
      const diff = Math.abs(width(word.slice(0, i)) - width(word.slice(i)));
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    }
    lines = [word.slice(0, best), word.slice(best)];
  } else {
    lines = [word];
  }
  const lineWidths = lines.map((l) => width(l.replace(/ /g, '')) + (l.split(' ').length - 1) * WORD_GAP);
  const w = lineWidths.reduce((a, b) => a + b, 0) + gap * (lines.length - 1);
  const wl = Math.max(...lineWidths);
  return {
    lines: lines.map((l) => [...l]),
    w: Math.round(w * 1000) / 1000,
    wl: Math.round(wl * 1000) / 1000,
    gap,
  };
}
