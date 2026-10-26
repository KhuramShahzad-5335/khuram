"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/blog";
import { BLOG_PAGE_SIZE, notebookUrl } from "@/lib/notebook";
import { BlogCard } from "./blog-card";

export function NotebookBrowser({
  initialPosts,
  initialPage,
  pageCount,
  total,
  categories,
}: {
  initialPosts: PostSummary[];
  initialPage: number;
  pageCount: number;
  total: number;
  categories: string[];
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState<{
    posts: PostSummary[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [filteredPage, setFilteredPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const filtering = Boolean(query.trim() || category);
  useEffect(() => {
    if (!filtering) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: query.trim(),
          category,
          page: String(filteredPage),
        });
        const response = await fetch("/blog/search/?" + params, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) setResult(data);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filtering, query, category, filteredPage, retry]);
  const pages = filtering
    ? Math.ceil((result?.total || 0) / BLOG_PAGE_SIZE)
    : pageCount;
  const current = filtering ? filteredPage : initialPage;
  const visible = filtering ? result?.posts || [] : initialPosts;
  function reset() {
    setQuery("");
    setCategory("");
    setFilteredPage(1);
  }
  function changePage(page: number) {
    setFilteredPage(page);
    resultsRef.current?.focus();
  }
  return (
    <section aria-label="Browse notebook articles">
      <div className="my-8 grid gap-4 rounded-xl border border-(--border) bg-(--surface) p-5 sm:grid-cols-[1fr_240px]">
        <label className="grid gap-2 text-sm">
          Search the notebook
          <input
            disabled={!ready}
            type="search"
            maxLength={150}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setFilteredPage(1);
            }}
            placeholder="Title, topic, or keyword"
            className="min-w-0 rounded-lg border border-(--border) bg-(--background) px-4 py-3 text-(--text)"
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span id="notebook-topic-label">Topic</span>
          <select
            aria-labelledby="notebook-topic-label"
            disabled={!ready}
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setFilteredPage(1);
            }}
            className="min-w-0 rounded-lg border border-(--border) bg-(--background) px-4 py-3 text-(--text)"
          >
            <option value="">All topics</option>
            {categories.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>
        <noscript>
          <p>
            Search needs JavaScript. Browse every article using the archive
            links below.
          </p>
        </noscript>
      </div>
      <div
        ref={resultsRef}
        tabIndex={-1}
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
        aria-label="Article results"
      >
        <p role="status" className="text-sm text-(--muted)">
          {loading
            ? "Searching the notebook…"
            : failed && filtering
              ? "Search is unavailable. The archive is still below."
              : filtering
                ? `${result?.total || 0} matching ${result?.total === 1 ? "article" : "articles"}`
                : `${total} articles · Page ${initialPage} of ${pageCount}`}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="text-link">
            Clear filters
          </button>
        )}
      </div>
      {failed && filtering && (
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="button secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Retry search
          </button>
          <Link href="/blog/" className="text-link">
            Browse the archive
          </Link>
        </div>
      )}
      <div className="blog-card-grid" aria-busy={loading}>
        {(loading || (failed && filtering) ? initialPosts : visible).map(
          (post) => (
            <BlogCard key={post.slug} post={post} />
          ),
        )}
      </div>
      {!filtering && total === 0 && (
        <div className="rounded-xl border border-dashed border-(--border) p-10 text-center">
          <h2 className="text-xl">The next note is taking shape.</h2>
          <p className="mt-3 text-sm text-(--muted)">
            Come back soon for something useful from the workbench.
          </p>
        </div>
      )}
      {filtering && result && !loading && !failed && result.total === 0 && (
        <div className="rounded-xl border border-(--border) p-8">
          <h2 className="mb-3 text-xl">No notes found.</h2>
          <p className="text-sm text-(--muted)">
            Try a broader keyword or choose another topic.
          </p>
        </div>
      )}
      {filtering && result && !failed ? (
        pages > 1 && (
          <nav
            aria-label="Search result pages"
            className="mt-10 flex flex-wrap items-center justify-between gap-4"
          >
            <button
              type="button"
              className="button secondary disabled:opacity-40"
              disabled={loading || current === 1}
              onClick={() => changePage(current - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-(--muted)">
              Page {current} of {pages}
            </span>
            <button
              type="button"
              className="button secondary disabled:opacity-40"
              disabled={loading || current >= pages}
              onClick={() => changePage(current + 1)}
            >
              Next
            </button>
          </nav>
        )
      ) : (
        <nav
          aria-label="Notebook archive pages"
          className="mt-10 flex flex-wrap items-center justify-between gap-4"
        >
          {initialPage > 1 ? (
            <Link
              className="button secondary"
              href={notebookUrl(initialPage - 1)}
            >
              Newer notes
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-(--muted)">
            Page {initialPage} of {pageCount}
          </span>
          {initialPage < pageCount ? (
            <Link
              className="button secondary"
              href={notebookUrl(initialPage + 1)}
            >
              Older notes
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
