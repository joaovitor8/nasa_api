import { notFound } from "next/navigation";

import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/src/lib/content/og";
import { CONCEPT_SLUGS, LEVEL_META, getConcept } from "@/src/lib/content/concepts";

export const alt = "Artigo das trilhas de aprendizado do Universo";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return CONCEPT_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  return ogCard({
    eyebrow: `Aprender · ${LEVEL_META[concept.level].label}`,
    title: concept.title.pt,
    description: concept.summary.pt,
    meta: `${concept.readingMinutes} min de leitura`,
  });
}
