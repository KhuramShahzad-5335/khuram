# Design system and confirmed requirements

## Direction and audience

A calm, capable developer portfolio with understated humor for clients, developers, and general visitors. Conventional navigation and clear action labels come first. Monospace labels, terminal hints, grids, playful interactions, and a hero 3D sculpture and box-based section artwork provide the geeky character. A game-style interface was withdrawn by the owner; do not add game navigation, scroll hijacking, or mandatory full-screen panels.

The homepage combines scrollable sections with separate project, blog, and experiment routes. The default Terminal / Vercel palette is monochrome: near-black surfaces, white accents and gray secondary artwork. Visitors can select exactly two presets (Terminal / Vercel and Paper), generate four fresh palettes, edit individual colors, and reset. Preferences are local to the browser.

## Tokens and visual rules

| Token          | Default           | Purpose                             |
| -------------- | ----------------- | ----------------------------------- |
| `--background` | `#0a0a0a`         | Page canvas                         |
| `--surface`    | `#151515`         | Panels and controls                 |
| `--text`       | `#f5f5f5`         | Primary readable content            |
| `--accent`     | `#ededed`         | Emphasis, geometry and interactions |
| `--muted`      | `#a3a3a3`         | Secondary copy                      |
| `--border`     | Text mixed at 13% | Shared subtle borders               |

Defaults are in `lib/palettes.ts` and the first-paint CSS token block. Update both together when changing the default. Theme-aware Tailwind utilities use variables such as `text-(--muted)` and `border-(--border)`. The palette editor deliberately retains neutral fixed colors so visitors can recover from an unreadable custom theme.

Use six local font pairings: Clean, Editorial, Developer, Studio, Playful, and Technical, with independently selectable heading/body stacks. Heading and body variables change live and persist separately from color preferences; no external font requests are needed. Content is generally limited to 1440px with 6% desktop gutters and 5% smaller-screen gutters. Existing layout transitions use 1000px and 700px boundaries. Headings use tight tracking and responsive sizes; body copy must remain readable. Corners are subtle (roughly 5–12px), surfaces restrained, and borders thin. Avoid unnecessary shadows and competing accents.

## Styling ownership

Component details use Tailwind in the header, footer, blog cards, and generated palette controls. General typography, shared brand/button/tag/section patterns and established responsive layouts live in `app/globals.css` and `styles/sections.css`. Custom illustration and scene geometry stays in CSS. Shared CSS uses the components cascade layer so Tailwind utilities can override it without extra specificity. Extend shared patterns when multiple components need them; use utilities for isolated details and remove superseded declarations.

## Motion contract

The owner removed the loading screen on 15 October 2026, superseding the earlier reload-intro requirement. Render content immediately with no loader overlay, timed fade gate, or intro events. Keep section scroll reveals and their reduced-motion fallback.

Reduced-motion visitors receive static 3D alternatives. Server-rendered content remains readable without JavaScript. Offscreen and hidden-tab 3D scenes should not run continuously. Scroll reveals must preserve readable content if animation code cannot load. Preserve the commented-out testimonial section.

## Accessible interactions

Use semantic links for navigation, buttons for actions, descriptive accessible names, visible keyboard focus, and appropriate heading order. The mobile menu identifies its controlled navigation and closes on link selection. Process tabs use roving tab focus and arrow/Home/End navigation. The palette dialog contains focus, supports Escape/backdrop close, makes background content inert, locks body scroll, and restores focus on close.

Do not encode meaning solely through color. Warn when custom body-text contrast is below 4.5:1, retain a readable reset surface, and review the muted/accent contrast too. A custom palette warning is not a guarantee that every color combination is accessible. Images need dimensions and useful alt text; decorative geometry should be hidden from assistive technology where it conveys no information.

Scroll reveals use native browser animations once per element (24px over 700ms); initial viewport text stays opaque while moving into place. Process-panel changes use a 250ms CSS fade/8px rise. The hero scene loads independently at an idle opportunity when near the viewport, the tab is visible, and reduced motion is disabled. Its dynamic-loading fallback reserves the full model frame.

Shuffle generates four new previews and immediately applies the currently selected mood (Dark initially). The generator repairs primary text to at least 7:1 and muted/accent colors to at least 4.5:1 against both background and surface. Custom edits retain contrast warnings; these token checks do not certify every rendered interaction.

Generated moods are Dark, Light, Funky, and Extreme. Dark uses a near-black neutral canvas; Light uses white and pale neutral surfaces. Funky uses colorful pastel surfaces with vivid primary and secondary colors; Extreme uses near-black surfaces and saturated complementary colors. A twelve-step hue wheel with random shade/saturation variation visits every hue family, including red, orange and yellow, before repeating.

