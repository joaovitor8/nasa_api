"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { ArrowUpRight, Orbit, Rocket, Sparkles } from "lucide-react";

import {
  CATEGORY_META,
  ENABLED_MODULES,
  getModulesByCategory,
  type ModuleCategory,
} from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";
import { pickLocale, useLocale } from "@/src/lib/i18n";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const CATEGORY_ORDER: ModuleCategory[] = [
  "media",
  "defense",
  "cartography",
  "science",
];

const DATA_SOURCES = [
  "NASA", "JPL", "Caltech", "NOAA SWPC", "ESA EONET",
  "SpaceX", "CelesTrak", "Spaceflight News", "OSDR", "Wikipedia",
];

const TECH_STACK = [
  "Next.js 16", "React 19", "TypeScript 5", "Tailwind v4",
  "Three.js", "Framer Motion", "TanStack Query",
];

const GithubIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.36s-1.4-3.4-1.4-3.4a4.4 4.4 0 0 0-.09-3.41S17 2 12 5.5a11 11 0 0 0-4 0C3.5 2 2.5 2 2.5 2a4.4 4.4 0 0 0-.09 3.41S1 7.2 1 12c0 4.83 3 6 6 6.36a4.8 4.8 0 0 0-1 3.24v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const year = new Date().getFullYear();
  const { t, locale } = useLocale();

  // Conta total de rotas internas: módulos não-externos + corpos celestes + estáticas (mc, sobre, offline)
  const internalModulesCount = ENABLED_MODULES.filter((m) => !m.external).length;
  const totalRoutes = internalModulesCount + SOLAR_BODIES.length + 3;

  return (
    <footer className="relative mt-20 border-t border-white/6 bg-background/95 backdrop-blur-md">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.60 0.18 290 / 0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-4 pt-14 pb-8">
        {/* Top: brand + módulos + subsistemas + status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Orbit className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-700" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold tracking-[0.2em]">
                  UNIVERSO
                </span>
                <span className="text-[8px] font-mono tracking-[0.4em] text-muted-foreground/70 mt-0.5">
                  COSMOS · OS
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {t("footer.description")}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <SocialIcon
                href="https://github.com/joaovitor8"
                label="GitHub"
                icon={GithubIcon}
              />
              <SocialIcon
                href="https://linkedin.com/in/joaovitorezequiel"
                label="LinkedIn"
                icon={LinkedinIcon}
              />
            </div>
          </div>

          {/* Módulos por categoria */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
            {CATEGORY_ORDER.map((catId) => {
              const meta = CATEGORY_META[catId];
              const modules = getModulesByCategory(catId).filter((m) => m.status === "active");
              const Icon = meta.icon;

              return (
                <div key={catId} className="flex flex-col gap-2.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.25em] text-primary border-b border-white/6 pb-1.5">
                    <Icon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{t(`category.${catId}`)}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {modules.map((mod) => {
                      const linkClass = "text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group";
                      const inner = (
                        <>
                          <span
                            className="w-1 h-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
                            style={{
                              background: mod.theme.accent,
                              boxShadow: `0 0 6px ${mod.theme.accent}`,
                            }}
                          />
                          <span className="truncate">{pickLocale(mod.title, mod.titleEn, locale)}</span>
                          {mod.external && <ArrowUpRight className="w-2.5 h-2.5 opacity-50 shrink-0" />}
                        </>
                      );
                      return (
                        <li key={mod.id}>
                          {mod.external ? (
                            <a href={mod.href} target="_blank" rel="noreferrer" className={linkClass}>
                              {inner}
                            </a>
                          ) : (
                            <Link href={mod.href} className={linkClass}>
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Subsistemas + Status */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-2.5">
                {t("footer.subsystems")}
              </h3>
              <ul className="flex flex-col gap-1.5 text-xs">
                <FooterLink href="/mission-control" label={t("nav.missionControl")} />
                <FooterLink href="/solar-system" label={pickLocale("Sistema Solar", "Solar System", locale)} icon={<Sparkles className="w-3 h-3" />} />
                <FooterLink href="/sobre" label={t("nav.about")} />
                <FooterLink href="/offline" label={t("footer.offline")} />
                <FooterLink href="/sitemap.xml" label={t("footer.sitemap")} external />
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-2.5">
                {t("footer.missionStatus")}
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                <Stat label={t("footer.online")} value={ENABLED_MODULES.length} accent="emerald" />
                <Stat label={t("footer.bodies")} value={SOLAR_BODIES.length} accent="amber" />
                <Stat label={t("footer.routes")} value={totalRoutes} accent="cyan" />
              </div>
              <div className="flex items-center gap-2 mt-3 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_oklch(0.78_0.18_145)]" />
                {t("footer.uplink")}
              </div>
            </div>
          </div>
        </div>

        {/* Mid: Data Sources + Tech Stack chips */}
        <div className="mt-12 pt-8 border-t border-white/6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 mb-3">
              {t("footer.dataSources")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {DATA_SOURCES.map((src) => (
                <span
                  key={src}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded-md border border-white/6 bg-white/2 text-muted-foreground"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/70 mb-3">
              {t("footer.techStack")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1 rounded-md border bg-primary/4 text-primary/80"
                  style={{ borderColor: "color-mix(in oklch, oklch(0.60 0.18 290) 25%, transparent)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
          <div className="flex items-center gap-2 flex-wrap">
            <Rocket className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span>Universo Project</span>
            <span className="opacity-40">·</span>
            <span>© {year}</span>
          </div>

          <span className="text-center sm:text-right normal-case tracking-normal opacity-60 max-w-md">
            {t("footer.legalNote")}
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all hover:scale-110"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

interface FooterLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  external?: boolean;
}

function FooterLink({ href, label, icon, external }: FooterLinkProps) {
  const className = "text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group";
  const content = (
    <>
      {icon ? (
        <span className="text-muted-foreground/50 group-hover:text-foreground/80 transition-colors shrink-0">
          {icon}
        </span>
      ) : (
        <span className="text-[9px] font-mono opacity-30 group-hover:opacity-80 transition-opacity">→</span>
      )}
      {label}
    </>
  );

  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}

interface StatProps {
  label: string;
  value: string | number;
  accent: "emerald" | "amber" | "cyan";
}

const STAT_COLOR: Record<StatProps["accent"], string> = {
  emerald: "oklch(0.78 0.18 145)",
  amber: "oklch(0.78 0.16 80)",
  cyan: "oklch(0.78 0.13 200)",
};

function Stat({ label, value, accent }: StatProps) {
  return (
    <div className="bg-white/2 border border-white/6 rounded-md p-2 flex flex-col gap-0.5">
      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70 truncate">
        {label}
      </span>
      <span className="font-mono font-bold tabular-nums text-base" style={{ color: STAT_COLOR[accent] }}>
        {value}
      </span>
    </div>
  );
}
