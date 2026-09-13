"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Briefcase, Code2, Cpu, FileBadge, Lightbulb, Search } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("techtransfer")!;

type TechType = "patent" | "software" | "spinoff";

const fetchTech = async (type: TechType, q: string): Promise<string[][]> => {
  const res = await axios.get<string[][]>(`/api/techtransfer?type=${type}&q=${q}`);
  return res.data;
};

const stripHtml = (s: string) => s ? s.replace(/<[^>]*>?/g, "") : "";

const TABS: { id: TechType; pt: string; en: string; icon: typeof Code2 }[] = [
  { id: "software", pt: "Softwares Públicos", en: "Open Source", icon: Code2 },
  { id: "patent",   pt: "Patentes",           en: "Patents",     icon: FileBadge },
  { id: "spinoff",  pt: "Spinoffs",           en: "Spinoffs",    icon: Lightbulb },
];

export default function TechTransferPage() {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<TechType>("software");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["techtransfer", activeTab, searchQuery],
    queryFn: () => fetchTech(activeTab, searchQuery),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const busy = isLoading || isFetching;

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full">
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
            <Briefcase className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
            <div
              className="absolute inset-0 rounded-xl blur-md"
              style={{ background: "var(--module-accent-soft)", animation: "hud-pulse 3s ease-in-out infinite" }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70">
            {MODULE.codename}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mt-1 mb-3">
            {pickLocale(MODULE.title, MODULE.titleEn, locale)}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            {pickLocale(MODULE.description, MODULE.descriptionEn, locale)}
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-1 mt-8 bg-white/5 p-1 rounded-full border border-white/10">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] transition-all"
                  style={
                    active
                      ? { background: "var(--module-accent-soft)", color: "var(--module-accent)" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {locale === "en" ? tab.en : tab.pt}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mt-6 relative">
            <input
              type="text"
              placeholder={locale === "en" ? "Search: AI, propulsion, materials…" : "Buscar: IA, propulsão, materiais…"}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-black/40 text-foreground border border-white/10 rounded-full pl-11 pr-28 py-3 outline-none focus:border-[var(--module-accent)] transition-colors text-sm font-mono"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              disabled={busy}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "var(--module-accent)", color: "oklch(0.05 0 0)" }}
            >
              {locale === "en" ? "Query" : "Consultar"}
            </button>
          </form>
        </motion.div>

        {error && (
          <CommsFailure
            message={locale === "en" ? "Could not reach the IP registry." : "Falha ao acessar o registro de propriedade intelectual."}
            onRetry={() => refetch()}
          />
        )}

        {busy && !error && (
          <TelemetrySpinner
            label="TECHTRANSFER · QUERY"
            phases={
              locale === "en"
                ? ["Pinging patent index", "Filtering open-source repos", "Compiling tech briefs"]
                : ["Sondando índice de patentes", "Filtrando repositórios", "Compilando dossiês técnicos"]
            }
          />
        )}

        {data && data.length === 0 && !busy && !error && (
          <p className="text-center text-muted-foreground py-12 font-mono uppercase tracking-widest text-sm">
            {locale === "en" ? "No records for this query." : "Nenhum registro para esta busca."}
          </p>
        )}

        {data && data.length > 0 && !busy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            <AnimatePresence>
              {data.map((item, index) => {
                const id = item[0] || `ID-${index}`;
                const code = item[1] || "—";
                const title = stripHtml(item[2]);
                const description = stripHtml(item[3]);
                let Icon = Cpu;
                let linkUrl = "";
                if (activeTab === "software") {
                  Icon = Code2;
                  linkUrl = `https://software.nasa.gov/software/${code}`;
                } else if (activeTab === "patent") {
                  Icon = FileBadge;
                  linkUrl = `https://technology.nasa.gov/patent/${code}`;
                } else {
                  Icon = Lightbulb;
                  linkUrl = "https://spinoff.nasa.gov";
                }
                return (
                  <motion.a
                    layout
                    href={linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index % 12) * 0.04 }}
                    key={`${id}-${index}`}
                    className="group flex flex-col p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: "var(--module-accent-soft)",
                          color: "var(--module-accent)",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-1 text-[10px] font-mono text-muted-foreground bg-black/40 rounded border border-white/5">
                        {code}
                      </span>
                    </div>
                    <h2 className="text-sm font-bold leading-snug mb-2 line-clamp-2 group-hover:text-foreground transition-colors">
                      {title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 grow mb-4">
                      {description || (locale === "en" ? "No additional details." : "Detalhes adicionais não informados.")}
                    </p>
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--module-accent)" }}>
                      <span>{locale === "en" ? "Open dossier" : "Abrir dossiê"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </ModuleScope>
  );
}
