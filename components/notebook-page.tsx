import { NotebookBrowser } from "./notebook-browser";
import { getNotebook } from "@/lib/post-index";
export async function NotebookPage({ page = 1 }: { page?: number }) {
  const { postIndex, total, blogPageCount, blogCategories } =
    await getNotebook(page);
  return (
    <main id="main" className="page-main">
      <header className="mb-10 grid items-end gap-8 border-b border-(--border) pb-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <span className="eyebrow">THE BLOG / DEVELOPMENT NOTEBOOK</span>
          <h1>
            Notes from
            <br />
            <span className="muted">the workbench.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-(--muted)">
            Useful details, small discoveries, and a few opinions about building
            things. <br />
            Find a topic, search an idea, or browse at your own pace.
          </p>
        </div>
        <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-(--muted)">
            From the workbench
          </span>
          <p className="my-4 text-sm leading-7">
            Code, decisions, and the useful bits learned along the way.
          </p>
          <div className="flex flex-wrap gap-3 border-t border-(--border) pt-4 text-xs text-(--muted)">
            <span>
              {total} {total === 1 ? "note" : "notes"}
            </span>
            <span aria-hidden="true">/</span>
            <span>{blogCategories.length} topics</span>
            <a
              href="/feed.xml"
              className="ml-auto text-(--accent) underline underline-offset-4"
            >
              RSS feed ↗
            </a>
          </div>
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
