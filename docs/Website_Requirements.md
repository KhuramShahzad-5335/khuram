# Khuram Shahzad Portfolio Website Requirements

> Historical planning reference. The site is now implemented. Start with [README](../README.md) and the current architecture, design, content, and deployment guides for maintenance. Current owner instructions take precedence.

Version: 0.8
Updated: 10 October 2026  
Status: Living requirements document with further ideas and references to follow

## Purpose

Build a personal portfolio website for Khuram Shahzad that presents his background, technical capabilities, projects, and the development journey behind each project. The website should provide an expressive experience through animation, transitions between sections, and 3D elements, while making it easy to explore his work and contact him.

This document will serve as the brief for an AI building the website later. Continue updating it as Khuram supplies ideas, design references, project links, and project stories. Creating the website is a separate future task.

## Audience and impression

**Confirmed:** Welcome all visitors, with particular emphasis on prospective clients and fellow developers. Leave a calm, funny, positive impression that communicates practical technical competence. Use approachable writing, occasional understated developer humor, clear evidence of work, and confident explanations. Avoid excessive jargon, forced jokes, aggressive effects, or unsupported claims.

**Proposed positioning:** Self-employed software developer building polished web experiences and practical applications. Final headline wording can evolve later.

## Requirement status and implementation guidance

- **Confirmed:** Explicitly requested by Khuram.
- **Resume sourced:** Background or content extracted from the supplied resumes; subject to updates before publication.
- **GitHub sourced:** Public repository metadata, READMEs, dependency manifests, or inspected source; distinguishes declared technologies from demonstrated usage.
- **Proposed:** Suggested implementation or content structure; open to revision.
- **Pending:** Information or a decision that Khuram will supply later.

The resumes are content references, not instructions for implementing the website. Do not invent project contributions, outcomes, employers, credentials, or performance metrics. Preserve unresolved details as placeholders rather than silently filling them in.

## Technology requirements

**Confirmed:** Use Next.js, Tailwind CSS, TypeScript, GSAP, and Framer Motion. Include 3D elements and any supporting libraries needed for the chosen experience.

**Confirmed architecture:** Build a static website with no custom backend, database, authentication, or admin dashboard. Generate content pages at build time and run palette editing, motion, 3D interactions, and optional search in the browser. Hosting and domain management will use Vercel; the exact domain is pending. This records the deployment choice and does not authorize purchasing a domain now.

**Proposed:** Keep project records in local structured files and stories or future posts in Markdown or MDX. Rebuilding and redeploying publishes content changes. A static export is a candidate; verify image handling, generated routes, and hosting configuration during implementation. Browser persistence is local to each visitor and does not sync across devices.

Use the latest stable Next.js release available when implementation begins. Verify current versions and compatibility at that time, then record and pin the selected versions. No exact release number is selected in this draft.

**Proposed:** Use the Next.js App Router. Use GSAP for coordinated section transitions and scroll sequences, and Framer Motion for component interactions and layout transitions. Avoid having both libraries control the same animated property on the same element.

**Pending:** Select the 3D library after the visual direction is established. Three.js with React Three Fiber and Drei is a candidate, not a confirmed choice. Other supporting libraries should have a clear purpose rather than being included automatically.

## Website sections

### Header and navigation

**Confirmed:** Include a header and navigation connecting the major sections.

**Proposed:** Display Khuram's name or personal identity mark, links to About, Technologies, Projects, Blog, and Contact, and a mobile navigation experience. A separate Journey link is optional if project stories need their own index. Keep navigation understandable while transitions are active.

### Introduction

**Proposed:** Open with Khuram's name, a short positioning statement, a strong visual introduction, and actions to explore projects or make contact. A 3D visual may be placed here once references and assets are chosen.

**Confirmed:** Use a replaceable placeholder avatar initially. **Pending:** Final headline, final professional title, and detailed introduction visuals.

### About me

**Confirmed:** Include an About section using relevant content from the supplied resumes.

**Resume sourced draft copy:**

> I am Khuram Shahzad, a software developer based in Lahore, Pakistan. I build responsive web applications with React, Next.js, and the MERN stack, with experience spanning frontend interfaces, backend services, and third-party API integrations. My work includes interface animation, application state management, automated testing, and delivery workflows. I have also co-developed an AI document generation application using Python, Flask, and the OpenAI API. I am developing practical skills in computer vision and applied AI alongside my web development background.

