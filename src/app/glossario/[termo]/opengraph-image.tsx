import { notFound } from "next/navigation";

import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/src/lib/content/og";
import { GLOSSARY_SLUGS, getTerm } from "@/src/lib/content/glossary";
import { getModule } from "@/src/lib/modules";

export const alt = "Verbete do glossário do Universo";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return GLOSSARY_SLUGS.map((termo) => ({ termo }));
}

/**
 * Cada verbete compartilha com a própria definição na imagem — o que faz o
 * link valer por si mesmo em redes sociais, sem depender do clique.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ termo: string }>;
}) {
  const { termo } = await params;
  const term = getTerm(termo);
  if (!term) notFound();

  // Usa a cor do primeiro módulo que cita o termo, quando houver.
  const accent = term.modules?.map(getModule).find((m) => m !== undefined)
    ?.theme.accent;

  return ogCard({
    eyebrow: "Glossário",
    title: term.term.pt,
    description: term.short.pt,
    // `theme.accent` vem em oklch(), que o Satori não lê — deixa o padrão.
    accent: accent?.startsWith("#") ? accent : undefined,
  });
}
