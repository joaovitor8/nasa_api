import type { SolarFlare } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 1800; // 30min — DONKI atualiza ao longo do dia

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate = searchParams.get("endDate") ?? undefined;

  return handleRoute(
    {
      tag: "DONKI",
      fallbackMessage:
        "Interferência eletromagnética. Falha ao obter dados solares.",
      messages: {
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    async () => {
      const data = await fetchUpstream<SolarFlare[]>(
        "https://api.nasa.gov/DONKI/FLR",
        {
          nasaAuth: true,
          params: { startDate, endDate },
        },
      );
      return data ?? [];
    },
  );
}
