export const themes = [
  {
    name: "Paper & ink",
    bg: "#f3f0e9",
    surface: "#fffdf8",
    ink: "#272a31",
    accent: "#2b4ad8",
    warm: "#f4dfbd",
    cool: "#dce7e1",
  },
  {
    name: "Terminal",
    bg: "#101214",
    surface: "#1d2024",
    ink: "#eff4f1",
    accent: "#95efb0",
    warm: "#302923",
    cool: "#20332c",
  },
  {
    name: "Rosewater",
    bg: "#f9ecee",
    surface: "#fff9fa",
    ink: "#492c39",
    accent: "#9c3261",
    warm: "#f2d7bd",
    cool: "#e6ddeb",
  },
  {
    name: "Ocean",
    bg: "#e8f0f5",
    surface: "#f6fbff",
    ink: "#213b4b",
    accent: "#17658c",
    warm: "#ecdfcb",
    cool: "#d4e7ed",
  },
  {
    name: "After hours",
    bg: "#191725",
    surface: "#262337",
    ink: "#f0ebff",
    accent: "#c6abff",
    warm: "#3a2b31",
    cool: "#253441",
  },
  {
    name: "Matcha",
    bg: "#edf0e5",
    surface: "#fafbf5",
    ink: "#2e3826",
    accent: "#456431",
    warm: "#ede0bd",
    cool: "#dce6ce",
  },
];
export const uid = () => crypto.randomUUID();
export function safeUrl(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) &&
      !u.username &&
      !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function contrast(a, b) {
  const lum = (h) => {
    const c = h
      .slice(1)
      .match(/../g)
      .map((x) => parseInt(x, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export const inkOn = (bg) =>
  contrast("#ffffff", bg) > contrast("#17191e", bg) ? "#ffffff" : "#17191e";
export function validateBackup(value) {
  const fail = () => {
    throw new Error(
      "This is not a valid Pocket v1 backup. Your current desk has not been changed.",
    );
  };
  const text = (s, n) => typeof s === "string" && s.length <= n;
  if (
    !value ||
    value.version !== 1 ||
    !Array.isArray(value.cards) ||
    value.cards.length > 1000 ||
    !Array.isArray(value.collections) ||
    value.collections.length > 100
  )
    fail();
  const collections = value.collections.map((c) => {
    if (!c || !text(c.id, 100) || !c.id || !text(c.name, 60) || !c.name.trim())
      fail();
    return { id: c.id, name: c.name };
  });
  const ids = new Set(collections.map((c) => c.id));
  if (ids.size !== collections.length) fail();
  const cards = value.cards.map((c) => {
    if (
      !c ||
      !text(c.id, 100) ||
      !c.id ||
      !["note", "link", "image"].includes(c.type) ||
      !text(c.title, 120) ||
      !c.title.trim() ||
      !text(c.body, 20000) ||
      !text(c.collection, 100) ||
      !["plain", "accent", "warm", "cool"].includes(c.tone) ||
      !Number.isFinite(c.created) ||
      !Number.isFinite(c.updated) ||
      typeof c.pinned !== "boolean" ||
      typeof c.trashed !== "boolean"
    )
      fail();
    if (c.collection && !ids.has(c.collection)) fail();
    if (c.type === "link" && (!text(c.url, 2048) || !safeUrl(c.url))) fail();
    if (
      c.type === "image" &&
      (!text(c.image, 4000000) ||
        !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(
          c.image,
        ) ||
        !text(c.alt, 300) ||
        !c.alt.trim())
    )
      fail();
    return {
      id: c.id,
      type: c.type,
      title: c.title,
      body: c.body,
      collection: c.collection,
      tone: c.tone,
      created: c.created,
      updated: c.updated,
      pinned: c.pinned,
      trashed: c.trashed,
      ...(c.type === "link" ? { url: safeUrl(c.url) } : {}),
      ...(c.type === "image" ? { image: c.image, alt: c.alt } : {}),
    };
  });
  if (new Set(cards.map((c) => c.id)).size !== cards.length) fail();
  const palette = value.palette;
  if (
    !palette ||
    !text(palette.name, 60) ||
    !["bg", "surface", "ink", "accent", "warm", "cool"].every((k) =>
      /^#[0-9a-f]{6}$/i.test(palette[k]),
    )
  )
    fail();
  if (!["clean", "editorial", "mono"].includes(value.font)) fail();
  return {
    version: 1,
    cards,
    collections,
    palette: Object.fromEntries(
      ["name", "bg", "surface", "ink", "accent", "warm", "cool"].map((k) => [
        k,
        palette[k],
      ]),
    ),
    font: value.font,
  };
}
export function initialDesk() {
  const now = Date.now();
  return {
    version: 1,
    palette: { ...themes[0] },
    font: "clean",
    collections: [
      { id: "ideas", name: "Little ideas" },
      { id: "life", name: "Everyday things" },
      { id: "inspiration", name: "Inspiration" },
    ],
    cards: [
      {
        id: uid(),
        type: "note",
        title: "A little space, entirely yours.",
        body: "Keep a passing thought. Save a good find. Make a home for something you love.\n\nNo audience to impress. No algorithm to please. Just your own little corner.",
        collection: "",
        tone: "plain",
        pinned: true,
        trashed: false,
        created: now,
        updated: now,
      },
      {
        id: uid(),
        type: "note",
        title: "More making.\nLess scrolling.",
        body: "A small reminder to leave a little room for the things that make you feel like you.\n\n✳",
        collection: "inspiration",
        tone: "accent",
        pinned: false,
        trashed: false,
        created: now,
        updated: now,
      },
      {
        id: uid(),
        type: "note",
        title: "The someday list",
        body: "→ Learn one song, all the way through\n→ Find a new favorite book\n→ Make something just for fun\n→ Leave an afternoon unplanned",
        collection: "life",
        tone: "warm",
        pinned: false,
        trashed: false,
        created: now,
        updated: now,
      },
      {
        id: uid(),
        type: "note",
        title: "A thought starts here",
        body: "What would you make if nobody was keeping score?\n\nDouble-click a card or choose Edit to make these starter notes your own.",
        collection: "ideas",
        tone: "cool",
        pinned: false,
        trashed: false,
        created: now,
        updated: now,
      },
      {
        id: uid(),
        type: "note",
        title: "Your things. Your device.",
        body: "Pocket saves here, in this browser. No account and no card uploads.\n\nDownload a backup before clearing browser data or changing devices. Local storage is not encryption.",
        collection: "",
        tone: "plain",
        pinned: false,
        trashed: false,
        created: now,
        updated: now,
      },
    ],
  };
}
