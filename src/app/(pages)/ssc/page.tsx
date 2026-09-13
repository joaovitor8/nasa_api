import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { SscConsole } from "./SscConsole";

const MODULE = getModule("ssc")!;

/** Módulo SSC — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Tráfego orbital — ${SITE_NAME}`,
  description:
    "Como se organiza o espaço em torno da Terra: órbita baixa, geoestacionária e heliossíncrona, e por que a altitude escolhida determina para que o satélite serve.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Órbita terrestre baixa",
    "Órbita geoestacionária",
    "Órbita heliossíncrona",
    "Inclinação orbital",
  ],
};

export default function SscPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SscConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-[100rem]">
          <EntendaSection moduleId="ssc" title="Por que cada satélite voa onde voa">
            <p>
              O espaço em torno da Terra não é um volume homogêneo: é organizado em
              faixas, e a altitude de um satélite entrega para que ele serve. A escolha
              nunca é arbitrária — cada regime tem uma vantagem que paga um preço
              específico.
            </p>
            <p>
              A <Termo slug="orbita-baixa">órbita baixa</Termo>, até cerca de 2.000 km,
              concentra a maior parte do tráfego: estação espacial, telescópios,
              constelações de internet. Perto significa sinal forte e imagem detalhada,
              mas também volta completa a cada 90 minutos — o satélite está sempre
              passando, nunca parado sobre você — e arrasto atmosférico residual que
              exige correções periódicas.
            </p>
            <p>
              A <Termo slug="orbita-geoestacionaria">órbita geoestacionária</Termo>, a
              35.786 km, resolve o problema de ficar parado: ali o período orbital
              coincide com o dia, e o satélite acompanha a rotação da Terra. É por isso
              que antenas de TV por satélite não precisam rastrear nada. O preço é a
              distância — o sinal leva cerca de 0,24 segundo para ir e voltar.
            </p>
            <p className="text-muted-foreground">
              Há ainda a{" "}
              <Termo slug="orbita-heliossincrona">órbita heliossíncrona</Termo>, quase
              polar, que usa a própria deriva causada pelo achatamento da Terra para
              cruzar o equador sempre na mesma hora solar local. Para quem compara
              imagens ao longo do tempo, iluminação constante vale mais que proximidade.
              A <Termo slug="inclinacao">inclinação</Termo> de cada objeto na lista
              acima denuncia a qual desses grupos ele pertence.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
