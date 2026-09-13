import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ExternalLink, Radio, Sparkles } from "lucide-react";

import { HudPanel } from "@/src/components/hud";
import {
  ARTICLE_LOADERS,
  CONCEPT_SLUGS,
  LEVEL_META,
  getConcept,
} from "@/src/lib/content/concepts";
import { getTerm } from "@/src/lib/content/glossary";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";
import { getBody } from "@/src/lib/solar-system";

interface Params {
  slug: string;
}

/** Todos os artigos são estáticos: prerender completo no build. */
export function generateStaticParams(): Params[] {
  return CONCEPT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return { title: SITE_NAME };

  return {
    title: `${concept.title.pt} · Aprender · ${SITE_NAME}`,
    description: concept.summary.pt,
    alternates: { canonical: `${SITE_URL}/aprender/${concept.slug}` },
    openGraph: {
      title: `${concept.title.pt} — ${SITE_NAME}`,
      description: concept.summary.pt,
      type: "article",
      publishedTime: concept.updatedAt,
    },
    twitter: {
      card: "summary",
      title: concept.title.pt,
      description: concept.summary.pt,
    },
  };
}

export default async function ConceptPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const concept = getConcept(slug);
  const loader = ARTICLE_LOADERS[slug];
  if (!concept || !loader) notFound();

  const { default: Article } = await loader();

  const preRequisitos = (concept.prerequisites ?? [])
    .map(getConcept)
    .filter((c) => c !== undefined);
  const termos = (concept.terms ?? []).map(getTerm).filter((t) => t !== undefined);
  const modulos = (concept.modules ?? []).map(getModule).filter((m) => m !== undefined);
  const corpos = (concept.bodies ?? []).map(getBody).filter((b) => b !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: concept.title.pt,
    headline: concept.title.pt,
    description: concept.summary.pt,
    url: `${SITE_URL}/aprender/${concept.slug}`,
    inLanguage: "pt-BR",
    educationalLevel: LEVEL_META[concept.level].label,
    learningResourceType: "Article",
    timeRequired: `PT${concept.readingMinutes}M`,
    dateModified: concept.updatedAt,
    teaches: termos.map((t) => t.term.pt),
    citation: concept.sources.map((s) => s.url),
  };

  return (
    <article className="min-h-screen px-4 pt-12 pb-24 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/aprender"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Aprender
        </Link>

        <header className="mt-6 mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            <span>{LEVEL_META[concept.level].label}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {concept.readingMinutes} min de leitura
            </span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            {concept.title.pt}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            {concept.summary.pt}
          </p>

          {preRequisitos.length > 0 && (
            <p className="mt-5 text-xs text-muted-foreground">
              Convém ler antes:{" "}
              {preRequisitos.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/aprender/${p.slug}`}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {p.title.pt}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </header>

        {/* Prosa do artigo — MDX renderizado no servidor. */}
        <div className="mb-12">
          <Article />
        </div>

        {(modulos.length > 0 || corpos.length > 0) && (
          <section className="mb-8">
            <h2 className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Veja ao vivo
            </h2>
            <div className="flex flex-wrap gap-2">
              {modulos.map((mod) => (
                <Link
                  key={mod.id}
                  href={mod.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs transition-colors hover:border-white/30 hover:bg-white/10"
                  style={{ color: mod.theme.accent }}
                >
                  <Radio className="h-3 w-3" />
                  {mod.title}
                </Link>
              ))}
              {corpos.map((body) => (
                <Link
                  key={body.id}
                  href={`/solar-system/${body.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs transition-colors hover:border-white/30 hover:bg-white/10"
                  style={{ color: body.accent }}
                >
                  <Sparkles className="h-3 w-3" />
                  {body.pt}
                </Link>
              ))}
            </div>
          </section>
        )}

        {termos.length > 0 && (
          <HudPanel label="Termos deste artigo" className="mb-8">
            <ul className="grid gap-2 sm:grid-cols-2">
              {termos.map((termo) => (
                <li key={termo.slug}>
                  <Link
                    href={`/glossario/${termo.slug}`}
                    className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25"
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
          </HudPanel>
        )}

        <section>
          <h2 className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Fontes
          </h2>
          <ul className="space-y-2">
            {concept.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
