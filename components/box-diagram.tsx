"use client";

import { useState } from "react";

const layers = [
  {
    title: "UI",
    label: "Interface",
    detail:
      "The screens and controls people use. Clear structure, responsive layouts, and useful feedback.",
    paint: "primary",
  },
  {
    title: "API",
    label: "Connections",
    detail:
      "Requests connect the interface to services. Loading, success, and error states keep the journey understandable.",
    paint: "secondary",
  },
  {
    title: "Data",
    label: "State",
    detail:
      "Application data gives the interface context. Deliberate state management keeps the visible experience consistent.",
    paint: "surface",
  },
] as const;

/** A theme-aware architecture illustration. It does not call real services. */
export function BoxDiagram({ interactive = false }: { interactive?: boolean }) {
  const [layout, setLayout] = useState("flow");
  const [selected, setSelected] = useState(0);
  return (
    <figure className="box-diagram">
      <div className="box-diagram-heading">
        <span>UI → API → DATA</span>
        <span>ILLUSTRATIVE FLOW</span>
      </div>
      <div className={`box-nodes box-${layout}`}>
        {layers.map((layer, index) => {
          const content = (
            <>
              <span className="box-node-index">
                0{index + 1} / {layer.label}
              </span>
              <strong>{layer.title}</strong>
              <span className="box-node-caption">
                {
                  ["People interact", "Services connect", "State updates"][
                    index
                  ]
                }
              </span>
            </>
          );
          return interactive ? (
            <button
              key={layer.title}
              className={`box-node box-${layer.paint}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              aria-label={`Explore ${layer.title} layer`}
            >
              {content}
            </button>
          ) : (
            <div key={layer.title} className={`box-node box-${layer.paint}`}>
              {content}
            </div>
          );
        })}
      </div>
      {interactive ? (
        <>
          <div
            className="box-layout-controls"
            role="group"
            aria-label="Diagram layout"
          >
            {["flow", "layers", "grid"].map((value) => (
              <button
                key={value}
                aria-pressed={layout === value}
                onClick={() => setLayout(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <figcaption aria-live="polite">
            <strong>{layers[selected].label} / </strong>
            {layers[selected].detail}
          </figcaption>
        </>
      ) : (
        <figcaption>
          Three connected layers. One understandable experience.
        </figcaption>
      )}
    </figure>
  );
}
