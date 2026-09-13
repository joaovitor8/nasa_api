import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { EpicConsole } from "./EpicConsole";

const MODULE = getModule("epic")!;

/**
 * Módulo EPIC — casca server + ilha client (ver `eonet/page.tsx` para o padrão).
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `A Terra vista do ponto L1 — ${SITE_NAME}`,
  description:
    "Por que o satélite DSCOVR vê a Terra sempre cheia, o que é um ponto de Lagrange e como o ângulo de fase decide quanto de um mundo aparece iluminado.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Ponto de Lagrange", "Ângulo de fase", "Albedo"],
};

export default function EpicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EpicConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection
            moduleId="epic"
            title="Por que a Terra aparece sempre cheia aqui"
          >
            <p>
              Repare que em nenhuma dessas imagens a Terra aparece como um crescente.
              Isso não é escolha editorial — é geometria. As fotos vêm do satélite
              DSCOVR, parado a cerca de 1,5 milhão de quilômetros daqui, num{" "}
              <Termo slug="ponto-de-lagrange">ponto de Lagrange</Termo>: uma das cinco
              posições em que a gravidade combinada do Sol e da Terra permite a um
              terceiro corpo acompanhá-los praticamente sem gastar combustível.
            </p>
            <p>
              O DSCOVR ocupa o L1, que fica na linha entre nós e o Sol. Dali, ele olha
              para a Terra com o Sol exatamente às suas costas — o que significa um{" "}
              <Termo slug="angulo-de-fase">ângulo de fase</Termo> próximo de zero, e
              portanto a face inteiramente iluminada, o tempo todo. É a mesma razão pela
              qual a Lua cheia acontece quando a Terra está entre ela e o Sol.
            </p>
            <p>
              Essa posição privilegiada não serve só para fotos bonitas. Com o disco
              inteiro enquadrado de uma vez, dá para medir o{" "}
              <Termo slug="albedo">albedo</Termo> do planeta como um todo — a fração da
              luz solar que a Terra devolve ao espaço —, algo impossível para satélites
              em <Termo slug="orbita-baixa">órbita baixa</Termo>, que só enxergam um
              pedaço por vez.
            </p>
            <p className="text-muted-foreground">
              O L1 também é o melhor posto de escuta do{" "}
              <Termo slug="vento-solar">vento solar</Termo>: como fica à frente da Terra
              na direção do Sol, instrumentos ali detectam uma{" "}
              <Termo slug="cme">ejeção de massa coronal</Termo> chegando com algum tempo
              de antecedência — margem curta, mas suficiente para alertar operadores de
              satélites e redes elétricas.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
