// Structured data for search engines, built into the HTML (never injected by a script).

import { site, social } from '../content/site';
import type { Product } from './shopify';
import { formatPrice } from './money';

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#org`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/logo.png`,
        slogan: site.tagline,
        sameAs: social.map((s) => s.href),
      },
      { '@type': 'WebSite', '@id': `${site.url}/#site`, url: site.url, name: site.name, publisher: { '@id': `${site.url}/#org` } },
    ],
  };
}

/** One ProductGroup per product, one Product per size, each with its own Offer. */
export function productGroupLd(product: Product) {
  const url = `${site.url}/products/${product.handle}`;
  const image = product.images.map((i) => i.src);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    productGroupID: String(product.id),
    name: product.title,
    url,
    image,
    ...(product.description ? { description: product.description } : {}),
    brand: { '@type': 'Brand', name: site.name },
    variesBy: ['https://schema.org/size'],
    hasVariant: product.variants.map((v) => ({
      '@type': 'Product',
      sku: String(v.id),
      name: `${product.title}, ${v.size}`,
      size: v.size,
      image,
      offers: {
        '@type': 'Offer',
        url: `${url}?variant=${v.id}`,
        price: (v.price / 100).toFixed(2),
        priceCurrency: product.currency,
        availability: v.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

/** A product's text for link previews: its description, else its title and price. */
export function productSummary(product: Product): string {
  const sizes = product.variants.map((v) => v.size);
  const range = sizes.length > 1 ? `Sizes ${sizes[0]} to ${sizes[sizes.length - 1]}.` : '';
  return product.description?.split('\n')[0] ?? `${product.title}, ${formatPrice(product.price)}. ${range}`.trim();
}
