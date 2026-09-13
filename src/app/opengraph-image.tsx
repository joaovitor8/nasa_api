import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/src/lib/content/og";
import { CONCEPTS } from "@/src/lib/content/concepts";
import { GLOSSARY } from "@/src/lib/content/glossary";
import { ENABLED_MODULES } from "@/src/lib/modules";

export const alt = "Universo — portal de astronomia para entusiastas";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Imagem padrão do site, herdada por qualquer rota sem a sua própria. */
export default function Image() {
  return ogCard({
    eyebrow: "Sistema Operacional do Cosmos",
    title: "Universo",
    description:
      "Aprenda astronomia com dados reais: conceitos explicados do zero, glossário com fontes verificáveis e telemetria ao vivo de 20 instrumentos.",
    meta: `${ENABLED_MODULES.length} módulos · ${GLOSSARY.length} termos · ${CONCEPTS.length} artigos`,
  });
}
