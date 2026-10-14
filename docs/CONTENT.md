# Content and static blog publishing

## Sources and voice

Use accurate, specific language with occasional understated humor. Khuram is currently self-employed in Lahore. Confirmed employment dates: self-employed January 2025–present; Officiallabs August 2024–December 2025; Hashtag Web September 2023–September 2024; Techixen January 2022–April 2024. Overlapping periods are intentional and must not be silently changed.

Project records belong in `lib/content.ts`; expanded narratives belong in `lib/journeys.ts`. Every project slug needs a matching journey. Keep categories, confirmed technology stacks, source/demo links, and uncertainty notes accurate. Current conceptual previews are illustrations, not screenshots. Draft case studies and learning projects must remain clearly identified; do not invent completion dates, metrics, ownership, or claims based only on a dependency list.

The owner's placeholder testimonial section is commented out. Keep it disabled until real quotes and permission are supplied or the owner explicitly asks otherwise. Historic requirements and drafts provide background, not current authorization to revive removed ideas.

## Add an article

1. Add local cover/inline artwork under `public/images/`; use descriptive filenames, dimensions, and alt text. Covers use 1200×720 illustrations. Supply a matching PNG for each SVG cover because social metadata currently uses the `.png` counterpart. `scripts/create-blog-art.mjs` regenerates the existing artwork; review it before changing or rerunning it.
2. Add a typed `Post` record to `lib/posts.ts`: unique slug, title, excerpt, category, real ISO publication date (`YYYY-MM-DD`), image, imageAlt, introduction, sections, and source links. Each section needs a unique id, title, paragraphs, and optional code/image. Do not publish future/draft content by adding it to this array: every record is public.
3. For meaningful revisions, add/update `updatedAt` with the actual revision date. Do not automatically stamp all pages with today's date.
4. Review spelling, factual accuracy, sources, internal anchors, mobile reading, and code examples. Use original words and attribution where needed.
5. Run `npm run check`, review with `npm start`, commit, and redeploy through Vercel.

Adding a post automatically generates `/blog/<slug>/`, an index/home card, related links, BlogPosting structured data, sitemap membership, and an RSS item in `/feed.xml`. New posts require a rebuild; there is no browser publishing dashboard.

Word counts include the introduction, section headings, and paragraphs. They exclude code, captions, source labels, title, and excerpt. Reading time is a minimum of one minute, estimated at 200 words per minute. Counts are calculated from the source article at build time and passed as small card summaries to the homepage.

`/blog/welcome/` is an old reading-layout preview. It remains `noindex` and excluded from the sitemap; it is not a published article. It stays crawlable on production so crawlers can read the noindex directive.

## Search quality

Follow [SEO.md](SEO.md) for the on-page and off-page strategy, route requirements, and distinction between technical readiness and confirmed indexing.

Give every article a distinctive title, helpful excerpt, actual author/date, descriptive images, useful headings, and relevant internal links. Publish substantive firsthand details when available; the current starting articles and draft case studies need continued editorial development. Avoid keyword stuffing, unverified results, duplicate boilerplate, or changing slugs without redirects. Search inclusion and ranking depend on content as well as technical readiness.

Keep contact details consistent with `lib/site.ts` and homepage phone/WhatsApp links. Never copy resume contact data or private documents into public assets without checking the owner's current intent.

## Personal SEO case-study updates

`personal-seo-rank-your-name` is a living guide using Khuram's portfolio, LinkedIn, and GitHub as the case study. Candidate keyword intents cover personal SEO, ranking a name, portfolio/freelancer SEO, profile consistency, indexing, and measurement; no paid keyword-volume dataset or exhaustive keyword list was used. Maintain readable answers rather than inserting repeated search phrases.

Keep the `case-study-log` section chronological. For future updates, record the date, deployed revision/URL if known, evidence source, query/page/device/country filters, reporting window, and observations. Distinguish source implementation, live deployment, indexing, and ranking. Do not infer measured traffic gains from design work or replace unknown metrics with zero. Earlier social profile improvements are project history, not a current public profile audit. Update `updatedAt` for meaningful revisions and retain the original publication date and slug.

Section-level `links` in `PostSection` render contextual primary references and related articles. They stay in the server-rendered article and are not included in homepage summaries. The SVG cover has a PNG counterpart for Open Graph/Twitter; the two inline diagrams are conceptual illustrations, not ranking screenshots.

## Growing the notebook

Posts are ordered by publication date, newest first (source order breaks ties). Home and related-post previews are limited to three. The archive uses three cards per page and generates additional `/blog/page/<number>/` routes and sitemap entries automatically. Search and category filters use summaries from a lazily downloaded static index; no article-body bundle or backend is needed. Limits live in `lib/notebook.ts`. Rebuild after publishing, removing a post, or changing those limits. Review pagination and Search Console when archive membership shifts. See `ARCHITECTURE.md` for the search-index size tradeoff and no-JavaScript fallback.

## Selected avatar

The owner supplied the illustrated avatar from `https://cdn.21st.dev/assets/mirror/ec/ec81be4cc810190ce4d240fcc57295965c5cebaa8751558595ade91eb62c09a4.png`. Its local copy is `public/images/profile-avatar.png`; do not substitute the demo’s Hallie Richards name or HR initials. This is an owner-selected illustration, not a photo identity claim.

## Museum-art collection

The homepage and notebook moodboards credit the Art Institute of Chicago and link every artwork to its museum record. They are visual inspiration, not work by Khuram or illustrations of his project contributions. The twelve cached records in `lib/art-collection.json`, including Seurat 27992, van Gogh 28560, and Monet 16571, returned `is_public_domain: true` on 14 October 2026. All artwork is locally cached; original image URLs and the verification date are retained. Preserve each work’s title, artist, date, and museum link. The API/gallery does not publish blog posts or change the feed/sitemap. Recheck record/image availability and museum usage rules when changing the collection.
