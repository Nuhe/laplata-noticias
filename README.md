# INFOLAPLATA — editorial redesign demo

A local-only, responsive presentation prototype for INFOLAPLATA's owner. It keeps the publication's red, black, white, and restrained blue identity, with softer gradients, complete headlines, clear sections, and a compact mobile header. **This is not the official publication or a live news feed.**

## Run locally

Requirements: Node.js 22+ for tests and Python 3 for the preview. There are no package dependencies or build steps.

```sh
npm run dev
# Open http://127.0.0.1:4173
```

The server binds to loopback only. Nothing is uploaded, published, or connected to a CMS.

## Verify

```sh
npm test
node --check dist/app.js
node --check dist/data.js
npm run test:browser
```

The browser test requires `/usr/bin/chromium`. It uses Node's built-in WebSocket API and the Chrome DevTools Protocol, starts its own temporary loopback server and isolated headless browser, and cleans up both. Full-page screenshots are written to `/tmp/infolaplata-{1440,768,390}.png`, outside the repository.

Coverage includes accent-insensitive search, multiple search terms, category filtering, empty states, viewport overflow, image loading, search/article dialogs, Escape and focus restoration, mobile navigation, reduced motion, scroll reveal, demo form confirmation, and back-to-top.

## Interaction guide

- Open search with the header button or `/`; try `opera`, `cultura`, or `Plaza España`. Search filters the bundled local fixtures, not the web or an AI service.
- Choose a section in the navigation or the “Noticias cercanas” filters.
- Open a story to see a demo excerpt and its original external source. External links open in a new tab.
- Try the example newsletter form. Native email validation runs, but the address is neither sent nor saved.
- Scroll to reveal sections and the back-to-top control. Reduced-motion preferences disable animation and smooth scrolling.

Native modal dialogs provide keyboard containment and Escape dismissal. Opening a search result replaces the search dialog with an article; closing the article restores search and result focus. Category changes preserve keyboard focus.

## Files and scope

| File | Purpose |
| --- | --- |
| `dist/index.html` | Spanish semantic page structure, metadata, navigation, and dialogs. |
| `dist/styles.css` | Responsive editorial layout, gradients, subtle effects, and reduced-motion styles. |
| `dist/data.js` | Local article fixtures and pure search functions. |
| `dist/app.js` | Rendering and browser-local interactions. |
| `dist/assets/` | Locally stored editorial reference images. |
| `tests/search.test.mjs` | Deterministic Node search tests. |
| `tests/browser.test.mjs` | Repeatable Chromium interaction and layout checks. |

The homepage labels itself **EDICIÓN DEMO** and uses `noindex, nofollow`. Article summaries are adapted presentation text; the main photographic feature and sports card are explicitly example content. No fabricated weather, live audience figures, or “breaking” timestamps are displayed. The “En agenda” rail is intentionally a curated list, not a claim of chronological freshness.

## Image provenance and reuse

Images were downloaded from publicly accessible INFOLAPLATA URLs for the owner's private redesign presentation. Availability does **not** establish a reuse license. Copyright and credits remain with the respective owners. Confirm rights and any required photographer credits before public deployment; replace assets if permission is unavailable. No fonts or images are fetched from external services at runtime.

| Local image | Original URL |
| --- | --- |
| `la-plata-aerial.jpg` | https://infolaplata.com/wp-content/uploads/2022/11/mlp-vista-aerea-palacio-plaza-moreno-catedral.jpg |
| `plaza-espana.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/Alak-y-el-Embajador-de-Espana-inauguraron-la-nueva-Plaza-Espana-en-La-Plata-02-1024x640.jpg |
| `mercado-regional.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/mercado-regional-de-la-plata-02-768x480.jpg |
| `paseo-del-bosque.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/La-Municipalidad-impulsa-el-primer-Encuentro-Regional-por-la-Inclusion-en-el-Paseo-del-Bosque-768x480.jpg |
| `cultura-coreana.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/La-Plata-palpita-la-Semana-de-la-Cultura-Coreana-768x480.jpg |
| `orquesta.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/La-direccion-musical-estara-a-cargo-de-Lucia-Zicos-1024x640.jpg |
| `deporte.jpg` | https://infolaplata.com/wp-content/uploads/2026/10/bova-valencia-768x457.jpg |

The typographic wordmark is a presentation treatment, not a replacement official logo. Serif and sans-serif typography use local system fonts.

## Before production

Connect an approved CMS and real article templates; replace demonstration copy with verified newsroom content; confirm image rights; implement a secure subscription service with consent and privacy terms; audit real devices, screen readers, contrast, SEO, and performance. No backend, analytics, user tracking, subscription delivery, or publication integration is included.
