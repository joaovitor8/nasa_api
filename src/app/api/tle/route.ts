import type { TleEntry } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

interface TleRawResponse {
  member?: TleEntry[];
}

export const revalidate = 300; // 5min — TLE é dinâmico mas não tão rápido

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") || "25544";

  return handleRoute(
    {
      tag: "TLE",
      fallbackMessage:
        "FALHA CRÍTICA: Não foi possível interceptar o sinal da base de dados orbital.",
    },
    async () => {
      const url = `https://tle.ivanstanojevic.me/api/tle/?search=${encodeURIComponent(query)}`;
      const data = await fetchUpstream<TleRawResponse>(url);
      return (data.member ?? []).slice(0, 5);
    },
  );
}
