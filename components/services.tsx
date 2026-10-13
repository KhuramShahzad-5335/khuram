import { ArrowUpRight, Braces, Database, Sparkles, Layers } from "lucide-react";

const services = [
  {
    title: "Interfaces with personality",
    text: "Responsive React and Next.js websites, reusable components, and motion that makes the interface feel considered.",
    stack: "React · Next.js · Tailwind",
    icon: Braces,
    kind: "interface",
    action: "Discuss a website",
  },
  {
    title: "From idea to working MVP",
    text: "A focused first version of your product: connected screens, application logic, and the core flow people actually need.",
    stack: "Next.js · MERN · TypeScript",
    icon: Layers,
    kind: "product",
    action: "Discuss an MVP",
  },
  {
    title: "Connections that do the work",
    text: "Backend services, database-backed features, and third-party API integrations that bring your application together.",
    stack: "Node.js · PostgreSQL · MongoDB",
    icon: Database,
    kind: "data",
    action: "Discuss an integration",
  },
  {
    title: "AI, with a useful purpose",
    text: "AI assistant interfaces and model API integrations, shaped around a clear task and thoughtful loading and error states.",
    stack: "AI APIs · Next.js · TypeScript",
    icon: Sparkles,
    kind: "ai",
    action: "Discuss an AI feature",
  },
] as const;

function ServicePreview({ kind }: { kind: (typeof services)[number]["kind"] }) {
  return (
    <div
      className={`service-preview service-preview-${kind}`}
      aria-hidden="true"
    >
      <div className="service-preview-bar">
        <i />
        <i />
        <i />
        <span>
          {kind === "interface"
            ? "interface.tsx"
            : kind === "product"
              ? "product.flow"
              : kind === "data"
                ? "connections.map"
                : "assistant.ui"}
        </span>
      </div>
      {kind === "interface" ? (
        <div className="service-ui">
          <div className="service-ui-nav">
            <b /> <span />
            <span />
          </div>
          <div className="service-ui-body">
            <div>
              <strong>
                Good ideas.
                <br />
                Great interfaces.
              </strong>
              <em>Let’s build →</em>
            </div>
            <div className="service-ui-tiles">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      ) : kind === "product" ? (
        <div className="service-flow">
          <div>
            <span>01 / SHAPE</span>
            <strong>The idea</strong>
            <small>One clear problem</small>
          </div>
          <b>→</b>
          <div>
            <span>02 / BUILD</span>
            <strong>The product</strong>
            <small>A useful first version</small>
          </div>
          <b>→</b>
          <div>
            <span>03 / REFINE</span>
            <strong>The next step</strong>
            <small>Learn, then improve</small>
          </div>
        </div>
      ) : kind === "data" ? (
        <div className="service-flow">
          <div>
            <Braces />
            <strong>Interface</strong>
            <small>User actions</small>
          </div>
          <b>↔</b>
          <div className="service-flow-accent">
            <span>&lt; / &gt;</span>
            <strong>API</strong>
            <small>Application logic</small>
          </div>
          <b>↔</b>
          <div>
            <Database />
            <strong>Database</strong>
            <small>Connected records</small>
          </div>
        </div>
      ) : (
        <div className="service-chat">
          <span>YOU</span>
          <p>Help me find the next step.</p>
          <span>
            <Sparkles size={12} /> ASSISTANT
          </span>
          <p>Let’s start with what you need.</p>
          <div>
            <i />
            <i />
            <i />
            <small>Purpose first. Prompt second.</small>
          </div>
        </div>
      )}
    </div>
  );
}

export function Services() {
  return (
    <section
      className="section services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="section-heading" data-reveal>
        <div>
          <span className="eyebrow">04 / HOW I CAN HELP</span>
          <h2 id="services-title">
            Your idea.
            <br />
            <span className="muted">Let’s give it a working version.</span>
          </h2>
        </div>
        <a className="button secondary" href="#contact">
          Tell me about your project <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {services.map((service, index) => (
          <div
            key={service.kind}
            data-reveal
            className={`min-w-0 ${index === 0 || index === 3 ? "md:col-span-5" : "md:col-span-7"}`}
          >
            <article className="service-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--surface) p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <service.icon
                  size={21}
                  className="text-(--accent)"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs text-(--muted)">
                  0{index + 1} / BUILD
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-medium tracking-tight">
                {service.title}
              </h3>
              <p className="max-w-xl text-sm leading-7 text-(--muted)">
                {service.text}
              </p>
              <span className="mt-4 font-mono text-xs text-(--accent)">
                {service.stack}
              </span>
              <div className="mt-auto pt-6">
                <ServicePreview kind={service.kind} />
              </div>
              <a href="#contact" className="text-link mt-6 self-start">
                {service.action}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </article>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-6 text-(--muted)">
        A few ways I can help. Scope and deliverables start with a conversation.
        Previews are conceptual illustrations.
      </p>
    </section>
  );
}
