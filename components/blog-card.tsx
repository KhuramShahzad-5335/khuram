import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatPostDate, type PostSummary } from "@/lib/blog";

export function BlogCard({ post }: { post: PostSummary }) {
  return (
    <Link
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-(--border) bg-(--surface) transition-colors hover:border-(--accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
      href={"/blog/" + post.slug + "/"}
    >
      <div className="aspect-[5/3] overflow-hidden border-b border-(--border) bg-(--background)">
        <Image
          className="block h-full w-full object-contain transition-transform duration-400 group-hover:scale-[1.025] motion-reduce:transform-none"
          src={post.image}
          alt={post.imageAlt}
          width={1200}
          height={720}
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-(--accent)">
            {post.category}
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </div>
        <h2 className="my-4 text-2xl leading-[1.3] tracking-[-.7px]">
          {post.title}
        </h2>
        <p className="mb-6 line-clamp-3 text-sm leading-[1.8] text-(--muted)">
          {post.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4 text-[11px] text-(--muted)">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>
            {post.minutes} min read · {post.words.toLocaleString("en-US")} words
          </span>
        </div>
      </div>
    </Link>
  );
}