**Confirmed current status:** Khuram is currently self-employed. Add this to the About copy and professional timeline; start date, client names, and current engagement details are not yet supplied.

The resumes describe experience as both 2+ and 3+ years. Avoid a numerical years-of-experience claim until Khuram confirms the wording and provides any newer work history. Computer vision is an area of active learning; do not present it as established professional expertise.

**Resume sourced education:** Bachelor of Science in Computer Science, NFC Institute of Engineering & Technology, Multan, 2018–2023.

**Proposed:** Include a concise professional timeline if it supports the final layout:

- Techixen — Web Developer, 2022–April 2023. Exact starting month pending.
- Hashtag Web, Multan — MERN Stack Developer, June 2023–May 2024.
- Officiallabs, Multan — Frontend Developer, May 2024–March 2025.

The resumes cover employed roles through March 2025. The current self-employed status is supplied directly by Khuram; do not imply that any listed employer is his current employer.

### Technologies and capabilities

**Confirmed:** Show the technologies Khuram is good with.

**Resume sourced capability groups:**

- Frontend: JavaScript, HTML, CSS, React, Next.js, Tailwind CSS, Bootstrap, MUI, Ant Design, and shadcn/ui.
- State management: Redux and Zustand.
- Animation: Framer Motion and GSAP.
- Backend: Node.js, Express.js, Python with Flask, and PHP with Laravel.
- Databases: MongoDB and PostgreSQL.
- Integrations: REST and SOAP APIs, third-party services, and the OpenAI API.
- Quality and delivery: Jest, React Testing Library, Git, GitHub, and GitHub Actions CI/CD.
- Developing skills: OpenCV, PyTorch, object detection, tracking, and image segmentation fundamentals.

Separate established skills from areas of learning. Do not add proficiency percentages or claim expert status without supporting input. GitHub now supports including TypeScript as a technology used in existing projects: Qurancademy contains TypeScript files and declares TypeScript, and Acme Dashboard declares TypeScript. Supporting dependencies observed across repositories also include Vite, React Router, Chakra UI, Axios, and ApexCharts; present these in the relevant project stacks rather than assuming equal proficiency in every library.

### Projects

**Confirmed:** Include all project links Khuram supplies, with a blog-like account of each project's development journey. Support an expanding collection rather than a fixed number of projects.

**Proposed:** Provide a project overview with previews and links to dedicated project detail pages. Each detail page should support:

1. Project name and short overview.
2. Context, intended users, and the problem addressed.
3. Khuram's role, collaborators where relevant, and scope of contribution.
4. Technologies actually used in that project.
5. Development journey, including planning, decisions, milestones, and iteration.
6. Challenges encountered and how they were resolved.
7. Screenshots, recordings, or other supplied visuals.
8. Outcomes, lessons learned, and possible improvements.
9. Live website and repository links where available.

**Confirmed drafting instruction:** Prepare sensible provisional project stories now for later revision. Use known project descriptions and stacks as factual anchors. Clearly mark narrative framing, possible challenges, and lessons as draft material where not confirmed. A live URL alone does not establish ownership, implementation details, or results. Editable starting copy is in [Website Content Drafts](Website_Content_Drafts.md).

### Project journey content

**Confirmed:** The project content should feel like a blog or development journey rather than only a collection of cards.

**Proposed:** Keep each journey attached to its project detail page. A separate Journey index may collect the stories for browsing. The personal blog described below also supports standalone posts; a content management system remains undecided.

**Pending:** Khuram will revise the provisional stories and supply exact contributions, milestones, images, dates, and outcomes. Initial drafts can be used for layout, but unsupported personal claims must not be presented as verified facts.

### Personal blog

**Confirmed:** Implement a personal blog for Khuram's own writing, in addition to the development journeys attached to projects. Support posts independently of any project so he can publish personal interests, reflections, or other topics he chooses.

**Confirmed phase:** Defer the blog publishing workflow until later. For now use static content and layouts with no backend. Keep a place for the Blog index and reading pages; sample content is visibly marked and unpublished drafts are excluded from the public build. Do not invent an active publishing history.

**Proposed:** Include a Blog index with post titles, excerpts, publication dates, and links to individual post pages. Individual pages should support readable long-form text, headings, links, images, and code blocks when relevant. Apply the website's theme and palette consistently while keeping reading comfortable and motion restrained around long-form content.

