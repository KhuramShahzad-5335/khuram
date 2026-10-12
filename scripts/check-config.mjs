import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

// Separate processes avoid module-cache and environment leakage between scenarios.
for (const [url, vercel, expected] of [
  ["", "", false],
  ["https://example.com", "production", false],
  ["https://www.khuramshahzad.dev/", "production", true],
  ["https://www.khuramshahzad.dev", "preview", false],
  ["http://www.khuramshahzad.dev", "production", "invalid"],
  ["https://www.khuramshahzad.dev/blog", "production", "invalid"],
  ["https://user:password@example.com", "production", "invalid"],
]) {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--input-type=module",
      "-e",
      `import { isIndexable, siteUrl, serializeJsonLd } from './lib/site.ts'; console.log(JSON.stringify({ isIndexable, siteUrl })); const escaped = serializeJsonLd({ text: '</script>' }); if(escaped.includes('<') || JSON.parse(escaped).text !== '</script>') throw new Error('Unsafe JSON-LD');`,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_URL: url,
        VERCEL_ENV: vercel,
        NODE_NO_WARNINGS: "1",
      },
    },
  );
  if (expected === "invalid")
    assert.notEqual(result.status, 0, `Invalid origin accepted: ${url}`);
  else {
    assert.equal(result.status, 0, result.stderr);
    const data = JSON.parse(result.stdout);
    assert.equal(
      data.isIndexable,
      expected,
      `Indexing mismatch: ${url}/${vercel}`,
    );
    assert(!data.siteUrl.endsWith("/"), "Origin must be normalized");
  }
}

const content = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--input-type=module",
    "-e",
    `import { projects, experiments } from './lib/content.ts'; import { journeys } from './lib/journeys.ts'; for(const records of [projects, experiments]) { const slugs = records.map(record => record.slug); if(new Set(slugs).size !== slugs.length) throw new Error('Duplicate content slug'); for(const slug of slugs) if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid slug'); } for(const project of projects) if(!journeys[project.slug]) throw new Error('Missing journey: '+project.slug);`,
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  },
);
assert.equal(content.status, 0, content.stderr);
console.log(
  "Configuration/content checks passed: indexing guards, URL validation, safe JSON-LD, unique slugs, and project journeys.",
);
