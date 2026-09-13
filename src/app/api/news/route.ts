import type { NewsArticle, NewsResponse } from "@/src/lib/types/news";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

const BASE = "https://api.spaceflightnewsapi.net/v4/articles";

export const revalidate = 600; // 10min — feed de notícias

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") ?? undefined;
  const news_site = searchParams.get("source") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");

  return handleRoute(
    {
      tag: "NEWS",
      fallbackMessage:
        "Interceptação interrompida. Falha ao decodificar feed de comunicações.",
    },
    async () => {
      const data = await fetchUpstream<NewsResponse>(BASE, {
        params: {
          limit,
          ordering: "-published_at",
          ...(search ? { search } : {}),
          ...(news_site ? { news_site } : {}),
        },
      });
      return data.results as NewsArticle[];
    },
  );
}
