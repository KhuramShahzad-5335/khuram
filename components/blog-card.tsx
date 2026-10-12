import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/lib/blog";

export function BlogCard({ post }: { post: PostSummary }) {
  return (
    <Link className="group block min-w-0" href={"/blog/" + post.slug + "/"}>
      <div className="overflow-hidden rounded-lg border border-(--border) bg-(--surface)">
        <Image
          className="block h-auto w-full transition-transform duration-400 group-hover:scale-[1.025] motion-reduce:transform-none"
          src={post.image}
          alt={post.imageAlt}
          width={1200}
          height={720}
        />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="eyebrow text-[8px]">{post.category}</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </div>
      <h2 className="my-3 text-2xl leading-[1.25] tracking-[-.7px]">
        {post.title}
      </h2>
      <p className="text-xs leading-[1.9] text-(--muted)">{post.excerpt}</p>
      <div className="mt-[18px] flex gap-[18px] font-mono text-[9px] text-(--muted)">
        <span>{post.words.toLocaleString("en-US")} words</span>
        <span>{post.minutes} min read</span>
      </div>
    </Link>
  );
}
