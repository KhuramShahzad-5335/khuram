import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";
import { siteUrl } from "@/lib/content";

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khuram Shahzad — Software Developer",
    template: "%s | Khuram Shahzad",
  },
  description:
    "Self-employed software developer in Lahore building thoughtful web experiences with React, Next.js, and the MERN stack.",
  openGraph: {
    title: "Khuram Shahzad — Software Developer",
    description:
      "Thoughtful interfaces. Practical software. A little personality.",
    type: "website",
    images: ["/opengraph.png"],
  },
  icons: { icon: "/icon.svg" },
  twitter: { card: "summary_large_image" },
  robots: process.env.NEXT_PUBLIC_SITE_URL
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
        <Analytics />
        <SpeedInsights />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
