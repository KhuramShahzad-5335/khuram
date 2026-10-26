import { access } from "node:fs/promises";
import { parsePostRecord, isPublished } from "../lib/post-record.ts";
import { connectBlog, reportDatabaseError } from "./blog-db.mjs";

async function main() {
  const { client, collection } = await connectBlog();
  try {
    const records = await collection.find({}).toArray();
    const slugs = new Set();
    let published = 0;
    for (const raw of records) {
      const record = parsePostRecord(raw);
      if (slugs.has(record.slug))
        throw new Error(`Duplicate slug: ${record.slug}`);
      slugs.add(record.slug);
      if (isPublished(record)) published++;
      for (const image of [
        record.image,
        record.image.replace(/\.svg$/, ".png"),
        ...record.sections.flatMap((s) => (s.image ? [s.image.src] : [])),
      ]) {
        if (!image) continue;
        await access(`public${image}`);
      }
    }
    console.log(
      `Database validation passed: ${records.length} articles, ${published} currently published; image files present locally.`,
    );
  } finally {
    await client.close();
  }
}
await main().catch(reportDatabaseError);
