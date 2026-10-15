# Release validation

Local verification on 13 October 2026 uses the production static export with `NEXT_PUBLIC_SITE_URL=https://www.khuramshahzad.dev` and `VERCEL_ENV=production`.

- Release checks cover deployment guards, content relationships, TypeScript, formatting, build output, and 26 public sitemap routes with 615 internal references.
- Palette checks sample 4,000 generated palettes plus bounded random edge cases. Primary text meets 7:1; muted and accent colors meet 4.5:1 against both background and surface.
- Chrome checks cover desktop 1440×900 and mobile 390×844: loader replay, sequential fades, deferred/offscreen WebGL, navigation, palette focus/reset, immediate Shuffle application, process keyboard controls, overflow, and console errors.
- With JavaScript requests blocked before hydration, the initial HTML already displays the loader and hides the site. With JavaScript disabled, the loader is hidden and the site and process text remain readable.
- Reduced motion, production article canonicals, unknown-route 404 responses, and blocked browser storage were checked. Owner-commented JSX was compared with its saved original and preserved exactly.

Temporary screenshots, browser scripts, and audit output stay outside the repository. The GitHub workflow has been prepared but has not run remotely. These local checks do not verify public DNS, Vercel redirects/headers, search-engine indexing, or field Core Web Vitals. Earlier Lighthouse measurements are not treated as scores for the final revision. Measure the deployed revision again; the preserved reload intro intentionally delays visible content.

Follow `DEPLOYMENT.md` after deployment to check indexability and submit the production sitemap to Google and Bing.

The revised theme system also checks neutral Dark/Light canvases, black/white ink contrast for vivid fills, twelve-family hue coverage and migration of older palette preferences. Desktop/mobile checks cover two presets, heading/body font pairings, persistence, mood-preserving Shuffle and theme-aware conceptual previews. Non-hero WebGL was replaced with UI/API/Data box diagrams; verify Flow/Layers/Grid layouts and selectable explanations when maintaining them.

The personal SEO guide has a calculated word count, original cover/social artwork and two inline diagrams. Checks verified its canonical and Twitter cover, BlogPosting author/word count, sitemap/RSS membership, desktop/mobile reading, keyboard table-of-contents access, image decoding, no-JavaScript/reduced-motion reading, and normal intro completion. Its case study records source changes and dated public checks; search performance and Google indexing outcomes remain unverified.

Notebook growth checks verified three home/archive cards, static page 2 with its canonical and sitemap entry, lazy summary-only search, category/reset/empty/error/retry states, cached requests, filtered pagination with a simulated 17-post index, focus movement, mobile overflow, and JavaScript-disabled archive navigation. The notebook search tests wait until the intro has released the inert page.

Services checks verified one section with four cards, desktop and 320/390px mobile layouts, palette changes through the actual editor, keyboard contact links, pointer hover, reduced-motion transforms, reload intro completion, JavaScript-disabled content, and browser console errors. Artwork is conceptual, and the preserved full-reload intro remains unchanged.

## Search appearance follow-up — 14 October 2026

`npm run check` passed with production configuration. After the owner requested a bolder icon, the export was rebuilt and audited again: 26 sitemap routes and 823 internal references. Browser checks verified WebSite/Open Graph name consistency, square 96px PNG and 180px Apple icons, mobile menu navigation, keyboard footer links, JavaScript-disabled footer discovery, 320px overflow, and no page errors. The KS icon uses vector outlines rather than fonts. Owner-commented JSX remains unchanged.

Public HTTP checks verified canonical redirects and the deployed 26-URL sitemap before these follow-up changes. The owner’s screenshot records a homepage appearance for one specific query. The new metadata/icons/navigation still need owner deployment; Google recrawling, favicon selection, sitelinks, and shorter-name rankings are unverified.

## Customization and avatar — 14 October 2026

The final production `npm run check` passed: 26 sitemap routes and 828 internal references. Color helper checks covered 4,096 RGB/HSV round trips, opaque HEX validation, achromatic hue retention, HSL boundary conversions, and typography migration/limits.

Chrome checks covered six font pairings, separate body/heading selection, article scale/line spacing, legacy preference migration, saved preferences, blocked storage, HEX/RGB/HSL entry, invalid-input recovery, hue retention at black, keyboard canvas controls, pointer dragging, debounced storage writes, shuffle synchronization, palette focus containment/Escape, 320px overflow, and JavaScript-disabled content. Long article URLs now wrap under custom fonts; mobile reading controls remain active. The normal intro still fully fades out before content enters, replays on reload, and responds to Escape.

The earlier facts feature was removed at the owner’s request. Avatar checks covered local image decoding in About/bylines and KS fallback when the image request fails. Browser page errors were absent. System font appearance can change; no universal latency or score guarantee is made. Owner-commented JSX was preserved exactly. Temporary QA scripts/screenshots remain outside the repository.

## Art moodboard — 14 October 2026

The facts implementation was removed and the game proposal was cancelled. Final production checks passed with 26 sitemap routes and 837 internal references. Twelve public-domain artwork records were verified through the Art Institute of Chicago API and downloaded conservatively as 400px JPEGs, one at a time with a one-second delay. The local collection totals 611,705 bytes; visitors load only the displayed lazy images. Source URLs, dates, credits and true image dimensions remain recorded.

The documented remote image paths returned 403/error pages from portfolio referrers in this environment and succeeded with the museum referrer. The gallery therefore uses local source assets and local random dealing, rather than relying on visitor hotlinks. Browser checks verified three actual decoded images, homepage and notebook placement, instant unique deals that exclude the immediately previous three works, keyboard card flips, reduced motion, 320/390px overflow, explicit image-failure text with useful credits, no-JavaScript collection links, and no museum/facts network requests during visits. No browser page errors were observed. Owner-commented JSX remains preserved. No game was added.

## IndexNow preparation — 15 October 2026

The production `npm run check` passed with 26 sitemap routes and 837 internal references. The public ownership file was exported with matching UTF-8 contents. The default helper dry run listed all 26 canonical URLs without network calls. Isolated fetch simulations verified HTTP 200 and 202 handling, URL deduplication, missing-proof rejection before POST, and unrelated-host rejection. These were simulated acceptance tests, not real submissions. A public GET of the generated verification URL returned 404 before owner deployment. No live IndexNow POST was sent; actual acceptance/indexing remains pending.

### IndexNow deployment-error follow-up — 15 October 2026

The live verification URL still returned HTTP 404. The helper now consumes response bodies and catches errors with a nonzero exit code and an actionable message rather than an uncaught assertion trace. A real preflight confirmed the clearer 404 output and sent no POST; the extra Windows shutdown assertion did not appear in that run. Isolated simulations passed dry-run, 200/202 acceptance, 404, incorrect proof contents, unrelated-host rejection, deduplication, and 429 failure handling. Acceptance responses were simulated; production submission remains pending owner deployment. No UI, loader, or animation source changed, so browser interaction checks were not repeated for this script-only fix.
