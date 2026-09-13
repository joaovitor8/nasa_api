"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Globe2,
  Orbit,
  Scale,
  Search,
  Wifi,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { ExoplanetRow } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  DataMatrix,
  ModuleScope,
  TelemetrySpinner,
  type DataPoint,
} from "@/src/components/hud";

const ExoplanetOrbitScene = dynamic(
  () => import("@/src/components/scenes/ExoplanetOrbitScene").then((m) => m.ExoplanetOrbitScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full border-2 border-dashed animate-spin-slow"
          style={{ borderColor: "var(--module-accent)" }}
        />
      </div>
    ),
  },
);

const MODULE = getModule("exoplanets")!;

const fetchExoplanets = async (): Promise<ExoplanetRow[]> => {
  const res = await axios.get<ExoplanetRow[]>("/api/exoplanets");
  return res.data;
};

export default function ExoplanetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exoplanets"],
    queryFn: fetchExoplanets,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const t = searchTerm.toLowerCase();
    return data.filter(
      (p) =>
        p.pl_name.toLowerCase().includes(t) ||
        p.hostname.toLowerCase().includes(t),
    );
  }, [data, searchTerm]);

  const selected = useMemo(() => {
    if (filtered.length === 0) return null;
    if (selectedId) {
      const found = filtered.find((p) => p.pl_name === selectedId);
      if (found) return found;
    }
    return filtered[0];
  }, [filtered, selectedId]);

  const tech: DataPoint[] = selected
    ? [
        {
          label: "Massa",
          value: selected.pl_bmasse?.toFixed(2) ?? "—",
          unit: "M⊕",
        },
        {
          label: "Raio",
          value: selected.pl_rade?.toFixed(2) ?? "—",
          unit: "R⊕",
        },
        {
          label: "Período",
          value: selected.pl_orbper?.toFixed(1) ?? "—",
          unit: "dias",
        },
        {
          label: "Distância",
          value: selected.sy_dist?.toFixed(0) ?? "—",
          unit: "pc",
        },
      ]
    : [];

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-[100rem] mx-auto w-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-2xl border backdrop-blur-md"
              style={{
                background: "var(--module-accent-soft)",
                borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
              }}
            >
              <Database className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Catálogo Exoplanetário
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                <Wifi className="w-3.5 h-3.5" /> NASA Exoplanet Archive
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar planeta ou estrela…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-11 pr-4 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors text-sm font-mono backdrop-blur-sm"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {error ? (
          <CommsFailure
            message="Sinal perdido. Não foi possível conectar ao banco estelar."
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <TelemetrySpinner
            label="DEEP CATALOG"
            phases={[
              "Conectando ao Caltech TAP",
              "Baixando registros confirmados",
              "Filtrando por flag default",
              "Compilando exoplanetas",
            ]}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 grow lg:h-[120vh]">
            {/* Lista */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] flex justify-between text-muted-foreground">
                <span>Registro</span>
                <span style={{ color: "var(--module-accent)" }}>{filtered.length} encontrados</span>
              </div>
              <div className="grow overflow-y-auto p-2 space-y-1">
                {filtered.map((p) => {
                  const active = selected?.pl_name === p.pl_name;
                  return (
                    <button
                      key={p.pl_name}
                      onClick={() => setSelectedId(p.pl_name)}
                      className="w-full text-left p-4 rounded-2xl transition-all flex justify-between items-center group border"
                      style={
                        active
                          ? {
                              background: "var(--module-accent-soft)",
                              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
                            }
                          : { borderColor: "transparent" }
                      }
                    >
                      <div className="overflow-hidden">
                        <h3
                          className="font-serif font-bold text-base truncate transition-colors"
                          style={active ? { color: "var(--module-accent)" } : undefined}
                        >
                          {p.pl_name}
                        </h3>
                        <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5 truncate">
                          ★ {p.hostname}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0">
                        {p.disc_year ?? "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhe */}
            <div className="w-full lg:w-2/3 xl:w-3/4 bg-black/40 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md flex flex-col relative overflow-hidden">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.pl_name}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-10 relative z-10">
                      <div>
                        <div
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 border"
                          style={{
                            background: "var(--module-accent-soft)",
                            color: "var(--module-accent)",
                            borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                          }}
                        >
                          <Globe2 className="w-3 h-3" />
                          Planeta Confirmado
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-2 leading-tight">
                          {selected.pl_name}
                        </h2>
                        <p className="text-muted-foreground text-base flex items-center gap-2">
                          <Orbit className="w-5 h-5" /> Orbitando ★ <span className="text-foreground font-medium">{selected.hostname}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] text-muted-foreground/70 font-mono uppercase tracking-[0.2em] mb-1">
                          Descoberto
                        </span>
                        <span className="text-3xl font-mono tabular-nums" style={{ color: "var(--module-accent)" }}>
                          {selected.disc_year ?? "—"}
                        </span>
                        {selected.discoverymethod && (
                          <span className="block text-[10px] text-muted-foreground mt-2 border-t border-white/10 pt-2 font-mono uppercase tracking-widest">
                            {selected.discoverymethod}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visualizador orbital 3D */}
                    <div className="relative my-6 grow min-h-[22rem] md:min-h-[28rem] rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40">
                      <ExoplanetOrbitScene
                        planet={selected}
                        accent={MODULE.theme.accent}
                      />
                      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/80">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: "var(--module-accent)" }}
                        />
                        Volume 3D · Drag para orbitar
                      </div>
                      <div className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: "var(--module-accent)" }}>
                        Live render
                      </div>
                    </div>

                    {/* Telemetria */}
                    <div className="mt-auto relative z-10">
                      <DataMatrix data={tech} columns={4} />
                      <div className="grid grid-cols-4 gap-px mt-2 text-[9px] font-mono text-muted-foreground/60 tracking-wider px-3">
                        <span>x Massa Terra</span>
                        <span>x Raio Terra</span>
                        <span>Período local</span>
                        <span>Parsecs</span>
                      </div>
                    </div>

                    <Scale className="absolute top-6 right-6 w-5 h-5 text-muted-foreground/30" />
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-mono uppercase tracking-widest">
                    Selecione um planeta para iniciar o escaneamento.
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
