import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { hasStudioSession, sameOrigin } from "@/lib/server/studio-auth";
import { UPLOAD_LIMIT, UPLOAD_TYPES } from "@/lib/article-images";

export const runtime = "nodejs";
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
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "Expected JSON." }, 415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Missing request." }, 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 16000) {
        await reader.cancel();
        return reply({ error: "Upload request is too large." }, 413);
      }
      chunks.push(value);
    }
    let body: HandleUploadBody;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return reply({ error: "Invalid request." }, 400);
    }
    if (
      !body ||
      !["blob.generate-client-token", "blob.upload-completed"].includes(
        body.type,
      )
    )
      return reply({ error: "Invalid upload request." }, 400);
    // Completion callbacks are signed by Vercel, not a browser session.
    // handleUpload verifies their signature; never put browser auth in front of them.
    if (body.type === "blob.generate-client-token") {
      if (!sameOrigin(request))
        return reply({ error: "Request origin is not allowed." }, 403);
      if (!(await hasStudioSession()))
        return reply({ error: "Sign in again before uploading." }, 401);
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN)
      return reply(
        {
          error:
            "Image storage is not configured. Set BLOB_READ_WRITE_TOKEN and redeploy.",
        },
        503,
      );
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^blog\/[a-zA-Z0-9_-]{1,160}\.(png|jpg|jpeg|webp)$/.test(pathname))
          throw new Error("Invalid image filename");
        return {
          allowedContentTypes: UPLOAD_TYPES,
          maximumSizeInBytes: UPLOAD_LIMIT,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
      // No completion webhook is needed: the owner attaches the URL by saving.
    });
    return reply(result);
  } catch {
    return reply(
      {
        error:
          "Upload could not be authorized. Check your session and Blob configuration, then retry.",
      },
      400,
    );
  }
}
