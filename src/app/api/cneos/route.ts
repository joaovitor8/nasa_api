import type { SentryObject, SentryResponse } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

interface RawSentryResponse {
  count: string;
  signature: { source: string; version: string };
  data: SentryObject[];
}

export const revalidate = 21600; // 6h — Sentry recalcula trajetórias raramente

export async function GET() {
  return handleRoute(
    {
      tag: "CNEOS",
      fallbackMessage:
        "Falha de conexão com os servidores do Jet Propulsion Laboratory.",
    },
    async () => {
      const sentry = await fetchUpstream<RawSentryResponse>(
        "https://ssd-api.jpl.nasa.gov/sentry.api",
      );
      const response: SentryResponse = {
        count: sentry.count,
        signature: sentry.signature,
        objects: sentry.data ?? [],
      };
      return response;
    },
  );
}
