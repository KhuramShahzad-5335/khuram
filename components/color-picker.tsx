"use client";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import { Pipette } from "lucide-react";
import {
  clamp,
  normalizeHex,
  hexToHsv,
  hsvToHex,
  hsvToRgb,
  hsvToHsl,
  hslToHsv,
  type Hsv,
} from "@/lib/color-picker";
type Dropper = new () => { open: () => Promise<{ sRGBHex: string }> };
export function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (hex: string) => void;
  label: string;
}) {
  const [hsv, setHsv] = useState(() => hexToHsv(value));
  const model = useRef(hsv),
    frame = useRef<number | undefined>(undefined),
    pending = useRef<Hsv | null>(null);
  const callback = useRef(onChange);
  callback.current = onChange;
  const [format, setFormat] = useState("hex"),
    [draft, setDraft] = useState<string | null>(null),
    [error, setError] = useState("");
  const [dropper, setDropper] = useState(false);
  useEffect(() => setDropper("EyeDropper" in window), []);
  useEffect(() => {
    if (value !== hsvToHex(model.current)) {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      frame.current = undefined;
      pending.current = null;
      const next = hexToHsv(value, model.current.h);
      model.current = next;
      setHsv(next);
      setDraft(null);
      setError("");
    }
  }, [value]);
  function flush() {
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = undefined;
    if (!pending.current) return;
    const next = pending.current;
    pending.current = null;
    setHsv(next);
    callback.current(hsvToHex(next));
  }
  useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      if (pending.current) callback.current(hsvToHex(pending.current));
    },
    [],
  );
  function update(patch: Partial<Hsv>) {
    const next = { ...model.current, ...patch };
    model.current = next;
    pending.current = next;
    setDraft(null);
    setError("");
    if (frame.current === undefined)
      frame.current = requestAnimationFrame(flush);
  }
  function pointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    update({
      s: clamp(((event.clientX - rect.left) / rect.width) * 100),
      v: clamp((1 - (event.clientY - rect.top) / rect.height) * 100),
    });
  }
  function key(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 1;
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "Home") update({ s: 0, v: 100 });
    else if (event.key === "End") update({ v: 0 });
    else
      update({
        s: clamp(
          model.current.s +
            (event.key === "ArrowLeft"
              ? -step
              : event.key === "ArrowRight"
                ? step
                : 0),
        ),
        v: clamp(
          model.current.v +
            (event.key === "ArrowDown"
              ? -step
              : event.key === "ArrowUp"
                ? step
                : 0),
        ),
      });
  }
  const channels = format === "rgb" ? hsvToRgb(hsv) : hsvToHsl(hsv);
  const shown =
    draft ??
    (format === "hex" ? hsvToHex(hsv) : channels.map(Math.round).join(", "));
  function commit() {
    if (draft === null) return;
    if (format === "hex") {
      const hex = normalizeHex(draft);
      if (!hex) {
        setError("Use a 3- or 6-digit HEX color.");
        return;
      }
      update(hexToHsv(hex, model.current.h));
    } else {
      const values = draft
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      const limits = format === "rgb" ? [255, 255, 255] : [360, 100, 100];
      if (
        values.length !== 3 ||
        values.some((n, i) => !Number.isFinite(n) || n < 0 || n > limits[i])
      ) {
        setError(
          format === "rgb"
            ? "Enter three RGB values from 0 to 255."
            : "Enter hue 0–360, saturation 0–100, lightness 0–100.",
        );
        return;
      }
      update(
        format === "rgb"
          ? hexToHsv(
              `#${values.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`,
              model.current.h,
            )
          : hslToHsv(values[0], values[1], values[2]),
      );
    }
    flush();
  }
  return (
    <div
      className="my-3 rounded-xl border border-[#444] bg-[#141414] p-3"
      aria-label={`${label} color controls`}
    >
      <div
        className="relative h-36 touch-none overflow-hidden rounded-lg outline-offset-4"
        role="group"
        tabIndex={0}
        aria-label="Saturation and brightness canvas"
        aria-describedby="color-canvas-help"
        onKeyDown={key}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          e.currentTarget.focus();
          pointer(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) pointer(e);
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
          flush();
        }}
        onPointerCancel={flush}
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.h} 100% 50%)`,
        }}
      >
        <span
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_#000]"
          style={{
            left: `clamp(8px, ${hsv.s}%, calc(100% - 8px))`,
            top: `clamp(8px, ${100 - hsv.v}%, calc(100% - 8px))`,
          }}
        />
      </div>
      <span id="color-canvas-help" className="sr-only">
        Left/right adjusts saturation; up/down adjusts brightness. Shift makes
        larger steps. Home selects white; End selects black.
      </span>
      <div className="mt-4 grid gap-3 text-xs">
        {(
          [
            ["h", "Hue", 359],
            ["s", "Saturation", 100],
            ["v", "Brightness", 100],
          ] as const
        ).map(([channel, name, max]) => (
          <label className="grid gap-1" key={channel}>
            <span>
              {name} · {Math.round(hsv[channel])}
              {channel === "h" ? "°" : "%"}
            </span>
            <input
              type="range"
              aria-label={name}
              min="0"
              max={max}
              value={hsv[channel]}
              onChange={(e) => update({ [channel]: +e.target.value })}
              onPointerUp={flush}
              className={channel === "h" ? "hue-rail" : "w-full"}
              style={
                channel === "h"
                  ? ({
                      "--picker-hue": `hsl(${hsv.h} 100% 50%)`,
                    } as CSSProperties)
                  : undefined
              }
            />
          </label>
        ))}
        <div className="flex gap-2">
          <select
            aria-label="Color format"
            value={format}
            onChange={(e) => {
              setFormat(e.target.value);
              setDraft(null);
              setError("");
            }}
            className="editor-field w-20"
          >
            {["hex", "rgb", "hsl"].map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>
          <input
            className="editor-field min-w-0 flex-1 font-mono"
            aria-label={`${format.toUpperCase()} color`}
            spellCheck={false}
            value={shown}
            aria-invalid={Boolean(error)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
            }}
          />
        </div>
        {error && (
          <span role="alert" className="text-[#ffb4b4]">
            {error}
          </span>
        )}
        {dropper && (
          <button
            type="button"
            className="text-button"
            onClick={async () => {
              const Ctor = (window as unknown as { EyeDropper: Dropper })
                .EyeDropper;
              try {
                const picked = await new Ctor().open();
                update(hexToHsv(picked.sRGBHex, model.current.h));
                flush();
              } catch {
                /* Escape cancels screen picking. */
              }
            }}
          >
            <Pipette size={15} />
            Pick a screen color
          </button>
        )}
      </div>
    </div>
  );
}
