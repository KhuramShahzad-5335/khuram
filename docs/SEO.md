# SEO and indexing strategy

This guide describes the current portfolio's search strategy and maintenance requirements. Read it with [deployment instructions](DEPLOYMENT.md), [content publishing](CONTENT.md), and [release validation](VALIDATION.md). Owner instructions take precedence. Technical crawl readiness, confirmed Google indexing, and search performance are separate states.

## Purpose and audience

Help clients find Khuram's development services and project evidence, and help developers find useful articles about problems Khuram has actually solved. Prioritize accurate personal identity, helpful original writing, and a usable site. Do not promise rankings, indexing deadlines, or perfect SEO scores.

Use relevant terms naturally: Khuram Shahzad, software developer in Lahore, React/Next.js and MERN development, and specific article or project subjects. Each page should answer a distinct visitor need. Do not add repetitive keyword lists or change the owner's design into a generic search landing page.

## Current live condition

### Verified 29 October 2026

This audit supersedes the older live-status table below. Production is Vercel commit `98627bf` (`added more blogs`), matching local HEAD; Vercel reports Ready. Its overview showed 0% errors in the displayed six-hour window, not a guarantee about historical uptime.

- Live `/robots.txt` returns HTTP 200, allows `/` for all crawlers, and declares `https://www.khuramshahzad.dev/sitemap.xml`. `/robot.txt` (singular) is not the correct endpoint.
- The sitemap contains 64 canonical URLs, including all 30 published articles. All 64 URLs returned HTTP 200, matching canonical links, and no public-page `noindex` directives or `X-Robots-Tag` headers in this audit. RSS includes all 30 articles. The previously observed undersized sitemap is no longer present.
- Google Search Console's Sitemaps report says Success, last read 29 October, with 64 discovered URLs. Its Page indexing overview is older (last update 23 October): 16 indexed and 14 excluded. These totals predate the new article batch and must not be treated as the current per-URL state.
- The three redirect exclusions are the HTTP/non-www homepage variants, which correctly redirect to the canonical HTTPS www address. The one crawled-but-not-indexed URL is `/sitemap.xml`, not an article; it does not need to appear as a search result. Ten discovered-but-not-indexed examples are five experiments and five projects, all with no crawl date in that report.
- A live Google inspection of `/projects/dula/` passed: crawl allowed, successful fetch, indexing allowed, and correct declared canonical. Its index inspection still reported unknown to Google, despite appearing in the older discovery list. Discovery reports and inspection are not perfectly synchronized; a passing live test is eligibility, not proof of indexing.
- `/blog/ai-agent-costs-tokens-credits-budget/` is confirmed indexed in Google URL Inspection. Googlebot smartphone crawled it on 27 October and selected the inspected URL as canonical. The inspection's sitemap field displayed a temporary processing error, while the separate sitemap report was successful; this did not prevent that article from being indexed.
- Bing's saved homepage inspection reported a redirect from its 25 October crawl. Its 29 October live test instead said the URL can be indexed and found no SEO/GEO issues. A homepage indexing request was accepted. Bing's sitemap initially showed 26 URLs from 15 October; during the audit it changed to Processing with a 29 October submission date. Wait for processing before treating its old count as current. Bing's indexed-URL explorer returned no data; that alone does not establish an exact indexed-page total.
- Bing knew the AI agent costs article from 27 October but reported Discovered but not crawled. Its live test passed indexability and flagged one title-length issue: the generated title is 95 characters including the author suffix. Shortening this title is a search-presentation improvement, not a demonstrated crawl blocker; Google has already indexed the same URL. Bing's markup insights failed to load, so structured-data eligibility was not confirmed through that panel.
- Local `.env.local` was missing `NEXT_PUBLIC_SITE_URL`, so a fresh local build would have used the safe non-indexable fallback. The public production origin was added locally without changing secrets. Production already had the correct value. Do not remove the preview/missing-configuration safety guard.

Next checks: inspect priority article URLs individually, let Bing finish sitemap processing, and revisit Google's overview after its report date advances. Do not repeatedly validate intentional redirects, request indexing of the XML sitemap as a webpage, or submit all unchanged URLs in a loop. Improve unfinished case studies with factual, original detail, but do not label content quality as the proven cause of these exclusions. No universal indexing deadline is established.

