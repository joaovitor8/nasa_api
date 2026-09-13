import type { NeoFeedResponse } from "@/src/lib/types/nasa";
import { badRequest, fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 3600; // 1h — feed NeoWs por dia

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date) return badRequest("É necessário fornecer uma data de rastreio.");

  return handleRoute(
    {
      tag: "NEOWS",
      fallbackMessage: "Falha na comunicação com o radar orbital.",
      messages: {
        400: "Data inválida para o radar orbital.",
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    () =>
      fetchUpstream<NeoFeedResponse>(
        "https://api.nasa.gov/neo/rest/v1/feed",
        {
          nasaAuth: true,
          params: { start_date: date, end_date: date },
        },
      ),
  );
}
