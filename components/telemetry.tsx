"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Vercel endpoints do not exist on a local static preview. */
export function Telemetry({ enabled }: { enabled: boolean }) {
  const path = usePathname();
  const [publicHost, setPublicHost] = useState(false);
  useEffect(
    () =>
      setPublicHost(
        !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname),
      ),
    [],
  );
  return enabled && publicHost && !path.startsWith("/studio") ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
