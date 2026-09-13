"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Dna,
  Globe2,
  Heart,
  Layers,
  Library,
  Map as MapIcon,
  Newspaper,
  Orbit,
  Radar,
  Rocket,
  Satellite,
  Sparkles,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useT } from "@/src/lib/i18n";
import { ENABLED_MODULES } from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";
import { HudPanel } from "@/src/components/hud";

const APP_VERSION = "1.0.0";

interface DataSource {
  name: string;
  description: string;
  url: string;
  icon: LucideIcon;
  domain: "imagery" | "defense" | "weather" | "science" | "ops" | "ref";
}

const DATA_SOURCES: DataSource[] = [
  // Imagery
  { name: "NASA APOD", description: "Astronomy Picture of the Day", url: "https://apod.nasa.gov", icon: Sparkles, domain: "imagery" },
  { name: "EPIC", description: "DSCOVR L1 Earth imager", url: "https://epic.gsfc.nasa.gov", icon: Satellite, domain: "imagery" },
  { name: "NASA Library", description: "Image & Video Library", url: "https://images.nasa.gov", icon: Library, domain: "imagery" },
  { name: "GIBS / Worldview", description: "Global Imagery Browse Services", url: "https://nasa-gibs.github.io/gibs-api-docs/", icon: Layers, domain: "imagery" },
  { name: "Trek WMTS", description: "Planetary tile servers (Moon, Mars, Vesta)", url: "https://trek.nasa.gov", icon: MapIcon, domain: "imagery" },

  // Defense / monitoring
  { name: "NeoWs", description: "Near Earth Object Web Service", url: "https://api.nasa.gov", icon: Radar, domain: "defense" },
  { name: "CNEOS Sentry", description: "JPL impact-risk monitoring", url: "https://cneos.jpl.nasa.gov/sentry", icon: Atom, domain: "defense" },
  { name: "EONET", description: "Earth Observatory Natural Events", url: "https://eonet.gsfc.nasa.gov", icon: Globe2, domain: "defense" },

  // Weather
  { name: "DONKI", description: "Space Weather Database", url: "https://ccmc.gsfc.nasa.gov/tools/DONKI", icon: Sun, domain: "weather" },
  { name: "InSight Weather", description: "Mars surface telemetry", url: "https://api.nasa.gov", icon: Wind, domain: "weather" },

  // Science
  { name: "Exoplanet Archive", description: "Caltech TAP service", url: "https://exoplanetarchive.ipac.caltech.edu", icon: Database, domain: "science" },
  { name: "TechPort", description: "NASA R&D portfolio", url: "https://techport.nasa.gov", icon: Cpu, domain: "science" },
  { name: "TechTransfer", description: "NASA patents & spinoffs", url: "https://technology.nasa.gov", icon: Cpu, domain: "science" },
  { name: "OSDR / GeneLab", description: "Open Science Data Repository", url: "https://osdr.nasa.gov", icon: Dna, domain: "science" },

  // Ops
  { name: "SSC", description: "Space Situation Center", url: "https://sscweb.gsfc.nasa.gov", icon: Orbit, domain: "ops" },
  { name: "CelesTrak TLE", description: "Two-Line Elements", url: "https://celestrak.org", icon: Code2, domain: "ops" },
  { name: "SpaceX API", description: "Falcon/Starship fleet", url: "https://github.com/r-spacex/SpaceX-API", icon: Rocket, domain: "ops" },
  { name: "Spaceflight News", description: "Aggregated press feed", url: "https://spaceflightnewsapi.net", icon: Newspaper, domain: "ops" },

  // Reference
  { name: "Wikipedia REST", description: "Encyclopedic summaries (Solar System)", url: "https://www.mediawiki.org/wiki/Wikimedia_REST_API", icon: BookOpen, domain: "ref" },
  { name: "NOAA SWPC fallback", description: "Aurora & Kp index (planejado)", url: "https://services.swpc.noaa.gov", icon: ThermometerSun, domain: "ref" },
];

