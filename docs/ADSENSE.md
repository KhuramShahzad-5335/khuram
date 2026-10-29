# Advertising readiness and editorial operations

Status, 26 October 2026: the owner has **not created an AdSense account**. The implementation prepares ownership verification and seller identification. It does not load ads, render ad units, or implement a consent platform. Preparation is not approval or a guarantee of compliance.

## Implemented

- Public About, Contact, Privacy, and Editorial Standards pages, linked from the footer and sitemap.
- Article publisher links, a correction channel, and AI-assistance disclosure. Researched explainers are distinguished from firsthand reviews.
- Optional server variable ADSENSE_PUBLISHER_ID: the actual pub- or ca-pub- identifier followed by 16 digits. This is a public identifier, not a password.
- A valid ID produces the google-adsense-account metadata tag and the Google seller line at /ads.txt. Missing or malformed values produce no verification tag and HTTP 404 at /ads.txt.
- Setting the ID does **not** enable ads. No ad network requests or advertising cookies are introduced.

## Owner setup after deployment

1. Review articles and site information for accuracy, originality, usefulness, and actual data practices. Correct weak or outdated material before applying. Twenty-five articles is not an approval threshold.
2. Create your AdSense account with accurate details. Complete identity, payment, and address requirements inside Google. Never put private verification documents in the repository.
3. Add the canonical site in AdSense. Set your public ID as ADSENSE_PUBLISHER_ID in Vercel Production and redeploy. Choose Google's meta-tag verification option and compare the generated tag with the instructions in your account.
4. Check the homepage HTML and https://www.khuramshahzad.dev/ads.txt. Complete verification and request review. Google determines eligibility and approval.
5. Before serving ads, choose and configure the actual consent solution. Address Google's certified CMP/IAB TCF requirements for the EEA, UK, and Switzerland, plus other applicable regional requirements and privacy choices. A custom cookie banner or environment flag is not a substitute.
6. Update /privacy/ for the actual ad providers, data uses, cookies/identifiers, choices, and revocation process. Its current statement that advertising is off must change when that practice changes.
7. After the required site status and consent setup are ready, implement ad serving with account-provided configuration. Start with a restrained article-only placement, reserve space, and label it clearly. Keep it away from navigation and controls. Do not place ad or Funding Choices tags on privacy/cookie-policy pages. Keep studio, errors, empty searches, and utility pages ad-free.
8. Test acceptance, refusal, withdrawal, navigation, mobile layout, keyboard operation, and network behaviour. Never test by clicking your own live ads. Recheck performance on production.

The account, review, CMP, and ad-serving stage remain outstanding. No switch silently enables ads in this implementation.

## Content and traffic standards

### Editorial quality gate (owner requirement, 29 October 2026)

Apply this gate to every new article and substantial revision. These are the site's editorial standards, not a claim that Google requires a fixed article count, word count, keyword density, or traffic threshold. AdSense review and organic search ranking are separate processes. A policy checklist cannot guarantee either approval or ranking.

- Define one reader, one practical question, and the decision or task the article helps them complete. Give the useful answer early. Explain unfamiliar terms before relying on them.
- Add original value beyond summarizing announcements: a worked calculation, concrete scenario, decision comparison, annotated example, reproducible code, troubleshooting procedure, or evidence from this portfolio. Each addition must answer a real question; do not append generic paragraphs to meet a length target.
- Separate **documented facts**, **vendor claims**, **editorial analysis**, **hypothetical examples**, and **hands-on results**. Label examples with invented inputs or prices. A suggested test is not a completed test. Never claim Khuram personally used a product, measured a result, or delivered a client outcome without evidence.
- For a hands-on claim, retain the test date, version, environment, inputs, method, expected and observed outputs, limitations, and reproducible artifacts. Code snippets must state prerequisites and scope; run self-contained examples where practical. Passing a snippet test is not a product benchmark or security certification.
- Use primary documentation for product behavior, pricing, releases, security advisories, and policies. Open the cited page and check the supporting passage, date, version, plan, region, and rollout limitations. Attribute vendor measurements. For consequential disputed claims, seek independent corroboration rather than several rewrites of the same announcement.
- Put reference links near relevant sections and keep a useful source list. Cite the specific supporting page, not an unrelated homepage. Explain what a source establishes and what remains unknown. Do not copy source wording or reproduce third-party articles.
- Make comparisons fair: common inputs, clear criteria, strengths, limitations, cost of review, and when neither option is appropriate. Finish with a practical next step and a reasoned recommendation conditional on the reader's constraints.
- Keep titles specific and accurate. Do not add unsupported superlatives, sensational breach claims, dates implying freshness, or keyword chains. A research explainer must not masquerade as an independent product review.
- Preserve author identity, original publication date, correction contact, and AI-assistance disclosure. Use the actual revision date for meaningful changes and briefly describe substantive corrections. Keep slugs stable; plan redirects before any URL change.
- Confirm that images are licensed or original, compressed, dimensioned, accessible, and relevant. Label conceptual diagrams; never present them as product screenshots or measured evidence. Preserve referenced Blob files and backup versions.
- Check mobile reading, heading structure, keyboard navigation, contrast, readable code, useful internal links, working images, canonical URL, server-rendered article text, and accurate structured data. No deceptive buttons, intrusive overlays, or ads disguised as navigation.
- Reject fabricated expertise, scraped or near-duplicate content, empty keyword pages, mass-produced summaries without added value, and unsupported medical/financial/legal advice. Treat exploit coverage as defensive reporting with verifiable advisories and careful distinctions between attempts, crashes, and confirmed compromise.

