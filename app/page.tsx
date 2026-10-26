import { Home } from "@/components/home";
import { Services } from "@/components/services";
import { getPostSummaries, getPostStats } from "@/lib/server/posts";
import { HOME_POST_LIMIT } from "@/lib/notebook";
import { site, siteUrl, serializeJsonLd } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
const homeMetadata = pageMetadata(
  "Khuram Shahzad - Software Developer in Lahore",
  site.description,
  "/",
);
export const metadata = {
  ...homeMetadata,
  title: { absolute: site.title },
  openGraph: { ...homeMetadata.openGraph, title: site.title },
  twitter: { ...homeMetadata.twitter, title: site.title },
};
export const revalidate = 60;
export default async function Page() {
  const [postIndex, stats] = await Promise.all([
    getPostSummaries(HOME_POST_LIMIT),
    getPostStats(),
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": siteUrl + "/#person",
        name: site.name,
        url: siteUrl,
        jobTitle: "Self-employed Software Developer",
        sameAs: [site.github, site.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        name: site.name,
        alternateName: "Khuram Shahzad Portfolio",
        url: siteUrl,
        publisher: { "@id": siteUrl + "/#person" },
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <Home posts={postIndex} postCount={stats.total} services={<Services />} />
    </>
  );
}
