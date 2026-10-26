import { revalidatePath } from "next/cache";
import {
  hasStudioSession,
  loginStudio,
  logoutStudio,
  sameOrigin,
} from "@/lib/server/studio-auth";
import { blogCollection } from "@/lib/server/database";
import { parsePostRecord } from "@/lib/post-record";
export const dynamic = "force-dynamic";
function reply(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return reply({ error: "Request origin is not allowed." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "Expected JSON." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 500000)
    return reply({ error: "Article is too large." }, 413);
  try {
    // Read with a hard cap even when Content-Length is missing.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Missing request." }, 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 500000) {
        await reader.cancel();
        return reply({ error: "Article is too large." }, 413);
      }
      chunks.push(value);
    }
    let input;
    try {
      input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return reply({ error: "Invalid request." }, 400);
    }
    if (!input || typeof input !== "object")
      return reply({ error: "Invalid request." }, 400);
    if (input.action === "login") {
      const error = await loginStudio(input.password, request);
      return error
        ? reply({ error }, error.startsWith("Too many") ? 429 : 401)
        : reply({ ok: true });
    }
    if (!(await hasStudioSession()))
      return reply(
        {
          error:
            "Please sign in again. Your unsaved text is still in the editor.",
        },
        401,
      );
    if (input.action === "logout") {
      await logoutStudio();
      return reply({ ok: true });
    }
    if (input.action !== "save")
      return reply({ error: "Unknown action." }, 400);
    if (!Number.isSafeInteger(input.revision) || input.revision < 0)
      return reply({ error: "Invalid article revision." }, 400);
    let post;
    try {
      post = parsePostRecord(input.post);
    } catch (error) {
      return reply(
        {
          error:
            error instanceof Error
              ? error.message
              : "Check the article fields.",
        },
        400,
      );
    }
    if (input.originalSlug !== null && input.originalSlug !== post.slug)
      return reply(
        { error: "An existing article URL cannot be changed here." },
        400,
      );
    if (
      post.status === "published" &&
      post.date > new Date().toISOString().slice(0, 10)
    )
      return reply(
        { error: "Choose today or an earlier publication date." },
        400,
      );
    const collection = await blogCollection();
    await collection.createIndex(
      { slug: 1 },
      { unique: true, name: "unique_blog_slug" },
    );
    const revision = input.revision + 1;
    if (input.originalSlug === null) {
      if (
        await collection.findOne(
          { slug: post.slug },
          { projection: { _id: 1 } },
        )
      )
        return reply(
          { error: "That URL is already used. Choose a different slug." },
          409,
        );
      await collection.insertOne({ ...post, _studioRevision: revision });
    } else {
      const revisionFilter =
        input.revision === 0
          ? {
              $or: [
                { _studioRevision: 0 },
                { _studioRevision: { $exists: false } },
              ],
            }
          : { _studioRevision: input.revision };
      const result = await collection.updateOne(
        { slug: post.slug, ...revisionFilter },
        { $set: { ...post, _studioRevision: revision } },
      );
      if (!result.matchedCount)
        return reply(
          {
            error:
              "This article changed in another editor. Copy your unsaved text, reload, and compare before saving.",
          },
          409,
        );
    }
    for (const path of [
      "/",
      "/blog",
      "/sitemap.xml",
      "/feed.xml",
      "/blog/search-index.json",
    ])
      revalidatePath(path);
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/blog/page/[page]", "page");
    return reply({ ok: true, post, revision });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    )
      return reply({ error: "That article URL already exists." }, 409);
    return reply(
      {
        error:
          "Could not complete the request. Please try again; your editor text has been kept.",
      },
      503,
    );
  }
}
