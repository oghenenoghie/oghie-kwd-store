---
name: nextjs-fashion-storefront
description: Layout patterns, component specs, and Tailwind/Next.js code for building editorial luxury-fashion ecommerce storefronts (horizontal product carousels, mega-menu header, hover-swap product cards, shop-the-look modules) — the pattern used by DTC fashion brands like DeTHEIA, Reformation, and similar Shopify-style storefronts. Use this skill whenever building or restyling a fashion/apparel storefront's homepage, category rail, product card, mega-menu navigation, or "shop the look" section, or whenever the user references a fashion ecommerce site as visual inspiration and wants a similar look built in Next.js. Also trigger this for requests like "make it feel like a luxury fashion brand," "add a product carousel," "build a mega-menu," or "clone the layout of [fashion site]" — this skill exists to turn that kind of reference into an original, non-infringing component set rather than a literal copy.
---

# Next.js Fashion Storefront Patterns

Reusable layout and component patterns for editorial, luxury-leaning fashion ecommerce storefronts — the genre exemplified by sites like DeTHEIA, Reformation, and Shopify Plus fashion themes generally. This skill captures the **structural and interaction patterns** (grid rhythm, carousel behavior, card anatomy, nav structure) as reusable Next.js/Tailwind code — not any brand's actual name, logo, copy, photography, or trademarked design elements. Always swap in the user's own brand name, product data, and imagery; never hardcode a real brand's assets into generated code.

## When a user gives you a reference site

1. Note structural patterns only: nav structure, card anatomy, carousel mechanics, section order, spacing rhythm.
2. Do not reuse the reference brand's name, logo, tagline, product names, or copy text in generated code — use neutral placeholders (`Brand`, `Category`, `Product Name`) unless the user supplies their own.
3. Do not fetch or embed the reference site's actual images — use placeholder image slots (`next/image` with a placeholder src or a solid-color div) and tell the user to swap in their own photography.
4. Ask what the user's actual brand name, palette, and product catalog are before finalizing tokens — see `assets/tailwind.tokens.js` for a starting point they should override.

## Page structure (homepage)

Top to bottom, this genre almost always follows:

1. **Announcement bar** (optional) — thin strip, shipping/promo message, dismissible
2. **Sticky header** — mega-menu nav, centered logo, utility icons (search/wishlist/cart/account)
3. **Full-bleed hero** — rotating banner or single image/video, links to a flagship collection
4. **Horizontal product rail #1** — "New Arrivals," scroll-snap carousel
5. **Horizontal product rail #2+** — by category (Dresses, Tops, Skirts...), same card component reused
6. **Editorial "Shop the Look"** — lifestyle image paired with 1-3 shoppable product cards
7. **Newsletter band** — full-width, high contrast from surrounding sections
8. **Footer** — social icons, link columns (Company/Information/Legal), payment icons, copyright + trademark line

Reuse one `ProductCard` and one `ProductCarousel` component across every rail — don't build bespoke markup per category section.

## Component specs

### Header / mega-menu
- Three-zone bar: nav-left, logo-center, icons-right (search, wishlist, cart with count badge, account)
- Nav items open a **mega-menu panel** on hover/click: left column = subcategory text links, right side = 2-3 curated image tiles linking to featured collections
- Sticky on scroll; consider shrinking header height after ~80px scroll rather than staying full-size
- Mobile: collapses to hamburger → full-screen or slide-in drawer with the same nav tree, accordion-style for sub-items
- Build nav on **Radix Navigation Menu** for accessible keyboard/focus handling rather than custom hover-div logic

### Product card (the core reusable unit)
- **Two-image hover-swap**: default shows flat/product-only shot, hover (or tap-and-hold on mobile) crossfades to on-model shot
- **Badge slot**, top-left or top-right: `New`, `Sale`, `Sold out` — one badge max, sale badge shows amount saved when possible (`Save $67.60`)
- **Title** below image, links to PDP
- **Price block**: regular price; if on sale, show strikethrough original + sale price; never show sale styling without a strikethrough reference price
- Card itself has no visible border/shadow by default — separation comes from whitespace, not chrome
- See `assets/components/ProductCard.tsx`

