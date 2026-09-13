import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { DonkiConsole } from "./DonkiConsole";

const MODULE = getModule("donki")!;

/** Módulo DONKI — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Clima espacial — ${SITE_NAME}`,
  description:
    "A diferença entre erupção solar e ejeção de massa coronal, por que uma chega em oito minutos e a outra em dias, e o que isso significa para redes elétricas e GPS.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Erupção solar",
    "Ejeção de massa coronal",
    "Vento solar",
    "Mancha solar",
    "Aurora",
  ],
};

export default function DonkiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DonkiConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="donki" title="O que o Sol está fazendo">
            <p>
              Os dois eventos mais citados neste painel são frequentemente confundidos,
              e a diferença importa. Uma <Termo slug="flare-solar">erupção solar</Termo>{" "}
              é principalmente luz e raios X — viaja à velocidade da luz e chega aqui em
              oito minutos, sem aviso possível. Uma{" "}
              <Termo slug="cme">ejeção de massa coronal</Termo> é matéria: bilhões de
              toneladas de plasma que levam de um a três dias para cruzar a distância.
            </p>
            <p>
              Essa diferença de tempo define o que dá para fazer a respeito. O flare já
              aconteceu quando o detectamos, e seu efeito é imediato: ioniza a alta
              atmosfera e derruba rádio de alta frequência no lado diurno do planeta. Já
              a CME dá margem de alerta — curta, mas suficiente para operadores de
              satélites e de redes elétricas tomarem providências.
            </p>
            <p>
              A escala dos flares é logarítmica e vai de A a X, cada letra representando
              dez vezes mais energia que a anterior. Dentro da classe X a numeração
              segue aberta, então um X10 é dez vezes mais forte que um X1. A frequência
              desses eventos acompanha o ciclo de{" "}
              <Termo slug="mancha-solar">manchas solares</Termo>, que sobe e desce a
              cada onze anos aproximadamente.
            </p>
            <p className="text-muted-foreground">
              Por trás de tudo isso corre o{" "}
              <Termo slug="vento-solar">vento solar</Termo>, fluxo contínuo de
              partículas que o Sol expele em todas as direções. É ele que molda a
              magnetosfera terrestre e alimenta as <Termo slug="aurora">auroras</Termo>{" "}
              — o lado visível e bonito de um fenômeno que, em escala maior, derruba
              infraestrutura. O evento de Carrington, em 1859, incendiou estações de
              telégrafo.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
