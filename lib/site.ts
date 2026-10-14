/** Public identity and deployment settings. Never put secrets in NEXT_PUBLIC_* variables. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
function resolveSiteUrl(value: string | undefined) {
  if (!value) return "https://example.com";
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be the public HTTPS origin, without a path, credentials, query, or fragment.",
    );
  }
  return url.origin;
}
export const siteUrl = resolveSiteUrl(configuredUrl);
export const isIndexable =
  Boolean(configuredUrl) &&
  siteUrl !== "https://example.com" &&
  process.env.VERCEL_ENV !== "preview";
export const site = {
  name: "Khuram Shahzad",
  title: "Khuram Shahzad — Software Developer in Lahore",
  description:
    "Khuram Shahzad is a self-employed software developer in Lahore. Explore React and Next.js projects, development articles, and ways to work together.",
  email: "krshahzad7@gmail.com",
  phone: "+923471713760",
  phoneLabel: "+92 347 1713760",
  whatsapp: "https://wa.me/923471713760",
  github: "https://github.com/KhuramShahzad-5335",
  linkedin: "https://www.linkedin.com/in/khuram-shahzad-0814b1230/",
} as const;
export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).href;
}
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
