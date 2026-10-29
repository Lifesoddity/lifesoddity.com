// The waitlist forms. They are plain Netlify Forms (found in the built HTML), posted with
// fetch so the page stays put and the sticker slaps on. Without JavaScript the browser checks
// the field itself (the markup has no novalidate) and the form posts normally to /joined.

import { slap } from './motion';
import { currentRef } from './bag';

/** A request that has not answered in this long is treated as failed. */
const TIMEOUT_MS = 10_000;

export function initWaitlists() {
  document.querySelectorAll<HTMLFormElement>('form[data-waitlist]').forEach((form) => {
    // script checks the field and says what is wrong in the form's own words
    form.noValidate = true;
    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const err = form.querySelector<HTMLElement>('[data-error]');
    const ok = form.querySelector<HTMLElement>('[data-ok]');
    const okLive = form.querySelector<HTMLElement>('[data-ok-live]');
    const go = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const source = form.querySelector<HTMLInputElement>('input[name="source"]');
    if (source) source.value = currentRef() ?? location.pathname;

    /** The failure line ends in a link to him, so a phone visitor can reach him in one tap. */
    const showFailed = () => {
      if (go) go.disabled = false;
      if (!err) return;
      const msg = form.dataset.msgFailed ?? 'That did not go through. Try again in a minute.';
      const href = form.dataset.contactHref;
      if (!href) { err.textContent = msg; return; }
      const link = document.createElement('a');
      link.href = href;
      link.rel = 'noopener';
      link.textContent = form.dataset.contactLabel ?? href;
      err.replaceChildren(msg, ' ', link, '.');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!input) return;
      const v = input.value.trim();
      if (!v || !input.checkValidity()) {
        input.setAttribute('aria-invalid', 'true');
        if (err) err.textContent = v ? (form.dataset.msgInvalid ?? 'That email looks off. Check it and try again.') : (form.dataset.msgEmpty ?? 'Type your email first.');
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      if (err) err.textContent = '';
      if (go) go.disabled = true;
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        input.disabled = true;
        form.classList.add('is-done');
        if (okLive) okLive.textContent = form.dataset.msgOk ?? ok?.textContent ?? '';
        if (ok) {
          ok.hidden = false;
          slap(ok);
          // the field and the button are now disabled: keep focus on the form, not the document
          ok.focus({ preventScroll: true });
        }
      } catch {
        showFailed();
      } finally {
        window.clearTimeout(timer);
      }
    });
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); if (err) err.textContent = ''; }
    });
  });
}
