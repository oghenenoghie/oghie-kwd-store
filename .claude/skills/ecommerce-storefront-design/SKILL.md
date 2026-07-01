---
name: ecommerce-storefront-design
description: Design system and tooling reference for Patrick's Next.js + Django ecommerce storefront (luxury/fashion retail, headless architecture). Use this skill whenever working on the storefront's frontend — building or styling pages, components, product/collection views, cart/checkout UI, navigation, hero sections, or anything touching color, typography, spacing, motion, or component libraries. Also use it when comparing the storefront against reference sites, choosing frontend libraries, writing Tailwind config, or discussing how to make the UI feel more premium, cleaner, or more responsive. Trigger this even if the user doesn't say "design system" explicitly — phrases like "make it look more professional," "what colors/fonts should I use," "clean up the UI," or "add a component" for this project all qualify.
---

# Ecommerce Storefront Design System

Design and tooling reference for a headless ecommerce storefront: **Next.js (App Router) frontend + Django REST API backend**. Modeled after a comparison of two live references — a standard Shopify/Liquid theme (dasha.ae) versus a Shopify Hydrogen headless build (gianfrancoferre.com) — with the goal of hitting the latter's polish using our own stack.

Use this file as the source of truth for tokens and tool choices on this project. Don't reintroduce generic defaults (warm-cream + terracotta palettes, Inter-everywhere typography, uncontained hover-only dropdown nav) — this skill exists specifically to avoid that.

## Design tokens

### Color palette — "Ink, Bone & Brass"

Quiet-luxury palette: warm neutrals, one deep accent, one metallic. Deliberately not the default cream/terracotta combo.

| Name | Hex | Role |
|---|---|---|
| Ink | `#12110F` | Primary text, dark surfaces (nav, footer, hero backgrounds) |
| Charcoal | `#2B2A28` | Secondary dark surface, body text on light backgrounds |
| Bone | `#EAE7DF` | Main page background |
| Stone | `#8C8579` | Muted text — captions, secondary labels, placeholder copy |
| Oxblood | `#6B1E23` | Accent, used sparingly — sale badges, active/hover states, error states can borrow this too if a true red isn't available |
| Brass | `#A8823D` | CTA buttons, single metallic highlight — don't overuse; it's the one warm accent |

Rule of thumb: Ink/Bone/Charcoal/Stone carry 90%+ of the UI. Oxblood and Brass are accents — if more than ~10% of a screen is colored with them, pull back.

### Typography

