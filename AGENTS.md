<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio handoff

Read `README.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/CONTENT.md`, and `docs/DEPLOYMENT.md` before changes. They describe the current implementation; older planning documents are historical. Follow explicit current owner instructions first.

- Preserve commented-out JSX, including testimonials. The loader implementation was explicitly removed by the owner; do not restore it.
- Show content immediately on initial visits and reloads. No loading overlay, intro timers, or content fade gate. Preserve section animations and reduced-motion alternatives.
- Keep conventional navigation, static export, readable server HTML, and the dark theme with visitor palette customization. No scroll hijacking, game navigation, backend, or CMS unless requested.
- Prefer Server Components. Keep full article bodies out of client bundles; pass summaries. Gate 3D work by viewport/tab visibility and reduced motion.
- Use Tailwind for isolated component styling; CSS for shared patterns, tokens, typography, illustrations, and coordinated animation. Remove superseded styling rather than layering conflicting rules.
- Keep project contributions and personal details factual. Retain uncertainty labels, illustrative preview labels, and intentional employment overlaps. Never invent metrics or testimonials.
- Do not edit generated output as source. Keep personal deliverables and temporary QA artifacts outside the repository.
- Run `npm run check` and relevant mobile/keyboard/reduced-motion/reload checks. Report limits honestly; do not claim guaranteed 100/100 scores, rankings, or indexing.
