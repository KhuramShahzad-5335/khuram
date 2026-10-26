import { NotebookBrowser } from "./notebook-browser";
import { getNotebook } from "@/lib/post-index";
export async function NotebookPage({ page = 1 }: { page?: number }) {
  const { postIndex, total, blogPageCount, blogCategories } =
    await getNotebook(page);
  return (
    <main id="main" className="page-main">
      <header className="mb-8 border-b border-(--border) pb-8">
        <div>
          <span className="eyebrow">THE BLOG / DEVELOPMENT NOTEBOOK</span>
          <h1 className="text-[clamp(2.25rem,4.5vw,4rem)]">
            Notes from
            <br />
            <span className="muted">the workbench.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-(--muted)">
            Useful details, small discoveries, and a few opinions about building
            things. Find a topic, search an idea, or browse at your own pace.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-(--muted)">
          <span>
            {total} {total === 1 ? "note" : "notes"}
          </span>
          <span aria-hidden="true">/</span>
          <span>{blogCategories.length} topics</span>
          <a
            href="/feed.xml"
            className="ml-auto py-2 text-(--accent) underline underline-offset-4"
          >
            RSS feed ↗
          </a>
        </div>
      </header>
      <NotebookBrowser
        key={page}
        initialPosts={postIndex}
        initialPage={page}
        pageCount={blogPageCount}
        total={total}
        categories={blogCategories}
      />
      <div className="blog-bottom border-t border-(--border) pt-6">
        <code>// write → review → publish</code>
        <span>Room for the next idea.</span>
      </div>
    </main>
  );
}
