import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { TechTransferConsole } from "./TechTransferConsole";

const MODULE = getModule("techtransfer")!;

/** Módulo TechTransfer — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Tecnologia do espaço na vida cotidiana — ${SITE_NAME}`,
  description:
    "O que é um spinoff, quais tecnologias do dia a dia realmente vieram do programa espacial e por que Velcro e Teflon não estão entre elas.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Spinoff", "Nível de Maturidade Tecnológica"],
};

export default function TechTransferPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TechTransferConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection
            moduleId="techtransfer"
            title="O que realmente veio do programa espacial"
          >
            <p>
              Cada patente e código aberto desta lista é candidato a{" "}
              <Termo slug="spinoff">spinoff</Termo>: tecnologia criada para resolver um
              problema de missão que acabou encontrando uso na vida comum. A NASA
              publica um catálogo anual desses casos desde 1976.
            </p>
            <p>
              Os exemplos reais costumam ser menos famosos que os falsos. Memória
              viscoelástica nasceu para amortecer assentos de aeronave; lentes
              resistentes a risco vieram de trabalho com revestimentos; e o sensor CMOS
              do seu celular descende de um esforço para reduzir o tamanho e o consumo
              de câmeras de sonda.
            </p>
            <p>
              Convém desconfiar da lista folclórica que circula há décadas. Velcro,
              Teflon e forno de micro-ondas são todos anteriores ao programa espacial e
              não são spinoffs — a NASA usou essas tecnologias, o que é bem diferente de
              tê-las criado. Repetir isso enfraquece o argumento real, que já é forte o
              suficiente sem exagero.
            </p>
            <p className="text-muted-foreground">
              Há uma ligação direta com o módulo de pesquisa: quase tudo aqui chegou ao
              topo da escala <Termo slug="trl">TRL</Termo> antes de virar produto.
              Transferência de tecnologia é o último passo de uma jornada longa, não um
              subproduto acidental.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
