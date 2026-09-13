import { describe, expect, it } from "vitest";

import {
  CATEGORY_META,
  ENABLED_MODULES,
  SPACE_MODULES,
  getModule,
  getModulesByCategory,
} from "@/src/lib/modules";
import { BODY_TYPE_LABEL, SOLAR_BODIES, getBody } from "@/src/lib/solar-system";
import { withAlpha } from "@/src/lib/utils";

/**
 * Os catálogos são a fonte de verdade de navegação, sitemap e metadados.
 * Um id duplicado ou href torto vira link quebrado em produção sem nenhum
 * erro de compilação — daí estes testes.
 */

const OKLCH = /^oklch\([^)]+\)$/;

describe("SPACE_MODULES", () => {
  it("não tem ids duplicados", () => {
    const ids = SPACE_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("não tem hrefs duplicados entre módulos internos", () => {
    const hrefs = SPACE_MODULES.filter((m) => !m.external).map((m) => m.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("usa href absoluto interno, ou marca external", () => {
    for (const mod of SPACE_MODULES) {
      if (mod.external) {
        expect(mod.href, `${mod.id} externo`).toMatch(/^https?:\/\//);
      } else {
        expect(mod.href, `${mod.id} interno`).toMatch(/^\/[a-z0-9-/[\]]*$/);
      }
    }
  });

  it("declara accent em oklch() e deriva accentSoft/glow dele", () => {
    for (const mod of SPACE_MODULES) {
      expect(mod.theme.accent, mod.id).toMatch(OKLCH);
      expect(mod.theme.accentSoft, mod.id).toContain("/");
      expect(mod.theme.glow, mod.id).toContain("oklch");
    }
  });

  it("tem categoria conhecida em CATEGORY_META", () => {
    for (const mod of SPACE_MODULES) {
      expect(CATEGORY_META[mod.category], mod.id).toBeDefined();
    }
  });

  it("ENABLED_MODULES contém só os ativos", () => {
    expect(ENABLED_MODULES.length).toBeGreaterThan(0);
    expect(ENABLED_MODULES.every((m) => m.status === "active")).toBe(true);
  });

  it("getModule resolve por id e devolve undefined para desconhecido", () => {
    expect(getModule(SPACE_MODULES[0].id)?.id).toBe(SPACE_MODULES[0].id);
    expect(getModule("nao-existe")).toBeUndefined();
  });

  it("getModulesByCategory particiona o catálogo sem perder módulo", () => {
    const total = (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[])
      .map((c) => getModulesByCategory(c).length)
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(SPACE_MODULES.length);
  });
});

describe("SOLAR_BODIES", () => {
  it("não tem ids duplicados", () => {
    const ids = SOLAR_BODIES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("usa slug seguro para URL em /solar-system/[body]", () => {
    for (const body of SOLAR_BODIES) {
      expect(body.id, body.pt).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("declara accent em oklch()", () => {
    for (const body of SOLAR_BODIES) {
      expect(body.accent, body.id).toMatch(OKLCH);
    }
  });

  it("tem tipo conhecido em BODY_TYPE_LABEL", () => {
    for (const body of SOLAR_BODIES) {
      expect(BODY_TYPE_LABEL[body.type], body.id).toBeDefined();
    }
  });

  it("só o Sol fica sem distância e período orbital", () => {
    for (const body of SOLAR_BODIES) {
      const isStar = body.type === "star";
      expect(body.distanceAuFromSun === null, body.id).toBe(isStar);
      expect(body.orbitalPeriodDays === null, body.id).toBe(isStar);
    }
  });

  it("tem orbitIndex único, para o diagrama não sobrepor corpos", () => {
    const idx = SOLAR_BODIES.map((b) => b.orbitIndex);
    expect(new Set(idx).size).toBe(idx.length);
  });

  it("getBody resolve por id e devolve undefined para desconhecido", () => {
    expect(getBody(SOLAR_BODIES[0].id)?.id).toBe(SOLAR_BODIES[0].id);
    expect(getBody("nibiru")).toBeUndefined();
  });
});

describe("withAlpha", () => {
  it("injeta o canal alpha antes do parêntese final", () => {
    expect(withAlpha("oklch(0.7 0.15 250)", 0.3)).toBe("oklch(0.7 0.15 250 / 0.3)");
  });

  it("tolera whitespace antes do parêntese final", () => {
    expect(withAlpha("oklch(0.7 0.15 250) ", 0.5)).toBe("oklch(0.7 0.15 250 / 0.5)");
  });
});
