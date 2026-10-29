import { formatPostDate } from "@/lib/blog";
import { serializeJsonLd } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { wordCount, readingMinutes } from "@/lib/blog";
import { getPublishedPost } from "@/lib/server/posts";
import { site, siteUrl } from "@/lib/site";
import { RELATED_POST_LIMIT } from "@/lib/notebook";
import { getPostIndex } from "@/lib/post-index";
import { ProfileAvatar } from "@/components/profile-avatar";
import { BlogCard } from "@/components/blog-card";
import { socialImage } from "@/lib/article-images";
import { ArticleTable } from "@/components/article-table";
export function generateStaticParams() {
  return [];
}
export const revalidate = 60;
export const dynamicParams = true;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getPublishedPost(slug);
  if (!p) notFound();
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: "/blog/" + p.slug + "/" },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.excerpt,
      images: [socialImage(p.image)],
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
          url: socialImage(p.image),
          width: p.imageWidth || 1200,
          height: p.imageHeight || 720,
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
  const p = await getPublishedPost(slug);
  if (!p) notFound();
  const postIndex = await getPostIndex(RELATED_POST_LIMIT, 0, slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.updatedAt || p.date,
    wordCount: wordCount(p),
    image: new URL(socialImage(p.image), siteUrl).href,
    author: {
      "@type": "Person",
      name: "Khuram Shahzad",
      url: siteUrl + "/about/",
    },
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
        <ProfileAvatar />
        <div>
          <Link href="/about/">
            <strong>Khuram Shahzad</strong>
          </Link>
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
          width={p.imageWidth || 1200}
          height={p.imageHeight || 720}
          fetchPriority="high"
          loading="eager"
        />
        <figcaption>{p.imageAlt}</figcaption>
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
              {s.table && <ArticleTable table={s.table} />}
              {s.image && (
                <figure>
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    width={s.image.width || 1000}
                    height={s.image.height || 460}
                  />
                  <figcaption>{s.image.caption}</figcaption>
                </figure>
              )}
            </section>
          ))}
          <div className="further-reading">
            <p>
              <Link href="/editorial/">
                Sources, AI assistance, and editorial standards
              </Link>{" "}
              · <Link href="/contact/">Report a correction</Link>
            </p>
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
          {postIndex
            .filter((other) => other.slug !== p.slug)
            .slice(0, RELATED_POST_LIMIT)
            .map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
        </div>
      </section>
    </main>
  );
}
