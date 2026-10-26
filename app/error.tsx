"use client";

import Link from "next/link";

export default function PageError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main id="main" className="page-main">
      <div className="mx-auto max-w-2xl rounded-xl border border-(--border) bg-(--surface) p-6 sm:p-10">
        <span className="eyebrow">A SMALL INTERRUPTION</span>
        <h1 className="!text-3xl sm:!text-4xl">This page needs another try.</h1>
        <p className="my-6 leading-8 text-(--muted)">
          Something didn’t load as expected. Try again, or head back to the
          homepage while things settle.
        </p>
        <div className="flex flex-wrap gap-4">
          <button type="button" className="button" onClick={retry}>
            Try again
          </button>
          <Link className="button secondary" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
