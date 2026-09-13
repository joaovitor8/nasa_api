"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Film, Library as LibraryIcon, Search, X } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { LibraryItem } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("library")!;

const fetchLibrary = async (
  query: string,
  mediaType: string,
): Promise<LibraryItem[]> => {
  const res = await axios.get<LibraryItem[]>(
    `/api/library?q=${encodeURIComponent(query)}&media_type=${mediaType}`,
  );
  return res.data;
};

const formatDescription = (desc?: string) => {
  if (!desc) return "Sem descrição disponível.";
  return desc.length > 360 ? desc.substring(0, 360) + "…" : desc;
};

export default function LibraryPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("nebula");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [selected, setSelected] = useState<LibraryItem | null>(null);

  const { data: items, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["nasa-library", searchQuery, mediaType],
    queryFn: () => fetchLibrary(searchQuery, mediaType),
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchInput.trim()) setSearchQuery(searchInput);
  };

  const busy = isLoading || isFetching;

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-[100rem] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12"
        >
          <div
            className="p-4 rounded-full border mb-6"
            style={{
              background: "var(--module-accent-soft)",
              borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
            }}
          >
            <LibraryIcon className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 mb-2">
            {MODULE.codename}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Arquivo Central
          </h1>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            Busca multimídia desclassificada — milhares de imagens e vídeos históricos da agência.
          </p>

          <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
              <input
                type="text"
                placeholder="Apollo 11, Mars Rover, Orion Nebula…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3.5 outline-none focus:border-[var(--module-accent)] focus:bg-white/10 transition-all text-base font-mono"
              />
              <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="px-8 py-3.5 rounded-full font-bold tracking-[0.2em] text-xs uppercase font-mono transition-all active:scale-95 disabled:opacity-50"
              style={{ background: "var(--module-accent)", color: "oklch(0.05 0 0)" }}
            >
              Consultar
            </button>
          </form>

          {/* Filtros */}
          <div className="flex items-center gap-1 mt-6 bg-white/5 p-1 rounded-full border border-white/10">
            {([
              { key: "image", label: "Imagens", icon: Camera },
              { key: "video", label: "Vídeos", icon: Film },
            ] as const).map(({ key, label, icon: Icon }) => {
              const active = mediaType === key;
              return (
                <button
                  key={key}
                  onClick={() => setMediaType(key)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all"
                  style={
                    active
                      ? {
                          background: "var(--module-accent-soft)",
                          color: "var(--module-accent)",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Resultados */}
        {error ? (
          <CommsFailure
            message="Não foi possível conectar aos servidores de arquivo."
            onRetry={() => refetch()}
          />
        ) : busy ? (
          <TelemetrySpinner
            label="ARCHIVE QUERY"
            phases={[
              `Consultando "${searchQuery}"`,
              "Indexando registros multimídia",
              "Carregando thumbnails",
            ]}
          />
        ) : items && items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-mono">
              Nenhum registro encontrado para &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
          >
            {items?.map((item, index) => {
              const meta = item.data?.[0];
              const thumb = item.links?.[0]?.href;
              if (!meta || !thumb) return null;

              return (
                <motion.button
                  key={meta.nasa_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 12) * 0.04 }}
                  onClick={() => setSelected(item)}
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--module-accent)]/50 transition-all w-full text-left"
                >
                  <Image
                    src={thumb}
                    alt={meta.title}
                    width={500}
                    height={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="font-bold text-sm line-clamp-2 leading-snug mb-1">
                      {meta.title}
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                      {new Date(meta.date_created).getFullYear()} · {meta.media_type}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#05050a] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row max-w-6xl w-full max-h-[90vh]"
            >
              <div className="relative w-full md:w-2/3 bg-black flex items-center justify-center p-4 min-h-[40vh] md:min-h-[60vh]">
                <Image
                  src={selected.links?.[0]?.href ?? ""}
                  alt={selected.data[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-contain rounded-xl p-4"
                />
              </div>

              <div className="w-full md:w-1/3 p-8 flex flex-col overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 bg-white/5">
                <span
                  className="inline-flex items-center self-start px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 border"
                  style={{
                    background: "var(--module-accent-soft)",
                    color: "var(--module-accent)",
                    borderColor: "color-mix(in oklch, var(--module-accent) 30%, transparent)",
                  }}
                >
                  {selected.data[0].media_type === "video" ? "Registro em Vídeo" : "Registro Fotográfico"}
                </span>
                <h2 className="text-2xl font-serif font-bold mb-2 leading-tight">
                  {selected.data[0].title}
                </h2>
                <div className="text-sm text-muted-foreground font-mono mb-6">
                  ID: {selected.data[0].nasa_id} · {new Date(selected.data[0].date_created).toLocaleDateString("pt-BR")}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed font-light text-justify">
                  {formatDescription(selected.data[0].description)}
                </p>

                <a
                  href={selected.links?.[0]?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto pt-8 text-center text-xs font-mono uppercase tracking-[0.25em] transition-colors hover:text-foreground"
                  style={{ color: "var(--module-accent)" }}
                >
                  Abrir Arquivo Original →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModuleScope>
  );
}
