"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "@/styles/tech-loader.css";

const technologies = [
  { name: "React", icon: "react", color: "#61dafb" },
  { name: "Next.js", icon: "nextdotjs", color: "#f5f5f5" },
  { name: "TypeScript", icon: "typescript", color: "#3178c6" },
  { name: "JavaScript", icon: "javascript", color: "#f7df1e" },
  { name: "Node.js", icon: "nodedotjs", color: "#5fa04e" },
  { name: "Tailwind", icon: "tailwindcss", color: "#38bdf8" },
  { name: "PostgreSQL", icon: "postgresql", color: "#78b5dc" },
  { name: "MongoDB", icon: "mongodb", color: "#47a248" },
];
function introBeatMs() {
  const seconds = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--intro-beat"),
  );
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 720;
}

/** A bounded page-load intro, independent of the page's server-rendered content. */
export function TechTunnelLoader() {
  const [phase, setPhase] = useState<
    "active" | "leaving" | "entering" | "done"
  >("active");
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      setPhase("done");
      return;
    }
    // The server-rendered intro is already visible before hydration.
    const started =
      performance.getEntriesByName("first-paint")[0]?.startTime ??
      performance.now();
    const introDuration = introBeatMs() * 4;
    let readyTimer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () =>
      setPhase((current) => (current === "active" ? "leaving" : current));
    const ready = () => {
      if (readyTimer) clearTimeout(readyTimer);
      readyTimer = setTimeout(
        reveal,
        Math.max(0, introDuration - (performance.now() - started)),
      );
    };
    const motionChanged = () => {
      if (motion.matches) setPhase("done");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") reveal();
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    const deadline = setTimeout(reveal, 8000);
    motion.addEventListener("change", motionChanged);
    window.addEventListener("keydown", escape);
    return () => {
      clearTimeout(deadline);
      if (readyTimer) clearTimeout(readyTimer);
      window.removeEventListener("load", ready);
      window.removeEventListener("keydown", escape);
      motion.removeEventListener("change", motionChanged);
    };
  }, []);

  useEffect(() => {
    if (phase === "entering")
      window.dispatchEvent(new Event("portfolio:intro-reveal"));
    if (phase === "done")
      window.dispatchEvent(new Event("portfolio:intro-complete"));
  }, [phase]);

  const showing =
    phase === "active" || phase === "leaving" || phase === "entering";
  useEffect(() => {
    if (!showing) return;
    const content = document.getElementById("portfolio-content");
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const previousInert = content?.inert ?? false;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => {
      if (content) content.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      if (
        previousFocus &&
        previousFocus !== document.body &&
        previousFocus.isConnected
      )
        previousFocus.focus({ preventScroll: true });
      else
        document
          .querySelector<HTMLElement>(".wordmark")
          ?.focus({ preventScroll: true });
    };
  }, [showing]);

  useEffect(() => {
    if (phase !== "leaving" && phase !== "entering") return;
    const content = document.getElementById("portfolio-content");
    const finish = (event: TransitionEvent) => {
      if (event.target === content && event.propertyName === "opacity")
        setPhase("done");
    };
    if (phase === "entering")
      content?.addEventListener("transitionend", finish);
    // Each fade has its own completion event and bounded fallback.
    const timer = setTimeout(
      () => setPhase(phase === "leaving" ? "entering" : "done"),
      introBeatMs() * 2 + 350,
    );
    return () => {
      clearTimeout(timer);
      content?.removeEventListener("transitionend", finish);
    };
  }, [phase]);

  if (!showing) return null;
  return (
    <div
      className={`tech-loader ${phase !== "active" ? "tech-loader-leaving" : ""} ${phase === "entering" ? "tech-loader-entering" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
      onTransitionEnd={(event) => {
        if (
          phase === "leaving" &&
          event.target === event.currentTarget &&
          event.propertyName === "opacity"
        )
          setPhase("entering");
      }}
    >
      <div className="tech-tunnel" aria-hidden="true">
        {Array.from({ length: 5 }, (_, ring) => (
          <div
            className="tech-tunnel-ring"
            key={ring}
            style={
              {
                "--ring-index": ring,
                "--direction": ring % 2 ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            <div className="tech-tunnel-spin">
              {technologies.map((_, index) => {
                const tech =
                  technologies[(index + ring * 3) % technologies.length];
                const angle = (index * Math.PI * 2) / technologies.length;
                return (
                  <span
                    className="tech-tunnel-position"
                    key={index}
                    style={
                      {
                        "--x": `${Math.cos(angle) * 145}px`,
                        "--y": `${Math.sin(angle) * 145}px`,
                      } as CSSProperties
                    }
                  >
                    <span
                      className="tech-tunnel-logo"
                      title={tech.name}
                      style={{
                        backgroundColor: tech.color,
                        maskImage: `url(/images/tech/${tech.icon}.svg)`,
                        WebkitMaskImage: `url(/images/tech/${tech.icon}.svg)`,
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* <div className="tech-loader-center"><span className="tech-loader-kicker">WELCOME TO MY CORNER</span><h2 id="tech-loader-title">khuram<span>.</span></h2><p>A quick trip through the stack.</p></div>
    <div className="tech-loader-bottom"><span>Websites. Web apps. A little curiosity.</span><button ref={skipRef} onClick={() => setPhase('leaving')}>Skip intro <span aria-hidden="true">↗</span></button></div> */}
    </div>
  );
}
