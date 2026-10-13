import { summarizePost, formatPostDate } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts, wordCount, readingMinutes } from "@/lib/posts";
import { site, siteUrl } from "@/lib/site";
import { BlogCard } from "@/components/blog-card";
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = posts.find((p) => p.slug === slug);
  if (!p) notFound();
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: "/blog/" + p.slug + "/" },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.excerpt,
      images: [p.image.replace(".svg", ".png")],
    },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      type: "article",
      siteName: site.name,
      authors: [siteUrl],
      url: "/blog/" + p.slug + "/",
      modifiedTime: p.updatedAt || p.date,
      publishedTime: p.date,
      images: [
        {
          url: p.image.replace(".svg", ".png"),
          width: 1200,
          height: 720,
          alt: p.imageAlt,
        },
      ],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = posts.find((p) => p.slug === slug);
  if (!p) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.updatedAt || p.date,
    wordCount: wordCount(p),
    image: siteUrl + p.image.replace(".svg", ".png"),
    author: { "@type": "Person", name: "Khuram Shahzad", url: siteUrl },
    mainEntityOfPage: siteUrl + "/blog/" + p.slug + "/",
  };
  return (
    <main id="main" className="page-main blog-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      <Link href="/blog/" className="text-link">
        ← Back to notebook
      </Link>
      <span className="eyebrow detail-category">{p.category}</span>
      <h1>{p.title}</h1>
      <p className="reading-lead">{p.excerpt}</p>
      <div className="article-meta">
        <span className="author-avatar">KS</span>
        <div>
          <strong>Khuram Shahzad</strong>
          <span>
            <time dateTime={p.date}>{formatPostDate(p.date)}</time> ·{" "}
            {wordCount(p)} words · {readingMinutes(p)} min read
          </span>
        </div>
      </div>
      <figure className="article-cover">
        <Image
          src={p.image}
          alt={p.imageAlt}
          width={1200}
          height={720}
          fetchPriority="high"
          loading="eager"
        />
        <figcaption>Original illustration for this notebook entry.</figcaption>
      </figure>
      <div className="article-layout">
        <aside className="article-toc">
          <span className="eyebrow">IN THIS NOTE</span>
          <nav aria-label="Article contents">
            {p.sections.map((s) => (
              <a key={s.id} href={"#" + s.id}>
                {s.title}
              </a>
            ))}
          </nav>
          <span className="article-count">
            {wordCount(p)} words of useful curiosity.
          </span>
        </aside>
        <article className="article-body">
          <p className="article-intro">{p.intro}</p>
          {p.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {s.links && (
                <ul className="mt-5 space-y-2 text-sm">
                  {s.links.map((link) => (
                    <li key={link.url}>
                      <a
                        className="underline decoration-(--border) underline-offset-4 hover:decoration-(--accent)"
                        href={link.url}
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {s.code && (
                <pre>
                  <code>{s.code}</code>
                </pre>
              )}
              {s.image && (
                <figure>
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    width={1000}
                    height={460}
                  />
                  <figcaption>{s.image.caption}</figcaption>
                </figure>
              )}
            </section>
          ))}
          <div className="further-reading">
            <h2>Further reading</h2>
            {p.sources.map((s) => (
              <a key={s.url} href={s.url}>
                {s.title} ↗
              </a>
            ))}
          </div>
        </article>
      </div>
      <section className="related-posts">
        <span className="eyebrow">KEEP THE RABBIT HOLE GOING</span>
        <h2>Another useful detour.</h2>
        <div className="blog-card-grid">
          {posts
            .filter((other) => other.slug !== p.slug)
            .map((post) => (
              <BlogCard key={post.slug} post={summarizePost(post)} />
            ))}
        </div>
      </section>
    </main>
  );
}
