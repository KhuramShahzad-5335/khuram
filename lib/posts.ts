import type { Post } from "./blog";
export { wordCount, readingMinutes } from "./blog";
export type { Post, PostSection } from "./blog";
export const posts: Post[] = [
  {
    slug: "motion-that-knows-when-to-stop",
    title: "Motion that knows when to stop",
    excerpt:
      "A useful animation explains something. A great one also knows when to get out of the way.",
    category: "INTERFACE DESIGN",
    date: "2026-10-10",
    image: "/images/blog-motion.svg",
    imageAlt:
      "An illustrated motion path connecting interface states on a dark grid",
    intro:
      "Motion gives an interface personality, but personality needs a little self-control. A button can feel responsive without bouncing across the room. A page transition can suggest continuity without making someone wait for the next paragraph. The question is less about how much animation a website can contain and more about what each movement helps a visitor understand.",
    sections: [
      {
        id: "give-it-a-job",
        title: "Give every movement a job",
        paragraphs: [
          `Start with a purpose. A short transition can connect an item to an expanded panel, make a state change easier to notice, or confirm that an action happened. Those are useful jobs because they reduce the amount of interpretation a visitor has to do. When a movement exists only because a library made it easy, it deserves a second look.`,
          `Imagine a project card that lifts slightly on hover. The response reinforces that the card is interactive. Now imagine every word, icon, and border moving independently. There is more activity, but less clarity. The first interaction makes the action understandable; the second asks the visitor to manage a collection of distractions.`,
          `A practical review question is simple: if this effect disappeared, what information would be harder to understand? If the answer is nothing, it might still be a pleasant detail, but it should be small enough to remain a detail.`,
        ],
      },
      {
        id: "keep-the-path-clear",
        title: "Keep the path through the page clear",
        paragraphs: [
          `The main content should not depend on completing an animation. People arrive through direct links, move with a keyboard, resize the window, and sometimes return to a page halfway down. A design that only works after a carefully choreographed entrance is fragile. Build the ordinary page first, then layer movement onto that structure.`,
          `Navigation should behave like navigation. A link should have a real destination, the browser back button should work, and opening a project in a new tab should be unremarkable. That ordinary behavior is valuable. It gives visitors room to explore at their own pace while visual transitions add continuity around the edges.`,
        ],
        image: {
          src: "/images/motion-flow.svg",
          alt: "An action leads to feedback and then readable content",
          caption: "Action, clear feedback, then room to continue.",
        },
      },
      {
        id: "make-rest-possible",
        title: "Make a quieter version possible",
        paragraphs: [
          `Some visitors prefer less motion. A reduced-motion version should still feel complete, with the same content, useful feedback, and clear controls. The alternative can be a static illustration, an immediate state change, or a restrained transition that avoids large movement. It is a different presentation of the same experience.`,
          `A rotating 3D object can become a static geometric mark without making the introduction confusing. A long scroll reveal can become visible content from the beginning. The point is to preserve the meaning while changing the way it is expressed.`,
        ],
        code: "@media (prefers-reduced-motion: reduce) {\n  .decorative-object { animation: none; }\n  html { scroll-behavior: auto; }\n}",
      },
      {
        id: "test-the-uncomfortable-path",
        title: "Test the uncomfortable paths too",
        paragraphs: [
          `Review the page on a smaller screen and a slower device. Try moving quickly through sections, tabbing between controls, and changing a preference while an effect is running. These checks reveal things that an ideal desktop demonstration can hide: delayed input, sudden layout movement, or a button that is difficult to reach.`,
          `Pay attention to reading as well as clicking. Continuous motion next to a long article can become tiring even if the effect is beautiful on its own. Let the surrounding interface settle while the visitor reads. The article is the important thing in that moment.`,
          `The nicest interaction often leaves a quiet impression. Something responded, a change made sense, and the visitor continued without needing to think about the animation. A little personality is welcome. So is knowing when the interface has said enough.`,
        ],
      },
    ],
    sources: [
      {
        title: "MDN on reduced-motion preferences",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion",
      },
    ],
  },
  {
    slug: "a-blog-without-a-backend",
    title: "A blog without a backend",
    excerpt:
      "Files, a build, and a place to read. A personal notebook can start with a surprisingly small architecture.",
    category: "WEB DEVELOPMENT",
    date: "2026-10-10",
    image: "/images/blog-static.svg",
    imageAlt:
      "An illustrated pipeline carrying a text document through a build into a web page",
    intro:
      "A personal blog does not automatically need a database, an admin dashboard, and a collection of services. If the main task is publishing writing for people to read, a file-based site can be a comfortable starting point. The interesting part is deciding what needs to happen when an article is written and what needs to happen when somebody opens it.",
    sections: [
      {
        id: "separate-writing-from-reading",
        title: "Separate writing from reading",
        paragraphs: [
          `Writing is an occasional activity. Reading can happen many times, from many places, at any hour. Treating those as separate workflows makes the architecture easier to reason about. The author changes a local content file, the build generates a page, and the visitor receives the finished result. There is no need to ask a custom database for the same article on every visit.`,
          `The authoring format can be plain Markdown, MDX with components, or structured local content. The choice depends on how much control the writing needs. A short essay may only need headings and paragraphs. A technical walkthrough may benefit from code blocks, figures, and reusable presentation components. Start with a format that feels comfortable to maintain.`,
        ],
      },
      {
        id: "small-publishing-loop",
        title: "Keep the publishing loop small",
        paragraphs: [
          `A useful workflow has a few clear stages: write, preview, review, and publish through a new build. The preview matters because a content file can look perfectly sensible while producing a cramped mobile page. Check the heading hierarchy, paragraph rhythm, image captions, and any code that needs horizontal scrolling. Writing is part of the interface.`,
          `A static export in Next.js generates HTML and associated assets during the build. Routes for articles need to be known at that time. This suits a notebook whose posts live with the project source. Adding a new post means updating that source and rebuilding; it does not mean maintaining a runtime publishing service.`,
        ],
        image: {
          src: "/images/static-flow.svg",
          alt: "Four connected stages labeled write, preview, build, and read",
          caption: "A deliberately small publishing loop.",
        },
      },
      {
        id: "design-the-reading-page",
        title: "Spend the effort on the reading page",
        paragraphs: [
          `The reading experience deserves more attention than a complicated dashboard. Give the text a comfortable width. Make section headings useful enough to scan. Include images because they explain or support an idea, with descriptive alternative text and captions that tell the reader what to notice. A decorative cover is fine too, as long as it does not pretend to be evidence.`,
          `Word counts and estimated reading time can help set expectations. Keep the estimate simple and acknowledge what it is: an estimate. A reader studying a code example may take longer than someone skimming a short reflection. The numbers should guide a decision, not imply that everyone reads at the same speed.`,
          `For technical posts, code should be readable on narrow screens. It can scroll within its own block rather than making the whole page wider. A table of contents can offer direct links to longer sections. These are modest features, but they make the notebook much easier to use.`,
        ],
      },
      {
        id: "add-features-on-purpose",
        title: "Add features when the writing needs them",
        paragraphs: [
          `Tags and categories can come from post metadata. Search can use a small index shipped to the browser. A feed can be generated alongside the pages. These ideas do not automatically require a custom backend; the content already exists during the build. The tradeoff is that updates become visible after another deployment.`,
          `Comments, subscriptions, and a private editing dashboard are different requirements. They introduce user input, storage, access control, or an external service. Those can be useful, but they should be added because the publishing workflow needs them. A notebook does not become more personal just because its architecture becomes more complicated.`,
          `The small version leaves room to learn what the blog actually wants to become. Publish a few useful pieces, notice what is difficult to maintain, and improve that part. The first milestone is a page worth reading. The dashboard can wait until it has a real job.`,
        ],
      },
    ],
    sources: [
      {
        title: "Next.js static export guide",
        url: "https://nextjs.org/docs/app/guides/static-exports",
      },
    ],
  },
  {
    slug: "color-tokens-not-color-chaos",
    title: "Color tokens, not color chaos",
    excerpt:
      "How a visitor-controlled palette can feel playful without turning the interface into a readability experiment.",
    category: "DESIGN SYSTEMS",
    date: "2026-10-10",
    image: "/images/blog-colors.svg",
    imageAlt:
      "Five coordinated palette swatches connected to a small interface illustration",
    intro:
      "A palette editor is a fun invitation: make this little part of the internet feel like yours. It also asks a design system a serious question. If the background changes, do the cards, text, buttons, focus indicators, and illustrations still belong together? A collection of color pickers is easy. A coherent theme is the more interesting problem.",
    sections: [
      {
        id: "name-the-role",
        title: "Name the role, not the paint",
        paragraphs: [
          `A theme becomes easier to maintain when colors describe roles. Background, surface, text, muted text, and accent communicate why a value exists. A name such as brightGreen explains the color itself, but says little about where it belongs. If the visitor chooses blue tomorrow, that name starts telling the wrong story.`,
          `Use a small set of shared values across the interface. A card can use the surface color, its paragraph can use muted text, and an action can use the accent. The relationship stays understandable when the palette changes. Adding a new component becomes a question about its role rather than a search for another hex code.`,
          `CSS custom properties provide a way to define values once and reference them throughout a document. In a theme editor, updating those properties allows the components that reference them to follow the selected palette.`,
        ],
        code: ":root {\n  --background: #0a0a0a;\n  --surface: #151515;\n  --text: #f5f5f5;\n  --accent: #93c5fd;\n}\n\n.card { background: var(--surface); }",
      },
      {
        id: "preview-before-applying",
        title: "Let the visitor see the idea first",
        paragraphs: [
          `Preset names are helpful, but swatches make the relationship visible. A small palette preview can show the background, surface, text, and accent together. Visitors can compare several options before applying one, rather than clicking a name and hoping it describes the color combination they imagined.`,
          `Random generation benefits from boundaries. Pick a shared hue family for the foundation, keep the background and surface related, and reserve a stronger color for the accent. For a dark palette, light text gives the composition a stable starting point. For a light palette, use darker text and a deeper accent. Variation works better when the system has a little structure.`,
        ],
        image: {
          src: "/images/color-flow.svg",
          alt: "Semantic color roles connect to text, a surface, and an action button",
          caption:
            "A palette is a set of relationships, not five unrelated colors.",
        },
      },
      {
        id: "protect-the-reading",
        title: "Keep reading in the conversation",
        paragraphs: [
          `Custom colors can accidentally make text difficult to read. Contrast feedback helps visitors see that consequence without removing their ability to choose. Generated presets can be designed to start with strong contrast, while manual editing remains flexible. The interface should explain the issue in plain language and offer a useful way back.`,
          `Consider more than the main paragraph. Secondary labels, borders, selected states, links, and focus indicators all participate in the theme. A palette that looks wonderful in a large heading may struggle in a small caption. Try it on the actual components instead of judging it only from large blocks of color.`,
          `Images deserve a separate decision. Real project screenshots should remain faithful to the project. Decorative interface motifs and 3D accents can follow the visitor palette where that makes sense. A global recoloring effect should not quietly change the evidence presented in a case study.`,
        ],
      },
      {
        id: "small-personal-space",
        title: "Give the choice a small home",
        paragraphs: [
          `A browser-local preference is often enough for this kind of customization. Save the selected values on the device and restore them on a return visit. Make reset easy to find. This gives visitors a small sense of continuity without requiring an account or storing a profile on a server.`,
          `The editor should work with a keyboard and on a phone. Its own controls need a readable presentation even when the rest of the page receives an unusual palette. A dialog with a stable neutral surface can make experimentation less risky, because the visitor always has a clear place to recover.`,
          `The best result feels like the same website wearing a different jacket. Its structure, voice, and usefulness remain recognizable. The colors change, the interface still works, and a visitor gets to feel a little more at home. That is a good use of a playful feature.`,
        ],
      },
    ],
    sources: [
      {
        title: "MDN on CSS custom properties",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
      },
    ],
  },
];
