"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Camera,
  Flame,
  Image as ImageIcon,
  MapPin,
  Radar,
  Rocket,
  ShieldAlert,
  Sun,
  Timer,
} from "lucide-react";
import axios from "axios";

import { useT } from "@/src/lib/i18n";
import type { ApodData, SentryResponse, SolarFlare } from "@/src/lib/types/nasa";
import type { SpacexSnapshot } from "@/src/lib/types/spacex";
import {
  CommsFailure,
  HudPanel,
  TelemetrySpinner,
} from "@/src/components/hud";

/* ─── Fetchers ────────────────────────────────────────────────── */

const fetchApod = async () => (await axios.get<ApodData>("/api/apod")).data;
const fetchSpacex = async () => (await axios.get<SpacexSnapshot>("/api/spacex")).data;
const fetchSentry = async () => (await axios.get<SentryResponse>("/api/cneos")).data;

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};
const today = () => new Date().toISOString().split("T")[0];

const fetchFlares = async () =>
  (
    await axios.get<SolarFlare[]>(
      `/api/donki?startDate=${daysAgo(7)}&endDate=${today()}`,
    )
  ).data;

/* ─── Helpers ─────────────────────────────────────────────────── */

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
}

const computeCountdown = (target: number): Countdown => {
  const diff = target - Date.now();
  const past = diff < 0;
  const abs = Math.abs(diff);
  return {
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs / 3_600_000) % 24),
    minutes: Math.floor((abs / 60_000) % 60),
    seconds: Math.floor((abs / 1000) % 60),
    past,
  };
};
const pad = (n: number) => String(n).padStart(2, "0");

const tierColor = (cls: string): string => {
  const c = cls.charAt(0).toUpperCase();
  if (c === "X") return "oklch(0.65 0.22 25)";
  if (c === "M") return "oklch(0.72 0.18 35)";
  if (c === "C") return "oklch(0.78 0.16 80)";
  return "oklch(0.74 0.13 200)";
};

/* ─── Página ──────────────────────────────────────────────────── */