const STACK_GROUPS = [
  {
    label: "Frontend",
    items: ["Next.js 16 · App Router", "React 19", "TypeScript 5 (strict)", "Tailwind CSS v4"],
  },
  {
    label: "UI & Motion",
    items: ["Framer Motion 12", "Lucide icons", "tw-animate-css", "Tailwind merge + clsx"],
  },
  {
    label: "3D & Shaders",
    items: ["React Three Fiber 9", "@react-three/drei 10", "Custom GLSL (Schwarzschild aprox.)", "Three.js 0.184"],
  },
  {
    label: "Data & Caching",
    items: ["TanStack Query v5", "Axios", "Next.js Route Handlers (BFF)", "ISR via revalidate"],
  },
  {
    label: "Infra",
    items: ["Custom Service Worker", "Web App Manifest (PWA)", "Sitemap + robots", "OpenGraph + Twitter"],
  },
  {
    label: "Cloud APIs",
    items: ["20 NASA endpoints", "Wikipedia REST", "SpaceX, Spaceflight News", "CelesTrak, ESA EONET"],
  },
];

const DOMAIN_LABEL: Record<DataSource["domain"], { pt: string; en: string; accent: string }> = {
  imagery:  { pt: "Imagem",       en: "Imagery",   accent: "oklch(0.78 0.16 80)" },
  defense:  { pt: "Defesa",       en: "Defense",   accent: "oklch(0.65 0.22 25)" },
  weather:  { pt: "Clima",        en: "Weather",   accent: "oklch(0.80 0.16 70)" },
  science:  { pt: "Ciência",      en: "Science",   accent: "oklch(0.68 0.18 290)" },
  ops:      { pt: "Operações",    en: "Operations",accent: "oklch(0.78 0.18 130)" },
  ref:      { pt: "Referência",   en: "Reference", accent: "oklch(0.74 0.13 200)" },
};

