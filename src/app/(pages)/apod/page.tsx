"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { ApodData } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("apod")!;

const fetchApod = async (date: string): Promise<ApodData> => {
  const url = date ? `/api/apod?date=${date}` : "/api/apod";
  const res = await axios.get<ApodData>(url);
  return res.data;
};

const today = new Date().toISOString().split("T")[0];

export default function ApodPage() {
  const [tempDate, setTempDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["apod", searchDate],
    queryFn: () => fetchApod(searchDate),
  });

  const handleSearch = () => {
    setSearchDate(tempDate);
    setExpanded(false);
  };

  const busy = isLoading || isFetching;

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6 mb-10"
        >
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5" style={{ color: "var(--module-accent)" }} />
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Galeria Espacial Diária
              </h1>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="date"
              max={today}
              min="1995-06-16"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-black/40 text-foreground text-sm border border-white/10 rounded-l-full pl-5 pr-3 py-2.5 outline-none focus:border-[var(--module-accent)] transition-colors font-mono cursor-pointer"
            />
            <button
              onClick={handleSearch}
              disabled={busy || !tempDate}
              className="text-[10px] font-mono tracking-[0.3em] uppercase px-5 py-2.5 rounded-r-full font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "var(--module-accent)", color: "oklch(0.05 0 0)" }}
            >
              Pesquisar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {error ? (
          <CommsFailure
            message="Registro cósmico inacessível para a data selecionada."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            {/* Frame da imagem/vídeo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-4/3 md:aspect-video rounded-2xl border border-white/10 bg-black/60 overflow-hidden"
              style={{ boxShadow: "var(--module-glow)" }}
            >
              {busy && (
                <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <TelemetrySpinner
                    label="DECODIFICANDO IMAGEM DO DIA"
                    phases={[
                      "Sintonizando observatório",
                      "Decodificando luz visível",
                      "Renderizando captura HD",
                    ]}
                  />
                </div>
              )}

              {data?.media_type === "image" && (
                <Image
                  src={data.hdurl || data.url}
                  alt={data.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  className="object-contain"
                />
              )}
              {data?.media_type === "video" && (
                <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}

              {/* Corner brackets do tema */}
              <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: "var(--module-accent)" }} />
              <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: "var(--module-accent)" }} />
              <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: "var(--module-accent)" }} />
              <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: "var(--module-accent)" }} />
            </motion.div>

            {data && !busy && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12 flex flex-col items-center text-center"
              >
                <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight tracking-tight mb-6 max-w-3xl">
                  {data.title}
                </h2>

                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground border-y border-white/5 py-4 mb-10 w-full max-w-3xl">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--module-accent)" }} />
                    {data.date}
                  </span>
                  {data.copyright && <span className="opacity-60">© {data.copyright}</span>}
                </div>

                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="group flex items-center gap-3 px-7 py-3 rounded-full border text-xs font-mono uppercase tracking-[0.3em] transition-all hover:scale-105"
                  style={{
                    color: "var(--module-accent)",
                    borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                    background: "var(--module-accent-soft)",
                  }}
                >
                  {expanded ? "Ocultar Dossiê" : "Abrir Dossiê Técnico"}
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden w-full max-w-3xl mt-8"
                    >
                      <HudPanel label="Explanation Feed" variant="solid">
                        <p className="text-base text-muted-foreground leading-relaxed text-justify font-light">
                          {data.explanation}
                        </p>
                      </HudPanel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </ModuleScope>
  );
}
