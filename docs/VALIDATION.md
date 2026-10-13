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

The personal SEO guide has 2,825 words, original cover/social artwork and two inline diagrams. Checks verified its canonical and Twitter cover, BlogPosting author/word count, sitemap/RSS membership, desktop/mobile reading, keyboard table-of-contents access, image decoding, no-JavaScript/reduced-motion reading, and normal intro completion. Its case study records source changes and dated public checks; search performance and Google indexing outcomes remain unverified.

Notebook growth checks verified three home/archive cards, static page 2 with its canonical and sitemap entry, lazy summary-only search, category/reset/empty/error/retry states, cached requests, filtered pagination with a simulated 17-post index, focus movement, mobile overflow, and JavaScript-disabled archive navigation. The notebook search tests wait until the intro has released the inert page.

Services checks verified one section with four cards, desktop and 320/390px mobile layouts, palette changes through the actual editor, keyboard contact links, pointer hover, reduced-motion transforms, reload intro completion, JavaScript-disabled content, and browser console errors. Artwork is conceptual, and the preserved full-reload intro remains unchanged.
