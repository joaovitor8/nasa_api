import { badRequest, fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 86400; // 24h — patentes/spin-offs mudam lentamente

interface TechTransferResponse {
  results?: unknown[];
}

const ALLOWED_TYPES = ["patent", "software", "spinoff"] as const;
type TechTransferType = (typeof ALLOWED_TYPES)[number];

const isAllowedType = (v: string): v is TechTransferType =>
  (ALLOWED_TYPES as readonly string[]).includes(v);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type") || "software";
  const query = searchParams.get("q") || "";

  if (!isAllowedType(rawType)) {
    return badRequest("Tipo inválido. Use patent, software ou spinoff.");
  }

  return handleRoute(
    {
      tag: "TECHTRANSFER",
      fallbackMessage: "Falha de conexão com o banco de patentes da agência.",
      messages: {
        429: "Cota de telemetria estourada. Aguarde alguns minutos.",
      },
    },
    async () => {
      // A API da NASA usa o filtro textual em ?q=. Passamos via params do axios
      // para que `api_key` seja anexado corretamente.
      const data = await fetchUpstream<TechTransferResponse>(
        `https://api.nasa.gov/techtransfer/${rawType}/`,
        {
          nasaAuth: true,
          params: query ? { q: query } : undefined,
        },
      );

      return (data.results ?? []).slice(0, 24);
    },
  );
}
