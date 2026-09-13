import type { TechPortProject } from "@/src/lib/types/nasa";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

interface TechPortListEntry {
  id: number;
  lastUpdated?: string;
}

interface TechPortListResponse {
  projects?: { projects?: TechPortListEntry[] } | TechPortListEntry[];
}

interface TechPortDetailResponse {
  project: TechPortProject;
}

export const revalidate = 86400; // 24h — projetos R&D mudam lentamente

export async function GET() {
  return handleRoute(
    {
      tag: "TECHPORT",
      fallbackMessage:
        "Falha ao acessar os esquemas técnicos do Diretório de Pesquisa.",
    },
    async () => {
      const currentYear = new Date().getFullYear();
      const list = await fetchUpstream<TechPortListResponse>(
        `https://techport.nasa.gov/api/projects?updatedSince=${currentYear}-01-01`,
      );

      const rawList = list?.projects;
      const projectsList: TechPortListEntry[] = Array.isArray(rawList)
        ? rawList
        : (rawList?.projects ?? []);

      // Limita a 12 para evitar timeout em paralelo
      const top = projectsList.slice(0, 12);

      // Tolerância individual: se um detalhe falha, descartamos só ele
      const details = await Promise.all(
        top.map(async (p) => {
          try {
            const r = await fetchUpstream<TechPortDetailResponse>(
              `https://techport.nasa.gov/api/projects/${p.id}`,
            );
            return r.project;
          } catch {
            return null;
          }
        }),
      );

      return details.filter((p): p is TechPortProject => p !== null);
    },
  );
}
