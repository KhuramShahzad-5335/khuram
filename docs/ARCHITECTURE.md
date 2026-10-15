# Architecture and developer workflow

## Runtime model

This is a Next.js App Router static export. Server Components run at build time and produce crawlable HTML and navigation payloads; client boundaries implement state, browser preferences, animation, and WebGL. Pages accept asynchronous `params` under the installed Next.js conventions. Read the relevant guides in `node_modules/next/dist/docs/` before changing Next APIs.

Keep route files focused on composition, static route generation, and metadata. Keep content in typed `lib/` modules and reusable UI in `components/`. Avoid adding abstraction layers without multiple real uses. Do not introduce a backend, authentication, CMS, or route handlers requiring a live server. The RSS GET handler is `force-static` and generates a file at build time.

## Important boundaries

- `app/layout.tsx` owns language, global metadata, analytics, skip navigation, and the shared shell. The footer remains server-rendered and is passed into the client shell.
- `components/shell.tsx` coordinates palette and typography state. Header navigation and the lazily imported editor have separate responsibilities.
- `lib/site.ts` validates the deployment origin and centrally defines identity/indexing decisions. `lib/metadata.ts` keeps canonical and sharing fields aligned.
- `lib/posts.ts` contains article bodies. Only build-time route modules import it. `lib/blog.ts` supplies small shared types, counts, dates, and summary projection. Pass summaries to client components rather than importing entire article records there.
- `ScenePreview` defers the heavy 3D component until near the viewport and an idle opportunity (bounded at 1200ms), uses the same-height fallback during the dynamic import, and unmounts the hero scene offscreen, on hidden tabs, and for reduced motion. Each actual scene checks WebGL support. Model blocks use analytic Three.js rounded geometry, shared by dimensions within each mounted scene and disposed on teardown. Mobile DPR is 1; desktop DPR is capped at 1.5. Shader warm-up uses Three.js `compileAsync` before starting the continuous animation loop; rendering starts normally if warm-up rejects. The temporary WebGL capability-check context is released. The full model, soft corners, floating motion, rotation and drag disassembly remain.
- Home scroll reveals use IntersectionObserver and the Web Animations API, with the same 24px/700ms entrance. Layout reads are batched before class mutations. Initial viewport content remains opaque; below-fold reveals run once. Cleanup disconnects observation, cancels animations, and clears hidden states. Process-panel transitions use CSS. GSAP and Framer Motion remain installed but are no longer imported by these components. Avoid multiple animation systems owning the same property.

## Source hygiene

Use strict TypeScript, explicit reusable types, and meaningful names. Unused locals/parameters are compiler errors. Prefer Server Components by default and add `"use client"` only for browser behavior. Keep imports at the top, prevent circular dependencies, and separate data from presentation when it clarifies ownership.

Use Tailwind for component-specific layout and visual details. Reuse CSS tokens, shared section/layout patterns, focus treatments, and typography. Custom illustration geometry, responsive shared patterns, and coordinated keyframes remain CSS. Do not duplicate a utility and a CSS declaration controlling the same component. Follow the design guide before altering either.

Prettier and EditorConfig standardize maintained source. Historical planning files and supplied icon artwork are excluded from automatic formatting. Preserve the owner's commented-out JSX; never reactivate it during cleanup.

## Release checks

```sh
npm ci
npm run check
npm start
```

The export audit checks every sitemap route for one H1, unique title, canonical, description, sharing image, consistent robots directives, parseable JSON-LD, image dimensions/alt attributes, local link targets, RSS membership, and draft exclusion. It supports production and intentionally non-indexable builds. It does not test external domains, search ranking, visual appearance, or all accessibility concerns.

Review desktop and mobile layouts, keyboard navigation, menu close behavior, palette focus containment/Escape/reset/persistence, process arrow-key navigation, WebGL fallback, reduced motion, and JavaScript-disabled reading. Check initial visits and reloads: content is immediately visible and interactive without a loading overlay or intro timers. Check background-tab scene behavior and console errors.

Measure Lighthouse against the production export and record device/mode, URL, score, and date. Inspect field Core Web Vitals in Search Console/Speed Insights after deployment; local lab scores are not field data. Never label a reduced-motion run as the ordinary animated experience.

## Extending the site

New public routes need unique metadata, a canonical, a sitemap entry, useful internal navigation, and real content. New client features must clean up timers/listeners/observers, handle blocked storage/network failures, and respect reduced motion. New raster images should be compressed, dimensioned, locally hosted where appropriate, and have meaningful alt text. Static export uses unoptimized Next Image: it cannot resize raster assets on demand.

The local preview server is for development only, binds to localhost, and serves `out/`. It compresses text responses and caches hashed Next assets to approximate production delivery. Override the default port with the `PORT` environment variable if needed. Vercel handles production HTTPS and hosting. Never edit `out/`, `.next/`, or `node_modules/` as source fixes.

## Notebook growth

`lib/notebook.ts` owns card limits and archive URLs. `lib/post-index.ts` projects and sorts article summaries at build time; never import it into a Client Component. Homepage and related sections each receive at most three summaries. The notebook renders three articles per static archive page, at `/blog/` and `/blog/page/<number>/` starting at page 2. Archive pages have unique metadata, canonicals, sitemap entries, and ordinary next/previous links. Do not create a duplicate `/blog/page/1/` route.

