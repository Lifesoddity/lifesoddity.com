// The waitlist forms. They are plain Netlify Forms (found in the built HTML), posted with
// fetch so the page stays put and the sticker slaps on. Without JavaScript the form posts
// normally and lands on /joined.

import { slap } from './motion';
import { currentRef } from './bag';

export function initWaitlists() {
  document.querySelectorAll<HTMLFormElement>('form[data-waitlist]').forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input[type="email"]');
    const err = form.querySelector<HTMLElement>('[data-error]');
    const ok = form.querySelector<HTMLElement>('[data-ok]');
    const go = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const source = form.querySelector<HTMLInputElement>('input[name="source"]');
    if (source) source.value = currentRef() ?? location.pathname;

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
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
        });
        if (!res.ok) throw new Error(String(res.status));
        input.disabled = true;
        form.classList.add('is-done');
        if (ok) { ok.hidden = false; slap(ok); }
      } catch {
        if (go) go.disabled = false;
        if (err) err.textContent = form.dataset.msgFailed ?? 'That did not go through. Try again in a minute.';
      }
    });
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); if (err) err.textContent = ''; }
    });
  });
}
