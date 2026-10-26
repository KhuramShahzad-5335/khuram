import type { NextConfig } from "next";
import blogMediaRedirects from "./lib/blog-media-redirects.json";
const config: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  redirects: async () => blogMediaRedirects,
  async headers() {
    return [
      {
        source: "/studio/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};
export default config;
