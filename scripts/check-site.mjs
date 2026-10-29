import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { withLocalSite } from "./local-site.mjs";

await withLocalSite(async (base) => {
  const pocketRedirect = await fetch(base + "/pocket/", { redirect: "manual" });
  assert.equal(pocketRedirect.status, 307);
  assert.equal(pocketRedirect.headers.get("location"), "/pocket/index.html");
  const pocket = await fetch(base + "/pocket/index.html");
  assert.equal(pocket.status, 200);
  assert.equal(pocket.headers.get("x-robots-tag"), "noindex, nofollow");
  const pocketHtml = await pocket.text();
  assert(pocketHtml.includes("./app.mjs"));
  assert(
    !pocketHtml.includes("/_next/"),
    "Pocket must remain a separate document",
  );
  for (const asset of [
    "app.mjs",
    "model.mjs",
    "store.mjs",
    "pocket.css",
    "sw.js",
    "manifest.webmanifest",
    "icon-192.png",
    "icon-512.png",
  ]) {
    assert.equal((await fetch(base + "/pocket/" + asset)).status, 200, asset);
  }
  const redirects = JSON.parse(
    await readFile("lib/blog-media-redirects.json", "utf8"),
  );
  for (const { source, destination } of redirects) {
    const response = await fetch(base + source, { redirect: "manual" });
    assert.equal(response.status, 308, "Legacy blog image URL must redirect");
    assert.equal(response.headers.get("location"), destination);
  }
  const read = async (file) => {
    const route = "/" + file.replace(/index\.html$/, "").replace(/^\//, "");
    const response = await fetch(base + route, {
      signal: AbortSignal.timeout(30000),
    });
    assert.equal(response.status, 200, `HTTP ${response.status}: ${route}`);
    return response.text();
  };
  const checked = new Set();
  const sitemap = await read("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => new URL(m[1]),
  );
  assert(urls.length > 0, "Sitemap must contain routes");
  assert.equal(
    new Set(urls.map(String)).size,
    urls.length,
    "Duplicate sitemap URLs",
  );
  const origin = urls[0].origin;
  const robots = await read("robots.txt");
  const indexable = !robots.includes("Disallow: /");
  if (indexable) {
    assert.notEqual(
      origin,
      "https://example.com",
      "Example domain must never be indexable",
    );
    assert(
      robots.includes(`${origin}/sitemap.xml`),
      "Production robots must expose sitemap",
    );
  }
  const titles = new Set();
  let assetsChecked = 0;
  const tagAttr = (tag, key) =>
    tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
  for (const url of urls) {
    assert.equal(url.origin, origin, "Sitemap mixes domains");
    const route = url.pathname;
    const html = await read(route);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert(title && !titles.has(title), `Missing or duplicate title: ${route}`);
    titles.add(title);
    assert.equal(
      [...html.matchAll(/<h1[\s>]/g)].length,
      1,
      `Expected one h1: ${route}`,
    );
    const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map((m) => m[0]);
    const canonical = tags.find((tag) => tagAttr(tag, "rel") === "canonical");
    assert.equal(
      tagAttr(canonical || "", "href"),
      url.href,
      `Canonical differs: ${route}`,
    );
    assert(
      tags.some(
        (tag) =>
          tagAttr(tag, "name") === "description" && tagAttr(tag, "content"),
      ),
      `Missing description: ${route}`,
    );
    assert(
      tags.some((tag) => tagAttr(tag, "property") === "og:image"),
      `Missing share image: ${route}`,
    );
    const directive = tags.find((tag) => tagAttr(tag, "name") === "robots");
    assert.equal(
      (tagAttr(directive || "", "content") || "").includes("noindex"),
      !indexable,
      `Indexing directive differs: ${route}`,
    );
    for (const schema of html.matchAll(
      /<script type="application\/ld\+json">(.*?)<\/script>/g,
    ))
      JSON.parse(schema[1]);
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      assert(
        tagAttr(image[0], "alt") !== undefined,
        `Missing image alt: ${route}`,
      );
      assert(
        tagAttr(image[0], "width") && tagAttr(image[0], "height"),
        `Missing image dimensions: ${route}`,
      );
    }
    for (const match of html.matchAll(
      /\b(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g,
    )) {
      const target = match[1];
      if (!target.startsWith("/") || target.startsWith("//")) continue;
      if (!checked.has(target)) {
        const response = await fetch(new URL(target, base), {
          method: "HEAD",
          signal: AbortSignal.timeout(30000),
        });
        assert(
          response.ok,
          `Broken local link/asset ${target} in ${route}: ${response.status}`,
        );
        checked.add(target);
        assetsChecked++;
      }
    }
  }
  const welcome = await read("blog/welcome/index.html");
  assert(welcome.includes("noindex"), "Draft preview must be noindex");
  assert(
    !urls.some((url) => url.pathname === "/blog/welcome/"),
    "Draft in sitemap",
  );
  const feed = await read("feed.xml");
  const blogUrls = urls.filter((url) => /^\/blog\/[^/]+\/$/.test(url.pathname));
  assert.equal(
    [...feed.matchAll(/<item>/g)].length,
    blogUrls.length,
    "RSS article count differs",
  );
  for (const url of blogUrls)
    assert(
      feed.includes(url.href),
      `Article missing from RSS: ${url.pathname}`,
    );
  console.log(
    `Server audit passed: ${urls.length} routes, ${assetsChecked} unique internal references, valid JSON-LD, RSS, and ${indexable ? "production" : "noindex"} directives.`,
  );
  const summaries = JSON.parse(await read("blog/search-index.json"));
  assert(!sitemap.includes("/studio"), "Private studio in sitemap");
  const studio = await fetch(base + "/studio/");
  assert((studio.headers.get("x-robots-tag") || "").includes("noindex"));
  assert((studio.headers.get("cache-control") || "").includes("no-store"));
  assert((await studio.text()).includes("Owner sign-in"));
  const uploadBody = {
    type: "blob.generate-client-token",
    payload: {
      pathname: "blog/check.png",
      clientPayload: null,
      multipart: false,
    },
  };
  for (const [origin, expected] of [
    ["https://untrusted.example", 403],
    [base, 401],
  ]) {
    const response = await fetch(base + "/studio/api/upload/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(uploadBody),
    });
    assert.equal(
      response.status,
      expected,
      "Upload authorization must reject unauthorized callers",
    );
    assert((response.headers.get("cache-control") || "").includes("no-store"));
  }
  const oversizedUpload = await fetch(base + "/studio/api/upload/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "x".repeat(17000) }),
  });
  assert.equal(oversizedUpload.status, 413);
  assert.equal(
    summaries.length,
    blogUrls.length,
    "Search index article count differs",
  );
  assert(
    summaries.every(
      (p) => !("sections" in p) && !("intro" in p) && !("_id" in p),
    ),
    "Search index exposes full articles or database fields",
  );
  for (const route of [
    "/blog/this-post-does-not-exist/",
    "/blog/page/1/",
    "/blog/page/999999/",
  ]) {
    const response = await fetch(base + route);
    assert.equal(
      response.status,
      404,
      `Unknown route must return 404: ${route}`,
    );
  }
});
