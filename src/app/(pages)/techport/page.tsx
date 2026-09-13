import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { TechPortConsole } from "./TechPortConsole";

const MODULE = getModule("techport")!;

/** Módulo TechPort — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Como uma tecnologia amadurece — ${SITE_NAME}`,
  description:
    "A escala TRL explicada: os nove níveis que separam um princípio físico observado em laboratório de um sistema comprovado em operação real.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Nível de Maturidade Tecnológica", "Spinoff"],
};

export default function TechPortPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TechPortConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-[100rem]">
          <EntendaSection moduleId="techport" title="O que significa o nível TRL">
            <p>
              O número que acompanha cada projeto desta lista é o{" "}
              <Termo slug="trl">TRL</Termo>, e ele diz mais sobre o projeto do que o
              resumo técnico. É uma escala de 1 a 9 criada pela NASA nos anos 1970 e
              hoje adotada por agências e indústrias no mundo inteiro para responder a
              uma pergunta simples: o quanto essa tecnologia já saiu do papel?
            </p>
            <p>
              No TRL 1 existe apenas um princípio físico observado. Por volta do 3 há
              prova de conceito em laboratório; no 6, um protótipo demonstrado em
              ambiente relevante; no 9, um sistema comprovado em operação real, em
              missão. Saltar de um nível para o outro custa tipicamente uma ordem de
              grandeza mais de dinheiro que o anterior.
            </p>
            <p>
              Por isso o meio da escala é o lugar mais perigoso. Entre o TRL 4 e o 6
              fica o que a área chama de vale da morte: a fase em que a tecnologia já é
              cara demais para pesquisa acadêmica e ainda arriscada demais para
              investimento industrial. Muita coisa promissora morre exatamente aí, e não
              por falta de mérito técnico.
            </p>
            <p className="text-muted-foreground">
              Vale olhar esta lista com essa lente: um projeto em TRL 2 é uma aposta
              intelectual, não um produto a caminho. E quando algo atravessa a escala
              inteira, às vezes encontra uso muito longe do espaço — é assim que nasce
              um <Termo slug="spinoff">spinoff</Termo>.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
