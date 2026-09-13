import { badRequest, fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 86_400; // 1 dia — Wikipedia muda raramente para artigos canônicos

interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  content_urls?: { desktop: { page: string } };
  description?: string;
}

interface WikiResponse {
  title: string;
  extract: string;
  thumbnail: string | null;
  pageUrl: string;
  description: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const lang = searchParams.get("lang") === "en" ? "en" : "pt";

  if (!title) return badRequest("title é obrigatório");

  return handleRoute(
    {
      tag: "WIKIPEDIA",
      fallbackMessage: "Falha ao consultar arquivo enciclopédico.",
      messages: { 404: "Verbete não encontrado na Wikipedia." },
    },
    async () => {
      const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const data = await fetchUpstream<WikiSummary>(url, {
        headers: { "User-Agent": "Universo/1.0 (sistema operacional do cosmos)" },
      });

      const payload: WikiResponse = {
        title: data.title,
        extract: data.extract ?? "",
        thumbnail:
          data.originalimage?.source ?? data.thumbnail?.source ?? null,
        pageUrl:
          data.content_urls?.desktop.page ??
          `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        description: data.description ?? null,
      };
      return payload;
    },
  );
}
