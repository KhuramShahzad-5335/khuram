import type { Post, PostSection } from "./blog.ts";

export type PostRecord = Post & { status: "draft" | "published" };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reserved = new Set(["welcome", "page", "search-index", "feed"]);
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected an article object");
  return value as Record<string, unknown>;
}
function text(value: unknown, field: string, max = 100000): string {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`Invalid article field: ${field}`);
  return value;
}
function date(value: unknown, field: string): string {
  const result = text(value, field, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(result) ||
    !Number.isFinite(Date.parse(result)) ||
    new Date(result).toISOString().slice(0, 10) !== result
  )
    throw new Error(`Use YYYY-MM-DD for ${field}`);
  return result;
}
function list(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Expected an array: ${field}`);
  return value;
}
function link(value: unknown): { title: string; url: string } {
  const item = object(value);
  const url = text(item.url, "link URL", 2048);
  if (!/^\/(?!\/)[^\s\\]*$/.test(url) && !/^https:\/\/[^\s]+$/.test(url))
    throw new Error("Article links must use HTTPS or a site-relative path");
  return { title: text(item.title, "link title", 500), url };
}
function imagePath(value: unknown): string {
  const path = text(value, "image", 500);
  if (
    !/^\/images\/[a-zA-Z0-9_./-]+\.(svg|png|jpg|jpeg|webp|avif)$/.test(path) ||
    path.includes("..")
  )
    throw new Error("Use a deployed /images/ file for article images");
  return path;
}
/** Validate Compass edits and project only public fields; never send Mongo IDs to the client. */
export function parsePostRecord(value: unknown): PostRecord {
  const raw = object(value);
  const fieldText = (value: unknown, field: string, max = 100000) =>
    raw.status === "draft" && value === "" ? "" : text(value, field, max);
  const slug = text(raw.slug, "slug", 160);
  if (!slugPattern.test(slug) || reserved.has(slug))
    throw new Error("Invalid or reserved article slug");
  if (raw.status !== "draft" && raw.status !== "published")
    throw new Error("Article status must be draft or published");
  const sections: PostSection[] = list(raw.sections, "sections").map(
    (value) => {
      const section = object(value);
      const id = text(section.id, "section id", 160);
      if (!slugPattern.test(id)) throw new Error("Invalid section id");
      const result: PostSection = {
        id,
        title: fieldText(section.title, "section title", 500),
        paragraphs: list(section.paragraphs, "paragraphs").map((p) =>
          fieldText(p, "paragraph"),
        ),
      };
      if (section.code !== undefined) result.code = text(section.code, "code");
      if (section.links !== undefined)
        result.links = list(section.links, "links").map(link);
      if (section.image !== undefined) {
        const image = object(section.image);
        result.image = {
          src: imagePath(image.src),
          alt: text(image.alt, "image alt", 1000),
          caption: text(image.caption, "caption", 2000),
        };
      }
      if (
        raw.status === "published" &&
        !result.paragraphs.length &&
        !result.code &&
        !result.image
      )
        throw new Error(
          "Each published section needs paragraphs, code, or an image",
        );
      return result;
    },
  );
  if (
    (raw.status === "published" && !sections.length) ||
    new Set(sections.map((s) => s.id)).size !== sections.length
  )
    throw new Error("Articles require sections with unique ids");
  const published = date(raw.date, "date");
  const updatedAt =
    raw.updatedAt === undefined ? undefined : date(raw.updatedAt, "updatedAt");
  if (updatedAt && updatedAt < published)
    throw new Error("updatedAt cannot precede date");
  return {
    slug,
    status: raw.status,
    title: text(raw.title, "title", 200),
    excerpt: fieldText(raw.excerpt, "excerpt", 2000),
    category: fieldText(raw.category, "category", 100),
    date: published,
    ...(updatedAt ? { updatedAt } : {}),
    image:
      raw.status === "draft" && raw.image === "" ? "" : imagePath(raw.image),
    imageAlt: fieldText(raw.imageAlt, "imageAlt", 1000),
    intro: fieldText(raw.intro, "intro"),
    sections,
    sources: list(raw.sources, "sources").map(link),
  };
}
export function isPublished(
  record: PostRecord,
  today = new Date().toISOString().slice(0, 10),
) {
  return record.status === "published" && record.date <= today;
}
