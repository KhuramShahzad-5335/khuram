import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";
import { SiteFooter } from "@/components/site-footer";
import { site, siteUrl, isIndexable } from "@/lib/site";

import { Telemetry } from "@/components/telemetry";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: "%s | Khuram Shahzad",
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description:
      "Thoughtful interfaces. Practical software. A little personality.",
    type: "website",
    siteName: site.name,
    url: siteUrl,
    images: ["/opengraph.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Telemetry enabled={process.env.VERCEL_ENV === "production"} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Shell footer={<SiteFooter />}>{children}</Shell>
      </body>
    </html>
  );
}
