import assert from "node:assert/strict";
import {
  generatePalettes,
  paletteContrast,
  contrastRatio,
  onColor,
  parsePalette,
  defaultColors,
} from "../lib/palettes.ts";

let previous = [];
for (let batch = 0; batch < 1000; batch++) {
  const palettes = generatePalettes();
  assert.equal(palettes.length, 4);
  assert.equal(palettes[0].colors.background, "#0a0a0a");
  assert.equal(palettes[1].colors.background, "#ffffff");
  for (const { colors } of palettes) {
    for (const color of Object.values(colors))
      assert.match(color, /^#[0-9a-f]{6}$/);
    const contrast = paletteContrast(colors);
    assert(contrast.text >= 7);
    assert(contrast.muted >= 4.5);
    assert(contrast.accent >= 4.5);
    assert(contrastRatio(onColor(colors.primary), colors.primary) >= 4.5);
    assert(contrastRatio(onColor(colors.secondary), colors.secondary) >= 4.5);
  }
  assert.notDeepEqual(
    palettes.map((p) => p.colors),
    previous,
  );
  previous = palettes.map((p) => p.colors);
}
const random = Math.random;
try {
  for (const value of [0, 0.999999]) {
    Math.random = () => value;
    for (const { colors } of generatePalettes()) {
      const contrast = paletteContrast(colors);
      assert(
        contrast.text >= 7 && contrast.muted >= 4.5 && contrast.accent >= 4.5,
      );
    }
  }
} finally {
  Math.random = random;
}
console.log("Checked 4,000 generated palettes and bounded random edge cases.");

// A complete wheel must include warm hues, not just random cool-color clusters.
const hueFamily = (hex) => {
  const [r, g, b] = [1, 3, 5].map(
    (offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min;
  const hue =
    ((max === r
      ? (g - b) / delta
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4) *
      60 +
      360) %
    360;
  return Math.floor(((hue + 15) % 360) / 30);
};
const families = new Set(
  Array.from({ length: 12 }, () =>
    hueFamily(generatePalettes()[0].colors.primary),
  ),
);
assert.equal(
  families.size,
  12,
  "The wheel must visit all twelve hue families, including red, orange and yellow",
);
const { primary, secondary, ...legacy } = defaultColors;
assert.equal(parsePalette(legacy).primary, legacy.accent);
assert.equal(parsePalette({ ...legacy, text: "invalid" }), null);
assert.equal(
  parsePalette({ ...legacy, primary: "invalid" }).primary,
  legacy.accent,
);
console.log(
  "Neutral backgrounds, filled-control contrast, full warm/cool hue coverage and legacy preferences passed.",
);

assert.deepEqual(
  parsePalette({
    ...defaultColors,
    accent: "#b6f66d",
    primary: "#b6f66d",
    secondary: "#9ad9ed",
  }),
  defaultColors,
);
assert.equal(
  parsePalette({ ...defaultColors, primary: "#ff5722" }).primary,
  "#ff5722",
);
for (const hex of Object.values(defaultColors))
  (assert.equal(hex.slice(1, 3), hex.slice(3, 5)),
    assert.equal(hex.slice(3, 5), hex.slice(5, 7)));
console.log("Monochrome default and exact former-preset migration passed.");
