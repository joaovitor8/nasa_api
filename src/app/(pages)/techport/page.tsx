"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ExternalLink, FlaskConical, Search } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { TechPortProject } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("techport")!;

const fetchTechport = async (): Promise<TechPortProject[]> => {
  const r = await axios.get<TechPortProject[]>("/api/techport");
  return r.data;
};

const TRL_LABELS = [
  "—",
  "Princípio Básico",
  "Conceito Formulado",
  "Prova Experimental",
  "Validação em Lab",
  "Validação em Ambiente Relevante",
  "Demonstração em Ambiente Relevante",
  "Demonstração em Ambiente Operacional",
  "Sistema Completo",
  "Operação Comprovada em Voo",
];

export default function TechPortPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["techport"],
    queryFn: fetchTechport,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const t = searchTerm.toLowerCase();
    return data.filter(
      (p) =>
        p.title.toLowerCase().includes(t) ||
        p.responsibleProgram?.toLowerCase().includes(t),
    );
  }, [data, searchTerm]);

  const selected = useMemo(() => {
    if (filtered.length === 0) return null;
    if (selectedId) {
      const f = filtered.find((p) => String(p.id) === selectedId);
      if (f) return f;
    }
    return filtered[0];
  }, [filtered, selectedId]);

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-[100rem] mx-auto w-full">
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
              <Cpu className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Blueprints de P&amp;D
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                <FlaskConical className="w-3.5 h-3.5" /> NASA TechPort
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar tecnologia ou programa…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono text-sm"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {error && (
          <CommsFailure
            message="Falha ao acessar os esquemas técnicos do Diretório de Pesquisa."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <TelemetrySpinner
            label="TECHPORT INDEX"
            phases={[
              "Indexando portfólio R&D",
              "Carregando esquemas técnicos",
              "Calculando níveis de maturidade",
            ]}
          />
        )}

        {!isLoading && !error && data && (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Lista */}
            <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md max-h-[80vh]">
              <div className="p-4 border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] flex justify-between text-muted-foreground">
                <span>Portfolio</span>
                <span style={{ color: "var(--module-accent)" }}>{filtered.length} projetos</span>
              </div>
              <div className="grow overflow-y-auto p-2 space-y-1">
                {filtered.map((p) => {
                  const active = selected?.id === p.id;
                  const trlEnd = p.endTrl ?? p.startTrl ?? 0;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(String(p.id))}
                      className="w-full text-left p-3.5 rounded-xl transition-all group border"
                      style={
                        active
                          ? {
                              background: "var(--module-accent-soft)",
                              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
                            }
                          : { borderColor: "transparent" }
                      }
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className="font-mono font-bold text-sm leading-tight line-clamp-2"
                          style={active ? { color: "var(--module-accent)" } : undefined}
                        >
                          {p.title}
                        </h3>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                          style={{
                            color: "var(--module-accent)",
                            borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                          }}
                        >
                          TRL {trlEnd}
                        </span>
                      </div>
                      {p.responsibleProgram && (
                        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mt-1.5 line-clamp-1">
                          {p.responsibleProgram}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhe */}
            <div className="grow flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <HudPanel
                      label="Schematic"
                      badge={
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.25em] px-2 py-0.5 rounded border"
                          style={{
                            color: "var(--module-accent)",
                            borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                          }}
                        >
                          ID #{selected.id}
                        </span>
                      }
                    >
                      <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3">
                        {selected.title}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {selected.description ?? "Esquemas técnicos não publicados para este projeto."}
                      </p>

                      {/* TRL Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/80 mb-2">
                          <span>Maturidade Tecnológica (TRL)</span>
                          <span style={{ color: "var(--module-accent)" }}>
                            {selected.startTrl ?? "—"} → {selected.endTrl ?? "—"}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 9 }).map((_, i) => {
                            const level = i + 1;
                            const start = selected.startTrl ?? 0;
                            const end = selected.endTrl ?? start;
                            const inRange = level >= start && level <= end;
                            return (
                              <div
                                key={level}
                                className="grow h-2 rounded-sm"
                                style={{
                                  background: inRange
                                    ? "var(--module-accent)"
                                    : "color-mix(in oklch, var(--module-accent) 12%, transparent)",
                                  boxShadow: inRange ? "0 0 8px var(--module-accent-soft)" : "none",
                                }}
                              />
                            );
                          })}
                        </div>
                        {selected.endTrl && (
                          <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest mt-2">
                            Atual: {TRL_LABELS[selected.endTrl] ?? "—"}
                          </p>
                        )}
                      </div>

                      {selected.benefits && (
                        <div className="border-t border-white/5 pt-4">
                          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/80 block mb-2">
                            Benefícios
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selected.benefits}
                          </p>
                        </div>
                      )}

                      {(selected.startDateString || selected.endDateString || selected.responsibleProgram || selected.website) && (
                        <div className="border-t border-white/5 mt-4 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                          {selected.startDateString && (
                            <DetailItem label="Início" value={selected.startDateString} />
                          )}
                          {selected.endDateString && (
                            <DetailItem label="Conclusão" value={selected.endDateString} />
                          )}
                          {selected.responsibleProgram && (
                            <DetailItem
                              label="Programa"
                              value={selected.responsibleProgram}
                              span
                            />
                          )}
                          {selected.website && (
                            <a
                              href={selected.website}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 hover:underline"
                              style={{ color: "var(--module-accent)" }}
                            >
                              Página Oficial <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </HudPanel>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </ModuleScope>
  );
}

function DetailItem({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <span className="block text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70 mb-1">
        {label}
      </span>
      <span className="block">{value}</span>
    </div>
  );
}
