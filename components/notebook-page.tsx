import { NotebookBrowser } from "./notebook-browser";
import {
  blogCategories,
  blogPageCount,
  getBlogPage,
  postIndex,
} from "@/lib/post-index";
export function NotebookPage({ page = 1 }: { page?: number }) {
  return (
    <main id="main" className="page-main">
      <span className="eyebrow">THE NOTEBOOK / IDEAS WORTH KEEPING</span>
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
        initialPosts={getBlogPage(page)}
        initialPage={page}
        pageCount={blogPageCount}
        total={postIndex.length}
        categories={blogCategories}
      />
      <div className="blog-bottom">
        <code>// write → review → build → deploy</code>
        <span>A static notebook. Room for the next idea.</span>
      </div>
    </main>
  );
}
