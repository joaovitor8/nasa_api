import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 3600; // 1h — busca elastic, vale cachear

interface OsdrResponse {
  hits?: { hits?: unknown[] };
}

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("q") || "spaceflight";

  return handleRoute(
    {
      tag: "OSDR",
      fallbackMessage:
        "Falha na decodificação da sequência de dados biológicos.",
    },
    async () => {
      // A API do OSDR usa um endpoint de busca (geode-py)
      const url = `https://osdr.nasa.gov/osdr/data/search?term=${encodeURIComponent(term)}`;
      const data = await fetchUpstream<OsdrResponse>(url);
      // O ElasticSearch devolve os dados dentro de hits.hits
      return data.hits?.hits ?? [];
    },
  );
}
