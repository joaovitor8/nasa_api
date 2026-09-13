"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowDownAZ,
  Search,
  ShieldAlert,
  ShieldCheck,
  Target,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { SentryObject, SentryResponse } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("cneos")!;

const fetchSentry = async (): Promise<SentryResponse> => {
  const res = await axios.get<SentryResponse>("/api/cneos");
  return res.data;
};

type ThreatTier = {
  label: string;
  width: string;
  color: string;
  glow: string;
};

const tierFromPalermo = (psStr: string): ThreatTier => {
  const ps = parseFloat(psStr);
  if (isNaN(ps) || ps < -4) return { label: "Mínimo", width: "25%", color: "oklch(0.6 0.02 260)", glow: "transparent" };
  if (ps < -2) return { label: "Baixo", width: "50%", color: "oklch(0.78 0.16 80)", glow: "oklch(0.78 0.16 80 / 0.4)" };
  if (ps < 0) return { label: "Elevado", width: "75%", color: "oklch(0.72 0.18 35)", glow: "oklch(0.72 0.18 35 / 0.5)" };
  return { label: "Crítico", width: "100%", color: "oklch(0.65 0.22 25)", glow: "oklch(0.65 0.22 25 / 0.6)" };
};

type SortKey = "ps" | "prob";

export default function CneosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("ps");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cneos-sentry"],
    queryFn: fetchSentry,
  });

  const objects = useMemo<SentryObject[]>(() => {
    if (!data?.objects) return [];
    const term = searchTerm.toLowerCase();
    return data.objects
      .filter((o) => o.des.toLowerCase().includes(term))
      .sort((a, b) =>
        sortBy === "ps"
          ? parseFloat(b.ps_cum) - parseFloat(a.ps_cum)
          : parseFloat(b.ip) - parseFloat(a.ip),
      );
  }, [data, searchTerm, sortBy]);

  const criticals = useMemo(
    () => data?.objects?.filter((o) => parseFloat(o.ps_cum) > 0).length ?? 0,
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
              <ShieldAlert className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Defesa Planetária
              </h1>
              <p className="text-sm flex items-center gap-2 font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                <Target className="w-3.5 h-3.5" /> Sentry Impact Risk Matrix
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Designação do objeto…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono text-sm"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              onClick={() => setSortBy(sortBy === "ps" ? "prob" : "ps")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-[0.2em] transition-colors"
            >
              <ArrowDownAZ className="w-4 h-4" />
              {sortBy === "ps" ? "Palermo Cum." : "Probabilidade"}
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        {data && !error && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <HudPanel label="Ameaças Ativas" badge={<Activity className="w-4 h-4 text-muted-foreground/40" />}>
              <span className="text-3xl font-bold font-mono tabular-nums" style={{ color: "var(--module-accent)" }}>
                {data.count}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Objetos no catálogo Sentry.</p>
            </HudPanel>

            <HudPanel
              label="Risco Crítico (PS > 0)"
              badge={
                criticals > 0 ? (
                  <span className="text-[10px] font-mono tracking-widest text-destructive">ALERT</span>
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400/70" />
                )
              }
            >
              <span className={`text-3xl font-bold font-mono tabular-nums ${criticals > 0 ? "text-destructive" : "text-emerald-400"}`}>
                {criticals}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Trajetórias com escala Palermo positiva.
              </p>
            </HudPanel>

            <HudPanel label="Origem dos Dados">
              <p className="text-sm font-mono text-foreground/90">{data.signature.source}</p>
              <p className="text-[10px] font-mono text-muted-foreground/70 mt-1">
                v.{data.signature.version}
              </p>
            </HudPanel>
          </div>
        )}

        {/* Estados */}
        {error && (
          <CommsFailure
            message="Sistema de alerta indisponível. Não é possível calcular rotas de colisão."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <TelemetrySpinner
            label="MATRIZ SENTRY"
            phases={[
              "Calculando trajetórias de impacto",
              "Aplicando perturbações gravitacionais",
              "Compilando escalas Palermo / Torino",
              "Indexando ameaças ativas",
            ]}
          />
        )}

        {/* Tabela */}
        {!isLoading && !error && objects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                    <th className="p-5 font-medium">Designação</th>
                    <th className="p-5 font-medium">Janela</th>
                    <th className="p-5 font-medium hidden md:table-cell">Impactos</th>
                    <th className="p-5 font-medium hidden lg:table-cell">V∞</th>
                    <th className="p-5 font-medium">Probabilidade</th>
                    <th className="p-5 font-medium w-72">Escala Palermo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {objects.map((obj, i) => {
                      const tier = tierFromPalermo(obj.ps_cum);
                      const probPct = (parseFloat(obj.ip) * 100).toFixed(6);

                      return (
                        <motion.tr
                          key={obj.des}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (i % 15) * 0.03 }}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="p-5">
                            <div className="font-mono font-bold text-foreground text-base">
                              {obj.des}
                            </div>
                            <div className="text-[10px] text-muted-foreground/70 font-mono mt-1">
                              Ø {obj.diameter ? `${obj.diameter} km` : "indeterminado"}
                            </div>
                          </td>
                          <td className="p-5 font-mono text-sm text-muted-foreground">
                            {obj.range}
                          </td>
                          <td className="p-5 font-mono text-sm text-muted-foreground hidden md:table-cell tabular-nums">
                            {obj.n_imp}
                          </td>
                          <td className="p-5 font-mono text-sm text-muted-foreground hidden lg:table-cell tabular-nums">
                            {obj.v_inf} <span className="text-[10px]">km/s</span>
                          </td>
                          <td className="p-5">
                            <div className="font-mono text-sm tabular-nums">{obj.ip}</div>
                            <div className="text-[10px] text-muted-foreground/70 font-mono mt-1">
                              {probPct}%
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono" style={{ color: tier.color }}>
                                {tier.label}
                              </span>
                              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                                {obj.ps_cum}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: tier.width,
                                  background: tier.color,
                                  boxShadow: `0 0 12px ${tier.glow}`,
                                }}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </ModuleScope>
  );
}
