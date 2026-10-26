# Khuram Shahzad — Portfolio & Notebook

A portfolio and MongoDB-backed notebook for a self-employed software developer in Lahore. Built for clients, fellow developers, and curious visitors: clear navigation, practical project stories, a dark visual system, editable palettes and local font pairings, and a little developer humor.

**Live site:** [khuramshahzad.dev](https://www.khuramshahzad.dev/) · [GitHub](https://github.com/KhuramShahzad-5335) · [LinkedIn](https://www.linkedin.com/in/khuram-shahzad-0814b1230/)

## Start here

Use Node.js **22.13 or later** and npm. The app is at the repository root; there is no nested `portfolio/` app.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For a production-style preview:

```sh
npm run check:config
npm run typecheck
npm run format:check
npm run build
npm run check:site
npm start
```

`npm start` runs the production Next.js server on localhost. It requires a successful build. Configure `MONGODB_URI` in `.env.local`; the database defaults to `portfolio`, collection `posts`. The same user handles runtime reads and migration. See [database setup, migration and publishing](docs/BLOG_DATABASE.md). `npm run check` runs all release checks in sequence. `npm run format` formats maintained source and documentation.

## Stack and architecture

Next.js App Router, React, TypeScript, Tailwind CSS 4, Three.js with React Three Fiber/Drei, and Vercel Analytics/Speed Insights. Versions are recorded in `package.json`; reproducible installs use `package-lock.json`.

The site runs on the Next.js Node runtime. Blog content comes from MongoDB and renders into crawlable HTML with 60-second, request-driven incremental regeneration. New article URLs work without a rebuild. The protected /studio/ is the owner editor; Compass is an alternative. All write operations require an owner session. Sitemap, RSS and search follow the same publication rules. Contact actions open email, telephone, WhatsApp, or social links.

```text
app/                  Route composition, metadata, global CSS, cached feed
components/           Site shell, interactive features, reusable presentation
lib/                  Typed content, article helpers, palettes, SEO settings
styles/               Shared section patterns, illustrations, and animation
public/               Local illustrations, social images, verification files
scripts/              Database migration, server audit, validation utilities
docs/                Design, architecture, content and deployment guides
```

## Where to make changes

| Change                                             | Source                                                     |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Public identity, canonical domain, indexing rules  | `lib/site.ts`, `docs/BLOG_DATABASE.md`                     |
| Project/experiment cards, technologies             | `lib/content.ts`                                           |
| Project case studies                               | `lib/journeys.ts`                                          |
| Live articles and publication dates                | MongoDB `portfolio.posts`, `lib/server/posts.ts`           |
| Migration snapshot and document validation         | `lib/posts.ts`, `lib/post-record.ts`                       |
| Word count, reading time, card summaries           | `lib/blog.ts`                                              |
| Home copy, contact details, commented testimonials | `components/home.tsx`                                      |
| Services, conceptual previews                      | `components/services.tsx`, `styles/services.css`           |
| Header/footer                                      | `components/site-header.tsx`, `components/site-footer.tsx` |
| Theme colors and generators                        | `lib/palettes.ts`, `components/palette-editor.tsx`         |

The homepage previews three recent articles. The notebook has server-rendered archive pagination, search, and topic filters; search requests return one bounded page of summaries. Full articles stay outside the homepage browser bundle. The hero Three.js scene loads near its viewport and stops when offscreen or the browser tab is hidden. Reduced-motion visitors get static alternatives. Theme settings are stored only in the visitor's browser, with graceful fallback when storage is blocked.

## Documentation

- [Architecture and contributor workflow](docs/ARCHITECTURE.md)
- [Design system and interaction requirements](docs/DESIGN_SYSTEM.md)
- [Publishing articles and maintaining content](docs/CONTENT.md)
- [MongoDB setup, migration, Compass publishing and rollback](docs/BLOG_DATABASE.md)
- [Deployment, indexing, and launch checks](docs/DEPLOYMENT.md)
- [SEO strategy, live condition, and maintenance](docs/SEO.md)
- [Release validation and limitations](docs/VALIDATION.md)
- [Agent handoff instructions](AGENTS.md)

These maintained guides describe the current site. Obsolete planning drafts have been removed; owner instructions take precedence.

## Publishing and Google indexing

Set `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin in Vercel's **Production** environment, then rebuild. Missing configuration deliberately generates `noindex`; Vercel Preview builds also stay `noindex`. Optional HTML verification variables are `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`.

The server generates canonical links, social previews, structured data, `robots.txt`, `sitemap.xml`, and `feed.xml`. Follow the [deployment guide](docs/DEPLOYMENT.md) to verify the live domain and submit the sitemap to search engines. Crawl readiness does not guarantee ranking or an indexing date.

## Content accuracy and performance

Project artwork is clearly labeled as illustrative. Some case studies are editable drafts with unverified details. Testimonials remain commented out; do not publish invented endorsements, claims, metrics, or contributions. Replace placeholders with evidence before presenting them as final work.

The loading screen was removed at the owner’s request on 15 October 2026. Content is visible immediately on initial visits and reloads, with no intro overlay or timed content gate. Section reveals remain, and 3D stays visibility-gated. Measure production pages rather than claiming guaranteed 100/100 results.

Keep private documents, resumes, credentials, generated build folders, and temporary QA artifacts out of this repository. Source assets and maintained documentation belong here. Review Vercel analytics privacy requirements for the intended audience before adding further tracking.

The GitHub quality workflow runs the same release checks on pushes and pull requests. Palette checks sample generated colors against both page and panel backgrounds.

Typography settings live in `lib/typography.ts`; the editor provides six local pairings, heading/body choices, and article reading controls. `components/color-picker.tsx` replaces native color dialogs with HSV controls and HEX/RGB/HSL entry. The owner-selected avatar is local; no image CDN dependency is needed at runtime. See the architecture guide for storage timing, migration, API timeouts, and fallback behavior.

## IndexNow and search discovery

**Latest owner-reported result — 15 October 2026:** the command verified the live ownership file and submitted 26 canonical URLs. IndexNow returned **HTTP 202**: URLs received, with search-engine key validation still pending. This is submission evidence, not confirmed crawling, indexing, rankings, or traffic.

1. Keep the verification file defined by `indexnow.config.json` deployed at its existing public URL. Do not remove or regenerate it after submission.
2. Add or verify the site in [Bing Webmaster Tools](https://www.bing.com/webmasters/) and submit [the production sitemap](https://www.khuramshahzad.dev/sitemap.xml).
3. Continue using [Google Search Console](https://search.google.com/search-console/) separately. Submit the same sitemap if needed, inspect priority pages, and monitor indexing, impressions, and clicks. IndexNow does not replace this workflow.
4. Publish useful original articles, link related pages, and share them with relevant audiences. Search-engine notification alone does not bring visitors.

For a new or meaningfully updated article, publish through the studio, or validate and publish the Compass document. Wait for the public article and sitemap to refresh. Studio Blob uploads need no deployment; new local image files or code still require a deployment. Then submit only the live changed page, replacing the example path with its actual canonical path:

```sh
npm run indexnow -- --submit /blog/your-article-slug/
```

Multiple page paths can be supplied together. The helper requires live sitemap membership. `npm run indexnow` performs read-only requests to the live robots and sitemap but submits no URLs; `npm run indexnow -- --submit` submits all current sitemap URLs. Do not repeatedly resubmit the full sitemap or run it just to check indexing status.

HTTP **200** means received; **202** means received with key validation pending. Neither guarantees indexing. If the live ownership file returns **404**, include `public/<key>.txt` in the Git push and deploy it before retrying; a local build does not update the live site. A **403** requires checking the key file; a **429** requires backing off.

See [the deployment and troubleshooting guide](docs/DEPLOYMENT.md) and [official IndexNow documentation](https://www.indexnow.org/documentation).

Mobile performance: section reveals use native browser animation and process-panel transitions use CSS. The hero retains its complete interactive model, but shares cheaper rounded geometry, uses a mobile pixel ratio of 1, and initializes after an idle opportunity. Its fallback reserves the full frame during module loading. See [architecture performance notes](docs/ARCHITECTURE.md) before changing animation or scene loading.

## Private article editor

Open /studio/ directly after running npm run studio:password and restarting the server. The owner-only editor supports drafts, preview, sections, sources and publishing with cache refresh. It is not linked publicly. See [studio setup and security](docs/STUDIO.md). Add STUDIO_PASSWORD_HASH privately to Vercel and redeploy to enable the live editor. Upload images through the studio without deploying; local image files still require deployment.

Blog image uploads use public Vercel Blob and the existing studio owner session. Configure private `BLOB_READ_WRITE_TOKEN`; see [the studio upload workflow](docs/STUDIO.md#image-uploads-with-vercel-blob). Uploaded images are public even for drafts.

## Notebook reliability and recovery

The archive uses one detailed card per row and visible topic buttons. Homepage and related-article previews stay compact. Search is debounced, cancellable, paginated on the server, and never downloads article bodies. Old archive links remain crawlable without JavaScript.

- `npm run check` includes content, backup-format, type, formatting, production-build and route checks.
- `npx playwright install chromium`, then `npm run check:browser` runs mobile, keyboard, search failure/retry, palette, reload and no-JavaScript checks against a production build. CI runs these with the file snapshot. Optional `CHROME_BINARY` selects an existing Chrome executable.
- `npm run check:studio:integration` uses the configured MongoDB connection to create and remove uniquely named temporary databases. It checks owner authentication, pagination, conflict protection, history, Trash, and an actual backup/restore drill. It never writes to the configured portfolio database; the database user needs permission to create temporary databases. CI uses its own temporary MongoDB service, without production credentials.
- `npm run blog:backup -- "../portfolio-backup.json"` exports articles, drafts, Trash and saved versions to a new file outside this repository.
- `npm run blog:restore -- "../portfolio-backup.json" --target portfolio_recovery` validates a restore into a separate empty database. Add `--apply` only after reviewing the dry run.

See [database recovery](docs/BLOG_DATABASE.md#backup-and-recovery) and [studio recovery controls](docs/STUDIO.md#saved-versions-and-trash). Automatic Atlas backups still need to be enabled in the owner's account; local exports are not a scheduled backup service.