`--primary` and `--secondary` are vivid paint colors for CTAs, conceptual previews, shapes and 3D materials. `--on-primary` and `--on-secondary` choose black or white ink at runtime for filled-control readability. `--accent` is separately repaired for readable small text. This separation keeps a bright yellow fill from being turned into olive just to serve as text on a white page. Reading areas retain `--background`, `--surface`, `--text`, and `--muted`. Older five-color saved palettes migrate to the new paint roles.

The editor retains neutral fixed tokens and uses a transparent backdrop so desktop visitors can see the site change. SectionMotif SVGs provide inexpensive dimensional shapes; the hero WebGL scene inherits live primary/secondary colors. All other sections use SVG box motifs or BoxDiagram architecture illustrations; do not restore non-hero WebGL models. Preserve viewport, visibility and reduced-motion gating.

BoxDiagram replaces the former service and playground 3D models. It illustrates UI → API → Data; the playground lets visitors select a layer and change Flow / Layers / Grid layouts. Its boxes, controls and explanatory text are palette-aware, and its content remains available without WebGL.

On screens up to 700px, center the hero artwork in a maximum 420px column and use a 320–380px frame height with 20px vertical and 16px horizontal padding. The entire website assembly scale with the available canvas width (up to 1.34 scale from about 389px); keep labels inset and the fallback container the same height. Canvas resizing updates the sculpture without adding another render loop.

The monochrome preset migrates an exact saved copy of the former green Terminal / Vercel preset to the new values. Edited custom palettes retain their colors. Desktop/tablet frames include 16px padding while preserving their previous drawing-area heights.

The hero sculpture is an exploded miniature website: wireframe skeleton, browser UI, detached palette swatches, branching logic module, and cylindrical database records. Its layers gently converge and separate; primary, secondary, accent, surface, and text tokens repaint the assembly. Rotation rocks slowly to keep the website recognizable, with drag exploration retained. No remote models or fonts are required.

Dragging the hero separates the assembly along its local layout and depth planes; releasing smoothly rebuilds it with frame-rate-independent damping. Keep the expanded geometry inside the responsive frame.

The hero WebGL stage extends past its decorative grid frame (36px vertically and 24px horizontally on desktop, 28px/10px on mobile). The grid is an inset visual boundary, not a clipping container. Keep the surrounding hero gutter clear and prevent document overflow; preserve the larger stage when editing the assembly.

The current assembly renders at 75% of the responsive base scale, retaining the oversized canvas for disassembly clearance.

The assembly is a finished room-like shell with side walls, floor, ceiling, and backplane. Logic modules and the database shelf are children of their wall groups, so they remain mounted during disassembly. The skeleton uses clean perimeter rails and an orthogonal grid instead of triangulated wireframe faces.

Small INTERFACE, COLOR, LOGIC/JS, DATA, and API labels identify the miniature components. Labels use locally drawn canvas textures, repaint with the palette, and dispose their textures on replacement/unmount; no remote font files. The interface includes code markup, page content, cards, a CTA, and a pixel arrow pointer.

Labels are mounted contrast-safe nameplates with rounded backing and a fine keyline, rather than floating text. Major blocks use analytic three-segment rounded corners with geometry shared for matching dimensions; small traces remain sharp. The swatches share a tray and label tab, and wall edges have contrasting trim.

## Services cards

`components/services.tsx` replaces the earlier service list with four asymmetric cards: frontend interfaces, MVPs, backend/API connections, and AI integrations. Layout and spacing use Tailwind; shared conceptual preview geometry and coordinated hover motion live in `styles/services.css`. The cards have real contact links rather than pretending the whole panel is a button. Palette tokens repaint the previews; filled surfaces use their matching contrast ink. Hover tilts apply only on pointer devices, keyboard focus lifts the preview, and reduced motion removes transforms/transitions. Keep section reveals on the outer wrapper so hover motion does not fight them. No continuous animation, external imagery, or additional client animation runtime is needed. Preview artwork is decorative and explicitly labeled conceptual.

Typography controls include a preview, independent heading/body selectors, article text scale (90–125%), line spacing (1.50–2.20), and an independent reset. System font availability varies by device. The custom color editor expands one role at a time and supports opaque HEX/RGB/HSL plus a saturation/brightness canvas. Saturation and brightness have separate accessible range alternatives. Neutral controls, validation messages, and contrast warnings remain readable under custom themes. The selected illustrated avatar sits in the About terminal and blog byline; retain its KS fallback.

The art moodboard uses gently staggered collection cards, tape details, palette-colored frame shadows, a manual deal button, and clickable card backs with artist/date context. This is a visual detour beside the notebook, not a conventional wall gallery. Keep paintings in their original colors, mobile cards flat, and reduced-motion flips immediate. The owner removed trivia and cancelled the proposed game; do not reintroduce either during maintenance.

Mobile WebGL renders at a pixel ratio of 1; desktop is capped at 1.5. Preserve the complete model, label plates, soft corners, floating motion and drag-to-disassemble behavior. Do not replace mobile functionality with a required play button or remove animation to improve a lab score.
