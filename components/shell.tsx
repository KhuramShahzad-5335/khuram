"use client";
import dynamic from "next/dynamic";
import {
  defaultColors as defaults,
  type PaletteColors as Colors,
  parsePalette,
  onColor,
} from "@/lib/palettes";
import {
  fonts,
  defaultTypography,
  parseTypography,
  type Typography,
} from "@/lib/typography";
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
  const [typography, setTypography] = useState<Typography>(defaultTypography);
  useEffect(() => {
    try {
      const saved = parsePalette(
        JSON.parse(localStorage.getItem("khuram-palette") || "null"),
      );
      if (saved) setColors(saved);
      const savedFont = localStorage.getItem("khuram-typography");
      if (savedFont) {
        let savedTypography: unknown = savedFont;
        try {
          savedTypography = JSON.parse(savedFont);
        } catch {
          /* Legacy pairing string. */
        }
        setTypography(parseTypography(savedTypography));
      }
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
  }, [colors, ready]);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.style.setProperty(
      "--font-heading",
      fonts[typography.heading].css,
    );
    document.documentElement.style.setProperty(
      "--font-body",
      fonts[typography.body].css,
    );
    document.documentElement.style.setProperty(
      "--reading-scale",
      String(typography.readingScale),
    );
    document.documentElement.style.setProperty(
      "--reading-line-height",
      String(typography.lineHeight),
    );
  }, [typography, ready]);
  useEffect(() => {
    if (!ready) return;
    const save = () => {
      try {
        localStorage.setItem("khuram-typography", JSON.stringify(typography));
        localStorage.setItem("khuram-palette", JSON.stringify(colors));
      } catch {
        /* Customization works without browser storage. */
      }
    };
    const timer = setTimeout(save, 400);
    window.addEventListener("pagehide", save);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [colors, typography, ready]);
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
          typography={typography}
          setTypography={setTypography}
          colors={colors}
          setColors={setColors}
          onClose={() => setPalette(false)}
        />
      )}
    </>
  );
}
