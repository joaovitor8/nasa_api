import { describe, expect, it } from "vitest";

import {
  GLOSSARY,
  GLOSSARY_SLUGS,
  getTerm,
  glossaryByLetter,
  termsForModule,
} from "@/src/lib/content/glossary";
import { SPACE_MODULES } from "@/src/lib/modules";
import { SOLAR_BODIES } from "@/src/lib/solar-system";

/**
 * O glossário liga-se a três catálogos por slug solto. Sem estes testes, um id
 * errado em `related`, `modules` ou `bodies` vira link morto em produção sem
 * nenhum aviso em tempo de compilação.
 */

const MODULE_IDS = new Set(SPACE_MODULES.map((m) => m.id));
const BODY_IDS = new Set(SOLAR_BODIES.map((b) => b.id));
const SLUGS = new Set(GLOSSARY_SLUGS);

describe("integridade do glossário", () => {
  it("tem slugs únicos", () => {
    expect(SLUGS.size).toBe(GLOSSARY.length);
  });

  it("usa slug seguro para URL", () => {
    for (const term of GLOSSARY) {
      expect(term.slug, term.term.pt).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("resolve todo `related` para um verbete existente", () => {
    const quebrados = GLOSSARY.flatMap((t) =>
      (t.related ?? [])
        .filter((slug) => !SLUGS.has(slug))
        .map((slug) => `${t.slug} → ${slug}`),
    );
    expect(quebrados).toEqual([]);
  });

  it("resolve todo `modules` para um módulo existente", () => {
    const quebrados = GLOSSARY.flatMap((t) =>
      (t.modules ?? [])
        .filter((id) => !MODULE_IDS.has(id))
        .map((id) => `${t.slug} → ${id}`),
    );
    expect(quebrados).toEqual([]);
  });

  it("resolve todo `bodies` para um corpo existente", () => {
    const quebrados = GLOSSARY.flatMap((t) =>
      (t.bodies ?? [])
        .filter((id) => !BODY_IDS.has(id))
        .map((id) => `${t.slug} → ${id}`),
    );
    expect(quebrados).toEqual([]);
  });

  it("não aponta `related` para si mesmo", () => {
    for (const term of GLOSSARY) {
      expect(term.related ?? [], term.slug).not.toContain(term.slug);
    }
  });
});

describe("qualidade editorial", () => {
  it("todo verbete tem pelo menos uma fonte verificável em https", () => {
    for (const term of GLOSSARY) {
      expect(term.sources?.length ?? 0, `${term.slug} sem fonte`).toBeGreaterThan(0);
      for (const source of term.sources ?? []) {
        expect(source.url, term.slug).toMatch(/^https:\/\//);
        expect(source.label.trim().length, term.slug).toBeGreaterThan(0);
      }
    }
  });

  it("`short` cabe num tooltip e é uma frase fechada", () => {
    for (const term of GLOSSARY) {
      const short = term.short.pt;
      expect(short.length, `${term.slug} curto demais`).toBeGreaterThan(30);
      expect(
        short.length,
        `${term.slug} longo demais para tooltip`,
      ).toBeLessThanOrEqual(200);
      expect(short.trim(), `${term.slug} sem pontuação final`).toMatch(/[.!?]$/);
    }
  });

  it("`long`, quando existe, é mais substancial que `short`", () => {
    for (const term of GLOSSARY) {
      if (!term.long) continue;
      expect(term.long.pt.length, term.slug).toBeGreaterThan(term.short.pt.length);
    }
  });

  it("não repete o mesmo `short` em verbetes diferentes", () => {
    const shorts = GLOSSARY.map((t) => t.short.pt);
    expect(new Set(shorts).size).toBe(shorts.length);
  });
});

describe("helpers de consulta", () => {
  it("getTerm resolve por slug e devolve undefined para desconhecido", () => {
    expect(getTerm("raan")?.slug).toBe("raan");
    expect(getTerm("nao-existe")).toBeUndefined();
  });

  it("glossaryByLetter cobre todos os verbetes sem duplicar", () => {
    const agrupados = glossaryByLetter().flatMap((g) => g.terms);
    expect(agrupados).toHaveLength(GLOSSARY.length);
    expect(new Set(agrupados.map((t) => t.slug)).size).toBe(GLOSSARY.length);
  });

  it("glossaryByLetter agrupa acento sob a letra base", () => {
    // "Órbita terrestre baixa" tem que cair em O, não numa letra "Ó" separada.
    const letras = glossaryByLetter().map((g) => g.letter);
    expect(letras).toEqual([...new Set(letras)]);
    expect(letras.every((l) => /^[A-Z]$/.test(l))).toBe(true);
  });

  it("termsForModule devolve só verbetes que citam o módulo", () => {
    const doTle = termsForModule("tle");
    expect(doTle.length).toBeGreaterThan(0);
    expect(doTle.every((t) => t.modules?.includes("tle"))).toBe(true);
  });

  it("o módulo TLE — o mais hostil a iniciante — tem cobertura real", () => {
    const slugs = termsForModule("tle").map((t) => t.slug);
    // Os elementos que a página decodifica precisam estar todos explicados.
    for (const esperado of [
      "inclinacao",
      "raan",
      "excentricidade",
      "perigeu",
      "anomalia-media",
      "movimento-medio",
    ]) {
      expect(slugs, `falta ${esperado}`).toContain(esperado);
    }
  });
});
