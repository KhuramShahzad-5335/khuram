import "server-only";
import { cache } from "react";
import { blogCollection } from "./database";
import { isPublished, parsePostRecord, parsePostSummary } from "../post-record";
import { summarizePost, type PostSummary } from "../blog";

function fileSource() {
  const source = process.env.BLOG_SOURCE || "mongodb";
  if (!["mongodb", "files"].includes(source))
    throw new Error("Invalid BLOG_SOURCE");
  return source === "files";
}
const publishedFilter = () => ({
  status: "published",
  date: { $lte: new Date().toISOString().slice(0, 10) },
  _trashed: { $ne: true },
});
const snapshot = cache(async () =>
  (await import("../posts")).posts
    .map((p) => parsePostRecord({ ...p, status: "published" }))
    .filter((p) => isPublished(p))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    ),
);

// Compute reading counts in MongoDB; article bodies and revision history never leave it for lists.
const prose = {
  $concat: [
    "$intro",
    " ",
    {
      $reduce: {
        input: "$sections",
        initialValue: "",
        in: {
          $concat: [
            "$$value",
            " ",
            "$$this.title",
            " ",
            {
              $reduce: {
                input: "$$this.paragraphs",
                initialValue: "",
                in: { $concat: ["$$value", " ", "$$this"] },
              },
            },
          ],
        },
      },
    },
  ],
};
const projection = {
  _id: 0,
  slug: 1,
  title: 1,
  excerpt: 1,
  category: 1,
  date: 1,
  updatedAt: 1,
  image: 1,
  imageAlt: 1,
  words: { $size: { $regexFindAll: { input: prose, regex: "\\S+" } } },
};
type Summary = PostSummary & { updatedAt?: string };
export const getPublishedPost = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined;
  if (fileSource()) return (await snapshot()).find((p) => p.slug === slug);
  const raw = await (
    await blogCollection()
  ).findOne(
    { ...publishedFilter(), slug },
    { projection: { _history: 0 }, maxTimeMS: 10000 },
  );
  return raw ? parsePostRecord(raw) : undefined;
});
export const getPostStats = cache(async () => {
  if (fileSource()) {
    const posts = await snapshot();
    return {
      total: posts.length,
      categories: [...new Set(posts.map((p) => p.category))].sort(),
    };
  }
  const collection = await blogCollection();
  const [total, categories] = await Promise.all([
    collection.countDocuments(publishedFilter(), { maxTimeMS: 10000 }),
    collection.distinct("category", publishedFilter(), { maxTimeMS: 10000 }),
  ]);
  return { total, categories: (categories as string[]).sort() };
});
export const getPostSummaries = cache(
  async (limit = 0, skip = 0, exclude = "") => {
    if (fileSource()) {
      const all = (await snapshot()).filter((p) => p.slug !== exclude);
      return (limit ? all.slice(skip, skip + limit) : all.slice(skip)).map(
        (p) => ({ ...summarizePost(p), updatedAt: p.updatedAt }),
      );
    }
    const records = await (
      await blogCollection()
    )
      .aggregate<Summary>(
        [
          {
            $match: {
              ...publishedFilter(),
              ...(exclude ? { slug: { $ne: exclude } } : {}),
            },
          },
          { $sort: { date: -1, slug: 1 } },
          ...(skip ? [{ $skip: skip }] : []),
          ...(limit ? [{ $limit: limit }] : []),
          { $project: projection },
        ],
        { maxTimeMS: 10000 },
      )
      .toArray();
    return records.map(parsePostSummary);
  },
);
export async function searchPosts(
  query: string,
  category: string,
  page: number,
  limit: number,
) {
  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  if (fileSource()) {
    const all = (await getPostSummaries()).filter(
      (p) =>
        (!category || p.category === category) &&
        terms.every((t) =>
          `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(t),
        ),
    );
    return {
      total: all.length,
      posts: all.slice((page - 1) * limit, page * limit),
    };
  }
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const filter = {
    ...publishedFilter(),
    ...(category ? { category } : {}),
    ...(terms.length
      ? {
          $and: escaped.map((term) => ({
            $or: ["title", "excerpt", "category"].map((field) => ({
              [field]: { $regex: term, $options: "i" },
            })),
          })),
        }
      : {}),
  };
  const collection = await blogCollection();
  const [total, records] = await Promise.all([
    collection.countDocuments(filter, { maxTimeMS: 10000 }),
    collection
      .aggregate<Summary>(
        [
          { $match: filter },
          { $sort: { date: -1, slug: 1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: projection },
        ],
        { maxTimeMS: 10000 },
      )
      .toArray(),
  ]);
  return {
    total,
    posts: records.map(parsePostSummary),
  };
}
