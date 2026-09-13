"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Orbit, Sparkles } from "lucide-react";

import { getModule } from "@/src/lib/modules";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import { ModuleScope } from "@/src/components/hud";
import { BODY_TYPE_LABEL, SOLAR_BODIES, type SolarBody } from "@/src/lib/solar-system";
import { withAlpha } from "@/src/lib/utils";

const MODULE = getModule("solar-system")!;

const VIEW_BOX = 1000;
const CENTER = VIEW_BOX / 2;

const ORBIT_RADII: Record<number, number> = {
  1: 95,   // Mercúrio
  2: 140,  // Vênus
  3: 190,  // Terra
  4: 240,  // Marte
  5: 300,  // Júpiter
  6: 355,  // Saturno
  7: 405,  // Urano
  8: 450,  // Netuno
  9: 485,  // Plutão
};

const GOLDEN_ANGLE = (137.5 * Math.PI) / 180;

interface BodyPosition {
  body: SolarBody;
  cx: number;
  cy: number;
  /** Posição em % do container, para sobrepor um Link clicável. */
  leftPct: number;
  topPct: number;
}

const computePositions = (): BodyPosition[] =>
  SOLAR_BODIES.filter((b) => b.orbitIndex > 0).map((body) => {
    const r = ORBIT_RADII[body.orbitIndex];
    const angle = body.orbitIndex * GOLDEN_ANGLE;
    const cx = CENTER + r * Math.cos(angle);
    const cy = CENTER + r * Math.sin(angle);
    return {
      body,
      cx,
      cy,
      leftPct: (cx / VIEW_BOX) * 100,
      topPct: (cy / VIEW_BOX) * 100,
    };
  });

export default function SolarSystemPage() {
  const { locale } = useLocale();
  const positions = useMemo(() => computePositions(), []);
  const [hovered, setHovered] = useState<string | null>(null);
  const sun = SOLAR_BODIES[0];

  return (
    <ModuleScope theme={MODULE.theme} ambient className="min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-10"
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
                {pickLocale(MODULE.title, MODULE.titleEn, locale)}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--module-accent)" }}>
                {locale === "en" ? "Sun · 8 planets · 1 dwarf" : "Sol · 8 planetas · 1 anão"}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> {locale === "en" ? "Not to scale" : "Fora de escala"}
          </span>
        </motion.div>

        {/* Diagrama orbital */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto aspect-square w-full max-w-3xl mb-16"
        >
          <svg
            viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            {/* Órbitas */}
            {Object.entries(ORBIT_RADII).map(([idx, r]) => (
              <circle
                key={idx}
                cx={CENTER}
                cy={CENTER}
                r={r}
                fill="none"
                stroke="white"
                strokeOpacity="0.06"
                strokeWidth="1"
                strokeDasharray={Number(idx) === 9 ? "4 6" : undefined}
              />
            ))}

            {/* Glow do Sol */}
            <defs>
              <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="oklch(0.85 0.18 80)" stopOpacity="0.7" />
                <stop offset="1" stopColor="oklch(0.85 0.18 80)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={CENTER} cy={CENTER} r={sun.visualRadius * 2.2} fill="url(#sunGlow)" />
            <circle cx={CENTER} cy={CENTER} r={sun.visualRadius} fill="oklch(0.85 0.18 80)" />

            {/* Corpos */}
            {positions.map(({ body, cx, cy }) => {
              const active = hovered === body.id;
              return (
                <g key={body.id}>
                  {body.hasRings && (
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={body.visualRadius * 1.8}
                      ry={body.visualRadius * 0.55}
                      fill="none"
                      stroke={body.accent}
                      strokeOpacity="0.55"
                      strokeWidth="2"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={body.visualRadius * (active ? 1.25 : 1)}
                    fill={body.accent}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {active && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={body.visualRadius * 2.2}
                      fill="none"
                      stroke={body.accent}
                      strokeOpacity="0.4"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Sol clicável (centro) */}
          <Link
            href={`/solar-system/${sun.id}`}
            className="absolute group"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 80,
              height: 80,
            }}
            onMouseEnter={() => setHovered(sun.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="sr-only">{sun.pt}</span>
            <span
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: "oklch(0 0 0 / 0.85)", color: sun.accent, border: `1px solid ${sun.accent}` }}
            >
              {locale === "en" ? sun.en : sun.pt}
            </span>
          </Link>

          {/* Corpos clicáveis (overlays) */}
          {positions.map(({ body, leftPct, topPct }) => {
            const size = Math.max(36, body.visualRadius * 2.5);
            return (
              <Link
                key={body.id}
                href={`/solar-system/${body.id}`}
                className="absolute group"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: size,
                  height: size,
                }}
                onMouseEnter={() => setHovered(body.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="sr-only">{body.pt}</span>
                <span
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  style={{ background: "oklch(0 0 0 / 0.85)", color: body.accent, border: `1px solid ${body.accent}` }}
                >
                  {locale === "en" ? body.en : body.pt}
                </span>
              </Link>
            );
          })}
        </motion.div>

        {/* Lista detalhada */}
        <div>
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 mb-4">
            {locale === "en" ? "Bodies catalog" : "Catálogo de corpos"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SOLAR_BODIES.map((body, i) => {
              const typeLabel = BODY_TYPE_LABEL[body.type];
              return (
                <motion.div
                  key={body.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/solar-system/${body.id}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border bg-white/2 hover:bg-white/4 transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full shrink-0"
                        style={{
                          background: body.accent,
                          boxShadow: `0 0 16px ${withAlpha(body.accent, 0.5)}`,
                        }}
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-bold leading-tight truncate group-hover:text-accent transition-colors" style={{ color: body.accent }}>
                          {locale === "en" ? body.en : body.pt}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                          {locale === "en" ? typeLabel.en : typeLabel.pt}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/70">
                      <span>Ø {body.diameterKm.toLocaleString(locale === "en" ? "en-US" : "pt-BR")} km</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ModuleScope>
  );
}
