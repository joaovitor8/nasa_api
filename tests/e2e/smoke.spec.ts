import { expect, test } from "@playwright/test";

/**
 * Rede de segurança antes da refatoração das páginas de módulo.
 *
 * As páginas buscam dados no cliente, então sem `KEY_NASA` as chamadas falham —
 * de propósito, estes testes verificam a *casca* (título, navegação, ausência de
 * erro de render), nunca o conteúdo vindo de API externa. Assim o smoke roda no
 * CI sem segredo nenhum.
 */

/** Extrai os caminhos anunciados pelo próprio sitemap da aplicação. */
async function sitemapPaths(baseURL: string): Promise<string[]> {
  const res = await fetch(`${baseURL}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml devolveu ${res.status}`);
  const xml = await res.text();

  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p, i, all) => all.indexOf(p) === i);
}

test.describe("rotas anunciadas no sitemap", () => {
  test("todas respondem 200 e renderizam sem erro de runtime", async ({
    page,
    baseURL,
  }) => {
    const paths = await sitemapPaths(baseURL!);
    expect(paths.length, "sitemap não pode estar vazio").toBeGreaterThan(20);

    const falhas: string[] = [];

    for (const path of paths) {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      if (!res || res.status() >= 400) {
        falhas.push(`${path} → HTTP ${res?.status() ?? "sem resposta"}`);
        continue;
      }
      // O error boundary global mostra este texto quando um render quebra.
      if (
        await page
          .getByText("Sinal Interrompido")
          .isVisible()
          .catch(() => false)
      ) {
        falhas.push(`${path} → error boundary acionado`);
      }
    }

    expect(falhas, `rotas quebradas:\n${falhas.join("\n")}`).toEqual([]);
  });
});

test("home renderiza o hero e os CTAs principais", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // Ancorado no destino, não no texto — a cópia muda, a rota não.
  await expect(page.locator('a[href="/mission-control"]').first()).toBeVisible();
  await expect(page.locator('a[href="/solar-system"]').first()).toBeVisible();
});

test("página de corpo celeste vem renderizada no servidor", async ({ request }) => {
  // Server component: o dossiê tem que estar no HTML, sem depender de JS.
  const res = await request.get("/solar-system/marte");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("Marte");
});

test.describe("glossário", () => {
  test("verbete vem renderizado no servidor, com a explicação longa no HTML", async ({
    request,
  }) => {
    // Este é o contrato que justifica a camada de conteúdo: quem pesquisa
    // "o que é RAAN" no Google precisa achar texto, não uma casca vazia.
    const res = await request.get("/glossario/raan");
    expect(res.status()).toBe(200);

    const html = await res.text();
    expect(html).toContain("nodo ascendente");
    expect(html).toContain('"@type":"DefinedTerm"');
  });

  test("índice lista os verbetes e leva a cada um", async ({ page }) => {
    await page.goto("/glossario");
    await expect(
      page.getByRole("heading", { level: 1, name: "Glossário" }),
    ).toBeVisible();

    await page.getByRole("link", { name: /ascensão reta do nodo ascendente/i }).click();
    await expect(page).toHaveURL(/\/glossario\/raan$/);
  });

  test("verbete liga de volta ao módulo onde o termo aparece", async ({ page }) => {
    await page.goto("/glossario/raan");
    await page.locator('a[href="/tle"]').first().click();
    await expect(page).toHaveURL(/\/tle$/);
  });

  test("sitemap anuncia os verbetes", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/glossario/raan");
    expect(xml).toContain("/glossario/zona-habitavel");
  });
});

test("rota inexistente cai no 404 customizado", async ({ page }) => {
  const res = await page.goto("/setor-que-nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByText(/coordenada desconhecida/i).first()).toBeVisible();
});

test("robots.txt aponta para o sitemap e bloqueia a API", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("sitemap");
  expect(body).toContain("/api/");
});
