// The launch guard: once per build, lists every fact the site still waits on, in the build log.
// Two kinds:
// - "before launch": the site works without it on a preview, but not as lifesoddity.com.
// - "waiting on Life's Oddity": the pages leave it out or stamp it until it is given.
// With LAUNCH_STRICT=1 (set in Netlify's environment variables once the domain moves), a
// "before launch" item fails the build instead of warning, so a live deploy never ships without it.
// Called from the base layout (src/components/layout/Base.astro); runs once per build.

import { acts, nextDrop } from '../content/acts';
import { getProducts, productSource, STORE_DOMAIN } from './shopify';

interface Missing {
  fact: string;
  where: string;
}

let ran: Promise<void> | null = null;

export function launchCheck(): Promise<void> {
  ran ??= (async () => {
    await getProducts();
    const blocking: Missing[] = [];
    const waiting: Missing[] = [];

    if (!import.meta.env.PUBLIC_SHOPIFY_DOMAIN || STORE_DOMAIN.endsWith('.myshopify.com')) {
      blocking.push({
        fact: "the store's shop address (PUBLIC_SHOPIFY_DOMAIN): checkout goes through the myshopify address",
        where: 'Netlify environment variables; README, Going live, step 3.3',
      });
    }
    if (productSource.from === 'snapshot') {
      blocking.push({
        fact: 'live products: Shopify could not be reached, so this build used the saved snapshot',
        where: 'build again once Shopify answers',
      });
    }

    if (!nextDrop.name || !nextDrop.opens) {
      waiting.push({ fact: "the next drop's name and date (stamped UNCONFIRMED where the next drop is shown)", where: 'src/content/acts.ts nextDrop' });
    }
    for (const act of acts) {
      if (!act.playlist.spotify) {
        waiting.push({ fact: `the Spotify link of "${act.playlist.name}" (shown as a strip until then)`, where: `src/content/acts.ts ${act.slug}.playlist.spotify` });
      }
      if (act.subtitle && !act.subtitleConfirmed) {
        waiting.push({ fact: `an OK to print "${act.subtitle}" large (kept small until then)`, where: `src/content/acts.ts ${act.slug}.subtitleConfirmed` });
      }
    }

    const strict = import.meta.env.LAUNCH_STRICT === '1';
    const list = (items: Missing[]) => items.map((m) => `  - ${m.fact}\n    (${m.where})`).join('\n');
    if (blocking.length) {
      const text = `\n[launch] Before launch:\n${list(blocking)}`;
      if (strict) throw new Error(`${text}\n[launch] LAUNCH_STRICT=1, so this build stops here.`);
      console.warn(text);
    }
    if (waiting.length) console.info(`\n[launch] Waiting on Life's Oddity (the site works without these):\n${list(waiting)}`);
    if (!blocking.length && !waiting.length) console.info('\n[launch] Nothing missing.');
  })();
  return ran;
}
