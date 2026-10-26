import Link from "next/link";
import { InformationPage } from "@/components/information-page";
import { pageMetadata } from "@/lib/metadata";
import { site, siteUrl, serializeJsonLd } from "@/lib/site";

export const metadata = pageMetadata(
  "About Khuram Shahzad",
  "Meet Khuram Shahzad, a self-employed software developer in Lahore and the publisher of this technology and AI notebook.",
  "/about/",
);
export default function Page() {
  return (
    <InformationPage
      title="The person behind the pixels."
      intro="I’m Khuram Shahzad, a self-employed software developer based in Lahore, Pakistan."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: site.name,
              url: siteUrl + "/about/",
              sameAs: [site.github, site.linkedin],
              jobTitle: "Software developer",
            },
          }),
        }}
      />
      <section>
        <h2>What I build</h2>
        <p>
          My work includes React and Next.js interfaces, Node.js applications,
          database-backed features, API integrations, and freelance websites.
          This portfolio brings together selected projects, the decisions behind
          them, and experiments in interaction and design.
        </p>
        <p>
          <Link href="/projects/">Explore the projects</Link> for individual
          contributions and their context. Project descriptions distinguish
          implemented work from illustrative previews.
        </p>
      </section>
      <section>
        <h2>What this notebook covers</h2>
        <p>
          The notebook explores software, AI tools, and the practical questions
          behind technology announcements: what changed, who benefits, what it
          costs, and what deserves a closer look. It includes both development
          notes and researched explainers for a broader audience.
        </p>
        <p>
          Research articles are not automatically hands-on product reviews.
          Vendor claims, examples, and measured results are different kinds of
          evidence; the articles should make that distinction clear.
        </p>
        <p>
          <Link href="/editorial/">Read the editorial standards</Link> or{" "}
          <Link href="/blog/">browse the notebook</Link>.
        </p>
      </section>
      <section>
        <h2>Work with me</h2>
        <p>
          For development work, collaboration, or a correction to an article,{" "}
          <Link href="/contact/">get in touch</Link>. My public work is also
          available on <a href={site.github}>GitHub</a> and{" "}
          <a href={site.linkedin}>LinkedIn</a>.
        </p>
      </section>
    </InformationPage>
  );
}
