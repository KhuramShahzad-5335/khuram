export type PaletteColors = {
  background: string;
  surface: string;
  text: string;
  accent: string;
  muted: string;
  primary: string;
  secondary: string;
};
export const defaultColors: PaletteColors = {
  background: "#0a0a0a",
  surface: "#151515",
  text: "#f5f5f5",
  accent: "#ededed",
  primary: "#ededed",
  secondary: "#a3a3a3",
  muted: "#a3a3a3",
};
function hsl(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + channel(0) + channel(8) + channel(4);
}
export function contrastRatio(a: string, b: string) {
  const lum = (hex: string) => {
    const c = hex
      .slice(1)
      .match(/.{2}/g)!
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Readability is checked against both the page canvas and raised panels. */
export function paletteContrast(colors: PaletteColors) {
  const backgrounds = [colors.background, colors.surface];
  const minimum = (color: string) =>
    Math.min(
      ...backgrounds.map((background) => contrastRatio(color, background)),
    );
  return {
    text: minimum(colors.text),
    muted: minimum(colors.muted),
    accent: minimum(colors.accent),
  };
}
function readableColor(
  hue: number,
  saturation: number,
  lightness: number,
  backgrounds: string[],
  target: number,
  lightTheme: boolean,
) {
  for (let step = 0; step < 100; step++) {
    const candidate = hsl(hue, saturation, lightness);
    if (
      backgrounds.every(
        (background) => contrastRatio(candidate, background) >= target,
      )
    )
      return candidate;
    lightness = Math.max(0, Math.min(100, lightness + (lightTheme ? -1 : 1)));
  }
  return lightTheme ? "#000000" : "#ffffff";
}
/** Black or white ink keeps filled controls readable, including yellow/orange fills. */
export function onColor(color: string) {
  return contrastRatio("#000000", color) >= contrastRatio("#ffffff", color)
    ? "#000000"
    : "#ffffff";
}
export const presets = [
  { name: "Terminal / Vercel", colors: defaultColors },
  {
    name: "Paper",
    colors: {
      background: "#faf8f3",
      surface: "#f0ede6",
      text: "#202020",
      accent: "#36682c",
      muted: "#66615b",
      primary: "#36682c",
      secondary: "#e8bf69",
    },
  },
] satisfies { name: string; colors: PaletteColors }[];
export const fontPairings = {
  system: {
    label: "Clean / Sans",
    heading: "Arial, Helvetica, sans-serif",
    body: "Arial, Helvetica, sans-serif",
  },
  editorial: {
    label: "Editorial / Serif",
    heading: "Georgia, 'Times New Roman', serif",
    body: "Georgia, 'Times New Roman', serif",
  },
  developer: {
    label: "Developer / Mono",
    heading: "Consolas, 'Courier New', monospace",
    body: "Consolas, 'Courier New', monospace",
  },
} as const;
export type FontPairing = keyof typeof fontPairings;
/** Preserve older five-color preferences while adding the two paint roles. */
export function parsePalette(value: unknown): PaletteColors | null {
  if (!value || typeof value !== "object") return null;
  const saved = value as Record<string, unknown>;
  const valid = (v: unknown): v is string =>
    typeof v === "string" && /^#[a-f0-9]{6}$/i.test(v);
  if (
    !["background", "surface", "text", "accent", "muted"].every((key) =>
      valid(saved[key]),
    )
  )
    return null;
  const normalized = Object.fromEntries(
    Object.keys(defaultColors).map((key) => [
      key,
      valid(saved[key])
        ? saved[key]
        : key === "primary"
          ? saved.accent
          : defaultColors.secondary,
    ]),
  ) as PaletteColors;
  const formerTerminal = {
    ...defaultColors,
    accent: "#b6f66d",
    primary: "#b6f66d",
    secondary: "#9ad9ed",
  };
  return Object.entries(formerTerminal).every(
    ([key, color]) => normalized[key as keyof PaletteColors] === color,
  )
    ? { ...defaultColors }
    : normalized;
}
// Visit every hue family once per wheel before repeating. Randomness varies shade,
// saturation and complementary relationships instead of hiding warm colors.
let hueStep = Math.floor(Math.random() * 12);
export function generatePalettes() {
  const range = (min: number, max: number) => min + Math.random() * (max - min);
  const hue = ((hueStep++ % 12) * 30 + range(0, 9)) % 360;
  return ["Dark", "Light", "Funky", "Extreme"].map((name, index) => {
    const light = index === 1 || index === 2;
    const extreme = index === 3;
    const funky = index === 2;
    const background = funky
      ? hsl((hue + 210) % 360, 85, 92)
      : light
        ? "#ffffff"
        : "#0a0a0a";
    const surface = funky
      ? hsl((hue + 210) % 360, 65, 96)
      : light
        ? "#f3f3f3"
        : extreme
          ? "#111111"
          : "#181818";
    const backgrounds = [background, surface];
    const saturation = range(extreme ? 95 : funky ? 85 : 75, 100);
    const primary = hsl(
      hue,
      saturation,
      range(extreme ? 48 : 50, extreme ? 55 : 60),
    );
    const secondary = hsl(
      (hue + (funky ? 150 : extreme ? 180 : 45)) % 360,
      range(70, 100),
      range(52, 65),
    );
    return {
      name,
      colors: {
        background,
        surface,
        primary,
        secondary,
        text: light ? "#151515" : "#f8f8f8",
        muted: readableColor(
          hue,
          8,
          light ? 34 : extreme ? 77 : 67,
          backgrounds,
          5.5,
          light,
        ),
        accent: readableColor(
          hue,
          saturation,
          light ? 38 : 58,
          backgrounds,
          5.5,
          light,
        ),
      },
    };
  });
}
