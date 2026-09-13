import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `handleRoute` é o único ponto por onde passa todo erro das 19 rotas BFF.
 * Se o mapeamento de status quebrar, o front recebe 200 com corpo de erro,
 * ou 500 onde deveria ser 404 — e nada disso aparece em tempo de compilação.
 */

const importUpstream = async () => import("@/src/lib/upstream");

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

const OPTS = { tag: "TEST", fallbackMessage: "Falha genérica." };

describe("handleRoute", () => {
  it("devolve 200 com o payload quando o handler resolve", async () => {
    const { handleRoute } = await importUpstream();
    const res = await handleRoute(OPTS, async () => ({ ok: true }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("propaga status 4xx do upstream", async () => {
    const { handleRoute, UpstreamError } = await importUpstream();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(OPTS, async () => {
      throw new UpstreamError(404, "not found");
    });

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Falha genérica.", code: 404 });
  });

  it("usa a mensagem específica do status quando existe override", async () => {
    const { handleRoute, UpstreamError } = await importUpstream();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(
      { ...OPTS, messages: { 404: "Sem dados para a data." } },
      async () => {
        throw new UpstreamError(404, "not found");
      },
    );

    await expect(res.json()).resolves.toEqual({
      error: "Sem dados para a data.",
      code: 404,
    });
  });

  it("colapsa 5xx do upstream em 502, sem vazar o erro alheio como nosso", async () => {
    const { handleRoute, UpstreamError } = await importUpstream();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(OPTS, async () => {
      throw new UpstreamError(503, "upstream down");
    });

    expect(res.status).toBe(502);
    // O corpo preserva o status real do upstream para diagnóstico.
    await expect(res.json()).resolves.toEqual({ error: "Falha genérica.", code: 503 });
  });

  it("preserva 504 de timeout em vez de achatar para 502", async () => {
    const { handleRoute, UpstreamError } = await importUpstream();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(OPTS, async () => {
      throw new UpstreamError(504, "timeout");
    });

    expect(res.status).toBe(504);
  });

  it("devolve 500 sem vazar a mensagem interna quando falta KEY_NASA", async () => {
    const { handleRoute, MissingApiKeyError } = await importUpstream();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(OPTS, async () => {
      throw new MissingApiKeyError();
    });

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Falha genérica.", code: 500 });
    // A instrução acionável fica no log do servidor, não na resposta.
    expect(spy.mock.calls[0].join(" ")).toContain("KEY_NASA");
  });

  it("devolve 500 para erro inesperado que não é UpstreamError", async () => {
    const { handleRoute } = await importUpstream();
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await handleRoute(OPTS, async () => {
      throw new TypeError("bug nosso");
    });

    expect(res.status).toBe(500);
  });
});

describe("fetchUpstream", () => {
  const axiosError = (code: string) => {
    const err = new AxiosError("falhou", code, {
      headers: new AxiosHeaders(),
    });
    return err;
  };

  it("exige KEY_NASA nas rotas autenticadas", async () => {
    vi.stubEnv("KEY_NASA", "");
    vi.resetModules();
    const { fetchUpstream, MissingApiKeyError } = await importUpstream();

    await expect(
      fetchUpstream("https://api.nasa.gov/planetary/apod", { nasaAuth: true }),
    ).rejects.toBeInstanceOf(MissingApiKeyError);
  });

  it("mapeia timeout do axios para UpstreamError 504", async () => {
    vi.stubEnv("KEY_NASA", "chave-de-teste");
    vi.resetModules();
    const axios = (await import("axios")).default;
    const { fetchUpstream } = await importUpstream();

    vi.spyOn(axios, "request").mockRejectedValue(axiosError("ECONNABORTED"));

    await expect(fetchUpstream("https://exemplo.test")).rejects.toMatchObject({
      status: 504,
    });
  });

  it("mapeia falha de rede sem resposta para 502", async () => {
    const axios = (await import("axios")).default;
    const { fetchUpstream } = await importUpstream();

    vi.spyOn(axios, "request").mockRejectedValue(axiosError("ENOTFOUND"));

    await expect(fetchUpstream("https://exemplo.test")).rejects.toMatchObject({
      status: 502,
    });
  });

  it("aplica o timeout padrão quando a rota não especifica um", async () => {
    const axios = (await import("axios")).default;
    const { fetchUpstream, UPSTREAM_TIMEOUT_MS } = await importUpstream();

    const spy = vi.spyOn(axios, "request").mockResolvedValue({ data: { ok: true } });
    await fetchUpstream("https://exemplo.test");

    expect(spy.mock.calls[0][0]).toMatchObject({ timeout: UPSTREAM_TIMEOUT_MS });
  });

  it("respeita o timeout explícito da rota", async () => {
    const axios = (await import("axios")).default;
    const { fetchUpstream } = await importUpstream();

    const spy = vi.spyOn(axios, "request").mockResolvedValue({ data: {} });
    await fetchUpstream("https://exemplo.test", { timeout: 1234 });

    expect(spy.mock.calls[0][0]).toMatchObject({ timeout: 1234 });
  });
});

describe("badRequest", () => {
  it("devolve 400 com a mensagem recebida", async () => {
    const { badRequest } = await importUpstream();
    const res = badRequest("É necessário fornecer uma data.");

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "É necessário fornecer uma data.",
      code: 400,
    });
  });
});
