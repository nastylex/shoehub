# The Shoe Hub — Uganda

A luxury women's footwear e-commerce storefront for The Shoe Hub, a Kampala-based retailer. Features a product catalogue, cart, WhatsApp/email checkout, and multiple UI themes.

## Run & Operate

- `pnpm --filter @workspace/shoe-hub run dev` — run the frontend (auto-assigned PORT)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (`artifacts/shoe-hub/`)
- API: Express 5 (`artifacts/api-server/`)
- DB: PostgreSQL + Drizzle ORM (not yet wired; reserved for future admin/backend use)
- Styling: Pure CSS custom properties (no Tailwind in the storefront — glass-morphism design)
- Fonts: Cormorant Garamond (serif) + DM Sans (sans-serif) via Google Fonts

## Where things live

- `artifacts/shoe-hub/src/` — React app source
  - `context/StoreContext.tsx` — global state (cart, theme, products, toasts)
  - `components/` — all UI components (Navbar, Hero, ShopSection, CartDrawer, etc.)
  - `utils.ts` — price formatting, size constants, WA/email config
  - `types.ts` — Product, CartItem types
- `artifacts/shoe-hub/public/` — product images (1.jpg–29.jpg, pic.jpg, img_1779302508_5a251b97.png) + products.json
- `artifacts/api-server/` — Express API server (healthz only; extend for admin/analytics)
- `lib/db/` — Drizzle ORM schema (empty; provision DB when needed)

## Architecture decisions

- No backend needed for storefront: products load from `public/products.json`, falling back to `localStorage` (synced from admin) or hardcoded fallback items.
- Cart and checkout are client-side only — orders are sent via WhatsApp deep-link (`wa.me/`) or `mailto:` — no server-side order storage.
- Three themes (white/dark/gaze) are implemented via CSS `[data-theme]` attribute on `<body>`.
- All CSS uses custom properties defined in `src/index.css` — no Tailwind utility classes in the storefront components (Tailwind import is retained for any future shadcn/radix components).
- Images are served from `/public/` and referenced with `import.meta.env.BASE_URL` prefix.

## Product

- Hero section with floating product card and animated badge
- Scrolling marquee strip
- Product grid with filter pills (All / Pump / Kitten / Block / Buckle)
- Product quick-view modal with size selector
- Slide-in cart drawer with quantity controls
- WhatsApp + email order confirmation flow
- Sections: New In, Lookbook, About, Size Guide, Delivery & Returns, Contact
- Footer with navigation links

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Products load from `/products.json` relative to the app base URL — make sure images in `products.json` use bare filenames (e.g. `23.jpg`), not full paths.
- Admin syncs products to `localStorage("shoeHubProducts")` — the storefront polls this every 30s.
- The `track.php` endpoint from the original app is not ported (PHP backend). Engagement tracking is stored in `localStorage("productStats")` only.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
