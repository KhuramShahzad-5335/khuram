import assert from "node:assert/strict";
import path from "node:path";
import { realpath, writeFile, readFile, stat } from "node:fs/promises";
import { connectBlog, reportDatabaseError } from "./blog-db.mjs";
import { backupRecord, readBackup } from "./blog-backup-format.mjs";

async function outsideRepository(filename) {
  const root = await realpath(process.cwd());
  const parent = await realpath(path.dirname(path.resolve(filename)));
  const relative = path.relative(root, parent);
  assert(
    relative.startsWith(".." + path.sep) || path.isAbsolute(relative),
    "Store backups in an existing folder outside this repository",
  );
  return path.join(parent, path.basename(filename));
}
async function main() {
  const [command, filename, ...options] = process.argv.slice(2);
  assert(
    ["export", "restore"].includes(command) && filename,
    "Usage: blog:backup -- <outside-repo.json> OR blog:restore -- <backup.json> --target <empty-db> [--apply]",
  );
  if (command === "export") {
    assert(options.length === 0, "Export accepts only the output filename");
    const destination = await outsideRepository(filename);
    const { client, collection } = await connectBlog();
    try {
      const posts = [];
      for await (const raw of collection.find({}).sort({ slug: 1 }))
        posts.push(backupRecord(raw));
      const json = JSON.stringify(
        { version: 1, exportedAt: new Date().toISOString(), posts },
        null,
        2,
      );
      assert(
        Buffer.byteLength(json) <= 100_000_000,
        "Export exceeds 100 MB; use Atlas backup tooling",
      );
      await writeFile(destination, json, { flag: "wx", mode: 0o600 });
      console.log(
        `Exported ${posts.length} articles, including drafts, Trash and saved versions. Existing files are never overwritten. Image bytes are not included.`,
      );
    } finally {
      await client.close();
    }
    return;
  }
  assert(
    options[0] === "--target" &&
      /^[a-zA-Z0-9_-]{1,63}$/.test(options[1] || "") &&
      (options.length === 2 ||
        (options.length === 3 && options[2] === "--apply")),
    "Restore requires --target <empty-db> and optional --apply",
  );
  const target = options[1];
  assert(
    ![process.env.MONGODB_DB || "portfolio", "admin", "local", "config"]
      .map((name) => name.toLowerCase())
      .includes(target.toLowerCase()),
    "Restore target must differ from the active database and system databases",
  );
  assert((await stat(filename)).size <= 100_000_000, "Backup exceeds 100 MB");
  const posts = readBackup(JSON.parse(await readFile(filename, "utf8")));
  const { client } = await connectBlog();
  try {
    const db = client.db(target);
    assert(
      (await db.listCollections({}, { nameOnly: true }).toArray()).length === 0,
      "Restore target must be an empty database",
    );
    if (!options.includes("--apply")) {
      console.log(
        `Validated ${posts.length} articles; target is empty. Dry run only. Add --apply to restore into this separate database.`,
      );
      return;
    }
    // Exclusive collection creation prevents a concurrent restore from overwriting data.
    const collection = await db.createCollection("posts");
    await collection.createIndex(
      { slug: 1 },
      { unique: true, name: "unique_blog_slug" },
    );
    await collection.createIndex(
      { status: 1, date: -1, slug: 1 },
      { name: "published_blog_dates" },
    );
    if (posts.length) await collection.insertMany(posts, { ordered: true });
    assert.equal(
      await collection.countDocuments(),
      posts.length,
      "Restore count mismatch",
    );
    console.log(
      `Restored ${posts.length} articles into the separate database. Active database unchanged. Review before switching configuration.`,
    );
  } finally {
    await client.close();
  }
}
await main().catch(reportDatabaseError);
