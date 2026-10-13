# SEO and indexing strategy

This guide describes the current portfolio's search strategy and maintenance requirements. Read it with [deployment instructions](DEPLOYMENT.md), [content publishing](CONTENT.md), and [release validation](VALIDATION.md). Owner instructions take precedence. Technical crawl readiness, confirmed Google indexing, and search performance are separate states.

## Purpose and audience

Help clients find Khuram's development services and project evidence, and help developers find useful articles about problems Khuram has actually solved. Prioritize accurate personal identity, helpful original writing, and a usable site. Do not promise rankings, indexing deadlines, or perfect SEO scores.

Use relevant terms naturally: Khuram Shahzad, software developer in Lahore, React/Next.js and MERN development, and specific article or project subjects. Each page should answer a distinct visitor need. Do not add repetitive keyword lists or change the owner's design into a generic search landing page.

## Current live condition

Public HTTP checks on **13 October 2026** verified:

| Item                                 | Observed condition                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical origin                     | `https://www.khuramshahzad.dev`                                                                                                                   |
| Sitemap                              | `/sitemap.xml` responds HTTP 200 and lists 24 canonical URLs                                                                                      |
| Crawl rules                          | `/robots.txt` responds HTTP 200, allows `/`, and names the sitemap                                                                                |
| Homepage, blog index, sample article | HTTP 200; titles, descriptions, H1s, canonicals, and Open Graph metadata are present in the returned HTML                                         |
| Sample public page directives        | `index, follow`                                                                                                                                   |
| Old `/blog/welcome/` preview         | HTTP 200 with `noindex, nofollow`; intentionally absent from the sitemap                                                                          |
| Hosting robot header                 | No `X-Robots-Tag` was returned on the sampled robots, sitemap, and preview responses                                                              |
| Search Console status                | Owner is setting up indexing; ownership verification, successful sitemap processing, and indexed-page totals have not been independently verified |
| Off-page links and search results    | Not audited in this check                                                                                                                         |

These are dated observations, not permanent guarantees or a full crawl of production. Recheck after deployments and domain changes. Search Console's Page indexing and URL Inspection reports determine Google's reported state; a sitemap returning 200 does not prove indexing.

**Implemented in source on 13 October 2026:** the homepage now declares the absolute title `Khuram Shahzad — Software Developer in Lahore`, uses the same title for its Open Graph/Twitter previews, and introduces Khuram by full name, self-employment, and Lahore in visible hero copy. The global description also includes his full name. The absolute title avoids duplicating his name through the shared title template. Deploy the updated build before treating this as live; the observations above describe the earlier deployment.

## Implementation ownership

| Concern                                                    | Source                                               |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| Public identity, canonical origin, build indexability      | `lib/site.ts`                                        |
| Global metadata, language, verification tokens             | `app/layout.tsx`                                     |
| Per-page canonical, description, Open Graph/Twitter fields | `lib/metadata.ts` and route metadata exports         |
| Article metadata and BlogPosting markup                    | `app/blog/[slug]/page.tsx`                           |
| Person and WebSite markup                                  | `app/page.tsx`                                       |
| Public route discovery                                     | `app/sitemap.ts`                                     |
| Crawl policy                                               | `app/robots.ts`                                      |
| RSS                                                        | `app/feed.xml/route.ts`                              |
| Published article content                                  | `lib/posts.ts`                                       |
| Export regression checks                                   | `scripts/check-config.mjs`, `scripts/check-site.mjs` |

The site is a static export. Server Components generate readable content at build time; browser JavaScript enhances it. Core article text must not depend on a canvas, animation, click, or client fetch. Keep full article bodies out of homepage client bundles. Do not describe the deployment as requiring a live rendering server or backend.

## Indexability contract

- Production builds need a valid `NEXT_PUBLIC_SITE_URL=https://www.khuramshahzad.dev` and must not use `VERCEL_ENV=preview`.
- Missing configuration, the fallback `https://example.com`, and Vercel Preview builds deliberately generate non-indexable directives. Invalid configured origins fail validation.
- Metadata and crawl rules are baked into the export. Changing a Vercel variable requires rebuilding and deploying; uploading a previously non-indexable export elsewhere does not repair it.
- Public useful routes belong in the sitemap with the chosen canonical HTTPS origin. Keep previews, errors, and private content out. Published posts are added automatically; their `lastModified` comes from actual publication/revision dates.
- Production's old welcome preview remains crawlable so its page-level noindex can be read. Do not block that URL in robots as a substitute for noindex.
- Redirect alternate hosts to the canonical origin through hosting configuration. A canonical tag does not replace a working redirect or repair duplicate routing.
- Confirm public access without authentication, challenge pages, accidental response-header noindex, or broken assets.

For Search Console verification, sitemap submission, and priority URL inspection, follow [DEPLOYMENT.md](DEPLOYMENT.md). The owner manages Google/Bing accounts and hosting. Record actual submission/results when confirmed; never mark these complete merely because files exist.

