import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { HudPanel } from "@/src/components/hud";
import { GLOSSARY, glossaryByLetter } from "@/src/lib/content/glossary";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";

export const metadata: Metadata = {
  title: `Glossário · ${SITE_NAME}`,
  description:
    "Os termos da astronomia e da exploração espacial explicados em uma frase — de anomalia média a zona habitável, com fontes verificáveis.",
  alternates: { canonical: `${SITE_URL}/glossario` },
  openGraph: {
    title: `Glossário — ${SITE_NAME}`,
    description:
      "Dicionário aberto de astronomia: elementos orbitais, escalas de distância, clima espacial e defesa planetária.",
    type: "website",
  },
};

/**
 * `DefinedTermSet` dá ao Google o contexto de que esta página é um glossário,
 * e não uma lista qualquer de links.
 */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `Glossário do ${SITE_NAME}`,
    url: `${SITE_URL}/glossario`,
    hasDefinedTerm: GLOSSARY.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term.pt,
      description: term.short.pt,
      url: `${SITE_URL}/glossario/${term.slug}`,
    })),
  };
}

export default function GlossarioPage() {
  const grupos = glossaryByLetter();

  return (
    <div className="min-h-screen px-4 pt-12 pb-24 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 text-center">
          <p className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Arquivo de Referência
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Glossário
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {GLOSSARY.length} termos que aparecem nos módulos — explicados em uma frase,
            com a versão longa e as fontes na página de cada verbete.
          </p>
        </header>

        {/* Navegação por letra: âncoras puras, funcionam sem JS. */}
        <nav
          aria-label="Navegar por letra"
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {grupos.map(({ letter }) => (
            <a
              key={letter}
              href={`#letra-${letter}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 font-mono text-xs transition-colors hover:border-white/30 hover:bg-white/10"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {grupos.map(({ letter, terms }) => (
            <section key={letter} id={`letra-${letter}`} className="scroll-mt-24">
              <h2 className="mb-4 flex items-center gap-3 font-mono text-sm tracking-[0.3em] text-muted-foreground uppercase">
                <span className="text-foreground">{letter}</span>
                <span className="h-px flex-1 bg-white/10" />
              </h2>

              <ul className="grid gap-3 sm:grid-cols-2">
                {terms.map((term) => (
                  <li key={term.slug}>
                    <Link
                      href={`/glossario/${term.slug}`}
                      className="group block h-full"
                    >
                      <HudPanel
                        variant="glass"
                        brackets={false}
                        className="h-full p-4 transition-colors group-hover:border-white/25 md:p-5"
                      >
                        <h3 className="flex items-start gap-2 text-sm font-semibold">
                          <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                          {term.term.pt}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {term.short.pt}
                        </p>
                      </HudPanel>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
