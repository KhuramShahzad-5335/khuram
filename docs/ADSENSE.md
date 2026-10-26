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

The October collection targets distinct questions around AI announcements, model choice, agents, productivity, safety, and search. Selection uses dated primary announcements and reader intent, **not verified keyword-volume rankings**. Do not claim guaranteed virality, invented testing, or fictional personal experience.

Attribute vendor claims and separate them from original analysis and hypothetical examples. Check rollout, plan, region, and version limitations. Add actual measurements and demonstrations only when performed. Do not refresh publication dates without a meaningful revision.

Inspect important URLs in Search Console/Bing and the generated sitemap. Track relevant query impressions, clicks, engagement, and enquiries. Improve content from that evidence. Avoid near-duplicate keyword pages, bought bot visits, traffic exchanges, misleading headlines, and ad-click encouragement. IndexNow is a notification mechanism, not an indexing guarantee.

For batches, retain an external backup, validate every record, compress original illustrations, upload to Blob, and preserve existing posts. MongoDB is canonical; do not put live article bodies into client bundles or expand the offline snapshot as a publishing mechanism. Keep drafts, original diagrams, and QA artifacts outside the repository.

## Primary references

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