### Product carousel
- Horizontal scroll-snap (not a full slider library) for perf — `overflow-x-auto snap-x snap-mandatory` with each card `snap-start`
- Section header: small overline label (e.g. "OUR BEST SELLERS") + larger section title, "VIEW ALL" link right-aligned on desktop
- Pagination dots or `n / of m` counter for longer rails; arrow controls appear on hover on desktop, are always visible on touch
- See `assets/components/ProductCarousel.tsx`

### Shop the look
- Editorial lifestyle image on one side, 1-3 linked `ProductCard`s (can be a condensed variant) on the other
- Used to cross-sell an outfit rather than a single item — pull 2-4 complementary products, not a full category grid
- See `assets/components/ShopTheLook.tsx`

### Footer
- Newsletter signup band sits **above** the link columns, visually distinct background
- Social icons row (monochrome/brand-colored small icons)
- Link columns: Company (About/Stores/Contact/FAQ), Information (Shipping/Returns/Privacy/Size Guide) — 2-4 columns depending on link count
- Trademark/legal line + payment method icons, smallest text on the page, last element
- See `assets/components/Footer.tsx`

### Cart
- Prefer a slide-in drawer (Radix Dialog or Vaul) over a dedicated `/cart` page as the primary flow — keeps shoppers in-context
- Country/currency selector in header or footer if serving multiple regions — a searchable list, not a giant unfiltered dropdown if the list exceeds ~30 entries

## Design tokens (starting point — override with the user's brand)

This genre reads as "quiet luxury": neutral base (off-white/bone, ink/charcoal text), one accent used sparingly for sale/CTA states, generous whitespace, uppercase-tracked nav labels, a serif or high-contrast display face paired with a clean sans body face.

```js
// see assets/tailwind.tokens.js for the full paste-ready version
colors: {
  ink: '#171512',       // primary text, dark surfaces
  bone: '#F3F1EC',      // page background
  stone: '#9A9186',     // muted/secondary text
  accent: '#7A2E2E',    // sparingly: sale badges, active states
}
fontFamily: {
  display: ['Fraunces', 'serif'],   // headings, hero copy, product names
  sans: ['Work Sans', 'sans-serif'] // nav, body, buttons, prices
}
```

Don't ship the defaults above as final — ask the user for their actual brand palette/typeface before treating this as done. The point of these tokens is to avoid generic Inter/Tailwind-gray defaults, not to impersonate any specific brand.

## Tech stack

- **Next.js App Router + TypeScript + Tailwind CSS** (matches the user's usual stack)
- **Radix UI primitives** for nav menu, dialogs (cart drawer, country selector), accessible by default
- **Framer Motion** for the hover crossfade on product cards and drawer transitions — keep it to these two moments, not scattered everywhere
- **next/image** for all product photography, with blur placeholders
- Data layer: if backed by Shopify, use the **Storefront API** (GraphQL) via `@shopify/hydrogen-react` helpers or a thin custom client; if backed by a custom API (per the user's own `ecommerce-storefront-design` setup), reuse that project's existing route map instead of assuming Shopify

## Do / don't

- Do: reuse one `ProductCard` + one `ProductCarousel` across every homepage rail
- Do: ask for the user's real brand name/palette/catalog before calling any generated page "done"
- Do: use scroll-snap for carousels instead of pulling in a heavy slider library
- Don't: hardcode a reference brand's name, product names, tagline, or images into generated code
- Don't: fetch/embed a reference site's actual photography — use placeholders and say so
- Don't: route "Add to cart" to a dedicated cart page as the default — use a drawer
- Don't: give sale-badge styling to a price with no strikethrough reference price
