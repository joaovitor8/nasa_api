"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Calendar,
  Crosshair,
  LocateFixed,
  Orbit,
  Radio,
  Satellite,
  Search,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { Observatory } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  DataMatrix,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
  type DataPoint,
} from "@/src/components/hud";

const MODULE = getModule("ssc")!;

const fetchObservatories = async (): Promise<Observatory[]> => {
  const res = await axios.get<Observatory[]>("/api/ssc");
  return res.data;
};

const formatOrbitalDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString)
    .toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();
};

export default function SscPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ssc-observatories"],
    queryFn: fetchObservatories,
    staleTime: Infinity,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const t = searchTerm.toLowerCase();
    return data.filter(
      (s) =>
        s.Name.toLowerCase().includes(t) || s.Id.toLowerCase().includes(t),
    );
  }, [data, searchTerm]);

  const selected = useMemo(() => {
    if (filtered.length === 0) return null;
    if (selectedId) {
      const found = filtered.find((s) => s.Id === selectedId);
      if (found) return found;
    }
    return filtered[0];
  }, [filtered, selectedId]);

  const tech: DataPoint[] = selected
    ? [
        { label: "Lançamento", value: formatOrbitalDate(selected.StartTime) },
        { label: "Encerramento", value: formatOrbitalDate(selected.EndTime) },
        { label: "Resolução", value: selected.Resolution ?? "—", unit: "u" },
        { label: "Resource", value: selected.ResourceId ?? selected.Id },
      ]
    : [];

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-[100rem] mx-auto w-full flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/10 pb-6 shrink-0"
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl border relative"
              style={{
                background: "var(--module-accent-soft)",
                borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
              }}
            >
              <Satellite className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                Controle de Tráfego Orbital
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                <Radio className="w-3.5 h-3.5" /> Satellite Situation Center
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar sonda ou satélite…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono text-sm"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {error ? (
          <CommsFailure
            message="Sistema offline. Falha na resolução geocêntrica."
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <TelemetrySpinner
            label="ORBIT TRAFFIC"
            phases={[
              "Sincronizando coordenadas",
              "Catalogando frota ativa",
              "Triangulando observatórios",
            ]}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 grow min-h-0">
            {/* Lista */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] flex justify-between items-center">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Orbit className="w-3.5 h-3.5" /> Frota
                </span>
                <span
                  className="px-2 py-0.5 rounded border font-bold"
                  style={{
                    background: "var(--module-accent-soft)",
                    color: "var(--module-accent)",
                    borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                  }}
                >
                  {filtered.length}
                </span>
              </div>
              <div className="grow overflow-y-auto p-2 space-y-1">
                {filtered.map((sat) => {
                  const active = selected?.Id === sat.Id;
                  return (
                    <button
                      key={sat.Id}
                      onClick={() => setSelectedId(sat.Id)}
                      className="w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between group border"
                      style={
                        active
                          ? {
                              background: "var(--module-accent-soft)",
                              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
                              boxShadow: "inset 0 0 24px color-mix(in oklch, var(--module-accent) 10%, transparent)",
                            }
                          : { borderColor: "transparent" }
                      }
                    >
                      <div className="overflow-hidden">
                        <h3
                          className="font-mono font-bold text-sm truncate"
                          style={active ? { color: "var(--module-accent)" } : undefined}
                        >
                          {sat.Name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">
                          ID: {sat.Id}
                        </p>
                      </div>
                      {active && (
                        <LocateFixed className="w-4 h-4 shrink-0" style={{ color: "var(--module-accent)" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhe */}
            <div className="w-full lg:w-2/3 xl:w-3/4 flex flex-col gap-4 overflow-y-auto">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.Id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col xl:flex-row gap-4 h-full"
                  >
                    {/* Radar */}
                    <div className="w-full xl:w-1/2 bg-black/40 border border-white/10 rounded-2xl p-6 flex items-center justify-center relative min-h-[26rem] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[64, 48, 32].map((s) => (
                          <div
                            key={s}
                            className="absolute rounded-full border"
                            style={{
                              width: `${s * 4}px`,
                              height: `${s * 4}px`,
                              borderColor: `color-mix(in oklch, var(--module-accent) ${s / 2}%, transparent)`,
                            }}
                          />
                        ))}
                        <div
                          className="w-2 h-2 rounded-full absolute"
                          style={{
                            background: "var(--module-accent)",
                            boxShadow: "0 0 16px var(--module-accent)",
                          }}
                        />
                        <div
                          className="w-32 h-32 absolute top-1/2 left-1/2 origin-top-left animate-spin-slow"
                          style={{
                            borderLeft: "2px solid var(--module-accent)",
                            background: "linear-gradient(to bottom right, var(--module-accent-soft), transparent)",
                            opacity: 0.5,
                          }}
                        />
                      </div>

                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--module-accent)" }} />
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: "var(--module-accent)" }}>
                          Rastreando
                        </span>
                      </div>
                      <div className="absolute bottom-5 right-5 text-right">
                        <span className="block text-[9px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                          Alvo Atual
                        </span>
                        <span className="text-sm font-mono font-bold" style={{ color: "var(--module-accent)" }}>
                          {selected.Id}
                        </span>
                      </div>
                    </div>

                    {/* Telemetria */}
                    <div className="w-full xl:w-1/2 flex flex-col gap-4">
                      <HudPanel
                        label="Lock Estabelecido"
                        badge={
                          <Crosshair className="w-3.5 h-3.5" style={{ color: "var(--module-accent)" }} />
                        }
                      >
                        <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-3">
                          {selected.Name}
                        </h2>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-t border-white/5 pt-3">
                          Sistema integrado de situação de satélites
                        </p>
                      </HudPanel>

                      <DataMatrix data={tech} columns={2} />

                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70 px-1 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> Início Op.
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3 h-3" /> Fim Op.
                        </span>
                        <span>Resolução</span>
                        <span>Resource</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground font-mono uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-2xl">
                    Selecione uma sonda na frota para iniciar rastreio
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </ModuleScope>
  );
}
