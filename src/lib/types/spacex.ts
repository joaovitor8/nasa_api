/* ─── api.spacexdata.com/v4 ───────────────────────────────────── */

export interface SpacexLaunch {
  id: string;
  name: string;
  flight_number: number;
  date_utc: string;
  date_unix: number;
  upcoming: boolean;
  success: boolean | null;
  details: string | null;
  rocket: string;       // rocket id
  launchpad: string;    // launchpad id
  failures?: { time: number; altitude: number | null; reason: string }[];
  links: {
    patch?: { small: string | null; large: string | null };
    webcast?: string | null;
    article?: string | null;
    wikipedia?: string | null;
  };
}

export interface SpacexRocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  description: string;
  first_flight: string | null;
  height: { meters: number | null; feet: number | null };
  diameter: { meters: number | null; feet: number | null };
  mass: { kg: number | null; lb: number | null };
  cost_per_launch: number | null;
  success_rate_pct: number | null;
  flickr_images: string[];
  wikipedia: string | null;
}

export interface SpacexLaunchpad {
  id: string;
  name: string;
  full_name: string;
  locality: string;
  region: string;
  status: string;
}

/** Resposta agregada da nossa rota BFF /api/spacex */
export interface SpacexSnapshot {
  next: SpacexLaunch | null;
  latest: SpacexLaunch | null;
  upcoming: SpacexLaunch[];
  recent: SpacexLaunch[];
  rockets: SpacexRocket[];
  launchpads: SpacexLaunchpad[];
}
