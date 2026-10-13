import { postIndex } from "@/lib/post-index";
export const dynamic = "force-static";
export function GET() {
  return Response.json(postIndex);
}
