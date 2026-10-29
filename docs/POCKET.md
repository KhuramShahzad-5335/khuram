# Pocket MVP

Pocket is a separate personal desk, served as a standalone document. Its working name is not a cleared product trademark. It does not load the portfolio React shell, analytics, MongoDB, or advertising. No account is required.

## Run and deploy

- `npm run pocket`: standalone preview at http://127.0.0.1:4313/index.html.
- Portfolio development or production server: `/pocket/index.html`; `/pocket/` redirects there.
- Publish with the normal repository deployment, or deploy the contents of `public/pocket` on a dedicated HTTPS origin. A dedicated origin is recommended before a public product launch.
- No environment variables, database, paid APIs, or build step are required for Pocket itself.
- Service workers require HTTPS or localhost. Offline use becomes available after the app shell has been cached. Installation availability depends on the browser.

Browser storage belongs to an origin: localhost ports and production have separate desks. Export from one and import into another to move your content.

## Included

Notes, safe HTTP/HTTPS links, locally resized images, editable collections, search, type filters, sorting, pins, desktop drag reordering, accessible reorder buttons, recoverable Trash, six free themes, four random palette moods, editable colors, three font styles, theme export, and full JSON backup/restore. Keyboard shortcuts: N adds a note; / focuses search; Escape closes a dialog. Reduced-motion preferences are respected.

The default sample cards are editable. Card movements reorder the grid rather than providing an unlimited free-position canvas. There is no cloud sync, shared workspace, remote link preview, rich-text editor, or encryption in this MVP.

## Data safety and privacy

IndexedDB `pocket-local-v1` stores the desk. Writes finish before success is displayed. A revision check rejects stale writes from another tab rather than silently overwriting changes. Reload a stale tab after preserving any unsaved text.

Nothing in a card is uploaded. Files, styles, and scripts are served locally from the app host. The host may retain ordinary request logs, including IP addresses. Opening an external link visits its destination. The portfolio and Pocket currently share an origin, so this is not an isolation boundary against other scripts on that origin.

Local storage and exported JSON backups are **not encrypted**. Anyone using the same browser profile may access the desk. Browser cleanup, quota exhaustion, private-browsing closure, device loss, or storage eviction can remove content. Download backups regularly. Never represent the app as secure storage for passwords or secrets.

Images accept JPEG, PNG, or WebP, up to 10 MB and 50 megapixels, and are resized to a maximum 1600-pixel dimension and encoded as WebP. Backups validate their schema before being applied. Maximum import is 60 MB, with 1,000 cards and 100 collections. Merge preserves existing cards and assigns new IDs to imported cards; Replace requires confirmation. Backups contain Trash too. Permanent deletion requires confirmation.

## Source map

- `public/pocket/index.html`: semantic application shell and dialogs.
- `public/pocket/pocket.css`: isolated shared design tokens, responsive layouts, and motion.
- `public/pocket/app.mjs`: user interactions, rendering, image processing, themes and imports.
- `public/pocket/model.mjs`: data validation, presets, contrast and URL safety.
- `public/pocket/store.mjs`: IndexedDB transactions and revision protection.
- `public/pocket/sw.js`: scoped offline shell cache. Increment its cache version when changing shell assets.
- `scripts/serve-pocket.mjs`: local static preview server.
- `scripts/check-pocket.mjs`: schema and browser regression checks.

This buildless app deliberately uses isolated CSS rather than adding a second framework or loading the portfolio bundle. All user content is escaped when rendered. Maintain that rule, strict link validation, and the Content Security Policy when adding features.

## Checks and release

Run `npm run check:pocket` with a Playwright Chromium installation. Alternatively set `CHROME_BINARY` to a local Chrome executable. Screenshots are saved outside the repository under the temporary `pocket-qa` directory (override with `POCKET_QA_DIR`). Run the portfolio's `npm run check` after integration changes too.

Before releasing, verify keyboard access, narrow screens, reduced motion, offline reload, backup restoration on a fresh browser profile, and that no card contents appear in network requests. Custom palettes warn about low text contrast; card text selects a readable fallback. Pocket is intentionally noindex while it is an MVP. There are no ranking, storage durability, or universal PWA installation guarantees.
