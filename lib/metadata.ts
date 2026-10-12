import type { Metadata } from "next";
import { site } from "./site";

/** Keep canonical, search description, and social previews aligned on each route. */
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      images: [
        { url: "/opengraph.png", width: 1200, height: 630, alt: site.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/opengraph.png"],
    },
  };
}
