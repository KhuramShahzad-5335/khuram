import { notFound } from "next/navigation";
import { NotebookPage } from "@/components/notebook-page";
import { blogPageCount } from "@/lib/post-index";
import { pageMetadata } from "@/lib/metadata";
import { notebookUrl } from "@/lib/notebook";
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, blogPageCount - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}
function validPage(value: string) {
  const page = Number(value);
  if (
    !/^\d+$/.test(value) ||
    String(page) !== value ||
    page < 2 ||
    page > blogPageCount
  )
    notFound();
  return page;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = validPage((await params).page);
  return pageMetadata(
    `Blog & Notebook — Page ${page}`,
    `Browse page ${page} of Khuram Shahzad’s development notebook: practical articles and project lessons.`,
    notebookUrl(page),
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  return <NotebookPage page={validPage((await params).page)} />;
}
