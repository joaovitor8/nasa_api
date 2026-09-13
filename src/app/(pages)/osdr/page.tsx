"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ChevronUp, Dna, FlaskConical, Leaf, Microscope, Rocket, Search, TestTube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("osdr")!;

interface OsdrStudy {
  _id: string;
  _source: {
    Study_Title: string;
    Organism?: string;
    Flight_Program?: string;
    Description?: string;
    Project_Type?: string;
    Data_Types?: string;
  };
}

const fetchOsdr = async (q: string): Promise<OsdrStudy[]> => {
  const res = await axios.get<OsdrStudy[]>(`/api/osdr?q=${encodeURIComponent(q)}`);
  return res.data;
};

const stripHtml = (s?: string) => s ? s.replace(/<[^>]*>?/g, "") : "";

const organismIcon = (organism?: string): LucideIcon => {
  if (!organism) return Dna;
  const o = organism.toLowerCase();
  if (o.includes("arabidopsis") || o.includes("plant")) return Leaf;
  if (o.includes("mouse") || o.includes("mus musculus") || o.includes("human")) return Microscope;
  if (o.includes("microbiome") || o.includes("bacteria")) return FlaskConical;
  return Dna;
};

export default function OsdrPage() {
  const { locale } = useLocale();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("spaceflight");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["osdr", searchQuery],
    queryFn: () => fetchOsdr(searchQuery),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setExpandedId(null);
    }
  };

  const busy = isLoading || isFetching;

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center border-b border-white/10 pb-10 mb-10"
        >
          <div
            className="p-3 rounded-xl border relative mb-4"
            style={{
              background: "var(--module-accent-soft)",
              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
            }}
          >
            <TestTube className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            <div
              className="absolute inset-0 rounded-xl blur-md"
              style={{ background: "var(--module-accent-soft)", animation: "hud-pulse 3s ease-in-out infinite" }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70">
            {MODULE.codename}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mt-1 mb-2">
            {pickLocale(MODULE.title, MODULE.titleEn, locale)}
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
            Open Science Data Repository
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-xl mt-8 relative">
            <input
              type="text"
              placeholder={locale === "en" ? "Ex: Arabidopsis, Microgravity, Mice…" : "Ex: Arabidopsis, Microgravidade, Camundongos…"}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/40 text-foreground border border-white/10 rounded-full pl-5 pr-14 py-3 outline-none focus:border-[var(--module-accent)] transition-colors text-sm font-mono"
            />
            <button
              type="submit"
              disabled={busy}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "var(--module-accent-soft)", color: "var(--module-accent)" }}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {error && (
          <CommsFailure
            message={locale === "en" ? "Could not reach the bio repository." : "Não foi possível acessar o repositório biológico."}
            onRetry={() => refetch()}
          />
        )}

        {busy && !error && (
          <TelemetrySpinner
            label="OSDR · BIO-FEED"
            phases={
              locale === "en"
                ? ["Sequencing archives", "Filtering by organism", "Compiling dossiers"]
                : ["Sequenciando arquivos", "Filtrando por organismo", "Compilando dossiês"]
            }
          />
        )}

        {data && data.length === 0 && !busy && !error && (
          <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
            {locale === "en" ? "No bio-experiments found." : "Nenhum experimento biológico encontrado."}
          </p>
        )}

        {data && data.length > 0 && !busy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 px-1 mb-1">
              {data.length} {locale === "en" ? "experiments cataloged" : "experimentos catalogados"}
            </div>
            {data.map((study, i) => {
              const isExpanded = expandedId === study._id;
              const Icon = organismIcon(study._source.Organism);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  key={study._id}
                  className="border border-white/10 rounded-xl bg-white/[0.02] transition-all overflow-hidden"
                  style={isExpanded ? { borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)", boxShadow: "var(--module-glow)" } : {}}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : study._id)}
                    className="w-full text-left p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-3 grow">
                      <div className="p-2 rounded-lg mt-0.5" style={{ background: "var(--module-accent-soft)", color: "var(--module-accent)" }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base md:text-lg font-bold leading-snug mb-1.5" style={{ color: isExpanded ? "var(--module-accent)" : "var(--foreground)" }}>
                          {study._source.Study_Title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                          <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                            ID {study._id.replace("OSD-", "")}
                          </span>
                          {study._source.Organism && (
                            <span className="text-muted-foreground/80 normal-case tracking-normal">
                              {study._source.Organism}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 p-1.5 rounded-full" style={{ background: "var(--module-accent-soft)", color: "var(--module-accent)" }}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-6 pt-1 border-t border-white/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                            {study._source.Flight_Program && (
                              <div>
                                <span className="block text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.25em] mb-1">
                                  {locale === "en" ? "Mission" : "Missão"}
                                </span>
                                <span className="text-sm font-bold flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                                  <Rocket className="w-3.5 h-3.5" /> {study._source.Flight_Program}
                                </span>
                              </div>
                            )}
                            {study._source.Data_Types && (
                              <div>
                                <span className="block text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.25em] mb-1">
                                  {locale === "en" ? "Assay Type" : "Tipo de Ensaio"}
                                </span>
                                <span className="text-sm">{study._source.Data_Types}</span>
                              </div>
                            )}
                          </div>
                          <span className="block text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.25em] mb-2">
                            {locale === "en" ? "Abstract" : "Resumo"}
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 pl-4 text-justify" style={{ borderColor: "var(--module-accent)" }}>
                            {stripHtml(study._source.Description) || (locale === "en" ? "No abstract provided." : "Resumo não disponível.")}
                          </p>
                          <div className="mt-5 flex justify-end">
                            <a
                              href={`https://osdr.nasa.gov/bio/repo/data/studies/${study._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em]"
                              style={{ color: "var(--module-accent)" }}
                            >
                              {locale === "en" ? "Raw archive" : "Arquivo raw"} <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </ModuleScope>
  );
}