### Historical check: 13 October 2026

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
| Published article content                                  | MongoDB `posts`, `lib/server/posts.ts`               |
| Server regression checks                                   | `scripts/check-config.mjs`, `scripts/check-site.mjs` |

The source now supports a Next.js Node server with MongoDB-backed articles and 60-second request-driven ISR. This architecture change does not itself prove deployment or indexing. Core article text is readable server HTML and does not depend on canvas, animation, clicks, or client fetching. Keep full article bodies out of homepage client bundles. See BLOG_DATABASE.md for publication, cache lag and rollback.

## Indexability contract

- Production builds need a valid `NEXT_PUBLIC_SITE_URL=https://www.khuramshahzad.dev` and must not use `VERCEL_ENV=preview`.
- Missing configuration, the fallback `https://example.com`, and Vercel Preview builds deliberately generate non-indexable directives. Invalid configured origins fail validation.
- Origin and deployment environment changes require rebuilding and deploying. Published article metadata and discovery endpoints refresh with the server-rendered content; editing the database does not repair incorrect deployment environment settings.
- Public useful routes belong in the sitemap with the chosen canonical HTTPS origin. Keep previews, errors, and private content out. Published posts are added automatically; their `lastModified` comes from actual publication/revision dates.
- Production's old welcome preview remains crawlable so its page-level noindex can be read. Do not block that URL in robots as a substitute for noindex.
- Redirect alternate hosts to the canonical origin through hosting configuration. A canonical tag does not replace a working redirect or repair duplicate routing.
- Confirm public access without authentication, challenge pages, accidental response-header noindex, or broken assets.

For Search Console verification, sitemap submission, and priority URL inspection, follow [DEPLOYMENT.md](DEPLOYMENT.md). The owner manages Google/Bing accounts and hosting. Record actual submission/results when confirmed; never mark these complete merely because files exist.

## On-page maintenance

For each public route:

1. Write a unique, accurate title and a useful description matching the page. Include the identity or subject where relevant; Google may choose different title links or snippets.
2. Keep a clear H1 and meaningful section headings, descriptive link text, readable prose, and conventional navigation. The server audit requires one H1 as this project's convention, not a claim that Google mandates it.
3. Link related articles and project stories where they help the reader. Use real anchors with reachable destinations; homepage section fragments are not separate indexable pages.
4. Keep canonical, Open Graph, Twitter, image URLs, and structured data consistent with the real page. Social preview tags improve sharing presentation; do not treat them as a ranking guarantee. Structured data must describe visible, factual information.
5. Use descriptive image alt text when useful, empty alt for purely decorative imagery, defined dimensions, and compressed source assets. Illustrative project previews must stay labeled as illustrations.
6. Preserve mobile usability, keyboard navigation, reduced-motion fallbacks, and readable server HTML. The hero WebGL work remains deferred and visibility-gated.

The loading screen was removed on 15 October 2026; content appears without an intro gate. Measure ordinary animation separately from reduced motion and avoid claiming maximum scores. Next Image remains unoptimized, so source asset compression remains important.

## Blog and project content strategy

Publish firsthand explanations: what the problem was, the constraints, decisions, implementation details, tradeoffs, and what was learned. Expand the existing starter articles and case-study drafts with real examples, original screenshots where permitted, code, and relevant sources. Do not manufacture contributions, client results, testimonials, or metrics.

Choose titles around concrete reader questions. Add useful related links and honest author/publication/revision dates. Edit Compass documents as drafts, validate with `npm run blog:validate`, then publish. Article routes, summaries, sitemap, RSS and markup refresh through ISR. New image files still need deployment. Keep slugs stable; implement redirects before renaming an established URL. The static-blog article describes the earlier architecture and remains historical content until deliberately revised.

## Off-page strategy

The pasted checklist largely addresses on-page and technical SEO; off-page work is ongoing promotion and reputation building.

