import type { Metadata } from "next";

import { getModule } from "./modules";

const SITE_NAME = "Universo";
const SITE_TAGLINE = "Sistema Operacional do Cosmos";

export function buildModuleMetadata(id: string): Metadata {
  const mod = getModule(id);
  if (!mod) return { title: SITE_NAME };

  const titlePt = mod.title;
  const titleEn = mod.titleEn ?? mod.title;
  const description = mod.descriptionEn ?? mod.description;

  return {
    title: `${titlePt} · ${SITE_NAME}`,
    description: mod.description,
    openGraph: {
      title: `${titlePt} — ${SITE_TAGLINE}`,
      description: mod.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleEn} — ${SITE_TAGLINE}`,
      description,
    },
  };
}

export function buildStaticMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} · ${SITE_NAME}`,
    description,
    openGraph: { title: `${title} — ${SITE_TAGLINE}`, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
