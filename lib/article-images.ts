/** Public blog media only. Never accept arbitrary remote hosts or active SVG uploads. */
export function isArticleImage(src: string): boolean {
  if (/^\/images\/[a-zA-Z0-9_./-]+\.(svg|png|jpg|jpeg|webp|avif)$/.test(src))
    return !src.includes("..");
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      /^\/blog\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}
export function socialImage(src: string): string {
  return src.startsWith("/images/") ? src.replace(/\.svg$/, ".png") : src;
}
export const UPLOAD_LIMIT = 5 * 1024 * 1024;
export const UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp"];
