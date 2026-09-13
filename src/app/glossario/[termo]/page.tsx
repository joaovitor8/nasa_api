import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Radio, Sparkles } from "lucide-react";

import { HudPanel } from "@/src/components/hud";
import { GLOSSARY_SLUGS, getTerm } from "@/src/lib/content/glossary";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";
import { getBody } from "@/src/lib/solar-system";

interface Params {
  termo: string;
}

/** Todos os verbetes são estáticos: prerender completo no build. */
export function generateStaticParams(): Params[] {
  return GLOSSARY_SLUGS.map((termo) => ({ termo }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { termo } = await params;
  const term = getTerm(termo);
  if (!term) return { title: SITE_NAME };

  // `short` é escrito para fazer sentido isolado — serve de description sem corte.
  const description = term.short.pt;

  return {
    title: `${term.term.pt} · Glossário · ${SITE_NAME}`,
    description,
    keywords: term.aliases,
    alternates: { canonical: `${SITE_URL}/glossario/${term.slug}` },
    openGraph: {
      title: `${term.term.pt} — ${SITE_NAME}`,
      description,
      type: "article",
    },
    twitter: { card: "summary", title: term.term.pt, description },
  };
}

export default async function TermoPage({ params }: { params: Promise<Params> }) {
  const { termo } = await params;
  const term = getTerm(termo);
  if (!term) notFound();

  const modulos = (term.modules ?? []).map(getModule).filter((m) => m !== undefined);
  const corpos = (term.bodies ?? []).map(getBody).filter((b) => b !== undefined);
  const relacionados = (term.related ?? []).map(getTerm).filter((t) => t !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term.pt,
    description: term.short.pt,
    url: `${SITE_URL}/glossario/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `Glossário do ${SITE_NAME}`,
      url: `${SITE_URL}/glossario`,
    },
  };

  return (
    <article className="min-h-screen px-4 pt-12 pb-24 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/glossario"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Glossário
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            {term.term.pt}
          </h1>
          {term.term.en && term.term.en !== term.term.pt && (
            <p className="mt-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {term.term.en}
            </p>
          )}
          <p className="mt-5 text-lg leading-relaxed text-foreground/90">
            {term.short.pt}
          </p>
        </header>

        {term.long && (
          <HudPanel label="Explicação" className="mb-8">
            <p className="text-sm leading-loose text-foreground/80">{term.long.pt}</p>
          </HudPanel>
        )}

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

        {relacionados.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Termos relacionados
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {relacionados.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/glossario/${rel.slug}`}
                    className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25"
                  >
                    <span className="text-sm font-medium">{rel.term.pt}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {rel.short.pt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {term.sources && term.sources.length > 0 && (
          <section>
            <h2 className="mb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Fontes
            </h2>
            <ul className="space-y-2">
              {term.sources.map((source) => (
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
        )}
      </div>
    </article>
  );
}
