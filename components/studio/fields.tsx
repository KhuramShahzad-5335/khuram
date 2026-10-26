"use client";
import { useId } from "react";
export const inputClass =
  "mt-2 w-full rounded-lg border border-(--border) bg-(--background) px-3 py-2.5 text-(--text) outline-offset-4";
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  disabled = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  disabled?: boolean;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="block text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          aria-describedby={hint ? id + "-hint" : undefined}
          className={inputClass + " min-h-32 resize-y"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          aria-describedby={hint ? id + "-hint" : undefined}
          className={inputClass}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {hint && (
        <span
          id={id + "-hint"}
          className="mt-1 block text-xs font-normal text-(--muted)"
        >
          {hint}
        </span>
      )}
    </div>
  );
}
export function LinksEditor({
  label,
  links,
  onChange,
}: {
  label: string;
  links: { title: string; url: string }[];
  onChange: (links: { title: string; url: string }[]) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{label} (optional)</h3>
      {links.map((link, index) => (
        <div
          className="grid gap-3 rounded-lg border border-(--border) p-3"
          key={index}
        >
          <Field
            label={label + " " + (index + 1) + " label"}
            value={link.title}
            onChange={(title) =>
              onChange(links.map((l, i) => (i === index ? { ...l, title } : l)))
            }
          />
          <Field
            label={label + " " + (index + 1) + " URL"}
            value={link.url}
            onChange={(url) =>
              onChange(links.map((l, i) => (i === index ? { ...l, url } : l)))
            }
          />
          <button
            className="text-link justify-self-start"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
          >
            Remove link
          </button>
        </div>
      ))}
      <button
        className="text-link"
        onClick={() => onChange([...links, { title: "", url: "" }])}
      >
        Add {label.toLowerCase()} link
      </button>
    </div>
  );
}
