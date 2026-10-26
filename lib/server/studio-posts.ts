import "server-only";
import { blogDatabase } from "./database";
import { parsePostRecord, type PostRecord } from "../post-record";
import type { ArticleRevision, ArticleCard } from "../studio/types";
export const STUDIO_PAGE_SIZE = 20;
type StoredPost = PostRecord & {
  _studioRevision?: number;
  _history?: ArticleRevision[];
  _trashed?: boolean;
};
export async function studioCollection() {
  return (await blogDatabase()).collection<StoredPost>("posts");
}
export async function listStudioArticles(page = 1, trash = false) {
  const collection = await studioCollection();
  const filter = { _trashed: trash ? true : { $ne: true } };
  const [rows, total] = await Promise.all([
    collection
      .find(filter, {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          date: 1,
          status: 1,
          _studioRevision: 1,
        },
      })
      .sort({ date: -1, slug: 1 })
      .skip((page - 1) * STUDIO_PAGE_SIZE)
      .limit(STUDIO_PAGE_SIZE)
      .maxTimeMS(10000)
      .toArray(),
    collection.countDocuments(filter, { maxTimeMS: 10000 }),
  ]);
  const articles: ArticleCard[] = rows.map((p) => ({
    post: { slug: p.slug, title: p.title, date: p.date, status: p.status },
    revision: p._studioRevision || 0,
  }));
  return { articles, total };
}
export async function loadStudioArticle(slug: string) {
  const row = await (
    await studioCollection()
  ).findOne({ slug, _trashed: { $ne: true } }, { projection: { _history: 0 } });
  return row
    ? { post: parsePostRecord(row), revision: row._studioRevision || 0 }
    : null;
}
