# MongoDB blog operations

The owner approved MongoDB-backed Next.js pages with caching and Compass editing on 26 October 2026. One database user is used for both runtime reads and migration/editing, as requested. The owner subsequently approved a password-protected /studio/ editor. See [STUDIO.md](STUDIO.md) for setup and publishing. Compass remains available.

## Configuration

Keep these values in the ignored `.env.local` file and Vercel environment settings. Never put the URI in a `NEXT_PUBLIC_` variable, source control, browser code, logs, or screenshots.

```dotenv
MONGODB_URI="your Atlas driver connection string"
MONGODB_DB=portfolio
BLOG_SOURCE=mongodb
NEXT_PUBLIC_SITE_URL=https://www.khuramshahzad.dev
```

`MONGODB_DB` defaults to `portfolio`. `BLOG_SOURCE` defaults to `mongodb`. There is no separate migration credential: the tools use the same `MONGODB_URI`. The `posts` collection is fixed. Use `BLOG_SOURCE=files` only for explicit offline/CI checks or a deliberate snapshot rollback. MongoDB mode never silently falls back to old content after a connection or validation failure.

Atlas must allow the connecting machine's IP and the deployed Vercel application's outbound network. A successful Compass connection alone does not establish Vercel connectivity. Configure the access list for the actual deployment network; do not copy a local IP and assume it covers Vercel. See [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

The server reuses one MongoClient connection pool per process, with a maximum of five pooled connections, idle connection cleanup, and bounded connection/query timeouts. Several Vercel instances can each have their own pool. Credentials and internal MongoDB fields stay on the server.

## Initial migration

The original four articles in `lib/posts.ts` are a migration snapshot. Run from the repository root:

```sh
npm run check:blog
npm run blog:migrate
npm run blog:migrate -- --apply
npm run blog:validate
```

The first migration command connects and previews inserts without writing. `--apply` creates unique slug and publication-order indexes, inserts missing articles with `$setOnInsert`, and compares inserted content against the original. Re-running does not replace Compass edits, delete documents, or reset statuses/dates. Existing documents need unique string slugs. Source image files and social PNG counterparts must exist before importing.

`blog:validate` reads all documents, validates their structure and local image paths, and reports publication counts. It does not publish or change anything. It checks files in this checkout; verify that new assets have also been deployed. Back up the collection with Compass export or an Atlas backup before substantial edits. Keep backups outside Git.

## Document shape and Compass editing

Documents keep the existing structured article format. Start by duplicating an imported article in Compass and giving it a new slug and `status: "draft"`. Do not copy its `_id`. Edit the following fields:

| Field                          | Meaning                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `slug`                         | Unique lowercase hyphenated URL identifier; keep stable after publishing              |
| `status`                       | Exactly `draft` or `published`                                                        |
| `title`, `excerpt`, `category` | Visible title, metadata description, and topic                                        |
| `date`                         | Actual publication date as a **string** `YYYY-MM-DD`, interpreted in UTC              |
| `updatedAt`                    | Optional actual revision date string, not earlier than `date`                         |
| `image`, `imageAlt`            | Deployed `/images/…` cover path and descriptive alternative text                      |
| `intro`                        | Opening paragraph                                                                     |
| `sections`                     | Nonempty array of `{ id, title, paragraphs }`, with optional `code`, `links`, `image` |
| `sources`                      | Array of `{ title, url }` reference links; may be empty                               |

Section IDs must be unique hyphenated identifiers. Section images use `{ src, alt, caption }`. Links use HTTPS or a site-relative path; script URLs are rejected. Text is rendered as escaped React text, never raw HTML or executable MDX. Object IDs and extra database fields are projected away before data reaches the frontend.

Image bytes remain in `public/images/`, not MongoDB. New image files still require a deployment. SVG covers require a same-name PNG for social previews. Covers render at 1200×720 and inline figures at 1000×460; prepare matching artwork. Existing image URLs are preserved. External image uploads/storage and a richer image editor are future features.

The private studio is now the recommended publishing interface. Run `npm run blog:validate` while an article edited in Compass is a draft. Then change `status` to `published` with a publication date no later than today in UTC. Future-dated posts remain excluded until their date is reached and the affected caches refresh. Draft is a publication state, not a secret storage boundary: do not put credentials or private personal data in article documents.

## Caching and publication visibility

Studio publishing additionally invalidates affected paths immediately for regeneration on their next request. Compass edits use the fallback TTL described below. This site uses the documented Next.js ISR model without Cache Components. Page and discovery endpoints have `revalidate = 60`; React `cache()` deduplicates database reads within a server render, rather than retaining a second long-lived database cache. The homepage, notebook, article pages, archive pagination, search JSON, RSS, and sitemap all use the same published-content rules.

After a cached page is 60 seconds old, the next request can receive the old HTML while regeneration runs. A following request receives the update after regeneration succeeds. This is request-driven, **not a promise of publication exactly 60 seconds after saving**. New slugs and archive pages can render on demand without rebuilding. An already-open browser search session may retain its loaded summaries until reload.

Unpublishing also takes effect after affected caches regenerate. ISR may continue serving a previously generated page if the database is unavailable or a published document is invalid. This protects availability but is unsuitable for emergency confidential-content removal; remove such content through hosting/cache controls and verify every URL. Database changes do not invalidate already downloaded content.

Unknown, unpublished, or future article URLs return 404 when rendered with current data. Reserved routes such as `/blog/welcome/` cannot be article slugs. The historical welcome preview remains noindex. Unauthenticated visitors cannot read drafts or write articles; the studio write endpoint requires an owner session.

## SEO and release checks

Keep existing slugs and dates. Article server HTML, canonical URLs, metadata, Open Graph/Twitter images, BlogPosting JSON-LD, related links, sitemap, and RSS remain generated from published data. MongoDB alone does not improve rankings. Preserve original publication dates and update `updatedAt` only for real edits.

```sh
npm run check
npm start
```

`check:site` starts a temporary production Next server and audits real HTTP routes, metadata, assets, sitemap/RSS/search agreement, and unknown-page 404s. It no longer reads `out/`. CI explicitly uses `BLOG_SOURCE=files` with the retained migration snapshot; a passing CI run does not prove Atlas credentials or production network access. Validate MongoDB mode locally and on a Vercel Preview before promotion.

For a database-only publication, inspect the public article and wait for the sitemap/feed/search entries to refresh, then optionally run `npm run indexnow -- --submit /blog/the-slug/`. IndexNow now reads the live robots and sitemap even during its read-only dry run. Google Search Console stays a separate workflow. Existing indexing and rankings are not guaranteed by the migration.

## Rollback and deployment

Use the Vercel Next.js preset, repository root, `npm ci`, and `npm run build`. Remove any custom `out` output-directory override. Set the private database variables in Production and the appropriate Preview environment, and redeploy. The server needs database access at build time for the homepage/archive/discovery routes and at runtime for regeneration. Vercel Preview remains noindex.

The owner handles GitHub pushes and Vercel promotion. A local migration or build does not deploy the site. To roll back code, promote the previous Vercel deployment. An explicit `BLOG_SOURCE=files` rebuild serves the retained snapshot, which will not contain posts added after migration. It does not modify or remove MongoDB records.
