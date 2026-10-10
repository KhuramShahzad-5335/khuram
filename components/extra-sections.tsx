"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Braces, Layers, Workflow, Plus } from "lucide-react";
const Scene = dynamic(() => import("./section-scene"), {
  ssr: false,
  loading: () => <div className="scene-static">◇</div>,
});
const steps = [
  {
    title: "Find the real problem",
    label: "01 / UNDERSTAND",
    text: "Start with the audience, the task, and what a useful outcome looks like. A clear brief saves a lot of very beautiful wrong turns.",
    detail:
      "Map the main user journey, content, constraints, and what needs to exist in the first version.",
  },
  {
    title: "Make the structure clear",
    label: "02 / SHAPE",
    text: "Turn the idea into routes, sections, reusable pieces, and a visual direction. Make the important actions easy to find.",
    detail:
      "Sketch the information hierarchy, mobile behavior, component boundaries, and the states people will encounter.",
  },
  {
    title: "Build, then get specific",
    label: "03 / DEVELOP",
    text: "Connect the interface, data, and interactions. Work from the main flow outward, then give the details some attention.",
    detail:
      "Use readable components, deliberate state management, resilient integrations, and motion that supports the interaction.",
  },
  {
    title: "Check the edges",
    label: "04 / REFINE",
    text: "Small screens, keyboard input, loading states, and those delightful things that happen when a request fails.",
    detail:
      "Review responsiveness, accessibility, performance, error handling, and the paths that are easy to miss.",
  },
];
export function Services() {
  return (
    <section className="section services">
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">04 / HOW I CAN HELP</span>
          <h2>
            From a rough idea
            <br />
            <span className="muted">to a useful interface.</span>
          </h2>
        </div>
      </div>
      <div className="services-layout">
        <div className="service-list">
          {[
            {
              icon: Braces,
              title: "Frontend development",
              text: "Responsive React and Next.js interfaces, reusable components, and the little interactions that make a product comfortable to use.",
            },
            {
              icon: Layers,
              title: "Full-stack applications",
              text: "MERN applications, backend services, and API integrations that connect the visible interface to the work behind it.",
            },
            {
              icon: Workflow,
              title: "Interface refinement",
              text: "State management, animation, testing, and delivery workflows. The details that help a growing application stay understandable.",
            },
          ].map((s) => (
            <article key={s.title} data-reveal>
              <s.icon size={22} />
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <ArrowUpRight size={16} />
            </article>
          ))}
        </div>
        <div className="service-sculpture">
          <Scene kind="stack" />
          <p>
            <code>// layers, working together</code>
            <span>Hover the stack. It has a little breathing room.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  const [active, setActive] = useState(0),
    reduced = useReducedMotion();
  return (
    <section className="section process">
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">05 / THE WAY THROUGH</span>
          <h2>
            A process. <span className="muted">Not a magic trick.</span>
          </h2>
        </div>
        <span className="eyebrow">CLICK A STEP TO EXPLORE</span>
      </div>
      <div
        className="process-tabs"
        role="tablist"
        aria-label="Development process"
      >
        {steps.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            id={"step-tab-" + i}
            aria-controls="process-panel"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 3
                      : (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setActive(next);
                document.getElementById("step-tab-" + next)?.focus();
              }
            }}
          >
            <span>{s.label}</span>
            <strong>{s.title}</strong>
          </button>
        ))}
      </div>
      <motion.div
        className="process-panel"
        id="process-panel"
        role="tabpanel"
        aria-labelledby={"step-tab-" + active}
        key={active}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      >
        <span className="process-number">0{active + 1}</span>
        <div>
          <h3>{steps[active].title}</h3>
          <p>{steps[active].text}</p>
          <small>{steps[active].detail}</small>
        </div>
      </motion.div>
    </section>
  );
}
export function Experience() {
  return (
    <section className="section experience">
      <div data-reveal>
        <span className="eyebrow">06 / A LITTLE CONTEXT</span>
        <h2>
          Different teams.
          <br />
          <span className="muted">The same curiosity.</span>
        </h2>
        <p>
          Frontend, full-stack, and integration work across collaborative
          engineering teams. Currently building independently.
        </p>
        <a
          href="https://www.linkedin.com/in/khuram-shahzad-0814b1230/"
          className="text-link"
        >
          More on LinkedIn <ArrowUpRight size={15} />
        </a>
      </div>
      <ol className="timeline">
        {[
          [
            "Now",
            "Self-employed",
            "Software developer",
            "Independent web development and practical application work.",
          ],
          [
            "May 2024 — Mar 2025",
            "Officiallabs",
            "Frontend Developer",
            "Frontend architecture, application data flow, testing, and delivery workflows.",
          ],
          [
            "Jun 2023 — May 2024",
            "Hashtag Web",
            "MERN Stack Developer",
            "End-to-end web application development and third-party API integrations.",
          ],
          [
            "2022 — Apr 2023",
            "Techixen",
            "Web Developer",
            "Responsive web interfaces, integration work, and cross-functional collaboration.",
          ],
        ].map(([date, company, role, text]) => (
          <li key={company} data-reveal>
            <span>{date}</span>
            <h3>
              {company}
              <small>{role}</small>
            </h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function InteractionLab() {
  const [pressed, setPressed] = useState<string[]>([]);
  return (
    <section className="section interaction-lab">
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">07 / A SMALL DETOUR</span>
          <h2>
            Serious about the work.
            <br />
            <span className="muted">Less serious about the buttons.</span>
          </h2>
        </div>
      </div>
      <div className="lab-layout">
        <div className="lab-copy">
          <h3>A tiny object lab.</h3>
          <p>
            Rotate it. Change the shape. Try a wireframe. These little
            experiments leave room for curiosity between the practical things.
          </p>
          <div className="keycap-row">
            {["build", "learn", "repeat"].map((k) => (
              <button
                key={k}
                aria-pressed={pressed.includes(k)}
                onClick={() =>
                  setPressed(
                    pressed.includes(k)
                      ? pressed.filter((v) => v !== k)
                      : [...pressed, k],
                  )
                }
              >
                {k}
                <span>↵</span>
              </button>
            ))}
          </div>
          <p className="lab-status" role="status">
            {pressed.length === 3
              ? "A complete loop. Now add coffee."
              : pressed.length
                ? pressed.join(" → ")
                : "Click a key. No terminal expertise required."}
          </p>
        </div>
        <Scene kind="knot" interactive />
      </div>
    </section>
  );
}
export function FAQ() {
  return (
    <section className="section faq">
      <div data-reveal>
        <span className="eyebrow">10 / A FEW QUICK ANSWERS</span>
        <h2>
          Before you
          <br />
          <span className="muted">open another tab.</span>
        </h2>
      </div>
      <div className="faq-list">
        {[
          [
            "What kind of work can we discuss?",
            "Frontend interfaces, full-stack web applications, API integrations, and improvements to existing web experiences. Send the idea and its context; we can work out what fits.",
          ],
          [
            "Can you work with an existing project?",
            "Yes. A useful starting point is the current codebase, the main user flow, and the problems you want to solve. Scope and access can be discussed before work begins.",
          ],
          [
            "How do I start a conversation?",
            "Email or WhatsApp works. Share what you are building, who it is for, and any timing or technical constraints. A rough brief is enough to start.",
          ],
          [
            "Is this website using a backend?",
            "The portfolio is static. Its content is generated at build time; palette editing and 3D interactions run in your browser. The blog follows the same approach.",
          ],
        ].map(([q, a]) => (
          <details key={q} data-reveal>
            <summary>
              {q}
              <Plus size={17} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
