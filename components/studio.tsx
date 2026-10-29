"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostRecord } from "@/lib/post-record";
import { wordCount, readingMinutes } from "@/lib/blog";
import { StudioImageUpload } from "./studio-image-upload";
import { ArticleTable } from "./article-table";
import { TableEditor } from "./studio/table-editor";

import type { Article, ArticleCard } from "@/lib/studio/types";
import { Field, LinksEditor, inputClass } from "./studio/fields";
const box = "rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-7";
const today = () => new Date().toISOString().slice(0, 10);
function blank(): PostRecord {
  return {
    slug: "",
    status: "draft",
    title: "",
    excerpt: "",
    category: "",
    date: today(),
    image: "",
    imageAlt: "",
    intro: "",
    sections: [{ id: "section-1", title: "", paragraphs: [] }],
    sources: [],
  };
}
async function request(body: object) {
  const response = await fetch("/studio/api/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}
export function Studio({
  configured,
  authenticated,
  articles,
  total,
}: {
  configured: boolean;
  authenticated: boolean;
  articles: ArticleCard[];
  total: number;
}) {
  const router = useRouter();
  const [list, setList] = useState(articles);
  const [listTotal, setListTotal] = useState(total);
  const [listPage, setListPage] = useState(1);
  const [trash, setTrash] = useState(false);
  const [history, setHistory] = useState<
    { title: string; revision: number; savedAt: string }[]
  >([]);
  const [post, setPost] = useState<PostRecord>(blank);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [password, setPassword] = useState("");
  const [saving, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const busy = saving || uploading;
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setList(articles);
    setListTotal(total);
    setListPage(1);
    setTrash(false);
  }, [articles, total]);
  useEffect(() => {
    function warn(e: BeforeUnloadEvent) {
      if (dirty || uploading) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploading]);
  function change(patch: Partial<PostRecord>) {
    setPost((p) => ({ ...p, ...patch }));
    setDirty(true);
  }
  function setArticle(article?: Article) {
    setPost(article ? structuredClone(article.post) : blank());
    setOriginalSlug(article?.post.slug ?? null);
    setRevision(article?.revision ?? 0);
    setDirty(false);
    setMessage("");
    setPreview(false);
    setHistory([]);
  }
  async function refreshList(page = listPage, inTrash = trash) {
    const result = await request({ action: "list", page, trash: inTrash });
    setList(result.articles);
    setListTotal(result.total);
    setListPage(page);
    setTrash(inTrash);
  }
  function select(article?: ArticleCard) {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    if (!article) {
      setArticle();
      return;
    }
    if (trash && !window.confirm("Restore this article as a private draft?"))
      return;
    void run(async () => {
      if (trash) {
        await request({
          action: "untrash",
          slug: article.post.slug,
          revision: article.revision,
        });
        await refreshList(1, false);
      }
      setArticle(await request({ action: "get", slug: article.post.slug }));
    });
  }
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      await task();
    } catch (e) {
      setFailed(true);
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  async function save(status: "draft" | "published") {
    if (
      status === "published" &&
      !window.confirm(
        originalSlug && post.status === "published"
          ? "Publish these changes to your live article?"
          : "Publish this article on your website?",
      )
    )
      return;
    if (
      status === "draft" &&
      post.status === "published" &&
      !window.confirm("Unpublish this article and save it as a private draft?")
    )
      return;
    await run(async () => {
      const result = await request({
        action: "save",
        post: {
          ...post,
          sections: post.sections.map((section) => ({
            ...section,
            paragraphs: section.paragraphs.filter((paragraph) =>
              paragraph.trim(),
            ),
          })),
          status,
          ...(status === "published" && originalSlug
            ? { updatedAt: today() }
            : {}),
        },
        originalSlug,
        revision,
      });
      const article = {
        post: result.post as PostRecord,
        revision: result.revision as number,
      };
      setPost(article.post);
      setOriginalSlug(article.post.slug);
      setRevision(article.revision);
      setDirty(false);
      setHistory([]);
      try {
        await refreshList(1, false);
      } catch {
        /* Saved data remains authoritative if listing is temporarily unavailable. */
      }
      setMessage(
        status === "published"
          ? "Published. Your blog, homepage, sitemap, and feed will refresh on their next request."
          : "Draft saved. It is not listed publicly.",
      );
    });
  }
  return (
    <div className="mx-auto max-w-6xl pb-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Owner workspace</span>
          <h1 className="mt-3 text-4xl font-semibold">Writing studio.</h1>
          <p className="mt-3 text-(--muted)">
            A quiet place to turn ideas into articles.
          </p>
        </div>
        {authenticated && (
          <button
            disabled={busy}
            className="button secondary"
            onClick={() => {
              if (
                dirty &&
                !window.confirm("Sign out and discard unsaved changes?")
              )
                return;
              void run(async () => {
                await request({ action: "logout" });
                setDirty(false);
                setPost(blank());
                setOriginalSlug(null);
                setRevision(0);
                setPreview(false);
                router.refresh();
              });
            }}
          >
            Sign out
          </button>
        )}
      </div>
      {message && (
        <p role={failed ? "alert" : "status"} className={box + " mb-6"}>
          {message}
        </p>
      )}
      {!authenticated ? (
        <form
          className={box + " mx-auto max-w-md"}
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              await request({ action: "login", password });
              setPassword("");
              router.refresh();
            });
          }}
        >
          <h2 className="text-xl font-semibold">Owner sign-in</h2>
          <p className="my-4 text-sm text-(--muted)">
            {configured
              ? "Enter your owner password to write and publish."
              : "Set your owner password with npm run studio:password in the project terminal, then restart the server. Add the resulting STUDIO_PASSWORD_HASH to Vercel before deployment."}
          </p>
          <label className="block text-sm">
            Password
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              required
              minLength={16}
              maxLength={256}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!configured || busy}
            />
          </label>
          <button className="button mt-5" disabled={!configured || busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className={box + " h-fit"}>
            <button
              className="button mb-5 w-full"
              disabled={busy}
              onClick={() => select()}
            >
              New article
            </button>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">
                {trash ? "Trash" : "Your articles"}
              </h2>
              <button
                className="text-link"
                disabled={busy}
                onClick={() => void run(() => refreshList(1, !trash))}
              >
                {trash ? "Show articles" : "Show trash"}
              </button>
            </div>
            {trash && (
              <p className="mb-3 text-xs text-(--muted)">
                Select an article to restore it as a draft.
              </p>
            )}
            {!list.length && (
              <p className="text-sm text-(--muted)">Nothing here yet.</p>
            )}
            <ul className="space-y-2">
              {list.map((a) => (
                <li key={a.post.slug}>
                  <button
                    disabled={busy}
                    onClick={() => select(a)}
                    aria-pressed={originalSlug === a.post.slug}
                    className={
                      "w-full rounded-lg border p-3 text-left text-sm " +
                      (originalSlug === a.post.slug
                        ? "border-(--accent) bg-(--background)"
                        : "border-transparent hover:border-(--border)")
                    }
                  >
                    <span className="block font-medium">
                      {a.post.title || a.post.slug}
                    </span>
                    <span className="mt-1 block text-xs text-(--muted)">
                      {a.post.status} · {a.post.date}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <nav
              aria-label="Studio article pages"
              className="mt-4 flex items-center justify-between gap-2 text-xs"
            >
              <button
                className="text-link"
                disabled={busy || listPage === 1}
                onClick={() => void run(() => refreshList(listPage - 1))}
              >
                Previous
              </button>
              <span>
                {listPage} / {Math.max(1, Math.ceil(listTotal / 20))}
              </span>
              <button
                className="text-link"
                disabled={busy || listPage * 20 >= listTotal}
                onClick={() => void run(() => refreshList(listPage + 1))}
              >
                Next
              </button>
            </nav>
          </aside>
          <div className="min-w-0 space-y-6">
            <div
              className={
                box + " flex flex-wrap items-center justify-between gap-3"
              }
            >
              <div>
                <strong>{originalSlug ? "Edit article" : "New article"}</strong>
                <p className="text-xs text-(--muted)">
                  {dirty
                    ? "Unsaved changes"
                    : originalSlug
                      ? "All changes saved"
                      : "Start with a title and URL"}{" "}
                  · {wordCount(post)} words · {readingMinutes(post)} min read
                </p>
              </div>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Back to editor" : "Preview"}
              </button>
            </div>
            {originalSlug && (
              <div className={box + " space-y-3"}>
                <div className="flex flex-wrap gap-4">
                  <button
                    disabled={busy}
                    className="text-link"
                    onClick={() =>
                      void run(async () => {
                        const result = await request({
                          action: "history",
                          slug: originalSlug,
                        });
                        setHistory(result.history);
                        if (!result.history.length)
                          setMessage(
                            "No earlier saved versions yet. Future saves keep the previous ten versions.",
                          );
                      })
                    }
                  >
                    View saved versions
                  </button>
                  <button
                    disabled={busy}
                    className="text-link"
                    onClick={() => {
                      const url = URL.createObjectURL(
                        new Blob([JSON.stringify(post, null, 2)], {
                          type: "application/json",
                        }),
                      );
                      const anchor = document.createElement("a");
                      anchor.href = url;
                      anchor.download = post.slug + ".json";
                      anchor.click();
                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }}
                  >
                    Download article
                  </button>
                  <button
                    disabled={busy}
                    className="text-link"
                    onClick={() => {
                      if (
                        !window.confirm(
                          "Move this article to Trash? It will leave the public blog. Unsaved changes will be discarded. You can restore it later.",
                        )
                      )
                        return;
                      void run(async () => {
                        await request({
                          action: "trash",
                          slug: originalSlug,
                          revision,
                        });
                        setArticle();
                        await refreshList(1, false);
                        setMessage(
                          "Moved to Trash. Restore it from the sidebar whenever needed.",
                        );
                      });
                    }}
                  >
                    Move to Trash
                  </button>
                </div>
                {history.length > 0 && (
                  <ul className="space-y-2 text-sm">
                    {history.map((item) => (
                      <li
                        key={item.revision}
                        className="flex flex-wrap justify-between gap-2"
                      >
                        <span>
                          Version {item.revision} ·{" "}
                          {new Date(item.savedAt).toLocaleString()}
                        </span>
                        <button
                          disabled={busy}
                          className="text-link"
                          onClick={() => {
                            if (
                              !window.confirm(
                                "Load this version into the editor? Unsaved edits will be replaced. Nothing goes live until you save or publish.",
                              )
                            )
                              return;
                            void run(async () => {
                              const result = await request({
                                action: "revision",
                                slug: originalSlug,
                                revision: item.revision,
                              });
                              setPost({ ...result.post, status: post.status });
                              setDirty(true);
                              setPreview(false);
                              setMessage(
                                "Earlier version loaded. Review it before saving or publishing.",
                              );
                            });
                          }}
                        >
                          Load version {item.revision}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {preview ? (
              <article className={box + " space-y-6 break-words"}>
                <span className="eyebrow">Private preview · {post.status}</span>
                <h2 className="text-3xl font-semibold">
                  {post.title || "Untitled article"}
                </h2>
                <p>{post.excerpt}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="aspect-[5/3] w-full rounded-xl object-cover"
                  />
                )}
                <p>{post.intro}</p>
                {post.sections.map((s, i) => (
                  <section key={i} className="space-y-4">
                    <h3 className="text-2xl font-semibold">{s.title}</h3>
                    {s.paragraphs.map((p, j) => (
                      <p className="whitespace-pre-wrap" key={j}>
                        {p}
                      </p>
                    ))}
                    {s.code && (
                      <pre className="overflow-x-auto rounded-lg bg-(--background) p-4 text-sm">
                        <code>{s.code}</code>
                      </pre>
                    )}
                    {s.table && <ArticleTable table={s.table} />}
                    {s.image && (
                      <figure>
                        <img
                          src={s.image.src}
                          alt={s.image.alt}
                          className="w-full rounded-lg"
                        />
                        <figcaption className="text-sm text-(--muted)">
                          {s.image.caption}
                        </figcaption>
                      </figure>
                    )}
                    {s.links?.map((l) => (
                      <p key={l.url}>
                        {l.title} — {l.url}
                      </p>
                    ))}
                  </section>
                ))}
                {post.sources.length > 0 && (
                  <section>
                    <h3 className="text-xl font-semibold">Sources</h3>
                    {post.sources.map((s, i) => (
                      <p key={i}>
                        {s.title} — {s.url}
                      </p>
                    ))}
                  </section>
                )}
              </article>
            ) : (
              <fieldset disabled={busy} className="min-w-0 space-y-6">
                <div className={box + " space-y-5"}>
                  <h2 className="text-xl font-semibold">Article details</h2>
                  <Field
                    label="Title"
                    value={post.title}
                    onChange={(title) => change({ title })}
                  />
                  <Field
                    label="URL slug"
                    disabled={originalSlug !== null}
                    value={post.slug}
                    onChange={(slug) => change({ slug })}
                    hint="Lowercase words separated by hyphens. Saved URLs stay fixed to protect existing links."
                  />
                  <Field
                    label="Summary / SEO description"
                    multiline
                    value={post.excerpt}
                    onChange={(excerpt) => change({ excerpt })}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Category"
                      value={post.category}
                      onChange={(category) => change({ category })}
                    />
                    <Field
                      label="Publication date (UTC)"
                      type="date"
                      value={post.date}
                      onChange={(date) => change({ date })}
                    />
                  </div>
                  <StudioImageUpload
                    label="Upload cover image"
                    src={post.image}
                    onBusy={setUploading}
                    onUploaded={({ src, width, height }) =>
                      change({
                        image: src,
                        imageWidth: width,
                        imageHeight: height,
                      })
                    }
                  />
                  <Field
                    label="Cover image description"
                    value={post.imageAlt}
                    onChange={(imageAlt) => change({ imageAlt })}
                  />
                  <Field
                    label="Introduction"
                    multiline
                    value={post.intro}
                    onChange={(intro) => change({ intro })}
                  />
                </div>
                {post.sections.map((section, index) => {
                  const edit = (patch: Partial<typeof section>) =>
                    change({
                      sections: post.sections.map((s, i) =>
                        i === index ? { ...s, ...patch } : s,
                      ),
                    });
                  return (
                    <div className={box + " space-y-5"} key={index}>
                      <div className="flex flex-wrap justify-between gap-3">
                        <h2 className="text-xl font-semibold">
                          Section {index + 1}
                        </h2>
                        <div className="flex gap-3">
                          <button
                            className="text-link"
                            disabled={index === 0}
                            onClick={() => {
                              const sections = [...post.sections];
                              [sections[index - 1], sections[index]] = [
                                sections[index],
                                sections[index - 1],
                              ];
                              change({ sections });
                            }}
                          >
                            Move up
                          </button>
                          <button
                            className="text-link"
                            onClick={() => {
                              if (window.confirm("Remove this section?"))
                                change({
                                  sections: post.sections.filter(
                                    (_, i) => i !== index,
                                  ),
                                });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <Field
                        label="Section heading"
                        value={section.title}
                        onChange={(title) => edit({ title })}
                      />
                      <Field
                        label="Section anchor"
                        value={section.id}
                        onChange={(id) => edit({ id })}
                        hint="Unique lowercase hyphenated label for the table of contents."
                      />
                      <Field
                        label="Paragraphs"
                        multiline
                        value={section.paragraphs.join("\n\n")}
                        onChange={(value) =>
                          edit({ paragraphs: value.split(/\n\n/) })
                        }
                        hint="Separate paragraphs with a blank line. Text is plain text, not HTML or Markdown."
                      />
                      <Field
                        label="Code example (optional)"
                        multiline
                        value={section.code || ""}
                        onChange={(code) => edit({ code: code || undefined })}
                      />
                      <TableEditor
                        table={section.table}
                        onChange={(table) => edit({ table })}
                      />
                      <details>
                        <summary className="cursor-pointer text-sm font-medium">
                          Section image and links (optional)
                        </summary>
                        <div className="mt-4 space-y-4">
                          <StudioImageUpload
                            label={`Upload section ${index + 1} image`}
                            src={section.image?.src || ""}
                            onBusy={setUploading}
                            onUploaded={(image) =>
                              edit({
                                image: {
                                  ...image,
                                  alt: section.image?.alt || "",
                                  caption: section.image?.caption || "",
                                },
                              })
                            }
                          />
                          {section.image && (
                            <>
                              <button
                                type="button"
                                className="text-link"
                                onClick={() => edit({ image: undefined })}
                              >
                                Remove section image
                              </button>
                              <Field
                                label="Section image description"
                                value={section.image.alt}
                                onChange={(alt) =>
                                  edit({ image: { ...section.image!, alt } })
                                }
                              />
                              <Field
                                label="Image caption"
                                value={section.image.caption}
                                onChange={(caption) =>
                                  edit({
                                    image: { ...section.image!, caption },
                                  })
                                }
                              />
                            </>
                          )}
                          <LinksEditor
                            label="Section links"
                            links={section.links || []}
                            onChange={(links) => edit({ links })}
                          />
                        </div>
                      </details>
                    </div>
                  );
                })}
                <button
                  className="button secondary"
                  onClick={() =>
                    change({
                      sections: [
                        ...post.sections,
                        {
                          id: "section-" + Date.now(),
                          title: "",
                          paragraphs: [],
                        },
                      ],
                    })
                  }
                >
                  Add section
                </button>
                <div className={box}>
                  <LinksEditor
                    label="Sources"
                    links={post.sources}
                    onChange={(sources) => change({ sources })}
                  />
                </div>
              </fieldset>
            )}
            <div className={box + " flex flex-wrap items-center gap-3"}>
              <button
                disabled={busy}
                className="button secondary"
                onClick={() => void save("draft")}
              >
                {post.status === "published"
                  ? "Unpublish to draft"
                  : "Save draft"}
              </button>
              <button
                disabled={busy}
                className="button"
                onClick={() => void save("published")}
              >
                {uploading
                  ? "Uploading image…"
                  : busy
                    ? "Saving…"
                    : post.status === "published"
                      ? "Publish changes"
                      : "Publish article"}
              </button>
              {originalSlug && post.status === "published" && (
                <a
                  className="text-link"
                  href={"/blog/" + originalSlug + "/"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View live article ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