## On-page maintenance

For each public route:

1. Write a unique, accurate title and a useful description matching the page. Include the identity or subject where relevant; Google may choose different title links or snippets.
2. Keep a clear H1 and meaningful section headings, descriptive link text, readable prose, and conventional navigation. The export audit requires one H1 as this project's convention, not a claim that Google mandates it.
3. Link related articles and project stories where they help the reader. Use real anchors with reachable destinations; homepage section fragments are not separate indexable pages.
4. Keep canonical, Open Graph, Twitter, image URLs, and structured data consistent with the real page. Social preview tags improve sharing presentation; do not treat them as a ranking guarantee. Structured data must describe visible, factual information.
5. Use descriptive image alt text when useful, empty alt for purely decorative imagery, defined dimensions, and compressed source assets. Illustrative project previews must stay labeled as illustrations.
6. Preserve mobile usability, keyboard navigation, reduced-motion fallbacks, and readable server HTML. The hero WebGL work remains deferred and visibility-gated.

The loader intentionally delays visible content on each reload. Preserve its agreed behavior, measure the ordinary animated experience separately from reduced-motion runs, and avoid claiming maximum speed scores. Static export uses unoptimized Next Image; source asset compression remains important.

## Blog and project content strategy

Publish firsthand explanations: what the problem was, the constraints, decisions, implementation details, tradeoffs, and what was learned. Expand the existing starter articles and case-study drafts with real examples, original screenshots where permitted, code, and relevant sources. Do not manufacture contributions, client results, testimonials, or metrics.

Choose titles around concrete reader questions rather than vague updates. Add useful related links and an honest author/publication/revision date. Publishing is currently source-based: update `lib/posts.ts`, validate, rebuild, and deploy. This automatically updates the article route, summaries, sitemap, RSS, and article markup. Keep slugs stable; plan redirects before renaming an established URL.

## Off-page strategy

The pasted checklist largely addresses on-page and technical SEO; off-page work is ongoing promotion and reputation building.

- Maintain consistent identity and the canonical portfolio link on GitHub, LinkedIn, and other genuine professional profiles. Verify their current links rather than assuming older profile edits remain correct.
- Share useful article and project URLs with relevant communities when appropriate, following their rules. Explain what readers will learn instead of distributing the same promotional message everywhere.
- Earn relevant references through useful tutorials, open-source contributions, collaboration, and client-approved case studies. Ask collaborators to link only where it provides real context.
- Avoid bulk directory submissions, purchased ranking links, fabricated endorsements, and spam comments. Do not promise backlinks or domain-authority targets.
- Do not automatically post, message people, buy placements, or modify external profiles without owner authorization. This strategy document grants no such authorization.

## Release and monitoring workflow

Before shipping SEO/content changes, run `npm run check` with production configuration, review the export, and verify the live deployment afterward. The existing export audit checks metadata, canonical consistency, sitemap routes, internal links, structured data parsing, RSS membership, and intentional draft exclusion. It is not Google's Rich Results Test and does not prove eligibility for a rich result.

After deployment, inspect the affected live URLs, sitemap, robots, canonical/social assets, and response headers. Use Search Console to monitor indexing exclusions, impressions, clicks, queries, and click-through rate. Review page-level trends after there is sufficient data; no fixed indexing deadline or immediate ranking increase is promised. Use field Core Web Vitals and production lab measurements to diagnose real bottlenecks.

Keep status notes factual: date, deployed URL/revision when known, checks performed, and remaining uncertainty. Search Console account status and field performance remain unknown until actual reports are inspected. Do not present local build checks as proof of Google indexing.

## Primary references

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): helpful content, clear titles/descriptions, relevant links, and website promotion.
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): rendering and crawlable content.
- [Google technical requirements](https://developers.google.com/search/docs/essentials/technical): basic eligibility, without guaranteed indexing.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): sitemap maintenance and discovery.
- [Google link spam policy](https://developers.google.com/search/docs/essentials/spam-policies#link-spam): avoid manipulative link building.

## Published guide and ongoing evidence

The source article `/blog/personal-seo-rank-your-name/` explains this strategy through Khuram's ongoing case study. Maintain its dated progress log using `CONTENT.md`. Adding it increases the generated sitemap from the observed live baseline of 24 routes to 25; deploy and verify the live export before reporting that new count as public. Query-volume and ranking changes are unmeasured until real reporting data is available.

## Archive discovery

Notebook pagination uses indexable static routes: `/blog/` and `/blog/page/2/` onward as needed. Every archive page links to its articles and neighboring pages, has a unique title/canonical, and appears in the sitemap. The first page is never duplicated at `/blog/page/1/`. Homepage and related cards remain bounded; they are previews, not the only discovery path. Search filters are browser-local views and do not replace archive links or create additional canonical pages. The summary-only JSON search index is a utility asset, not a sitemap page. Article RSS entries are unchanged by pagination.
