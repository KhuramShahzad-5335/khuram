"use client";
import { useEffect, useRef, useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { ColorPicker } from "./color-picker";
import { TypographyControls } from "./typography-controls";
import type { Typography } from "@/lib/typography";
import { PaletteGallery } from "./palette-gallery";
import {
  defaultColors as defaults,
  paletteContrast,
  presets,
  type PaletteColors as Colors,
} from "@/lib/palettes";
export default function PaletteEditor({
  colors,
  setColors,
  typography,
  setTypography,
  onClose,
}: {
  colors: Colors;
  typography: Typography;
  setTypography: (value: Typography) => void;
  setColors: (colors: Colors) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState<keyof Colors | null>(null);
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
          '.palette-panel button,.palette-panel input,.palette-panel select,.palette-panel summary,.palette-panel [tabindex="0"]',
        ),
      );
      const visible = nodes.filter(
        (node) =>
          node.getClientRects().length > 0 && !node.hasAttribute("disabled"),
      );
      const first = visible[0],
        last = visible[visible.length - 1];
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
        <TypographyControls value={typography} onChange={setTypography} />
        <PaletteGallery colors={colors} onApply={setColors} />
        <div className="my-5 border-b border-[#444] pb-4">
          <h3 className="mb-3 text-sm">Fine-tune a color</h3>
          {Object.entries(colors).map(([key, value]) => {
            const role = key as keyof Colors;
            return (
              <div key={key}>
                <button
                  type="button"
                  className="my-1 flex w-full items-center gap-3 rounded-lg border border-[#444] px-3 py-2 text-left text-xs"
                  aria-label={`Edit ${key} color`}
                  aria-expanded={editing === key}
                  aria-controls={
                    editing === key ? "active-color-picker" : undefined
                  }
                  onClick={() => setEditing(editing === key ? null : role)}
                >
                  <span
                    className="size-6 shrink-0 rounded border border-[#777]"
                    style={{ background: value }}
                    aria-hidden="true"
                  />
                  <span className="mr-auto capitalize">{key}</span>
                  <code>{value}</code>
                </button>
                {editing === key && (
                  <div id="active-color-picker">
                    <ColorPicker
                      key={key}
                      value={value}
                      label={key}
                      onChange={(hex) => setColors({ ...colors, [key]: hex })}
                    />
                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        setColors({ ...colors, [key]: defaults[role] })
                      }
                    >
                      Reset {key} color
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
