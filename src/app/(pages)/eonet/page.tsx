"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CloudLightning,
  Filter,
  Flame,
  Globe2,
  MapPin,
  Mountain,
  Snowflake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("eonet")!;

interface Geometry {
  date: string;
  type: string;
  coordinates: number[];
}
interface EonetEvent {
  id: string;
  title: string;
  link: string;
  categories: { id: string; title: string }[];
  geometry: Geometry[];
}

const fetchEvents = async (days: number): Promise<EonetEvent[]> => {
  const res = await axios.get<EonetEvent[]>(`/api/eonet?days=${days}`);
  return res.data;
};

interface CategoryCfg { icon: LucideIcon; color: string; pt: string; en: string }
const CATEGORY_CFG: Record<string, CategoryCfg> = {
  wildfires:       { icon: Flame,          color: "oklch(0.65 0.22 25)",  pt: "Incêndios",   en: "Wildfires" },
  volcanoes:       { icon: Mountain,       color: "oklch(0.72 0.18 35)",  pt: "Vulcões",     en: "Volcanoes" },
  "severe-storms": { icon: CloudLightning, color: "oklch(0.74 0.13 200)", pt: "Tempestades", en: "Storms" },
  "sea-lake-ice":  { icon: Snowflake,      color: "oklch(0.78 0.10 230)", pt: "Gelo Polar",  en: "Polar Ice" },
};
const DEFAULT_CFG: CategoryCfg = { icon: AlertTriangle, color: "oklch(0.72 0.16 165)", pt: "Anomalia", en: "Anomaly" };

export default function EonetPage() {
  const { locale } = useLocale();
  const [days, setDays] = useState(30);
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["eonet", days],
    queryFn: () => fetchEvents(days),
  });

  const filtered = useMemo(
    () => data?.filter((e) => (activeCat ? e.categories[0]?.id === activeCat : true)) ?? [],
    [data, activeCat],
  );

  const availableCats = useMemo(
    () => Array.from(new Set(data?.map((e) => e.categories[0]?.id).filter(Boolean) ?? [])),
    [data],
  );

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto w-full">
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
              <Globe2 className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
              <div
                className="absolute inset-0 rounded-xl blur-md"
                style={{ background: "var(--module-accent-soft)", animation: "hud-pulse 3s ease-in-out infinite" }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                {pickLocale(MODULE.title, MODULE.titleEn, locale)}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                EONET · Earth Observatory Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {[7, 15, 30, 90].map((n) => (
              <button
                key={n}
                onClick={() => setDays(n)}
                className="px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] transition-all"
                style={
                  days === n
                    ? { background: "var(--module-accent-soft)", color: "var(--module-accent)" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {n}d
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <aside className="w-full lg:w-60 shrink-0">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-3">
              <Filter className="w-3.5 h-3.5" /> {locale === "en" ? "Classification" : "Classificação"}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveCat(null)}
                className="text-left px-4 py-2.5 rounded-lg text-sm transition-all border"
                style={
                  activeCat === null
                    ? { background: "var(--module-accent-soft)", color: "var(--module-accent)", borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)" }
                    : { background: "transparent", color: "var(--muted-foreground)", borderColor: "transparent" }
                }
              >
                {locale === "en" ? "All anomalies" : "Todas as anomalias"}
              </button>
              {availableCats.map((catId) => {
                const cfg = CATEGORY_CFG[catId] ?? DEFAULT_CFG;
                const Icon = cfg.icon;
                const active = activeCat === catId;
                return (
                  <button
                    key={catId}
                    onClick={() => setActiveCat(catId)}
                    className="text-left px-4 py-2.5 rounded-lg text-sm transition-all border flex items-center gap-2.5"
                    style={
                      active
                        ? { background: `color-mix(in oklch, ${cfg.color} 12%, transparent)`, color: cfg.color, borderColor: `color-mix(in oklch, ${cfg.color} 35%, transparent)` }
                        : { background: "transparent", color: "var(--muted-foreground)", borderColor: "transparent" }
                    }
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    {locale === "en" ? cfg.en : cfg.pt}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Feed */}
          <div className="grow">
            {error && (
              <CommsFailure
                message={locale === "en" ? "Lost link to Earth observation satellites." : "Perda de sinal com satélites de observação."}
                onRetry={() => refetch()}
              />
            )}
            {isLoading && (
              <TelemetrySpinner
                label="EONET · GEO-FEED"
                phases={
                  locale === "en"
                    ? ["Pinging observation satellites", "Triangulating active events", "Compiling regional anomalies"]
                    : ["Sondando satélites de observação", "Triangulando eventos ativos", "Compilando anomalias regionais"]
                }
              />
            )}
            {!isLoading && !error && filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
                {locale === "en" ? "No events under this filter." : "Nenhum evento neste filtro."}
              </p>
            )}

            {filtered.length > 0 && (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <AnimatePresence>
                  {filtered.map((event) => {
                    const cfg = CATEGORY_CFG[event.categories[0]?.id] ?? DEFAULT_CFG;
                    const Icon = cfg.icon;
                    const latest = event.geometry[event.geometry.length - 1];
                    const date = latest ? new Date(latest.date).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR") : "—";
                    const [lon, lat] = latest?.coordinates ?? [0, 0];
                    return (
                      <motion.a
                        layout
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={event.id}
                        className="block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                        style={{ borderColor: "rgba(255,255,255,0.08)" }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              background: `color-mix(in oklch, ${cfg.color} 12%, transparent)`,
                              color: cfg.color,
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                            {date}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold leading-snug mb-3 group-hover:text-foreground transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-muted-foreground">LAT</span>
                            <span className="ml-auto text-foreground/80 tabular-nums">{lat?.toFixed(2)}°</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">LON</span>
                            <span className="ml-auto text-foreground/80 tabular-nums">{lon?.toFixed(2)}°</span>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ModuleScope>
  );
}
