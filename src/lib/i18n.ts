"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ─── Tipagem ─────────────────────────────────────────────────── */

export type Locale = "pt" | "en";

export const LOCALES: { id: Locale; label: string; tag: string }[] = [
  { id: "pt", label: "PT", tag: "pt-BR" },
  { id: "en", label: "EN", tag: "en-US" },
];

const STORAGE_KEY = "universe.locale";

/* ─── Dicionário ──────────────────────────────────────────────── */

export const dict = {
  /* Header / Nav */
  "nav.home": { pt: "Início", en: "Home" },
  "nav.modules": { pt: "Módulos Estelares", en: "Stellar Modules" },
  "nav.about": { pt: "Sobre o Projeto", en: "About" },
  "nav.missionControl": { pt: "Mission Control", en: "Mission Control" },
  "nav.menu": { pt: "Alternar menu", en: "Toggle menu" },
  "nav.soon": { pt: "Soon", en: "Soon" },
  "nav.subsystems": { pt: "Subsistemas", en: "Subsystems" },
  "nav.bodies": { pt: "Corpos Celestes", en: "Celestial Bodies" },
  "nav.search": { pt: "Filtrar módulos…", en: "Filter modules…" },
  "nav.results": { pt: "resultados", en: "results" },

  /* Status Bar */
  "status.nominal": { pt: "All Systems Nominal", en: "All Systems Nominal" },
  "status.uplink": { pt: "Uplink Stable", en: "Uplink Stable" },
  "status.channel": { pt: "Channel 16", en: "Channel 16" },

  /* Categorias */
  "category.media": { pt: "Mídia & Arquivos", en: "Media & Archives" },
  "category.defense": { pt: "Defesa & Monitoramento", en: "Defense & Monitoring" },
  "category.cartography": { pt: "Sondas & Cartografia", en: "Probes & Cartography" },
  "category.science": { pt: "Ciência & Engenharia", en: "Science & Engineering" },

  /* Home — Hero */
  "home.badge": { pt: "Sistemas Operacionais Conectados", en: "Connected Operating Systems" },
  "home.title.l1": { pt: "Uma Jornada pelos", en: "A Journey Through the" },
  "home.title.l2": { pt: "Arquivos do Cosmos", en: "Cosmos Archives" },
  "home.subtitle": {
    pt: "Console unificada de telemetria, defesa planetária e arquivos espaciais. Da poeira ancestral de Marte à luz de galáxias distantes — tudo codificado e ao seu alcance.",
    en: "Unified console for telemetry, planetary defense, and space archives. From the ancient dust of Mars to the light of distant galaxies — all decoded and at your fingertips.",
  },
  "home.cta": { pt: "Iniciar Exploração", en: "Begin Exploration" },
  "home.cta.secondary": { pt: "Explorar Catálogo", en: "Browse Catalog" },

  /* Home — Live preview */
  "home.live.label": { pt: "Sinal ao Vivo", en: "Live Signal" },
  "home.live.apodTitle": { pt: "Imagem do Dia", en: "Image of the Day" },
  "home.live.apodCta": { pt: "Abrir registro completo", en: "Open full record" },
  "home.live.apodFailure": { pt: "Sinal APOD indisponível", en: "APOD signal unavailable" },
  "home.live.openMc": { pt: "Painel agregado completo", en: "Full aggregated panel" },
  "home.live.nextLaunch": { pt: "Próximo Lançamento", en: "Next Launch" },
  "home.live.nextLaunchEmpty": { pt: "Sem janelas confirmadas", en: "No confirmed windows" },
  "home.live.lastFlare": { pt: "Última Erupção", en: "Latest Flare" },
  "home.live.lastFlareEmpty": { pt: "Sol em silêncio nos últimos 7 dias", en: "Quiet Sun for the past 7 days" },
  "home.live.signalLost": { pt: "Sinal perdido", en: "Signal lost" },

  /* Home — Solar strip */
  "home.solar.label": { pt: "Sistema Solar", en: "Solar System" },
  "home.solar.subtitle": { pt: "10 corpos catalogados — clique para o dossiê físico.", en: "10 bodies cataloged — click for the physical dossier." },
  "home.solar.openMap": { pt: "Mapa orbital completo", en: "Full orbital map" },

  /* Home — Filter */
  "home.filter.all": { pt: "Todos", en: "All" },

  /* Home — Stats */
  "home.stats.modules": { pt: "Módulos Online", en: "Modules Online" },
  "home.stats.apis": { pt: "APIs Conectadas", en: "Connected APIs" },
  "home.stats.coverage": { pt: "Cobertura", en: "Coverage" },
  "home.stats.status": { pt: "Status", en: "Status" },
  "home.stats.uptime": { pt: "uptime", en: "uptime" },
  "home.stats.channels": { pt: "channels", en: "channels" },
  "home.stats.nominal": { pt: "NOMINAL", en: "NOMINAL" },
  "home.stats.bodies": { pt: "Corpos Celestes", en: "Celestial Bodies" },
  "home.stats.routes": { pt: "Rotas Estáticas", en: "Static Routes" },

  /* Home — Catálogo */
  "home.catalog.label": { pt: "Catálogo Operacional", en: "Operational Catalog" },
  "home.catalog.title": { pt: "Módulos de Pesquisa", en: "Research Modules" },
  "home.catalog.subtitle": {
    pt: "Selecione uma interface para calibrar a telemetria.",
    en: "Select an interface to calibrate telemetry.",
  },
  "home.catalog.active": { pt: "Ativos", en: "Active" },
  "home.catalog.refresh": { pt: "Refresh em tempo real", en: "Real-time refresh" },
  "home.card.live": { pt: "Live", en: "Live" },
  "home.card.access": { pt: "Acessar", en: "Access" },

  /* Footer */
  "footer.description": {
    pt: "Console unificada de exploração espacial. Telemetria em tempo real, defesa planetária, cartografia e arquivos da NASA, JPL, Caltech e CelesTrak — uma única jornada de código através do cosmos.",
    en: "Unified console for space exploration. Real-time telemetry, planetary defense, cartography, and archives from NASA, JPL, Caltech, and CelesTrak — a single coded journey through the cosmos.",
  },
  "footer.activeModules": { pt: "Módulos Ativos", en: "Active Modules" },
  "footer.missionStatus": { pt: "Status da Missão", en: "Mission Status" },
  "footer.online": { pt: "Online", en: "Online" },
  "footer.planned": { pt: "Planejados", en: "Planned" },
  "footer.console": { pt: "Console", en: "Console" },
  "footer.uplink": { pt: "Uplink Estável · Latência Nominal", en: "Stable Uplink · Nominal Latency" },
  "footer.builtWith": {
    pt: "Construído com Next.js · React Three Fiber · Tailwind v4",
    en: "Built with Next.js · React Three Fiber · Tailwind v4",
  },
  "footer.subsystems": { pt: "Subsistemas", en: "Subsystems" },
  "footer.dataSources": { pt: "Fontes de Dados", en: "Data Sources" },
  "footer.techStack": { pt: "Stack", en: "Stack" },
  "footer.bodies": { pt: "Corpos", en: "Bodies" },
  "footer.routes": { pt: "Rotas", en: "Routes" },
  "footer.sitemap": { pt: "Mapa do Site", en: "Sitemap" },
  "footer.offline": { pt: "Página Offline", en: "Offline Page" },
  "footer.legalNote": {
    pt: "Projeto educacional. Todos os dados pertencem às respectivas agências.",
    en: "Educational project. All data belongs to the respective agencies.",
  },

  /* Sobre */
  "about.codename": { pt: "MANIFESTO-01", en: "MANIFESTO-01" },
  "about.title": { pt: "Sobre o Projeto", en: "About the Project" },
  "about.subtitle": {
    pt: "Uma carta de amor ao cosmos, escrita em TypeScript.",
    en: "A love letter to the cosmos, written in TypeScript.",
  },
  "about.manifesto.title": { pt: "Manifesto", en: "Manifesto" },
  "about.manifesto.body": {
    pt: "Universo é uma console operacional que reúne APIs públicas de exploração espacial em uma única experiência interativa. Cada módulo é uma janela calibrada para um instrumento real — do telescópio Kepler aos coronógrafos do SDO, do NeoWs aos lançamentos da SpaceX. O objetivo não é replicar dashboards científicos, mas devolver ao público uma estética digna do que está sendo observado.",
    en: "Universo is an operational console that gathers public space-exploration APIs into a single interactive experience. Each module is a calibrated window into a real instrument — from the Kepler telescope to the SDO coronagraphs, from NeoWs to SpaceX launches. The goal is not to replicate scientific dashboards, but to give the public an aesthetic worthy of what is being observed.",
  },
  "about.stack.title": { pt: "Stack Tecnológico", en: "Tech Stack" },
  "about.apis.title": { pt: "Fontes de Dados", en: "Data Sources" },
  "about.timeline.title": { pt: "Linha do Tempo", en: "Timeline" },
  "about.timeline.subtitle": { pt: "Ondas de desenvolvimento", en: "Development waves" },
  "about.timeline.w1.title": { pt: "Onda 1 · Fundação", en: "Wave 1 · Foundation" },
  "about.timeline.w1.body": { pt: "Sistema de temas modulares, primitivos HUD, tipos compartilhados.", en: "Modular theme system, HUD primitives, shared types." },
  "about.timeline.w2.title": { pt: "Onda 2 · Refatoração", en: "Wave 2 · Refactor" },
  "about.timeline.w2.body": { pt: "8 páginas reescritas com ModuleScope, cores temáticas e correções.", en: "8 pages rewritten with ModuleScope, themed colors, and fixes." },
  "about.timeline.w3.title": { pt: "Onda 3 · Novas Fronteiras", en: "Wave 3 · New Frontiers" },
  "about.timeline.w3.body": { pt: "SpaceX, Comms Intercept, TechPort e DONKI ativados.", en: "SpaceX, Comms Intercept, TechPort, and DONKI activated." },
  "about.timeline.w4.title": { pt: "Onda 4 · Imersão 3D", en: "Wave 4 · 3D Immersion" },
  "about.timeline.w4.body": { pt: "React Three Fiber, sistema orbital de exoplanetas e simulador de buraco negro.", en: "React Three Fiber, exoplanet orbital system, and black hole simulator." },
  "about.timeline.w5.title": { pt: "Onda 5 · Polimento & i18n", en: "Wave 5 · Polish & i18n" },
  "about.timeline.w5.body": { pt: "Toggle PT/EN, página Sobre e Mission Control agregado.", en: "PT/EN toggle, About page, and aggregated Mission Control." },
  "about.timeline.w6.title": { pt: "Onda 6 · Ativação Total", en: "Wave 6 · Full Activation" },
  "about.timeline.w6.body": { pt: "Mars InSight, EONET, GIBS, TechTransfer, OSDR e Trek WMTS — 19/19 módulos online.", en: "Mars InSight, EONET, GIBS, TechTransfer, OSDR, and Trek WMTS — 19/19 modules online." },
  "about.timeline.w7.title": { pt: "Onda 7 · SEO & Performance", en: "Wave 7 · SEO & Performance" },
  "about.timeline.w7.body": { pt: "Metadata por rota, sitemap.xml, robots.ts, Open Graph, next/image em hero shots.", en: "Per-route metadata, sitemap.xml, robots.ts, Open Graph, next/image on hero shots." },
  "about.timeline.w8.title": { pt: "Onda 8 · PWA & Offline", en: "Wave 8 · PWA & Offline" },
  "about.timeline.w8.body": { pt: "Manifest, ícones SVG, service worker custom, página offline e install prompt.", en: "Manifest, SVG icons, custom service worker, offline page, and install prompt." },
  "about.timeline.w9.title": { pt: "Onda 9 · Sistema Solar & Polish", en: "Wave 9 · Solar System & Polish" },
  "about.timeline.w9.body": { pt: "Mapa orbital de 10 corpos via Wikipedia API, Header/Footer/Home reestruturados, limpeza de deps.", en: "Orbital map of 10 bodies via Wikipedia API, Header/Footer/Home restructured, dep cleanup." },
  "about.author": { pt: "Construído por", en: "Built by" },
  "about.version": { pt: "Versão atual", en: "Current build" },
  "about.stats.modules": { pt: "Módulos", en: "Modules" },
  "about.stats.bodies": { pt: "Corpos", en: "Bodies" },
  "about.stats.routes": { pt: "Rotas", en: "Routes" },
  "about.stats.sources": { pt: "Fontes", en: "Sources" },

  /* Mission Control */
  "mc.codename": { pt: "MISSION-CONTROL", en: "MISSION-CONTROL" },
  "mc.title": { pt: "Mission Control", en: "Mission Control" },
  "mc.subtitle": {
    pt: "Painel agregado · APOD · Próximo lançamento · Sentry · Atividade solar",
    en: "Aggregated dashboard · APOD · Next launch · Sentry · Solar activity",
  },
  "mc.apod": { pt: "Imagem do Dia", en: "Image of the Day" },
  "mc.nextLaunch": { pt: "Próximo Lançamento", en: "Next Launch" },
  "mc.sentry": { pt: "Maior Ameaça Sentry", en: "Top Sentry Threat" },
  "mc.solar": { pt: "Última Erupção Solar", en: "Latest Solar Flare" },
  "mc.openModule": { pt: "Abrir módulo", en: "Open module" },
  "mc.tMinus": { pt: "T-", en: "T-" },
  "mc.live": { pt: "Live", en: "Live" },
  "mc.empty": { pt: "Sem dados disponíveis no momento.", en: "No data available right now." },
  "mc.loading": { pt: "Compilando feed agregado", en: "Compiling aggregated feed" },

  /* Erros */
  "common.retry": { pt: "Restabelecer Sinal", en: "Restore Signal" },
} as const satisfies Record<string, { pt: string; en: string }>;

export type DictKey = keyof typeof dict;

/* ─── Context + provider ─────────────────────────────────────── */

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: DictKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");

  // Hidrata da preferência do usuário (next-frame para evitar cascade render)
  useEffect(() => {
    const apply = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
        if (stored === "pt" || stored === "en") setLocaleState(stored);
      } catch {
        /* localStorage indisponível — segue com default */
      }
    };
    const raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Reflete locale no <html lang>
  useEffect(() => {
    const tag = LOCALES.find((l) => l.id === locale)?.tag ?? "pt-BR";
    document.documentElement.setAttribute("lang", tag);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* fail-silent */
    }
  }, []);

  const t = useCallback((key: DictKey) => dict[key][locale], [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return createElement(LocaleContext.Provider, { value }, children);
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale deve ser usado dentro de <LocaleProvider>");
  return ctx;
}

/** Hook conveniente quando só a função `t` é necessária. */
export function useT() {
  return useLocale().t;
}

/** Helper para campos de modelo com tradução opcional (fallback PT). */
export const pickLocale = (pt: string, en: string | undefined, locale: Locale) =>
  locale === "en" && en ? en : pt;
