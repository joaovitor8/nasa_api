/**
 * Modelo da camada de conteúdo educacional.
 *
 * O projeto já usa catálogos TS tipados como fonte de verdade
 * (`src/lib/modules.ts`, `src/lib/solar-system.ts`); o glossário segue o mesmo
 * padrão, o que permite importá-lo de qualquer server component — inclusive do
 * `<Termo>` inline — sem I/O nem pipeline de build.
 */

/**
 * Texto bilíngue. O conteúdo nasce em português; `en` entra depois, por verbete,
 * sem remodelar nada. Use `pick()` para ler com fallback.
 */
export interface Localized {
  pt: string;
  en?: string;
}

/** Nível de leitura esperado, usado para ordenar trilhas e sinalizar dificuldade. */
export type Level = "iniciante" | "intermediario" | "avancado";

/** Referência verificável. Conteúdo científico sem fonte não entra no catálogo. */
export interface Source {
  label: string;
  url: string;
}

/**
 * Verbete do glossário.
 *
 * `short` é o que aparece no tooltip do `<Termo>` e no `<meta description>`:
 * precisa fazer sentido sozinho, em uma frase, sem depender do contexto da
 * página que o citou.
 */
export interface GlossaryTerm {
  /** Slug em kebab-case; vira a URL `/glossario/<slug>`. */
  slug: string;
  /** Nome completo do termo, com a sigla entre parênteses quando houver. */
  term: Localized;
  /** Definição de uma frase. Cabe no tooltip. */
  short: Localized;
  /** Explicação longa, exibida na página do verbete. */
  long?: Localized;
  /** Grafias alternativas e siglas, para busca no índice. */
  aliases?: string[];
  /** Slugs de verbetes relacionados. Validado por teste. */
  related?: string[];
  /** Ids de `SPACE_MODULES` onde o termo aparece na prática. Validado por teste. */
  modules?: string[];
  /** Ids de `SOLAR_BODIES` ilustrativos. Validado por teste. */
  bodies?: string[];
  sources?: Source[];
}

/**
 * Metadados de um artigo explicativo (Fase 3 — a prosa virá de MDX).
 * Declarado aqui para que glossário e artigos compartilhem o mesmo vocabulário.
 */
export interface ConceptMeta {
  slug: string;
  title: Localized;
  summary: Localized;
  level: Level;
  /** Tempo estimado de leitura, em minutos. */
  readingMinutes: number;
  /** Slugs de outros conceitos que convém ler antes. */
  prerequisites?: string[];
  /** Slugs de verbetes do glossário citados no texto. */
  terms?: string[];
  modules?: string[];
  bodies?: string[];
  sources: Source[];
  /** ISO-8601 (YYYY-MM-DD). */
  updatedAt: string;
}

/** Lê um campo bilíngue com fallback para português. */
export const pick = (value: Localized, locale: "pt" | "en"): string =>
  (locale === "en" ? value.en : value.pt) ?? value.pt;
