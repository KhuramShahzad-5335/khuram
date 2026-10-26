import { spawn } from "node:child_process";
import { withLocalSite } from "./local-site.mjs";

await withLocalSite(async (base) => {
  await new Promise((resolve, reject) => {
    const runner = spawn(
      process.execPath,
      ["node_modules/@playwright/test/cli.js", "test"],
      {
        stdio: "inherit",
        env: { ...process.env, PLAYWRIGHT_BASE_URL: base },
      },
    );
    runner.once("error", reject);
    runner.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Browser checks failed (${code})`)),
    );
  });
});
