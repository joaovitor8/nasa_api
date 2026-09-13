"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Globe, Pause, Play, Search } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { EpicImage } from "@/src/lib/types/nasa";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("epic")!;

const fetchEpic = async (date: string): Promise<EpicImage[]> => {
  const url = date ? `/api/epic?date=${date}` : "/api/epic";
  const res = await axios.get<EpicImage[]>(url);
  return res.data;
};

const buildImageUrl = (item: EpicImage) => {
  const [y, m, d] = item.date.split(" ")[0].split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/jpg/${item.image}.jpg`;
};

const today = new Date().toISOString().split("T")[0];

export default function EpicPage() {
  const [tempDate, setTempDate] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: images, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["epic", searchDate],
    queryFn: () => fetchEpic(searchDate),
  });

  const handleSearch = () => {
    setSearchDate(tempDate);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || !images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, images]);

  const currentImage = images?.[currentIndex];
  const imageUrl = currentImage ? buildImageUrl(currentImage) : null;
  const busy = isLoading || isFetching;

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8" style={{ color: "var(--module-accent)" }} />
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {MODULE.codename}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Projeto EPIC — Satélite DSCOVR
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                L1 Lagrange Point · 1.5M km da Terra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
            <input
              type="date"
              max={today}
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{ colorScheme: "dark" }}
              className="bg-transparent text-sm pl-4 pr-2 py-2 outline-none cursor-pointer font-mono"
            />
            <button
              onClick={handleSearch}
              disabled={busy}
              className="rounded-full p-2.5 transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: "var(--module-accent)", color: "oklch(0.05 0 0)" }}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {error && (
          <CommsFailure
            message="Perda de telemetria com o satélite DSCOVR."
            onRetry={() => refetch()}
          />
        )}

        {/* Globo */}
        {!error && (
          <div className="relative w-full max-w-3xl aspect-square md:aspect-video flex items-center justify-center my-4">
            {busy && (
              <div className="absolute z-20">
                <TelemetrySpinner
                  label="SINTONIZANDO DSCOVR"
                  phases={[
                    "Estabelecendo link L1",
                    "Recebendo captura do EPIC",
                    "Processando luz natural",
                  ]}
                />
              </div>
            )}

            {!busy && images?.length === 0 && (
              <div className="text-center text-muted-foreground py-8 px-6 border border-white/10 rounded-2xl bg-white/5">
                Sem capturas disponíveis para esta data.
              </div>
            )}

            <AnimatePresence mode="wait">
              {imageUrl && !busy && (
                <motion.div
                  key={imageUrl}
                  initial={{ opacity: 0.5, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                  style={{ filter: "drop-shadow(0 0 60px var(--module-accent-soft))" }}
                >
                  <Image
                    src={imageUrl}
                    alt="Terra vista do espaço"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-contain rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Player */}
        {images && images.length > 0 && !busy && currentImage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mt-6"
          >
            <HudPanel
              label="Telemetria DSCOVR"
              badge={
                <span className="text-[10px] font-mono tracking-widest" style={{ color: "var(--module-accent)" }}>
                  FRAME {currentIndex + 1} / {images.length}
                </span>
              }
            >
              <div className="flex justify-between items-end mb-6 gap-4 flex-wrap">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/70 block mb-1">
                    Captura
                  </span>
                  <span className="text-base font-mono flex items-center gap-2">
                    <Camera className="w-4 h-4" style={{ color: "var(--module-accent)" }} />
                    {currentImage.date.split(" ")[1]} UTC
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-foreground/70 block mb-1">
                    Centroide
                  </span>
                  <span className="text-sm font-mono">
                    LAT {currentImage.centroid_coordinates.lat.toFixed(2)}° · LON{" "}
                    {currentImage.centroid_coordinates.lon.toFixed(2)}°
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
                  style={{
                    background: "var(--module-accent)",
                    color: "oklch(0.05 0 0)",
                    boxShadow: "var(--module-glow)",
                  }}
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </button>

                <div className="grow flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>00:00 UTC</span>
                    <span>23:59 UTC</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={images.length - 1}
                    value={currentIndex}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentIndex(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: "var(--module-accent)" }}
                  />
                </div>
              </div>
            </HudPanel>
          </motion.div>
        )}
      </div>
    </ModuleScope>
  );
}
