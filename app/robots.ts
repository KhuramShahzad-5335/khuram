import type { MetadataRoute } from "next";
import { siteUrl, isIndexable } from "@/lib/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    ...(isIndexable ? { sitemap: siteUrl + "/sitemap.xml" } : {}),
  };
}
