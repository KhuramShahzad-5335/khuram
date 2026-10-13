/** Build-time content projection. Never import this module into client components. */
import { posts } from "./posts";
import { summarizePost } from "./blog";
import { BLOG_PAGE_SIZE } from "./notebook";
export const postIndex = [...posts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(summarizePost);
export const blogPageCount = Math.max(
  1,
  Math.ceil(postIndex.length / BLOG_PAGE_SIZE),
);
export const blogCategories = [
  ...new Set(postIndex.map((post) => post.category)),
].sort();
export function getBlogPage(page: number) {
  return postIndex.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
}
