import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SOLAR_BODIES, getBody } from "@/src/lib/solar-system";
import { BodyDetail } from "./BodyDetail";

interface Params {
  body: string;
}

export function generateStaticParams(): Params[] {
  return SOLAR_BODIES.map((b) => ({ body: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { body: id } = await params;
  const body = getBody(id);
  if (!body) return { title: "Universo" };

  const title = `${body.pt} · Universo`;
  const description = `Dossiê físico de ${body.pt} — diâmetro, massa, órbita, luas e descoberta. Sistema Operacional do Cosmos.`;

  return {
    title,
    description,
    openGraph: {
      title: `${body.pt} — ${body.en}`,
      description,
      type: "article",
    },
  };
}

export default async function BodyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { body: id } = await params;
  const body = getBody(id);
  if (!body) notFound();

  return <BodyDetail body={body} />;
}
