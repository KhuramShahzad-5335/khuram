# Khuram Shahzad Portfolio

The app lives at this repository's root. This is the folder to open, edit, and publish to GitHub. The older Desktop copy is a backup. Planning documents are in `docs/`; previous staging files and research are preserved locally in the ignored `.local-archive/` folder.

For step-by-step GitHub and Vercel setup, see [the deployment guide](docs/DEPLOYMENT.md). Vercel's Root Directory should be the repository root (`./`).

Static Next.js portfolio with TypeScript, Tailwind CSS, GSAP, Framer Motion, and React Three Fiber. No custom backend, database, accounts, or submission service.

## Local development

Run `npm ci`, then `npm run dev`. Open http://127.0.0.1:3000.

Run `npm run typecheck` and `npm run build` to verify. The static export is generated in `out/`. Run `npm start` after building to preview that export locally.

## Content

- Projects and experiments: `lib/content.ts`; expanded case studies: `lib/journeys.ts`
- Homepage and sample testimonials: `components/home.tsx`
- Blog articles: `lib/posts.ts`; static routes in `app/blog/`. Add a post record with sections and images, then rebuild. Word counts include the introduction, section headings, and paragraphs; code, captions, and further-reading labels are excluded. Reading time is estimated at 200 words per minute.
- Palette: `components/shell.tsx`, `components/palette-gallery.tsx`, and `lib/palettes.ts`; named themes, shuffled generated previews, and browser-local saving.

Conceptual project previews are labeled illustrations, not real screenshots. Testimonials are visibly fictional placeholders. Replace these and revise draft project narratives before treating them as verified endorsements or complete case studies.

## Before publishing on Vercel

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain and rebuild. Without it, pages deliberately use noindex and robots disallow indexing; no example-domain canonical should be published. Set the Vercel framework to Next.js. No GitHub or Vercel account changes have been made.

Review real mobile rendering, reduced motion, color contrast, contact links, and WebGL fallback. A PNG social preview is included; verify it on the final domain before launch. Domain, source publishing, and Vercel setup are handled by the owner.



Additional sections and interactive controls live in components/extra-sections.tsx. Section 3D models are generated geometry in components/section-scene.tsx and mount near the viewport, with reduced-motion and WebGL fallbacks. Blog artwork is local original SVG with PNG sharing variants in public/images.

