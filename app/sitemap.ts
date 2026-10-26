import type { MetadataRoute } from "next";
import { projects, experiments } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { getNotebook } from "@/lib/post-index";
import { notebookUrl } from "@/lib/notebook";
import { getPostSummaries } from "@/lib/server/posts";
export const dynamic = "force-static";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { blogPageCount } = await getNotebook();
  const posts = await getPostSummaries();
  return [
    ...[
      "/",
      "/projects/",
      "/blog/",
      "/about/",
      "/contact/",
      "/editorial/",
      "/privacy/",
      ...Array.from({ length: blogPageCount - 1 }, (_, i) =>
        notebookUrl(i + 2),
      ),
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
