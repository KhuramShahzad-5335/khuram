import type { Post } from "./blog";
export { wordCount, readingMinutes } from "./blog";
export type { Post, PostSection } from "./blog";
export const posts: Post[] = [
  {
    slug: "personal-seo-rank-your-name",
    title: "Personal SEO: How to Rank for Your Name on Google",
    excerpt:
      "A practical personal SEO guide covering name searches, portfolio SEO, profiles, indexing, and measurement—with Khuram Shahzad’s ongoing case study.",
    category: "SEO & PERSONAL BRANDING",
    date: "2026-10-13",
    image: "/images/blog-personal-seo.svg",
    imageAlt:
      "An original illustration connecting a personal identity card, portfolio, professional profiles, and a search result",
    intro:
      "When someone searches your name after a recommendation, they should be able to recognize the right person and find useful evidence of your work. I’m Khuram Shahzad, a self-employed software developer in Lahore. After improving my portfolio and professional profiles, I’m documenting the next step: making that identity easier to discover in search. This is a practical personal SEO guide and an ongoing case study, with implemented changes separated from results we have not measured yet.",
    sections: [
      {
        id: "what-is-personal-seo",
        title: "What is personal SEO?",
        paragraphs: [
          "Personal SEO is the work of making your professional identity discoverable and understandable in search. Someone might search your name after a recommendation, look for your portfolio before an interview, or combine your name with a service. Your website and genuine professional profiles should help that person confirm who you are, what you do, and where to see your work.",
          "Personal branding SEO connects that identity with useful evidence. A polished banner can introduce you; a project explanation can demonstrate how you think. The goal is a coherent trail from a search to a trustworthy profile and then to something worth reading. This guide uses my own name, Khuram Shahzad, as a working example. It is not a claim that my portfolio already ranks first.",
          "For me, a useful outcome is a prospective client finding the correct developer, understanding my React and Next.js work, and reaching the right contact link. Page-one visibility would help, but a visitor recognizing the right person is the more practical success condition.",
        ],
      },
      {
        id: "keyword-research",
        title: "Personal SEO keyword research: start with intent",
        paragraphs: [
          "Build a small query map before changing copy. Identity searches include “Khuram Shahzad” and “Khuram Shahzad portfolio.” Disambiguation searches include “Khuram Shahzad developer” and “Khuram Shahzad Lahore.” Expertise searches could include a specific Next.js problem that an article genuinely explains. These are candidate queries for this case study, not verified search-volume figures.",
          "For a general personal SEO guide, relevant reader questions include how to rank your name on Google, how to get a personal website indexed, SEO for freelancers, personal branding SEO, portfolio website SEO, and how LinkedIn or GitHub fit into an online presence. Each question deserves a useful answer, rather than another repetition of the phrase “personal SEO.”",
          "Use your Search Console query data once impressions exist. Before then, record the questions clients and collaborators actually ask and examine the kinds of pages returned for those questions. Do not confuse a suggested keyword with demonstrated demand. An exact-name query and a broad query such as “Next.js developer” also have very different competition and visitor intent.",
        ],
      },
      {
        id: "common-name",
        title: "How to rank for your name when other people share it",
        paragraphs: [
          "A shared name creates an identification problem. Use the same professional name across your site and profiles, then add truthful context: your work, city, projects, and relevant background. In this case, “software developer in Lahore” distinguishes the portfolio more clearly than a page that introduces only “Khuram.” It does not require changing my actual name.",
          "Keep the homepage introduction readable. Our updated copy says: “I’m Khuram Shahzad, a self-employed software developer based in Lahore.” That sentence gives a human reader the context immediately. The portfolio then supplies work samples and contact options. Do not turn the introduction into a list of every technology you have ever installed.",
          "Check results for the exact name and for the name plus role or city. Treat those as separate observations. Do not describe success for “Khuram Shahzad developer” as proof of first place for “Khuram Shahzad.” A distinctive professional context is useful even while the broader name search remains competitive.",
        ],
      },
      {
        id: "on-page",
        title: "On-page SEO for a personal portfolio",
        paragraphs: [
          "Use a specific homepage title. We changed the source title from “Software Developer” to “Khuram Shahzad — Software Developer in Lahore.” The Next.js page uses an absolute title so the shared title template does not append the name again. Project and article pages keep their own descriptive titles. Google can still choose a different search-result title.",
          "A meta description should explain the actual page and invite the appropriate reader. Our updated description identifies Khuram Shahzad, self-employment, Lahore, and React, Next.js, and MERN work. Google may build a snippet from visible page content instead. Treat the description as a concise summary, not a place to hide a second resume.",
          "Keep the main heading, introduction, navigation, and section headings easy to scan. Our hero retains its existing design headline while the nearby introduction supplies the full identity. Open Graph and Twitter metadata carry the updated title for sharing previews; attractive social cards do not establish a ranking result.",
        ],
        links: [
          {
            title: "Google: descriptive title links",
            url: "https://developers.google.com/search/docs/appearance/title-link",
          },
          {
            title: "Google: search snippets and descriptions",
            url: "https://developers.google.com/search/docs/appearance/snippet",
          },
        ],
        code: "Homepage title: Khuram Shahzad — Software Developer in Lahore\nIdentity: Khuram Shahzad\nRole: Self-employed software developer\nLocation: Lahore\nEvidence: Project stories, published articles, professional profiles",
      },
      {
        id: "portfolio-content",
        title: "Build evidence with project stories and useful articles",
        paragraphs: [
          "A portfolio should explain more than a technology stack. For each project, describe the problem, your confirmed contribution, constraints, decisions, and what a visitor can inspect. If a preview is an illustration, label it. If a case study still needs detail verified, keep that limitation visible. Trust disappears quickly when a polished page makes claims it cannot support.",
          "Our project stories and notebook are separate routes, which lets a reader land on a relevant piece directly. The notebook can explain a design decision, a static publishing workflow, or a practical implementation tradeoff. This personal SEO article adds an ongoing example of improving the site itself. Its value will increase when actual indexing and query observations are recorded.",
          "For freelancers and job seekers, choose topics that intersect with the work you want to discuss. Explain how you approached a specific problem and include enough context for someone else to learn. Publishing dozens of generic introductions is less useful to a potential collaborator than a few careful explanations with real examples.",
        ],
        links: [
          {
            title: "Explore my project stories",
            url: "/projects/",
          },
          {
            title: "Read about this site’s static blog architecture",
            url: "/blog/a-blog-without-a-backend/",
          },
        ],
      },
      {
        id: "indexing",
        title: "How to get your personal website indexed on Google",
        paragraphs: [
          "Add your site to Google Search Console and verify ownership. A Domain property uses DNS verification and covers protocol and subdomain variants; a URL-prefix property covers its specified prefix and supports other verification methods. Use the property that matches your access and reporting needs. Then inspect the actual homepage URL, rather than assuming account setup proves indexing.",
          "Submit the public sitemap in Search Console. This site generates https://www.khuramshahzad.dev/sitemap.xml from its public routes and published posts at build time. The sitemap was reachable during our baseline check. Adding this article creates its entry automatically after a new build. A working sitemap helps discovery; it does not force Google to index every URL.",
          "Use URL Inspection to examine an important page and request indexing when appropriate. Google documents that crawl requests have limits and do not guarantee inclusion; repeated requests do not make crawling happen faster. For a larger collection of pages, maintain the sitemap and useful navigation instead of treating every URL as an emergency.",
        ],
        links: [
          {
            title: "Search Console: property types and verification",
            url: "https://support.google.com/webmasters/answer/34592",
          },
          {
            title: "Google: request a recrawl",
            url: "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl",
          },
          {
            title: "Google: build and submit a sitemap",
            url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
          },
          {
            title: "Open this portfolio’s sitemap",
            url: "/sitemap.xml",
          },
        ],
        image: {
          src: "/images/personal-seo-flow.svg",
          alt: "Three distinct stages labeled discover, index, and evaluate, with a note that rankings are not guaranteed",
          caption:
            "Discovery, indexing, and ranking are separate stages. A sitemap is not a position-one button.",
        },
      },
      {
        id: "technical-seo",
        title: "Technical SEO: make the right pages accessible",
        paragraphs: [
          "Check the deployed page, not only your source code. A public article needs a successful response, readable content, a sensible canonical URL, and permission to be indexed. Look for an accidental noindex directive, password protection, broken assets, or a crawler-blocking rule. A preview deployment and the public website should not accidentally share the same indexing policy.",
          "Our Next.js portfolio exports HTML at build time. It uses the configured canonical origin for page metadata and discovery files. Missing site configuration and Vercel Preview builds deliberately produce non-indexable output. Changes to those variables require a rebuild. The old welcome article is a layout preview: it remains noindex and stays out of the sitemap.",
          "The article text is present in generated HTML, while the browser adds animations and interactions. Avoid making your biography or article body depend on a WebGL canvas or a click-to-load fetch. A playful interface can coexist with ordinary readable documents. That is why this guide is a page with headings and links, rather than a slideshow trapped inside an animation.",
        ],
        links: [
          {
            title: "Google: technical search eligibility",
            url: "https://developers.google.com/search/docs/essentials/technical",
          },
          {
            title: "Google: JavaScript SEO basics",
            url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
          },
        ],
      },
      {
        id: "social-profiles",
        title:
          "LinkedIn and GitHub SEO: connect the same professional identity",
        paragraphs: [
          "LinkedIn and GitHub provide different evidence. LinkedIn can explain employment, services, and professional context. GitHub can expose code, documentation, and project decisions. Use the same name and canonical website link where those platforms allow it. Keep each profile useful for its own audience rather than copying the entire homepage into every field.",
          "Our earlier LinkedIn work included experience details, self-employment, project entries, featured work, services, and visual presentation. We also worked on the GitHub profile introduction and portfolio link. Those are implementation steps from this project’s history. This article does not claim that every field was re-audited today, that Google has crawled the edits, or that those edits improved a measured position.",
          "For the next review, open the public profiles as a visitor, check the portfolio link, confirm that the role and location are consistent, and look for outdated project destinations. A repository README should explain what a project does and how to inspect it. A client-facing profile should make the relevant experience and contact path easy to understand.",
        ],
        links: [
          {
            title: "Khuram Shahzad on LinkedIn",
            url: "https://www.linkedin.com/in/khuram-shahzad-0814b1230/",
          },
          {
            title: "Khuram Shahzad on GitHub",
            url: "https://github.com/KhuramShahzad-5335",
          },
        ],
      },
      {
        id: "structured-data",
        title: "Person schema, profile pages, and knowledge panels",
        paragraphs: [
          "Structured data is a machine-readable description of information that the page actually supports. Our homepage includes Person and WebSite data with my name, website, job title, and professional profile links. Articles include BlogPosting data with an author, date, title, image, and word count. The generated markup supports the visible identity; it does not replace a useful biography.",
          "Google also documents ProfilePage markup for qualifying pages focused on a person or organization. A developer implementing it should check the current requirements and the actual page’s purpose instead of adding every schema type that sounds impressive. Validate the markup and keep it consistent with visible facts.",
          "Adding Person data does not purchase a knowledge panel or promise a rich result. Do not insert awards, review ratings, follower counts, or credentials that cannot be confirmed. In this case study, schema presence is something we can check in the exported HTML. Whether Google displays a particular search feature is a separate observation we have not established.",
        ],
        links: [
          {
            title: "Google: ProfilePage structured data",
            url: "https://developers.google.com/search/docs/appearance/structured-data/profile-page",
          },
        ],
      },
      {
        id: "off-page",
        title: "Off-page SEO and personal branding without spam",
        paragraphs: [
          "Off-page work means helping relevant people discover and reference your work. Start with genuine profiles and relationships. Link the canonical portfolio from your professional pages, share a useful article where the community welcomes it, and contribute explanations or code that others can actually use. Context matters more than collecting an arbitrary number of links.",
          "For this portfolio, a sensible example would be sharing a project write-up alongside the repository it explains. A collaborator could reference a case study when discussing the same work, with permission where client material is involved. These are possible next steps, not backlinks this article claims we have already earned.",
          "Avoid purchased ranking links, automated link drops, excessive reciprocal arrangements, and low-quality directory campaigns. Google’s link-spam policy addresses manipulative link building. Paid advertisements and sponsorships require appropriate link qualification. Repeatedly searching your own name or asking friends to manufacture clicks is also not a reliable measurement strategy.",
        ],
        links: [
          {
            title: "Google: link spam policy",
            url: "https://developers.google.com/search/docs/essentials/spam-policies#link-spam",
          },
        ],
      },
      {
        id: "performance",
        title: "Performance and design still matter to visitors",
        paragraphs: [
          "Personal SEO cannot rescue a portfolio that is unpleasant to read. Check the mobile page, image weight, keyboard navigation, contrast, and layout stability. Let a visitor open a project without fighting the interface. Our hero sculpture is decorative; the identity and project links remain ordinary HTML.",
          "This site intentionally runs an intro on reload. That creates a visible-content delay, so we should measure its cost honestly instead of advertising perfect loading scores. The 3D scene is deferred and visibility-gated, with a reduced-motion alternative. Those decisions reduce unnecessary work, but we still need production measurements.",
          "Google describes page experience as part of its broader systems, not a single score that guarantees top rankings. Use field Core Web Vitals when sufficient data exists and lab tools to investigate problems. Record whether an audit used normal animations or reduced motion; they are different experiences.",
        ],
        links: [
          {
            title: "Google: understanding page experience",
            url: "https://developers.google.com/search/docs/appearance/page-experience",
          },
          {
            title: "Related: motion that knows when to stop",
            url: "/blog/motion-that-knows-when-to-stop/",
          },
        ],
      },
      {
        id: "measure-results",
        title: "Measure personal SEO with Search Console",
        paragraphs: [
          "Use the Search results Performance report to examine impressions, clicks, click-through rate, and average position. Filter queries containing your name and compare relevant periods when enough data exists. Keep the page, country, device, and query context in view. Average position is an aggregate metric, not proof that everyone sees your page in that exact slot.",
          "For this case study, track the exact name separately from “Khuram Shahzad developer,” “Khuram Shahzad Lahore,” and portfolio-related variants. Record the date, query filter, page, reporting window, impressions, clicks, and position. A rise in impressions without clicks suggests a different question from a page with no impressions at all.",
          "Keep indexing observations separate from performance observations. “URL is on Google” and “our name query produced clicks” answer different questions. A manual search is useful as a contextual observation, but the results can vary; write down the conditions. Do not substitute one screenshot for a trend or call an unmeasured change a success.",
        ],
        links: [
          {
            title: "Search Console: Performance report",
            url: "https://support.google.com/webmasters/answer/7576553",
          },
        ],
      },
      {
        id: "case-study-log",
        title: "Case study: Khuram Shahzad’s personal SEO progress log",
        paragraphs: [
          "Baseline — 13 October 2026: the public homepage, blog index, and a sample article returned HTTP 200 with readable HTML, canonical links, descriptions, and social metadata. The live sitemap contained 24 URLs before this article. The homepage’s search title was still the generic “Software Developer.” The welcome preview was correctly marked noindex. These were public HTTP observations, not an account-level indexing report.",
          "Implemented in the source — 13 October 2026: the homepage now declares “Khuram Shahzad — Software Developer in Lahore,” uses that identity in its sharing title, and introduces me by full name, self-employment, and city. The description was updated too. This article adds an original guide, source links, diagrams, and a persistent place to record progress. Its addition brings the generated sitemap to 25 public URLs.",
          "Archive improvement — 13 October 2026: the homepage now previews three recent articles, and the notebook generates paginated archive routes with canonical links and sitemap entries. Search and category filters load a summary-only index on demand. With the current four articles, the new second archive page brings the generated sitemap to 26 URLs. This improves the browsing and discovery structure; it does not establish a measured ranking improvement.",
          "Pending verification: deployment of the latest changes, Google’s processed sitemap status, homepage and article indexing, name-query impressions and clicks, and any ranking change. We have not recorded a verified before-and-after position, traffic gain, backlink count, or knowledge panel. The honest baseline is “not measured,” not zero.",
          "Update this section when there is new evidence. Add a dated observation with its source and reporting period, distinguish deployment from Google processing, and explain what changed. Preserve earlier entries so readers can follow the experiment. Revise updatedAt only for a meaningful article change; do not rewrite history or refresh the date to imply progress.",
        ],
        image: {
          src: "/images/personal-seo-tracker.svg",
          alt: "Four progress stages labeled baseline, implement, measure, and revise, with measurement shown as pending",
          caption:
            "An ongoing case study: record evidence at each step, including what is still unknown.",
        },
      },
      {
        id: "action-plan",
        title: "A practical personal SEO checklist",
        paragraphs: [
          "First, define your professional identity and a small set of candidate name queries. Audit the public homepage and your main profiles for consistency. Fix unclear copy, broken destinations, and missing metadata. Publish a clear portfolio with an accessible contact path, then verify the production URL and submit its sitemap.",
          "Next, improve the evidence. Expand one project story with confirmed details and publish one article answering a real question from your work. Link them where relevant. Review your profile links and source code documentation. Focus on completing useful pages rather than creating more empty sections.",
          "Finally, establish a reporting habit that matches the available data. Review indexing reasons and name-query trends, record meaningful changes in the progress log, and choose the next improvement from what you observe. If the site is not indexed, investigate that first. If it is indexed but the result is unclear, inspect identity and snippet presentation. If readers arrive but cannot find your work, improve the page itself.",
        ],
      },
      {
        id: "personal-seo-faq",
        title: "Personal SEO FAQ",
        paragraphs: [
          "Can I guarantee page one for my name? No. You can make your identity clearer and improve eligibility and discovery, but a ranking promise would go beyond the evidence. A shared name, existing competing pages, and search context all make a fixed position an unsuitable guarantee.",
          "How long does personal SEO take? There is no reliable fixed deadline for this case study. Publishing, crawling, indexing, and ranking are separate events. Record when each actually happens rather than promising a particular number of days.",
          "Do I need a personal website if I have LinkedIn? A website gives you a place to organize your own project evidence and articles, while LinkedIn serves its professional network. They can complement one another. Maintaining two useful destinations is better than abandoning one to create another empty profile.",
          "Should I put every keyword on the homepage? No. Use identity and relevant role information naturally. Let project pages and articles explain their own subjects. Keyword stuffing can make a page harder to trust and conflicts with Google’s spam guidance.",
          "Does a sitemap guarantee indexing, or does schema guarantee a knowledge panel? Neither. A sitemap supports discovery, and structured data describes facts in a recognized format. Check the actual indexing and search-feature outcomes separately.",
          "What should I track next? For my portfolio, the next useful evidence is a deployed title check, processed sitemap status, homepage/article URL Inspection results, and the first available Search Console name-query reporting window. That will make the next update to this guide a measured observation rather than an SEO victory lap.",
        ],
      },
    ],
    sources: [
      {
        title: "Google Search Central: SEO Starter Guide",
        url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide",
      },
    ],
  },
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