- Maintain consistent identity and the canonical portfolio link on GitHub, LinkedIn, and other genuine professional profiles. Verify their current links rather than assuming older profile edits remain correct.
- Share useful article and project URLs with relevant communities when appropriate, following their rules. Explain what readers will learn instead of distributing the same promotional message everywhere.
- Earn relevant references through useful tutorials, open-source contributions, collaboration, and client-approved case studies. Ask collaborators to link only where it provides real context.
- Avoid bulk directory submissions, purchased ranking links, fabricated endorsements, and spam comments. Do not promise backlinks or domain-authority targets.
- Do not automatically post, message people, buy placements, or modify external profiles without owner authorization. This strategy document grants no such authorization.

## Release and monitoring workflow

Before shipping SEO/content changes, run `npm run check` with production configuration, review the production server output, and verify the live deployment afterward. The existing server audit checks metadata, canonical consistency, sitemap routes, internal links, structured data parsing, RSS membership, and intentional draft exclusion. It is not Google's Rich Results Test and does not prove eligibility for a rich result.

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

## Search appearance follow-up — 14 October 2026

The owner reports submitting the site for Google indexing. Their screenshot shows the homepage for the specific query `khuramshahzad self employed developer from lahore`, with the intended name/role/city title and a matching snippet. This confirms an observed appearance for that query; it does not establish ranking for the shorter name query, total indexed pages, or Search Console verification. Other people in the screenshot are namesakes, not evidence of Khuram’s employment or profiles.

Public HTTP checks on 14 October verified HTTP and non-www redirects to `https://www.khuramshahzad.dev/`, index/follow homepage and blog HTML, the intended canonicals, and a live sitemap with 26 URLs. The sampled live pages still advertised only the SVG icon. These checks describe the deployment before this follow-up’s source changes.

The source now uses `Khuram Shahzad` as the WebSite name, with `Khuram Shahzad Portfolio` as an alternative, matching the existing Open Graph site name. The homepage description mentions projects and articles. Header and footer navigation use descriptive Projects, Blog/Notebook, and Experiments links. Footer links remain readable without JavaScript. A bold monochrome KS mark uses vector outlines, so it does not depend on font rendering. Stable 96×96 PNG and 180×180 Apple icons are rendered from `public/icon.svg`; regenerate both when the SVG changes. The sitemap already includes articles and archive pages and needs no manual URL additions for this change. Deploy before treating any of this as live.

Google selects [sitelinks](https://developers.google.com/search/docs/appearance/sitelinks) automatically based on useful structure and query relevance. There is no setting or special sitelink schema that forces Projects or Blog underneath a result. Do not add obsolete SearchAction markup to promise a sitelinks search box. Use concise titles/headings, real contextual links, and substantive pages. Homepage fragments such as Services and Contact are useful navigation but are not separate pages.

The [site-name preference](https://developers.google.com/search/docs/appearance/site-names) uses homepage WebSite markup and consistent naming. [Favicon eligibility](https://developers.google.com/search/docs/appearance/favicon-in-search) needs a crawlable, stable square icon in a supported format; PNG improves compatibility over the previous SVG-only declaration. Neither preference guarantees Google’s chosen display.

After deploying, inspect the homepage, `/blog/`, `/projects/`, and priority articles in Search Console. Confirm the Google-selected canonical and indexing state, test the live URL, and request indexing for the changed priority pages. Keep the existing sitemap submitted; monitor its processed state rather than repeatedly submitting unchanged files. Keep genuine LinkedIn/GitHub links pointing to the canonical portfolio. Do not create thin duplicate pages or change established URLs merely to pursue sitelinks. Record query/date/device/location when comparing later results. The personal SEO article retains the dated observation and remaining uncertainties.

## IndexNow — 15 October 2026

Source setup now includes an ownership key file, `indexnow.config.json`, and a manual `npm run indexnow` helper. The default is a local dry run; `--submit` validates the deployed key before notifying the global endpoint. Initial deployment/submission is not confirmed by creating these files. Use it for new or substantive updated content, not traffic generation or repeated unchanged submissions. This complements the existing sitemap and Google Search Console workflow; it does not submit ordinary blog pages through Google’s restricted Indexing API or guarantee indexing. Follow DEPLOYMENT.md for the exact workflow and record actual HTTP results after deployment.