Short articles can satisfy a narrow question. Longer articles still fail this gate if they repeat themselves or lack evidence. Do not call a page "AdSense approved" before the account actually reports approval.

### Keyword research and topic selection

The owner's final preference is **at least 1 million impressions per day, sustained across a week**, for new topic candidates. Existing articles must still be improved even when their queries are smaller. Viral topics are an additional opportunity, identified separately from durable demand. This threshold is the owner's selection rule, not a Google/AdSense requirement or a forecast of visits to this site.

1. Start with a reader problem and research exact queries and close variants in both Google and Bing. Use Bing Webmaster Tools Keyword Research, Google Search Console for this site's real queries, and Google Trends or an available keyword-volume tool for broader demand. Do not create paid campaigns or accounts merely to obtain research data.
2. Record the tool, exact query, collection date, market, language, device, date interval, metric name, and source/export. Bing impressions are not Google search volume. Search Console impressions describe this site's exposure, not total market demand. Google Trends is a normalized relative signal, not an absolute search count. Search-result counts are not search volume.
3. To mark the daily rule verified, retain actual daily observations of at least 1 million impressions on each of seven complete consecutive days with consistent filters. Where possible, compare the previous week to distinguish sustained demand from a spike. A three-month total divided by days, or a seven-day total divided by seven, establishes only an average and does not pass this gate. If daily observations are unavailable, mark **unverified** and do not invent volume or silently relax the threshold.
4. Inspect the actual Google and Bing result pages for intent and competition. Record whether users want an official login, a product, troubleshooting, a comparison, a definition, or a tutorial. Review the strongest relevant results and identify a specific unanswered question or a better practical treatment. Do not label competition low merely because a phrase is long or an SEO tool reports low advertising competition.
5. Explore niche questions within large topics, but keep parent-query demand separate from the niche query's measurements. A broad brand term with millions of impressions does not prove a specific tutorial meets the threshold. Avoid targeting navigational queries such as a product login unless the page truly resolves a relevant access problem without impersonating the official service.
6. Assign one primary intent to one canonical article. Add a small set of closely related secondary questions only where they improve the answer. Use terms naturally in the title, introduction, appropriate headings, description, and descriptive links. Do not use keyword-density quotas, hidden text, repeated city/product variants, or a meta-keywords tag as a ranking tactic.
7. Map existing articles before commissioning a new one. Improve or consolidate overlapping content rather than publishing several pages that answer the same question. Preserve distinct angles between factual verification, research workflow, model selection, costs, privacy, and automation safety.
8. Viral candidates require a dated primary source, a useful explanatory angle, an explicit freshness/expiry plan, and verified trend evidence. If their daily demand does not meet the standing rule, keep them labeled as exceptions requiring an owner decision; do not quietly declare them qualified. Fast publication does not ensure crawling, indexing, or visibility before the trend passes.
9. After publication, inspect accessibility and sitemap membership, notify IndexNow only for new or meaningfully changed URLs, and use Search Console/Bing URL Inspection separately. Review query impressions, relevant clicks, engagement, and enquiries after enough data accumulates. Record zero and unavailable data accurately; no traffic or ranking promises.

### Required article brief and review record

Keep a maintainable research brief with: existing/new status; reader and intent; primary query; secondary questions; demand evidence and filters; daily-threshold verdict; Google/Bing competitor observations; distinct contribution; sources and claim limitations; example/test method; proposed title and excerpt; internal links; review date; and post-publication observations. Keep private raw exports and backups outside Git. Public-safe keyword decisions may live in `docs/KEYWORD_RESEARCH.md`.

Before publishing, explicitly check: question answered, original contribution present, sources support claims, no invented testing, examples accurate, no unnecessary repetition, title matches content, images/links work, dates are honest, and the page remains readable. If any essential check fails, revise or leave a new article as a draft. The existing archive should be improved rather than deleted solely for failing a new-topic demand threshold.

The October collection targets distinct questions around AI announcements, model choice, agents, productivity, safety, and search. Selection uses dated primary announcements and reader intent, **not verified keyword-volume rankings**. Do not claim guaranteed virality, invented testing, or fictional personal experience.

Attribute vendor claims and separate them from original analysis and hypothetical examples. Check rollout, plan, region, and version limitations. Add actual measurements and demonstrations only when performed. Do not refresh publication dates without a meaningful revision.

Inspect important URLs in Search Console/Bing and the generated sitemap. Track relevant query impressions, clicks, engagement, and enquiries. Improve content from that evidence. Avoid near-duplicate keyword pages, bought bot visits, traffic exchanges, misleading headlines, and ad-click encouragement. IndexNow is a notification mechanism, not an indexing guarantee.

For batches, retain an external backup, validate every record, compress original illustrations, upload to Blob, and preserve existing posts. MongoDB is canonical; do not put live article bodies into client bundles or expand the offline snapshot as a publishing mechanism. Keep drafts, original diagrams, and QA artifacts outside the repository.

## Primary references

- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563?hl=en)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

- [Site management and review](https://support.google.com/adsense/answer/12131223?hl=en)
- [Meta-tag verification option](https://support.google.com/adsense/answer/13996652?hl=en)
- [ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en)
- [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en)
- [Certified CMP requirements](https://support.google.com/adsense/answer/13554020?hl=en)
- [Privacy-page tag exclusions](https://support.google.com/adsense/answer/10961370?hl=en)
- [AI-assisted content guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

Recheck these sources before activating advertising; policies and account requirements change.
