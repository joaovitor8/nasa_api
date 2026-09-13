import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Auditoria automatizada de acessibilidade.
 *
 * O axe não substitui teste com pessoas reais — ele pega no máximo um terço
 * dos problemas de WCAG —, mas pega justamente a classe que passa despercebida
 * em revisão de código: contraste insuficiente, hierarquia de títulos quebrada,
 * campo sem rótulo, atributo ARIA apontando para nada.
 *
 * As páginas abaixo cobrem cada tipo de layout do site uma vez. Rodar em todas
 * as 100+ rotas seria lento e redundante.
 */

const PAGINAS = [
  { nome: "home", path: "/" },
  { nome: "hub de aprendizado", path: "/aprender" },
  { nome: "artigo", path: "/aprender/o-que-e-uma-orbita" },
  { nome: "índice do glossário", path: "/glossario" },
  { nome: "verbete", path: "/glossario/raan" },
  { nome: "módulo com console", path: "/tle" },
  { nome: "corpo celeste", path: "/solar-system/marte" },
  { nome: "404", path: "/rota-que-nao-existe" },
];

for (const { nome, path } of PAGINAS) {
  test(`${nome} não tem violação séria ou crítica de acessibilidade`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Violações leves e moderadas viram dívida registrada, não falha de build.
    const graves = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    const resumo = graves
      .map((v) => `  [${v.impact}] ${v.id}: ${v.help}\n    → ${v.nodes[0]?.html ?? ""}`)
      .join("\n");

    expect(graves, `violações em ${path}:\n${resumo}`).toEqual([]);
  });
}
