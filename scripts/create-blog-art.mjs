import fs from "node:fs";
import path from "node:path";
const dir = path.resolve("public/images");
fs.mkdirSync(dir, { recursive: true });
const base = (label, color, shapes) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720"><defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity=".045"/></pattern><radialGradient id="glow"><stop stop-color="${color}" stop-opacity=".13"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="720" fill="#101315"/><rect width="1200" height="720" fill="url(#grid)"/><ellipse cx="600" cy="340" rx="560" ry="380" fill="url(#glow)"/><text x="65" y="72" fill="${color}" font-family="monospace" font-size="14" letter-spacing="3">${label}</text>${shapes}<text x="65" y="663" fill="#818b93" font-family="monospace" font-size="12" letter-spacing="2">KHURAM / THE NOTEBOOK</text><path d="M1090 650h45m-15-15 15 15-15 15" stroke="${color}" fill="none"/></svg>`;
fs.writeFileSync(
  path.join(dir, "blog-motion.svg"),
  base(
    "01 / MOTION WITH A PURPOSE",
    "#b7ef9c",
    `<path d="M170 440 C320 440 315 230 500 230 S680 480 850 480 S985 300 1050 300" stroke="#b7ef9c" stroke-width="3" fill="none"/><path d="M170 440h180M500 230v210M850 480V230" stroke="#ffffff" stroke-opacity=".12" stroke-dasharray="6 10"/>${[
      [170, 440],
      [500, 230],
      [850, 480],
    ]
      .map(
        ([x, y], i) =>
          `<rect x="${x - 70}" y="${y - 50}" width="140" height="100" rx="15" fill="#18231b" stroke="#b7ef9c" stroke-opacity=".4"/><circle cx="${x}" cy="${y}" r="17" fill="#b7ef9c"/><text x="${x - 29}" y="${y + 90}" fill="#879a89" font-family="monospace" font-size="13">STATE 0${i + 1}</text>`,
      )
      .join("")}<circle cx="690" cy="385" r="7" fill="#b7ef9c"/>`,
  ),
);
fs.writeFileSync(
  path.join(dir, "blog-static.svg"),
  base(
    "02 / A SMALL PUBLISHING LOOP",
    "#93c5fd",
    `<path d="M360 340h140m180 0h140" stroke="#93c5fd" stroke-width="2" stroke-dasharray="8 8"/><g transform="translate(140 180) rotate(-7 100 140)"><rect width="220" height="295" rx="12" fill="#182333" stroke="#93c5fd" stroke-opacity=".5"/><text x="28" y="60" fill="#93c5fd" font-family="monospace" font-size="25"># an idea</text>${[95, 125, 155, 200, 230].map((y) => `<rect x="28" y="${y}" width="${y === 155 ? 100 : 160}" height="5" rx="2" fill="#93c5fd" opacity=".25"/>`).join("")}</g><path d="M500 270 590 220 680 270v120l-90 50-90-50Z M500 270l90 50 90-50 M590 320v120" fill="#182333" stroke="#93c5fd" stroke-width="2"/><text x="547" y="480" fill="#8196b3" font-family="monospace" font-size="16">BUILD</text><rect x="815" y="215" width="270" height="220" rx="15" fill="#182333" stroke="#93c5fd" stroke-opacity=".5"/><path d="M815 250h270" stroke="#93c5fd" stroke-opacity=".4"/><rect x="840" y="275" width="220" height="65" rx="6" fill="#93c5fd" opacity=".16"/>${[370, 390, 410].map((y) => `<path d="M840 ${y}h180" stroke="#93c5fd" stroke-opacity=".3" stroke-width="4"/>`).join("")}`,
  ),
);
const colors = ["#0b1020", "#18233d", "#f1f5ff", "#93c5fd", "#a3b2cc"];
fs.writeFileSync(
  path.join(dir, "blog-colors.svg"),
  base(
    "03 / COLOR WITH A SYSTEM",
    "#c4b5fd",
    `${colors.map((c, i) => `<g transform="translate(${195 + i * 150} ${205 + Math.abs(2 - i) * 32}) rotate(${(i - 2) * 6} 60 110)"><rect width="130" height="220" rx="14" fill="${c}" stroke="#ffffff" stroke-opacity=".25"/><text x="18" y="193" font-family="monospace" font-size="12" fill="${i === 2 || i === 3 || i === 4 ? "#18233d" : "#a3b2cc"}">${c}</text></g>`).join("")}<path d="M270 525h660" stroke="#c4b5fd" stroke-opacity=".4"/><text x="340" y="570" fill="#9c91b4" font-family="monospace" font-size="18" letter-spacing="3">SAME INTERFACE. YOUR COLORS.</text>`,
  ),
);
function diagram(name, labels, color) {
  const width = 1000,
    height = 460;
  const step = 800 / labels.length;
  const shapes = labels
    .map((label, i) => {
      const x = 100 + i * step;
      return `<rect x="${x}" y="145" width="${step - 30}" height="140" rx="12" fill="#1c242b" stroke="${color}" stroke-opacity=".4"/><text x="${x + 20}" y="185" fill="${color}" font-family="monospace" font-size="12">0${i + 1}</text><text x="${x + 20}" y="238" fill="#e4e9ef" font-family="Arial" font-size="21">${label}</text>${i < labels.length - 1 ? `<path d="M${x + step - 20} 215h15" stroke="${color}"/>` : ""}`;
    })
    .join("");
  fs.writeFileSync(
    path.join(dir, name),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="1000" height="460" rx="18" fill="#111820"/>${shapes}<text x="100" y="360" font-family="monospace" font-size="12" fill="#80909e">A LITTLE STRUCTURE GOES A LONG WAY.</text></svg>`,
  );
}
diagram("motion-flow.svg", ["Action", "Feedback", "Continue"], "#b7ef9c");
diagram("static-flow.svg", ["Write", "Preview", "Build", "Read"], "#93c5fd");
diagram(
  "color-flow.svg",
  ["Color roles", "Components", "Coherent theme"],
  "#c4b5fd",
);

// Personal SEO: conceptual artwork, never a claimed Google ranking screenshot.
fs.writeFileSync(
  path.join(dir, "blog-personal-seo.svg"),
  base(
    "04 / PERSONAL SEO · A LIVING CASE STUDY",
    "#93c5fd",
    `<path d="M340 300h125M735 300h125M600 360v95" stroke="#93c5fd" stroke-width="2" stroke-dasharray="7 9"/>
  <rect x="100" y="195" width="240" height="215" rx="18" fill="#192331" stroke="#93c5fd" stroke-opacity=".5"/>
  <circle cx="156" cy="255" r="25" fill="#93c5fd"/><text x="144" y="262" font-family="monospace" font-size="18" fill="#101315">KS</text>
  <text x="128" y="326" fill="#eef4fb" font-family="Arial" font-size="22">Your name.</text><text x="128" y="363" fill="#9caec4" font-family="Arial" font-size="18">Your work. Your story.</text>
  <rect x="465" y="175" width="270" height="205" rx="18" fill="#182333" stroke="#93c5fd" stroke-opacity=".5"/>
  <path d="M465 216h270" stroke="#93c5fd" stroke-opacity=".3"/><circle cx="490" cy="195" r="5" fill="#b7ef9c"/><circle cx="510" cy="195" r="5" fill="#c4b5fd"/>
  <rect x="490" y="240" width="86" height="102" rx="8" fill="#93c5fd" fill-opacity=".2"/><path d="M596 250h110m-110 30h85m-85 30h100" stroke="#a8c5e8" stroke-width="6"/>
  <text x="535" y="416" fill="#93c5fd" font-family="monospace" font-size="15">PORTFOLIO</text>
  <rect x="860" y="195" width="240" height="215" rx="18" fill="#192331" stroke="#c4b5fd" stroke-opacity=".5"/>
  <circle cx="900" cy="241" r="11" stroke="#c4b5fd" stroke-width="3" fill="none"/><path d="m909 250 10 10" stroke="#c4b5fd" stroke-width="3"/>
  <text x="940" y="250" fill="#eef4fb" font-family="monospace" font-size="16">name + role</text>
  <path d="M886 290h187m-187 26h160m-160 26h180" stroke="#93c5fd" stroke-width="5" stroke-opacity=".65"/>
  <text x="886" y="382" fill="#9caec4" font-family="Arial" font-size="17">Discovery ≠ a guarantee</text>
  <rect x="390" y="465" width="420" height="95" rx="14" fill="#172520" stroke="#b7ef9c" stroke-opacity=".4"/>
  <text x="435" y="505" fill="#b7ef9c" font-family="monospace" font-size="16">PROFILES + PROJECT EVIDENCE</text>
  <text x="435" y="535" fill="#96a99e" font-family="Arial" font-size="16">Build → connect → measure → improve</text>`,
  ),
);
function seoDiagram(name, heading, labels, note) {
  const boxes = labels
    .map(
      (label, i) =>
        `<rect x="${60 + i * 230}" y="150" width="200" height="145" rx="14" fill="#192331" stroke="#93c5fd" stroke-opacity=".45"/><text x="${80 + i * 230}" y="193" fill="#93c5fd" font-family="monospace" font-size="14">0${i + 1}</text><text x="${80 + i * 230}" y="246" fill="#eef4fb" font-family="Arial" font-size="23">${label}</text>${i < labels.length - 1 ? `<path d="M${270 + i * 230} 224h15l-5-5m5 5-5 5" fill="none" stroke="#b7ef9c" stroke-width="2"/>` : ""}`,
    )
    .join("");
  fs.writeFileSync(
    path.join(dir, name),
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="460" viewBox="0 0 1000 460"><rect width="1000" height="460" rx="18" fill="#101315"/><text x="60" y="75" fill="#93c5fd" font-family="monospace" font-size="16" letter-spacing="2">${heading}</text>${boxes}<text x="60" y="365" fill="#a8b3bf" font-family="Arial" font-size="18">${note}</text></svg>`,
  );
}
seoDiagram(
  "personal-seo-flow.svg",
  "SEARCH IS A PROCESS",
  ["Discover", "Index", "Evaluate"],
  "Clear links → readable pages → relevant results. Rankings are not guaranteed.",
);
seoDiagram(
  "personal-seo-tracker.svg",
  "TRACK EVIDENCE, NOT PROMISES",
  ["Baseline", "Implement", "Measure", "Revise"],
  "13 October 2026: source changes recorded. Search performance measurement pending.",
);
console.log("Created nine original blog illustrations.");
