import { summarizePost } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { posts } from "@/lib/posts";
import { BlogCard } from "@/components/blog-card";
export const metadata = pageMetadata(
  "Notebook",
  "Practical guides to personal SEO, interface motion, static blogging, and color systems from Khuram Shahzad’s development notebook.",
  "/blog/",
);
export default function Page() {
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
        things.
        <br />A notebook with room to grow.
      </p>
      <div className="blog-card-grid">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={summarizePost(post)} />
        ))}
      </div>
      <div className="blog-bottom">
        <code>// write → review → build → deploy</code>
        <span>A static notebook. No dashboard required.</span>
      </div>
    </main>
  );
}
