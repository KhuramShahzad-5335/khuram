# Deployment and indexing

For the current live observations, on-page requirements, content/off-page strategy, and indexing contract, read [SEO.md](SEO.md).

## Vercel configuration

Publish the repository root to GitHub and import it into Vercel. The owner manages those accounts. Select the Next.js framework preset, root directory `./`, install command `npm ci`, and build command `npm run build`. Let the framework handle the output configuration for the static export. Use a compatible Node.js 22.13+ runtime. Do not upload `.next/`, `out/`, `node_modules/`, private files, or `.env.local` to Git.

Add the final domain in Vercel and configure its DNS as instructed by the domain provider. Choose one canonical HTTPS origin (currently intended: `https://www.khuramshahzad.dev`). Redirect other domain variants to it in Vercel. Check HTTPS and redirect loops before indexing. Existing `khuram-one.vercel.app` links should redirect to the primary domain when possible.

Set `NEXT_PUBLIC_SITE_URL` in **Production** to the canonical HTTPS origin, with no path/query/fragment or credentials. The code normalizes the trailing slash. Rebuild/redeploy after changing it: metadata and robots are static build output, not runtime settings. Unset URLs and `VERCEL_ENV=preview` generate noindex. If you copy the static export to another host, its indexing directives are already baked into its files.

Optional Google/Bing HTML verification tokens may be set as `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. DNS verification works without these variables. These public verification values are not passwords. Never commit API keys.

## Validate the production domain

- `/`, `/projects/`, `/blog/`, individual articles/projects, and `/experiments/` return useful HTML with status 200. Unknown routes return 404.
- `robots.txt` allows crawling and names the production sitemap. Page metadata does not contain `noindex` except intentional drafts.
- `sitemap.xml` contains only the intended canonical origin and public routes; article modification dates reflect actual edits.
- Canonicals and social metadata use the production origin, and `/opengraph.png` plus article PNG previews load publicly.
- `/feed.xml` lists published articles. Contact links, mobile navigation, keyboard interactions, and reduced-motion behavior work.
- Hosting does not add password protection, firewall challenges, or `X-Robots-Tag: noindex` to production.

Run `npm run check` locally with production configuration before launch and inspect the live output again after deployment. Local checks cannot verify Vercel DNS, redirects, headers, or actual search-engine access.

## Google

1. Add a Domain property in [Google Search Console](https://search.google.com/search-console/) for `khuramshahzad.dev`; verify via the provided DNS TXT record. A URL-prefix property with HTML verification is an alternative.
2. Submit `https://www.khuramshahzad.dev/sitemap.xml` in Sitemaps.
3. Use URL Inspection on the homepage and important article pages. Check the live page, declared canonical, crawl availability, and indexability. Request indexing for a small number of priority URLs.
4. Monitor Page indexing and Core Web Vitals. Diagnose exclusions from the reported reasons instead of repeatedly requesting indexing.

Google's basic eligibility requires accessible pages with a successful HTTP response and indexable content. A sitemap helps discovery; neither submission nor technical compliance guarantees inclusion, timing, ranking, or a perfect SEO score. See [technical requirements](https://developers.google.com/search/docs/essentials/technical) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Other discovery

Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters/) and submit the same sitemap; importing a verified Google property is an available workflow. Link the canonical site from GitHub, LinkedIn, and relevant genuine profiles. Readers can subscribe to the RSS feed. Publish useful articles consistently and link related work naturally. There is no universal submission mechanism that guarantees visibility across all platforms.

## Performance and future features

Use Lighthouse on the deployed homepage and an article on both mobile and desktop. Record the test mode and inspect the actual bottleneck. The reload intro intentionally delays visible content; it cannot coexist with a guarantee of maximum loading scores. Reduced-motion runs are useful fallback checks and must be labeled separately. Verify field results after real visits with Vercel Speed Insights and Search Console.

Static export keeps hosting simple, but Next Image does not optimize raster files at request time (`unoptimized: true`). Compress source images, avoid heavyweight third-party embeds, and keep 3D/animation work gated. Future backend features require a deliberate architecture change; a Markdown/MDX or headless-CMS build workflow can remain static if introduced carefully later.

For favicon, site-name, and sitelink follow-up, see the 14 October search-appearance section in `SEO.md`. Deploy the updated icons and metadata before requesting another crawl; extra result links remain Google’s choice.

## IndexNow setup and submission

`indexnow.config.json` defines the canonical origin and a generated verification filename. The matching UTF-8 file in `public/` contains the ownership key; Next’s export copies it to the site root. This is the protocol’s publicly served verification value, not an account password. Keep it stable, outside frontend bundles, and out of the sitemap. No paid service, account login, browser widget, backend, or environment variable is required.

1. Run the production `npm run check`, then deploy the source changes through the owner’s usual GitHub/Vercel flow.
2. Open the verification URL reported by `npm run indexnow`; confirm HTTP 200 and only the expected key text, without a redirect/login/challenge.
3. Run `npm run indexnow` to preview the current sitemap URLs. It performs no network calls.
4. For the first submission, run `npm run indexnow -- --submit`. The helper first verifies the live key file, then sends one JSON request to the global IndexNow endpoint. A failed live check prevents the POST.
5. Later, submit only new or meaningfully changed deployed pages: `npm run indexnow -- --submit /blog/personal-seo-rank-your-name/`. Multiple canonical paths/URLs are accepted. Current sitemap membership is required; this helper does not submit deleted pages.

The helper reads the existing production export, refuses non-indexable/mismatched-origin builds, duplicates are removed, and unrelated hosts/fragments/query URLs/drafts are rejected. HTTP 200 means received; 202 means received with key validation pending. Neither proves crawling, indexing, visitors or rankings. A 403 needs key-file verification; a 429 needs backoff. Do not attach this command to every build or repeatedly submit the full sitemap. IndexNow notifies participating engines (including Bing); keep Google Search Console and the sitemap workflow separately.

See [official IndexNow documentation](https://www.indexnow.org/documentation). Submission is pending until the ownership file is deployed and a real accepted response is recorded.

### Verification file returns 404

A successful local build does not publish files. If the helper reports HTTP 404, include the generated `public/<key>.txt` file (which may still be untracked), `indexnow.config.json`, and the other setup changes in the owner’s Git commit/push. Wait for the Vercel **Production** deployment to succeed and check the exact verification URL again. Do not regenerate the key or bypass the ownership check. The helper reads the response body and reports a concise failure with a nonzero exit code; it sends no IndexNow POST when verification fails.
