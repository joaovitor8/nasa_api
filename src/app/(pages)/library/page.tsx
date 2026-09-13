import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { LibraryConsole } from "./LibraryConsole";

const MODULE = getModule("library")!;

/** Módulo Library — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `O acervo visual da exploração espacial — ${SITE_NAME}`,
  description:
    "Como buscar no arquivo histórico da NASA e entender o que se está vendo: nebulosas, galáxias e as faixas do espectro que produziram cada imagem.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Nebulosa", "Galáxia", "Espectro eletromagnético"],
};

export default function LibraryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LibraryConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="library" title="O que você está procurando aqui">
            <p>
              Este acervo reúne décadas de registro da exploração espacial, e buscar
              nele rende mais quando se sabe o vocabulário. Procurar por{" "}
              <Termo slug="nebulosa">nebulosa</Termo> devolve tanto maternidades
              estelares — nuvens onde a gravidade comprime gás até acender novas
              estrelas — quanto restos de estrelas mortas, que são fenômenos opostos com
              o mesmo nome.
            </p>
            <p>
              Buscas por <Termo slug="galaxia">galáxia</Termo> trazem espirais,
              elípticas e irregulares. Convém lembrar a escala ao olhar: a Via Láctea
              sozinha abriga entre 100 e 400 bilhões de estrelas, e o universo
              observável guarda centenas de bilhões de galáxias.
            </p>
            <p>
              Muitas imagens vêm acompanhadas do instrumento que as produziu, e isso
              muda o que elas significam. Fotos em infravermelho, ultravioleta ou raios
              X mostram faixas do{" "}
              <Termo slug="espectro-eletromagnetico">espectro eletromagnético</Termo>{" "}
              que o olho não alcança — as cores foram atribuídas na tradução, para
              tornar visível o que foi medido.
            </p>
            <p className="text-muted-foreground">
              O acervo também guarda o lado humano do programa espacial: salas de
              controle, treinamento de tripulações, montagem de sondas. Vale buscar por
              missões pelo nome — Apollo, Voyager, Cassini — e não só por objetos
              celestes.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
