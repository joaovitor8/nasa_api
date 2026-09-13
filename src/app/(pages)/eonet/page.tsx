import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { EonetConsole } from "./EonetConsole";

const MODULE = getModule("eonet")!;

/**
 * Módulo EONET — casca server + ilha client.
 *
 * O console mantém seu próprio `ModuleScope` (o cabeçalho depende de estado de
 * cliente); a seção didática recebe outro, para herdar as mesmas CSS vars de
 * cor do módulo. A prosa e o JSON-LD ficam no HTML servido.
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Eventos naturais vistos do espaço — ${SITE_NAME}`,
  description:
    "Como satélites detectam incêndios, tempestades e erupções sem enxergar chama alguma: sensoriamento remoto, anomalias térmicas e órbitas heliossíncronas.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Sensoriamento remoto", "Anomalia térmica", "Órbita heliossíncrona"],
};

export default function EonetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EonetConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="eonet" title="Como um satélite enxerga um incêndio">
            <p>
              Nenhum dos eventos listados acima foi visto por alguém olhando pela janela
              de uma nave. Todos vêm de{" "}
              <Termo slug="sensoriamento-remoto">sensoriamento remoto</Termo>: medir
              algo a distância pela radiação que ele reflete ou emite. O satélite não
              fotografa o fogo — ele mede calor.
            </p>
            <p>
              O mecanismo específico é a{" "}
              <Termo slug="anomalia-termica">anomalia térmica</Termo>. Sensores comparam
              a temperatura de cada pixel com a dos vizinhos em faixas do infravermelho
              médio, e um foco se destaca mesmo quando é muito menor que o próprio
              pixel, porque a energia emitida cresce com a quarta potência da
              temperatura. Um incêndio de poucos metros acende num pixel de um
              quilômetro. Vale a ressalva: nem toda anomalia é incêndio — chaminés
              industriais e queima de gás também aparecem.
            </p>
            <p>
              Para que imagens de dias diferentes sejam comparáveis, a maioria desses
              satélites voa em{" "}
              <Termo slug="orbita-heliossincrona">órbita heliossíncrona</Termo>. É um
              arranjo elegante: escolhendo altitude e{" "}
              <Termo slug="inclinacao">inclinação</Termo> certas, o plano da órbita
              deriva exatamente no mesmo ritmo em que a Terra avança em torno do Sol, e
              o satélite passa sobre cada ponto sempre na mesma hora solar local, com a
              mesma iluminação.
            </p>
            <p className="text-muted-foreground">
              Isso também explica um limite do catálogo: a{" "}
              <Termo slug="resolucao-espacial">resolução espacial</Termo> desses
              sensores é grosseira de propósito. Instrumentos que enxergam detalhes
              finos cobrem faixas estreitas e revisitam o mesmo lugar raramente —
              inúteis para monitorar o planeta inteiro todo dia, que é justamente o
              objetivo aqui.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
