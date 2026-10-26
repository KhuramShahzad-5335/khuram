# Private writing studio

Open /studio/ directly. It is intentionally absent from navigation, the sitemap and feeds. It has noindex metadata and headers, private/no-store responses, and no Vercel telemetry. Hiding the address is not the access control: every read of private articles and every mutation checks the owner session.

## Enable owner access

1. Run npm run studio:password in an interactive terminal at the project root.
2. Enter a unique password of at least 16 characters twice. Input is hidden. Only a salted scrypt hash is written to ignored .env.local.
3. Restart the local server. Visit /studio/ and sign in.
4. Privately copy STUDIO_PASSWORD_HASH from .env.local into the same Vercel environment that has MONGODB_URI and MONGODB_DB=portfolio. Redeploy. Never put the password or hash in Git or a NEXT_PUBLIC variable.
5. Keep NEXT_PUBLIC_SITE_URL set to the canonical HTTPS origin. Production must use HTTPS. Do not share the owner password.

There is one owner login and the same MongoDB user for all operations; no registration, roles or separate editor account. If the password hash is missing/invalid, or BLOG_SOURCE=files, the studio stays locked. The password setup command does not change the database credential. Changing the hash and redeploying invalidates existing sessions; there is no email reset flow.

## Write and publish

- Choose New article or an existing article in the list.
- Set the title and unique lowercase hyphenated URL slug. Existing saved URLs are locked to preserve SEO and incoming links.
- Add the summary/SEO description, category, publication date, cover and alt text, introduction, and sections. Each section has a heading, unique anchor, paragraphs, optional code, optional image and links.
- Separate paragraphs with blank lines. This editor uses plain text fields, not HTML or Markdown. Sources have separate label and URL fields.
- Save draft keeps an unfinished article private. A title, valid slug, date and structurally valid fields are required. Blank body fields are allowed until publishing.
- Preview renders the current unsaved article inside the protected editor. It does not create a public draft URL.
- Publish article validates the complete document, saves it and invalidates homepage, notebook, article, archive, search, sitemap and RSS caches. Those routes regenerate on their next request. Future-dated publishing is rejected; save it as a draft instead.
- Publish changes updates the revision date. Unpublish to draft removes the article from public routes after cache regeneration.
- Changes are saved only when a save/publish button succeeds. Closing or switching articles warns about unsaved work; there is no background autosave or version-history recovery.
- Concurrent studio edits use a revision check; a stale save is rejected rather than replacing another studio save. Do not edit the same document in Compass simultaneously: Compass does not increment the studio revision.
- The sidebar currently shows the newest 200 documents. For larger archives, add authenticated pagination before relying on the sidebar as a complete inventory.

## Image uploads with Vercel Blob

Connect a **Public** Blob store to the Vercel project. Keep `BLOB_READ_WRITE_TOKEN` in the server environment (Production and any desired Preview environment) and privately in ignored `.env.local` for local development. Restart/redeploy after configuring it. Never use a `NEXT_PUBLIC_` token. The SDK dependency is included.

Use **Upload cover image** or expand a section's **Section image and links** and choose **Upload section image**. JPEG, PNG and WebP up to 5 MB are supported. The editor checks that the file decodes, resizes to a maximum 1600-pixel longest edge without cropping or upscaling, converts to WebP at 84% quality (PNG fallback where required), records its dimensions, and shows progress, final size and a preview. It retains the old image when an upload fails. There are no manual path/URL fields or artwork selectors; choose a file to add or replace an image. Section images can be removed without deleting their Blob file. Add alt text and an inline caption, then save or publish. Uploading alone does not save the article. Article switching, saving and section edits are disabled during upload to prevent attaching the result to the wrong content. Unsaved text is retained after errors.

`/studio/api/upload/` authorizes short-lived direct-to-Blob upload tokens using the existing owner session and same-origin policy. The route is under `/studio/` to receive the scoped session cookie. Tokens restrict content types, a 5 MB maximum and a `blog/` image path; random suffixes and overwrite protection prevent replacing published assets. No completion webhook or additional MongoDB user is needed. The private storage token is never sent to the browser. Request bodies are bounded and responses are private/no-store.

