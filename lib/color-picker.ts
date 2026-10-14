export type Hsv = { h: number; s: number; v: number };
export const clamp = (n: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, n));
export function normalizeHex(raw: string): string | null {
  let text = raw.trim().replace(/^#/, "");
  if (/^[a-f\d]{3}$/i.test(text)) text = [...text].map((c) => c + c).join("");
  return /^[a-f\d]{6}$/i.test(text) ? `#${text.toLowerCase()}` : null;
}
export function hexToHsv(hex: string, previousHue = 0): Hsv {
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  const h =
    d === 0
      ? previousHue
      : ((max === r
          ? (g - b) / d
          : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4) *
          60 +
          360) %
        360;
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}
export function hsvToRgb({ h, s, v }: Hsv) {
  const c = ((v / 100) * s) / 100,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v / 100 - c;
  const channels = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor((((h % 360) + 360) % 360) / 60)];
  return channels.map((n) => Math.round((n + m) * 255));
}
export function hsvToHex(hsv: Hsv) {
  return `#${hsvToRgb(hsv)
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}
export function hsvToHsl({ h, s, v }: Hsv) {
  const l = (v / 100) * (1 - s / 200);
  return [
    h,
    l === 0 || l === 1 ? 0 : ((v / 100 - l) / Math.min(l, 1 - l)) * 100,
    l * 100,
  ];
}
export function hslToHsv(h: number, s: number, l: number): Hsv {
  const light = l / 100,
    v = light + (s / 100) * Math.min(light, 1 - light);
  return { h: h % 360, s: v === 0 ? 0 : 2 * (1 - light / v) * 100, v: v * 100 };
}
