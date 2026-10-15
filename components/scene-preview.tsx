"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function SceneFallback() {
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-grid" />
      <div className="orbit-stage">
        <div className="orbit-fallback">◇</div>
      </div>
    </div>
  );
}

const Orbit = dynamic(() => import("./orbit"), {
  ssr: false,
  loading: SceneFallback,
});

/** Defer the WebGL bundle until a scene is near the viewport; pause hidden tabs. */
export function ScenePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!query.matches && !document.hidden);
    update();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!visible || !allowed || ready) return;
    // Give initial HTML and controls a chance to paint before WebGL initialization.
    if ("requestIdleCallback" in window) {
      const task = window.requestIdleCallback(() => setReady(true), {
        timeout: 1200,
      });
      return () => window.cancelIdleCallback(task);
    }
    const task = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(task);
  }, [visible, allowed, ready]);
  return (
    <div ref={ref}>
      {visible && allowed && ready ? <Orbit /> : <SceneFallback />}
    </div>
  );
}