- **Display**: Fraunces (variable font) — headlines, hero copy, pull quotes, product names on PDPs. Use at lighter weights (300–400) for elegance; reserve heavier weights for small/short bursts of text only.
- **Body**: Work Sans — body copy, nav labels, form fields, buttons, captions. Never use the display face for body-length text.
- **Scale**: fluid, via `clamp()`, not fixed breakpoint jumps. Reference scale (mobile → desktop):
  - Display XL: `clamp(2.2rem, 6vw, 4rem)`
  - Display L: `clamp(2rem, 5.5vw, 3.6rem)`
  - Display M: `clamp(1.5rem, 3vw, 2.2rem)`
  - Body L: `1.125rem` / Body base: `1rem` / Caption: `0.8rem`
  - Generate custom values at [utopia.fyi](https://utopia.fyi) when a new scale step is needed — don't eyeball breakpoint sizes.

See `assets/tailwind.tokens.js` for a ready-to-paste Tailwind theme extension with these colors and fonts.

## Architecture

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS. Use ISR (`revalidate`) on product/category pages so catalog edits from Django propagate without full redeploys.
- **Backend**: Django REST Framework is the source of truth for products, cart, orders. Treat this as a headless commerce setup — same pattern as Shopify Hydrogen, just with a custom API instead of Shopify's.
- **Data fetching**: TanStack Query on top of DRF endpoints for cart/wishlist state, optimistic updates, cache invalidation. Don't hand-roll fetch + useState for anything stateful (cart count, auth status).
- **Auth**: `djangorestframework-simplejwt` on the backend; NextAuth or a lightweight custom JWT handler on the frontend.
- **Search/filtering**: `django-filter` for faceted filtering (size, color, category). If catalog search feels slow or basic, add Meilisearch or Postgres full-text search in front of Django.
- **Payments**: Stripe by default; if the target market is UAE/MENA (as with the fashion-retail comparison), evaluate Telr, PayTabs, or Network International alongside Stripe since coverage varies by region.

## Component & UI library stack

Don't reach for a pre-styled kit (MUI, Chakra) — they fight customization. Instead:

- **Radix UI primitives** — dialogs, dropdowns, navigation menus, tooltips, accordions. Unstyled and accessible by default.
- **shadcn/ui** — copies component source into the repo (not an npm dependency), so components can be fully customized rather than overridden.
- **class-variance-authority (cva)** + `tailwind-merge` — for managing component variants (size, tone, state) instead of stacked conditional classNames.
- **Lucide React** — icon set. Consistent stroke weight; avoid mixing icon libraries.
- **Tailwind container queries (`@container`)** — for components (product cards, dashboard widgets) that should respond to their own container size, not just the viewport.

## Motion

- **Framer Motion** — interaction-level animation: hover states, drawer/menu transitions, page transitions.
- **Lenis** — smooth scroll / inertia, if the brief calls for that premium feel (this is part of what makes the Hydrogen reference site feel more expensive than the Liquid-theme one).
- Always respect `prefers-reduced-motion`. Orchestrate one deliberate motion moment (e.g. hero load-in) rather than scattering micro-animations everywhere — scattered motion reads as templated/AI-generated, not premium.

## Media

- **Video hero**: Mux or Cloudflare Stream for adaptive HLS delivery, played via `hls.js` or `video.js`. This is the single biggest visual gap between a basic theme and a premium headless build.
- **Images**: `next/image` with a real optimization pipeline (Cloudinary, imgix, or Django-side processing) — not raw `MEDIA_URL` files. Use blur placeholders.

## Workflow / quality bar

- **Storybook** — build and review components in isolation before wiring into pages; catches inconsistent spacing/type early.
- **Playwright** — E2E tests, especially the checkout flow.
- **Figma Tokens (Tokens Studio)** — if design tokens need to sync between Figma and the Tailwind config, so design and code don't drift.

## Header, footer & cart

### Header
- **Announcement bar** (optional, thin) — Ink background, Bone text, one rotating message. Dismissible.
- **Main bar** — three-zone layout: menu/nav left, logo center, search + account + cart icon (with item-count badge) right.
- **Mega-menu**, not a plain dropdown — category name plus a couple of curated image tiles, built on **Radix Navigation Menu** for free keyboard nav and focus handling.
- **Sticky + shrink on scroll** — reduce padding/logo size after ~80px rather than pinning full-size.
- If the homepage has a full-bleed hero, transition the header background from transparent to solid Bone once scrolled.
- **Search**: avoid routing to a separate page. Use an inline expanding field or a Radix Dialog with live, debounced results against the DRF search endpoint.

### Footer
- **Newsletter strip first**, visually separated (e.g. a Charcoal band) — highest-intent real estate, don't bury it at the bottom.
- **Four-column layout**: Shop (categories), Help (contact/shipping/returns/FAQ), Company (about/careers), Legal (terms/privacy).
- **Payment icons + social row**, small and Stone-colored — quiet, not competing with the columns above.
- **Copyright line** last, smallest text on the page.
- Footer background: **Ink**, text in Bone/Stone — reinforces the palette instead of defaulting to plain white/gray.

### Cart: drawer, not a page
A slide-in cart drawer keeps shoppers in-flow; avoid routing to a dedicated `/cart` page as the primary pattern.
- **Component**: Radix Dialog, or **Vaul** (built on Radix) if the drawer should also work as a mobile bottom-sheet with native swipe-to-dismiss.
- **Transition**: Framer Motion, slide from the right, ~300ms ease-out, backdrop fade.
- **Trigger**: auto-opens on "Add to cart" (brief success state) and on clicking the cart icon.
- **Contents**: line items with a quantity stepper (+/− buttons, not a raw number input), a free-shipping progress bar if a threshold applies, subtotal only (save tax/shipping detail for checkout), and one full-width **Brass** "Checkout" CTA. Add a secondary "View cart" link only if a full cart page is needed for promo codes or gift notes.
- **State**: cart lives in TanStack Query synced against the Django cart endpoint — not local component state only — so it survives refreshes and stays consistent across tabs.

## API reference (live backend)

Base URL: `https://oghie-store.vercel.app` — put this in an env var (`NEXT_PUBLIC_API_BASE_URL`), never hardcode it in components.

Confirmed route map (pulled directly from the API root):

| Purpose | Method(s) | Path |
|---|---|---|
| Admin | — | `/admin/` |
| Get JWT token | POST | `/api/auth/token/` |
| Refresh JWT token | POST | `/api/auth/token/refresh/` |
| Current user | GET | `/api/auth/me/` |
| Product list | GET | `/api/products/` |
| Product filters | GET | `/api/products/?search=&category=&currency=&min_price=&max_price=&in_stock=true&min_rating=&ordering=price` |
| Currencies | GET | `/api/products/currencies/` |
| Wishlist | GET/POST | `/api/products/wishlist/` |
| Reviews | GET/POST | `/api/products/reviews/` |
| Active cart | GET | `/api/orders/cart/active/` |
| Checkout | POST | `/api/orders/cart/{cart_id}/checkout/` |
| Orders | GET | `/api/orders/` |
| My orders | GET | `/api/orders/mine/` |
| Order tracking | GET | `/api/orders/tracking/` |
| Payments | GET/POST | `/api/payments/` |
| CMS sections | GET | `/api/cms/sections/` |
| Analytics summary | GET | `/api/analytics/summary/` |

**Auth pattern**: JWT via `/api/auth/token/`, store access token in memory (not localStorage — XSS risk) and refresh token in an httpOnly cookie if the backend supports setting one, otherwise a secure client store. On a 401, call `/api/auth/token/refresh/` once, retry the original request, and only log the user out if refresh also fails. Build this as a single fetch wrapper (or a TanStack Query `queryFn` helper) so every hook shares the same refresh logic instead of duplicating it per-call.

**Product filtering**: the `/api/products/` endpoint takes filters as querystring params directly (`search`, `category`, `currency`, `min_price`, `max_price`, `in_stock`, `min_rating`, `ordering`) — build a typed params object and serialize with `URLSearchParams` rather than string-concatenating the query.

**Cart flow**: cart is fetched via `/api/orders/cart/active/`, and checkout POSTs to `/api/orders/cart/{cart_id}/checkout/` — the cart drawer's checkout button needs the active cart's `id` in hand before it can build that URL, so fetch/cache the active cart on mount via TanStack Query and read `cart_id` from that cached result, not a fresh call at click-time.

**Note**: this table reflects the routes exposed at the API root. Field-level request/response shapes (exact JSON keys per endpoint) aren't confirmed yet — check the DRF browsable API or Django admin for each endpoint before wiring exact field names into TypeScript types, rather than assuming.

## Do / don't

- Do: pick tokens once (this file) and derive every color/type decision from them.
- Do: use container queries for card/grid components.
- Don't: default to Inter for everything — it's the most common "this looks AI-generated" tell right now. Work Sans is the body face for this project.
- Don't: let Oxblood or Brass creep past accent-level usage.
- Don't: add animation that doesn't serve a specific interaction — no decorative motion for its own sake.
- Don't: route "Add to cart" to a separate cart page as the default flow — use the drawer.
- Don't: bury the newsletter signup at the very bottom of the footer, under the legal links.
- Don't: hardcode the API base URL in components, store JWT access tokens in localStorage, or call `/api/orders/cart/active/` fresh on every checkout click instead of reading from cache.
