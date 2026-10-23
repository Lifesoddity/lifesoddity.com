# lifesoddity.com

The website for Life's Oddity, a clothing brand. The store itself stays on Shopify: products,
stock, orders, payments, shipping and discounts are all managed in the Shopify admin. This site is
the storefront people visit at lifesoddity.com. It reads the products from Shopify and sends the
cart to Shopify's checkout.

## Status

Design phase: the visual direction is being chosen. No site code yet.

## How it fits together

| Piece | Where | Managed by |
|---|---|---|
| Products, stock, orders, payments, discounts | Shopify admin | Life's Oddity |
| Checkout | Shopify, at shop.lifesoddity.com | Shopify (logo and colors set in its checkout settings) |
| This site's code | this repo | members of the Lifesoddity GitHub org |
| Hosting | Netlify, deployed from `main` | the Netlify account owner |
| Domain and DNS | Shopify admin, Settings → Domains | Life's Oddity |

- New products show up on the site by themselves: add them in Shopify as usual.
- Anything pushed to `main` goes live on Netlify.

## Going live (after the design is approved)

1. Shopify: turn on the product access the site reads from (the Buy Button sales channel).
2. Netlify: import this repo (only this repo), then add lifesoddity.com and www.lifesoddity.com.
3. Shopify DNS (Settings → Domains → lifesoddity.com → DNS settings): point the main domain and
   www at Netlify (Netlify shows the values when the domain is added), connect a `shop` subdomain
   to Shopify so checkout keeps working, and leave the email records as they are.
4. To undo: point the main domain and www back at Shopify and the Shopify store returns.
