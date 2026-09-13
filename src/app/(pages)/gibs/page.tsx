"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Globe, Layers, ThermometerSun, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("gibs")!;

interface LayerCfg {
  id: string;
  pt: string;
  en: string;
  desc_pt: string;
  desc_en: string;
  icon: LucideIcon;
  color: string;
}
const LAYERS: LayerCfg[] = [
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    pt: "Cor Real", en: "True Color",
    desc_pt: "A Terra vista pelas lentes do satélite Terra.",
    desc_en: "Earth seen through the Terra satellite's lens.",
    icon: Globe, color: "oklch(0.74 0.13 200)",
  },
  {
    id: "MODIS_Terra_Land_Surface_Temp_Day",
    pt: "Temperatura de Superfície", en: "Surface Temperature",
    desc_pt: "Emissão térmica diurna da superfície terrestre.",
    desc_en: "Daytime thermal emission of the surface.",
    icon: ThermometerSun, color: "oklch(0.72 0.18 35)",
  },
  {
    id: "MODIS_Terra_Aerosol",
    pt: "Aerossóis", en: "Aerosols",
    desc_pt: "Concentração de partículas em suspensão.",
    desc_en: "Concentration of suspended particles.",
    icon: Wind, color: "oklch(0.78 0.16 80)",
  },
  {
    id: "MODIS_Terra_Cloud_Water_Path",
    pt: "Densidade de Nuvens", en: "Cloud Density",
    desc_pt: "Quantidade de água líquida nas nuvens.",
    desc_en: "Liquid water content within clouds.",
    icon: Cloud, color: "oklch(0.78 0.10 230)",
  },
];

interface GibsResponse { imageUrl: string; date: string; layer: string }

const fetchGibs = async (date: string, layer: string): Promise<GibsResponse> => {
  const res = await axios.get<GibsResponse>(`/api/gibs?date=${date}&layer=${layer}`);
  return res.data;
};

const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

export default function GibsPage() {
  const { locale } = useLocale();
  const defaultDate = yesterdayISO();
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [activeLayer, setActiveLayer] = useState(LAYERS[0].id);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["gibs", selectedDate, activeLayer],
    queryFn: () => fetchGibs(selectedDate, activeLayer),
    staleTime: 1000 * 60 * 60,
  });

  const busy = isLoading || isFetching;

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
              className="p-3 rounded-xl border relative"
              style={{
                background: "var(--module-accent-soft)",
                borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
              }}
            >
              <Layers className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                {pickLocale(MODULE.title, MODULE.titleEn, locale)}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                Global Imagery Browse Services
              </p>
            </div>
          </div>

          <input
            type="date"
            max={defaultDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ colorScheme: "dark" }}
            className="bg-black/40 text-foreground text-sm border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[var(--module-accent)] transition-colors font-mono cursor-pointer"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Mapa principal */}
          <div className="lg:col-span-9 relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden aspect-[2/1]"
               style={{ boxShadow: "var(--module-glow)" }}>
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <CommsFailure
                  message={locale === "en" ? "Layer unavailable for this date." : "Camada indisponível para esta data."}
                  onRetry={() => refetch()}
                />
              </div>
            )}
            {busy && !error && (
              <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <TelemetrySpinner
                  label="GIBS · CALIBRATING"
                  phases={
                    locale === "en"
                      ? ["Aligning spectrometer", "Stitching daily snapshot", "Rendering global mosaic"]
                      : ["Alinhando espectrômetro", "Costurando snapshot diário", "Renderizando mosaico global"]
                  }
                />
              </div>
            )}
            <AnimatePresence mode="wait">
              {data?.imageUrl && !error && (
                <motion.div
                  key={data.imageUrl}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: busy ? 0.3 : 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={data.imageUrl}
                    alt={`GIBS ${data.layer}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Corner brackets */}
            <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 z-20" style={{ borderColor: "var(--module-accent)" }} />
            <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 z-20" style={{ borderColor: "var(--module-accent)" }} />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 z-20" style={{ borderColor: "var(--module-accent)" }} />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 z-20" style={{ borderColor: "var(--module-accent)" }} />
          </div>

          {/* Seletor de camadas */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-1 px-1">
              {locale === "en" ? "Spectrum" : "Espectro"}
            </div>
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              const active = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className="flex items-start gap-3 p-3 rounded-xl text-left border transition-all"
                  style={
                    active
                      ? {
                          background: `color-mix(in oklch, ${layer.color} 12%, transparent)`,
                          borderColor: `color-mix(in oklch, ${layer.color} 35%, transparent)`,
                        }
                      : {
                          background: "rgba(255,255,255,0.02)",
                          borderColor: "rgba(255,255,255,0.06)",
                        }
                  }
                >
                  <div className="p-1.5 rounded-md mt-0.5" style={{ background: `color-mix(in oklch, ${layer.color} 15%, transparent)` }}>
                    <Icon className="w-4 h-4" style={{ color: layer.color }} />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: active ? layer.color : "var(--foreground)" }}>
                      {locale === "en" ? layer.en : layer.pt}
                    </h3>
                    <p className="text-[10px] text-muted-foreground/70 mt-1 leading-snug">
                      {locale === "en" ? layer.desc_en : layer.desc_pt}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ModuleScope>
  );
}
