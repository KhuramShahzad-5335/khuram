/** Lightweight dimensional artwork inherits live palette tokens, without a canvas. */
export function SectionMotif({
  kind = "prism",
}: {
  kind?: "prism" | "tiles" | "steps";
}) {
  return (
    <svg
      className={`section-motif motif-${kind}`}
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
    >
      {kind === "prism" ? (
        <g stroke="var(--background)" strokeWidth="2">
          <path fill="var(--primary)" d="M80 15 140 50 80 85 20 50Z" />
          <path fill="var(--secondary)" d="M20 50 80 85 80 145 20 110Z" />
          <path fill="var(--accent)" d="M80 85 140 50 140 110 80 145Z" />
        </g>
      ) : kind === "tiles" ? (
        <g stroke="var(--background)" strokeWidth="2">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={20 + (i % 2) * 63}
              y={20 + Math.floor(i / 2) * 63}
              width="55"
              height="55"
              rx="8"
              fill={i % 2 ? "var(--secondary)" : "var(--primary)"}
            />
          ))}
          <path
            d="M43 46H57M50 39V53M107 103H121"
            stroke="var(--on-primary)"
            strokeWidth="3"
          />
        </g>
      ) : (
        <g stroke="var(--background)" strokeWidth="2">
          <rect
            x="20"
            y="20"
            width="93"
            height="93"
            rx="6"
            fill="var(--secondary)"
          />
          <rect
            x="35"
            y="35"
            width="93"
            height="93"
            rx="6"
            fill="var(--primary)"
          />
          <rect
            x="50"
            y="50"
            width="93"
            height="93"
            rx="6"
            fill="var(--surface)"
          />
          <path
            d="M67 75H125M67 89H115M67 103H125M67 117H99"
            stroke="var(--accent)"
            strokeWidth="4"
          />
        </g>
      )}
    </svg>
  );
}
