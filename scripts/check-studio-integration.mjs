import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { connectBlog, reportDatabaseError } from "./blog-db.mjs";
import { posts } from "../lib/posts.ts";
import { withLocalSite } from "./local-site.mjs";

// Uses a disposable database only; never seeds, edits or drops the configured portfolio DB.
const suffix = randomBytes(8).toString("hex");
const databaseName = `portfolio_qa_${suffix}`;
const restoreName = `portfolio_qa_restore_${suffix}`;
const activeName = process.env.MONGODB_DB || "portfolio";
assert.notEqual(activeName, databaseName);
assert.notEqual(activeName, restoreName);
process.env.MONGODB_DB = databaseName;
process.env.BLOG_SOURCE = "mongodb";
const password = randomBytes(24).toString("hex");
const salt = randomBytes(16).toString("hex");
process.env.STUDIO_PASSWORD_HASH = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
delete process.env.VERCEL;
const exec = promisify(execFile);
const directory = await mkdtemp(path.join(tmpdir(), "portfolio-recovery-"));
let client;
try {
  ({ client } = await connectBlog());
  const db = client.db(databaseName);
  assert.equal((await db.listCollections().toArray()).length, 0);
  const collection = db.collection("posts");
  const records = Array.from({ length: 21 }, (_, i) => ({
    ...posts[0],
    slug: `qa-note-${i}`,
    title: `QA note ${i}`,
    status: "draft",
    _studioRevision: 0,
  }));
  await collection.insertMany(records);
  await withLocalSite(async (base) => {
    let cookie = "";
    async function api(
      body,
      expected = 200,
      authenticated = true,
      origin = base,
    ) {
      const response = await fetch(base + "/studio/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin,
          ...(authenticated && cookie ? { cookie } : {}),
        },
        body: JSON.stringify(body),
      });
      assert.equal(
        response.status,
        expected,
        `Unexpected status for ${body.action}`,
      );
      return { response, data: await response.json() };
    }
    await api({ action: "list", page: 1, trash: false }, 401, false);
    await api(
      { action: "login", password },
      403,
      false,
      "https://unrelated.example",
    );
    const login = await api({ action: "login", password });
    cookie = login.response.headers.get("set-cookie").split(";")[0];
    const first = (await api({ action: "list", page: 1, trash: false })).data;
    assert.equal(first.total, 21);
    assert.equal(first.articles.length, 20);
    assert(!JSON.stringify(first).includes('"sections"'));
    assert.equal(
      (await api({ action: "list", page: 2, trash: false })).data.articles
        .length,
      1,
    );
    const original = (await api({ action: "get", slug: "qa-note-0" })).data;
    const post = {
      ...original.post,
      title: "Recovery test",
      status: "published",
    };
    const saved = (
      await api({ action: "save", post, originalSlug: post.slug, revision: 0 })
    ).data;
    assert.equal(saved.revision, 1);
    await api(
      { action: "save", post, originalSlug: post.slug, revision: 0 },
      409,
    );
    const history = (await api({ action: "history", slug: post.slug })).data
      .history;
    assert.equal(history.length, 1);
    assert.equal(history[0].revision, 0);
    assert(!("post" in history[0]));
    const old = (
      await api({ action: "revision", slug: post.slug, revision: 0 })
    ).data.post;
    assert.equal(old.title, original.post.title);
    assert.equal(
      (await collection.findOne({ slug: post.slug })).title,
      post.title,
      "Viewing a revision must not save it",
    );
    const search = await (
      await fetch(base + "/blog/search/?q=Recovery")
    ).json();
    assert.equal(search.total, 1);
    assert(!("sections" in search.posts[0]));
    assert(!("_history" in search.posts[0]));
    await api({ action: "trash", slug: post.slug, revision: 1 });
    assert.equal(
      (await (await fetch(base + "/blog/search/?q=Recovery")).json()).total,
      0,
    );
    await api({ action: "get", slug: post.slug }, 404);
    const trashed = (await api({ action: "list", page: 1, trash: true })).data;
    assert.equal(trashed.total, 1);
    await api({ action: "untrash", slug: post.slug, revision: 2 });
    const restored = (await api({ action: "get", slug: post.slug })).data;
    assert.equal(restored.post.status, "draft");
    assert.equal(restored.revision, 3);
    await api({ action: "logout" });
    await api({ action: "get", slug: post.slug }, 401);
    console.log(
      "Studio integration passed: auth, origin checks, bounded lists, revisions, conflict protection, Trash and restore-as-draft.",
    );
  });
  const backup = path.join(directory, "posts.json");
  const command = (args) =>
    exec(
      process.execPath,
      ["--experimental-strip-types", "scripts/blog-backup.mjs", ...args],
      { env: process.env, maxBuffer: 1024 * 1024 },
    );
  await command(["export", backup]);
  await command(["restore", backup, "--target", restoreName]);
  assert.equal(
    (await client.db(restoreName).listCollections().toArray()).length,
    0,
    "Dry run wrote data",
  );
  await command(["restore", backup, "--target", restoreName, "--apply"]);
  assert.equal(
    await client.db(restoreName).collection("posts").countDocuments(),
    21,
  );
  const recovered = await client
    .db(restoreName)
    .collection("posts")
    .findOne({ slug: "qa-note-0" });
  assert.equal(recovered._history.length, 3);
  assert.equal(recovered.status, "draft");
  await assert.rejects(
    command(["restore", backup, "--target", restoreName, "--apply"]),
  );
  await assert.rejects(
    command(["restore", backup, "--target", databaseName, "--apply"]),
  );
  console.log(
    "Recovery drill passed: export, dry run, restore to separate empty DB, history preserved, overwrite refused.",
  );
} catch (error) {
  // Subprocess errors can include environmental context; only report bounded assertion messages.
  reportDatabaseError(
    error?.name === "AssertionError"
      ? error
      : new Error(
          "Isolated integration check failed. Check local database permissions and the production build.",
        ),
  );
} finally {
  if (client) {
    for (const name of [databaseName, restoreName]) {
      assert(
        /^portfolio_qa_(?:restore_)?[a-f0-9]{16}$/.test(name) &&
          name !== activeName,
      );
      await client.db(name).dropDatabase();
    }
    await client.close();
  }
  assert(
    path.dirname(path.resolve(directory)) === path.resolve(tmpdir()) &&
      path.basename(directory).startsWith("portfolio-recovery-"),
  );
  await rm(directory, { recursive: true, force: true });
}
