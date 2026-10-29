import assert from "node:assert/strict";
import { posts } from "../lib/posts.ts";
import { parsePostRecord, isPublished } from "../lib/post-record.ts";
import { isArticleImage, socialImage } from "../lib/article-images.ts";
import { wordCount } from "../lib/blog.ts";
const record = { ...posts[0], status: "published" };
const comparison = {
  caption: "Model choice",
  headers: ["Task", "Check"],
  rows: [["Extraction", "Evidence"]],
};
const withTable = {
  ...record,
  sections: [
    { id: "comparison", title: "Compare", paragraphs: [], table: comparison },
  ],
};
assert.deepEqual(parsePostRecord(withTable).sections[0].table, comparison);
assert.equal(
  wordCount(withTable) -
    wordCount({
      ...withTable,
      sections: [{ ...withTable.sections[0], table: undefined }],
    }),
  6,
);
for (const table of [
  { ...comparison, headers: ["Only one"] },
  { ...comparison, rows: [["Missing cell"]] },
  { ...comparison, rows: [] },
  { ...comparison, caption: "" },
  { ...comparison, rows: [["Extraction", { html: "unsafe" }]] },
  { ...comparison, rows: Array.from({ length: 41 }, () => ["a", "b"]) },
])
  assert.throws(() =>
    parsePostRecord({
      ...withTable,
      sections: [{ ...withTable.sections[0], table }],
    }),
  );
assert.equal(
  parsePostRecord({
    ...withTable,
    status: "draft",
    sections: [
      {
        ...withTable.sections[0],
        table: { caption: "", headers: ["", ""], rows: [["", ""]] },
      },
    ],
  }).sections[0].table.caption,
  "",
);
const blob =
  "https://example.public.blob.vercel-storage.com/blog/cover-Ab123.png";
assert(isArticleImage(blob));
assert.equal(socialImage(blob), blob);
assert.equal(socialImage("/images/cover.svg"), "/images/cover.png");
assert.equal(
  new URL(socialImage(blob), "https://www.khuramshahzad.dev").href,
  blob,
);
assert.equal(
  parsePostRecord({ ...record, image: blob, imageWidth: 800, imageHeight: 600 })
    .imageWidth,
  800,
);
for (const image of [
  "https://evil.example/blog/image.png",
  "https://example.public.blob.vercel-storage.com.evil.example/blog/image.png",
  "https://user@example.public.blob.vercel-storage.com/blog/image.png",
  "https://example.public.blob.vercel-storage.com/blog/image.svg",
  blob + "?download=1",
  blob + "#fragment",
  blob.replace("https:", "http:"),
  "data:image/png;base64,abc",
  "/images/../private.png",
])
  assert.throws(() => parsePostRecord({ ...record, image }));
for (const dimensions of [
  { imageWidth: 0, imageHeight: 1 },
  { imageWidth: 800 },
  { imageWidth: 12001, imageHeight: 1 },
])
  assert.throws(() => parsePostRecord({ ...record, ...dimensions }));
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
  { ...record, slug: "search" },
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
