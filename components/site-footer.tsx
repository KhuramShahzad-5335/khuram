import Link from "next/link";
import { Code2, Link2, Mail } from "lucide-react";
import { site } from "@/lib/site";
export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-[30px] border-t border-(--border) px-[6%] py-[35px] max-[1000px]:px-[5%] max-[1000px]:py-[30px] max-[700px]:gap-5">
      <Link href="/" className="wordmark">
        khuram<span className="accent">.</span>
      </Link>
      <span className="font-mono text-[10px] text-(--muted) max-[700px]:w-[65%] max-[700px]:text-[8px]">
        Built with care. And a few console.logs.
      </span>
      <div className="flex gap-5 text-(--muted)">
        <a href={site.github} aria-label="GitHub">
          <Code2 size={18} aria-hidden="true" />
        </a>
        <a href={site.linkedin} aria-label="LinkedIn">
          <Link2 size={18} aria-hidden="true" />
        </a>
        <a href={`mailto:${site.email}`} aria-label="Email">
          <Mail size={18} aria-hidden="true" />
        </a>
      </div>
      <small className="font-mono text-[9px] text-(--muted) max-[700px]:w-full">
        © {new Date().getFullYear()} {site.name}
      </small>
    </footer>
  );
}
