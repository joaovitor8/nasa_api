"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Newspaper, Radio, Search, Star } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { NewsArticle } from "@/src/lib/types/news";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("news")!;

const fetchNews = async (q: string): Promise<NewsArticle[]> => {
  const params = q ? `?q=${encodeURIComponent(q)}&limit=24` : "?limit=24";
  const res = await axios.get<NewsArticle[]>(`/api/news${params}`);
  return res.data;
};

const timeAgo = (iso: string): string => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
};

export default function NewsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["news", searchQuery],
    queryFn: () => fetchNews(searchQuery),
  });

  const sources = useMemo(() => {
    if (!data) return [] as string[];
    return Array.from(new Set(data.map((a) => a.news_site))).slice(0, 8);
  }, [data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const busy = isLoading || isFetching;
  const featured = data?.find((a) => a.featured) ?? data?.[0];

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl border relative"
              style={{
                background: "var(--module-accent-soft)",
                borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
              }}
            >
              <Newspaper className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Comms Intercept
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                <Radio className="w-3.5 h-3.5" /> Spaceflight News API · Live Feed
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Filtrar transmissões…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono text-sm"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          </form>
        </motion.div>

        {/* Sources */}
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {sources.map((src) => (
              <span
                key={src}
                className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border"
                style={{
                  color: "var(--module-accent)",
                  borderColor: "color-mix(in oklch, var(--module-accent) 25%, transparent)",
                  background: "var(--module-accent-soft)",
                }}
              >
                {src}
              </span>
            ))}
          </div>
        )}

        {error && (
          <CommsFailure
            message="Interceptação interrompida. Falha ao decodificar feed de comunicações."
            onRetry={() => refetch()}
          />
        )}

        {busy && (
          <TelemetrySpinner
            label="COMMS INTERCEPT"
            phases={[
              "Sintonizando frequências da agência",
              "Decodificando transmissões",
              "Compilando intercepts globais",
            ]}
          />
        )}

        {!busy && !error && data && (
          <div className="flex flex-col gap-4">
            {/* Featured */}
            {featured && (
              <motion.a
                key={featured.id}
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="group block rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden hover:border-[var(--module-accent)]/50 transition-all"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-black overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Spaceflight News retorna URLs de domínios não controlados */}
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {featured.featured && (
                      <span
                        className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-1 rounded border backdrop-blur-md"
                        style={{
                          color: "var(--module-accent)",
                          borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)",
                          background: "oklch(0 0 0 / 0.6)",
                        }}
                      >
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-[0.25em]">
                      <span style={{ color: "var(--module-accent)" }}>{featured.news_site}</span>
                      <span className="text-muted-foreground">T-{timeAgo(featured.published_at)}</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-[var(--module-accent)] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 mb-4">
                      {featured.summary}
                    </p>
                    <span className="mt-auto flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em]" style={{ color: "var(--module-accent)" }}>
                      Abrir Transmissão <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            )}

            {/* Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.filter((a) => a.id !== featured?.id).map((article, i) => (
                <motion.a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 8) * 0.04 }}
                  className="group flex gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--module-accent)]/40 transition-all"
                >
                  <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Spaceflight News retorna URLs de domínios não controlados */}
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono uppercase tracking-[0.2em]">
                      <span style={{ color: "var(--module-accent)" }} className="truncate">
                        {article.news_site}
                      </span>
                      <span className="text-muted-foreground/70 shrink-0 ml-2">
                        T-{timeAgo(article.published_at)}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold leading-snug line-clamp-2 mb-2 group-hover:text-[var(--module-accent)] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {!busy && !error && data && data.length === 0 && (
          <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
            Sem transmissões para essa frequência.
          </p>
        )}
      </div>
    </ModuleScope>
  );
}
