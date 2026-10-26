import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { blogDatabase } from "./database";
import { digest, passwordConfigured, verifyPassword } from "../studio/crypto";

const COOKIE = "portfolio-studio";
const HOURS = 8;
type Session = { _id: string; expiresAt: Date; credential: string };
type Attempt = { _id: string; count: number; expiresAt: Date };
let indexes: Promise<unknown> | undefined;
async function collections() {
  const db = await blogDatabase();
  const sessions = db.collection<Session>("studio_sessions");
  const attempts = db.collection<Attempt>("studio_login_attempts");
  indexes ??= Promise.all([
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]).catch((error) => {
    indexes = undefined;
    throw error;
  });
  await indexes;
  return { sessions, attempts };
}
export function studioConfigured() {
  return (
    process.env.BLOG_SOURCE !== "files" &&
    passwordConfigured(process.env.STUDIO_PASSWORD_HASH)
  );
}
export async function hasStudioSession() {
  if (!studioConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const { sessions } = await collections();
  return !!(await sessions.findOne({
    _id: digest(token),
    credential: digest(process.env.STUDIO_PASSWORD_HASH!),
    expiresAt: { $gt: new Date() },
  }));
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
  ]);
  if (process.env.VERCEL_URL) allowed.add("https://" + process.env.VERCEL_URL);
  const url = new URL(request.url);
  if (
    process.env.VERCEL !== "1" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  ) {
    allowed.add(url.origin);
    // Next may normalize 127.0.0.1 to localhost in a local production server.
    for (const host of ["localhost", "127.0.0.1", "[::1]"])
      allowed.add(`${url.protocol}//${host}${url.port ? ":" + url.port : ""}`);
  }
  return allowed.has(origin);
}
export async function loginStudio(password: unknown, request: Request) {
  if (!studioConfigured()) return "Owner login is not configured yet.";
  const { sessions, attempts } = await collections();
  // A global atomic budget cannot be bypassed with spoofed IP headers or new server instances.
  const window = Math.floor(Date.now() / 900000);
  const budget = await attempts.findOneAndUpdate(
    { _id: "login:" + window },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date((window + 2) * 900000) },
    },
    { upsert: true, returnDocument: "after" },
  );
  if (!budget || budget.count > 10)
    return "Too many attempts. Try again in 15 minutes.";
  if (!verifyPassword(password, process.env.STUDIO_PASSWORD_HASH!))
    return "Incorrect password.";
  const jar = await cookies();
  const previous = jar.get(COOKIE)?.value;
  if (previous && /^[a-f0-9]{64}$/.test(previous))
    await sessions.deleteOne({ _id: digest(previous) });
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + HOURS * 3600000);
  await sessions.insertOne({
    _id: digest(token),
    expiresAt,
    credential: digest(process.env.STUDIO_PASSWORD_HASH!),
  });
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/studio",
    expires: expiresAt,
    secure:
      process.env.VERCEL === "1" || new URL(request.url).protocol === "https:",
  });
  return null;
}
export async function logoutStudio() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    const { sessions } = await collections();
    await sessions.deleteOne({ _id: digest(token) });
  }
  jar.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/studio",
    maxAge: 0,
  });
}
