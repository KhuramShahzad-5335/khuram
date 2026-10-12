export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
  note?: string;
  visual: string;
};
const github = "https://github.com/KhuramShahzad-5335/";
export const projects: Project[] = [
  {
    slug: "qurancademy",
    name: "Qurancademy",
    category: "BUSINESS WEBSITE",
    description: "A considered web presence for a Quran academy.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    url: "https://qurancademy.vercel.app",
    repo: github + "qurancademy",
    visual: "academy",
    note: "Draft project narrative. Detailed contribution, decisions, and outcomes will be added.",
  },
  {
    slug: "hashtag-web",
    name: "Hashtag Web",
    category: "AGENCY PORTFOLIO",
    description: "An agency portfolio with room for a little personality.",
    stack: ["React", "Vite", "Redux Toolkit", "Framer Motion"],
    url: "https://hashtag-web-portfolio.vercel.app/",
    repo: github + "HashTag-Web-Portfolio",
    visual: "agency",
    note: "Draft project narrative. Individual contributions and milestones are being documented.",
  },
  {
    slug: "nfc-attendance",
    name: "NFC Attendance",
    category: "UNIVERSITY PROJECT",
    description: "A responsive frontend for marking and reviewing attendance.",
    stack: ["React", "MUI", "Axios", "ApexCharts"],
    url: "https://nfc-attendance-frontend.vercel.app",
    repo: github + "NFC-student-portal-frontend",
    visual: "attendance",
    note: "The repository is a fork. Collaborator credits and detailed contribution boundaries will be added.",
  },
  {
    slug: "ai-document-generator",
    name: "AI Document Generator",
    category: "APPLIED AI",
    description:
      "From user input to structured documents with an AI integration.",
    stack: ["Python", "Flask", "OpenAI API"],
    visual: "documents",
    note: "University project. Screenshots, detailed milestones, and a public link will follow.",
  },
  {
    slug: "marham",
    name: "Marham Frontend",
    category: "WEB PROJECT",
    description: "A deployed frontend from my project collection.",
    stack: [],
    url: "https://marham-frontend.vercel.app/",
    visual: "minimal",
    note: "Project details pending.",
  },
  {
    slug: "o-two",
    name: "O Two Clone",
    category: "INTERFACE STUDY",
    description:
      "An interface recreation built with a Next.js and React foundation.",
    stack: ["Next.js", "React", "MUI", "Tailwind CSS", "styled-components"],
    url: "https://otwoclonesite.vercel.app/",
    visual: "minimal",
    note: "Title and contribution details pending.",
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    category: "INFORMATION WEBSITE",
    description:
      "A structured interface for independent UK mobile-service guidance.",
    stack: ["Next.js", "React", "Tailwind CSS", "MUI"],
    url: "https://customersupport-phi.vercel.app/",
    visual: "minimal",
    note: "Project details pending.",
  },
  {
    slug: "haris-travels",
    name: "Haris Travels",
    category: "BUSINESS WEBSITE",
    description: "A business website from my deployed project collection.",
    stack: [],
    url: "https://www.haristravels.com/",
    visual: "minimal",
    note: "Scope and implementation details pending.",
  },
  {
    slug: "dula",
    name: "Dula",
    category: "WEB APPLICATION",
    description: "An application from my portfolio references.",
    stack: [],
    url: "https://m.dula.ai/",
    visual: "minimal",
    note: "Project details pending.",
  },
];
export const experiments = [
  {
    slug: "react-concepts",
    name: "Advanced React Concepts",
    description: "A space for exploring React concepts in smaller examples.",
    stack: "React · Vite · Tailwind CSS",
    repo: github + "advanced-react-concepts",
    url: "https://advanced-react-conceps.vercel.app",
  },
  {
    slug: "linkedin-clone",
    name: "LinkedIn Clone",
    description: "Practicing familiar interface patterns through recreation.",
    stack: "React · Redux Toolkit · MUI",
    repo: github + "linkedIn-Clone",
  },
  {
    slug: "random-colors",
    name: "Random Colors",
    description: "A little color-driven interface experiment.",
    stack: "React · Vite",
    repo: github + "Random-Colors_Ex-L3",
    url: "https://khuramshahzad-5335.github.io/Random-Colors_Ex-L3/",
  },
  {
    slug: "expanding-cards",
    name: "Expanding Cards",
    description: "Simple interaction, satisfying feedback.",
    stack: "HTML · CSS · JavaScript",
    repo: github + "EXPANDING-CARDS-_HCJ",
    url: "https://khuramshahzad-5335.github.io/EXPANDING-CARDS-_HCJ/",
  },
  {
    slug: "progress-bar",
    name: "Progress Bar",
    description: "An exercise in steps, state, and transitions.",
    stack: "HTML · CSS · JavaScript",
    repo: github + "ProgressBar---HCJ",
    url: "https://khuramshahzad-5335.github.io/ProgressBar---HCJ/",
  },
  {
    slug: "acme-dashboard",
    name: "Acme Dashboard",
    description: "A Next.js course starter and learning project.",
    stack: "Next.js · TypeScript · Tailwind CSS",
    repo: github + "acme-dashboard",
  },
  {
    slug: "user-card",
    name: "User Card Design",
    description: "Exploring presentation in a small React component.",
    stack: "React · Vite",
    repo: github + "UserCardDesign",
    url: "https://khuramshahzad-5335.github.io/UserCardDesign/",
  },
  {
    slug: "shopify-store",
    name: "Storefront Study",
    description:
      "A storefront interface experiment; Shopify integration is unverified.",
    stack: "React · Vite · Chakra UI",
    repo: github + "Shopify-Store-With-React-And-Shofiy-SDK",
  },
];
export const skillGroups = [
  {
    label: "Interfaces",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "Zustand",
    ],
  },
  {
    label: "Behind the scenes",
    items: ["Node.js", "Express", "Python", "Flask", "MongoDB", "PostgreSQL"],
  },
  {
    label: "Details & delivery",
    items: [
      "GSAP",
      "Framer Motion",
      "Git",
      "GitHub Actions",
      "Jest",
      "Testing Library",
    ],
  },
  {
    label: "Currently exploring",
    items: ["OpenCV", "PyTorch", "Computer vision"],
  },
];
