/** Server content projection. Never import this module into client components. */
import "server-only";
import { getPublishedPosts } from "./server/posts";
import { summarizePost } from "./blog";
import { BLOG_PAGE_SIZE } from "./notebook";
export async function getPostIndex() {
  return (await getPublishedPosts()).map(summarizePost);
}
export async function getNotebook() {
  const postIndex = await getPostIndex();
  const blogPageCount = Math.max(
    1,
    Math.ceil(postIndex.length / BLOG_PAGE_SIZE),
  );
  const blogCategories = [
    ...new Set(postIndex.map((post) => post.category)),
  ].sort();
  return { postIndex, blogPageCount, blogCategories };
}