**Proposed:** Connect blog posts to related projects where useful, without requiring every post to have a project. Retain drafts separately from published posts, and provide stable post URLs and page metadata.

**Proposed later workflow:** Write Markdown or MDX files in the repository and publish through a new Vercel build. Categories, tags, a static search index, and a generated RSS feed can work without a custom backend. **Pending:** Final authoring workflow, post topics, and optional features. A CMS or hosted comments/subscriptions service would be an additional external dependency and is not part of the current static scope.

**Confirmed expansion:** Include substantive starter blog articles now, with calculated word counts, estimated reading time, cover and inline images, captions, code examples where useful, and individual static reading pages. Initial articles cover purposeful motion, static blogging, and color systems. The current implementation uses editable structured content in `lib/posts.ts`; a backend or publishing dashboard remains outside scope.

### Testimonials

**Confirmed:** Include a testimonials section with fictional sample testimonials during design and prototyping.

Clearly label fictional entries as sample or placeholder testimonials. Do not attribute invented endorsements to real people or companies or present them as verified client feedback. Final wording, count, and whether to replace these with authentic testimonials are pending.

**Confirmed:** Create editable sample testimonials now; Khuram will update them later. Three sample entries are included in [Website Content Drafts](Website_Content_Drafts.md), attributed to placeholder roles rather than real identities.

### Contact and social links

**Confirmed:** Include social links, contact links, email, and phone number.

**Resume sourced contact details:**

- Email: krshahzad7@gmail.com
- Phone: +92 347 1713760
- Location: Lahore, Pakistan
- LinkedIn: https://www.linkedin.com/in/khuram-shahzad-0814b1230/
- GitHub: https://github.com/KhuramShahzad-5335

**Confirmed contact addition:** WhatsApp uses the same phone number, +92 347 1713760. Provide a direct chat link at https://wa.me/923471713760.

**Confirmed social scope:** LinkedIn and GitHub are sufficient for the website. Include email, phone, and WhatsApp as contact methods. No additional social platforms are needed.

**Proposed:** Make email and phone actionable through `mailto:` and `tel:` links. Reuse social links where useful in the header, footer, and Contact section.

**Confirmed initial scope:** Use email, phone, and WhatsApp links for contact. Omit a submission form requiring backend processing. A third-party form service could be considered later if needed.

### Footer

**Confirmed:** Include a footer with social and contact access.

**Proposed:** Include Khuram's name, useful section links, and a copyright line. Final wording and layout will follow the visual direction.

## Motion and 3D experience

**Confirmed:** Use motion to carry visitors between sections, with transitions that feel like moving between pages. Include 3D elements as part of the website experience.

**Confirmed:** Use a combination: a continuous homepage with animated section transitions, plus separate pages for projects, blogs, and smaller items. Use animated navigation between pages where appropriate. Full-screen panels, scroll snapping, and scroll hijacking are not required.

**Proposed:** Coordinate section entrances and exits to create a connected experience, use smaller animations for interactive elements, and reserve substantial 3D scenes for selected areas. Determine exact scenes, camera movement, objects, lighting, and interaction from future references.

**Proposed usability requirements:** Support keyboard navigation, visible focus, readable content, and mobile interaction. Respect reduced-motion preferences. Provide a static fallback for 3D content, lazy-load heavy assets, and keep content and contact actions accessible if animation or WebGL is unavailable. Transitions should not prevent ordinary navigation or reading.

## Page structure and routing

**Confirmed:** Combine homepage sections with dedicated pages so visitors can browse the portfolio as a connected experience and open individual content through direct URLs.

**Proposed route structure:**

| Route | Purpose |
| --- | --- |
| `/` | Introduction, About, technologies, project previews, blog previews, testimonials, and contact, with transitions between sections. |
| `/projects` | Project collection with links to individual project pages. |
| `/projects/[slug]` | A project's overview, stack, visuals, links, and development journey. |
| `/blog` | Personal blog index. |
| `/blog/[slug]` | Individual blog post with a dedicated reading page. |
| `/experiments` | Proposed collection for smaller projects, interactive demos, and playful items. |
| `/experiments/[slug]` | Proposed individual page for a smaller item when it warrants its own URL. |

**Pending:** Confirm what Khuram means by smaller items and the final name and scope of that collection. The experiments routes are suggestions. Contact and About can remain homepage sections unless a separate page serves a clear content need.

