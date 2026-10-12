import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const read = (file) => readFile(path.join(root, file), "utf8");
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
const tagAttr = (tag, key) => tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1];
for (const url of urls) {
  assert.equal(url.origin, origin, "Sitemap mixes domains");
  const route = url.pathname;
  const html = await read(path.join(route.slice(1), "index.html"));
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
    const file = path.resolve(root, "." + decodeURIComponent(target));
    assert(
      file === root || file.startsWith(root + path.sep),
      "Internal path escapes export",
    );
    try {
      await stat(file);
      assetsChecked++;
    } catch {
      assert.fail(`Broken local link/asset ${target} in ${route}`);
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
  assert(feed.includes(url.href), `Article missing from RSS: ${url.pathname}`);
console.log(
  `Export audit passed: ${urls.length} routes, ${assetsChecked} internal references, valid JSON-LD, RSS, and ${indexable ? "production" : "noindex"} directives.`,
);
