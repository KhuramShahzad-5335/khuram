import assert from "node:assert/strict";
import { randomBytes, scryptSync } from "node:crypto";
import {
  passwordConfigured,
  verifyPassword,
  digest,
} from "../lib/studio/crypto.ts";
import { parsePostRecord } from "../lib/post-record.ts";
import { posts } from "../lib/posts.ts";
const salt = randomBytes(16).toString("hex");
const password = randomBytes(24).toString("hex");
const hash =
  "scrypt:" + salt + ":" + scryptSync(password, salt, 64).toString("hex");
assert(passwordConfigured(hash));
assert(!passwordConfigured(undefined));
assert(!passwordConfigured("plaintext"));
assert(verifyPassword(password, hash));
assert(!verifyPassword("incorrect-password", hash));
assert(!verifyPassword({}, hash));
assert(!verifyPassword("x".repeat(257), hash));
assert(!verifyPassword(password, "invalid"));
assert.equal(digest(password).length, 64);
const draft = {
  ...posts[0],
  status: "draft",
  excerpt: "",
  category: "",
  image: "",
  imageAlt: "",
  intro: "",
  sections: [],
};
assert.equal(parsePostRecord(draft).status, "draft");
assert.throws(() => parsePostRecord({ ...draft, status: "published" }));
assert.throws(() => parsePostRecord({ ...draft, title: "" }));
console.log(
  "Studio checks passed: hash verification, malformed credentials, incomplete draft support and strict publication.",
);
