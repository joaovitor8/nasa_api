"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, Calendar, Flame, MapPin, Sun, Zap } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { SolarFlare } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("donki")!;

const fetchFlares = async (start: string, end: string): Promise<SolarFlare[]> => {
  const res = await axios.get<SolarFlare[]>(
    `/api/donki?startDate=${start}&endDate=${end}`,
  );
  return res.data;
};

const todayStr = () => new Date().toISOString().split("T")[0];
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

type FlareTier = {
  label: string;
  color: string;
  description: string;
};

const tierForClass = (cls: string): FlareTier => {
  const letter = cls.charAt(0).toUpperCase();
  switch (letter) {
    case "X":
      return {
        label: "X-Class",
        color: "oklch(0.65 0.22 25)",
        description: "Crítico — possíveis blackouts de rádio",
      };
    case "M":
      return {
        label: "M-Class",
        color: "oklch(0.72 0.18 35)",
        description: "Moderado — interferências em alta latitude",
      };
    case "C":
      return {
        label: "C-Class",
        color: "oklch(0.78 0.16 80)",
        description: "Baixo impacto — observação de rotina",
      };
    case "B":
      return {
        label: "B-Class",
        color: "oklch(0.74 0.13 200)",
        description: "Mínimo — nominal",
      };
    default:
      return {
        label: cls || "—",
        color: "oklch(0.6 0.02 260)",
        description: "Classe não identificada",
      };
  }
};

export default function DonkiPage() {
  const [days, setDays] = useState(7);

  const start = useMemo(() => daysAgo(days), [days]);
  const end = useMemo(() => todayStr(), []);

  const { data: flares, isLoading, error, refetch } = useQuery({
    queryKey: ["donki-flares", start, end],
    queryFn: () => fetchFlares(start, end),
  });

  const stats = useMemo(() => {
    if (!flares) return null;
    const byClass: Record<string, number> = { X: 0, M: 0, C: 0, B: 0 };
    flares.forEach((f) => {
      const c = f.classType.charAt(0).toUpperCase();
      if (c in byClass) byClass[c]++;
    });
    const peak = flares.reduce<SolarFlare | null>((max, f) => {
      const cls = f.classType.charAt(0);
      const ord = "BCMX".indexOf(cls);
      const maxOrd = max ? "BCMX".indexOf(max.classType.charAt(0)) : -1;
      return ord > maxOrd ? f : max;
    }, null);
    return { total: flares.length, byClass, peak };
  }, [flares]);

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
              <Sun className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                Clima Espacial
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                NASA DONKI · Solar Flare Watch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {[3, 7, 14, 30].map((n) => (
              <button
                key={n}
                onClick={() => setDays(n)}
                className="px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] transition-all"
                style={
                  days === n
                    ? {
                        background: "var(--module-accent-soft)",
                        color: "var(--module-accent)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {n}d
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        {stats && !error && !isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <HudPanel label="Total no Período" badge={<Activity className="w-4 h-4 text-muted-foreground/50" />}>
              <span className="text-3xl font-mono font-bold tabular-nums" style={{ color: "var(--module-accent)" }}>
                {stats.total}
              </span>
              <p className="text-xs text-muted-foreground mt-1">erupções detectadas</p>
            </HudPanel>

            {(["X", "M", "C", "B"] as const).map((c) => {
              const tier = tierForClass(c);
              const count = stats.byClass[c];
              return (
                <HudPanel
                  key={c}
                  label={tier.label}
                  badge={
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: tier.color, boxShadow: `0 0 8px ${tier.color}` }}
                    />
                  }
                >
                  <span
                    className="text-3xl font-mono font-bold tabular-nums"
                    style={{ color: count > 0 ? tier.color : "var(--muted-foreground)" }}
                  >
                    {count}
                  </span>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 line-clamp-1">
                    {tier.description}
                  </p>
                </HudPanel>
              );
            })}
          </div>
        )}

        {/* Estados */}
        {error && (
          <CommsFailure
            message="Interferência eletromagnética. Falha ao obter dados solares."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <TelemetrySpinner
            label="DONKI · SOLAR WATCH"
            phases={[
              "Sintonizando coronógrafos SDO",
              "Compilando classes M/X/C",
              "Triangulando regiões ativas",
            ]}
          />
        )}

        {/* Timeline */}
        {flares && flares.length > 0 && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.25em] flex justify-between items-center">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Flame className="w-3.5 h-3.5" /> Linha do Tempo de Erupções
              </span>
              <span style={{ color: "var(--module-accent)" }}>
                {start} → {end}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {flares
                .slice()
                .reverse()
                .map((flare) => {
                  const tier = tierForClass(flare.classType);
                  const begin = new Date(flare.beginTime);
                  return (
                    <div
                      key={flare.flrID}
                      className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors items-center"
                    >
                      {/* Class badge */}
                      <div className="col-span-3 md:col-span-2 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold"
                          style={{
                            background: `color-mix(in oklch, ${tier.color} 15%, transparent)`,
                            border: `1px solid color-mix(in oklch, ${tier.color} 35%, transparent)`,
                            color: tier.color,
                            boxShadow: `0 0 16px color-mix(in oklch, ${tier.color} 25%, transparent)`,
                          }}
                        >
                          {flare.classType.charAt(0)}
                        </div>
                        <span className="text-base font-mono font-bold tabular-nums" style={{ color: tier.color }}>
                          {flare.classType}
                        </span>
                      </div>

                      {/* Times */}
                      <div className="col-span-5 md:col-span-4 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {begin.toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {flare.endTime && (
                          <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                            Duração: {Math.round((new Date(flare.endTime).getTime() - begin.getTime()) / 60_000)} min
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="col-span-4 md:col-span-3 text-xs font-mono">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground/60" />
                          <span style={{ color: "var(--module-accent)" }}>{flare.sourceLocation || "—"}</span>
                        </div>
                        {flare.activeRegionNum && (
                          <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                            AR {flare.activeRegionNum}
                          </div>
                        )}
                      </div>

                      {/* Tier */}
                      <div className="hidden md:flex md:col-span-3 items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-[0.2em]">
                        <Zap className="w-3 h-3" style={{ color: tier.color }} />
                        <span style={{ color: tier.color }}>{tier.label}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {flares && flares.length === 0 && !error && !isLoading && (
          <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
            Sol nominal — nenhuma erupção registrada nesta janela.
          </p>
        )}
      </div>
    </ModuleScope>
  );
}
