import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { posts } from "../lib/posts.ts";
import { parsePostRecord } from "../lib/post-record.ts";
import { connectBlog, reportDatabaseError } from "./blog-db.mjs";

async function main() {
  assert(
    process.argv.slice(2).every((arg) => arg === "--apply"),
    "Supported option: --apply",
  );
  const records = posts.map((post) =>
    parsePostRecord({ ...post, status: "published" }),
  );
  assert.equal(
    new Set(records.map((p) => p.slug)).size,
    records.length,
    "Duplicate source slugs",
  );
  for (const record of records) {
    for (const image of [
      record.image,
      record.image.replace(/\.svg$/, ".png"),
      ...record.sections.flatMap((section) =>
        section.image ? [section.image.src] : [],
      ),
    ]) {
      await access(`public${image}`);
    }
  }
  const { client, db, collection } = await connectBlog();
  try {
    const existing = await collection
      .find({}, { projection: { slug: 1 } })
      .toArray();
    const slugs = existing.map((record) => record.slug);
    assert(
      slugs.every((slug) => typeof slug === "string") &&
        new Set(slugs).size === slugs.length,
      "Existing posts must have unique string slugs before migration",
    );
    const missing = records.filter((record) => !slugs.includes(record.slug));
    console.log(
      `Database: ${db.databaseName}; collection: posts. ${records.length} source articles, ${existing.length} existing documents, ${missing.length} to insert.`,
    );
    missing.forEach((post) => console.log(`Insert: ${post.slug}`));
    if (!process.argv.includes("--apply")) {
      console.log(
        "Dry run complete. No data changed. Add --apply to insert missing articles and create indexes.",
      );
      return;
    }
    await collection.createIndex(
      { slug: 1 },
      { unique: true, name: "unique_blog_slug" },
    );
    await collection.createIndex(
      { status: 1, date: -1, slug: 1 },
      { name: "published_blog_dates" },
    );
    if (records.length) {
      const result = await collection.bulkWrite(
        records.map((record) => ({
          updateOne: {
            filter: { slug: record.slug },
            update: { $setOnInsert: record },
            upsert: true,
          },
        })),
        { ordered: true },
      );
      console.log(
        `Inserted ${result.upsertedCount}; existing articles were not overwritten or deleted.`,
      );
    }
    for (const record of missing) {
      const stored = parsePostRecord(
        await collection.findOne({ slug: record.slug }),
      );
      assert.deepEqual(
        stored,
        record,
        `Migration content differs: ${record.slug}`,
      );
    }
    console.log(
      "Migration verified: inserted article text, slugs, dates and image paths match the source.",
    );
  } finally {
    await client.close();
  }
}
await main().catch(reportDatabaseError);
