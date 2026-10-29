import {
  themes,
  uid,
  safeUrl,
  contrast,
  inkOn,
  validateBackup,
  initialDesk,
} from "./model.mjs";
import { openStore, readDesk, writeDesk } from "./store.mjs";
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state,
  revision = 0,
  ready = false,
  view = "all",
  filter = "all",
  editing = null,
  editType = "note",
  imageData = "",
  saveQueue = Promise.resolve(),
  toastTimer,
  dragId,
  installEvent;
const channel =
  "BroadcastChannel" in window ? new BroadcastChannel("pocket-changes") : null;
function message(text, undo) {
  clearTimeout(toastTimer);
  const t = $("#toast");
  t.hidden = false;
  t.querySelector("span").textContent = text;
  const b = t.querySelector("button");
  b.hidden = !undo;
  b.onclick = async () => {
    await undo();
    t.hidden = true;
  };
  toastTimer = setTimeout(() => (t.hidden = true), undo ? 12000 : 7000);
}
function announceError(error) {
  $("#save-status").textContent = "Not saved — check message";
  message(
    error.message || "Something went wrong. Your previous save is unchanged.",
  );
}
async function commit(change) {
  const operation = saveQueue.then(async () => {
    if (!ready)
      throw new Error(
        "Local storage is not ready. Reload or check browser storage settings.",
      );
    const next = structuredClone(state);
    change(next);
    validateBackup(next);
    $("#save-status").textContent = "Saving on this device…";
    const r = await writeDesk(next, revision);
    state = next;
    revision = r;
    channel?.postMessage(revision);
    applyPalette();
    render();
    $("#save-status").textContent = "✓ Saved on this device";
    return true;
  });
  saveQueue = operation.catch(() => {});
  return operation.catch((e) => {
    announceError(e);
    return false;
  });
}
function applyPalette() {
  const p = state.palette;
  const root = document.documentElement;
  for (const k of ["bg", "surface", "ink", "accent", "warm", "cool"])
    root.style.setProperty("--" + k, p[k]);
  root.style.setProperty("--on-accent", inkOn(p.accent));
  root.style.setProperty("--muted", p.ink);
  root.style.colorScheme =
    contrast("#ffffff", p.bg) > contrast("#17191e", p.bg) ? "dark" : "light";
  document.body.dataset.font = state.font;
  document.querySelector("meta[name=theme-color]").content = p.bg;
}
function visibleCards() {
  const q = $("#search").value.toLocaleLowerCase().trim();
  let cards = state.cards.filter((c) =>
    view === "trash"
      ? c.trashed
      : !c.trashed &&
        (view === "all" ||
          (view === "pinned" && c.pinned) ||
          c.collection === view),
  );
  cards = cards.filter(
    (c) =>
      (filter === "all" || c.type === filter) &&
      (!q ||
        `${c.title} ${c.body} ${c.url || ""} ${c.alt || ""}`
          .toLocaleLowerCase()
          .includes(q)),
  );
  const sort = $("#sort").value;
  if (sort === "newest") cards.sort((a, b) => b.created - a.created);
  if (sort === "title") cards.sort((a, b) => a.title.localeCompare(b.title));
  return cards;
}
function render() {
  if (!state) return;
  const active = state.cards.filter((c) => !c.trashed);
  $("#all-count").textContent = active.length;
  $("#pin-count").textContent = active.filter((c) => c.pinned).length;
  $("#trash-count").textContent = state.cards.length - active.length;
  $("#collections").innerHTML =
    state.collections
      .map(
        (c) =>
          `<button data-view="${esc(c.id)}" class="${view === c.id ? "active" : ""}"><i class="collection-dot"></i><span class="collection-name">${esc(c.name)}</span><small>${active.filter((x) => x.collection === c.id).length}</small></button>`,
      )
      .join("") +
    '<button data-action="collection" class="mobile-add-collection" aria-label="New collection">＋ New collection</button>';
  document.querySelectorAll("[data-view]").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === view);
    b.setAttribute("aria-current", b.dataset.view === view ? "page" : "false");
  });
  const collection = state.collections.find((c) => c.id === view);
  const title =
    collection?.name ||
    (view === "pinned"
      ? "Close to heart"
      : view === "trash"
        ? "A second chance"
        : "My little corner");
  $("#desk-title").textContent = title + ".";
  $("#crumb").textContent =
    collection?.name ||
    { all: "My desk", pinned: "Pinned", trash: "Trash" }[view];
  $("#desk-description").textContent =
    view === "trash"
      ? "Nothing here is gone until you choose to delete it permanently."
      : "Thoughts, finds, and things you don’t want to forget.";
  $("#collection-edit").hidden = !collection;
  const cards = visibleCards();
  $("#results").textContent =
    `${cards.length} ${cards.length === 1 ? "thing" : "things"} ${$("#search").value ? "found" : "in this corner"}`;
  $("#cards").innerHTML = cards
    .map((c) => {
      const label =
        state.collections.find((x) => x.id === c.collection)?.name ||
        "On your desk";
      const bg = {
        plain: state.palette.surface,
        accent: state.palette.accent,
        warm: state.palette.warm,
        cool: state.palette.cool,
      }[c.tone];
      const ink =
        contrast(state.palette.ink, bg) >= 4.5 ? state.palette.ink : inkOn(bg);
      return `<article class="card" data-id="${esc(c.id)}" data-tone="${c.tone}" style="color:${ink};--muted:${ink}"><div class="card-top"><span class="card-kicker">${c.type === "note" ? "✎" : c.type === "link" ? "↗" : "▧"} &nbsp; ${esc(label)}</span><div class="card-controls">${!c.trashed ? `<button data-card-action="pin" aria-label="${c.pinned ? "Unpin" : "Pin"} ${esc(c.title)}" aria-pressed="${c.pinned}">${c.pinned ? "★" : "☆"}</button><button draggable="true" class="grip" aria-label="Drag ${esc(c.title)} to reorder" title="Drag to reorder">⠿</button>` : ""}</div></div><button class="card-main" data-card-action="edit" aria-label="Edit ${esc(c.title)}">${c.type === "image" ? `<img class="card-image" src="${c.image}" alt="${esc(c.alt)}" loading="lazy" />` : ""}${c.type === "link" ? `<span class="link-domain">${esc(new URL(c.url).hostname)} ↗</span>` : ""}<h2>${esc(c.title)}</h2><p>${esc(c.body)}</p></button><div class="card-bottom"><span class="date">${new Date(c.created).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>${c.trashed ? '<button data-card-action="restore">Restore</button><button data-card-action="delete" aria-label="Delete permanently">×</button>' : `${c.type === "link" ? `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a>` : ""}<button data-card-action="up" aria-label="Move ${esc(c.title)} earlier">↑</button><button data-card-action="down" aria-label="Move ${esc(c.title)} later">↓</button><button data-card-action="edit" aria-label="Edit ${esc(c.title)}">✎</button><button data-card-action="trash" aria-label="Move ${esc(c.title)} to Trash">×</button>`}</div></article>`;
    })
    .join("");
  if (cards.length && view !== "trash")
    $("#cards").insertAdjacentHTML(
      "beforeend",
      '<button class="add-card" data-action="new"><span>＋</span><strong>A thought? A good find?</strong><small>There’s room for it here.</small></button>',
    );
  $("#empty").hidden = cards.length > 0;
  $("#empty h2").textContent =
    $("#search").value || filter !== "all"
      ? "Nothing matches just yet."
      : view === "trash"
        ? "Nothing in the bin."
        : "A little room for something good.";
  $("#empty p").textContent =
    $("#search").value || filter !== "all"
      ? "Try another search or choose Everything."
      : view === "trash"
        ? "Cards you remove will wait here until you restore or permanently delete them."
        : "Add a thought, a link, or a photo. You decide what belongs here.";
  $("#empty button").hidden = view === "trash";
}
function openEditor(id = null, type = "note") {
  if (!ready) {
    message("Please wait for local storage, or reload if it is unavailable.");
    return;
  }
  editing = id;
  const c = state.cards.find((c) => c.id === id);
  if (c?.trashed) {
    message("Restore this card before editing it.");
    return;
  }
  editType = c?.type || type;
  imageData = c?.image || "";
  const form = $("#card-form");
  form.reset();
  form.elements.title.value = c?.title || "";
  form.elements.body.value = c?.body || "";
  form.elements.url.value = c?.url || "";
  form.elements.alt.value = c?.alt || "";
  form.elements.tone.value = c?.tone || "plain";
  form.elements.collection.innerHTML =
    '<option value="">On your desk</option>' +
    state.collections
      .map((x) => `<option value="${esc(x.id)}">${esc(x.name)}</option>`)
      .join("");
  form.elements.collection.value =
    c?.collection || (state.collections.some((x) => x.id === view) ? view : "");
  $("#editor-title").textContent = c ? "A little edit" : "Add to your pocket";
  $("#editor-error").textContent = "";
  setType(editType);
  $("#editor").showModal();
  form.elements.title.focus();
}
function setType(type) {
  editType = type;
  document.querySelectorAll("[data-type]").forEach((b) => {
    b.classList.toggle("selected", b.dataset.type === type);
    b.setAttribute("aria-pressed", b.dataset.type === type);
  });
  $("#url-field").hidden = type !== "link";
  $("#card-form").elements.url.required = type === "link";
  $("#image-field").hidden = type !== "image";
  $("#card-form").elements.alt.required = type === "image";
  $("#image-preview").hidden = !imageData;
  $("#image-preview").src = imageData || "";
}
$("#card-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const title = f.elements.title.value.trim();
  const url = safeUrl(f.elements.url.value.trim());
  if (
    !title ||
    (editType === "link" && !url) ||
    (editType === "image" && !imageData)
  ) {
    $("#editor-error").textContent =
      editType === "image"
        ? "Choose an image before saving."
        : "Add a title and a valid HTTP or HTTPS address.";
    return;
  }
  const previous = state.cards.find((c) => c.id === editing);
  const card = {
    id: editing || uid(),
    type: editType,
    title,
    body: f.elements.body.value.trim(),
    collection: f.elements.collection.value,
    tone: f.elements.tone.value,
    pinned: previous?.pinned || false,
    trashed: false,
    created: previous?.created || Date.now(),
    updated: Date.now(),
    ...(editType === "link" ? { url } : {}),
    ...(editType === "image"
      ? { image: imageData, alt: f.elements.alt.value.trim() }
      : {}),
  };
  const submit = f.querySelector("[type=submit]");
  submit.disabled = true;
  const ok = await commit((s) => {
    const index = s.cards.findIndex((c) => c.id === card.id);
    if (index < 0) s.cards.unshift(card);
    else s.cards[index] = card;
  });
  submit.disabled = false;
  if (ok) {
    $("#editor").close();
    message(
      previous ? "Your changes are kept." : "A new thing, safely on your desk.",
    );
  } else
    $("#editor-error").textContent =
      "Not saved. Keep this editor open, copy your text, and check storage or other tabs.";
});
$("#image-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  $("#editor-error").textContent = "";
  const submit = $("#card-form [type=submit]");
  submit.disabled = true;
  try {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    )
      throw new Error("Choose a JPEG, PNG or WebP smaller than 10 MB.");
    const bitmap = await createImageBitmap(file);
    if (bitmap.width * bitmap.height > 50000000) {
      bitmap.close();
      throw new Error(
        "This image is too large. Choose an image under 50 megapixels.",
      );
    }
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas
      .getContext("2d")
      .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    imageData = canvas.toDataURL("image/webp", 0.82);
    if (imageData.length > 4000000)
      throw new Error(
        "The compressed image is still too large. Try a smaller image.",
      );
    $("#image-preview").src = imageData;
    $("#image-preview").hidden = false;
  } catch (error) {
    $("#editor-error").textContent = error.message;
    e.target.value = "";
  } finally {
    submit.disabled = false;
  }
});
function download(name, text) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function openSettings(title, html) {
  $("#settings-title").textContent = title;
  $("#settings-content").innerHTML = html;
  $("#settings").showModal();
}
function openAppearance() {
  openSettings(
    "Make yourself at home",
    `<p class="settings-copy">Every theme is free. Your palette repaints the whole desk.</p><div class="theme-grid">${themes.map((t, i) => `<button class="theme-tile" data-theme="${i}" aria-pressed="${state.palette.name === t.name}"><span class="swatches">${[t.bg, t.ink, t.accent, t.warm].map((c) => `<i style="background:${c}"></i>`).join("")}</span>${t.name}</button>`).join("")}</div><label>Shuffle a mood<select id="mood"><option value="light">Light · soft canvas</option><option value="dark">Dark · quiet contrast</option><option value="funky">Funky · full color</option><option value="extreme">Extreme · electric</option></select></label><div class="settings-row"><button id="shuffle">↻ Surprise me</button><button id="reset-theme">Reset to Paper</button></div><div class="color-grid">${[
      ["bg", "Background"],
      ["surface", "Surface"],
      ["ink", "Text"],
      ["accent", "Accent"],
      ["warm", "Warm cards"],
      ["cool", "Cool cards"],
    ]
      .map(
        ([k, label]) =>
          `<label>${label}<input type="color" data-color="${k}" value="${state.palette[k]}" aria-label="${label} color" /></label>`,
      )
      .join(
        "",
      )}</div><p id="contrast" class="contrast-note"></p><label>Typography<select id="font"><option value="clean">Clean · system sans</option><option value="editorial">Editorial · serif</option><option value="mono">Terminal · monospace</option></select></label><div class="settings-row"><button id="export-theme">Export this theme</button><button data-action="collection">＋ New collection</button><button data-action="backup">Backup &amp; restore</button><button data-action="privacy">Privacy</button></div>`,
  );
  $("#font").value = state.font;
  updateContrast();
}
function updateContrast() {
  if (!$("#contrast")) return;
  const p = state.palette;
  const min = Math.min(contrast(p.ink, p.bg), contrast(p.ink, p.surface));
  $("#contrast").textContent =
    `Text contrast: ${min.toFixed(1)}:1. ${min >= 4.5 ? "Passes the normal-text contrast threshold." : "Low contrast — choose darker or lighter text."} Card text adjusts automatically.`;
  document
    .querySelectorAll("[data-color]")
    .forEach((i) => (i.value = p[i.dataset.color]));
  document
    .querySelectorAll("[data-theme]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        themes[Number(b.dataset.theme)].name === p.name,
      ),
    );
}
function hsl(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return (
    "#" +
    [0, 8, 4]
      .map((n) =>
        Math.round(255 * f(n))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
let hue = Math.floor(Math.random() * 360);
function shuffle(mood) {
  hue = (hue + 137.508) % 360;
  const dark = ["dark", "extreme"].includes(mood);
  const extreme = mood === "extreme";
  const funky = mood === "funky";
  return {
    name: "Your mix",
    bg: dark ? "#111214" : funky ? hsl(hue, 55, 92) : "#f6f5f2",
    surface: dark ? "#202124" : "#fffefa",
    ink: dark ? "#f4f4f5" : "#222329",
    accent: hsl(hue, extreme ? 100 : 75, dark ? 72 : 37),
    warm: hsl((hue + 45) % 360, 45, dark ? 22 : 85),
    cool: hsl((hue + 190) % 360, 40, dark ? 20 : 88),
  };
}
function openBackup() {
  openSettings(
    "Take your space with you",
    `<p class="settings-copy">Your backup includes every card, image, collection, theme and item in Trash. It is a readable, <strong>unencrypted</strong> JSON file. Keep it somewhere safe.</p><div class="backup-box"><h3>Your desk, in one file.</h3><p>Download a backup before clearing browser data or moving to another device.</p><button id="export">↓ Download backup</button></div><div class="backup-box"><h3>Bring a pocket home.</h3><p>Restore a Pocket v1 backup, or import a theme. Replacing a desk requires confirmation. Importing an empty theme does not alter your cards.</p><label>Backup or theme file<input id="import" type="file" accept="application/json,.json" /></label><label>Restore mode<select id="import-mode"><option value="merge">Merge cards into this desk</option><option value="replace">Replace this desk</option></select></label></div><p class="settings-copy">Clearing this browser’s site data deletes this desk. A downloaded backup is independent of browser storage. Private browsing may discard everything when closed.</p>`,
  );
}
function openPrivacy() {
  openSettings(
    "A private little corner",
    `<p class="settings-copy"><strong>Your cards are stored in IndexedDB in this browser.</strong> Pocket has no account, analytics, ad scripts, remote fonts or AI service. It does not upload your notes, links or photos.</p><ul class="privacy-list"><li>Opening the app downloads its files. The hosting provider can receive normal request logs such as IP addresses.</li><li>Opening a saved link visits that website. Pocket does not fetch link previews.</li><li>Local does not mean encrypted. Other people using this browser profile may access your desk.</li><li>This MVP shares the hosting origin with the portfolio. For stronger isolation, deploy it on a dedicated origin.</li><li>Offline use works after the app files have been cached. Updates need a connection.</li><li>Keep backups. Browser cleanup, storage limits or device loss can remove local content.</li></ul><h3>Little shortcuts</h3><p class="settings-copy"><kbd>N</kbd> New note · <kbd>/</kbd> Search · <kbd>Esc</kbd> Close dialog.<br />Reorder cards with the grip on desktop, or ↑ / ↓ buttons on any device. Reordering switches to Your order.</p><div class="settings-row"><button data-action="backup">Backup &amp; restore</button><button data-action="appearance">Themes &amp; colors</button></div>`,
  );
}
function openCollection(edit = false) {
  const c = edit ? state.collections.find((x) => x.id === view) : null;
  openSettings(
    c ? "Edit collection" : "A new little collection",
    `<form id="collection-form"><label>Collection name<input name="name" maxlength="60" value="${esc(c?.name || "")}" required placeholder="Things that belong together" /></label><div class="collection-actions"><button class="primary" type="submit">${c ? "Save changes" : "Create collection"}</button>${c ? '<button class="danger" id="remove-collection" type="button">Remove collection</button>' : ""}</div><p class="settings-copy">Removing a collection moves its cards to your desk. It does not delete them.</p></form>`,
  );
  $("#collection-form").onsubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value.trim();
    if (!name) return;
    const id = c?.id || uid();
    if (
      await commit((s) => {
        if (c) s.collections.find((x) => x.id === id).name = name;
        else s.collections.push({ id, name });
      })
    ) {
      view = id;
      render();
      $("#settings").close();
    }
  };
  if (c)
    $("#remove-collection").onclick = async () => {
      if (
        await commit((s) => {
          s.collections = s.collections.filter((x) => x.id !== c.id);
          s.cards.forEach((x) => {
            if (x.collection === c.id) x.collection = "";
          });
        })
      ) {
        view = "all";
        render();
        $("#settings").close();
        message("Collection removed. Your cards are still here.");
      }
    };
}
async function moveCard(id, targetId) {
  if (id === targetId) return;
  const ok = await commit((s) => {
    const from = s.cards.findIndex((c) => c.id === id),
      to = s.cards.findIndex((c) => c.id === targetId);
    if (from < 0 || to < 0) return;
    const [card] = s.cards.splice(from, 1);
    s.cards.splice(to, 0, card);
  });
  if (ok) {
    $("#sort").value = "manual";
    render();
    message("Your order, saved.");
  }
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-close")) {
    b.closest("dialog").close();
    return;
  }
  if (b.dataset.view) {
    view = b.dataset.view;
    render();
    return;
  }
  if (b.dataset.filter) {
    filter = b.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((x) => x.setAttribute("aria-pressed", x === b));
    render();
    return;
  }
  if (b.dataset.type) {
    setType(b.dataset.type);
    return;
  }
  if (b.dataset.action) {
    const action = b.dataset.action;
    if (!ready) {
      message("Local storage is not available yet.");
      return;
    }
    if ($("#settings").open) $("#settings").close();
    ({
      new: () => openEditor(),
      appearance: openAppearance,
      backup: openBackup,
      privacy: openPrivacy,
      collection: () => openCollection(),
      "edit-collection": () => openCollection(true),
    })[action]?.();
    return;
  }
  if (b.dataset.theme !== undefined) {
    await commit((s) => (s.palette = { ...themes[Number(b.dataset.theme)] }));
    updateContrast();
    return;
  }
  if (b.id === "shuffle") {
    await commit((s) => (s.palette = shuffle($("#mood").value)));
    updateContrast();
    return;
  }
  if (b.id === "reset-theme") {
    await commit((s) => {
      s.palette = { ...themes[0] };
      s.font = "clean";
    });
    $("#font").value = "clean";
    updateContrast();
    return;
  }
  if (b.id === "export") {
    await saveQueue;
    download(
      `pocket-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(state, null, 2),
    );
    message("Backup downloaded. Keep it somewhere safe.");
    return;
  }
  if (b.id === "export-theme") {
    download(
      "pocket-theme.json",
      JSON.stringify(
        {
          kind: "pocket-theme",
          version: 1,
          palette: state.palette,
          font: state.font,
        },
        null,
        2,
      ),
    );
    return;
  }
  const action = b.dataset.cardAction;
  const article = b.closest("[data-id]");
  if (!action || !article) return;
  const id = article.dataset.id,
    c = state.cards.find((x) => x.id === id);
  if (!c) return;
  if (action === "edit") {
    openEditor(id);
    return;
  }
  if (["up", "down"].includes(action)) {
    const list = visibleCards(),
      index = list.findIndex((x) => x.id === id),
      target = list[index + (action === "up" ? -1 : 1)];
    if (target) {
      await moveCard(id, target.id);
      document
        .querySelector(
          `[data-id="${CSS.escape(id)}"] [data-card-action="${action}"]`,
        )
        ?.focus();
    }
    return;
  }
  if (action === "delete") {
    if (
      !confirm(
        `Permanently delete “${c.title}”? This cannot be undone. Download a backup first if you want to keep it.`,
      )
    )
      return;
    await commit((s) => (s.cards = s.cards.filter((x) => x.id !== id)));
    return;
  }
  const ok = await commit((s) => {
    const card = s.cards.find((x) => x.id === id);
    if (action === "pin") card.pinned = !card.pinned;
    else card.trashed = action === "trash";
    card.updated = Date.now();
  });
  if (ok && action === "trash")
    message("Moved to Trash.", () =>
      commit((s) => {
        const card = s.cards.find((x) => x.id === id);
        if (card) card.trashed = false;
      }),
    );
});
document.addEventListener("change", async (e) => {
  const el = e.target;
  if (el.dataset.color) {
    await commit((s) => {
      s.palette[el.dataset.color] = el.value;
      s.palette.name = "Your mix";
    });
    updateContrast();
  }
  if (el.id === "font") await commit((s) => (s.font = el.value));
  if (el.id === "import") {
    const file = el.files[0];
    if (!file) return;
    try {
      if (file.size > 60 * 1024 * 1024)
        throw new Error("Backup is too large. Maximum import size is 60 MB.");
      const raw = JSON.parse(await file.text());
      if (raw.kind === "pocket-theme") {
        const valid = validateBackup({
          ...state,
          palette: raw.palette,
          font: raw.font,
        });
        if (
          await commit((s) => {
            s.palette = valid.palette;
            s.font = valid.font;
          })
        )
          message("Your new theme is home.");
        return;
      }
      const imported = validateBackup(raw);
      const replace = $("#import-mode").value === "replace";
      if (
        replace &&
        !confirm(
          "Replace all current cards and collections with this backup? Download your current backup first.",
        )
      )
        return;
      const ok = await commit((s) => {
        if (replace) {
          Object.assign(s, imported);
          return;
        }
        const map = new Map();
        imported.collections.forEach((c) => {
          const existing = s.collections.find((x) => x.name === c.name);
          const id = existing?.id || uid();
          map.set(c.id, id);
          if (!existing) s.collections.push({ id, name: c.name });
        });
        imported.cards.forEach((c) =>
          s.cards.push({
            ...c,
            id: uid(),
            collection: map.get(c.collection) || "",
          }),
        );
      });
      if (ok) {
        view = "all";
        render();
        message(
          `Restored ${imported.cards.length} cards. Your backup file is unchanged.`,
        );
      }
    } catch (error) {
      message(
        error.message || "Could not read this backup. Your desk is unchanged.",
      );
    } finally {
      el.value = "";
    }
  }
});
$("#search").addEventListener("input", render);
$("#sort").addEventListener("change", render);
document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    document.querySelector("dialog[open]") ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
  )
    return;
  if (e.key === "/") {
    e.preventDefault();
    $("#search").focus();
  }
  if (e.key.toLowerCase() === "n") {
    e.preventDefault();
    openEditor();
  }
});
$("#cards").addEventListener("dragstart", (e) => {
  if (!e.target.closest(".grip")) return;
  dragId = e.target.closest("[data-id]").dataset.id;
  e.dataTransfer.setData("text/plain", dragId);
  e.dataTransfer.effectAllowed = "move";
  e.target.closest(".card").classList.add("dragging");
});
$("#cards").addEventListener("dragover", (e) => {
  if (!dragId) return;
  const card = e.target.closest(".card");
  if (card) {
    e.preventDefault();
    document
      .querySelectorAll(".drag-over")
      .forEach((c) => c.classList.remove("drag-over"));
    card.classList.add("drag-over");
  }
});
$("#cards").addEventListener("drop", async (e) => {
  e.preventDefault();
  const target = e.target.closest("[data-id]");
  if (dragId && target) await moveCard(dragId, target.dataset.id);
  dragId = null;
  document
    .querySelectorAll(".drag-over,.dragging")
    .forEach((c) => c.classList.remove("drag-over", "dragging"));
});
$("#cards").addEventListener("dragend", () => {
  dragId = null;
  document
    .querySelectorAll(".drag-over,.dragging")
    .forEach((c) => c.classList.remove("drag-over", "dragging"));
});
channel?.addEventListener("message", (e) => {
  if (e.data !== revision) {
    $("#save-status").textContent = "Changed in another tab";
    message("Another tab updated this desk. Reload before making changes.");
  }
});
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installEvent = e;
  $("#install").hidden = false;
});
$("#install").onclick = async () => {
  if (installEvent) {
    await installEvent.prompt();
    installEvent = null;
    $("#install").hidden = true;
  }
};
try {
  await openStore();
  const saved = await readDesk();
  state = saved ? validateBackup(saved.data) : initialDesk();
  revision = saved?.revision || 0;
  if (!saved) revision = await writeDesk(state, 0);
  ready = true;
  applyPalette();
  render();
  $("#save-status").textContent = "✓ Saved on this device";
} catch (error) {
  state = initialDesk();
  render();
  $("#save-status").textContent = "Storage unavailable";
  message(
    "Could not open your local desk. No existing data was overwritten. Check browser storage permissions and reload.",
  );
  console.error("Pocket storage unavailable:", error.name);
}
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch(() => {
    message("Offline setup is unavailable. You can still use Pocket online.");
  });
