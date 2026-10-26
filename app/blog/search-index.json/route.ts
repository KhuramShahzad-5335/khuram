import { getPostIndex } from "@/lib/post-index";
export const dynamic = "force-static";
export const revalidate = 60;
export async function GET() {
  return Response.json(await getPostIndex());
}
