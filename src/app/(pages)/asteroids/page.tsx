"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Target,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { NeoFeedResponse, NearEarthObject } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  DataMatrix,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
  type DataPoint,
} from "@/src/components/hud";

const MODULE = getModule("asteroids")!;

const fetchAsteroids = async (date: string): Promise<NearEarthObject[]> => {
  if (!date) return [];
  const res = await axios.get<NeoFeedResponse>(`/api/asteroids?date=${date}`);
  return res.data.near_earth_objects[date] ?? [];
};

const today = new Date().toISOString().split("T")[0];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } },
};

const fmt = (v: number, digits = 0) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: digits });

export default function AsteroidsPage() {
  const [tempDate, setTempDate] = useState(today);
  const [searchDate, setSearchDate] = useState(today);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["asteroids", searchDate],
    queryFn: () => fetchAsteroids(searchDate),
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const hazardous = data.filter((a) => a.is_potentially_hazardous_asteroid).length;
    const closest = data.reduce<NearEarthObject | null>((min, a) => {
      const km = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? "Infinity");
      const minKm = min ? parseFloat(min.close_approach_data[0]?.miss_distance.kilometers ?? "Infinity") : Infinity;
      return km < minKm ? a : min;
    }, null);
    return { total: data.length, hazardous, closest };
  }, [data]);

  const handleSearch = () => {
    if (tempDate) setSearchDate(tempDate);
  };

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
              <Radar className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                {MODULE.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Objetos Próximos à Terra (NeoWs) — Varredura por data.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="date"
              max={today}
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-black/40 text-foreground text-sm border border-white/10 rounded-l-full pl-5 pr-3 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono cursor-pointer"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || isFetching || !tempDate}
              className="text-[10px] font-mono tracking-[0.3em] uppercase px-5 py-2.5 rounded-r-full font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "var(--module-accent)",
                color: "oklch(0.05 0 0)",
              }}
            >
              Rastrear <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats overview */}
        {stats && !error && !isLoading && !isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <HudPanel label="Janela" badge={
              <span className="text-xs font-mono" style={{ color: "var(--module-accent)" }}>
                {searchDate}
              </span>
            }>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold font-mono tabular-nums" style={{ color: "var(--module-accent)" }}>
                  {stats.total}
                </span>
                <Activity className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Objetos detectados em janela de 24h.
              </p>
            </HudPanel>

            <HudPanel
              label="Ameaça Cinética"
              badge={
                stats.hazardous > 0 ? (
                  <span className="text-[10px] font-mono tracking-widest text-destructive">
                    HAZARD
                  </span>
                ) : (
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400">
                    NOMINAL
                  </span>
                )
              }
            >
              <div className="flex items-end justify-between">
                <span
                  className={`text-3xl font-bold font-mono tabular-nums ${stats.hazardous > 0 ? "text-destructive" : ""}`}
                  style={stats.hazardous === 0 ? { color: "var(--module-accent)" } : undefined}
                >
                  {stats.hazardous}
                </span>
                {stats.hazardous > 0 ? (
                  <ShieldAlert className="w-7 h-7 text-destructive/60" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-emerald-400/60" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Objetos classificados como potencialmente perigosos.
              </p>
            </HudPanel>

            <HudPanel label="Aproximação Mínima">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums truncate" style={{ color: "var(--module-accent)" }}>
                  {stats.closest
                    ? fmt(parseFloat(stats.closest.close_approach_data[0].miss_distance.kilometers))
                    : "—"}
                  <span className="text-xs ml-1 text-muted-foreground font-normal">km</span>
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {stats.closest?.name.replace(/[()]/g, "") ?? "—"}
                </span>
              </div>
            </HudPanel>
          </motion.div>
        )}

        {/* Estados */}
        {error && (
          <CommsFailure
            message="Não foi possível estabelecer conexão com a rede de monitoramento NEO."
            detail={`Endpoint: /api/asteroids?date=${searchDate}`}
            onRetry={() => refetch()}
          />
        )}

        {(isLoading || isFetching) && !error && (
          <TelemetrySpinner
            label="VARREDURA NEO EM ANDAMENTO"
            phases={[
              "Triangulando órbita terrestre",
              "Calculando velocidades relativas",
              "Estimando distâncias miss",
              "Compilando ameaças cinéticas",
            ]}
          />
        )}

        {/* Grid de objetos */}
        {!isLoading && !isFetching && !error && data && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {data.map((neo) => {
              const ca = neo.close_approach_data[0];
              const hazardous = neo.is_potentially_hazardous_asteroid;
              const sizeM = neo.estimated_diameter.meters.estimated_diameter_max;
              const velocity = parseFloat(ca?.relative_velocity.kilometers_per_hour ?? "0");
              const miss = parseFloat(ca?.miss_distance.kilometers ?? "0");
              const lunar = parseFloat(ca?.miss_distance.lunar ?? "0");

              const points: DataPoint[] = [
                { label: "Diâmetro", value: fmt(sizeM), unit: "m" },
                { label: "Velocidade", value: fmt(velocity), unit: "km/h" },
                { label: "Miss", value: fmt(miss), unit: "km" },
                { label: "Lunar", value: lunar.toFixed(2), unit: "LD" },
              ];

              return (
                <motion.div key={neo.id} variants={itemVariants}>
                  <HudPanel
                    className={hazardous ? "!border-destructive/40" : ""}
                    label={`ID-${neo.id}`}
                    badge={
                      hazardous ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-destructive/15 text-destructive border border-destructive/30">
                          <ShieldAlert className="w-3 h-3" /> Hazard
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase border" style={{ background: "var(--module-accent-soft)", color: "var(--module-accent)", borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)" }}>
                          <ShieldCheck className="w-3 h-3" /> Safe
                        </span>
                      )
                    }
                  >
                    <h3 className="font-serif font-bold text-lg leading-tight mb-1 truncate">
                      {neo.name.replace(/[()]/g, "")}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> Mag {neo.absolute_magnitude_h.toFixed(2)} · Aprox {ca?.close_approach_date}
                    </p>
                    <DataMatrix data={points} columns={2} />
                  </HudPanel>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </ModuleScope>
  );
}
