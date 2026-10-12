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
  icons: { icon: "/icon.svg" },
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
      <head>
        <noscript>
          <style>{`.tech-loader{display:none!important}#portfolio-content{opacity:1!important}`}</style>
        </noscript>
      </head>
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
