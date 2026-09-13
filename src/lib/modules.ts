import {
  Atom,
  Briefcase,
  Camera,
  Cpu,
  Database,
  Dna,
  Globe2,
  Image as ImageIcon,
  Layers,
  Library,
  Map as MapIcon,
  Newspaper,
  Orbit,
  Radio,
  Rocket,
  ShieldAlert,
  Sun,
  Sparkles,
  Telescope,
  Terminal,
  ThermometerSun,
  type LucideIcon,
} from "lucide-react";

import { withAlpha } from "./utils";

export type ModuleStatus = "active" | "planned";
export type ModuleSize = "sm" | "lg";
export type ModuleCategory = "media" | "defense" | "cartography" | "science";

export interface ModuleTheme {
  /** Cor de destaque viva (oklch). Usada em glows, ícones, headlines. */
  accent: string;
  /** Variante translúcida para fundos e estados hover. */
  accentSoft: string;
  /** Box-shadow pronto para aplicar no hover do card. */
  glow: string;
}

export interface SpaceModule {
  id: string;
  /** Codinome táctico curto, exibido em fonte mono nos HUDs. */
  codename: string;
  title: string;
  /** Variante em inglês — quando ausente, mantém-se o título PT. */
  titleEn?: string;
  description: string;
  /** Variante em inglês — quando ausente, mantém-se a descrição PT. */
  descriptionEn?: string;
  href: string;
  icon: LucideIcon;
  category: ModuleCategory;
  status: ModuleStatus;
  size: ModuleSize;
  theme: ModuleTheme;
  /** Quando true, `href` aponta para um deploy externo (abre em nova aba). */
  external?: boolean;
}

const theme = (accent: string): ModuleTheme => ({
  accent,
  accentSoft: withAlpha(accent, 0.15),
  glow: `0 0 32px ${withAlpha(accent, 0.35)}`,
});

