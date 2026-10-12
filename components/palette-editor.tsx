"use client";
import { useEffect, useRef } from "react";
import { X, RotateCcw } from "lucide-react";
import { PaletteGallery } from "./palette-gallery";
import {
  defaultColors as defaults,
  paletteContrast,
  presets,
  fontPairings,
  type FontPairing,
  type PaletteColors as Colors,
} from "@/lib/palettes";
export default function PaletteEditor({
  colors,
  setColors,
  font,
  setFont,
  onClose,
}: {
  colors: Colors;
  font: FontPairing;
  setFont: (font: FontPairing) => void;
  setColors: (colors: Colors) => void;
  onClose: () => void;
}) {
  const ratios = paletteContrast(colors);
  const lowContrast = Object.entries(ratios)
    .filter(([, ratio]) => ratio < 4.5)
    .map(([role]) => role);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const content = document.getElementById("portfolio-content");
    const wasInert = content?.inert ?? false;
    if (content) content.inert = true;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLElement>(".palette-panel button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".palette-panel button,.palette-panel input,.palette-panel select",
        ),
      );
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (content) content.inert = wasInert;
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <div className="palette-backdrop" onClick={() => onClose()}>
      <section
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-heading">
          <span className="eyebrow">MAKE YOURSELF AT HOME</span>
          <button
            className="icon-button"
            onClick={() => onClose()}
            aria-label="Close palette"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="palette-title">Your colors. Your call.</h2>
        <p>
          Yes, the entire site changes. No, I’m not emotionally attached to the
          default palette.
        </p>
        <div className="presets">
          {presets.map((p) => (
            <button key={p.name} onClick={() => setColors(p.colors)}>
              {p.name}
            </button>
          ))}
        </div>
        <label className="color-row">
          <span>Typography</span>
          <select
            aria-label="Typography pairing"
            value={font}
            onChange={(event) => setFont(event.target.value as FontPairing)}
          >
            {Object.entries(fontPairings).map(([key, pairing]) => (
              <option key={key} value={key}>
                {pairing.label}
              </option>
            ))}
          </select>
        </label>
        <PaletteGallery colors={colors} onApply={setColors} />
        {Object.entries(colors).map(([key, value]) => (
          <label className="color-row" key={key}>
            <span>{key}</span>
            <input
              type="color"
              aria-label={key + " color"}
              value={value}
              onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
            />
            <code>{value}</code>
          </label>
        ))}
        <p className="contrast-feedback">
          {lowContrast.length === 0
            ? "✓ Text, secondary text, and accents are readable on both backgrounds."
            : `Low contrast for ${lowContrast.join(", ")}. Adjust those colors or choose a generated palette.`}
        </p>
        <button className="text-button" onClick={() => setColors(defaults)}>
          <RotateCcw size={15} /> Reset palette
        </button>
        <small>
          Saved in this browser. Your little corner of the internet.
        </small>
      </section>
    </div>
  );
}
