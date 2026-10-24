# lifesoddity.com

The website for Life's Oddity, a clothing brand. The store itself stays on Shopify: products,
stock, orders, payments, shipping and discounts are all managed in the Shopify admin. This site is
the storefront people visit at lifesoddity.com. It reads the products from Shopify and sends the
cart to Shopify's checkout.

## Status

First version in progress on the `build/v1` branch (direction "Spotted": a gossip weekly where
every drop is the cover story). Not live yet: lifesoddity.com still shows the Shopify store.

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
3. The domain, in this order. The order matters: Shopify sends its own store address to whatever
   domain is the store's primary one, and the site's checkout goes through that address.
   1. In Shopify (Settings → Domains), add the `shop` subdomain to the store.
   2. Make the `shop` subdomain the store's primary domain, and check that the store and its
      checkout open there.
   3. Only then, in Shopify's DNS settings for lifesoddity.com, point the main domain and www at
      Netlify (Netlify shows the values when the domain is added). Leave the email records as
      they are.
   4. Place one real order from the new site, end to end, on a phone.
4. To undo: point the main domain and www back at Shopify and make lifesoddity.com the primary
   domain again; the Shopify store returns.
5. With each drop: email the waitlist (Netlify lists the sign-ups) before or with the Instagram
   post, since the site promises sign-ups hear first.
