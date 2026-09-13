"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Calendar, Gauge, ThermometerSun, Wind } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("mars")!;

interface SensorReading { av: number; mn: number; mx: number }
interface SolReading {
  AT?: SensorReading;
  HWS?: SensorReading;
  PRE?: SensorReading;
  First_UTC: string;
  Season: string;
}
interface MarsResponse {
  sol_keys?: string[];
  [sol: string]: SolReading | string[] | unknown;
}

const fetchMars = async (): Promise<MarsResponse> => {
  const res = await axios.get<MarsResponse>("/api/mars");
  return res.data;
};

export default function MarsPage() {
  const { locale } = useLocale();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["mars-weather"],
    queryFn: fetchMars,
    staleTime: Infinity,
  });

  const sols = useMemo(() => data?.sol_keys ?? [], [data]);
  const [activeSol, setActiveSol] = useState<string | null>(null);

  useEffect(() => {
    if (sols.length === 0 || activeSol) return;
    const raf = requestAnimationFrame(() => setActiveSol(sols[sols.length - 1]));
    return () => cancelAnimationFrame(raf);
  }, [sols, activeSol]);

  const sol = activeSol && data ? (data[activeSol] as SolReading | undefined) : null;
  const dateLabel = sol ? new Date(sol.First_UTC).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR") : "";

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
              <ThermometerSun className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                Elysium Planitia · 1.440 sols
              </p>
            </div>
          </div>

          {sol && (
            <div className="flex flex-col items-end gap-1">
              <div
                className="px-3 py-1.5 rounded-md border text-xs font-mono font-bold tracking-widest tabular-nums"
                style={{
                  background: "var(--module-accent-soft)",
                  color: "var(--module-accent)",
                  borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                }}
              >
                SOL {activeSol}
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> {dateLabel}
              </span>
            </div>
          )}
        </motion.div>

        {error && (
          <CommsFailure
            message={locale === "en" ? "Sandstorm severed the lander uplink." : "Tempestade de areia bloqueou a transmissão do lander."}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <TelemetrySpinner
            label="INSIGHT · ELYSIUM PLANITIA"
            phases={
              locale === "en"
                ? ["Aligning Deep Space Network", "Decoding TWINS sensors", "Compiling sol archive"]
                : ["Alinhando Deep Space Network", "Decodificando sensores TWINS", "Compilando arquivo de sols"]
            }
          />
        )}

        {sol && !error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8"
          >
            {/* Temperatura central */}
            <HudPanel
              label={locale === "en" ? "Atmospheric Temperature" : "Temperatura Atmosférica"}
              badge={
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground capitalize">
                  {sol.Season}
                </span>
              }
              className="lg:col-span-8"
              variant="solid"
            >
              <div className="flex flex-col md:flex-row items-end gap-10">
                <div className="flex items-start">
                  <span className="text-7xl md:text-[120px] font-bold tracking-tighter leading-none" style={{ color: "var(--module-accent)" }}>
                    {sol.AT ? Math.round(sol.AT.av) : "—"}
                  </span>
                  <span className="text-3xl md:text-5xl font-light text-muted-foreground mt-2">°C</span>
                </div>
                {sol.AT && (
                  <div className="flex gap-8 pb-4 font-mono">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-1 mb-1">
                        <ArrowUp className="w-3 h-3" /> Max
                      </span>
                      <span className="text-2xl font-bold" style={{ color: "var(--module-accent)" }}>
                        {Math.round(sol.AT.mx)}°
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-1 mb-1">
                        <ArrowDown className="w-3 h-3 text-blue-400" /> Min
                      </span>
                      <span className="text-2xl font-bold text-blue-400">
                        {Math.round(sol.AT.mn)}°
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </HudPanel>

            {/* Vento + Pressão */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <HudPanel
                label={locale === "en" ? "Wind Speed" : "Velocidade do Vento"}
                badge={<Wind className="w-4 h-4" style={{ color: "var(--module-accent)" }} />}
              >
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-mono font-bold tabular-nums" style={{ color: "var(--module-accent)" }}>
                    {sol.HWS ? sol.HWS.av.toFixed(1) : "—"}
                  </span>
                  {sol.HWS && <span className="text-sm text-muted-foreground mb-1">m/s</span>}
                </div>
              </HudPanel>

              <HudPanel
                label={locale === "en" ? "Atmospheric Pressure" : "Pressão Atmosférica"}
                badge={<Gauge className="w-4 h-4" style={{ color: "var(--module-accent)" }} />}
              >
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-mono font-bold tabular-nums" style={{ color: "var(--module-accent)" }}>
                    {sol.PRE ? Math.round(sol.PRE.av) : "—"}
                  </span>
                  {sol.PRE && <span className="text-sm text-muted-foreground mb-1">Pa</span>}
                </div>
              </HudPanel>
            </div>
          </motion.div>
        )}

        {sols.length > 0 && (
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 mb-3">
              {locale === "en" ? "Available Records" : "Registros Disponíveis"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sols.map((s) => {
                const active = activeSol === s;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSol(s)}
                    className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all border"
                    style={
                      active
                        ? {
                            background: "var(--module-accent-soft)",
                            color: "var(--module-accent)",
                            borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
                            boxShadow: "var(--module-glow)",
                          }
                        : {
                            background: "rgba(255,255,255,0.02)",
                            color: "var(--muted-foreground)",
                            borderColor: "rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    SOL {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ModuleScope>
  );
}
