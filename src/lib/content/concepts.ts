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
  {
    slug: "como-se-descobre-um-exoplaneta",
    title: { pt: "Como se descobre um exoplaneta" },
    summary: {
      pt: "Quase nenhum foi fotografado — todos vieram de efeitos indiretos. Entender quais explica por que o catálogo é enviesado para gigantes quentes.",
    },
    level: "intermediario",
    readingMinutes: 8,
    prerequisites: ["as-escalas-do-universo"],
    terms: [
      "exoplaneta",
      "transito",
      "velocidade-radial",
      "zona-habitavel",
      "desvio-para-o-vermelho",
    ],
    modules: ["exoplanets"],
    sources: [
      {
        label: "NASA — 5 Ways to Find a Planet",
        url: "https://science.nasa.gov/exoplanets/ways-to-find-a-planet/",
      },
      {
        label: "NASA Exoplanet Archive",
        url: "https://exoplanetarchive.ipac.caltech.edu/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "clima-espacial",
    title: { pt: "Clima espacial e o evento de Carrington" },
    summary: {
      pt: "Erupção solar é luz e chega em oito minutos; ejeção de massa coronal é matéria e leva dias. Essa diferença é o que separa prejuízo de catástrofe.",
    },
    level: "intermediario",
    readingMinutes: 8,
    terms: [
      "vento-solar",
      "flare-solar",
      "cme",
      "mancha-solar",
      "aurora",
      "ponto-de-lagrange",
    ],
    modules: ["donki"],
    bodies: ["sol", "terra"],
    sources: [
      {
        label: "NOAA SWPC — Space Weather Phenomena",
        url: "https://www.swpc.noaa.gov/phenomena",
      },
      {
        label: "NASA Science — Solar Storms and Flares",
        url: "https://science.nasa.gov/sun/solar-storms-and-flares/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "defesa-planetaria",
    title: { pt: "Defesa planetária: o que realmente sabemos" },
    summary: {
      pt: "Por que quase toda manchete de asteroide é menos assustadora do que parece, o que a missão DART provou e qual é o gargalo de verdade.",
    },
    level: "intermediario",
    readingMinutes: 9,
    terms: [
      "neo",
      "pha",
      "escala-de-torino",
      "escala-de-palermo",
      "distancia-lunar",
      "asteroide",
      "cometa",
      "albedo",
      "magnitude-absoluta",
      "unidade-astronomica",
    ],
    modules: ["asteroids", "cneos", "news"],
    sources: [
      {
        label: "NASA CNEOS — NEO Basics",
        url: "https://cneos.jpl.nasa.gov/about/neo_groups.html",
      },
      {
        label: "NASA — DART Mission Results",
        url: "https://science.nasa.gov/mission/dart/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "a-escada-de-distancias",
    title: { pt: "A escada de distâncias cósmicas" },
    summary: {
      pt: "Como se mede algo a milhões de anos-luz sem nunca ir lá — e por que o degrau mais alto dessa escada está rachando há uma década.",
    },
    level: "avancado",
    readingMinutes: 9,
    prerequisites: ["as-escalas-do-universo"],
    terms: [
      "paralaxe",
      "parsec",
      "vela-padrao",
      "desvio-para-o-vermelho",
      "magnitude-absoluta",
      "galaxia",
      "unidade-astronomica",
    ],
    modules: ["exoplanets", "apod"],
    sources: [
      {
        label: "ESA — Gaia mission",
        url: "https://www.esa.int/Science_Exploration/Space_Science/Gaia",
      },
      {
        label: "NASA Science — The Universe",
        url: "https://science.nasa.gov/universe/",
      },
    ],
    updatedAt: "2026-09-13",
  },
  {
    slug: "buracos-negros",
    title: { pt: "Buracos negros: o que aquela imagem mostra" },
    summary: {
      pt: "A foto do Event Horizon Telescope não mostra um buraco negro — mostra tudo em volta dele. E a distorção do anel não é licença artística.",
    },
    level: "avancado",
    readingMinutes: 10,
    prerequisites: ["o-que-e-uma-orbita"],
    terms: [
      "buraco-negro",
      "horizonte-de-eventos",
      "disco-de-acrecao",
      "lente-gravitacional",
      "velocidade-de-escape",
      "galaxia",
      "espectro-eletromagnetico",
    ],
    modules: ["singularity"],
    sources: [
      {
        label: "NASA Science — Black Holes",
        url: "https://science.nasa.gov/universe/black-holes/",
      },
      {
        label: "NASA Science — Anatomy of a Black Hole",
        url: "https://science.nasa.gov/universe/black-holes/anatomy/",
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
  "como-se-descobre-um-exoplaneta": () =>
    import("@/src/content/aprender/como-se-descobre-um-exoplaneta.mdx"),
  "clima-espacial": () => import("@/src/content/aprender/clima-espacial.mdx"),
  "defesa-planetaria": () => import("@/src/content/aprender/defesa-planetaria.mdx"),
  "a-escada-de-distancias": () =>
    import("@/src/content/aprender/a-escada-de-distancias.mdx"),
  "buracos-negros": () => import("@/src/content/aprender/buracos-negros.mdx"),
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
