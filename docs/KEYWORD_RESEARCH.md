# Keyword evidence and editorial decisions

Research date: 29 October 2026. This is a dated research record, not a traffic forecast. Follow the [editorial gate](ADSENSE.md#keyword-research-and-topic-selection) before commissioning another article.

## Owner's selection rule

New topics require at least **1 million impressions on each of seven complete consecutive days**, with consistent measurement filters. Compare the prior week when available. Existing articles should be improved regardless of that threshold. Viral topics are an additional opportunity, not an automatic exception. Do not substitute a monthly total, an average, a broad parent keyword or Google Trends interest for daily exact-query evidence.

A niche query can offer a more focused reader problem while having much less demand than its parent. Record that tradeoff honestly. Do not publish a generic brand article just to inherit a large number from a keyword report.

## Observed Bing data

Bing Webmaster Tools Keyword Research, country/region All, language All, device All. The metric is **Impressions**. Numbers retain its rounded display precision; they are not Google volume or this portfolio's impressions. Raw account snapshots are retained outside Git.

| Exact query or related row | Interval           | Reported impressions | Interpretation                                                   |
| -------------------------- | ------------------ | -------------------- | ---------------------------------------------------------------- |
| chatgpt                    | 29 Jul–26 Oct 2026 | 258.4M               | Broad brand intent; seven daily observations not verified        |
| chatgpt                    | 29 Sep–28 Oct 2026 | 92.3M                | 30-day aggregate, not proof of the daily floor                   |
| chatgpt login              | 29 Jul–26 Oct 2026 | 6M                   | Mostly navigational; unsuitable as a generic editorial target    |
| chatgpt ai                 | 29 Jul–26 Oct 2026 | 1.2M                 | Entire interval total, not daily demand                          |
| chatgpt search             | 29 Jul–26 Oct 2026 | 808.4K               | Does not support the daily threshold                             |
| gemini                     | 29 Jul–26 Oct 2026 | 79.2M                | Broad/ambiguous query; niche demand cannot inherit it            |
| gemini ai                  | 29 Jul–26 Oct 2026 | 19M                  | Related-query aggregate only                                     |
| google gemini              | 29 Jul–26 Oct 2026 | 6.6M                 | Related-query aggregate only                                     |
| gemini notebook            | 29 Jul–26 Oct 2026 | 663.2K               | Existing article can be improved; new-topic gate not established |
| ai agent                   | 29 Jul–26 Oct 2026 | 66.6K                | Related row from the ai agents report                            |
| what is an ai agent        | 29 Jul–26 Oct 2026 | 9.7K                 | Definition intent; does not support the daily threshold          |

No new niche topic was verified as meeting the seven-day daily threshold in this pass. Do not sum overlapping spelling variants. Missing exact-query figures mean unavailable, not zero.

## Google and Bing result inspection

Actual Google and Bing results were inspected for these queries. Google was signed in with personalization enabled and a Pakistan locale; these are observations of that view, not universal rank measurements. No Google absolute search-volume export was obtained. Search-result counts and generated answer summaries were not used as factual sources or volume estimates.

| Query                                  | Observed Google results                                                                           | Observed Bing results                                                           | Editorial decision                                                                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ai agent cost per task                 | Calculators, cost-per-successful-task guides, Keito, independent technical writers and TechTarget | Calculators, technical cost guides and multi-step-agent budget pages            | Add a runnable synthetic calculation, failure denominator and review-time comparison to the existing article. Competition is evident; do not label this low competition. |
| how to verify AI citations             | Citation-checking products, educational videos and a research paper                               | Citation-checking guides, tools, videos and editorial services                  | Add a worked evidence ledger to the research article and distinct claim-type checks to the hallucination article. Avoid another overlapping explainer.                   |
| n8n human approval duplicate execution | n8n community discussions, Reddit troubleshooting, approval patterns and technical guides         | Official n8n documentation plus approval, duplicate-send and idempotency guides | Improve the existing article with state transitions, duplicate callbacks and uncertain destination outcomes. Neither low competition nor high volume is established.     |

Bing's broad chatgpt report showed official OpenAI/ChatGPT pages and app listings. Its ai agents report showed established definition pages and vendor engineering guides. Useful implementation questions are a better editorial fit than another generic definition, but this inference does not waive the demand filter.

## Archive intent map

The existing 30 articles are a quality-improvement batch, **not 30 newly volume-qualified topics**.

| Intent cluster         | Existing coverage                               | Useful additions                                                              |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Costs                  | Agent costs; subscriptions                      | Tested arithmetic, accepted-output denominator, hypothetical comparisons      |
| Verification           | Deep research; hallucinations; Notebook         | Claim ledger, counterexamples, source register                                |
| Architecture           | Agents/workflows; multi-agent; context; MCP     | Task boundaries, dependency arithmetic, context packet                        |
| Reliability            | Browser safety; Gemini work; n8n; vibe coding   | Permission matrix, approval states, failure rehearsals, actual studio example |
| Product interpretation | Dots; Copilot; models; Haiku; Cloud partnership | Dated vendor positioning, rollout limits, evaluation plans                    |
| Media and privacy      | Flow; deepfakes; local/cloud; open models       | Storyboard, evidence categories, data-flow and artifact worksheets            |
| Work and publishing    | Jobs; meeting notes; static blog                | Practice evidence, transcript exercise, historical/current architecture       |
| Design and discovery   | Colors; motion; GEO/AEO; personal SEO           | Component checks, implementation notes, measured account observations         |
| Security reporting     | PHP2Shell                                       | Patch handoff worksheet; retain dated reporting and evidence limits           |

Keep the per-article revision manifest and pre-edit content backup outside Git. Article bodies and tables live in MongoDB; do not duplicate the live archive into `lib/posts.ts`.

## Repeatable research brief

Record the exact primary query, related questions, reader intent, market/language/device, tool, metric, seven daily observations, prior-week comparison, evidence location, and pass/unverified/fail verdict. Inspect both engines, open relevant primary sources, describe the useful contribution, map existing articles, and record competing page types. Advertising competition is not an organic-difficulty score.

After publication, inspect the canonical URL and sitemap, notify IndexNow for changed URLs, and review actual query data over comparable periods. Keep impressions, clicks, indexed pages, AI citations and enquiries separate. Record observed outcomes rather than retroactively claiming a winning keyword.
