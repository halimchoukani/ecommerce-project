# E-commerce Project

A small e-commerce front-end built with Angular (v20). The app provides product browsing, product detail, cart, a multi-step checkout, authentication (login/register), favorites, and a user profile with order history and profile editing.

This README explains how to run the project, the main file structure, key components and services, and details about recent localization (French) and responsive updates.

---

## Quick start

Prerequisites:
- Node.js (18+ recommended)
- npm

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
# or
ng serve
```

Open http://localhost:4200/ in a browser. The app reloads when you change source files.

Build for production:

```bash
npm run build
# or
ng build
```

Run unit tests:

```bash
npm test
```

---

## Project structure (high level)

src/
- main.ts — application bootstrap (uses `bootstrapApplication`)
- styles.scss — global styles and theme (SCSS)
- app/
  - app.ts, app.html, app.scss — root layout and imports
  - app.routes.ts — route definitions
  - app.config.ts — bootstrap configuration
  - components/
    - navbar/, sec-navbar/, menu/, footer/ — site chrome and navigation
    - product-card/ — reusable product tile
  - pages/
    - home/ — landing and slider
    - products/ — listing and filters
    - product-detail/ — detailed product view
    - cart/ — cart page and summary panel
    - checkout/ — multi-step purchase flow
    - favorites/ — wishlist/favorites
    - auth/ — login & register pages
    - profile/ — user profile with orders and settings
  - services/
    - auth.service.ts — authentication helpers (demo/localStorage)
    - product.service.ts — product retrieval
    - cart.service.ts — cart operations
    - favorites.service.ts — favorites management
    - order.service.ts — create/list orders
  - interceptors/ — http interceptor(s) (if present)
  - guards/ — route protection (auth.guard.ts)

Public assets: `public/` and `src/assets/` for images and static files.

---

## Key details & conventions

- The project uses Angular standalone components (no NgModules).
- Styles are organized per-component with global variables/mixins in `src/styles.scss`.
- Several services use `localStorage` for demo persistence (users, cart, orders, favorites).
- `angular.json` references `src/styles.scss` as the global stylesheet and configures the Angular CLI builders.

---

## Recent work: localization & responsiveness

- Localization: The UI was translated to French across many templates and TypeScript user-facing messages (login, register, cart, checkout, products, profile, etc.). This is currently implemented as hard-coded strings throughout the codebase.

- Responsiveness: CSS changes were applied to improve layout on small devices while preserving colors and the existing template. Highlights:
  - Global responsive helpers added in `src/styles.scss` for breakpoints (1024px / 768px / 480px).
  - Login & Register forms changed from fixed widths to `max-width` and become full-width on narrow screens.
  - Product cards use fluid `width: 100%` with `max-width` to preserve desktop proportions and fit mobile.
  - Grids (products/catalogue/favorites) use smaller min column widths so they collapse cleanly to 1 column on phones.
  - Footer stacks sections vertically on small screens to keep content accessible.
  - Cart summary stacks under the list at narrower widths and uses reduced padding.

Note: For large-scale localization, consider adopting Angular i18n or ngx-translate and moving strings into translation files.

---

## Extending the project

- Replace demo/localStorage authentication with a real back-end and JWT handling in `auth.service.ts`.
- Replace the mocked product sources with a products API in `product.service.ts`.
- Persist orders server-side by swapping localStorage usage in `order.service.ts` for API calls.
- Add structured i18n support and extract hard-coded strings to translation files.

---

## Developer tips

- Use the device toolbar in browser devtools to check responsive behavior quickly.
- Keep SCSS changes component-scoped when possible; global breakpoints live in `src/styles.scss`.
- Follow the standalone component pattern when adding components (import other standalone components explicitly).

---

## Files changed recently (responsiveness & translation)
- Multiple templates and TypeScript files across `src/app/pages` and `src/app/components` were translated to French.
- SCSS files updated for responsive behavior include:
  - `src/styles.scss`, `src/app/app.scss`
  - `src/app/pages/auth/login/login.scss`, `src/app/pages/auth/register/register.scss`
  - `src/app/components/product-card/product-card.scss`
  - `src/app/pages/favorites/favorites.scss`
  - `src/app/components/footer/footer.scss`
  - `src/app/pages/cart/cart.scss`
  - `src/app/pages/products/products.scss`
  - `src/app/pages/catalogue/catalogue.scss`

---

## Troubleshooting

- If the project fails to build, ensure dependencies are installed: `npm install`.
- For Angular template/type errors, read the compiler output and inspect the component indicated by the error.

## Snapshots
