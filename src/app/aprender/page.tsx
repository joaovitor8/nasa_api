import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, GraduationCap } from "lucide-react";

import { HudPanel } from "@/src/components/hud";
import { CONCEPTS, LEVEL_META, conceptsByLevel } from "@/src/lib/content/concepts";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";

export const metadata: Metadata = {
  title: `Aprender · ${SITE_NAME}`,
  description:
    "Trilhas de astronomia para entusiastas: órbitas, escalas do universo, estações do ano e o que os dados ao vivo dos módulos realmente significam.",
  alternates: { canonical: `${SITE_URL}/aprender` },
  openGraph: {
    title: `Aprender — ${SITE_NAME}`,
    description:
      "Comece do zero e entenda os conceitos por trás de cada módulo, com fontes verificáveis.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Trilhas de aprendizado — ${SITE_NAME}`,
  url: `${SITE_URL}/aprender`,
  numberOfItems: CONCEPTS.length,
  itemListElement: CONCEPTS.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title.pt,
    description: c.summary.pt,
    url: `${SITE_URL}/aprender/${c.slug}`,
  })),
};

export default function AprenderPage() {
  const trilhas = conceptsByLevel();

  return (
    <div className="min-h-screen px-4 pt-12 pb-24 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-14 text-center">
          <p className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Trilhas de Aprendizado
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Aprender
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Os conceitos por trás dos módulos, explicados do zero e com fonte citada.
            Cada artigo termina apontando para os dados ao vivo onde aquilo aparece na
            prática.
          </p>
        </header>

        <div className="space-y-12">
          {trilhas.map(({ level, concepts }) => (
            <section key={level} aria-labelledby={`trilha-${level}`}>
              <div className="mb-5">
                <h2
                  id={`trilha-${level}`}
                  className="flex items-center gap-3 font-mono text-sm tracking-[0.25em] text-foreground uppercase"
                >
                  <GraduationCap className="h-4 w-4 opacity-60" />
                  {LEVEL_META[level].label}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {LEVEL_META[level].description}
                </p>
              </div>

              <ol className="space-y-3">
                {concepts.map((concept, i) => (
                  <li key={concept.slug}>
                    <Link href={`/aprender/${concept.slug}`} className="group block">
                      <HudPanel
                        variant="glass"
                        brackets={false}
                        className="transition-colors group-hover:border-white/25"
                      >
                        <div className="flex items-start gap-4">
                          <span className="mt-0.5 font-mono text-xs text-muted-foreground/50 tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                              {concept.title.pt}
                              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {concept.summary.pt}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                {concept.readingMinutes} min
                              </span>
                              {concept.terms && concept.terms.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <BookOpen className="h-3 w-3" />
                                  {concept.terms.length} termos
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </HudPanel>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <p className="mt-14 text-center text-xs text-muted-foreground">
          Procurando a definição de um termo específico?{" "}
          <Link
            href="/glossario"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Consulte o glossário
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