export const SPACE_MODULES: SpaceModule[] = [
  {
    id: "apod",
    codename: "APOD-01",
    title: "A Imagem do Dia",
    titleEn: "Image of the Day",
    description:
      "A galeria diária da NASA. Cada dia, uma nova janela para a vastidão do espaço.",
    descriptionEn:
      "NASA's daily gallery. Each day, a new window into the vastness of space.",
    href: "/apod",
    icon: ImageIcon,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.16 80)"),
  },
  {
    id: "library",
    codename: "ARCHIVE-CENTRAL",
    title: "Arquivo Central",
    titleEn: "Central Archive",
    description:
      "Mecanismo de busca multimídia. Milhares de imagens e vídeos históricos da NASA.",
    descriptionEn:
      "Multimedia search engine. Thousands of historical NASA images and videos.",
    href: "/library",
    icon: Library,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.74 0.15 60)"),
  },
  {
    id: "asteroids",
    codename: "NEO-RADAR",
    title: "Rastreio NEO",
    titleEn: "NEO Tracking",
    description:
      "Monitoramento em tempo real de asteroides e objetos próximos à Terra (NeoWs).",
    descriptionEn:
      "Real-time monitoring of near-Earth asteroids and objects (NeoWs).",
    href: "/asteroids",
    icon: Telescope,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.72 0.18 35)"),
  },
  {
    id: "cneos",
    codename: "SENTRY-MATRIX",
    title: "Defesa Planetária",
    titleEn: "Planetary Defense",
    description:
      "Matriz Sentry de Avaliação de Ameaças e cálculo de risco de impacto (CNEOS).",
    descriptionEn:
      "Sentry threat-assessment matrix and impact-risk computation (CNEOS).",
    href: "/cneos",
    icon: ShieldAlert,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.65 0.22 25)"),
  },
  {
    id: "epic",
    codename: "DSCOVR-L1",
    title: "Satélite DSCOVR",
    titleEn: "DSCOVR Satellite",
    description:
      "Time-lapse da rotação da Terra vista do ponto Lagrange L1 (EPIC).",
    descriptionEn:
      "Time-lapse of Earth's rotation seen from the Lagrange L1 point (EPIC).",
    href: "/epic",
    icon: Camera,
    category: "media",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.72 0.14 220)"),
  },
  {
    id: "exoplanets",
    codename: "DEEP-CATALOG",
    title: "Catálogo Exoplanetário",
    titleEn: "Exoplanet Catalog",
    description:
      "Escaneamento profundo de mundos confirmados além do nosso sistema solar.",
    descriptionEn:
      "Deep scan of confirmed worlds beyond our solar system.",
    href: "/exoplanets",
    icon: Database,
    category: "science",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.68 0.18 290)"),
  },
  {
    id: "ssc",
    codename: "ORBIT-TRAFFIC",
    title: "Tráfego Orbital",
    titleEn: "Orbital Traffic",
    description:
      "Radar de cruzamento de frota e rastreio espacial (Situation Center).",
    descriptionEn:
      "Fleet-crossing radar and space tracking (Situation Center).",
    href: "/ssc",
    icon: Radio,
    category: "cartography",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.74 0.15 145)"),
  },
  {
    id: "tle",
    codename: "TLE-TERMINAL",
    title: "Terminal TLE",
    titleEn: "TLE Terminal",
    description:
      "Descriptografia de elementos de duas linhas para cálculo orbital.",
    descriptionEn:
      "Two-line element decryption for orbital computation.",
    href: "/tle",
    icon: Terminal,
    category: "cartography",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.18 130)"),
  },
  {
    id: "spacex",
    codename: "FALCON-FLEET",
    title: "Frota SpaceX",
    titleEn: "SpaceX Fleet",
    description:
      "Próximos lançamentos, frota Falcon/Starship e missões privadas em órbita.",
    descriptionEn:
      "Upcoming launches, the Falcon/Starship fleet, and private orbital missions.",
    href: "/spacex",
    icon: Rocket,
    category: "cartography",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.12 30)"),
  },
  {
    id: "news",
    codename: "COMMS-INTERCEPT",
    title: "Comms Intercept",
    titleEn: "Comms Intercept",
    description:
      "Feed agregado de notícias do setor espacial — NASA, ESA, SpaceX, ISRO e Roscosmos.",
    descriptionEn:
      "Aggregated newsfeed of the space sector — NASA, ESA, SpaceX, ISRO, and Roscosmos.",
    href: "/news",
    icon: Newspaper,
    category: "media",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.76 0.15 100)"),
  },
  {
    id: "techport",
    codename: "TECHPORT",
    title: "Blueprints de P&D",
    titleEn: "R&D Blueprints",
    description:
      "Esquemas técnicos e níveis de maturidade (TRL) de tecnologias da agência.",
    descriptionEn:
      "Technical schematics and readiness levels (TRL) for agency technologies.",
    href: "/techport",
    icon: Cpu,
    category: "science",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.16 195)"),
  },
  {
    id: "donki",
    codename: "DONKI-SOL",
    title: "Clima Espacial",
    titleEn: "Space Weather",
    description:
      "Relatório táctico de erupções e tempestades solares (DONKI).",
    descriptionEn:
      "Tactical report on solar flares and storms (DONKI).",
    href: "/donki",
    icon: Sun,
    category: "defense",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.80 0.16 70)"),
  },
  {
    id: "singularity",
    codename: "SGR-A*",
    title: "Singularidade",
    titleEn: "Singularity",
    description:
      "Simulador volumétrico de buraco negro com disco de acreção e lente gravitacional.",
    descriptionEn:
      "Volumetric black-hole simulator with accretion disk and gravitational lensing.",
    href: "/singularity",
    icon: Orbit,
    category: "science",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.62 0.22 305)"),
  },
  {
    id: "mars",
    codename: "INSIGHT-BASE",
    title: "Base InSight",
    titleEn: "InSight Base",
    description:
      "Arquivo histórico da telemetria e clima na superfície de Marte.",
    descriptionEn:
      "Historical archive of telemetry and weather on the Martian surface.",
    href: "/mars",
    icon: ThermometerSun,
    category: "media",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.65 0.18 30)"),
  },
  {
    id: "eonet",
    codename: "EONET-WATCH",
    title: "Anomalias Terrestres",
    titleEn: "Earth Anomalies",
    description:
      "Observatório de eventos geológicos e climáticos severos em tempo real (EONET).",
    descriptionEn:
      "Real-time observatory of severe geological and climate events (EONET).",
    href: "/eonet",
    icon: Globe2,
    category: "defense",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.72 0.16 165)"),
  },
  {
    id: "gibs",
    codename: "GIBS-LENS",
    title: "Lentes GIBS",
    titleEn: "GIBS Lenses",
    description:
      "Sobreposição global interativa de dados climáticos e atmosféricos.",
    descriptionEn:
      "Interactive global overlay of climate and atmospheric data.",
    href: "/gibs",
    icon: Layers,
    category: "cartography",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.74 0.13 200)"),
  },
  {
    id: "techtransfer",
    codename: "T-TRANSFER",
    title: "Licenciamento",
    titleEn: "Licensing",
    description:
      "Portal B2B de patentes, códigos-fonte abertos e spinoffs (TechTransfer).",
    descriptionEn:
      "B2B portal of patents, open-source codes, and spinoffs (TechTransfer).",
    href: "/techtransfer",
    icon: Briefcase,
    category: "science",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.72 0.14 50)"),
  },
  {
    id: "osdr",
    codename: "OSDR-LAB",
    title: "Lab. Orbital (OSDR)",
    titleEn: "Orbital Lab (OSDR)",
    description:
      "Dossiês confidenciais de bioinformática e vida submetida à microgravidade.",
    descriptionEn:
      "Confidential dossiers on bioinformatics and life under microgravity.",
    href: "/osdr",
    icon: Dna,
    category: "science",
    status: "active",
    size: "sm",
    theme: theme("oklch(0.70 0.17 320)"),
  },
  {
    id: "trek",
    codename: "TREK-WMTS",
    title: "Cartografia Planetária",
    titleEn: "Planetary Cartography",
    description:
      "Slippy Map para explorar livremente vales e crateras da Lua, Marte e Vesta.",
    descriptionEn:
      "Slippy Map to freely explore valleys and craters of the Moon, Mars, and Vesta.",
    href: "/trek",
    icon: MapIcon,
    category: "cartography",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.70 0.13 45)"),
  },
  {
    id: "cosmogenese",
    codename: "GENESIS-118",
    title: "Cosmogênese",
    titleEn: "Cosmogenesis",
    description:
      "Tabela periódica cósmica — a arqueologia dos 118 elementos, do Big Bang à criação humana.",
    descriptionEn:
      "Cosmic periodic table — the archaeology of the 118 elements, from the Big Bang to human creation.",
    href: "https://cosmogenese.vercel.app",
    icon: Atom,
    category: "science",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.76 0.15 175)"),
    external: true,
  },
  {
    id: "solar-system",
    codename: "HELIOSPHERE",
    title: "Sistema Solar",
    titleEn: "Solar System",
    description:
      "Mapa orbital interativo dos 8 planetas, do Sol e de Plutão — dossiê físico de cada corpo.",
    descriptionEn:
      "Interactive orbital map of the 8 planets, the Sun, and Pluto — physical dossier for each body.",
    href: "/solar-system",
    icon: Sparkles,
    category: "science",
    status: "active",
    size: "lg",
    theme: theme("oklch(0.78 0.16 80)"),
  },
];

export const ENABLED_MODULES = SPACE_MODULES.filter((m) => m.status === "active");

export const CATEGORY_META: Record<
  ModuleCategory,
  { title: string; icon: LucideIcon }
> = {
  media:       { title: "Mídia & Arquivos",       icon: Camera   },
  defense:     { title: "Defesa & Monitoramento", icon: Globe2   },
  cartography: { title: "Sondas & Cartografia",   icon: Telescope },
  science:     { title: "Ciência & Engenharia",   icon: Database },
};

export const sizeToColSpan = (size: ModuleSize) =>
  size === "lg" ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1";

export const getModule = (id: string): SpaceModule | undefined =>
  SPACE_MODULES.find((m) => m.id === id);

export const getModulesByCategory = (category: ModuleCategory) =>
  SPACE_MODULES.filter((m) => m.category === category);
