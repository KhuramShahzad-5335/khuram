# PHP2Shell article editorial handoff

Research date: 26 October 2026. Database slug: php2shell-php-vulnerabilities-2026-fixes. The article is a draft in portfolio.posts, not a published page or a lib/posts.ts snapshot entry.

Title: PHP2Shell 2026: Critical PHP Flaws, Attack Reports & Fixes

The current draft contains 2,025 words, 14 sections and 12 primary sources. The description is 149 characters. Counts follow lib/blog.ts and exclude code, captions and source labels.

## Search intent and presentation

Primary topic: PHP2Shell and the October 2026 PHP vulnerabilities. Supporting intents: CVE-2026-109618, CVE-2026-109619, affected PHP versions, PHP RCE fixes, WordPress PHP security, PHP-FPM, whether sites were hacked, and Windows PHP security updates. These are editorial intent targets, not measured search-volume or ranking claims. Keywords are used naturally in headings and explanations; no meta-keyword stuffing or promised rankings.

The article includes a dated timeline, an evidence assessment, fixed-version guidance, hosting checks, operational verification, temporary mitigation limits, FAQs and a correction/update log. It links naturally to the personal SEO article. Existing application metadata, word counts, canonical URLs and BlogPosting schema will derive from the document when published. Drafts must remain absent from public search, sitemap and RSS.

## Important factual distinctions

- Sophos corrected its October 22 16:18 UTC customer-compromise assessment at 21:21 UTC. Use the corrected statement. Search snippets may still show the superseded claim.
- NCSC-NL described precautionary shutdowns, including its own website; do not characterize them as proven breaches.
- The October 24 0x4D31 report concerns execution on instrumented PHP 8.4.26 mod_php honeypots. Its 35 shell events are not 35 hacked companies and do not demonstrate exploitation of patched versions.
- AWS's October 17 observation is an attempted exploitation event with explicit uncertainty about real-world success.
- CVE-2026-115560 is a separate configuration-dependent follow-up. The October 26 Windows packages address a separate Brotli dependency issue. Do not merge them into claims that every original PHP2Shell patch failed.
- No named production-victim list was established by the reviewed primary sources. This is a research limitation, not a universal claim that no breach occurred.
- The author has not claimed firsthand exploit reproduction or forensic investigation.

Full primary-source links are stored in the article's section links and sources, including PHP's advisories, AWS, Sophos, NCSC-NL, the honeypot operator, CrowdStrike, WordPress, Cloudflare, the Canadian Cyber Centre and Google Brotli.

## Assets and publication

Original conceptual artwork:

- public/images/blog-php2shell.svg — 1200 × 720 cover.
- public/images/blog-php2shell.png — matching social preview.
- public/images/php2shell-evidence.svg — 1000 × 460 explanatory figure.

These new files need the owner's normal GitHub/Vercel deployment before the live studio can display them. The database draft can be reviewed immediately, but keep it unpublished until the assets return HTTP 200.

Before clicking Publish, recheck PHP's newest release notices and source corrections. Update the publication date if publishing later, retaining the same slug. Confirm image alt text, mobile reading and links. Publish through the studio so related caches are invalidated. The sitemap and feed then follow published-content rules; do not manually add the draft to either.
