export const fonts = {
  sans: { label: "Clean Sans", css: "Arial, Helvetica, sans-serif" },
  serif: { label: "Editorial Serif", css: "Georgia, 'Times New Roman', serif" },
  mono: { label: "Developer Mono", css: "Consolas, 'Courier New', monospace" },
  humanist: { label: "Humanist", css: "'Trebuchet MS', Arial, sans-serif" },
  classic: {
    label: "Classic Serif",
    css: "'Palatino Linotype', Palatino, Georgia, serif",
  },
  rounded: {
    label: "Rounded Sans",
    css: "'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif",
  },
} as const;
export type FontId = keyof typeof fonts;
export const fontPairings = {
  system: {
    label: "Clean / Sans",
    headingId: "sans",
    bodyId: "sans",
  },
  editorial: {
    label: "Editorial / Serif",
    headingId: "serif",
    bodyId: "serif",
  },
  developer: {
    label: "Developer / Mono",
    headingId: "mono",
    bodyId: "mono",
  },
  studio: {
    label: "Studio / Serif + Sans",
    headingId: "classic",
    bodyId: "sans",
  },
  playful: {
    label: "Playful / Rounded + Humanist",
    headingId: "rounded",
    bodyId: "humanist",
  },
  technical: {
    label: "Technical / Mono + Sans",
    headingId: "mono",
    bodyId: "sans",
  },
} as const;
export type FontPairing = keyof typeof fontPairings;
export type Typography = {
  heading: FontId;
  body: FontId;
  readingScale: number;
  lineHeight: number;
};
export const defaultTypography: Typography = {
  heading: "sans",
  body: "sans",
  readingScale: 1,
  lineHeight: 1.95,
};
export function pairingTypography(key: FontPairing): Typography {
  return {
    ...defaultTypography,
    heading: fontPairings[key].headingId,
    body: fontPairings[key].bodyId,
  };
}
export function parseTypography(value: unknown): Typography {
  if (typeof value === "string" && Object.hasOwn(fontPairings, value))
    return pairingTypography(value as FontPairing);
  if (!value || typeof value !== "object") return { ...defaultTypography };
  const saved = value as Record<string, unknown>;
  return {
    heading:
      typeof saved.heading === "string" && Object.hasOwn(fonts, saved.heading)
        ? (saved.heading as FontId)
        : "sans",
    body:
      typeof saved.body === "string" && Object.hasOwn(fonts, saved.body)
        ? (saved.body as FontId)
        : "sans",
    readingScale:
      typeof saved.readingScale === "number" &&
      Number.isFinite(saved.readingScale)
        ? Math.min(1.25, Math.max(0.9, saved.readingScale))
        : 1,
    lineHeight:
      typeof saved.lineHeight === "number" && Number.isFinite(saved.lineHeight)
        ? Math.min(2.2, Math.max(1.5, saved.lineHeight))
        : 1.95,
  };
}
