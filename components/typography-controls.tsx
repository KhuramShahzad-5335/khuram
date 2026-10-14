"use client";
import {
  fonts,
  fontPairings,
  pairingTypography,
  defaultTypography,
  type Typography,
  type FontId,
  type FontPairing,
} from "@/lib/typography";
export function TypographyControls({
  value,
  onChange,
}: {
  value: Typography;
  onChange: (value: Typography) => void;
}) {
  const selected =
    Object.entries(fontPairings).find(
      ([, p]) => p.headingId === value.heading && p.bodyId === value.body,
    )?.[0] ?? "custom";
  return (
    <details className="my-5 rounded-lg border border-[#444] p-3">
      <summary className="cursor-pointer text-sm">Typography & reading</summary>
      <div className="mt-4 grid gap-4 text-xs">
        <label className="grid gap-2">
          Font pairing
          <select
            aria-label="Typography pairing"
            value={selected}
            onChange={(e) =>
              onChange(pairingTypography(e.target.value as FontPairing))
            }
            className="editor-field"
          >
            <option value="custom" disabled>
              Custom pairing
            </option>
            {Object.entries(fontPairings).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        {(["heading", "body"] as const).map((role) => (
          <label key={role} className="grid gap-2 capitalize">
            {role} font
            <select
              aria-label={`${role} font`}
              value={value[role]}
              onChange={(e) =>
                onChange({ ...value, [role]: e.target.value as FontId })
              }
              className="editor-field"
            >
              {Object.entries(fonts).map(([key, f]) => (
                <option key={key} value={key}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="grid gap-2">
          Article text size · {Math.round(value.readingScale * 100)}%
          <input
            aria-label="Article text size"
            type="range"
            min=".9"
            max="1.25"
            step=".05"
            value={value.readingScale}
            onChange={(e) =>
              onChange({ ...value, readingScale: +e.target.value })
            }
          />
        </label>
        <label className="grid gap-2">
          Article line spacing · {value.lineHeight.toFixed(2)}
          <input
            aria-label="Article line spacing"
            type="range"
            min="1.5"
            max="2.2"
            step=".05"
            value={value.lineHeight}
            onChange={(e) =>
              onChange({ ...value, lineHeight: +e.target.value })
            }
          />
        </label>
        <div className="rounded-lg bg-[#141414] p-3" aria-label="Font preview">
          <strong
            className="block text-xl"
            style={{ fontFamily: fonts[value.heading].css }}
          >
            Curiosity, in type.
          </strong>
          <p
            style={{
              fontFamily: fonts[value.body].css,
              fontSize: 14 * value.readingScale,
              lineHeight: value.lineHeight,
            }}
          >
            Small discoveries. Readable stories. Your own rhythm.
          </p>
        </div>
        <small className="text-[#aaa]">
          Local font stacks; appearance varies by device. Reading controls apply
          to article prose.
        </small>
        <button
          type="button"
          className="text-button"
          onClick={() => onChange({ ...defaultTypography })}
        >
          Reset typography
        </button>
      </div>
    </details>
  );
}
