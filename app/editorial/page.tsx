import Link from "next/link";
import { InformationPage } from "@/components/information-page";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Editorial standards",
  "How this independent technology notebook uses sources, AI assistance, examples, corrections, and publication dates.",
  "/editorial/",
);
export default function Page() {
  return (
    <InformationPage
      title="Useful curiosity. Clear sources."
      intro="This is an independent notebook published by Khuram Shahzad. These standards explain how to read and evaluate its articles."
    >
      <section>
        <h2>Research and evidence</h2>
        <p>
          Technical explainers link to primary documentation, research, and
          product announcements where available. A company’s announcement
          establishes what the company says; it does not independently verify
          performance. Availability, prices, and features can change after
          publication.
        </p>
        <p>
          Hypothetical examples and decision frameworks are explanatory tools,
          not reported customer results. A review should only claim hands-on
          testing when the article describes what was actually tested.
        </p>
      </section>
      <section>
        <h2>AI assistance</h2>
        <p>
          AI tools assist with research, drafting, illustrations, and editing on
          this site, including the AI explainer collection published on 26
          October 2026. That collection is research-based commentary, not
          firsthand product testing. AI assistance can introduce errors; sources
          and correction channels are provided so claims can be checked.
        </p>
        <p>
          Articles are published under Khuram Shahzad’s name as the site
          publisher. They should not be interpreted as vendor endorsements or
          independent laboratory benchmarks.
        </p>
      </section>
      <section>
        <h2>Dates and corrections</h2>
        <p>
          Publication dates describe when an article was published here.
          Material updates should receive a revised date and an explanation
          within the article. Dates should not be refreshed merely to make old
          content appear new.
        </p>
        <p>
          To report an error,{" "}
          <Link href="/contact/">
            send the article URL and supporting evidence
          </Link>
          . Corrections should address the claim, not quietly replace the topic
          while preserving an unrelated search title.
        </p>
      </section>
      <section>
        <h2>Commercial relationships</h2>
        <p>
          Sponsored content and affiliate relationships, if introduced, must be
          disclosed on the relevant article. Ordinary external source links are
          provided for reference. Advertising must be visually separate from
          editorial content, and readers should never be encouraged to click ads
          to support this site.
        </p>
      </section>
      <section>
        <h2>Scope</h2>
        <p>
          Articles provide general educational information. Security,
          employment, privacy, and purchasing decisions depend on circumstances;
          examples are not professional advice or guarantees of results.
        </p>
      </section>
    </InformationPage>
  );
}
