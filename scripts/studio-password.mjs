import { randomBytes, scryptSync } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import readline from "node:readline";

async function secret(prompt) {
  if (!process.stdin.isTTY)
    throw new Error("Run this command in an interactive terminal.");
  process.stdout.write(prompt);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    function finish(error) {
      process.stdin.removeListener("keypress", key);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    }
    function key(text, key = {}) {
      if (key.ctrl && key.name === "c") return finish(new Error("Cancelled."));
      if (key.name === "return") return finish();
      if (key.name === "backspace") {
        value = value.slice(0, -1);
        return;
      }
      if (text && !key.ctrl && !key.meta && value.length < 256) value += text;
    }
    process.stdin.on("keypress", key);
  });
}
try {
  const password = await secret("Owner password (16+ characters, hidden): ");
  if (password.length < 16)
    throw new Error(
      "Use at least 16 characters, ideally a unique password-manager password.",
    );
  if (password !== (await secret("Confirm password (hidden): ")))
    throw new Error("Passwords did not match.");
  const salt = randomBytes(16).toString("hex");
  const hash =
    "scrypt:" + salt + ":" + scryptSync(password, salt, 64).toString("hex");
  let env = "";
  try {
    env = await readFile(".env.local", "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  env = env.replace(/^STUDIO_PASSWORD_HASH=.*(?:\r?\n|$)/gm, "").trimEnd();
  await writeFile(".env.local", env + "\nSTUDIO_PASSWORD_HASH=" + hash + "\n", {
    mode: 0o600,
  });
  console.log(
    "Owner password hash saved in ignored .env.local. No plaintext password was saved.",
  );
  console.log(
    "Restart the local server. Copy STUDIO_PASSWORD_HASH privately to Vercel Production settings, then redeploy.",
  );
  console.log("Changing this hash invalidates existing owner sessions.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
