import { adsensePublisherId } from "@/lib/adsense";

export const dynamic = "force-dynamic";

export function GET() {
  const publisher = adsensePublisherId();
  return new Response(
    publisher ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n` : "",
    {
      status: publisher ? 200 : 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
