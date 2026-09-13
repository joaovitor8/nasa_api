/* ─── APOD ────────────────────────────────────────────────────── */
export interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
  service_version?: string;
}

/* ─── NeoWs (Asteroids feed) ─────────────────────────────────── */
export interface NeoEstimatedDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface NeoCloseApproach {
  close_approach_date: string;
  close_approach_date_full?: string;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
  };
  orbiting_body: string;
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: NeoEstimatedDiameter;
    meters: NeoEstimatedDiameter;
    miles: NeoEstimatedDiameter;
    feet: NeoEstimatedDiameter;
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: NeoCloseApproach[];
  is_sentry_object: boolean;
}

export interface NeoFeedResponse {
  element_count: number;
  near_earth_objects: Record<string, NearEarthObject[]>;
}

/* ─── CNEOS Sentry ────────────────────────────────────────────── */
export interface SentryObject {
  des: string;       // designation
  fullname?: string;
  ip: string;        // impact probability
  ts_max?: string;   // Torino Scale (max)
  ps_max?: string;   // Palermo Scale (max single)
  ps_cum: string;    // Palermo Scale (cumulative — usado no ranking)
  v_inf: string;     // velocity at infinity (km/s)
  h?: string;        // absolute magnitude
  diameter: string;  // km
  range: string;     // year window
  n_imp: string;     // number of potential impacts
  last_obs?: string;
}

export interface SentryResponse {
  count: string;
  signature: { source: string; version: string };
  objects: SentryObject[];
}

/* ─── EPIC ────────────────────────────────────────────────────── */
export interface EpicCoordinates {
  lat: number;
  lon: number;
}

export interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  date: string;
  centroid_coordinates: EpicCoordinates;
  dscovr_j2000_position: { x: number; y: number; z: number };
  lunar_j2000_position: { x: number; y: number; z: number };
  sun_j2000_position: { x: number; y: number; z: number };
}

/* ─── Exoplanet Archive (TAP) ─────────────────────────────────── */
export interface ExoplanetRow {
  pl_name: string;
  hostname: string;
  discoverymethod: string | null;
  disc_year: number | null;
  pl_rade: number | null;   // planetary radius — Earth radii
  pl_bmasse: number | null; // best-mass — Earth masses
  pl_orbper: number | null; // orbital period — days
  sy_dist: number | null;   // system distance — parsecs
}

/* ─── NASA Image & Video Library ──────────────────────────────── */
export interface LibraryItemData {
  title: string;
  description?: string;
  date_created: string;
  nasa_id: string;
  media_type: "image" | "video" | "audio";
  keywords?: string[];
  center?: string;
  photographer?: string;
}

export interface LibraryItemLink {
  href: string;
  rel: string;
  render?: string;
}

export interface LibraryItem {
  href: string;
  data: LibraryItemData[];
  links?: LibraryItemLink[];
}

/* ─── SSC Observatory ─────────────────────────────────────────── */
export interface Observatory {
  Id: string;
  Name: string;
  Resolution?: number;
  StartTime?: string;
  EndTime?: string;
  ResourceId?: string;
}

/* ─── TLE (ivanstanojevic.me) ─────────────────────────────────── */
export interface TleEntry {
  "@id": string;
  "@type": string;
  satelliteId: number;
  name: string;
  date: string;
  line1: string;
  line2: string;
}

/* ─── DONKI — Solar Flares ────────────────────────────────────── */
export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;       // ex: "M2.4", "X1.0", "C5.6"
  sourceLocation: string;  // ex: "N12W34"
  activeRegionNum?: number | null;
  link?: string;
  linkedEvents?: { activityID: string }[] | null;
}

/* ─── TechPort — R&D Projects ─────────────────────────────────── */
export interface TechPortProject {
  id: number | string;
  title: string;
  description?: string;
  benefits?: string;
  startDateString?: string;
  endDateString?: string;
  status?: string;
  /** Technology Readiness Level — numeric 1-9 */
  startTrl?: number | null;
  endTrl?: number | null;
  /** Sometimes the API exposes responsibleProgram or organization name */
  responsibleProgram?: string;
  responsibleMissionDirectorate?: string;
  website?: string;
}

/* ─── Erro padrão das rotas BFF ───────────────────────────────── */
export interface ApiError {
  error: string;
  /** Status HTTP do upstream (preservado quando aplicável: 404, 429, 403, ...) */
  code?: number;
}
