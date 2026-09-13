import type {
  SpacexLaunch,
  SpacexLaunchpad,
  SpacexRocket,
  SpacexSnapshot,
} from "@/src/lib/types/spacex";
import { fetchUpstream, handleRoute } from "@/src/lib/upstream";

const BASE = "https://api.spacexdata.com/v4";

export const revalidate = 1800; // 30min — manifest de lançamentos muda raramente

export async function GET() {
  return handleRoute(
    {
      tag: "SPACEX",
      fallbackMessage:
        "Falha ao estabelecer downlink com Hawthorne. Tente novamente.",
    },
    async () => {
      // Tolerância individual: cada call pode falhar sem derrubar o snapshot
      const [next, latest, upcoming, recent, rockets, launchpads] =
        await Promise.all([
          fetchUpstream<SpacexLaunch>(`${BASE}/launches/next`).catch(() => null),
          fetchUpstream<SpacexLaunch>(`${BASE}/launches/latest`).catch(() => null),
          fetchUpstream<{ docs: SpacexLaunch[] }>(`${BASE}/launches/query`, {
            method: "POST",
            data: {
              query: { upcoming: true },
              options: { sort: { date_unix: "asc" }, limit: 6 },
            },
          })
            .then((r) => r.docs)
            .catch(() => [] as SpacexLaunch[]),
          fetchUpstream<{ docs: SpacexLaunch[] }>(`${BASE}/launches/query`, {
            method: "POST",
            data: {
              query: { upcoming: false },
              options: { sort: { date_unix: "desc" }, limit: 6 },
            },
          })
            .then((r) => r.docs)
            .catch(() => [] as SpacexLaunch[]),
          fetchUpstream<SpacexRocket[]>(`${BASE}/rockets`).catch(
            () => [] as SpacexRocket[],
          ),
          fetchUpstream<SpacexLaunchpad[]>(`${BASE}/launchpads`).catch(
            () => [] as SpacexLaunchpad[],
          ),
        ]);

      const snapshot: SpacexSnapshot = {
        next,
        latest,
        upcoming,
        recent,
        rockets,
        launchpads,
      };
      return snapshot;
    },
  );
}
