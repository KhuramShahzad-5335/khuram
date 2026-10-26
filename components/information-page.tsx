import Link from "next/link";
import type { ReactNode } from "react";

export function InformationPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="page-main">
      <Link href="/" className="text-link">
        ← Back home
      </Link>
      <span className="eyebrow mt-8 block">KHURAM SHAHZAD / NOTEBOOK</span>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
        {title}
      </h1>
      <p className="reading-lead mt-6 max-w-3xl">{intro}</p>
      <div className="article-body mt-12 max-w-3xl pb-12 [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </main>
  );
}
