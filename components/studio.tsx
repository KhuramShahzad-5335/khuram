"use client";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import type { PostRecord } from "@/lib/post-record";
import { wordCount, readingMinutes } from "@/lib/blog";
import { StudioImageUpload } from "./studio-image-upload";

type Article = { post: PostRecord; revision: number };
const inputClass =
  "mt-2 w-full rounded-lg border border-(--border) bg-(--background) px-3 py-2.5 text-(--text) outline-offset-4";
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
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  disabled = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  disabled?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="block text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          aria-describedby={hint ? id + "-hint" : undefined}
          className={inputClass + " min-h-32 resize-y"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          aria-describedby={hint ? id + "-hint" : undefined}
          className={inputClass}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {hint && (
        <span
          id={id + "-hint"}
          className="mt-1 block text-xs font-normal text-(--muted)"
        >
          {hint}
        </span>
      )}
    </div>
  );
}
export function Studio({
  configured,
  authenticated,
  articles,
}: {
  configured: boolean;
  authenticated: boolean;
  articles: Article[];
}) {
  const router = useRouter();
  const [list, setList] = useState(articles);
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
  useEffect(() => setList(articles), [articles]);
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
  function select(article?: Article) {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setPost(article ? structuredClone(article.post) : blank());
    setOriginalSlug(article?.post.slug ?? null);
    setRevision(article?.revision ?? 0);
    setDirty(false);
    setMessage("");
    setPreview(false);
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
      setList((old) => [
        article,
        ...old.filter((a) => a.post.slug !== article.post.slug),
      ]);
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
            <h2 className="mb-3 text-sm font-semibold">Your articles</h2>
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
function LinksEditor({
  label,
  links,
  onChange,
}: {
  label: string;
  links: { title: string; url: string }[];
  onChange: (links: { title: string; url: string }[]) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{label} (optional)</h3>
      {links.map((link, index) => (
        <div
          className="grid gap-3 rounded-lg border border-(--border) p-3"
          key={index}
        >
          <Field
            label={label + " " + (index + 1) + " label"}
            value={link.title}
            onChange={(title) =>
              onChange(links.map((l, i) => (i === index ? { ...l, title } : l)))
            }
          />
          <Field
            label={label + " " + (index + 1) + " URL"}
            value={link.url}
            onChange={(url) =>
              onChange(links.map((l, i) => (i === index ? { ...l, url } : l)))
            }
          />
          <button
            className="text-link justify-self-start"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            Remove link
          </button>
        </div>
      ))}
      <button
        className="text-link"
        onClick={() => onChange([...links, { title: "", url: "" }])}
      >
        Add {label.toLowerCase()} link
      </button>
    </div>
  );
}
