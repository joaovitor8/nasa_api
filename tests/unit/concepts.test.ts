import { describe, expect, it } from "vitest";

import {
  ARTICLE_LOADERS,
  CONCEPTS,
  CONCEPT_SLUGS,
  conceptsByLevel,
  conceptsForModule,
  conceptsForTerm,
  getConcept,
  LEVEL_META,
} from "@/src/lib/content/concepts";
import { GLOSSARY_SLUGS } from "@/src/lib/content/glossary";
import { SPACE_MODULES } from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";

/**
 * O catálogo de artigos aponta para quatro lugares por slug solto: o próprio
 * catálogo (pré-requisitos), o glossário, os módulos e os corpos celestes —
 * mais o arquivo `.mdx` que carrega a prosa. Nada disso é verificado pelo
 * compilador, então é aqui que um slug errado precisa falhar.
 */

const TERMOS = new Set(GLOSSARY_SLUGS);
const MODULOS = new Set(SPACE_MODULES.map((m) => m.id));
const CORPOS = new Set(SOLAR_BODIES.map((b) => b.id));
const SLUGS = new Set(CONCEPT_SLUGS);

describe("integridade do catálogo de conceitos", () => {
  it("tem slugs únicos e seguros para URL", () => {
    expect(SLUGS.size).toBe(CONCEPTS.length);
    for (const c of CONCEPTS) {
      expect(c.slug, c.title.pt).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("todo conceito tem um carregador de artigo correspondente", () => {
    const semArtigo = CONCEPTS.filter((c) => !ARTICLE_LOADERS[c.slug]).map(
      (c) => c.slug,
    );
    expect(semArtigo, `conceitos sem .mdx: ${semArtigo.join(", ")}`).toEqual([]);
  });

  it("não há carregador órfão, sem conceito no catálogo", () => {
    const orfaos = Object.keys(ARTICLE_LOADERS).filter((slug) => !SLUGS.has(slug));
    expect(orfaos, `carregadores sem metadados: ${orfaos.join(", ")}`).toEqual([]);
  });

  it("resolve todo pré-requisito para um conceito existente", () => {
    const quebrados = CONCEPTS.flatMap((c) =>
      (c.prerequisites ?? [])
        .filter((s) => !SLUGS.has(s))
        .map((s) => `${c.slug} → ${s}`),
    );
    expect(quebrados).toEqual([]);
  });

  it("resolve todo termo citado para um verbete do glossário", () => {
    const quebrados = CONCEPTS.flatMap((c) =>
      (c.terms ?? []).filter((s) => !TERMOS.has(s)).map((s) => `${c.slug} → ${s}`),
    );
    expect(quebrados).toEqual([]);
  });

  it("resolve módulos e corpos citados", () => {
    const quebrados = CONCEPTS.flatMap((c) => [
      ...(c.modules ?? [])
        .filter((s) => !MODULOS.has(s))
        .map((s) => `${c.slug} → ${s}`),
      ...(c.bodies ?? []).filter((s) => !CORPOS.has(s)).map((s) => `${c.slug} → ${s}`),
    ]);
    expect(quebrados).toEqual([]);
  });

  it("não cria dependência circular nem aponta para si mesmo", () => {
    for (const c of CONCEPTS) {
      expect(c.prerequisites ?? [], c.slug).not.toContain(c.slug);
      // Um pré-requisito não pode, por sua vez, exigir quem o exige.
      for (const pre of c.prerequisites ?? []) {
        expect(
          getConcept(pre)?.prerequisites ?? [],
          `ciclo ${c.slug} ↔ ${pre}`,
        ).not.toContain(c.slug);
      }
    }
  });

  it("pré-requisito nunca é de nível mais avançado que o artigo", () => {
    const ordem = { iniciante: 0, intermediario: 1, avancado: 2 } as const;
    for (const c of CONCEPTS) {
      for (const pre of c.prerequisites ?? []) {
        const p = getConcept(pre)!;
        expect(
          ordem[p.level],
          `${c.slug} (${c.level}) exige ${pre} (${p.level})`,
        ).toBeLessThanOrEqual(ordem[c.level]);
      }
    }
  });
});

describe("qualidade editorial dos conceitos", () => {
  it("todo artigo cita ao menos uma fonte https", () => {
    for (const c of CONCEPTS) {
      expect(c.sources.length, `${c.slug} sem fonte`).toBeGreaterThan(0);
      for (const s of c.sources) {
        expect(s.url, c.slug).toMatch(/^https:\/\//);
      }
    }
  });

  it("resumo é substancial e fecha com pontuação", () => {
    for (const c of CONCEPTS) {
      expect(c.summary.pt.length, `${c.slug} resumo curto`).toBeGreaterThan(60);
      expect(c.summary.pt.trim(), `${c.slug} sem pontuação final`).toMatch(/[.!?]$/);
    }
  });

  it("tempo de leitura é plausível", () => {
    for (const c of CONCEPTS) {
      expect(c.readingMinutes, c.slug).toBeGreaterThan(0);
      expect(c.readingMinutes, c.slug).toBeLessThanOrEqual(30);
    }
  });

  it("data de atualização está em ISO-8601", () => {
    for (const c of CONCEPTS) {
      expect(c.updatedAt, c.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("nível declarado existe em LEVEL_META", () => {
    for (const c of CONCEPTS) {
      expect(LEVEL_META[c.level], c.slug).toBeDefined();
    }
  });
});

describe("helpers de consulta", () => {
  it("conceptsByLevel cobre todos sem duplicar", () => {
    const todos = conceptsByLevel().flatMap((g) => g.concepts);
    expect(todos).toHaveLength(CONCEPTS.length);
    expect(new Set(todos.map((c) => c.slug)).size).toBe(CONCEPTS.length);
  });

  it("conceptsForModule e conceptsForTerm filtram corretamente", () => {
    const doTle = conceptsForModule("tle");
    expect(doTle.every((c) => c.modules?.includes("tle"))).toBe(true);

    const daOrbitaBaixa = conceptsForTerm("orbita-baixa");
    expect(daOrbitaBaixa.every((c) => c.terms?.includes("orbita-baixa"))).toBe(true);
  });

  it("getConcept resolve e devolve undefined para desconhecido", () => {
    expect(getConcept(CONCEPT_SLUGS[0])?.slug).toBe(CONCEPT_SLUGS[0]);
    expect(getConcept("nao-existe")).toBeUndefined();
  });
});
