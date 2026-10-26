import { spawn } from "node:child_process";
import net from "node:net";
import { setTimeout as delay } from "node:timers/promises";

/** Start a real production Next server so checks exercise ISR routes, not stale out/ files. */
export async function withLocalSite(check) {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { stdio: "ignore", env: process.env },
  );
  let failed = false;
  server.on("error", () => {
    failed = true;
  });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (failed || server.exitCode !== null)
        throw new Error(
          "Production server failed to start. Run npm run build first.",
        );
      try {
        if (
          (
            await fetch(base + "/robots.txt", {
              signal: AbortSignal.timeout(1000),
            })
          ).ok
        ) {
          ready = true;
          break;
        }
      } catch {
        /* server booting */
      }
      await delay(200);
    }
    if (!ready) throw new Error("Production server startup timed out");
    await check(base);
  } finally {
    server.kill();
  }
}
