# Architecture and developer workflow

## Runtime model

This is a Next.js App Router static export. Server Components run at build time and produce crawlable HTML and navigation payloads; client boundaries implement state, browser preferences, animation, and WebGL. Pages accept asynchronous `params` under the installed Next.js conventions. Read the relevant guides in `node_modules/next/dist/docs/` before changing Next APIs.

Keep route files focused on composition, static route generation, and metadata. Keep content in typed `lib/` modules and reusable UI in `components/`. Avoid adding abstraction layers without multiple real uses. Do not introduce a backend, authentication, CMS, or route handlers requiring a live server. The RSS GET handler is `force-static` and generates a file at build time.

## Important boundaries

- `app/layout.tsx` owns language, global metadata, analytics, skip navigation, and the shared shell. The footer remains server-rendered and is passed into the client shell.
- `components/shell.tsx` coordinates the intro and palette state. Header navigation and the lazily imported editor have separate responsibilities.
- `lib/site.ts` validates the deployment origin and centrally defines identity/indexing decisions. `lib/metadata.ts` keeps canonical and sharing fields aligned.
- `lib/posts.ts` contains article bodies. Only build-time route modules import it. `lib/blog.ts` supplies small shared types, counts, dates, and summary projection. Pass summaries to client components rather than importing entire article records there.
- `ScenePreview` waits for the loader’s `portfolio:intro-complete` event and defers the heavy 3D component until near the viewport, uses a stable-height fallback, and unmounts the hero scene offscreen, on hidden tabs, and for reduced motion. Each actual scene checks WebGL support.
- Home scroll reveals import GSAP/ScrollTrigger asynchronously. Cleanup cancels work after unmount and reverts animations. Avoid multiple animation libraries owning the same property.

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

Review desktop and mobile layouts, keyboard navigation, menu close behavior, palette focus containment/Escape/reset/persistence, process arrow-key navigation, WebGL fallback, reduced motion, and JavaScript-disabled reading. Check the loader on reload, Escape, and normal completion: content remains hidden until the loader opacity reaches zero, then fades in and becomes interactive. Check background-tab scene behavior and console errors.

Measure Lighthouse against the production export and record device/mode, URL, score, and date. Inspect field Core Web Vitals in Search Console/Speed Insights after deployment; local lab scores are not field data. An active loader materially changes LCP. Never label a reduced-motion run as the ordinary animated experience.

## Extending the site

New public routes need unique metadata, a canonical, a sitemap entry, useful internal navigation, and real content. New client features must clean up timers/listeners/observers, handle blocked storage/network failures, and respect reduced motion. New raster images should be compressed, dimensioned, locally hosted where appropriate, and have meaningful alt text. Static export uses unoptimized Next Image: it cannot resize raster assets on demand.

The local preview server is for development only, binds to localhost, and serves `out/`. It compresses text responses and caches hashed Next assets to approximate production delivery. Override the default port with the `PORT` environment variable if needed. Vercel handles production HTTPS and hosting. Never edit `out/`, `.next/`, or `node_modules/` as source fixes.