export default function MissionControlPage() {
  const t = useT();

  const apod = useQuery({ queryKey: ["mc-apod"], queryFn: fetchApod });
  const spacex = useQuery({ queryKey: ["mc-spacex"], queryFn: fetchSpacex });
  const sentry = useQuery({ queryKey: ["mc-sentry"], queryFn: fetchSentry });
  const flares = useQuery({ queryKey: ["mc-flares"], queryFn: fetchFlares });

  const isLoading = apod.isLoading || spacex.isLoading || sentry.isLoading || flares.isLoading;
  const allFailed = apod.isError && spacex.isError && sentry.isError && flares.isError;

  /* tick para countdown */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const intv = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(intv);
  }, []);
  void tick;

  const next = spacex.data?.next;
  const countdown = next ? computeCountdown(new Date(next.date_utc).getTime()) : null;

  const topThreat = useMemo(() => {
    const list = sentry.data?.objects ?? [];
    return list[0] ?? null;
  }, [sentry.data]);

  const latestFlare = useMemo(() => {
    const list = flares.data ?? [];
    if (list.length === 0) return null;
    // ordenar por beginTime desc
    return [...list].sort((a, b) =>
      new Date(b.beginTime).getTime() - new Date(a.beginTime).getTime(),
    )[0];
  }, [flares.data]);

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-8">
      {/* Glow ambiente */}
      <div
        aria-hidden
        className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-primary/[0.07] blur-[180px] -z-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 relative">
              <Radar className="w-7 h-7 text-primary" />
              <div
                className="absolute inset-0 rounded-xl blur-md bg-primary/15"
                style={{ animation: "hud-pulse 2.6s ease-in-out infinite" }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {t("mc.codename")}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                {t("mc.title")}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mt-1">
                {t("mc.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_oklch(0.78_0.18_145)]" />
            {t("mc.live")}
          </div>
        </motion.div>

        {allFailed && (
          <CommsFailure
            message="Falha sistêmica nas conexões. Reestabelecendo links."
            onRetry={() => {
              apod.refetch();
              spacex.refetch();
              sentry.refetch();
              flares.refetch();
            }}
          />
        )}

        {isLoading && !allFailed && (
          <TelemetrySpinner
            label="MISSION CONTROL"
            phases={[
              t("mc.loading"),
              "APOD · SpaceX · CNEOS · DONKI",
              "Sincronizando feeds",
            ]}
          />
        )}

        {!isLoading && !allFailed && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* APOD — destaque */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7"
            >
              <HudPanel
                label={t("mc.apod")}
                badge={
                  <Link
                    href="/apod"
                    className="text-[10px] font-mono uppercase tracking-[0.25em] flex items-center gap-1 text-amber-300 hover:underline"
                  >
                    {t("mc.openModule")} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                }
                className="h-full overflow-hidden"
              >
                {apod.data ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                      {apod.data.media_type === "image" ? (
                        <Image
                          src={apod.data.url}
                          alt={apod.data.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 40vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-xs uppercase tracking-widest">
                          <Camera className="w-6 h-6 mr-2 opacity-50" /> Vídeo
                        </div>
                      )}
                      <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-amber-200 bg-black/50 px-2 py-0.5 rounded backdrop-blur">
                        <ImageIcon className="w-3 h-3" /> {apod.data.date}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-serif text-2xl font-bold leading-tight mb-2">
                        {apod.data.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-6 leading-relaxed">
                        {apod.data.explanation}
                      </p>
                      {apod.data.copyright && (
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mt-3">
                          © {apod.data.copyright}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <EmptyState>{t("mc.empty")}</EmptyState>
                )}
              </HudPanel>
            </motion.div>

            {/* Próximo SpaceX — countdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-5"
            >
              <HudPanel
                label={t("mc.nextLaunch")}
                badge={
                  <Link
                    href="/spacex"
                    className="text-[10px] font-mono uppercase tracking-[0.25em] flex items-center gap-1 text-orange-300 hover:underline"
                  >
                    {t("mc.openModule")} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                }
                className="h-full"
              >
                {next && countdown ? (
                  <>
                    <div className="flex items-center gap-2 mb-2 text-orange-300">
                      <Rocket className="w-5 h-5" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                        Flight #{next.flight_number}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold leading-tight mb-3">
                      {next.name}
                    </h3>

                    <div className="grid grid-cols-4 gap-1.5 mb-4">
                      {[
                        ["DD", countdown.days],
                        ["HH", countdown.hours],
                        ["MM", countdown.minutes],
                        ["SS", countdown.seconds],
                      ].map(([label, val]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-orange-300/20 bg-orange-300/5 p-2 text-center"
                        >
                          <div className="text-2xl font-mono font-bold tabular-nums text-orange-300 leading-none">
                            {pad(val as number)}
                          </div>
                          <div className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground/70 mt-1.5">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-orange-300/70" />
                        {new Date(next.date_utc).toUTCString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-orange-300/70" />
                        {countdown.past ? "T+ Mission elapsed" : `${t("mc.tMinus")}${countdown.days}d ${pad(countdown.hours)}h`}
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState>{t("mc.empty")}</EmptyState>
                )}
              </HudPanel>
            </motion.div>

            {/* Sentry — top ameaça */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-6"
            >
              <HudPanel
                label={t("mc.sentry")}
                badge={
                  <Link
                    href="/cneos"
                    className="text-[10px] font-mono uppercase tracking-[0.25em] flex items-center gap-1 text-red-400 hover:underline"
                  >
                    {t("mc.openModule")} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                }
                className="h-full"
              >
                {topThreat ? (
                  <>
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <ShieldAlert className="w-5 h-5" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                        {topThreat.range}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold leading-tight mb-2">
                      {topThreat.fullname ?? topThreat.des}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <Stat
                        label="Palermo (cum)"
                        value={Number(topThreat.ps_cum).toFixed(2)}
                        accent="oklch(0.65 0.22 25)"
                      />
                      <Stat
                        label="Impactos"
                        value={topThreat.n_imp}
                        accent="oklch(0.72 0.18 35)"
                      />
                      <Stat
                        label="Ø km"
                        value={topThreat.diameter}
                        accent="oklch(0.78 0.16 80)"
                      />
                    </div>

                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mt-4">
                      v∞ {topThreat.v_inf} km/s · h={topThreat.h ?? "—"}
                    </p>
                  </>
                ) : (
                  <EmptyState>{t("mc.empty")}</EmptyState>
                )}
              </HudPanel>
            </motion.div>

            {/* DONKI — last flare */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-6"
            >
              <HudPanel
                label={t("mc.solar")}
                badge={
                  <Link
                    href="/donki"
                    className="text-[10px] font-mono uppercase tracking-[0.25em] flex items-center gap-1 text-yellow-300 hover:underline"
                  >
                    {t("mc.openModule")} <ArrowUpRight className="w-3 h-3" />
                  </Link>
                }
                className="h-full"
              >
                {latestFlare ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-lg"
                        style={{
                          background: `color-mix(in oklch, ${tierColor(latestFlare.classType)} 15%, transparent)`,
                          border: `1px solid color-mix(in oklch, ${tierColor(latestFlare.classType)} 35%, transparent)`,
                          color: tierColor(latestFlare.classType),
                          boxShadow: `0 0 16px color-mix(in oklch, ${tierColor(latestFlare.classType)} 25%, transparent)`,
                        }}
                      >
                        {latestFlare.classType.charAt(0)}
                      </div>
                      <div>
                        <div
                          className="text-2xl font-mono font-bold tabular-nums"
                          style={{ color: tierColor(latestFlare.classType) }}
                        >
                          {latestFlare.classType}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-1.5">
                          <Sun className="w-3 h-3" /> {latestFlare.sourceLocation || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-yellow-300/70" />
                        {new Date(latestFlare.beginTime).toUTCString()}
                      </div>
                      {latestFlare.endTime && (
                        <div className="flex items-center gap-2">
                          <Timer className="w-3.5 h-3.5 text-yellow-300/70" />
                          {Math.round(
                            (new Date(latestFlare.endTime).getTime() -
                              new Date(latestFlare.beginTime).getTime()) /
                              60_000,
                          )}{" "}
                          min
                        </div>
                      )}
                      {latestFlare.activeRegionNum && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-yellow-300/70" />
                          AR {latestFlare.activeRegionNum}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <EmptyState>
                    <Flame className="w-5 h-5 inline-block mr-2 opacity-50" />
                    {t("mc.empty")}
                  </EmptyState>
                )}
              </HudPanel>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-lg border bg-white/[0.02] p-2.5"
      style={{ borderColor: `color-mix(in oklch, ${accent} 25%, transparent)` }}
    >
      <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
        {label}
      </span>
      <span className="block font-mono font-bold text-lg tabular-nums" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-muted-foreground py-8 font-mono uppercase tracking-widest text-xs">
      {children}
    </p>
  );
}
