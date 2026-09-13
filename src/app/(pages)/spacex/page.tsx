"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  ExternalLink,
  Flame,
  MapPin,
  Rocket,
  Timer,
  XCircle,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type {
  SpacexLaunchpad,
  SpacexRocket,
  SpacexSnapshot,
} from "@/src/lib/types/spacex";
import {
  CommsFailure,
  DataMatrix,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
  type DataPoint,
} from "@/src/components/hud";

const MODULE = getModule("spacex")!;

const fetchSpacex = async (): Promise<SpacexSnapshot> => {
  const r = await axios.get<SpacexSnapshot>("/api/spacex");
  return r.data;
};

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

export default function SpacexPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["spacex-snapshot"],
    queryFn: fetchSpacex,
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const padsById = useMemo<Record<string, SpacexLaunchpad>>(() => {
    if (!data?.launchpads) return {};
    return Object.fromEntries(data.launchpads.map((p) => [p.id, p]));
  }, [data]);

  const rocketsById = useMemo<Record<string, SpacexRocket>>(() => {
    if (!data?.rockets) return {};
    return Object.fromEntries(data.rockets.map((r) => [r.id, r]));
  }, [data]);

  const next = data?.next;
  const countdown = next ? computeCountdown(new Date(next.date_utc).getTime()) : null;
  void tick; // mantém o componente rerenderizando

  const activeRockets = useMemo(
    () => data?.rockets.filter((r) => r.active) ?? [],
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
              className="p-3 rounded-xl border"
              style={{
                background: "var(--module-accent-soft)",
                borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
              }}
            >
              <Rocket className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Frota SpaceX
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                Hawthorne · CA · Operação Privada
              </p>
            </div>
          </div>

          {data && next && (
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em]">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--module-accent)" }} />
              <span className="text-muted-foreground">Próximo: {next.name}</span>
            </div>
          )}
        </motion.div>

        {error && (
          <CommsFailure
            message="Falha ao estabelecer downlink com Hawthorne."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <TelemetrySpinner
            label="FALCON FLEET"
            phases={[
              "Sincronizando manifest de lançamentos",
              "Recuperando frota Falcon",
              "Compilando próximas missões",
            ]}
          />
        )}

        {data && next && countdown && (
          <>
            {/* NEXT LAUNCH — Hero */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <HudPanel
                label={countdown.past ? "T+ MISSION ELAPSED" : "T- COUNTDOWN"}
                badge={
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: "var(--module-accent)" }}>
                    Flight #{next.flight_number}
                  </span>
                }
                className="relative overflow-hidden"
              >
                <div
                  aria-hidden
                  className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                  style={{ background: "var(--module-accent-soft)" }}
                />

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Esquerda: missão */}
                  <div>
                    <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-3">
                      {next.name}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-5">
                      {next.details ?? "Detalhes da missão ainda não publicados."}
                    </p>

                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Flame className="w-4 h-4" style={{ color: "var(--module-accent)" }} />
                        <span>{rocketsById[next.rocket]?.name ?? "Rocket TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" style={{ color: "var(--module-accent)" }} />
                        <span>
                          {padsById[next.launchpad]?.full_name ?? "Pad TBD"} ·{" "}
                          {padsById[next.launchpad]?.region ?? ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="w-4 h-4" style={{ color: "var(--module-accent)" }} />
                        <span>{new Date(next.date_utc).toUTCString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direita: contagem */}
                  <div className="grid grid-cols-4 gap-2 relative">
                    {[
                      ["DIAS", countdown.days],
                      ["HORAS", countdown.hours],
                      ["MIN", countdown.minutes],
                      ["SEG", countdown.seconds],
                    ].map(([label, val]) => (
                      <div
                        key={label}
                        className="border border-white/10 rounded-xl p-3 text-center"
                        style={{ background: "color-mix(in oklch, var(--module-accent) 5%, transparent)" }}
                      >
                        <div
                          className="text-3xl md:text-4xl font-mono font-bold tabular-nums leading-none"
                          style={{ color: "var(--module-accent)" }}
                        >
                          {pad(val as number)}
                        </div>
                        <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-muted-foreground/70 mt-2">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {(next.links.webcast || next.links.wikipedia) && (
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                    {next.links.webcast && (
                      <a
                        href={next.links.webcast}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] hover:underline"
                        style={{ color: "var(--module-accent)" }}
                      >
                        Webcast <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {next.links.wikipedia && (
                      <a
                        href={next.links.wikipedia}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                      >
                        Wiki <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </HudPanel>
            </motion.section>

            {/* FLEET ATIVA */}
            {activeRockets.length > 0 && (
              <section className="mb-10">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" /> Frota Operacional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeRockets.map((r) => {
                    const points: DataPoint[] = [
                      { label: "Altura", value: r.height.meters?.toFixed(1) ?? "—", unit: "m" },
                      { label: "Massa", value: r.mass.kg ? (r.mass.kg / 1000).toFixed(0) : "—", unit: "t" },
                      { label: "Diâmetro", value: r.diameter.meters?.toFixed(1) ?? "—", unit: "m" },
                      { label: "Sucesso", value: r.success_rate_pct ?? "—", unit: "%" },
                    ];
                    return (
                      <HudPanel key={r.id} label={r.type.toUpperCase()}>
                        <h4 className="font-serif text-xl font-bold mb-2">{r.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                          {r.description}
                        </p>
                        <DataMatrix data={points} columns={2} />
                        {r.first_flight && (
                          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mt-3">
                            Primeiro voo: {r.first_flight}
                          </p>
                        )}
                      </HudPanel>
                    );
                  })}
                </div>
              </section>
            )}

            {/* MISSÕES RECENTES */}
            {data.recent.length > 0 && (
              <section>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 flex items-center gap-2">
                  <Timer className="w-3.5 h-3.5" /> Missões Recentes
                </h3>
                <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden divide-y divide-white/5">
                  {data.recent.map((m) => {
                    const ok = m.success === true;
                    const fail = m.success === false;
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {ok ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "var(--module-accent)" }} />
                          ) : fail ? (
                            <XCircle className="w-5 h-5 text-destructive shrink-0" />
                          ) : (
                            <Activity className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-mono font-bold truncate">{m.name}</div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 truncate">
                              {rocketsById[m.rocket]?.name ?? "—"} · {padsById[m.launchpad]?.region ?? ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono">{new Date(m.date_utc).toLocaleDateString("pt-BR")}</div>
                          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                            #{m.flight_number}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {data && !next && !error && !isLoading && (
          <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
            Nenhuma missão programada no momento.
          </p>
        )}
      </div>
    </ModuleScope>
  );
}
