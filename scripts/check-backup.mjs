import assert from "node:assert/strict";
import { posts } from "../lib/posts.ts";
import { backupRecord, readBackup } from "./blog-backup-format.mjs";
const post = { ...posts[0], status: "published" };
const stored = {
  ...post,
  _studioRevision: 2,
  _trashed: true,
  _history: [
    {
      post: { ...post, status: "draft" },
      revision: 1,
      savedAt: "2026-10-26T00:00:00.000Z",
    },
  ],
  secret: "must-not-export",
};
const exported = backupRecord(stored);
assert(!("secret" in exported));
assert.equal(exported._history[0].post.status, "draft");
assert.equal(exported._trashed, true);
assert.deepEqual(readBackup({ version: 1, posts: [exported] }), [exported]);
assert.throws(() => readBackup({ version: 2, posts: [] }));
assert.throws(() => readBackup({ version: 1, posts: [exported, exported] }));
assert.throws(() => backupRecord({ ...stored, _studioRevision: -1 }));
assert.throws(() =>
  backupRecord({
    ...stored,
    _history: [
      { ...stored._history[0], post: { ...post, slug: "wrong-slug" } },
    ],
  }),
);
console.log(
  "Backup format checks passed: versions, publication states, history, unique slugs and private-field exclusion.",
);
