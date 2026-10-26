import type { PostRecord } from "../post-record";
export type Article = { post: PostRecord; revision: number };
export type ArticleCard = {
  post: Pick<PostRecord, "slug" | "title" | "date" | "status">;
  revision: number;
};
export type ArticleRevision = {
  post: PostRecord;
  revision: number;
  savedAt: string;
};