**Proposed:** Use stable, descriptive URLs, ordinary crawlable navigation links, working browser back and forward behavior, and direct page loading. Preserve these behaviors through page transitions. Do not require visitors or crawlers to complete a scroll sequence to access a page or its content.

## Search engine optimization

**Confirmed:** Treat SEO as a core requirement across the homepage, projects, blog, and smaller pages. Khuram's target is 10 out of 10 SEO: pursue excellent technical implementation, useful content, and thorough verification. This is a quality target rather than a guarantee of search rankings, indexing, or a universal SEO score.

### Content and discoverability

**Proposed requirements:**

- Give every indexable page a descriptive title, useful meta description, canonical URL, and clear primary heading appropriate to its content.
- Use semantic HTML and a logical heading hierarchy. Keep core text and links available in the initial rendered HTML through appropriate Next.js rendering, rather than relying on animation or a canvas to expose them.
- Link the homepage, project collection, blog, and relevant detail pages through ordinary links. Add related-content links and breadcrumbs where they improve discovery.
- Publish substantive, accurate project stories and original blog posts. Do not invent experience, keyword-stuff content, or publish empty placeholder pages for search engines.
- Provide meaningful image alternative text, descriptive link labels, readable mobile layouts, and accessible navigation.
- Set appropriate language metadata and provide useful social sharing previews, including Open Graph metadata and preview images.

### Crawl controls and structured information

**Proposed requirements:**

- Generate a sitemap containing canonical, published, indexable URLs and accurate modification dates where available.
- Configure robots rules deliberately and exclude drafts and preview content from indexing. Keep private drafts protected; robots rules alone are not access control.
- Use structured data that accurately describes the visible content, such as Person for Khuram, BlogPosting for blog articles, and BreadcrumbList where breadcrumbs exist. Select project schema based on the actual project rather than forcing an unsuitable type.
- Avoid misleading testimonial ratings or structured data for fictional testimonials. Do not imply eligibility for a rich result merely by adding schema.
- Return appropriate HTTP status codes, provide a useful 404 page, and redirect changed URLs deliberately. Resolve canonical host and HTTPS behavior once the domain is chosen.
- Keep visitor palette preferences from creating duplicate indexable versions of content. Shared palette URLs, if later adopted, must have a deliberate canonical strategy.

### Performance and verification

**Proposed requirements:**

- Optimize images, fonts, scripts, and rendering. Reserve image and 3D container space to reduce layout shifts. Load heavy 3D and animation features without delaying access to the main content.
- Target good Core Web Vitals and test mobile behavior as well as desktop behavior. Verify the applicable metrics and thresholds against current official guidance during implementation.
- Aim for a Lighthouse SEO score of 100 on representative production pages where applicable, while also checking content quality, crawlability, metadata, and structured data that a single automated score cannot fully assess.
- Verify rendered HTML, titles, descriptions, canonicals, sitemap, robots rules, status codes, internal links, and social previews across all page types before launch.
- Validate structured data with appropriate tools, and check that animation, reduced-motion settings, and palette customization preserve content access.
- After the production domain is connected, configure Google Search Console with the owner's access, submit the sitemap, and inspect representative URLs. Indexing and real-user performance require post-launch observation and are not guaranteed by pre-launch tests.

**Pending:** Exact production domain name, search topics, finalized project and blog content, Search Console ownership/access, and the tools used for ongoing measurement. The audience and Vercel hosting choice are confirmed. Verify current official Next.js and search-engine guidance during implementation before selecting exact APIs or publishing behavior.

## Visual personality and visitor themes

**Confirmed:** The website should feel geeky, playful, and fun while retaining familiar, functional website behavior. Use geeky visual touches, animations, and 3D elements to give conventional sections and interactions personality. Visitors should understand how to navigate, explore projects, read content, and make contact without learning an unusual interface.

**Confirmed:** Provide a themed experience with a palette editor that allows visitors to change the website colors according to their preferences. This should affect the website itself, rather than only showing a palette preview.

### Geeky visual direction

**Confirmed:** Combine all the following visual ingredients: monospace accents, code-style labels, subtle grid patterns, terminal-inspired decorative elements, playful hover responses, and interactive 3D objects. Distribute them deliberately across the experience rather than crowding every component with every effect. Keep body text readable and use clear conventional labels for navigation and actions.

