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

Images are selected from existing cover artwork or entered as deployed /images/ paths. There is no image-upload service in this version. Add new artwork to public/images and deploy it first; SVG covers need a matching PNG for social sharing. Never use the editor as private file storage.

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
