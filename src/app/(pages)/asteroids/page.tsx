import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { AsteroidsConsole } from "./AsteroidsConsole";

const MODULE = getModule("asteroids")!;

/** Módulo NEO Radar — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Asteroides próximos da Terra — ${SITE_NAME}`,
  description:
    "O que significa um asteroide ser classificado como próximo da Terra ou potencialmente perigoso, e por que a maioria dos números assustadores não é assustadora.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Objeto próximo da Terra",
    "Asteroide potencialmente perigoso",
    "Distância lunar",
    "Magnitude absoluta",
  ],
};

export default function AsteroidsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AsteroidsConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection moduleId="asteroids" title="Como ler este radar sem pânico">
            <p>
              Todo objeto listado aqui é um <Termo slug="neo">NEO</Termo> — sigla para
              objeto próximo da Terra. É bom saber desde já que a definição é puramente
              geométrica: vale para qualquer <Termo slug="asteroide">asteroide</Termo>{" "}
              ou <Termo slug="cometa">cometa</Termo> cuja órbita o traga a menos de 1,3{" "}
              <Termo slug="unidade-astronomica">unidade astronômica</Termo> do Sol. Ser
              um NEO não implica risco nenhum, e há mais de 30 mil deles catalogados.
            </p>
            <p>
              As distâncias aparecem em{" "}
              <Termo slug="distancia-lunar">distâncias lunares</Termo> porque é a escala
              que dá intuição. Uma passagem a 0,5 LD significa metade do caminho até a
              Lua — notável, mas nem de longe raro. Para comparação, satélites
              geoestacionários orbitam a menos de 0,1 LD, ou seja, bem mais perto de nós
              do que a maioria desses asteroides jamais chega.
            </p>
            <p>
              O rótulo de <Termo slug="pha">potencialmente perigoso</Termo> tem dois
              critérios objetivos: a órbita precisa chegar a 0,05 UA da nossa, e o
              objeto precisa ter{" "}
              <Termo slug="magnitude-absoluta">magnitude absoluta</Termo> de 22,0 ou
              menor — grosso modo, mais de 140 metros. É rótulo de vigilância, não
              previsão: nenhum PHA conhecido está em rota de colisão neste século.
            </p>
            <p className="text-muted-foreground">
              Uma sutileza que explica boa parte da incerteza nas estimativas de
              tamanho: o brilho de um asteroide depende tanto do diâmetro quanto do{" "}
              <Termo slug="albedo">albedo</Termo>, e raramente se conhece o segundo. Uma
              rocha escura e grande pode brilhar igual a uma clara e pequena — por isso
              os tamanhos costumam vir como faixas, não como números exatos.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
