import type { MetadataRoute } from "next";
import { projects, experiments } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { posts } from "@/lib/posts";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...[
      "/",
      "/projects/",
      "/blog/",
      "/experiments/",
      ...projects.map((p) => "/projects/" + p.slug + "/"),
      ...experiments.map((e) => "/experiments/" + e.slug + "/"),
    ].map((path) => ({ url: siteUrl + path })),
    ...posts.map((p) => ({
      url: siteUrl + "/blog/" + p.slug + "/",
      lastModified: p.updatedAt || p.date,
    })),
  ];
}
