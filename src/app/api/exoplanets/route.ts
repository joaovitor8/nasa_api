import type { ExoplanetRow } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

export const revalidate = 86400; // 24h — arquivo confirmado muda lentamente

export async function GET() {
  return handleRoute(
    {
      tag: "EXOPLANETS",
      fallbackMessage: "Falha ao acessar os registros do espaço profundo.",
    },
    async () => {
      // ADQL — tabela 'ps' (Planetary Systems), default_flag=1 → linha canônica.
      const query =
        "select top 200 pl_name, hostname, discoverymethod, disc_year, pl_rade, pl_bmasse, pl_orbper, sy_dist from ps where default_flag=1 order by disc_year desc";
      const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(
        query,
      )}&format=json`;

      const data = await fetchUpstream<ExoplanetRow[]>(url);
      return data ?? [];
    },
  );
}
