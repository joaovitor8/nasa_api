"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, ChevronRight, Cpu } from "lucide-react";
import axios from "axios";

import type { TleEntry } from "@/src/lib/types/nasa";

/**
 * Ilha interativa do módulo TLE.
 *
 * A casca da página (cabeçalho, prosa didática, metadados, JSON-LD) é server
 * component em `page.tsx`; aqui fica só o que precisa de estado e de rede no
 * cliente — a busca por NORAD ID e a decodificação do resultado.
 */

const fetchTle = async (query: string): Promise<TleEntry[]> => {
  const res = await axios.get<TleEntry[]>(`/api/tle?q=${encodeURIComponent(query)}`);
  return res.data;
};

interface DecodedTle {
  inclination: string;
  raan: string;
  eccentricity: string;
  perigee: string;
  meanAnomaly: string;
  meanMotion: string;
}

/**
 * A linha 2 do TLE tem colunas de posição fixa — cada intervalo abaixo é um
 * campo do formato, não um palpite. Ver `/glossario/tle`.
 */
const decodeTleLine2 = (line2: string): DecodedTle | null => {
  if (!line2 || line2.length < 68) return null;
  return {
    inclination: line2.substring(8, 16).trim(),
    raan: line2.substring(17, 25).trim(),
    eccentricity: "0." + line2.substring(26, 33),
    perigee: line2.substring(34, 42).trim(),
    meanAnomaly: line2.substring(43, 51).trim(),
    meanMotion: line2.substring(52, 63).trim(),
  };
};

/** Rótulo e slug do verbete correspondente, para ligar cada número ao conceito. */
const CAMPOS = [
  { label: "INCLINAÇÃO (°)", slug: "inclinacao", key: "inclination", sufixo: "°" },
  { label: "EXCENTRICIDADE", slug: "excentricidade", key: "eccentricity", sufixo: "" },
  { label: "MOV. MÉDIO (V/D)", slug: "movimento-medio", key: "meanMotion", sufixo: "" },
  { label: "ANOMALIA MÉDIA", slug: "anomalia-media", key: "meanAnomaly", sufixo: "°" },
  { label: "ARG. PERIGEU", slug: "perigeu", key: "perigee", sufixo: "°" },
  { label: "RAAN", slug: "raan", key: "raan", sufixo: "°" },
] as const satisfies readonly {
  label: string;
  slug: string;
  key: keyof DecodedTle;
  sufixo: string;
}[];

export function TleConsole() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("25544"); // ISS por padrão

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["tle-data", searchQuery],
    queryFn: () => fetchTle(searchQuery),
  });

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setSearchInput("");
    }
  };

  const busy = isLoading || isFetching;

  return (
    <div className="flex min-h-[60vh] flex-col font-mono">
      <div className="flex grow flex-col gap-10">
        {error && (
          <div
            className="border p-6 text-destructive"
            style={{
              background: "oklch(0.65 0.22 25 / 0.05)",
              borderColor: "oklch(0.65 0.22 25 / 0.5)",
              boxShadow: "inset 0 0 24px oklch(0.65 0.22 25 / 0.2)",
            }}
          >
            &gt; ERRO_FATAL: {error.message}
            <br />
            &gt; ABORTANDO_OPERAÇÃO.
          </div>
        )}

        {busy && (
          <div className="animate-pulse opacity-70" role="status">
            &gt; Inicializando varredura para NORAD/NOME: &quot;{searchQuery}&quot;…
            <br />
            &gt; Interceptando pacotes orbitais. Aguarde.
          </div>
        )}

        <AnimatePresence>
          {!busy &&
            !error &&
            data?.map((tle, index) => {
              const decoded = decodeTleLine2(tle.line2);

              return (
                <motion.div
                  key={tle.satelliteId + ":" + index}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex flex-col gap-4 border p-6"
                  style={{
                    borderColor:
                      "color-mix(in oklch, var(--module-accent) 40%, transparent)",
                    background: "var(--module-accent-soft)",
                  }}
                >
                  <div
                    className="mb-2 flex items-start justify-between border-b pb-4"
                    style={{
                      borderColor:
                        "color-mix(in oklch, var(--module-accent) 25%, transparent)",
                    }}
                  >
                    <div>
                      <div className="mb-1 text-xs uppercase opacity-60">
                        Identificação do Alvo
                      </div>
                      <div className="text-xl font-bold tracking-wider text-foreground">
                        {tle.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-1 text-xs uppercase opacity-60">Época TLE</div>
                      <div className="text-sm">
                        {new Date(tle.date).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase opacity-60">
                      <Binary className="h-4 w-4" /> Two-Line Element Set Cru
                    </div>
                    <div
                      className="overflow-x-auto border bg-black p-4 font-mono text-xs whitespace-nowrap sm:text-sm"
                      style={{
                        borderColor:
                          "color-mix(in oklch, var(--module-accent) 40%, transparent)",
                        boxShadow: "inset 0 0 16px var(--module-accent-soft)",
                      }}
                    >
                      <div>{tle.line1}</div>
                      <div>{tle.line2}</div>
                    </div>
                  </div>

                  {decoded && (
                    <div
                      className="mt-4 border-t pt-4"
                      style={{
                        borderColor:
                          "color-mix(in oklch, var(--module-accent) 25%, transparent)",
                      }}
                    >
                      <div className="mb-4 flex items-center gap-2 text-xs uppercase opacity-60">
                        <Cpu className="h-4 w-4" /> Decodificação de Telemetria (Linha
                        2)
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3">
                        {CAMPOS.map(({ label, slug, key, sufixo }) => (
                          <div key={label}>
                            {/*
                              Cada número vira porta de entrada para o conceito.
                              Link simples em vez de <Termo> porque aqui estamos
                              num componente cliente e o alvo é a leitura rápida,
                              não a prosa — a definição completa está na seção
                              "Entenda", renderizada no servidor.
                            */}
                            <a
                              href={`/glossario/${slug}`}
                              className="mb-1 block text-[10px] underline-offset-2 opacity-60 transition-opacity hover:underline hover:opacity-100"
                            >
                              {label}
                            </a>
                            <span className="text-lg">
                              {decoded[key]}
                              {sufixo}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>

        {!busy && data && data.length === 0 && (
          <div className="opacity-60">
            &gt; NENHUM_SATÉLITE_ENCONTRADO. Verifique o NORAD ID ou nome do alvo.
          </div>
        )}
      </div>

      {/* Input de comando */}
      <div
        className="mt-12 border-t-2 bg-black pt-6"
        style={{
          borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)",
        }}
      >
        <form onSubmit={handleCommand} className="flex flex-col gap-2">
          <label
            htmlFor="tle-query"
            className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase opacity-70"
          >
            <ChevronRight className="h-4 w-4" />
            Insira o NORAD ID (ex: 25544, 20580) ou nome do satélite
          </label>
          <div
            className="flex items-center border bg-black transition-colors focus-within:border-[var(--module-accent)]"
            style={{
              borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)",
            }}
          >
            <span className="pr-2 pl-4" aria-hidden>
              root@orbit-tracker:~#
            </span>
            <input
              id="tle-query"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={busy}
              className="w-full bg-transparent p-3 outline-none disabled:opacity-50"
              style={{ color: "var(--module-accent)" }}
              placeholder="aguardando_input_do_usuario_"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
