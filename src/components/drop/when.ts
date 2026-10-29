// The drop's opening time, written the way he announces drops ("12pm EST"): in Eastern time,
// or in the visitor's own zone. Used at build time and by the countdown in the browser.

export const EASTERN = 'America/New_York';

/** "Fri, Nov 14, 12pm EST". With no zone, the visitor's own. Empty for an unreadable date. */
export function formatWhen(when: string | number, timeZone?: string): string {
  const d = new Date(when);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const minute = get('minute');
  const time = `${get('hour')}${minute && minute !== '00' ? `:${minute}` : ''}${get('dayPeriod').toLowerCase()}`;
  return `${get('weekday')}, ${get('month')} ${get('day')}, ${time} ${get('timeZoneName')}`;
}

/** Whole days, hours, minutes and seconds left until `target` (ms). Never negative. */
export function timeLeft(target: number, now = Date.now()) {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    done: total === 0,
    d: Math.floor(total / 86400),
    h: Math.floor(total / 3600) % 24,
    m: Math.floor(total / 60) % 60,
    s: total % 60,
  };
}
