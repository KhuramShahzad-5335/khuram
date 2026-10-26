import assert from "node:assert/strict";
import { parsePostRecord } from "../lib/post-record.ts";

// Whitelist content and recovery metadata; never export sessions or arbitrary DB fields.
export function backupRecord(raw) {
  const post = parsePostRecord(raw);
  const revision = raw._studioRevision ?? 0;
  assert(
    Number.isSafeInteger(revision) && revision >= 0,
    "Invalid stored revision",
  );
  assert(
    raw._trashed === undefined || typeof raw._trashed === "boolean",
    "Invalid Trash state",
  );
  const history = raw._history ?? [];
  assert(
    Array.isArray(history) && history.length <= 10,
    "Invalid saved history",
  );
  return {
    ...post,
    _studioRevision: revision,
    _trashed: raw._trashed === true,
    _history: history.map((entry) => {
      assert(
        Number.isSafeInteger(entry.revision) &&
          entry.revision >= 0 &&
          entry.revision < revision,
        "Invalid historical revision",
      );
      assert(
        typeof entry.savedAt === "string" &&
          Number.isFinite(Date.parse(entry.savedAt)),
        "Invalid history timestamp",
      );
      const oldPost = parsePostRecord(entry.post);
      assert(oldPost.slug === post.slug, "History slug mismatch");
      return {
        post: oldPost,
        revision: entry.revision,
        savedAt: entry.savedAt,
      };
    }),
  };
}
export function readBackup(value) {
  assert(
    value?.version === 1 && Array.isArray(value.posts),
    "Unsupported backup format",
  );
  const posts = value.posts.map(backupRecord);
  assert(
    new Set(posts.map((p) => p.slug)).size === posts.length,
    "Backup has duplicate slugs",
  );
  return posts;
}
