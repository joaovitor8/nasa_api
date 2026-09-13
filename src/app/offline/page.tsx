import type { Metadata } from "next";
import Link from "next/link";
import { RadioTower } from "lucide-react";

import { buildStaticMetadata } from "@/src/lib/metadata";

export const metadata: Metadata = buildStaticMetadata(
  "Sinal Perdido",
  "Conexão com a estação central interrompida. Aguardando uplink.",
);

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full flex flex-col items-center text-center">
        <div
          className="p-4 rounded-full border mb-6 relative"
          style={{
            background: "color-mix(in oklch, oklch(0.65 0.22 25) 12%, transparent)",
            borderColor: "color-mix(in oklch, oklch(0.65 0.22 25) 30%, transparent)",
          }}
        >
          <RadioTower className="w-8 h-8" style={{ color: "oklch(0.65 0.22 25)" }} />
          <div
            className="absolute inset-0 rounded-full blur-md -z-10"
            style={{ background: "color-mix(in oklch, oklch(0.65 0.22 25) 25%, transparent)" }}
          />
        </div>

        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground/70 mb-2">
          DEEP SPACE NETWORK · OFFLINE
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Sinal Perdido
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8 text-sm md:text-base">
          A estação não conseguiu estabelecer uplink com a infraestrutura. Quando a conexão for
          restaurada, esta console retomará a transmissão automaticamente.
        </p>

        <Link
          href="/"
          className="px-6 py-3 rounded-full font-mono text-xs uppercase tracking-[0.25em] border transition-colors hover:bg-white/5"
          style={{
            color: "oklch(0.78 0.16 80)",
            borderColor: "color-mix(in oklch, oklch(0.78 0.16 80) 30%, transparent)",
          }}
        >
          Tentar Reconectar
        </Link>

        <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-xs text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            UPLINK
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            CACHE
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CONSOLE
          </div>
        </div>
      </div>
    </div>
  );
}
