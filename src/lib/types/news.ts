/* ─── api.spaceflightnewsapi.net/v4 ───────────────────────────── */

export interface NewsArticle {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  authors?: { name: string; socials?: unknown }[];
  launches?: { launch_id: string; provider: string }[];
  events?: { event_id: number; provider: string }[];
}

export interface NewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsArticle[];
}