`NotebookBrowser` receives only the current page's summaries, category names, and counts. It requests `/blog/search-index.json` on first search/category use, caches the summary-only index in memory, and paginates filtered results locally. Search controls have labels, live result counts, clear/retry actions, empty states, and keyboard-accessible pagination. Without JavaScript, server-rendered archive cards and links remain usable. Search/filter state is temporary, not a separate indexable URL. New content and archive pages require a rebuild.

The search index grows with the number of posts, but article bodies never enter it and initial page/card payloads stay bounded. For a very large archive, measure index size and filtering cost; consider partitioned static search or a worker before adding a backend. Do not describe a single downloadable index as infinitely scalable. Keep archive pagination as the crawlable fallback.

The homepage services section is server-rendered in `components/services.tsx` and passed into `Home` as a React node. Its conceptual previews and pointer/focus interactions use CSS, keeping the service content and icon definitions out of the homepage client module. Home reveal animations remain on separate outer wrappers.

## Visitor customization and selected avatar

`lib/typography.ts` owns local font stacks, six pairings, separate heading/body choices, and bounded article scale/line spacing. `Shell` migrates the legacy pairing string to a validated object stored under the same key. Colors and typography repaint in separate effects; storage is debounced by 400ms and flushed on `pagehide`. Blocked storage remains non-fatal. `TypographyControls` and `ColorPicker` load inside the deferred palette editor.

The opaque HSV picker uses pointer capture, keyboard controls, range alternatives, HEX/RGB/HSL validation, optional browser EyeDropper, and at most one color update per animation frame. It retains hue while dragging through black/white. `lib/color-picker.ts` contains its conversion helpers. Do not reintroduce the native color dialog, write storage per pointer event, or add alpha without revisiting the palette parser and contrast checks. The editor stays neutral and focus-contained even when the page becomes low contrast.

`ProfileAvatar` uses the owner-selected illustrated asset at `public/images/profile-avatar.png` in About and blog bylines, with dimensioned local images and a KS error fallback. It is an illustration, not an asserted photograph. Preserve the selected avatar’s origin URL in CONTENT.md; no image-CDN request occurs during visits.

## Museum-art moodboard

The owner removed the facts feature and cancelled the game request. `ArtGallery` now lives after the homepage article previews and on notebook archive pages. It renders three museum works in server HTML and deals a random set after hydration and on each manual click. The desk uses staggered cards, tape, palette-colored frames, artist/date card backs, museum links, and reduced-motion alternatives. Actual paintings are not recolored. Mobile cards are flat and long text wraps.

The Art Institute of Chicago API supplied a small 12-work collection cached on 14 October 2026. The museum’s documented hotlinks returned error pages from portfolio referrers in the development environment, while requests with the museum referrer returned JPEGs. Local caching was chosen for predictable runtime display, fast instant shuffling, and no visitor API dependency. `lib/art-collection.json` records artwork IDs, accurate title/artist/date, original image URLs, public-domain verification date, local image paths and actual dimensions. `lib/art-gallery.ts` exposes the deck and deals without repeating the immediately previous three works. The browser performs no museum API/image requests; pictures are dimensioned, locally hosted and lazy-loaded. Failed images retain captions, museum links, and explicit fallback text.

For collection maintenance, query the museum API for selected fields and `is_public_domain: true`, confirm every record and image, download conservatively one image at a time with a delay of at least one second, and use the documented 400px IIIF width for these cards. Update only source assets/metadata, preserve credits and originals, record true image dimensions, and rebuild. Use the response’s IIIF base when obtaining new assets. See [the museum API documentation](https://api.artic.edu/docs/) for caching, image sizes, public-domain status and permitted use. Do not turn this feature into a backend, live slideshow, game, trivia feed, or separate indexed art routes.

## Mobile performance maintenance

Measure the actual animated production build at mobile throttling; do not disable WebGL or detect audit tools to improve a score. Keep the hero frame height stable before, during and after module loading. Keep heading text painted during initial entrance motion. Reuse geometry and avoid expensive extrusion/normal rebuilding on every mesh mount. Keep work viewport/visibility-gated and respect reduced motion. Browser-native section reveals and CSS panel transitions retain the visual behavior without animation-engine downloads. `lib/use-reduced-motion.ts` subscribes to live preference changes with a server-safe snapshot. Use before/after reports from the same conditions, run measurements sequentially, and distinguish local lab results from deployed/field metrics.

Homepage sections after the hero use `content-visibility: auto` and a remembered intrinsic block size (900px initial estimate), so distant content can skip rendering while staying in server HTML. Reveal setup measures section boxes before inspecting children, avoiding forced layout in distant subtrees. Verify anchor links, keyboard focus, custom fonts, and scrolling after content changes; the browser replaces estimates with measured heights. The hero is excluded to preserve its overflow artwork. Fragment navigation disables containment via `:root:has(:target)` so browser-native anchor scrolling uses actual section heights, including after font changes.
