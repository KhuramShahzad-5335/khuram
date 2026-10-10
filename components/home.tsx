"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Code2,
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { projects, skillGroups } from "@/lib/content";
import {
  Services,
  Process,
  Experience,
  InteractionLab,
  FAQ,
} from "./extra-sections";
import { BlogCard } from "./blog-card";
import { posts } from "@/lib/posts";
import { ProjectCard } from "./project-card";
const Orbit = dynamic(() => import("./orbit"), {
  ssr: false,
  loading: () => (
    <div className="orbit">
      <div className="orbit-fallback">◇</div>
    </div>
  ),
});
export function Home() {
  const root = useRef<HTMLDivElement>(null),
    reduced = useReducedMotion(),
    [copied, setCopied] = useState(false);
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((el) =>
          gsap.from(el, {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  async function copy() {
    try {
      await navigator.clipboard.writeText("krshahzad7@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = "mailto:krshahzad7@gmail.com";
    }
  }
  return (
    <main id="main" ref={root}>
      <section className="hero">
        <div className="hero-copy">
          <div className="status">
            <span /> SELF-EMPLOYED · LAHORE, PK
          </div>
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            Thoughtful code.
            <br />
            Useful things.
            <br />
            <span className="muted">A little personality.</span>
          </motion.h1>
          <p>
            I’m Khuram, a software developer turning ideas into
            <br className="desktop-break" /> web experiences that feel good to
            use.
          </p>
          <div className="hero-buttons">
            <Link className="button primary" href="/projects/">
              Explore my work <ArrowUpRight size={17} />
            </Link>
            <a className="button secondary" href="#contact">
              Let’s build something <ArrowRight size={16} />
            </a>
          </div>
          <div className="hero-note">
            <Terminal size={13} />
            <span>clean interfaces. slightly chaotic browser tabs.</span>
          </div>
        </div>
        <div className="hero-art">
          <Orbit />
          <div className="object-caption">
            <span className="accent">&lt; curiosity /&gt;</span>
            <span>always in development</span>
          </div>
        </div>
        <a href="#work" className="scroll-cue">
          <ArrowDown size={14} /> SCROLL TO EXPLORE
        </a>
        <div className="hero-index">PORTFOLIO / 2026</div>
      </section>
      <section className="section work" id="work">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2>
              Less talk. <span className="muted">More tabs.</span>
            </h2>
          </div>
          <Link className="text-link" href="/projects/">
            All projects <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 4).map((p, i) => (
            <div key={p.slug} data-reveal>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
      </section>
      <section className="section about" id="about">
        <div data-reveal>
          <span className="eyebrow">02 / THE PERSON BEHIND THE PIXELS</span>
          <h2>
            Hi, I’m Khuram<span className="accent">.</span>
            <br />
            <span className="muted">I like figuring things out.</span>
          </h2>
          <p>
            I’m a self-employed software developer based in Lahore, Pakistan. My
            work spans responsive React and Next.js interfaces, backend
            services, and API integrations.
          </p>
          <p>
            I care about the little things: readable code, a button that feels
            right, and an interface that doesn’t need a manual. I’m also
            exploring computer vision and applied AI.
          </p>
          <a className="text-link" href="https://github.com/KhuramShahzad-5335">
            Peek at my GitHub <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="about-terminal" data-reveal>
          <div className="terminal-bar">
            <i />
            <i />
            <i />
            <span>khuram.ts</span>
          </div>
          <div className="avatar">
            &lt; KS /&gt;<small>avatar.placeholder</small>
          </div>
          <pre>
            <span className="accent">const</span>
            {
              ' developer = {\n  name: "Khuram Shahzad",\n  location: "Lahore, Pakistan",\n  status: "Self-employed",\n  approach: "Curious by default"\n};'
            }
          </pre>
          <div className="terminal-bottom">
            <span className="status-dot" /> human, probably.
          </div>
        </div>
      </section>
      <section className="section skills">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">03 / TOOLS OF THE TRADE</span>
            <h2>
              The stack. <span className="muted">Not the whole story.</span>
            </h2>
          </div>
          <Code2 size={24} className="muted" />
        </div>
        <div className="skills-grid">
          {skillGroups.map((g) => (
            <div className="skill-group" key={g.label} data-reveal>
              <h3>{g.label}</h3>
              <div>
                {g.items.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Services />
      <Process />
      <Experience />
      <InteractionLab />
      <section className="section notebook" data-reveal>
        <div>
          <span className="eyebrow">08 / THE NOTEBOOK</span>
          <h2>Things I’m thinking about.</h2>
          <p>
            Development notes, small discoveries, and the occasional rabbit
            hole.
            <br />
            Three starting notes. Plenty of room for the next rabbit hole.
          </p>
          <Link className="text-link" href="/blog/">
            Open the notebook <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="notebook-doodle">
          <span>// notes to self</span>
          <strong>
            build.
            <br />
            learn.
            <br />
            repeat<span className="accent">_</span>
          </strong>
        </div>
      </section>
      <FAQ />
      <section className="section blog-home">
        <div className="blog-card-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      {/* THE FEEDBACK SECTION. WILL ADD THIS FEATURE LATER ON. */}
      {/* <section className="section">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">09 / PLACEHOLDER FEEDBACK</span>
            <h2>
              A few kind words. <span className="muted">Eventually.</span>
            </h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {[
            [
              "Client placeholder",
              "Clear communication, thoughtful interfaces, and attention to the details that make a website comfortable to use.",
            ],
            [
              "Developer placeholder",
              "The interface has personality, but the structure still makes sense. A nice balance of playful details and practical thinking.",
            ],
            [
              "Project partner placeholder",
              "Easy to discuss ideas with, open to feedback, and focused on turning a rough concept into something useful.",
            ],
          ].map(([name, quote]) => (
            <article key={name} data-reveal>
              <span className="sample-label">FICTIONAL SAMPLE</span>
              <p>“{quote}”</p>
              <small>{name}</small>
            </article>
          ))}
        </div>
      </section> */}
      <section className="section contact" id="contact" data-reveal>
        <span className="eyebrow">11 / YOUR IDEA STARTS HERE</span>
        <h2>
          Have something in mind?
          <br />
          <span className="muted">Let’s make it a thing.</span>
        </h2>
        <p>
          A project, a question, or a very good developer joke. My inbox is
          open.
        </p>
        <div className="email-line">
          <a href="mailto:krshahzad7@gmail.com">
            krshahzad7@gmail.com <ArrowUpRight size={24} />
          </a>
          <button
            className="icon-button"
            onClick={copy}
            aria-label={copied ? "Email copied" : "Copy email"}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <span role="status" className="copy-status">
            {copied ? "Copied" : ""}
          </span>
        </div>
        <div className="contact-options">
          <a href="https://wa.me/923471713760">
            WhatsApp <ArrowUpRight size={14} />
          </a>
          <a href="tel:+923471713760">+92 347 1713760</a>
          <span>Lahore, Pakistan · UTC+5</span>
        </div>
      </section>
    </main>
  );
}
