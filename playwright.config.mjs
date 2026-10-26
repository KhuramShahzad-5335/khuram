import { defineConfig } from "@playwright/test";
import { tmpdir } from "node:os";
import path from "node:path";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir:
    process.env.PLAYWRIGHT_OUTPUT_DIR ||
    path.join(tmpdir(), "portfolio-browser-results"),
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  timeout: 30000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    browserName: "chromium",
    launchOptions: process.env.CHROME_BINARY
      ? { executablePath: process.env.CHROME_BINARY }
      : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
