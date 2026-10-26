import { hasStudioSession, studioConfigured } from "@/lib/server/studio-auth";
import { blogCollection } from "@/lib/server/database";
import { parsePostRecord } from "@/lib/post-record";
import { Studio } from "@/components/studio";
export default async function StudioPage() {
  const configured = studioConfigured();
  const authenticated = configured && (await hasStudioSession());
  const records = authenticated
    ? await (
        await blogCollection()
      )
        .find({})
        .sort({ date: -1 })
        .limit(200)
        .toArray()
    : [];
  const articles = records.map((record) => ({
    post: parsePostRecord(record),
    revision:
      typeof record._studioRevision === "number" ? record._studioRevision : 0,
  }));
  return (
    <main id="main" className="page-main">
      <Studio
        configured={configured}
        authenticated={authenticated}
        articles={articles}
      />
    </main>
  );
}
