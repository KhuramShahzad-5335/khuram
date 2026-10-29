"use client";
import type { PostTable } from "@/lib/blog";
import { Field } from "./fields";

export function TableEditor({
  table,
  onChange,
}: {
  table?: PostTable;
  onChange: (value: PostTable | undefined) => void;
}) {
  if (!table)
    return (
      <button
        className="text-link"
        onClick={() =>
          onChange({ caption: "", headers: ["", ""], rows: [["", ""]] })
        }
      >
        Add comparison table
      </button>
    );
  return (
    <fieldset className="space-y-4 rounded-xl border border-(--border) p-4">
      <legend className="px-2 text-sm font-medium">Comparison table</legend>
      <Field
        label="Table caption"
        value={table.caption}
        onChange={(caption) => onChange({ ...table, caption })}
        hint="Describe what the table compares. The first column labels each row. Fill every cell before publishing; use Not applicable where needed."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {table.headers.map((header, column) => (
          <Field
            key={column}
            label={`Column ${column + 1} heading`}
            value={header}
            onChange={(value) =>
              onChange({
                ...table,
                headers: table.headers.map((h, i) =>
                  i === column ? value : h,
                ),
              })
            }
          />
        ))}
      </div>
      {table.rows.map((row, rowIndex) => (
        <fieldset
          className="space-y-3 border-t border-(--border) pt-3"
          key={rowIndex}
        >
          <legend className="text-xs text-(--muted)">Row {rowIndex + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {row.map((cell, column) => (
              <Field
                key={column}
                label={table.headers[column] || `Column ${column + 1}`}
                value={cell}
                onChange={(value) =>
                  onChange({
                    ...table,
                    rows: table.rows.map((r, i) =>
                      i === rowIndex
                        ? r.map((c, j) => (j === column ? value : c))
                        : r,
                    ),
                  })
                }
              />
            ))}
          </div>
          <button
            className="text-link disabled:opacity-40"
            disabled={table.rows.length === 1}
            onClick={() =>
              onChange({
                ...table,
                rows: table.rows.filter((_, i) => i !== rowIndex),
              })
            }
          >
            Remove row {rowIndex + 1}
          </button>
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-4 text-sm">
        <button
          className="text-link disabled:opacity-40"
          disabled={table.rows.length >= 40}
          onClick={() =>
            onChange({
              ...table,
              rows: [...table.rows, table.headers.map(() => "")],
            })
          }
        >
          Add row
        </button>
        <button
          className="text-link disabled:opacity-40"
          disabled={table.headers.length >= 6}
          onClick={() =>
            onChange({
              ...table,
              headers: [...table.headers, ""],
              rows: table.rows.map((row) => [...row, ""]),
            })
          }
        >
          Add column
        </button>
        <button
          className="text-link disabled:opacity-40"
          disabled={table.headers.length <= 2}
          onClick={() =>
            onChange({
              ...table,
              headers: table.headers.slice(0, -1),
              rows: table.rows.map((row) => row.slice(0, -1)),
            })
          }
        >
          Remove last column
        </button>
        <button className="text-link" onClick={() => onChange(undefined)}>
          Remove table
        </button>
      </div>
    </fieldset>
  );
}
