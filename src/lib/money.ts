// Prices are kept in cents, as Shopify sends them, and printed in whole dollars when they are
// whole: $20, never $20.00 and never "Regular price".

export function formatPrice(cents: number, currency = 'USD'): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100);
}
