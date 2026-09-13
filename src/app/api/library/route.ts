import type { LibraryItem } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

interface LibraryRawResponse {
  collection: { items: LibraryItem[] };
}

export const revalidate = 600; // 10min — caching útil para queries repetidas

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "nebula";
  const media_type = searchParams.get("media_type") || "image";

  return handleRoute(
    {
      tag: "LIBRARY",
      fallbackMessage: "Falha de conexão com os arquivos centrais da NASA.",
    },
    async () => {
      const data = await fetchUpstream<LibraryRawResponse>(
        "https://images-api.nasa.gov/search",
        { params: { q, media_type } },
      );
      return (data.collection?.items ?? []).slice(0, 60);
    },
  );
}
