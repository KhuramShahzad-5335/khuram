import { notFound } from "next/navigation";
import { NotebookPage } from "@/components/notebook-page";
import { getPostStats } from "@/lib/server/posts";
import { pageMetadata } from "@/lib/metadata";
import { BLOG_PAGE_SIZE, notebookUrl } from "@/lib/notebook";
export const dynamicParams = true;
export const revalidate = 60;
export function generateStaticParams() {
  return [];
}
async function validPage(value: string) {
  const { total } = await getPostStats();
  const blogPageCount = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
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
  const page = await validPage((await params).page);
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
  return <NotebookPage page={await validPage((await params).page)} />;
}
