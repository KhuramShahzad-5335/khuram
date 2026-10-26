import { ArtGallery } from "./art-gallery";
import { NotebookBrowser } from "./notebook-browser";
import { getNotebook } from "@/lib/post-index";
import { BLOG_PAGE_SIZE } from "@/lib/notebook";
export async function NotebookPage({ page = 1 }: { page?: number }) {
  const { postIndex, blogPageCount, blogCategories } = await getNotebook();
  return (
    <main id="main" className="page-main">
      <span className="eyebrow">THE BLOG / DEVELOPMENT NOTEBOOK</span>
      <h1>
        Notes from
        <br />
        <span className="muted">the workbench.</span>
      </h1>
      <p className="page-intro">
        Useful details, small discoveries, and a few opinions about building
        things. <br />
        Find a topic, search an idea, or browse at your own pace.
      </p>
      <NotebookBrowser
        key={page}
        initialPosts={postIndex.slice(
          (page - 1) * BLOG_PAGE_SIZE,
          page * BLOG_PAGE_SIZE,
        )}
        initialPage={page}
        pageCount={blogPageCount}
        total={postIndex.length}
        categories={blogCategories}
      />
      <ArtGallery />
      <div className="blog-bottom">
        <code>// write → review → publish</code>
        <span>Room for the next idea.</span>
      </div>
    </main>
  );
}
