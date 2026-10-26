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

## IndexNow preparation — 15 October 2026

The production `npm run check` passed with 26 sitemap routes and 837 internal references. The public ownership file was exported with matching UTF-8 contents. The default helper dry run listed all 26 canonical URLs without network calls. Isolated fetch simulations verified HTTP 200 and 202 handling, URL deduplication, missing-proof rejection before POST, and unrelated-host rejection. These were simulated acceptance tests, not real submissions. A public GET of the generated verification URL returned 404 before owner deployment. No live IndexNow POST was sent; actual acceptance/indexing remains pending.

### IndexNow deployment-error follow-up — 15 October 2026

The live verification URL still returned HTTP 404. The helper now consumes response bodies and catches errors with a nonzero exit code and an actionable message rather than an uncaught assertion trace. A real preflight confirmed the clearer 404 output and sent no POST; the extra Windows shutdown assertion did not appear in that run. Isolated simulations passed dry-run, 200/202 acceptance, 404, incorrect proof contents, unrelated-host rejection, deduplication, and 429 failure handling. Acceptance responses were simulated; production submission remains pending owner deployment. No UI, loader, or animation source changed, so browser interaction checks were not repeated for this script-only fix.

## Loading-screen removal — 15 October 2026

The owner explicitly removed the earlier reload intro requirement. The loader component, stylesheet, noscript workaround, intro events, and eight loader-only technology SVGs plus their attribution file were removed. Section reveals now start independently; hero loading still respects viewport, tab visibility, and reduced motion. The personal SEO article and current handoff guides reflect the change; earlier validation entries describe historical behavior. Commented testimonials remain unchanged.

The production release checks passed (26 sitemap routes and 837 internal references). Chrome checks passed at 1440px with motion enabled and at 390/320px with reduced motion: initial loads and reloads have no loader overlay or content opacity/inert gate, palette keyboard dismissal restores interaction, mobile navigation works, section content reveals, desktop hero canvas renders, reduced-motion visitors receive the static fallback, and no loader-icon requests or page errors occur. Home and blog remain readable without JavaScript. No production deployment or new Lighthouse score is claimed.

## Mobile performance optimization — 15 October 2026

The owner supplied a deployed-site mobile Lighthouse screenshot: Performance 37, FCP 3.5s, LCP 4.1s, TBT 8,900ms, CLS 0.171, Speed Index 6.2s. These are the owner’s report values, separate from the local measurements below.

The complete hero model, rounded finish, labels, floating motion, rotation, palette repainting, drag disassembly, and section/process transitions were retained. Section reveals now use IntersectionObserver/Web Animations instead of downloading GSAP/ScrollTrigger; process transitions use CSS instead of Framer Motion. Both libraries were later removed during the 26 October cleanup. Initial viewport text stays opaque. Geometry is analytic and shared per mounted scene; mobile DPR is 1, desktop is capped at 1.5. Shader programs warm asynchronously before the continuous animation loop. The temporary WebGL probe context is released. A stable dynamic-import fallback fixes the collapsed model frame. Homepage offscreen sections defer rendering, with real layout restored for fragment navigation to preserve anchor targets after font changes.

Sequential local Lighthouse 13.5 mobile lab measurements used the preserved prior export and optimized export, ordinary motion/WebGL enabled, simulated mobile throttling (4× CPU), and full-page screenshot collection disabled consistently. All reports warn that the host CPU is slower than Lighthouse expects. These are single-run comparisons, not a median or field/deployed results:

| Metric      | Prior export | Final optimization run |
| ----------- | ------------ | ---------------------- |
| Performance | 37           | 61                     |
| FCP         | 3.3s         | 2.2s                   |
| LCP         | 4.6s         | 3.1s                   |
| TBT         | 18,590ms     | 4,470ms                |
| CLS         | 0.095        | 0                      |
| Speed Index | 8.7s         | 3.4s                   |

Intermediate iterations scored 48 and 35 as implementation and host load varied; do not treat the final score as a guarantee. Earlier simultaneous diagnostic runs are excluded from this comparison. Remaining blocking time is substantial and the Three.js/Fiber startup is still the largest runtime cost. Deploy and repeat mobile Lighthouse sequentially under consistent conditions, then review real Core Web Vitals as traffic becomes available. No runtime audit detection, disabled model, forced reduced-motion audit, or interaction requirement was used to obtain the reported score.

The production release checks passed with 26 sitemap routes and 837 internal references. Chrome checks at 1440px/390px with normal motion and 320px with reduced motion verified model rendering, mobile/desktop pixel ratios, non-collapsing loading frame, drag input, palette controls, process keyboard tabs, mobile navigation, scene unmount/remount, live reduced-motion changes, readable no-JavaScript content and no page errors. Temporary screenshots and reports remain outside the repository.

The final fragment safeguard passed additional 390px and 1440px checks with the Developer font pairing: Contact/Work/About anchors land in view, all homepage sections render while scrolling, FAQ disclosure works, and reloads show no loader. The safeguard is inactive for the unfragmented homepage URL used in the performance run.

## MongoDB blog and private studio — 26 October 2026

