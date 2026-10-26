import { scryptSync, timingSafeEqual, createHash } from "node:crypto";

export function passwordConfigured(hash: string | undefined): hash is string {
  return !!hash && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash);
}
export function verifyPassword(password: unknown, hash: string) {
  if (
    typeof password !== "string" ||
    password.length > 256 ||
    !passwordConfigured(hash)
  )
    return false;
  const [, salt, expected] = hash.split(":");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
