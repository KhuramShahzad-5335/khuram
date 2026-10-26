/** Small browser-safe types/helpers; article bodies remain on the server; lib/posts.ts is the migration snapshot. */
export type PostSection = {
  id: string;
  title: string;
  paragraphs: string[];
  code?: string;
  links?: { title: string; url: string }[];
  image?: { src: string; alt: string; caption: string };
};
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  updatedAt?: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: PostSection[];
  sources: { title: string; url: string }[];
};
export type PostSummary = Pick<
  Post,
  "slug" | "title" | "excerpt" | "category" | "date" | "image" | "imageAlt"
> & { words: number; minutes: number };
export function wordCount(post: Post) {
  return [
    post.intro,
    ...post.sections.flatMap((s) => [s.title, ...s.paragraphs]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
export function readingMinutes(post: Post) {
  return Math.max(1, Math.ceil(wordCount(post) / 200));
}
export function summarizePost(post: Post): PostSummary {
  const { slug, title, excerpt, category, date, image, imageAlt } = post;
  return {
    slug,
    title,
    excerpt,
    category,
    date,
    image,
    imageAlt,
    words: wordCount(post),
    minutes: readingMinutes(post),
  };
}
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
