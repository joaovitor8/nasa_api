import Link from "next/link";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";

import { HudPanel } from "@/src/components/hud";
import { conceptsForModule } from "@/src/lib/content/concepts";
import { termsForModule } from "@/src/lib/content/glossary";
import { cn } from "@/src/lib/utils";

interface EntendaSectionProps {
  /** Id em `SPACE_MODULES`. Puxa do glossário os verbetes que citam este módulo. */
  moduleId: string;
  /**
   * Prosa específica do módulo — o "o que é isso e por que importa".
   * Use `<Termo>` aqui para marcar o jargão.
   */
  children: React.ReactNode;
  /** Título da seção. O padrão serve para quase todos os módulos. */
  title?: string;
  className?: string;
}

/**
 * Seção didática de uma página de módulo — o que transforma um painel de
 * números em material de aprendizado.
 *
 * É um server component de propósito: a prosa e as definições precisam estar no
 * HTML servido, porque é por essa via que chega quem pesquisa o conceito no
 * buscador. Os dados ao vivo continuam sendo carregados no cliente, na ilha
 * interativa ao lado.
 *
 * A lista de termos não é escrita à mão: sai de `termsForModule()`, então
 * adicionar um verbete ao glossário com `modules: ["tle"]` faz ele aparecer
 * aqui automaticamente.
 */
export function EntendaSection({
  moduleId,
  children,
  title = "Entenda o que você está vendo",
  className,
}: EntendaSectionProps) {
  const termos = termsForModule(moduleId);
  const artigos = conceptsForModule(moduleId);

  return (
    <section className={cn("mt-16", className)} aria-labelledby={`entenda-${moduleId}`}>
      <HudPanel label="Contexto" variant="glass">
        <h2
          id={`entenda-${moduleId}`}
          className="flex items-center gap-3 font-serif text-2xl font-bold tracking-tight text-foreground"
        >
          <GraduationCap className="h-5 w-5 opacity-60" />
          {title}
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-loose text-foreground/80">
          {children}
        </div>

        {artigos.length > 0 && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              <GraduationCap className="h-3 w-3" />
              Aprofunde-se
            </h3>

            <ul className="space-y-2">
              {artigos.map((artigo) => (
                <li key={artigo.slug}>
                  <Link
                    href={`/aprender/${artigo.slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        {artigo.title.pt}
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                        {artigo.summary.pt}
                      </span>
                      <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                        <Clock className="h-3 w-3" />
                        {artigo.readingMinutes} min
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {termos.length > 0 && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              <BookOpen className="h-3 w-3" />
              Termos deste módulo
            </h3>

            <ul className="grid gap-2 sm:grid-cols-2">
              {termos.map((termo) => (
                <li key={termo.slug}>
                  <Link
                    href={`/glossario/${termo.slug}`}
                    className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
                  >
                    <span className="block text-xs font-semibold text-foreground">
                      {termo.term.pt}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {termo.short.pt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/glossario"
              className="mt-4 inline-block font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Ver o glossário completo →
            </Link>
          </div>
        )}
      </HudPanel>
    </section>
  );
}
