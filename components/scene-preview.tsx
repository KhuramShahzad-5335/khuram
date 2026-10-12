"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Orbit = dynamic(() => import("./orbit"), { ssr: false });

/** Defer the WebGL bundle until a scene is near the viewport; pause hidden tabs. */
export function ScenePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setAllowed(
        !query.matches &&
          !document.hidden &&
          !document.querySelector(".tech-loader") &&
          !document.getElementById("portfolio-content")?.inert,
      );
    // Let the intro commit before deciding whether to download the WebGL code.
    const frame = requestAnimationFrame(update);
    window.addEventListener("portfolio:intro-complete", update);
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("portfolio:intro-complete", update);
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div ref={ref}>
      {visible && allowed ? (
        <Orbit />
      ) : (
        <div className="orbit" aria-hidden="true">
          <div className="orbit-fallback">◇</div>
        </div>
      )}
    </div>
  );
}
