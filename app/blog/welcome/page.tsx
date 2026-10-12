import Link from "next/link";
export const metadata = {
  title: "Notebook Reading Preview",
  robots: { index: false, follow: false },
  alternates: { canonical: "/blog/welcome/" },
};
export default function Page() {
  return (
    <main id="main" className="page-main reading">
      <Link href="/blog/" className="text-link">
        ← Back to notebook
      </Link>
      <span className="sample-label">READING LAYOUT PREVIEW</span>
      <h1>
        A small corner
        <br />
        for useful notes.
      </h1>
      <p className="reading-lead">
        This is a preview of how future articles will read. It is not a
        published personal story.
      </p>
      <article>
        <h2>A place for the details</h2>
        <p>
          Project cards can only tell you so much. The notebook leaves space for
          the reasoning behind a choice, a small discovery, or a useful
          explanation.
        </p>
        <h2>Simple by design</h2>
        <p>
          Future posts can live in Markdown or MDX files. The site builds them
          into pages, so reading is fast and publishing does not need a custom
          backend.
        </p>
        <pre>
          <code>
            {'// a note worth keeping\nconst approach = "keep it useful";'}
          </code>
        </pre>
        <h2>Real stories come next</h2>
        <p>
          When the first post is ready, this layout can hold headings, images,
          links, code, and the occasional detour. Until then, the notebook stays
          honest about being a work in progress.
        </p>
      </article>
    </main>
  );
}
