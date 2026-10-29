# Content and blog publishing

For AI-assisted editorial standards, the October research collection, and advertising readiness, see [ADSENSE.md](ADSENSE.md). Public readers can inspect `/editorial/` and contact the publisher about corrections. Topic popularity is a research hypothesis until actual search data supports it.

Before drafting or revising, follow the editorial quality gate, evidence labels, keyword research workflow, and article-brief requirements in [ADSENSE.md](ADSENSE.md#editorial-quality-gate-owner-requirement-29-october-2026). The owner's million-impressions-per-day rule applies to **new topics**, requires daily evidence across a week, and must not prevent quality improvements to existing articles. Do not infer niche demand from a parent keyword's total or claim firsthand testing that was not performed.

Current publishing uses MongoDB with a private studio and Compass, approved on 26 October 2026. Follow [BLOG_DATABASE.md](BLOG_DATABASE.md) for credentials, migration, document validation, draft/publication rules, cache timing, images and rollback. See [KEYWORD_RESEARCH.md](KEYWORD_RESEARCH.md) for dated Google/Bing observations, limitations and topic decisions.

## Tables and visual variety

Use a table for comparisons, evidence ledgers and verification worksheets. Sections support an optional `table` with a descriptive `caption`, 2–6 `headers` and 1–40 `rows` of matching plain-text cells. Published cells and headings must be filled; label unknowns explicitly instead of leaving a blank that could be mistaken for zero. The first column labels rows. The studio includes row/column controls and a preview. Tables render as semantic server HTML with a keyboard-focusable horizontal scroll region on narrow screens. Table text contributes to article and database-summary reading counts.

Prefer topic-specific illustrations over a repeated headline-card template: receipts for cost arithmetic, storyboards for video planning, and state diagrams for approvals. Conceptual covers are not product screenshots, empirical graphs or evidence of firsthand testing; make this clear in alt text/captions. Upload compressed WebP covers to Blob and retain editable originals outside Git. Preserve old Blob objects while backups or saved revisions reference them.

The October 29 revision introduces 30 distinct cover compositions, each 1200×720 and under 26 KB. Content and images refresh through MongoDB/Blob; the table renderer and editor controls require code deployment. Until then, the previous renderer ignores the optional table field. Avoid saving table-bearing articles through an older studio, which cannot preserve that field.

## Sources and voice

Use accurate, specific language with occasional understated humor. Khuram is currently self-employed in Lahore. Confirmed employment dates: self-employed January 2025–present; Officiallabs August 2024–December 2025; Hashtag Web September 2023–September 2024; Techixen January 2022–April 2024. Overlapping periods are intentional and must not be silently changed.

Project records belong in `lib/content.ts`; expanded narratives belong in `lib/journeys.ts`. Every project slug needs a matching journey. Keep categories, confirmed technology stacks, source/demo links, and uncertainty notes accurate. Current conceptual previews are illustrations, not screenshots. Draft case studies and learning projects must remain clearly identified; do not invent completion dates, metrics, ownership, or claims based only on a dependency list.

The owner's placeholder testimonial section is commented out. Keep it disabled until real quotes and permission are supplied or the owner explicitly asks otherwise. Historic requirements and drafts provide background, not current authorization to revive removed ideas.

## Add an article

1. Upload cover and inline illustrations through /studio/. The editor resizes and compresses files, saves their Blob URLs, and keeps alt text and captions editable. There are no manual image paths or URL inputs. Blog images are stored in Blob; editable originals are archived outside the repository. See [STUDIO.md](STUDIO.md).
2. Create a document in `portfolio.posts` with `status: "draft"`, a unique slug, title, excerpt, category, actual publication date string (`YYYY-MM-DD`), image, imageAlt, intro, sections and sources. Each section needs a unique id, title, paragraphs and optional code/image. `lib/posts.ts` is the retained migration snapshot, not the live editor. Only published records whose dates have arrived are public.
3. For meaningful revisions, add/update `updatedAt` with the actual revision date. Do not automatically stamp all pages with today's date.
4. Review spelling, factual accuracy, sources, internal anchors, mobile reading, and code examples. Use original words and attribution where needed.
5. Run `npm run blog:validate`, then set `status` to `published`. Inspect the live article and discovery endpoints after caches regenerate. For code or new image files, also run `npm run check`, review with `npm start`, and deploy through Vercel.

Publishing a post makes `/blog/<slug>/`, archive/home cards, related links, BlogPosting metadata, sitemap membership and RSS available through server rendering and regeneration. Database-only edits do not need a rebuild. The protected /studio/ editor supports writing, image uploads and publishing.

Word counts include the introduction, section headings, and paragraphs. They exclude code, captions, source labels, title, and excerpt. Reading time is a minimum of one minute at 200 words per minute. Counts are calculated server-side from the current article and passed as small card summaries.

`/blog/welcome/` is an old reading-layout preview. It remains `noindex` and excluded from the sitemap; it is not a published article. It stays crawlable on production so crawlers can read the noindex directive.

## Search quality

Follow [SEO.md](SEO.md) for the on-page and off-page strategy, route requirements, and distinction between technical readiness and confirmed indexing.

Give every article a distinctive title, helpful excerpt, actual author/date, descriptive images, useful headings, and relevant internal links. Publish substantive firsthand details when available; the current starting articles and draft case studies need continued editorial development. Avoid keyword stuffing, unverified results, duplicate boilerplate, or changing slugs without redirects. Search inclusion and ranking depend on content as well as technical readiness.

Keep contact details consistent with `lib/site.ts` and homepage phone/WhatsApp links. Never copy resume contact data or private documents into public assets without checking the owner's current intent.

## Personal SEO case-study updates

`personal-seo-rank-your-name` is a living guide using Khuram's portfolio, LinkedIn, and GitHub as the case study. Candidate keyword intents cover personal SEO, ranking a name, portfolio/freelancer SEO, profile consistency, indexing, and measurement; no paid keyword-volume dataset or exhaustive keyword list was used. Maintain readable answers rather than inserting repeated search phrases.

Keep the `case-study-log` section chronological. For future updates, record the date, deployed revision/URL if known, evidence source, query/page/device/country filters, reporting window, and observations. Distinguish source implementation, live deployment, indexing, and ranking. Do not infer measured traffic gains from design work or replace unknown metrics with zero. Earlier social profile improvements are project history, not a current public profile audit. Update `updatedAt` for meaningful revisions and retain the original publication date and slug.

Section-level `links` in `PostSection` render contextual primary references and related articles. They stay in the server-rendered article and are not included in homepage summaries. Current cover and inline images use uploaded Blob assets. The diagrams are conceptual illustrations, not ranking screenshots.

## Growing the notebook

Posts are ordered by publication date, newest first, then slug for deterministic ties. Home and related previews are limited to three. Archives use three cards per page and support new `/blog/page/<number>/` routes on demand. Search requests bounded result pages from the server. Limits live in `lib/notebook.ts`. Database edits refresh through ISR; code/limit changes require deployment. Review pagination and Search Console after archive membership changes. See `ARCHITECTURE.md` for query boundaries and the no-JavaScript fallback.

## Selected avatar

The owner supplied the illustrated avatar from `https://cdn.21st.dev/assets/mirror/ec/ec81be4cc810190ce4d240fcc57295965c5cebaa8751558595ade91eb62c09a4.png`. Its local copy is `public/images/profile-avatar.png`; do not substitute the demo’s Hallie Richards name or HR initials. This is an owner-selected illustration, not a photo identity claim.

## Owner editor

The preferred workflow is now the protected /studio/ editor: write, save draft, preview, then publish. See [STUDIO.md](STUDIO.md). Compass instructions above remain an alternative; do not edit the same article in both places simultaneously.
