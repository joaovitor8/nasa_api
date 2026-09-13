/**
 * Helper compartilhado para as rotas BFF (`src/app/api/*`).
 *
 * Centraliza:
 *  - chamada HTTP (axios) com injeção opcional da `KEY_NASA`
 *  - propagação de status do upstream (404 / 429 / 403 / ...)
 *  - log estruturado e formato de erro padronizado (`ApiError`)
 *
 * Uso típico:
 *
 *   export const revalidate = 1800;
 *   export async function GET(req: Request) {
 *     return handleRoute(
 *       { tag: "APOD", fallbackMessage: "Falha ao acessar arquivos estelares." },
 *       async () => {
 *         const date = new URL(req.url).searchParams.get("date");
 *         return fetchUpstream<ApodData>("https://api.nasa.gov/planetary/apod", {
 *           nasaAuth: true,
 *           params: date ? { date } : undefined,
 *         });
 *       },
 *     );
 *   }
 */

import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";
import type { ApiError } from "@/src/lib/types/nasa";

const NASA_KEY = process.env.KEY_NASA;

export class UpstreamError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

export interface UpstreamOptions extends Omit<AxiosRequestConfig, "url"> {
  /** Injeta `api_key=KEY_NASA` nos params automaticamente. */
  nasaAuth?: boolean;
}

/**
 * Faz uma requisição ao upstream e devolve o payload tipado.
 * Lança `UpstreamError` (com o status original) em qualquer falha HTTP/rede.
 */
export async function fetchUpstream<T>(
  url: string,
  opts: UpstreamOptions = {},
): Promise<T> {
  const { nasaAuth, params, method = "GET", ...rest } = opts;
  const finalParams = nasaAuth
    ? { ...(params ?? {}), api_key: NASA_KEY }
    : params;

  try {
    const res = await axios.request<T>({
      url,
      method,
      params: finalParams,
      ...rest,
    });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      // Erros sem resposta (DNS, timeout, recusa) viram 502 (bad gateway)
      const status = err.response?.status ?? 502;
      throw new UpstreamError(status, err.message, err);
    }
    throw new UpstreamError(502, "Upstream failure", err);
  }
}

export interface RouteOptions {
  /** Prefixo para logs (ex: "APOD", "DONKI"). */
  tag: string;
  /** Mensagem temática genérica (5xx / falha de rede / status sem override). */
  fallbackMessage: string;
  /** Override de mensagem por status do upstream. Ex: { 404: "Sem dados para a data." } */
  messages?: Partial<Record<number, string>>;
}

/**
 * Envolve o handler da rota. Captura `UpstreamError` e devolve
 * `NextResponse` com o status real do upstream (4xx propagados;
 * 5xx e falhas de rede colapsadas em 502).
 */
export async function handleRoute<T>(
  opts: RouteOptions,
  run: () => Promise<T>,
): Promise<NextResponse> {
  try {
    const data = await run();
    return NextResponse.json<T>(data);
  } catch (err) {
    if (err instanceof UpstreamError) {
      const message = opts.messages?.[err.status] ?? opts.fallbackMessage;
      console.error(`[${opts.tag}] upstream ${err.status}:`, err.cause);
      // 4xx → propaga; 5xx / network → 502 (não vaza erro do servidor upstream como nosso 5xx)
      const status =
        err.status >= 400 && err.status < 500 ? err.status : 502;
      return NextResponse.json<ApiError>(
        { error: message, code: err.status },
        { status },
      );
    }
    console.error(`[${opts.tag}] unexpected:`, err);
    return NextResponse.json<ApiError>(
      { error: opts.fallbackMessage, code: 500 },
      { status: 500 },
    );
  }
}

/**
 * Atalho para resposta 400 com mensagem custom.
 * Uso: `if (!date) return badRequest("É necessário fornecer uma data.");`
 */
export function badRequest(message: string): NextResponse {
  return NextResponse.json<ApiError>(
    { error: message, code: 400 },
    { status: 400 },
  );
}
