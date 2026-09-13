// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Termo } from "@/src/components/content/Termo";
import { getTerm } from "@/src/lib/content/glossary";

/**
 * O valor do `<Termo>` depende de um contrato específico: a definição precisa
 * existir no HTML renderizado no servidor, e não ser injetada por JS. Se alguém
 * "otimizar" o componente para carregar a definição sob demanda, estes testes
 * quebram — que é exatamente o ponto.
 */

afterEach(cleanup);

describe("Termo", () => {
  it("coloca a definição no HTML renderizado, não sob demanda", () => {
    const { container } = render(<Termo slug="raan">RAAN</Termo>);
    const esperado = getTerm("raan")!.short.pt;

    expect(container.innerHTML).toContain(esperado);
  });

  it("liga o termo à definição por aria-describedby", () => {
    const { container } = render(<Termo slug="raan">RAAN</Termo>);

    const link = screen.getByRole("link", { name: "RAAN" });
    const describedBy = link.getAttribute("aria-describedby");

    expect(describedBy).toBeTruthy();
    // A referência precisa resolver para um nó que existe de verdade.
    expect(container.querySelector(`#${describedBy}`)).not.toBeNull();
  });

  it("aponta para a página do verbete, alimentando os links internos", () => {
    render(<Termo slug="excentricidade">excentricidade</Termo>);

    expect(screen.getByRole("link", { name: "excentricidade" })).toHaveAttribute(
      "href",
      "/glossario/excentricidade",
    );
  });

  it("mantém o balão fora do fluxo de cliques enquanto invisível", () => {
    const { container } = render(<Termo slug="raan">RAAN</Termo>);
    const tooltip = container.querySelector('[role="tooltip"]')!;

    expect(tooltip.className).toContain("pointer-events-none");
    // `opacity-0`, e não `hidden`/`invisible`: o texto tem que continuar no DOM
    // e na árvore de acessibilidade.
    expect(tooltip.className).toContain("opacity-0");
    expect(tooltip.className).not.toMatch(/\bhidden\b|\binvisible\b/);
  });

  it("usa o nome canônico quando nenhum texto é passado", () => {
    render(<Termo slug="albedo" />);

    expect(
      screen.getByRole("link", { name: getTerm("albedo")!.term.pt }),
    ).toBeVisible();
  });

  it("degrada para texto simples se o slug não existir", () => {
    const { container } = render(<Termo slug="slug-inexistente">texto cru</Termo>);

    expect(container.textContent).toBe("texto cru");
    expect(container.querySelector("a")).toBeNull();
  });
});
