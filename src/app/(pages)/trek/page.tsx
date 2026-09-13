import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { TrekConsole } from "./TrekConsole";

const MODULE = getModule("trek")!;

/**
 * Módulo Trek — casca server + ilha client (ver `eonet/page.tsx` para o padrão).
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Cartografia de outros mundos — ${SITE_NAME}`,
  description:
    "Como se mapeia um planeta sem oceanos nem meridiano histórico: projeções cartográficas, resolução espacial e as regras da IAU para nomear acidentes geográficos.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Cartografia planetária", "Projeção cartográfica", "Resolução espacial"],
};

export default function TrekPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TrekConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="trek" title="Como se mapeia um mundo inteiro">
            <p>
              Mapear a Terra já é difícil; mapear um planeta sem oceanos, sem Greenwich
              e sem ninguém no chão é outro problema. A{" "}
              <Termo slug="cartografia-planetaria">cartografia planetária</Termo>{" "}
              resolve isso com convenções próprias: em Marte, a longitude zero passa por
              uma cratera de apenas 500 metros, escolhida justamente por ser pequena o
              bastante para marcar um ponto sem ambiguidade.
            </p>
            <p>
              O mapa que você desliza acima é feito de ladrilhos, e todo ladrilho
              carrega uma escolha. Achatar uma esfera num plano exige uma{" "}
              <Termo slug="projecao-cartografica">projeção cartográfica</Termo>, e
              nenhuma preserva ao mesmo tempo áreas, ângulos e distâncias — escolher uma
              é decidir o que distorcer. Mapas deslizantes costumam usar a Mercator,
              ótima para navegação e péssima para comparar tamanhos perto dos polos.
            </p>
            <p>
              Ao dar zoom, o que muda é a{" "}
              <Termo slug="resolucao-espacial">resolução espacial</Termo> — quantos
              metros de terreno cabem em cada pixel. Vale lembrar que resolução fina não
              é gratuita: os instrumentos que a produzem cobrem faixas estreitas, então
              regiões inteiras de um planeta seguem mapeadas apenas em resolução
              grosseira, por simples falta de passagens de sonda.
            </p>
            <p className="text-muted-foreground">
              Os nomes que aparecem no mapa também não são informais. A União
              Astronômica Internacional mantém o registro oficial, com temas definidos
              por corpo — crateras de Mercúrio homenageiam artistas e escritores; as de
              Vênus levam nomes de mulheres. Sem esse cadastro, duas equipes
              descreveriam o mesmo vale com nomes diferentes e ninguém saberia que falam
              do mesmo lugar.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