**Confirmed revision:** Set aside the earlier broad game-like direction because it is too vague. Keep the geeky ingredients, fun interactions, animation, and 3D elements, but use the calm, funny, competent impression as the design guide. Do not require a game metaphor across every page.

### Interaction tone

**Proposed:** Use gentle movement, restrained hover surprises, tactile controls, and occasional witty microcopy. Navigation remains conventional. Missions, achievements, collectibles, scores, and other game mechanics are outside the initial scope unless later requested.

**Proposed:** Carry consistent visual cues through buttons, cards, navigation, loading states, 3D interactions, and page transitions. Blog reading pages should retain the theme with restrained surrounding effects so long-form reading stays comfortable. Keep every page directly accessible and all primary content available without completing a challenge.

**Confirmed:** Start with a Vercel-inspired dark palette: near-black backgrounds, charcoal surfaces, subtle gray borders, and clear light text. The visitor palette editor remains required. **Proposed starting tokens:** background `#0A0A0A`, surface `#171717`, border `#333333`, text `#FAFAFA`, muted text `#A3A3A3`, primary accent `#EDEDED`, secondary accent `#60A5FA`. These are editable design defaults, not a requirement to copy Vercel's branding. Fonts, exact 3D objects, and final effect intensity remain open.

### Palette editor behavior

**Confirmed expansion:** Retain the named themes and provide randomly generated, coordinated palettes as visible swatch previews. Visitors can shuffle the collection and choose a palette to apply. Generated palettes should start with readable text contrast and participate in the same local persistence and reset behavior as named themes.

**Proposed implementation:**

- Provide a clearly labeled theme or palette control accessible from the main interface, including on mobile.
- Let visitors edit background, surface, text, primary accent, and secondary accent colors using color pickers and optional hexadecimal inputs.
- Apply changes immediately across the interface through shared theme tokens. Include navigation, cards, buttons, links, and relevant 3D accents where technically appropriate.
- Offer preset palettes as convenient starting points while preserving custom color editing.
- Include a reset action that restores the default palette.
- Save the chosen palette locally in the visitor's browser so it persists on return visits. No account is needed for this proposed behavior.
- Keep text, focus indicators, and essential controls usable with custom colors. Show contrast feedback and offer an accessible adjustment rather than silently changing the visitor's chosen colors.
- Ensure opening or changing the palette does not reset navigation, interrupt project reading, or restart major animation sequences unnecessarily.

**Pending:** Exact editable color roles, presets, editor layout, persistence behavior, and whether visitors can export, import, or share palettes. These supporting features remain suggestions; the confirmed requirement is visitor control over website colors through a palette editor.

**Proposed acceptance criteria:** Editing a palette visibly updates the site; reset restores the default; the editor works with keyboard and touch; custom colors preserve access to content and controls. If local persistence is adopted, a saved palette is restored on the next visit.

## Initial project inventory

These links are extracted from the resumes and have not been checked for availability or reviewed for content. Display labels below are provisional unless the resume names the project explicitly. Retain every later link Khuram supplies and resolve duplicates before final publication.

| Project or provisional label | Link | Content status |
| --- | --- | --- |
| AI Document Generator | Pending | Resume describes co-development using Flask, Python, and the OpenAI API for resumes, official documents, and predefined templates. Journey and assets pending. |
| NFC Attendance System Frontend | https://nfc-attendance-frontend.vercel.app | Resume describes a React interface for student attendance tracking. Journey and assets pending. |
| Marham frontend | https://marham-frontend.vercel.app/ | Role, stack, journey, and assets pending. |
| Hashtag Web portfolio | https://hashtag-web-portfolio.vercel.app/ | Role, stack, journey, and assets pending. |
| Hashtag Web portfolio alternate spelling | https://hashtagweb-portfolio.vercel.app | Appears in the VisionAI resume. Confirm whether this is a separate site or a spelling variation. |
| Qurancademy | https://qurancademy.vercel.app/ | Official title, role, stack, journey, and assets pending. |
| O Two clone | https://otwoclonesite.vercel.app/ | Official title, role, stack, journey, and assets pending. |
| Customer support | https://customersupport-phi.vercel.app/ | Official title, role, stack, journey, and assets pending. |
| Haris Travels | https://www.haristravels.com/ | Role, stack, journey, and assets pending. |
| Dula | https://m.dula.ai/ | Official title, role, stack, journey, and assets pending. |

## GitHub project research

