"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Palette } from "lucide-react";

const navigation = [
  ["About", "/#about"],
  ["Projects", "/projects/"],
  ["Blog", "/blog/"],
  ["Experiments", "/experiments/"],
] as const;
export function SiteHeader({ onEditColors }: { onEditColors: () => void }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);
  return (
    <header className="relative z-10 mx-auto flex h-[90px] max-w-[1440px] items-center justify-between border-b border-(--border) px-[6%] max-[1000px]:px-[5%] max-[700px]:h-[75px]">
      <Link href="/" className="wordmark">
        khuram<span className="accent">.</span>
        <span className="ml-2.5 font-mono text-[11px] tracking-normal text-(--muted) max-[1000px]:hidden">
          {" "}
          / dev
        </span>
      </Link>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`gap-[30px] text-xs text-(--muted) min-[701px]:flex max-[1000px]:gap-[18px] max-[700px]:absolute max-[700px]:inset-x-0 max-[700px]:top-[75px] max-[700px]:flex-wrap max-[700px]:border-b max-[700px]:border-(--border) max-[700px]:bg-(--surface) max-[700px]:p-[25px] ${menu ? "flex" : "hidden"}`}
      >
        {navigation.map(([name, url]) => {
          const active = url !== "/#about" && path.startsWith(url);
          return (
            <Link
              key={name}
              href={url}
              onClick={() => setMenu(false)}
              aria-current={active ? "page" : undefined}
              className={`hover:text-(--text) ${active ? "text-(--text)" : ""}`}
            >
              {name}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-5 max-[700px]:gap-2.5">
        <button
          className="icon-button"
          onClick={onEditColors}
          aria-label="Edit website colors"
        >
          <Palette size={18} aria-hidden="true" />
        </button>
        <a
          className="flex items-center gap-2 text-xs max-[700px]:hidden"
          href="/#contact"
        >
          Let’s talk <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        <button
          className="icon-button min-[701px]:hidden"
          onClick={() => setMenu(!menu)}
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          aria-controls="main-navigation"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
