import { pageMetadata } from "@/lib/metadata";
import { NotebookPage } from "@/components/notebook-page";
export const metadata = pageMetadata(
  "Notebook",
  "Practical guides to personal SEO, interface motion, static blogging, and color systems from Khuram Shahzad’s development notebook.",
  "/blog/",
);
export default function Page() {
  return <NotebookPage />;
}
