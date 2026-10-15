import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Run manually after a production deploy, never from the browser or build hook.
const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
async function main() {
  const args = process.argv.slice(2);
  assert(
    args.every((arg) => !arg.startsWith("--") || arg === "--submit"),
    "Supported option: --submit. Other arguments are canonical page URLs or paths.",
  );
  const submit = args.includes("--submit");
  const config = JSON.parse(await read("indexnow.config.json"));
  const origin = new URL(config.origin);
  assert(
    origin.protocol === "https:" &&
      origin.origin === config.origin &&
      !origin.username &&
      !origin.password,
    "Configure a canonical HTTPS origin.",
  );
  assert(
    /^\/[a-f\d]{32}\.txt$/.test(config.keyFile),
    "Invalid verification filename.",
  );
  const key = (await read(`public${config.keyFile}`)).trim();
  assert.equal(
    config.keyFile,
    `/${key}.txt`,
    "Verification filename and contents differ.",
  );
  assert.equal(
    (await read(`out${config.keyFile}`)).trim(),
    key,
    "Rebuild: exported verification file is missing or differs.",
  );
  const robots = await read("out/robots.txt");
  assert(
    !/^Disallow:\s*\/$/m.test(robots),
    "Refusing a non-indexable build. Rebuild with production configuration.",
  );
  const sitemap = await read("out/sitemap.xml");
  const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
    match[1].replaceAll("&amp;", "&"),
  );
  assert(
    listed.length > 0 &&
      listed.every((value) => new URL(value).origin === origin.origin),
    "Build sitemap does not match the configured origin.",
  );
  const requested = args.filter((arg) => arg !== "--submit");
  const urls = [
    ...new Set(
      requested.length
        ? requested.map((value) => new URL(value, origin).href)
        : listed,
    ),
  ];
  assert(
    urls.length > 0 && urls.length <= 10000,
    "Submit between 1 and 10,000 URLs.",
  );
  for (const value of urls) {
    const url = new URL(value);
    assert(
      url.origin === origin.origin &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        listed.includes(value),
      `Not a current canonical sitemap page: ${value}`,
    );
  }
  const keyLocation = new URL(config.keyFile, origin).href;
  const payload = { host: origin.hostname, key, keyLocation, urlList: urls };
  console.log(
    `${submit ? "Preparing" : "Dry run:"} ${urls.length} canonical URLs for ${origin.hostname}`,
  );
  console.log(`Verification file: ${keyLocation}`);
  for (const url of urls) console.log(url);
  if (!submit) {
    console.log(
      "No network requests sent. Deploy the verification file, then add --submit. For later updates, specify only changed page URLs.",
    );
  } else {
    const proof = await fetch(keyLocation, {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    const proofText = (await proof.text()).trim();
    if (proof.status !== 200) {
      throw new Error(
        `Verification file returned HTTP ${proof.status}. No URLs submitted.\n` +
          `Include public${config.keyFile} in your Git commit and push, then wait for a successful Vercel Production deployment.\n` +
          `Open ${keyLocation} and confirm it displays only the key before retrying. A local build alone does not update the live site.`,
      );
    }
    if (proofText !== key) {
      throw new Error(
        `Verification URL returned unexpected contents. No URLs submitted.\n` +
          `Check that ${keyLocation} serves the exact contents of public${config.keyFile}, without an HTML page or hosting challenge.`,
      );
    }
    console.log(
      `Ownership verified. Submitting ${urls.length} canonical URLs.`,
    );
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    await response.text();
    const messages = {
      200: "URLs received. Crawling/indexing remains the engines’ decision.",
      202: "URLs received; ownership-key validation is pending.",
      400: "Invalid request format.",
      403: "Key verification failed. Check the public file.",
      422: "Host, key, or URL validation failed.",
      429: "Rate limited. Stop and retry later; do not resubmit repeatedly.",
    };
    console.log(
      `IndexNow HTTP ${response.status}: ${messages[response.status] ?? "Unexpected response; check the endpoint before retrying."}`,
    );
    assert(
      response.status === 200 || response.status === 202,
      "IndexNow did not accept the submission.",
    );
  }
}

await main().catch((error) => {
  console.error(`IndexNow: ${error.message}`);
  process.exitCode = 1;
});
