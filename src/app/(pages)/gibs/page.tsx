import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { GibsConsole } from "./GibsConsole";

const MODULE = getModule("gibs")!;

/** Módulo GIBS — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Camadas de dados sobre a Terra — ${SITE_NAME}`,
  description:
    "Como uma imagem de satélite vira medição: faixas do espectro, resolução espacial, projeção cartográfica e o papel das órbitas heliossíncronas.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Sensoriamento remoto",
    "Espectro eletromagnético",
    "Resolução espacial",
    "Projeção cartográfica",
  ],
};

export default function GibsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GibsConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection moduleId="gibs" title="Como uma imagem vira medição">
            <p>
              Cada camada que você sobrepõe aqui é resultado de{" "}
              <Termo slug="sensoriamento-remoto">sensoriamento remoto</Termo>: um sensor
              em órbita medindo a radiação que a Terra reflete ou emite. A diferença
              entre uma camada e outra raramente está no lugar observado — está na faixa
              do <Termo slug="espectro-eletromagnetico">espectro eletromagnético</Termo>{" "}
              que foi lida.
            </p>
            <p>
              O visível mostra o que o olho veria. O infravermelho próximo denuncia
              vegetação saudável, porque folhas vivas refletem muito nessa faixa e pouco
              no vermelho — daí vêm os índices de vegetação. O infravermelho térmico
              revela temperatura de superfície e focos de calor. Micro-ondas atravessam
              nuvens, sendo úteis onde a cobertura é permanente.
            </p>
            <p>
              Ao dar zoom, o limite que você encontra é a{" "}
              <Termo slug="resolucao-espacial">resolução espacial</Termo> de cada
              produto — quantos metros de terreno cabem num pixel. Resolução grosseira
              não é defeito: é o preço de cobrir o planeta inteiro todo dia, que é
              justamente o que essas camadas se propõem a fazer.
            </p>
            <p className="text-muted-foreground">
              Duas escolhas silenciosas sustentam tudo isso. A{" "}
              <Termo slug="projecao-cartografica">projeção cartográfica</Termo> decide
              quais distorções o mapa carrega, e a{" "}
              <Termo slug="orbita-heliossincrona">órbita heliossíncrona</Termo> garante
              que cada passagem aconteça na mesma hora solar local — sem isso, comparar
              duas datas seria comparar iluminações diferentes, não mudanças reais no
              terreno.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
