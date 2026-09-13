"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, ChevronRight, Cpu, Terminal } from "lucide-react";
import axios from "axios";

import { getModule } from "@/src/lib/modules";
import type { TleEntry } from "@/src/lib/types/nasa";
import { ModuleScope, Scanline } from "@/src/components/hud";

const MODULE = getModule("tle")!;

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

export default function TlePage() {
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
    <ModuleScope theme={MODULE.theme} className="min-h-screen pt-12 pb-24 px-4 sm:px-8 relative">
      {/* CRT scanlines globais */}
      <Scanline className="!fixed inset-0 z-50 mix-blend-overlay opacity-50" intensity="subtle" />

      <div
        className="max-w-5xl mx-auto w-full relative z-10 flex flex-col min-h-[80vh] font-mono"
        style={{ color: "var(--module-accent)" }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-end pb-4 mb-8 border-b-2"
          style={{ borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)" }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] flex items-center gap-3">
              <Terminal className="w-6 h-6" />
              TLE_ORBITAL_DECODER
            </h1>
            <p className="text-xs mt-2 uppercase tracking-[0.25em] opacity-60">
              Codinome: {MODULE.codename} · CelesTrak Interface
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs block mb-1 opacity-60">STATUS</span>
            <span className="flex items-center gap-2 text-sm">
              [
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--module-accent)" }} />
              ONLINE ]
            </span>
          </div>
        </div>

        {/* Output */}
        <div className="grow flex flex-col gap-10">
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
              <br />&gt; ABORTANDO_OPERAÇÃO.
            </div>
          )}

          {busy && (
            <div className="opacity-70 animate-pulse">
              &gt; Inicializando varredura para NORAD/NOME: &quot;{searchQuery}&quot;…
              <br />&gt; Interceptando pacotes orbitais. Aguarde.
            </div>
          )}

          <AnimatePresence>
            {!busy && !error && data?.map((tle, index) => {
              const decoded = decodeTleLine2(tle.line2);

              return (
                <motion.div
                  key={tle.satelliteId + ":" + index}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col gap-4 border p-6 relative"
                  style={{
                    borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)",
                    background: "var(--module-accent-soft)",
                  }}
                >
                  <div
                    className="flex justify-between items-start mb-2 border-b pb-4"
                    style={{ borderColor: "color-mix(in oklch, var(--module-accent) 25%, transparent)" }}
                  >
                    <div>
                      <div className="text-xs uppercase opacity-60 mb-1">Identificação do Alvo</div>
                      <div className="text-xl font-bold tracking-wider text-foreground">{tle.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase opacity-60 mb-1">Época TLE</div>
                      <div className="text-sm">
                        {new Date(tle.date).toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase opacity-60 mb-2 flex items-center gap-2">
                      <Binary className="w-4 h-4" /> Two-Line Element Set Cru
                    </div>
                    <div
                      className="bg-black border p-4 font-mono text-xs sm:text-sm overflow-x-auto whitespace-nowrap"
                      style={{
                        borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)",
                        boxShadow: "inset 0 0 16px var(--module-accent-soft)",
                      }}
                    >
                      <div>{tle.line1}</div>
                      <div>{tle.line2}</div>
                    </div>
                  </div>

                  {decoded && (
                    <div
                      className="mt-4 pt-4 border-t"
                      style={{ borderColor: "color-mix(in oklch, var(--module-accent) 25%, transparent)" }}
                    >
                      <div className="text-xs uppercase opacity-60 mb-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> Decodificação de Telemetria (Linha 2)
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
                        {([
                          ["INCLINAÇÃO (°)", decoded.inclination + "°"],
                          ["EXCENTRICIDADE", decoded.eccentricity],
                          ["MOV. MÉDIO (V/D)", decoded.meanMotion],
                          ["ANOMALIA MÉDIA", decoded.meanAnomaly + "°"],
                          ["ARG. PERIGEU", decoded.perigee + "°"],
                          ["RAAN", decoded.raan + "°"],
                        ] as const).map(([label, value]) => (
                          <div key={label}>
                            <span className="block text-[10px] opacity-60 mb-1">{label}</span>
                            <span className="text-lg">{value}</span>
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
          className="mt-12 bg-black border-t-2 pt-6"
          style={{ borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)" }}
        >
          <form onSubmit={handleCommand} className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.25em] flex items-center gap-2 opacity-70">
              <ChevronRight className="w-4 h-4" />
              Insira o NORAD ID (ex: 25544, 20580) ou nome do satélite
            </label>
            <div
              className="flex items-center bg-black border focus-within:border-[var(--module-accent)] transition-colors"
              style={{ borderColor: "color-mix(in oklch, var(--module-accent) 35%, transparent)" }}
            >
              <span className="pl-4 pr-2">root@orbit-tracker:~#</span>
              <input
                type="text"
                autoFocus
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
    </ModuleScope>
  );
}
