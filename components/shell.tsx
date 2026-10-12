"use client";
import dynamic from "next/dynamic";
import {
  defaultColors as defaults,
  type PaletteColors as Colors,
  parsePalette,
  onColor,
  fontPairings,
  type FontPairing,
} from "@/lib/palettes";
import { TechTunnelLoader } from "./tech-tunnel-loader";
import { useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
const PaletteEditor = dynamic(() => import("./palette-editor"));

export function Shell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [colors, setColors] = useState<Colors>(defaults),
    [ready, setReady] = useState(false),
    [palette, setPalette] = useState(false);
  const [font, setFont] = useState<FontPairing>("system");
  useEffect(() => {
    try {
      const saved = parsePalette(
        JSON.parse(localStorage.getItem("khuram-palette") || "null"),
      );
      if (saved) setColors(saved);
      const savedFont = localStorage.getItem("khuram-typography");
      if (savedFont && Object.hasOwn(fontPairings, savedFont))
        setFont(savedFont as FontPairing);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    Object.entries(colors).forEach(([k, v]) =>
      document.documentElement.style.setProperty("--" + k, v),
    );
    document.documentElement.style.setProperty(
      "--on-primary",
      onColor(colors.primary),
    );
    document.documentElement.style.setProperty(
      "--on-secondary",
      onColor(colors.secondary),
    );
    document.documentElement.style.setProperty(
      "--font-heading",
      fontPairings[font].heading,
    );
    document.documentElement.style.setProperty(
      "--font-body",
      fontPairings[font].body,
    );
    try {
      localStorage.setItem("khuram-typography", font);
      localStorage.setItem("khuram-palette", JSON.stringify(colors));
    } catch {
      /* Themes work without browser storage. */
    }
  }, [colors, ready, font]);
  return (
    <>
      <TechTunnelLoader />
      <div id="portfolio-content">
        <SiteHeader onEditColors={() => setPalette(true)} />
        {children}
        {footer}
      </div>
      {palette && (
        <PaletteEditor
          font={font}
          setFont={setFont}
          colors={colors}
          setColors={setColors}
          onClose={() => setPalette(false)}
        />
      )}
    </>
  );
}
