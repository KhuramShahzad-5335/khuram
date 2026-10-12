import { Home } from "@/components/home";
import { posts } from "@/lib/posts";
import { summarizePost } from "@/lib/blog";
import { site, siteUrl, serializeJsonLd } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Software Developer",
  site.description,
  "/",
);
export default function Page() {
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
        name: site.title,
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
      <Home posts={posts.map(summarizePost)} />
    </>
  );
}
