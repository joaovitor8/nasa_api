"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Compass,
  Crosshair,
  Globe,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import {
  CommsFailure,
  HudPanel,
  ModuleScope,
  TelemetrySpinner,
} from "@/src/components/hud";

const MODULE = getModule("trek")!;

interface TrekConfig {
  name: string;
  body: string;
  layer: string;
  format: string;
  maxZoom: number;
}

type Target = "moon" | "mars" | "vesta";

const TARGETS: { id: Target; pt: string; en: string }[] = [
  { id: "moon",  pt: "Lua",   en: "Moon" },
  { id: "mars",  pt: "Marte", en: "Mars" },
  { id: "vesta", pt: "Vesta", en: "Vesta" },
];

const fetchConfig = async (target: Target): Promise<TrekConfig> => {
  const res = await axios.get<TrekConfig>(`/api/trek?target=${target}`);
  return res.data;
};

const TRANSPARENT_PNG = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const buildTileUrl = (config: TrekConfig, z: number, y: number, x: number) => {
  const maxTiles = Math.pow(2, z);
  if (y < 0 || y >= maxTiles || x < 0 || x >= maxTiles * 2) return TRANSPARENT_PNG;
  return `https://trek.nasa.gov/tiles/${config.body}/EQ/${config.layer}/1.0.0//default/default028mm/${z}/${y}/${x}.${config.format}`;
};

const GRID_OFFSETS: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0], [0,  0], [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export default function TrekPage() {
  const { locale } = useLocale();
  const [target, setTarget] = useState<Target>("mars");
  const [z, setZ] = useState(2);
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);

  const { data: config, isLoading, error, refetch } = useQuery({
    queryKey: ["trek-config", target],
    queryFn: () => fetchConfig(target),
  });

  const move = (dx: number, dy: number) => {
    setX((p) => p + dx);
    setY((p) => p + dy);
  };

  const zoomBy = (dz: number) => {
    if (!config) return;
    const next = z + dz;
    if (next < 1 || next > config.maxZoom) return;
    setZ(next);
    if (dz > 0) {
      setX((p) => p * 2);
      setY((p) => p * 2);
    } else {
      setX((p) => Math.floor(p / 2));
      setY((p) => Math.floor(p / 2));
    }
  };

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
              <MapIcon className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                NASA Trek · WMTS Tiles
              </p>
            </div>
          </div>

          {/* Seletor de corpo celeste */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {TARGETS.map((t) => {
              const active = target === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTarget(t.id);
                    setZ(2); setX(2); setY(1);
                  }}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] transition-all"
                  style={
                    active
                      ? { background: "var(--module-accent-soft)", color: "var(--module-accent)" }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  <Globe className="w-3.5 h-3.5" />
                  {locale === "en" ? t.en : t.pt}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Mapa de tiles */}
          <div
            className="lg:col-span-9 relative rounded-2xl border border-white/10 bg-black/60 overflow-hidden aspect-[3/2] flex items-center justify-center"
            style={{ boxShadow: "var(--module-glow)" }}
          >
            {/* Mira central */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center opacity-30">
              <div className="absolute w-full h-px" style={{ background: "var(--module-accent)" }} />
              <div className="absolute h-full w-px" style={{ background: "var(--module-accent)" }} />
              <Crosshair className="w-10 h-10" style={{ color: "var(--module-accent)" }} />
            </div>

            {error && (
              <CommsFailure
                message={locale === "en" ? "Tile servers unreachable." : "Servidores de tiles indisponíveis."}
                onRetry={() => refetch()}
              />
            )}
            {isLoading && (
              <TelemetrySpinner
                label="TREK · WMTS"
                phases={
                  locale === "en"
                    ? ["Calibrating tile servers", "Fetching equirect projection", "Aligning crosshair"]
                    : ["Calibrando servidores", "Buscando projeção equirretangular", "Alinhando mira"]
                }
              />
            )}

            {config && !error && !isLoading && (
              <div className="grid grid-cols-3 grid-rows-3 w-[480px] h-[320px] sm:w-[600px] sm:h-[400px] md:w-[720px] md:h-[480px]">
                {GRID_OFFSETS.map(([dx, dy], i) => {
                  const tileX = x + dx;
                  const tileY = y + dy;
                  const url = buildTileUrl(config, z, tileY, tileX);
                  return (
                    <div key={`${target}-${z}-${tileX}-${tileY}-${i}`} className="bg-black/80 relative overflow-hidden border border-white/[0.02]">
                      {/* eslint-disable-next-line @next/next/no-img-element -- WMTS tiles mudam rápido com pan/zoom; otimização via /_next/image causaria thrash de cache */}
                      <img
                        src={url}
                        alt={`tile ${z}/${tileX}/${tileY}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = TRANSPARENT_PNG;
                        }}
                      />
                      <span className="absolute top-1 left-1 text-[9px] font-mono opacity-30" style={{ color: "var(--module-accent)" }}>
                        Z{z}_X{tileX}_Y{tileY}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Painel lateral */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* D-Pad */}
            <HudPanel label={locale === "en" ? "Axes" : "Eixos"} variant="solid">
              <div className="grid grid-cols-3 gap-1.5 mx-auto w-fit">
                <div />
                <button onClick={() => move(0, -1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div />
                <button onClick={() => move(-1, 0)} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="p-3 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-muted-foreground" />
                </div>
                <button onClick={() => move(1, 0)} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95">
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div />
                <button onClick={() => move(0, 1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors active:scale-95">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div />
              </div>
            </HudPanel>

            {/* Zoom */}
            <HudPanel label="Zoom" variant="solid">
              <div className="flex gap-2">
                <button
                  onClick={() => zoomBy(-1)}
                  disabled={z <= 1}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-lg flex items-center justify-center gap-2 text-xs font-mono transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => zoomBy(1)}
                  disabled={z >= (config?.maxZoom ?? 5)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded-lg flex items-center justify-center gap-2 text-xs font-mono transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </HudPanel>

            {/* Telemetria */}
            <HudPanel label={locale === "en" ? "Telemetry" : "Telemetria"} variant="solid">
              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground uppercase tracking-widest">Z</span>
                  <span style={{ color: "var(--module-accent)" }}>{z}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground uppercase tracking-widest">X · Y</span>
                  <span style={{ color: "var(--module-accent)" }}>{x} · {y}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground uppercase tracking-widest">Layer</span>
                  <span className="text-foreground/80 truncate max-w-[140px]" title={config?.layer}>{config?.layer ?? "—"}</span>
                </div>
              </div>
            </HudPanel>
          </div>
        </div>
      </div>
    </ModuleScope>
  );
}
