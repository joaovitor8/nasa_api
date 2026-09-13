"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Gauge,
  ThermometerSun,
  Wind,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import { CommsFailure, HudPanel, TelemetrySpinner } from "@/src/components/hud";

const MODULE = getModule("mars")!;

interface SensorReading {
  av: number;
  mn: number;
  mx: number;
}
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

/**
 * Ilha interativa do módulo Mars.
 *
 * O cabeçalho fica aqui, e não na casca server, porque depende de `useLocale()`.
 * A prosa didática e o JSON-LD vivem em `page.tsx`, renderizados no servidor.
 */
export function MarsConsole() {
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
  const dateLabel = sol
    ? new Date(sol.First_UTC).toLocaleDateString(locale === "en" ? "en-US" : "pt-BR")
    : "";

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end"
      >
        <div className="flex items-center gap-4">
          <div
            className="relative rounded-xl border p-3"
            style={{
              background: "var(--module-accent-soft)",
              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
            }}
          >
            <ThermometerSun
              className="h-7 w-7"
              style={{ color: "var(--module-accent)" }}
            />
            <div
              className="absolute inset-0 rounded-xl blur-md"
              style={{
                background: "var(--module-accent-soft)",
                animation: "hud-pulse 3s ease-in-out infinite",
              }}
            />
          </div>
          <div>
            <span className="block font-mono text-[10px] tracking-[0.3em] text-muted-foreground/70 uppercase">
              {MODULE.codename}
            </span>
            <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
              {pickLocale(MODULE.title, MODULE.titleEn, locale)}
            </h1>
            <p
              className="font-mono text-xs tracking-widest uppercase"
              style={{ color: "var(--module-accent)" }}
            >
              Elysium Planitia · 1.440 sols
            </p>
          </div>
        </div>

        {sol && (
          <div className="flex flex-col items-end gap-1">
            <div
              className="rounded-md border px-3 py-1.5 font-mono text-xs font-bold tracking-widest tabular-nums"
              style={{
                background: "var(--module-accent-soft)",
                color: "var(--module-accent)",
                borderColor:
                  "color-mix(in oklch, var(--module-accent) 30%, transparent)",
              }}
            >
              SOL {activeSol}
            </div>
            <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
              <Calendar className="h-3 w-3" /> {dateLabel}
            </span>
          </div>
        )}
      </motion.div>

      {error && (
        <CommsFailure
          message={
            locale === "en"
              ? "Sandstorm severed the lander uplink."
              : "Tempestade de areia bloqueou a transmissão do lander."
          }
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <TelemetrySpinner
          label="INSIGHT · ELYSIUM PLANITIA"
          phases={
            locale === "en"
              ? [
                  "Aligning Deep Space Network",
                  "Decoding TWINS sensors",
                  "Compiling sol archive",
                ]
              : [
                  "Alinhando Deep Space Network",
                  "Decodificando sensores TWINS",
                  "Compilando arquivo de sols",
                ]
          }
        />
      )}

      {sol && !error && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12"
        >
          {/* Temperatura central */}
          <HudPanel
            label={
              locale === "en" ? "Atmospheric Temperature" : "Temperatura Atmosférica"
            }
            badge={
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase capitalize">
                {sol.Season}
              </span>
            }
            className="lg:col-span-8"
            variant="solid"
          >
            <div className="flex flex-col items-end gap-10 md:flex-row">
              <div className="flex items-start">
                <span
                  className="text-7xl leading-none font-bold tracking-tighter md:text-[120px]"
                  style={{ color: "var(--module-accent)" }}
                >
                  {sol.AT ? Math.round(sol.AT.av) : "—"}
                </span>
                <span className="mt-2 text-3xl font-light text-muted-foreground md:text-5xl">
                  °C
                </span>
              </div>
              {sol.AT && (
                <div className="flex gap-8 pb-4 font-mono">
                  <div>
                    <span className="mb-1 flex items-center gap-1 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                      <ArrowUp className="h-3 w-3" /> Max
                    </span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--module-accent)" }}
                    >
                      {Math.round(sol.AT.mx)}°
                    </span>
                  </div>
                  <div>
                    <span className="mb-1 flex items-center gap-1 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                      <ArrowDown className="h-3 w-3 text-blue-400" /> Min
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
          <div className="flex flex-col gap-4 lg:col-span-4">
            <HudPanel
              label={locale === "en" ? "Wind Speed" : "Velocidade do Vento"}
              badge={
                <Wind className="h-4 w-4" style={{ color: "var(--module-accent)" }} />
              }
            >
              <div className="flex items-end gap-2">
                <span
                  className="font-mono text-4xl font-bold tabular-nums"
                  style={{ color: "var(--module-accent)" }}
                >
                  {sol.HWS ? sol.HWS.av.toFixed(1) : "—"}
                </span>
                {sol.HWS && (
                  <span className="mb-1 text-sm text-muted-foreground">m/s</span>
                )}
              </div>
            </HudPanel>

            <HudPanel
              label={locale === "en" ? "Atmospheric Pressure" : "Pressão Atmosférica"}
              badge={
                <Gauge className="h-4 w-4" style={{ color: "var(--module-accent)" }} />
              }
            >
              <div className="flex items-end gap-2">
                <span
                  className="font-mono text-4xl font-bold tabular-nums"
                  style={{ color: "var(--module-accent)" }}
                >
                  {sol.PRE ? Math.round(sol.PRE.av) : "—"}
                </span>
                {sol.PRE && (
                  <span className="mb-1 text-sm text-muted-foreground">Pa</span>
                )}
              </div>
            </HudPanel>
          </div>
        </motion.div>
      )}

      {sols.length > 0 && (
        <div>
          <h3 className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/70 uppercase">
            {locale === "en" ? "Available Records" : "Registros Disponíveis"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {sols.map((s) => {
              const active = activeSol === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveSol(s)}
                  className="rounded-lg border px-4 py-2 font-mono text-xs tracking-wider transition-all"
                  style={
                    active
                      ? {
                          background: "var(--module-accent-soft)",
                          color: "var(--module-accent)",
                          borderColor:
                            "color-mix(in oklch, var(--module-accent) 35%, transparent)",
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
  );
}
