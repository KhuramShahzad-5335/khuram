/** Shared archive limits and URLs; contains no article bodies. */
export const BLOG_PAGE_SIZE = 3;
export const HOME_POST_LIMIT = 3;
export const RELATED_POST_LIMIT = 3;
export function notebookUrl(page: number) {
  return page === 1 ? "/blog/" : `/blog/page/${page}/`;
}
