import Link from "next/link";

import { getTerm } from "@/src/lib/content/glossary";
import { cn } from "@/src/lib/utils";

interface TermoProps {
  /** Slug do verbete em `src/lib/content/glossary.ts`. */
  slug: string;
  /**
   * Texto exibido. Quando omitido, usa o nome do verbete — útil quando a
   * flexão na frase coincide com o nome canônico.
   */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Marca um termo técnico no meio da prosa, com a definição disponível ali mesmo.
 *
 * Decisão central: **a definição vai no HTML servido**, não é injetada por JS.
 * O balão fica no DOM o tempo todo, apenas com `opacity-0`, e aparece no hover
 * ou no foco via CSS puro. Isso atende três públicos de uma vez:
 *
 *  - buscadores indexam a definição junto da página que usa o termo;
 *  - leitores de tela leem via `aria-describedby`;
 *  - quem navega por teclado (ou está sem JS) enxerga igual.
 *
 * O elemento âncora é um `<Link>` de verdade para `/glossario/<slug>`: além de
 * dar foco por teclado de graça, cria a malha de links internos que sustenta o
 * SEO do glossário.
 *
 * Convenção editorial: marque cada termo **uma vez por página**, na primeira
 * ocorrência. Além de ser a norma tipográfica para glossários, evita `id`
 * repetido no documento.
 */
export function Termo({ slug, children, className }: TermoProps) {
  const term = getTerm(slug);

  // Slug inexistente é erro de conteúdo, não de runtime: renderiza o texto sem
  // decoração em vez de derrubar a página. O teste de integridade do glossário
  // é quem falha o CI nesse caso.
  if (!term) return <>{children ?? slug}</>;

  const tooltipId = `termo-${slug}`;

  return (
    <span className={cn("group relative inline-block", className)}>
      <Link
        href={`/glossario/${slug}`}
        aria-describedby={tooltipId}
        className="cursor-help border-b border-dotted border-current/50 decoration-none transition-colors hover:border-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
      >
        {children ?? term.term.pt}
      </Link>

      {/*
        `opacity-0` em vez de `hidden`/`invisible`: o texto permanece no DOM e
        na árvore de acessibilidade. `pointer-events-none` impede que o balão
        invisível intercepte cliques.
      */}
      <span
        role="tooltip"
        id={tooltipId}
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/15 bg-black/90 p-3 text-left opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-72"
      >
        <span className="block font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
          {term.term.pt}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-white/90">
          {term.short.pt}
        </span>
      </span>
    </span>
  );
}
