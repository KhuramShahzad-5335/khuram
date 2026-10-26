import { searchPosts } from "@/lib/server/posts";
import { BLOG_PAGE_SIZE } from "@/lib/notebook";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  const page = Number(params.get("page") || "1");
  const headers = { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" };
  if (
    query.length > 150 ||
    category.length > 100 ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000
  )
    return Response.json(
      { error: "Invalid search." },
      { status: 400, headers },
    );
  try {
    return Response.json(
      await searchPosts(query, category, page, BLOG_PAGE_SIZE),
      { headers },
    );
  } catch {
    return Response.json(
      { error: "Search is temporarily unavailable." },
      { status: 503, headers },
    );
  }
}
