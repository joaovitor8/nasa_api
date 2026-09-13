import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { SingularityConsole } from "./SingularityConsole";

const MODULE = getModule("singularity")!;

/** Módulo Singularity — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Buracos negros — ${SITE_NAME}`,
  description:
    "O que é um horizonte de eventos, por que um buraco negro não é um aspirador cósmico e como se fotografa algo que por definição não emite luz.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Buraco negro",
    "Horizonte de eventos",
    "Disco de acreção",
    "Lente gravitacional",
  ],
};

export default function SingularityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SingularityConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection
            moduleId="singularity"
            title="O que a simulação está mostrando"
          >
            <p>
              Um <Termo slug="buraco-negro">buraco negro</Termo> não é um aspirador
              cósmico. Essa é a confusão mais comum sobre eles, e vale desfazer de cara:
              a gravidade a distância é a mesma de qualquer massa equivalente. Se o Sol
              virasse um buraco negro de mesma massa agora, as órbitas dos planetas não
              mudariam — ficaria apenas escuro e muito frio.
            </p>
            <p>
              O anel brilhante da simulação não é o buraco negro; é um{" "}
              <Termo slug="disco-de-acrecao">disco de acreção</Termo>. Matéria capturada
              carrega momento angular e por isso não cai direto: entra em órbita, e o
              atrito entre camadas que giram a velocidades diferentes aquece o gás a
              milhões de graus. Essa luz é a única coisa visível ali.
            </p>
            <p>
              A borda escura no centro é o{" "}
              <Termo slug="horizonte-de-eventos">horizonte de eventos</Termo> — não uma
              superfície física, e sim o raio em que a{" "}
              <Termo slug="velocidade-de-escape">velocidade de escape</Termo> supera a
              da luz. Para um buraco negro sem rotação, esse raio é proporcional à
              massa: o Sol precisaria ser comprimido a cerca de 3 km para ter um.
            </p>
            <p className="text-muted-foreground">
              A distorção em torno do disco também é real, não licença artística. Massa
              curva o espaço-tempo e a luz segue essa curvatura — o efeito de{" "}
              <Termo slug="lente-gravitacional">lente gravitacional</Termo> permite
              enxergar parte do disco que está atrás do buraco negro, contornando-o. Foi
              um eclipse observado em Sobral, no Ceará, que confirmou essa previsão em
              1919.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
