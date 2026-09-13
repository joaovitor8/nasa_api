"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Orbit, Menu, X, Radar, Sparkles } from "lucide-react";

import {
  CATEGORY_META,
  getModulesByCategory,
  type ModuleCategory,
} from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";
import { pickLocale, useLocale } from "@/src/lib/i18n";
import { withAlpha } from "@/src/lib/utils";

const CATEGORY_ORDER: ModuleCategory[] = [
  "media",
  "defense",
  "cartography",
  "science",
];

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useLocale();

  const inModule =
    pathname !== "/" &&
    pathname !== "/sobre" &&
    pathname !== "/mission-control";

  const isCurrentRoute = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="fixed top-6 inset-x-0 z-50 h-16 border-b border-white/6 bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group relative"
          >
            <div className="relative">
              <Orbit className="w-6 h-6 text-primary transition-transform duration-700 group-hover:rotate-180" />
              <span className="absolute inset-0 blur-md bg-primary/40 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.2em]">
                UNIVERSO
              </span>
              <span className="text-[8px] font-mono tracking-[0.4em] text-muted-foreground/70 mt-0.5 hidden sm:block">
                COSMOS · OS
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm">
            <NavLink href="/" active={pathname === "/"}>
              {t("nav.home")}
            </NavLink>

            <div
              className="relative py-5"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 transition-colors font-medium ${
                  inModule
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.modules")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 w-5xl rounded-2xl shadow-2xl overflow-hidden border border-white/8 bg-[#06060c]/95 backdrop-blur-2xl"
                  >
                    {/* Brackets */}
                    <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-primary/60" />
                    <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-primary/60" />
                    <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-primary/60" />
                    <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-primary/60" />

                    {/* Top: 4 categorias */}
                    <div className="grid grid-cols-4 gap-6 p-7 pb-6">
                      {CATEGORY_ORDER.map((catId) => {
                        const meta = CATEGORY_META[catId];
                        const modules = getModulesByCategory(catId);
                        const Icon = meta.icon;

                        return (
                          <div key={catId} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-primary text-[10px] font-mono uppercase tracking-[0.25em] border-b border-white/8 pb-2 mb-1">
                              <Icon className="w-3.5 h-3.5" /> {t(`category.${catId}`)}
                            </div>
                            {modules.map((mod) => {
                              const isActive = mod.status === "active";
                              const isCurrent = !mod.external && isCurrentRoute(mod.href);
                              const title = pickLocale(mod.title, mod.titleEn, locale);
                              const className = `group flex items-center justify-between gap-2 text-sm transition-all rounded-md -mx-1 px-1 py-0.5 ${
                                isCurrent
                                  ? "font-bold"
                                  : isActive
                                  ? "text-muted-foreground hover:text-foreground"
                                  : "text-muted-foreground/30 cursor-not-allowed"
                              }`;
                              const style = isCurrent
                                ? {
                                    color: mod.theme.accent,
                                    background: mod.theme.accentSoft,
                                  }
                                : undefined;
                              const content = (
                                <>
                                  <span className="flex items-center gap-2">
                                    {isActive && !isCurrent && (
                                      <span
                                        className="w-1 h-1 rounded-full opacity-0 group-hover:opacity-80 transition-opacity"
                                        style={{
                                          background: mod.theme.accent,
                                          boxShadow: `0 0 6px ${mod.theme.accent}`,
                                        }}
                                      />
                                    )}
                                    {isCurrent && (
                                      <span
                                        className="w-1 h-1 rounded-full"
                                        style={{
                                          background: mod.theme.accent,
                                          boxShadow: `0 0 8px ${mod.theme.accent}`,
                                        }}
                                      />
                                    )}
                                    {title}
                                  </span>
                                  {!isActive ? (
                                    <span className="text-[8px] font-mono tracking-widest uppercase border border-muted-foreground/15 rounded px-1 py-0.5">
                                      {t("nav.soon")}
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[9px] font-mono opacity-40 group-hover:opacity-80 transition-opacity">
                                      {mod.codename}
                                      {mod.external && <ArrowUpRight className="w-2.5 h-2.5" />}
                                    </span>
                                  )}
                                </>
                              );

                              if (isActive && mod.external) {
                                return (
                                  <a
                                    key={mod.id}
                                    href={mod.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setMegaOpen(false)}
                                    className={className}
                                    style={style}
                                  >
                                    {content}
                                  </a>
                                );
                              }

                              return (
                                <Link
                                  key={mod.id}
                                  href={isActive ? mod.href : "#"}
                                  onClick={(e) => {
                                    if (!isActive) e.preventDefault();
                                    setMegaOpen(false);
                                  }}
                                  className={className}
                                  style={style}
                                  aria-disabled={!isActive}
                                  aria-current={isCurrent ? "page" : undefined}
                                >
                                  {content}
                                </Link>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom: faixa de Sistema Solar + Subsystems */}
                    <div className="border-t border-white/6 bg-white/1.5 px-7 py-4 grid grid-cols-12 gap-6">
                      <div className="col-span-9">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] mb-2.5" style={{ color: "oklch(0.78 0.16 80)" }}>
                          <Sparkles className="w-3 h-3" /> {t("nav.bodies")}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {SOLAR_BODIES.map((body) => {
                            const href = `/solar-system/${body.id}`;
                            const isCurrent = pathname === href;
                            return (
                              <Link
                                key={body.id}
                                href={href}
                                onClick={() => setMegaOpen(false)}
                                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.18em] border transition-all hover:scale-105"
                                style={{
                                  borderColor: isCurrent
                                    ? body.accent
                                    : "rgba(255,255,255,0.08)",
                                  background: isCurrent
                                    ? `color-mix(in oklch, ${body.accent} 18%, transparent)`
                                    : "transparent",
                                  color: isCurrent ? body.accent : "var(--muted-foreground)",
                                }}
                                aria-current={isCurrent ? "page" : undefined}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{
                                    background: body.accent,
                                    boxShadow: `0 0 6px ${withAlpha(body.accent, 0.6)}`,
                                  }}
                                />
                                {locale === "en" ? body.en : body.pt}
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-3 flex flex-col gap-2 border-l border-white/6 pl-6">
                        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-1">
                          {t("nav.subsystems")}
                        </div>
                        <SubsystemLink
                          href="/mission-control"
                          label={t("nav.missionControl")}
                          active={pathname === "/mission-control"}
                          onClick={() => setMegaOpen(false)}
                        />
                        <SubsystemLink
                          href="/sobre"
                          label={t("nav.about")}
                          active={pathname === "/sobre"}
                          onClick={() => setMegaOpen(false)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/sobre" active={pathname === "/sobre"}>
              {t("nav.about")}
            </NavLink>
          </nav>

          {/* Mission Control + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/mission-control"
              className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] px-4 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all hover:scale-[1.03] active:scale-95"
              style={{ boxShadow: "0 0 18px oklch(0.60 0.18 290 / 0.15)" }}
            >
              <Radar className="w-3.5 h-3.5" />
              {t("nav.missionControl")}
            </Link>

            <button
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t("nav.menu")}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-22 z-40 bg-background/95 backdrop-blur-3xl lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-8 pb-32">
              {CATEGORY_ORDER.map((catId) => {
                const meta = CATEGORY_META[catId];
                const modules = getModulesByCategory(catId);
                const Icon = meta.icon;

                return (
                  <div key={catId} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.25em] border-b border-white/10 pb-2">
                      <Icon className="w-4 h-4" /> {t(`category.${catId}`)}
                    </div>
                    <div className="flex flex-col gap-3 pl-2">
                      {modules.map((mod) => {
                        const isActive = mod.status === "active";
                        const isCurrent = !mod.external && isCurrentRoute(mod.href);
                        const title = pickLocale(mod.title, mod.titleEn, locale);
                        const className = "flex items-center justify-between text-base transition-colors";
                        const style = isCurrent
                          ? { color: mod.theme.accent, fontWeight: 700 }
                          : undefined;
                        const content = (
                          <>
                            <span className={`flex items-center gap-1.5 ${isCurrent ? "" : isActive ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                              {title}
                              {isActive && mod.external && <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />}
                            </span>
                            {!isActive && (
                              <span className="text-[9px] font-mono tracking-widest uppercase border border-muted-foreground/20 rounded px-1.5 py-0.5">
                                {t("nav.soon")}
                              </span>
                            )}
                          </>
                        );

                        if (isActive && mod.external) {
                          return (
                            <a
                              key={mod.id}
                              href={mod.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setMobileOpen(false)}
                              className={className}
                              style={style}
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={mod.id}
                            href={isActive ? mod.href : "#"}
                            onClick={(e) => {
                              if (!isActive) e.preventDefault();
                              setMobileOpen(false);
                            }}
                            className={className}
                            style={style}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Sistema Solar mobile */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-[0.25em] border-b border-white/10 pb-2" style={{ color: "oklch(0.78 0.16 80)" }}>
                  <Sparkles className="w-4 h-4" /> {t("nav.bodies")}
                </div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                  {SOLAR_BODIES.map((body) => {
                    const href = `/solar-system/${body.id}`;
                    return (
                      <Link
                        key={body.id}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-sm py-1"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: body.accent,
                            boxShadow: `0 0 6px ${body.accent.replace(")", " / 0.6)")}`,
                          }}
                        />
                        <span style={{ color: pathname === href ? body.accent : undefined }}>
                          {locale === "en" ? body.en : body.pt}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative py-1 transition-colors font-medium ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute -bottom-1 inset-x-0 h-px bg-primary"
          style={{ boxShadow: "0 0 8px oklch(0.60 0.18 290 / 0.6)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

interface SubsystemLinkProps {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SubsystemLink({ href, label, active, onClick }: SubsystemLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between text-sm transition-colors py-1 ${
        active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span>{label}</span>
      <span className="text-[9px] font-mono opacity-40">→</span>
    </Link>
  );
}
