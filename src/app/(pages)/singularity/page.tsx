"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Atom, Gauge, Orbit, Radiation, Telescope, Waves } from "lucide-react";

import { getModule } from "@/src/lib/modules";
import {
  DataMatrix,
  HudPanel,
  ModuleScope,
  type DataPoint,
} from "@/src/components/hud";

const MODULE = getModule("singularity")!;

const BlackHoleScene = dynamic(
  () => import("@/src/components/scenes/BlackHoleScene").then((m) => m.BlackHoleScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-2 border-dashed animate-spin-slow"
            style={{ borderColor: "var(--module-accent)" }}
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80">
            Compilando geodésicas
          </span>
        </div>
      </div>
    ),
  },
);

const PRESETS = [
  {
    id: "sgr",
    label: "Sgr A*",
    detail: "4.1×10⁶ M☉ · 26 kly",
    spin: 0.6,
    tilt: 0.05,
  },
  {
    id: "m87",
    label: "M87*",
    detail: "6.5×10⁹ M☉ · 53 Mly",
    spin: 1.0,
    tilt: 0.18,
  },
  {
    id: "ton618",
    label: "TON 618",
    detail: "6.6×10¹⁰ M☉ · 18.2 Gly",
    spin: 1.6,
    tilt: 0.32,
  },
] as const;

export default function SingularityPage() {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  const physicsData: DataPoint[] = [
    { label: "Massa", value: preset.id === "sgr" ? "4.1×10⁶" : preset.id === "m87" ? "6.5×10⁹" : "6.6×10¹⁰", unit: "M☉" },
    { label: "Spin (a*)", value: (preset.spin * 0.998 / 1.6).toFixed(3), unit: "" },
    { label: "Inclinação", value: (preset.tilt * 57.29).toFixed(1), unit: "°" },
    { label: "Schwarz.", value: preset.id === "sgr" ? "12.1" : preset.id === "m87" ? "1.91×10⁴" : "1.95×10⁵", unit: "Gm" },
  ];

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
              <Orbit className="w-7 h-7" style={{ color: "var(--module-accent)" }} />
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
                Singularidade
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--module-accent)" }}>
                <Radiation className="w-3.5 h-3.5" /> Schwarzschild · Disco de Acreção · Doppler Boost
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {PRESETS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setPresetIdx(i)}
                className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] transition-all"
                style={
                  presetIdx === i
                    ? {
                        background: "var(--module-accent-soft)",
                        color: "var(--module-accent)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Volume principal — Black hole 3D */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden h-[28rem] md:h-[36rem]"
          >
            <BlackHoleScene spinSpeed={preset.spin} diskTilt={preset.tilt} />

            {/* Overlay HUD */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex items-start justify-between text-[10px] font-mono uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "var(--module-accent)" }}
                  />
                  Render volumétrico ativo
                </div>
                <span style={{ color: "var(--module-accent)" }}>{preset.label}</span>
              </div>

              <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-[0.25em]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground/70">Drag para orbitar</span>
                  <span className="text-muted-foreground/40">Scroll para zoom</span>
                </div>
                <span className="text-muted-foreground/70">{preset.detail}</span>
              </div>
            </div>

            {/* Cantos HUD */}
            {(["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"] as const).map((p) => (
              <span
                key={p}
                className={`pointer-events-none absolute w-4 h-4 ${p}`}
                style={{ borderColor: "var(--module-accent)" }}
              />
            ))}
          </motion.div>

          {/* Painel lateral — telemetria */}
          <div className="flex flex-col gap-4">
            <HudPanel
              label="Telemetria"
              badge={<Gauge className="w-4 h-4 text-muted-foreground/50" />}
            >
              <DataMatrix data={physicsData} columns={2} />
            </HudPanel>

            <HudPanel
              label="Briefing"
              badge={<Atom className="w-4 h-4" style={{ color: "var(--module-accent)" }} />}
            >
              <h3 className="font-serif text-lg font-bold mb-2 leading-snug">
                {preset.id === "sgr" && "Sagittarius A*"}
                {preset.id === "m87" && "Messier 87*"}
                {preset.id === "ton618" && "TON 618"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {preset.id === "sgr" &&
                  "O buraco negro supermassivo no centro da Via Láctea. Imageado pelo Event Horizon Telescope em 2022 — primeira foto direta da nossa singularidade local."}
                {preset.id === "m87" &&
                  "O monstro central da galáxia M87. Primeiro buraco negro fotografado (EHT, 2019). Spin elevado e jato relativístico bem documentado."}
                {preset.id === "ton618" &&
                  "Um dos buracos negros ultramassivos mais brilhantes conhecidos. Quasar luminoso a 18.2 bilhões de anos-luz — disco maior que o Sistema Solar inteiro."}
              </p>
            </HudPanel>

            <HudPanel
              label="Efeitos Simulados"
              badge={<Waves className="w-4 h-4 text-muted-foreground/50" />}
            >
              <ul className="space-y-2 text-xs font-mono">
                <Effect label="Photon Ring" detail="Anel de luz a 1.5 r_s" />
                <Effect label="Doppler Boost" detail="Lado próximo ~50% mais brilhante" />
                <Effect label="Acreção" detail="Plasma a 10⁹ K · gradiente radial" />
                <Effect label="Glow Fresnel" detail="Distorção da luz no horizonte" />
              </ul>
            </HudPanel>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70 flex items-start gap-2">
              <Telescope className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--module-accent)" }} />
              <span>
                Modelo educacional. A geodésica nula real foi aproximada por gradiente radial — não substitui Kerr.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ModuleScope>
  );
}

function Effect({ label, detail }: { label: string; detail: string }) {
  return (
    <li className="flex justify-between items-baseline gap-3 border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
      <span className="uppercase tracking-[0.2em]" style={{ color: "var(--module-accent)" }}>
        {label}
      </span>
      <span className="text-muted-foreground/70 text-right">{detail}</span>
    </li>
  );
}
