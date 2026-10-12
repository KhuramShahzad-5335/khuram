"use client";
import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import { onColor, generatePalettes, type PaletteColors } from "@/lib/palettes";
export function PaletteGallery({
  onApply,
  colors,
}: {
  onApply: (colors: PaletteColors) => void;
  colors: PaletteColors;
}) {
  const [palettes, setPalettes] = useState<ReturnType<typeof generatePalettes>>(
    [],
  );
  const [selectedMood, setSelectedMood] = useState(() =>
    colors.surface === "#111111"
      ? 3
      : ["#ffffff", "#faf8f3"].includes(colors.background)
        ? 1
        : colors.background === "#0a0a0a"
          ? 0
          : 2,
  );
  useEffect(() => setPalettes(generatePalettes()), []);
  return (
    <div className="my-5 border-y border-[#353535] py-[18px]">
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-[#bbb]">
        <span>Freshly mixed palettes</span>
        <button
          onClick={() => {
            const fresh = generatePalettes();
            setPalettes(fresh);
            onApply(fresh[selectedMood].colors);
          }}
          className="flex items-center gap-[5px] rounded-[5px] border border-[#444] bg-[#252525] px-[9px] py-[7px] font-mono text-[10px] text-[#eee]"
          aria-label="Generate new palettes"
        >
          <Shuffle size={13} /> Shuffle
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {palettes.map((p, i) => {
          const applied = Object.entries(p.colors).every(
            ([key, value]) => colors[key as keyof PaletteColors] === value,
          );
          return (
            <button
              className="rounded-[7px] border border-[#444] p-2.5 text-left aria-pressed:outline-2 aria-pressed:outline-offset-1 aria-pressed:outline-[#eee]"
              key={i}
              onClick={() => {
                setSelectedMood(i);
                onApply(p.colors);
              }}
              aria-label={"Apply generated palette " + (i + 1)}
              aria-pressed={applied}
              style={{ background: p.colors.background, color: p.colors.text }}
            >
              <span className="mb-2 flex h-[23px] overflow-hidden rounded border border-[#ffffff30]">
                {Object.values(p.colors).map((color, j) => (
                  <i className="flex-1" key={j} style={{ background: color }} />
                ))}
              </span>
              <span className="flex justify-between font-mono text-[10px]">
                {p.name}
                <small className="font-mono text-[8px] opacity-70">
                  {applied ? "Applied" : "Try it →"}
                </small>
              </span>
              <span className="mt-2 flex gap-1 font-mono text-[9px]">
                <span
                  className="rounded px-2 py-1"
                  style={{
                    background: p.colors.primary,
                    color: onColor(p.colors.primary),
                  }}
                >
                  Build ↗
                </span>
                <span
                  className="rounded px-2 py-1"
                  style={{
                    background: p.colors.secondary,
                    color: onColor(p.colors.secondary),
                  }}
                >
                  Explore
                </span>
              </span>
              <span
                className="mt-2 block rounded px-2 py-1.5 font-mono text-[10px]"
                style={{ background: p.colors.surface, color: p.colors.text }}
              >
                <span style={{ color: p.colors.accent }}>Aa /</span> Readable by
                design <span style={{ color: p.colors.muted }}>✓</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
