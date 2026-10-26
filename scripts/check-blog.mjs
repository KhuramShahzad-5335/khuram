import assert from "node:assert/strict";
import { posts } from "../lib/posts.ts";
import { parsePostRecord, isPublished } from "../lib/post-record.ts";
const record = { ...posts[0], status: "published" };
for (const post of posts)
  assert.deepEqual(parsePostRecord({ ...post, status: "published" }), {
    ...post,
    status: "published",
  });
assert(!isPublished({ ...record, status: "draft" }));
assert(!isPublished({ ...record, date: "2099-01-01" }, "2026-10-26"));
assert(isPublished(record, "2026-10-26"));
for (const bad of [
  { ...record, slug: "welcome" },
  { ...record, slug: "../oops" },
  { ...record, status: "public" },
  { ...record, date: "2026-02-30" },
  { ...record, sections: [record.sections[0], record.sections[0]] },
  { ...record, sources: [{ title: "Unsafe", url: "javascript:alert(1)" }] },
  { ...record, image: "/images/../private.svg" },
])
  assert.throws(() => parsePostRecord(bad));
assert(
  !(
    "_id" in
    parsePostRecord({ ...record, _id: "internal", privateNotes: "private" })
  ),
);
assert(
  !("privateNotes" in parsePostRecord({ ...record, privateNotes: "private" })),
);
console.log(
  "Blog checks passed: source migration compatibility, publication filtering, dates, unsafe links, slugs, and public-field projection.",
);
