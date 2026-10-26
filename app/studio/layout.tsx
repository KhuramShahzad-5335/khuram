import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Private writing studio",
  robots: { index: false, follow: false, noarchive: true },
};
export const dynamic = "force-dynamic";
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
