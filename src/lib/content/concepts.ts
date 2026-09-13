import type { ComponentType } from "react";

import type { ConceptMeta, Level } from "./types";

/**
 * Catálogo de artigos da trilha `/aprender`.
 *
 * A prosa vive em `src/content/aprender/<slug>.mdx`; aqui ficam os metadados
 * que alimentam o hub, o sitemap, os pré-requisitos e os links cruzados.
 *
 * `ARTICLE_LOADERS` é um mapa explícito em vez de import dinâmico com template
 * literal: o bundler resolve tudo em tempo de build, e um teste garante que
 * todo conceito do catálogo tem um carregador correspondente — slug órfão
 * quebra o CI, não a página em produção.
 */

export const CONCEPTS: ConceptMeta[] = [
  {
    slug: "o-que-e-uma-orbita",
    title: { pt: "O que é uma órbita" },
    summary: {
      pt: "Estar em órbita não é escapar da gravidade — é cair para sempre e errar o planeta. O conceito que destrava quase todo o resto da astronáutica.",
    },
    level: "iniciante",
    readingMinutes: 6,
    terms: [
      "orbita-baixa",
      "orbita-geoestacionaria",
      "velocidade-de-escape",
      "excentricidade",
      "perigeu",
      "apogeu",
      "microgravidade",
    ],
    modules: ["tle", "ssc", "spacex"],
    bodies: ["terra"],
    sources: [
      {
        label: "NASA Science — Orbits and Kepler's Laws",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
      {
        label: "NASA — Basics of Space Flight",
        url: "https://science.nasa.gov/learn/basics-of-space-flight/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "as-escalas-do-universo",
    title: { pt: "As escalas do universo" },
    summary: {
      pt: "Unidade astronômica, ano-luz e parsec existem porque o quilômetro não dá conta. Um passeio pelas réguas do cosmos e pelo que elas revelam sobre o tempo.",
    },
    level: "iniciante",
    readingMinutes: 7,
    terms: [
      "unidade-astronomica",
      "ano-luz",
      "parsec",
      "paralaxe",
      "distancia-lunar",
      "galaxia",
    ],
    modules: ["solar-system", "exoplanets", "asteroids"],
    bodies: ["terra", "sol", "netuno"],
    sources: [
      {
        label: "IAU — Resolution B2 (2012)",
        url: "https://www.iau.org/static/resolutions/IAU2012_English.pdf",
      },
      {
        label: "NASA Science — Light Years",
        url: "https://science.nasa.gov/exoplanets/light-years/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "por-que-existem-as-estacoes",
    title: { pt: "Por que existem as estações" },
    summary: {
      pt: "Não é a distância até o Sol — é a inclinação do eixo. O erro mais comum da astronomia básica, desmontado com um fato que qualquer brasileiro pode verificar.",
    },
    level: "iniciante",
    readingMinutes: 5,
    prerequisites: ["o-que-e-uma-orbita"],
    terms: [
      "perielio",
      "excentricidade",
      "ecliptica",
      "estacoes-marcianas",
      "angulo-de-fase",
    ],
    modules: ["solar-system", "mars"],
    bodies: ["terra", "marte", "sol"],
    sources: [
      {
        label: "NASA Science — Seasons",
        url: "https://science.nasa.gov/sun/",
      },
      {
        label: "NASA Mars — Mars Facts",
        url: "https://science.nasa.gov/mars/facts/",
      },
    ],
    updatedAt: "2026-09-13",
  },
];

/** Carregadores de artigo, um por conceito. Validado por teste. */
export const ARTICLE_LOADERS: Record<
  string,
  () => Promise<{ default: ComponentType }>
> = {
  "o-que-e-uma-orbita": () => import("@/src/content/aprender/o-que-e-uma-orbita.mdx"),
  "as-escalas-do-universo": () =>
    import("@/src/content/aprender/as-escalas-do-universo.mdx"),
  "por-que-existem-as-estacoes": () =>
    import("@/src/content/aprender/por-que-existem-as-estacoes.mdx"),
};

const BY_SLUG = new Map(CONCEPTS.map((c) => [c.slug, c]));

export const getConcept = (slug: string): ConceptMeta | undefined => BY_SLUG.get(slug);

export const CONCEPT_SLUGS = CONCEPTS.map((c) => c.slug);

/** Ordem didática das trilhas, do mais acessível ao mais exigente. */
export const LEVEL_ORDER: Level[] = ["iniciante", "intermediario", "avancado"];

export const LEVEL_META: Record<Level, { label: string; description: string }> = {
  iniciante: {
    label: "Iniciante",
    description: "Nenhum pré-requisito. Comece por aqui se está chegando agora.",
  },
  intermediario: {
    label: "Intermediário",
    description: "Assume familiaridade com órbitas, escalas e vocabulário básico.",
  },
  avancado: {
    label: "Avançado",
    description: "Física mais densa, para quem já passou pelas trilhas anteriores.",
  },
};

/** Conceitos agrupados por nível, preservando a ordem do catálogo. */
export function conceptsByLevel(): { level: Level; concepts: ConceptMeta[] }[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    concepts: CONCEPTS.filter((c) => c.level === level),
  })).filter((g) => g.concepts.length > 0);
}

/** Artigos que citam um módulo — alimenta o link "aprenda mais" das páginas. */
export const conceptsForModule = (moduleId: string): ConceptMeta[] =>
  CONCEPTS.filter((c) => c.modules?.includes(moduleId));

/** Artigos que citam um verbete — alimenta a página do termo no glossário. */
export const conceptsForTerm = (slug: string): ConceptMeta[] =>
  CONCEPTS.filter((c) => c.terms?.includes(slug));
