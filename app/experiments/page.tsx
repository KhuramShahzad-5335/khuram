import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { experiments } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";
export const metadata = pageMetadata(
  "Playground",
  "Small interfaces, React experiments, and learning projects by Khuram Shahzad.",
  "/experiments/",
);
export default function Page() {
  return (
    <main id="main" className="page-main">
      <span className="eyebrow">THE PLAYGROUND / SMALL THINGS</span>
      <h1>
        Big curiosity.
        <br />
        <span className="muted">Smaller experiments.</span>
      </h1>
      <p className="page-intro">
        The little builds that make room for learning.
        <br />
        Practice projects, interface studies, and useful rabbit holes.
      </p>
      <div className="experiment-grid">
        {experiments.map((e, i) => (
          <Link
            href={"/experiments/" + e.slug + "/"}
            className="experiment"
            key={e.slug}
          >
            <div>
              <code>{String(i + 1).padStart(2, "0")} / EXPERIMENT</code>
              <ArrowUpRight size={19} />
            </div>
            <h2>{e.name}</h2>
            <p>{e.description}</p>
            <small>{e.stack}</small>
          </Link>
        ))}
      </div>
    </main>
  );
}
