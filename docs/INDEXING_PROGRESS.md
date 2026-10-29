# Indexing progress

## Measurement started: 29 October 2026

The live canonical sitemap contains 64 URLs. The owner's milestone is **more than 50% indexed: at least 33 of these URLs on each engine**, measured separately. A submitted URL, successful live test or IndexNow receipt is not an indexed URL. If the sitemap changes, record both the original 64-URL cohort and the new total rather than silently changing the denominator.

### Bing

All 64 canonical URLs were submitted through Bing Webmaster Tools URL Submission on 29 October at 21:22 Pakistan time. The list showed 64 unique URLs; the daily counter reached 65 because the homepage had also been submitted earlier. Remaining quota was 35. This confirms receipt, not indexing.

Site Explorer's Indexed URLs view returned **No data available**. This is an unavailable baseline, not proof of zero indexed pages. Search performance showed zero clicks and impressions through 28 October; traffic is not an indexing count.

### Google

The Page indexing report was last updated on **23 October**, before the latest content revisions. All known pages showed 16 indexed and 14 excluded. Filtering to the submitted sitemap showed 16 indexed and 10 discovered but not indexed. These delayed totals do not cover the current 64-URL sitemap completely.

Individual inspections on 29 October confirmed that the homepage and the agent-cost, agents-versus-workflows, browser-agent safety, deep-research and hallucination articles were already indexed. Dula was crawled successfully on 29 October but remained **Crawled - currently not indexed**. Haris Travels showed **URL is unknown to Google**. Keep these live observations separate from the older aggregate report.

Google accepted ten individual indexing requests: the homepage, those five articles, and the Dula, Haris Travels, Marham and NFC Attendance projects. The next request, `/projects/o-two/`, returned **Quota Exceeded** and explicitly asked to try tomorrow. It was not accepted. There are 54 URLs without an accepted individual request in this campaign; all remain discoverable through the submitted sitemap. Do not bypass the quota or retry accepted requests merely to improve priority.

### Follow-up method

1. Check the submitted sitemap's processed status and the date of each engine's report.
2. Record actual indexed canonical URLs and exclusion reasons. Count the intersection with the sitemap, excluding redirects and alternate hosts.
3. Use remaining Google individual-request quota for pages not yet requested, prioritizing substantive articles and projects. Do not repeatedly submit the same URL; Google states this does not improve queue position.
4. Investigate pages that remain crawled but unindexed: substantive value, duplication, internal links, rendered content and canonical selection. Do not assume a robots problem when fetching succeeds.
5. Record when each engine first confirms at least 33 of the original 64 URLs indexed. Report elapsed time from 29 October 2026; do not promise a deadline.

Google recommends sitemaps for many URLs and limits individual crawl requests. See [requesting a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Crawling can take days to weeks and does not guarantee inclusion. The existing sitemap is already submitted; no Google blog-page bulk Indexing API workaround is used.
