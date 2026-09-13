import type { Observatory } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

interface SscRawResponse {
  ObservatoryResponse?: { Observatory?: Observatory[] };
}

export const revalidate = 86400; // 24h — catálogo de satélites estável

export async function GET() {
  return handleRoute(
    {
      tag: "SSC",
      fallbackMessage:
        "Falha de handshake com os servidores de rastreio orbital.",
    },
    async () => {
      const data = await fetchUpstream<SscRawResponse>(
        "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories",
        { headers: { Accept: "application/json" } },
      );
      return data.ObservatoryResponse?.Observatory ?? [];
    },
  );
}
