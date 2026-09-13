import Link from "next/link";
import { Compass, Home } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 · Coordenada Desconhecida",
  description: "Setor não catalogado nos arquivos do cosmos.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-primary/30 bg-primary/5 relative">
          <Compass className="w-9 h-9 text-primary animate-spin" style={{ animationDuration: "8s" }} />
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl -z-10" aria-hidden />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-muted-foreground">
            COORDENADA DESCONHECIDA
          </p>
          <h1 className="text-6xl md:text-7xl font-serif font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-400 to-primary">
              404
            </span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Este setor não consta nos nossos arquivos. A rota pode ter sido
            descomissionada — ou ainda não foi catalogada.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-mono uppercase tracking-[0.25em] transition-all hover:scale-[1.02] hover:shadow-[0_0_32px_oklch(0.60_0.18_290/0.45)] active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            Retornar à Base
          </Link>
        </div>
      </div>
    </div>
  );
}