The owner approved replacing static export with server-backed Next.js ISR, then requested a password-protected editor instead of relying on Compass. Four original articles were imported into portfolio.posts with matching text, slugs, dates and image paths. A repeated migration inserted zero documents and preserved existing records. Database validation passed for all four published articles. The original file content remains an explicit offline/CI snapshot, never a silent database fallback.

Next.js was patched from 16.4.0 to 16.4.3 after dependency auditing reported security advisories; the completed install reported zero vulnerabilities. Public routes keep server-readable article bodies, metadata, canonical URLs, sitemap and RSS. Local checks covered both safe noindex defaults and production-domain directives. Mobile/desktop checks at 390, 320 (reduced motion), and 1440 pixels passed notebook searching, keyboard control, article/home reload visibility, and no page errors. Article text also rendered without JavaScript.

Studio integration checks used a uniquely named temporary Atlas database, not the portfolio collection. They verified wrong-password rejection, wrong-Origin rejection, unauthorized writes, HTTP-only SameSite cookies, private unfinished drafts, 390px editing and preview without horizontal overflow, publishing a new slug without rebuilding, sitemap/feed/search refresh after regeneration, stale-revision rejection, unpublishing, logout token revocation, and the shared login-attempt limit. No browser page errors occurred. The temporary database was dropped afterward; test articles were not published to the real collection. Screenshots and the environment-specific browser harness remain outside Git.

Cache regeneration is request-driven: an initial response after invalidation can still be stale before a following response is refreshed. Tests poll for completion rather than claim instant global consistency. Compass edits rely on the 60-second fallback; studio writes invalidate affected paths. The studio still requires the owner to run the password setup command and configure the hash in Vercel. No real password was chosen by the agent, no deployment was performed, and production indexing/rankings were not asserted. Image uploads, MFA, recovery and version history are not included; see STUDIO.md.

The final npm run check passed with production-domain settings: configuration checks, 4,000 palette cases, blog/studio validation, fresh route type generation and TypeScript, formatting, production build, and the HTTP audit of 26 public routes and 57 unique internal references. The audit also verified the studio login is noindex and no-store and absent from the sitemap.

## Studio Blob uploads - 26 October 2026

Cover and section image uploads now use the configured public Vercel Blob store. Real browser uploads of two temporary PNGs passed in the production server with an isolated Atlas QA database. Checks covered invalid-file rejection, owner sign-in, mobile 390px reduced-motion editing and preview, keyboard traversal, URL/dimension persistence, publishing without rebuilding, article HTML and metadata, discovery refresh, stale revisions, unpublishing and logout. No browser page errors or mobile horizontal overflow occurred. Both uploaded test files and the temporary database were removed; production articles were not edited. The mobile upload panel was visually inspected.

The HTTP audit passed for 27 routes and 66 unique internal references with the current local noindex configuration. It additionally rejects unauthenticated upload authorization, wrong-origin requests and oversized token requests. Unit checks cover local-image compatibility, Blob URL validation, external-host rejection, social-image URL handling and image dimensions.

`npm run check` passed configuration, palette, blog, studio, TypeScript and formatting stages, but its default Turbopack build crashed twice while starting the CSS worker, including outside the restricted process environment. `npm run build -- --webpack` succeeded, followed by `npm run check:site` and the real upload tests. This is a local compiler limitation, not a claim that the complete default check passed. The deployment build command is unchanged. Deploy and verify the live studio once; subsequent image uploads require no deployment. Existing local artwork remains compatible. See [STUDIO.md](STUDIO.md#image-uploads-with-vercel-blob).

## Cleanup and uploaded blog illustrations - 26 October 2026

Removed the museum gallery component, deck/data, styles, twelve cached paintings, unused GSAP/Framer Motion dependencies, obsolete planning/research documents, duplicate blog PNGs, the superseded art generator and the old ignored export directory. Removed files are recoverable outside the repository. Editable blog SVG originals were subsequently archived outside the repository; active developer guides, the hero model, section animations, verification files and commented JSX are preserved. A reference scan found no other orphaned component modules.

Eleven WebP illustrations were uploaded and byte-verified, ranging from about 6 to 21 KB (140,296 bytes total). The five MongoDB articles now use those URLs and dimensions. Revision checks prevented concurrent edits from being overwritten; read-back comparisons verified all text, captions, dates and slugs remained unchanged. Public HTTP checks returned 200 and showed the new cover URLs for all five articles. Legacy image URLs have sixteen permanent redirects, checked by the HTTP audit.

The full `npm run check` passed this time, including the default Turbopack build. After adding legacy image redirects, the production build and HTTP audit passed again (27 public routes, 46 unique internal references, local noindex configuration). Browser tests used a temporary database and two temporary Blob files: upload-only fields, invalid file rejection, 3200x1920 input resized to 1600x960 WebP, dimension persistence, mobile 390px reduced-motion editing, keyboard traversal, preview, publishing, discovery refresh, logout and revision checks all passed. Home reload and notebook checks confirmed gallery removal and no horizontal overflow or page errors. Temporary test resources were removed. The mobile upload panel was visually inspected. Code changes still need the owner's deployment; the database image refresh is already visible publicly.
