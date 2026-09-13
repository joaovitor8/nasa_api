import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 1800; // 30min — eventos atualizam ao longo do dia

interface EonetResponse {
  events?: unknown[];
}

export async function GET(request: Request) {
  const days = new URL(request.url).searchParams.get("days") || "30";

  return handleRoute(
    {
      tag: "EONET",
      fallbackMessage:
        "Perda de sinal com a rede de satélites de observação da Terra.",
    },
    async () => {
      const data = await fetchUpstream<EonetResponse>(
        "https://eonet.gsfc.nasa.gov/api/v3/events",
        { params: { days, status: "open" } },
      );
      return data.events ?? [];
    },
  );
}
