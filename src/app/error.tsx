"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, TriangleAlert } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Universo] runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-destructive/40 bg-destructive/10">
          <TriangleAlert className="w-9 h-9 text-destructive" />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-muted-foreground">
            FALHA NO SUBSISTEMA
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
            Sinal Interrompido
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            A console encontrou uma anomalia inesperada. Tentaremos restabelecer
            o uplink — caso persista, retorne à base.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/60 pt-2">
              digest: <span className="text-foreground/70">{error.digest}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-[0.25em] transition-all hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
            Restabelecer Sinal
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 text-foreground/90 text-xs font-mono uppercase tracking-[0.25em] backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retornar à Base
          </Link>
        </div>
      </div>
    </div>
  );
}
