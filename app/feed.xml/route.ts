import { posts } from "@/lib/posts";
import { site, siteUrl, absoluteUrl } from "@/lib/site";
export const dynamic = "force-static";
function xml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
}
export function GET() {
  const entries = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => {
      const url = absoluteUrl("/blog/" + post.slug + "/");
      return `<item><title>${xml(post.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(post.excerpt)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`;
    })
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xml(site.name)} — Notebook</title><link>${xml(siteUrl + "/blog/")}</link><description>${xml(site.description)}</description><language>en</language>${entries}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
