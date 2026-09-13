import type { ApodData } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 1800; // 30 min — APOD muda 1x ao dia

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");

  return handleRoute(
    {
      tag: "APOD",
      fallbackMessage:
        "Não foi possível acessar os arquivos estelares neste momento.",
      messages: {
        404: "Sem registro cósmico para a data selecionada.",
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    () =>
      fetchUpstream<ApodData>("https://api.nasa.gov/planetary/apod", {
        nasaAuth: true,
        params: date ? { date } : undefined,
      }),
  );
}
