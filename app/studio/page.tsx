import { hasStudioSession, studioConfigured } from "@/lib/server/studio-auth";
import { listStudioArticles } from "@/lib/server/studio-posts";
import { Studio } from "@/components/studio";
export default async function StudioPage() {
  const configured = studioConfigured();
  const authenticated = configured && (await hasStudioSession());
  const { articles, total } = authenticated
    ? await listStudioArticles()
    : { articles: [], total: 0 };
  return (
    <main id="main" className="page-main">
      <Studio
        configured={configured}
        authenticated={authenticated}
        articles={articles}
        total={total}
      />
    </main>
  );
}
