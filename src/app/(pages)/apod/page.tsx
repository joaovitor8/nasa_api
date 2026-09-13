import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { ApodConsole } from "./ApodConsole";

const MODULE = getModule("apod")!;

/** Módulo APOD — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Como ler uma imagem astronômica — ${SITE_NAME}`,
  description:
    "Por que as cores das fotos do espaço não são as que o olho veria, o que é uma nebulosa e como o espectro eletromagnético revela o que a luz visível esconde.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Espectro eletromagnético", "Nebulosa", "Galáxia", "Magnitude aparente"],
};

export default function ApodPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ApodConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="apod" title="Como ler uma imagem astronômica">
            <p>
              Uma pergunta honesta que quase todo mundo faz diante dessas fotos: as
              cores são reais? Quase nunca, e isso não é trapaça. O olho humano enxerga
              uma fatia minúscula do{" "}
              <Termo slug="espectro-eletromagnetico">espectro eletromagnético</Termo>,
              de cerca de 380 a 700 nanômetros. Telescópios captam muito além disso, e
              traduzir infravermelho ou raios X em cores visíveis é a única forma de
              mostrar o que foi medido.
            </p>
            <p>
              Cada faixa conta uma história diferente do mesmo objeto. O infravermelho
              atravessa a poeira e revela estrelas nascendo onde a luz visível só mostra
              uma mancha escura; os raios X marcam gás a milhões de graus perto de
              buracos negros. Por isso a mesma <Termo slug="nebulosa">nebulosa</Termo>{" "}
              pode parecer dois objetos distintos em duas imagens — são instrumentos
              diferentes olhando fenômenos diferentes.
            </p>
            <p>
              Vale calibrar a intuição de escala. Uma nebulosa parece densa na foto, mas
              é mais rarefeita que qualquer vácuo de laboratório: o que a torna visível
              é ter <Termo slug="ano-luz">anos-luz</Termo> de extensão. E uma{" "}
              <Termo slug="galaxia">galáxia</Termo> aparente do tamanho de uma moeda
              pode abrigar centenas de bilhões de estrelas.
            </p>
            <p className="text-muted-foreground">
              Quando a legenda menciona o brilho de um objeto, costuma usar{" "}
              <Termo slug="magnitude-aparente">magnitude aparente</Termo> — uma escala
              herdada dos gregos, invertida e logarítmica, em que números menores
              significam mais brilho. O Sol marca cerca de −26,7; a olho nu, em céu
              escuro, chegamos perto de +6.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
