import "server-only";
import { cache } from "react";
import { blogCollection } from "./database";
import { isPublished, parsePostRecord } from "../post-record";

/** Route ISR caches rendered HTML for 60s. React cache deduplicates queries per render. */
export const getPublishedPosts = cache(async () => {
  const source = process.env.BLOG_SOURCE || "mongodb";
  if (source !== "mongodb" && source !== "files")
    throw new Error("BLOG_SOURCE must be mongodb or files");
  const today = new Date().toISOString().slice(0, 10);
  const records =
    source === "files"
      ? (await import("../posts")).posts.map((post) => ({
          ...post,
          status: "published",
        }))
      : await (
          await blogCollection()
        )
          .find(
            { status: "published", date: { $lte: today } },
            { projection: { _id: 0 } },
          )
          .maxTimeMS(10000)
          .toArray();
  // Never hide DB failures by serving the old file snapshot or an empty archive.
  return records
    .map(parsePostRecord)
    .filter((record) => isPublished(record, today))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
});
export const getPublishedPost = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  return (await getPublishedPosts()).find((post) => post.slug === slug);
});
