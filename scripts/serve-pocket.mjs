import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const pocketRoot = fileURLToPath(
  new URL("../public/pocket/", import.meta.url),
);
export function pocketServer() {
  return http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, "http://localhost").pathname;
      const name =
        pathname === "/" ? "index.html" : decodeURIComponent(pathname).slice(1);
      const target = path.resolve(pocketRoot, name);
      if (!target.startsWith(path.resolve(pocketRoot) + path.sep))
        throw new Error("Invalid path");
      const body = await readFile(target);
      const type =
        {
          ".html": "text/html",
          ".css": "text/css",
          ".mjs": "text/javascript",
          ".js": "text/javascript",
          ".svg": "image/svg+xml",
          ".png": "image/png",
          ".webmanifest": "application/manifest+json",
        }[path.extname(target)] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 4313);
  pocketServer().listen(port, "127.0.0.1", () =>
    console.log(`Pocket: http://127.0.0.1:${port}/index.html`),
  );
}