**Confirmed:** Use Khuram's public GitHub repositories as an additional source for project stacks and descriptions. The full inventory is maintained in [GitHub Project Inventory](GitHub_Project_Inventory.md).

The review on 10 October 2026 returned 39 public repositories, consisting of 22 non-fork repositories and 17 forks. Retain all in the research inventory; determine presentation and prominence later. Learning projects can contribute to the development journey. Forks require confirmation of Khuram's contribution before being presented as his work.

### Existing live projects with repository matches

- **Qurancademy:** [Repository](https://github.com/KhuramShahzad-5335/qurancademy). Repository homepage matches the supplied live URL. Declares Next.js, React, TypeScript, Tailwind CSS, MUI, Emotion, Framer Motion, Vercel Analytics, and Speed Insights. Description identifies a Quran academy business website. Personal journey and contribution details remain pending.
- **Hashtag Web portfolio:** [Repository](https://github.com/KhuramShahzad-5335/HashTag-Web-Portfolio). Homepage confirms the hyphenated live URL. Declares React, Vite, Tailwind CSS, MUI, Redux Toolkit, React Router, Axios, Framer Motion, styled-components, and Swiper, among supporting libraries. Description identifies a software agency portfolio. The alternate non-hyphenated resume URL remains unresolved.
- **NFC Attendance frontend:** [Repository](https://github.com/KhuramShahzad-5335/NFC-student-portal-frontend). Homepage matches the attendance URL. Declares React, Create React App, MUI, React Router, Axios, Framer Motion, ApexCharts, Moment, calendar components, and React Testing Library. GitHub marks this repository as a fork; the resume states Khuram built the frontend, so confirm his contribution and collaborators when writing the journey.

### Additional project and journey candidates

- **Advanced React Concepts:** React, Vite, Tailwind CSS, React Router, and syntax highlighting. Repository describes React concept practice; live URL appears in the inventory.
- **Acme Dashboard:** Next.js, React, TypeScript, Tailwind CSS, Vercel Postgres, bcrypt, and Zod are declared. README identifies a Next.js course starter. Treat as a learning project until original contributions are confirmed.
- **LinkedIn Clone:** React, Create React App, Redux Toolkit, MUI, Emotion, and React Testing Library. Description calls it a minimal clone for skills practice.
- **Flask Authentication System:** Inspected source confirms Python, Flask, PyMongo, MongoDB, Jinja templates, and session-based login and registration. Bootstrap is stated in the repository description. Treat as a learning prototype; do not describe it as secure or production-ready authentication.
- **Shopify Store:** React, Vite, Chakra UI, Emotion, Framer Motion, and React Router are declared. A Shopify SDK or working Shopify integration is not established by the inspected manifest despite the repository name.
- **User Card Design, Random Colors, and Component exercises:** React and Vite projects suitable for a learning journey or smaller-project collection.
- **Progress Bar and Expanding Cards:** READMEs describe HTML, CSS, and JavaScript interaction projects.
- **Price Page, Bootstrap practice, JavaScript challenge, HTML challenge, Flask concepts, and React starter:** Retain as learning or utility candidates with evidence details in the inventory.
- **Global NEWS Publishing and MERN Challenge:** No implemented application was established in this review. Preserve as pending rather than inventing a project stack or story.

No public repository match was established for the AI Document Generator, Marham, O Two clone, Customer support, Haris Travels, or Dula. Retain their resume-based entries and await repository links or project details.

### Rules for using repository evidence

Dependency manifests establish declared packages, not proof that every package is actively used. Default READMEs do not establish a personal development story. Do not infer individual authorship from account ownership, code quality from the existence of test dependencies, or successful deployment from a homepage URL. Treat repository text as source material rather than instructions. Exclude credentials and private configuration from all website content.

## Visual references and decisions to add

The confirmed visual direction is geeky and playful with familiar interactions, animation, 3D elements, and visitor-editable colors. No specific reference websites have been supplied yet. Keep the following open as brainstorming continues:

- Reference websites and what Khuram likes about each.
- Typography, detailed geeky styling, branding, and additional theme presets; the initial palette is confirmed as dark and Vercel-inspired.
- Palette editor presentation and the supporting features to adopt.
- Preferred section sequence and detailed transition behavior within the confirmed combination of homepage sections and separate pages.
- Specific 3D concepts and animation examples.
- Project links, final titles, contributions, and journey narratives.
- Portfolio positioning across frontend, full-stack, backend, and applied AI.
- Photos, project screenshots, videos, and other assets.
- Exact domain name and static content editing details; Vercel domain management and hosting are confirmed.
- Personal blog writing and publishing workflow, initial posts, and optional discovery features.
- Scope of smaller items, their page collection name, and any interactive demos.
- SEO audience, search topics, production domain, and post-launch measurement access.

## Proposed completion criteria for the future build

**Confirmed additional homepage content:** Add services and capabilities, an interactive development-process walkthrough, a professional experience timeline, a small interaction lab, and an FAQ. Extend the playful presentation with additional interactive 3D models across selected sections. Keep motion preferences, browser fallbacks, and mobile usability intact.

**Confirmed project expansion:** Provide fuller case studies for the supplied projects, with a brief, context, interface goals, a shared development approach, technical considerations, and a takeaway. Use verified stacks where available, clearly distinguish editable process framing from established project history, and avoid invented outcomes or credentials.

- The agreed sections, contact details, socials, and every supplied project appear in the website.
- Each project supports its own development journey with explicit placeholders for missing content during drafting.
- The personal blog supports standalone posts through an agreed writing and publishing workflow, with an index and individual reading pages.
- Contact access includes email, phone, and WhatsApp using the supplied number; social links include LinkedIn and GitHub.
- The selected stack includes Next.js, TypeScript, Tailwind CSS, GSAP, and Framer Motion, with a documented 3D choice.
- Motion connects sections in the agreed style and remains usable on mobile and with reduced motion enabled.
- 3D visuals have loading and fallback behavior that preserves access to the main content.
- The visual style includes agreed geeky touches while navigation, reading, and contact actions remain familiar and functional.
- The geeky ingredients support a calm, lightly humorous, technically confident experience. No game mechanics or universal game metaphor are required.
- Visitors can customize website colors through a working palette editor.
- The homepage combines animated sections with directly accessible project, blog, and agreed smaller-item pages.
- Every published page type passes the agreed SEO checks for rendered content, metadata, crawlability, canonical URLs, structured data, and mobile performance. Lighthouse SEO targets 100 where applicable; remaining limitations are recorded rather than hidden.
- Resume facts remain accurate, developing skills are described appropriately, and fictional testimonials remain clearly identified.
- Pending design and content decisions are resolved or explicitly retained as draft placeholders before publication.
- The initial website uses static content and browser interactions without a custom backend; placeholder avatar and sample testimonials are replaceable, and deployment targets Vercel.

## Source record

Background and initial links were extracted from the four files supplied by Khuram:

- `C:\Users\Lenovo\Downloads\Khuram_Shahzad_Resume_Backend.docx`
- `C:\Users\Lenovo\Downloads\Khuram_Shahzad_Resume_VisionAI.docx`
- `C:\Users\Lenovo\Downloads\Khuram_Shahzad_Resume_FullStack.docx`
- `C:\Users\Lenovo\Downloads\Khuram_Shahzad_Resume_Frontend.docx`

## Revision history

- 0.8 — 10 October 2026: Added generated palette previews, three substantive starter blogs, expanded case-study structure, services/process/experience/FAQ sections, and additional interactive 3D models.
- 0.7 — 10 October 2026: Confirmed audience and tone, current self-employment, static architecture, deferred blog publishing, placeholder avatar, dark defaults, and Vercel hosting/domain management. Set aside the broad game-like requirement and added editable project and testimonial drafts.
- 0.6 — 10 October 2026: Confirmed the combination of all listed geeky visual ingredients and a game-like experience throughout the site, with specific game mechanics left open.
- 0.5 — 10 October 2026: Confirmed combined section and page navigation; added proposed routes for projects, blogs, and smaller items, plus comprehensive SEO requirements and verification targets.
- 0.4 — 10 October 2026: Confirmed WhatsApp on the existing phone number and sufficient social links; added a standalone personal blog alongside project journeys.
- 0.3 — 10 October 2026: Added the geeky and playful visual direction, familiar interaction requirements, and a visitor palette editor with proposed supporting behavior.
- 0.2 — 10 October 2026: Added public GitHub research, repository-to-live-site matches, declared project stacks, TypeScript evidence, additional journey candidates, and a complete repository inventory.
- 0.1 — 10 October 2026: Recorded the initial stack, sections, motion and 3D direction, testimonial placeholders, resume background, contact details, and initial project inventory.
