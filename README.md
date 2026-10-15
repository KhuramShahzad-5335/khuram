# Khuram Shahzad — Portfolio & Notebook

A static portfolio for a self-employed software developer in Lahore. Built for clients, fellow developers, and curious visitors: clear navigation, practical project stories, a dark visual system, editable palettes and local font pairings, and a little developer humor.

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

`npm start` serves the generated `out/` directory locally. It requires a successful build. `npm run check` runs all release checks in sequence. `npm run format` formats maintained source and documentation.

## Stack and architecture

Next.js App Router, React, TypeScript, Tailwind CSS 4, GSAP, Framer Motion, Three.js with React Three Fiber/Drei, and Vercel Analytics/Speed Insights. Versions are recorded in `package.json`; reproducible installs use `package-lock.json`.

The site uses `output: "export"`. Routes, metadata, articles, RSS, robots, and sitemap are generated at build time. There is no custom backend, database, account system, CMS, or contact submission service. The homepage and notebook include an interactive museum-art moodboard; a small public-domain collection is cached from the Art Institute of Chicago API, with instant local shuffling. Contact actions open email, telephone, WhatsApp, or social links.

```text
app/                  Route composition, metadata, global CSS, static feed
components/           Site shell, interactive features, reusable presentation
lib/                  Typed content, article helpers, palettes, SEO settings
styles/               Shared section patterns, illustrations, and animation
public/               Local illustrations, social images, verification files
scripts/              Static preview, export audit, blog artwork generation
docs/                Design, architecture, content and deployment guides
```

## Where to make changes

| Change                                             | Source                                                     |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Public identity, canonical domain, indexing rules  | `lib/site.ts`, `.env.example`                              |
| Project/experiment cards, technologies             | `lib/content.ts`                                           |
| Project case studies                               | `lib/journeys.ts`                                          |
| Articles and publication dates                     | `lib/posts.ts`                                             |
| Word count, reading time, card summaries           | `lib/blog.ts`                                              |
| Home copy, contact details, commented testimonials | `components/home.tsx`                                      |
| Services, conceptual previews                      | `components/services.tsx`, `styles/services.css`           |
| Header/footer                                      | `components/site-header.tsx`, `components/site-footer.tsx` |
| Theme colors and generators                        | `lib/palettes.ts`, `components/palette-editor.tsx`         |

The homepage previews three recent articles. The notebook has static archive pagination, search, and topic filters; its search index downloads only when used. Full articles stay outside the homepage browser bundle. The hero Three.js scene loads near its viewport and stops when offscreen or the browser tab is hidden. Reduced-motion visitors get static alternatives. Theme settings are stored only in the visitor's browser, with graceful fallback when storage is blocked.

## Documentation

- [Architecture and contributor workflow](docs/ARCHITECTURE.md)
- [Design system and interaction requirements](docs/DESIGN_SYSTEM.md)
- [Publishing articles and maintaining content](docs/CONTENT.md)
- [Deployment, indexing, and launch checks](docs/DEPLOYMENT.md)
- [SEO strategy, live condition, and maintenance](docs/SEO.md)
- [Release validation and limitations](docs/VALIDATION.md)
- [Agent handoff instructions](AGENTS.md)

The original requirements, content drafts, and repository inventory in `docs/` are historical planning references. The implementation guides above describe the current site and take precedence over outdated proposals. Owner instructions take precedence over both.

## Publishing and Google indexing

Set `NEXT_PUBLIC_SITE_URL` to the final public HTTPS origin in Vercel's **Production** environment, then rebuild. Missing configuration deliberately generates `noindex`; Vercel Preview builds also stay `noindex`. Optional Google/Bing HTML verification tokens are documented in `.env.example`.

The export includes canonical links, social previews, structured data, `robots.txt`, `sitemap.xml`, and `feed.xml`. Follow the [deployment guide](docs/DEPLOYMENT.md) to verify the live domain and submit the sitemap to search engines. Crawl readiness does not guarantee ranking or an indexing date.

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

For a new or meaningfully updated article, build with production configuration, run the release checks, push, and wait for the Vercel Production deployment to succeed. Then submit only the deployed changed page, replacing the example path with its actual canonical path:

```sh
npm run indexnow -- --submit /blog/your-article-slug/
```

Multiple page paths can be supplied together. The helper requires current sitemap membership. `npm run indexnow` is a local dry run with no network requests; `npm run indexnow -- --submit` submits all current sitemap URLs and was used for the initial submission. Do not repeatedly resubmit the full sitemap or run it just to check indexing status.

HTTP **200** means received; **202** means received with key validation pending. Neither guarantees indexing. If the live ownership file returns **404**, include `public/<key>.txt` in the Git push and deploy it before retrying; a local build does not update the live site. A **403** requires checking the key file; a **429** requires backing off.

See [the deployment and troubleshooting guide](docs/DEPLOYMENT.md) and [official IndexNow documentation](https://www.indexnow.org/documentation).

Mobile performance: section reveals use native browser animation and process-panel transitions use CSS. The hero retains its complete interactive model, but shares cheaper rounded geometry, uses a mobile pixel ratio of 1, and initializes after an idle opportunity. Its fallback reserves the full frame during module loading. See [architecture performance notes](docs/ARCHITECTURE.md) before changing animation or scene loading.