The public image URL is stored in MongoDB. The public reader accepts HTTPS raster images under `blog/` on public Vercel Blob hosts, plus existing deployed `/images/` paths. Uploaded dimensions are preserved; social metadata and JSON-LD keep the absolute Blob URL. Existing SVG covers still use their local PNG counterparts. The studio prepares images before upload, so they need no request-time transformation; 1200x720 is a useful cover size.

All uploaded images are public, **including draft images**. Do not upload private documents. Replaced or abandoned uploads are intentionally not automatically deleted: the same image may be referenced by multiple posts. Remove confirmed unused files manually from Vercel Storage after checking references. Never delete an image still used by a published article. Monitor Blob storage and transfer usage in Vercel.

After the one-time code deployment, new uploaded images and articles require no Git push. Files manually added under `public/images/` still need deployment. Missing storage configuration produces an upload error without affecting existing images or article editing.

The five existing articles were migrated to eleven lightweight WebP illustrations on 26 October 2026. Editable vector originals are archived outside the repository; the website uses only Blob images. `lib/blog-media-redirects.json` keeps old SVG/PNG image links working through permanent redirects to Blob. Preserve these redirects and their destination files. The local article snapshot uses the same Blob URLs. Backups of the previous database records and removed files are kept outside the repository, not served publicly.

## Authentication and operations

- Passwords are verified with salted scrypt and constant-time hash comparison.
- Successful sign-in creates a random 256-bit session token. Only its SHA-256 digest is stored in studio_sessions. The browser cookie is HTTP-only, SameSite=Strict, scoped to /studio, and Secure on Vercel/HTTPS.
- Sessions expire after eight hours. Expiry is checked on every request; Mongo TTL indexes only perform cleanup. Logout removes the server session. Password-hash rotation invalidates all sessions.
- studio_login_attempts enforces an atomic global budget of 10 attempts per 15-minute window. It works across server instances and does not trust client IP headers. Deliberate attackers can exhaust this budget; use hosting firewall controls for sustained abuse. A deployment does not reset the database budget.
- Mutations require JSON, a permitted Origin and a valid session. Payloads are capped at 500 KB. No raw HTML is evaluated, database error details are not returned, and article data is validated server-side.
- MongoDB's unique slug index prevents duplicate URLs. The same existing database user must be able to create indexes and read/write posts, studio_sessions and studio_login_attempts.
- No public signup, delete endpoint, password recovery, multi-user permissions, MFA or revision history is implemented. This is a single-owner publishing tool, not a general-purpose CMS.
- For an expired session, sign in in another tab and return to retry saving; the editor keeps unsaved text after a failed request.

Before deployment run npm run check. Test unauthorized writes, wrong-origin requests, private draft exclusion, publishing a new slug without a build, logout revocation, rate limits and mobile/keyboard editing in an isolated database. Never publish test articles to the production collection. Keep QA credentials and screenshots outside Git.

## Saved versions and Trash

The sidebar loads 20 article summaries at a time; selecting an article loads its body. Existing saves retain the previous version atomically, up to ten versions per article. **View saved versions** loads an older version into the editor for review; it does not publish it automatically. Save explicitly after reviewing. **Download article** exports the current editor contents, including unsaved changes, as JSON.

**Move to Trash** changes an article to draft and excludes it from public queries. Open **Show trash** and select the article to restore it as a draft. No permanent delete is offered. Cache refresh is request-driven; inspect public URLs after unpublishing. Existing downloaded content cannot be recalled.

History starts with saves made after this feature was installed. Compass edits bypass studio history and optimistic revision checks, so do not edit concurrently in Compass and the studio. Versions in the same database are convenient undo, not an independent backup. See BLOG_DATABASE.md for export/restore and Atlas backup requirements.