export default function SobrePage() {
  const t = useT();
  const totalRoutes = ENABLED_MODULES.length + SOLAR_BODIES.length + 3;

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-8">
      <div
        aria-hidden
        className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/[0.07] blur-[180px] -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-blue-500/[0.06] blur-[160px] -z-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl border border-primary/30 bg-primary/10 relative">
              <BookOpen className="w-7 h-7 text-primary" />
              <div
                className="absolute inset-0 rounded-xl blur-md bg-primary/15"
                style={{ animation: "hud-pulse 3s ease-in-out infinite" }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 block">
                {t("about.codename")}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
                {t("about.title")}
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-primary mt-1">
                {t("about.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div
              className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md"
              style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.2)" }}
            >
              <span className="text-sm text-primary font-mono font-bold tracking-widest tabular-nums">
                BUILD {APP_VERSION}
              </span>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
              {ENABLED_MODULES.length} {t("about.stats.modules").toLowerCase()} · {SOLAR_BODIES.length} {t("about.stats.bodies").toLowerCase()} · {totalRoutes} {t("about.stats.routes").toLowerCase()}
            </span>
          </div>
        </motion.div>

        {/* Stats grid (real numbers) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
        >
          <Stat label={t("about.stats.modules")} value={ENABLED_MODULES.length} accent="oklch(0.60 0.18 290)" />
          <Stat label={t("about.stats.bodies")} value={SOLAR_BODIES.length} accent="oklch(0.78 0.16 80)" />
          <Stat label={t("about.stats.routes")} value={totalRoutes} accent="oklch(0.78 0.13 200)" />
          <Stat label={t("about.stats.sources")} value={DATA_SOURCES.length} accent="oklch(0.78 0.18 145)" />
        </motion.div>

        {/* Manifesto */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <HudPanel
            label={t("about.manifesto.title")}
            badge={<Heart className="w-4 h-4 text-primary" />}
            className="md:p-12"
          >
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-3xl">
              {t("about.manifesto.body")}
            </p>
          </HudPanel>
        </motion.section>

        {/* Stack */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5" /> {t("about.stack.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {STACK_GROUPS.map((g) => (
              <HudPanel key={g.label} label={g.label} className="p-5 md:p-5">
                <ul className="space-y-1.5 text-xs font-mono">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </HudPanel>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" /> {t("about.timeline.title")}
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50">
              {t("about.timeline.subtitle")}
            </span>
          </div>

          <div className="relative pl-6 border-l border-white/10 space-y-5">
            {[
              { title: t("about.timeline.w1.title"), body: t("about.timeline.w1.body") },
              { title: t("about.timeline.w2.title"), body: t("about.timeline.w2.body") },
              { title: t("about.timeline.w3.title"), body: t("about.timeline.w3.body") },
              { title: t("about.timeline.w4.title"), body: t("about.timeline.w4.body") },
              { title: t("about.timeline.w5.title"), body: t("about.timeline.w5.body") },
              { title: t("about.timeline.w6.title"), body: t("about.timeline.w6.body") },
              { title: t("about.timeline.w7.title"), body: t("about.timeline.w7.body") },
              { title: t("about.timeline.w8.title"), body: t("about.timeline.w8.body") },
              { title: t("about.timeline.w9.title"), body: t("about.timeline.w9.body") },
            ].map((w, i, arr) => {
              const isLatest = i === arr.length - 1;
              return (
                <div key={i} className="relative">
                  <span
                    className={`absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-background ${isLatest ? "border-2 border-primary" : "border-2 border-primary/60"}`}
                    style={{
                      boxShadow: isLatest
                        ? "0 0 14px oklch(0.60 0.18 290 / 0.8)"
                        : "0 0 8px oklch(0.60 0.18 290 / 0.5)",
                      animation: isLatest ? "hud-pulse 2s ease-in-out infinite" : undefined,
                    }}
                  />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    {w.title}
                    {isLatest && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-400/40 text-emerald-400 bg-emerald-400/10 normal-case tracking-wider">
                        ATUAL
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{w.body}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Fontes de dados */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/80 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> {t("about.apis.title")}
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50 tabular-nums">
              {DATA_SOURCES.length} endpoints
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DATA_SOURCES.map((s) => {
              const Icon = s.icon;
              const meta = DOMAIN_LABEL[s.domain];
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                      background: `color-mix(in oklch, ${meta.accent} 12%, transparent)`,
                      borderColor: `color-mix(in oklch, ${meta.accent} 25%, transparent)`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.accent }} />
                  </div>
                  <div className="grow min-w-0">
                    <div className="font-mono font-bold text-sm truncate">{s.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground/70 truncate">
                      {s.description}
                    </div>
                  </div>
                  <span
                    className="text-[8px] font-mono uppercase tracking-widest shrink-0"
                    style={{ color: meta.accent }}
                  >
                    {meta.pt}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0" />
                </a>
              );
            })}
          </div>
        </motion.section>

        {/* Autor */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 block">
              {t("about.author")}
            </span>
            <p className="font-serif text-2xl font-bold mt-1">João Vitor</p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-primary hover:underline"
          >
            <Orbit className="w-4 h-4" />
            Universe.OS · v{APP_VERSION}
          </Link>
        </motion.section>
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: number;
  accent: string;
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div
      className="rounded-xl border bg-white/[0.02] p-4 flex flex-col gap-1"
      style={{ borderColor: `color-mix(in oklch, ${accent} 18%, transparent)` }}
    >
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
        {label}
      </span>
      <span className="font-mono font-bold tabular-nums text-2xl" style={{ color: accent }}>
        {value}
      </span>
      <div className="flex gap-0.5 mt-1.5">
        {Array.from({ length: 12 }).map((_, j) => (
          <span
            key={j}
            className="w-1 h-1.5 rounded-sm"
            style={{
              background: j < Math.min(value, 12)
                ? `color-mix(in oklch, ${accent} 60%, transparent)`
                : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
