import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { chromium } from "@playwright/test";
import {
  initialDesk,
  validateBackup,
  safeUrl,
  themes,
  contrast,
} from "../public/pocket/model.mjs";
import { pocketServer } from "./serve-pocket.mjs";

const sample = initialDesk();
assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(sample))), sample);
for (const u of [
  "javascript:alert(1)",
  "data:text/html,test",
  "https://user:pass@example.com",
  "file:///secret",
])
  assert.equal(safeUrl(u), null);
assert.equal(safeUrl("https://example.com"), "https://example.com/");
for (const t of themes)
  assert.ok(Math.min(contrast(t.ink, t.bg), contrast(t.ink, t.surface)) >= 4.5);
for (const mutate of [
  (s) => s.cards.push(s.cards[0]),
  (s) => (s.cards[0].collection = "missing"),
  (s) => (s.palette.bg = "red"),
  (s) => (s.cards[0].type = "script"),
  (s) => (s.cards[0].body = 42),
]) {
  const bad = structuredClone(sample);
  mutate(bad);
  assert.throws(() => validateBackup(bad));
}
const server = pocketServer();
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_BINARY
      ? { executablePath: process.env.CHROME_BINARY }
      : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const errors = [];
  const outbound = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
      outbound.push(r.url());
  });
  await page.goto(base + "/index.html");
  await page.getByText("✓ Saved on this device", { exact: true }).waitFor();
  assert.equal(await page.locator(".card").count(), 5);
  await page.keyboard.press("n");
  await page.getByLabel("Title", { exact: true }).fill("Private test note");
  await page
    .getByLabel("Your words")
    .fill('<script>alert("never execute")</script>');
  await page.getByRole("button", { name: "Keep it", exact: true }).click();
  await page
    .getByRole("heading", { name: "Private test note", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "Private test note", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Move Private test note later", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelectorAll(".card h2")[1]?.textContent ===
      "Private test note",
  );
  await page
    .getByRole("button", { name: "Pin Private test note", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Unpin Private test note", exact: true })
    .waitFor();
  await page.getByLabel("Search cards").fill("never execute");
  assert.equal(await page.locator(".card").count(), 1);
  await page.getByLabel("Search cards").fill("");
  await page
    .getByRole("button", {
      name: "Move Private test note to Trash",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await page
    .getByRole("heading", { name: "Private test note", exact: true })
    .waitFor();
  await page.locator(".section-label button").click();
  await page.getByLabel("Collection name").fill("Reading shelf");
  await page
    .getByRole("button", { name: "Create collection", exact: true })
    .click();
  await page.getByRole("heading", { name: "Reading shelf." }).waitFor();
  await page.locator('[data-view="all"]').click();
  await page.getByRole("button", { name: "Make it yours" }).click();
  await page.getByRole("button", { name: "After hours", exact: true }).click();
  await page.waitForFunction(
    () => document.documentElement.style.getPropertyValue("--bg") === "#191725",
  );
  await page
    .getByRole("button", { name: "Reset to Paper", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Close settings", exact: true })
    .click();
  await page.keyboard.press("n");
  await page.getByRole("button", { name: "▧ Image", exact: true }).click();
  await page.getByLabel("Title", { exact: true }).fill("A small picture");
  await page.locator("#image-file").setInputFiles({
    name: "pixel.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAIElEQVQ4jWMIrrhHNmIY1XxvNMDujSaSe6MZ497AFQYA3leYL8z0NQIAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.locator("#image-preview").waitFor({ state: "visible" });
  await page.getByLabel("Image description").fill("A one pixel test image");
  await page.getByRole("button", { name: "Keep it", exact: true }).click();
  await page
    .getByRole("heading", { name: "A small picture", exact: true })
    .waitFor();
  await page.locator('.sidebar [data-action="backup"]').click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download backup" }).click();
  const backupDownload = await download;
  assert.match(backupDownload.suggestedFilename(), /^pocket-backup/);
  const freshContext = await browser.newContext();
  const restored = await freshContext.newPage();
  await restored.goto(base + "/index.html");
  await restored.getByText("✓ Saved on this device", { exact: true }).waitFor();
  await restored.locator('.sidebar [data-action="backup"]').click();
  await restored.locator("#import-mode").selectOption("replace");
  restored.once("dialog", (dialog) => dialog.accept());
  await restored.locator("#import").setInputFiles(await backupDownload.path());
  await restored
    .getByText("Restored 7 cards. Your backup file is unchanged.")
    .waitFor();
  await restored.reload();
  await restored
    .getByRole("heading", { name: "A small picture", exact: true })
    .waitFor();
  assert.equal(await restored.locator(".card").count(), 7);
  assert.ok(
    await restored
      .locator(".card-image")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  await freshContext.close();
  await page.locator("#import").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":1}'),
  });
  await page.getByText(/not a valid Pocket v1 backup/).waitFor();
  await page
    .getByRole("button", { name: "Close settings", exact: true })
    .click();
  assert.equal(await page.locator(".card").count(), 7);
  const screenshotDir =
    process.env.POCKET_QA_DIR || path.join(os.tmpdir(), "pocket-qa");
  await mkdir(screenshotDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotDir, "pocket-desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Make it yours" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await page.screenshot({
    path: path.join(screenshotDir, "pocket-mobile.png"),
    fullPage: true,
  });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("heading", { name: "Private test note", exact: true })
    .waitFor();
  await context.setOffline(false);
  // Optimistic revision protection prevents a stale tab overwriting newer data.
  const stale = await context.newPage();
  await stale.goto(base + "/index.html");
  await stale.getByText("✓ Saved on this device", { exact: true }).waitFor();
  await page.keyboard.press("n");
  await page.getByLabel("Title", { exact: true }).fill("Newer data");
  await page.getByRole("button", { name: "Keep it", exact: true }).click();
  await page
    .getByRole("heading", { name: "Newer data", exact: true })
    .waitFor();
  await stale.keyboard.press("n");
  await stale.getByLabel("Title", { exact: true }).fill("Stale write");
  await stale.getByRole("button", { name: "Keep it", exact: true }).click();
  await stale.getByText(/Not saved. Keep this editor open/).waitFor();
  assert.deepEqual(errors, []);
  assert.deepEqual(outbound, []);
  console.log(
    "Pocket passed: schema, safe links, preset contrast, persistence, reorder, pins, search, trash/undo, collections, themes, image processing, backup export, invalid restore, mobile, keyboard, reduced motion, offline reload, cross-tab conflict and no external requests.",
  );
  console.log(`Screenshots: ${screenshotDir}`);
} finally {
  await browser?.close();
  await new Promise((r) => server.close(r));
}
