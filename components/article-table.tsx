import type { PostTable } from "@/lib/blog";

/** Plain semantic HTML, shared by the server article and private editor preview. */
export function ArticleTable({ table }: { table: PostTable }) {
  return (
    <div
      className="article-table-wrap"
      role="region"
      aria-label={table.caption || "Table preview"}
      tabIndex={0}
    >
      <table className="article-table">
        <caption>{table.caption}</caption>
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th scope="col" key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) =>
                column === 0 ? (
                  <th scope="row" key={column}>
                    {cell}
                  </th>
                ) : (
                  <td key={column}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
