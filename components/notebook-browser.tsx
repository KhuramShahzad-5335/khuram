"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/blog";
import { BLOG_PAGE_SIZE, notebookUrl } from "@/lib/notebook";
import { BlogCard } from "./blog-card";

let indexRequest: Promise<PostSummary[]> | undefined;
function loadIndex() {
  return (indexRequest ??= fetch("/blog/search-index.json")
    .then((response) => {
      if (!response.ok) throw new Error("Index unavailable");
      return response.json() as Promise<PostSummary[]>;
    })
    .catch((error) => {
      indexRequest = undefined;
      throw error;
    }));
}
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
  const [index, setIndex] = useState<PostSummary[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [filteredPage, setFilteredPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const filtering = Boolean(query.trim() || category);
  useEffect(() => {
    if (!filtering || index) return;
    let active = true;
    setFailed(false);
    loadIndex()
      .then((data) => {
        if (active) setIndex(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [filtering, index, retry]);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches = (index ?? []).filter(
    (post) =>
      (!category || post.category === category) &&
      terms.every((term) =>
        `${post.title} ${post.excerpt} ${post.category}`
          .toLocaleLowerCase()
          .includes(term),
      ),
  );
  const pages = filtering
    ? Math.ceil(matches.length / BLOG_PAGE_SIZE)
    : pageCount;
  const current = filtering
    ? Math.min(filteredPage, Math.max(1, pages))
    : initialPage;
  const visible = filtering
    ? matches.slice((current - 1) * BLOG_PAGE_SIZE, current * BLOG_PAGE_SIZE)
    : initialPosts;
  const loading = filtering && !index && !failed;
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
            ? "Loading the search index…"
            : failed && filtering
              ? "Search is unavailable. The archive is still below."
              : filtering
                ? `${matches.length} matching ${matches.length === 1 ? "article" : "articles"}`
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
      <div className="blog-card-grid">
        {(loading || (failed && filtering) ? initialPosts : visible).map(
          (post) => (
            <BlogCard key={post.slug} post={post} />
          ),
        )}
      </div>
      {filtering && index && matches.length === 0 && (
        <div className="rounded-xl border border-(--border) p-8">
          <h2 className="mb-3 text-xl">No notes found.</h2>
          <p className="text-sm text-(--muted)">
            Try a broader keyword or choose another topic.
          </p>
        </div>
      )}
      {filtering && index ? (
        pages > 1 && (
          <nav
            aria-label="Search result pages"
            className="mt-10 flex flex-wrap items-center justify-between gap-4"
          >
            <button
              type="button"
              className="button secondary disabled:opacity-40"
              disabled={current === 1}
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
              disabled={current === pages}
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
