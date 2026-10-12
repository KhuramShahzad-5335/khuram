import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzip } from "node:zlib";
import { promisify } from "node:util";
const root = path.resolve("out");
const compress = promisify(gzip);
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be an integer between 1 and 65535");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let file = path.resolve(root, "." + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      let info;
      try {
        info = await stat(file);
      } catch {}
      if (info?.isDirectory()) file = path.join(file, "index.html");
      if (
        !info &&
        path.basename(file).startsWith("__next.") &&
        file.endsWith(".txt")
      ) {
        const parts = path.basename(file, ".txt").split(".");
        file =
          path.join(
            path.dirname(file),
            parts.slice(0, 2).join("."),
            ...parts.slice(2),
          ) + ".txt";
      }
      const content = await readFile(file);
      const type = mime[path.extname(file)] || "application/octet-stream";
      const useGzip =
        /\bgzip\b/.test(req.headers["accept-encoding"] || "") &&
        /text\/|javascript|json|svg|xml/.test(type);
      res.writeHead(200, {
        "Content-Type": type,
        Vary: "Accept-Encoding",
        "Cache-Control": pathname.startsWith("/_next/static/")
          ? "public, max-age=31536000, immutable"
          : "no-store",
        ...(useGzip ? { "Content-Encoding": "gzip" } : {}),
      });
      res.end(useGzip ? await compress(content) : content);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      try {
        res.end(await readFile(path.join(root, "404.html")));
      } catch {
        res.end("Not found");
      }
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Portfolio preview: http://127.0.0.1:${port}`),
  );
