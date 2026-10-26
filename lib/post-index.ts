import "server-only";
import { getPostSummaries, getPostStats } from "./server/posts";
import { BLOG_PAGE_SIZE } from "./notebook";
export const getPostIndex = getPostSummaries;
export async function getNotebook(page = 1) {
  const [stats, postIndex] = await Promise.all([
    getPostStats(),
    getPostSummaries(BLOG_PAGE_SIZE, (page - 1) * BLOG_PAGE_SIZE),
  ]);
  return {
    postIndex,
    total: stats.total,
    blogPageCount: Math.max(1, Math.ceil(stats.total / BLOG_PAGE_SIZE)),
    blogCategories: stats.categories,
  };
}
