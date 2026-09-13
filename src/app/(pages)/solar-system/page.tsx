import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { SolarSystemConsole } from "./SolarSystemConsole";

const MODULE = getModule("solar-system")!;

/** Módulo Sistema Solar — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Mapa do Sistema Solar — ${SITE_NAME}`,
  description:
    "Por que o diagrama orbital nunca está em escala, o que define um planeta anão e como a unidade astronômica organiza as distâncias do sistema solar.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Unidade astronômica", "Planeta anão", "Eclíptica", "Periélio e afélio"],
};

export default function SolarSystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SolarSystemConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection
            moduleId="solar-system"
            title="Por que nenhum mapa está em escala"
          >
            <p>
              Uma confissão necessária sobre o diagrama acima, e sobre praticamente
              todos os mapas do sistema solar que você já viu: ele não está em escala, e
              não poderia estar. Se a Terra fosse do tamanho de um pixel, Netuno estaria
              a milhares de pixels de distância e o Sol ocuparia mais espaço que a tela
              inteira. Diagramas comprimem distâncias para caber; a intuição que eles
              dão sobre proporções é, por construção, falsa.
            </p>
            <p>
              A régua real é a{" "}
              <Termo slug="unidade-astronomica">unidade astronômica</Termo>: a distância
              média entre a Terra e o Sol, fixada em exatamente 149.597.870.700 metros.
              Marte fica a cerca de 1,5 UA, Júpiter a 5,2, Netuno a 30. Ou seja, a
              órbita de Netuno é vinte vezes mais larga que a nossa.
            </p>
            <p>
              As órbitas também não são círculos perfeitos, e nem todas estão no mesmo
              plano — embora quase. O plano de referência é a{" "}
              <Termo slug="ecliptica">eclíptica</Termo>, a órbita da Terra, e é por isso
              que planetas aparecem sempre numa mesma faixa do céu. A distância de cada
              um ao Sol varia entre o <Termo slug="perielio">periélio e o afélio</Termo>{" "}
              ao longo do ano.
            </p>
            <p className="text-muted-foreground">
              Plutão está neste catálogo como{" "}
              <Termo slug="planeta-anao">planeta anão</Termo>, e vale entender o
              critério em vez de tratar a mudança de 2006 como capricho. Um planeta
              pleno precisa orbitar o Sol, ter gravidade suficiente para ser
              aproximadamente esférico e ter dominado gravitacionalmente sua órbita.
              Plutão cumpre os dois primeiros e divide o Cinturão de Kuiper com muitos
              outros corpos.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
