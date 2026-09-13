import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { OsdrConsole } from "./OsdrConsole";

const MODULE = getModule("osdr")!;

/** Módulo OSDR — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Biologia em microgravidade — ${SITE_NAME}`,
  description:
    "Por que microgravidade não é ausência de gravidade, o que a queda livre faz com ossos e células, e por que a radiação é o obstáculo mais sério do voo tripulado longo.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Microgravidade", "Radiação cósmica"],
};

export default function OsdrPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <OsdrConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <EntendaSection moduleId="osdr" title="O que a queda livre faz com a vida">
            <p>
              Comece desfazendo o mal-entendido no nome. A{" "}
              <Termo slug="microgravidade">microgravidade</Termo> não é ausência de
              gravidade: na altitude da Estação Espacial, a atração da Terra ainda é
              cerca de 90% da que sentimos no chão. O que flutua está caindo — junto com
              a estação, e errando o planeta o tempo todo, que é o que significa estar
              em <Termo slug="orbita-baixa">órbita</Termo>.
            </p>
            <p>
              Em queda livre, nada pressiona nada, e a biologia reage. Ossos perdem
              densidade num ritmo que lembra osteoporose acelerada, fluidos corporais
              migram para a cabeça e a visão de astronautas muda. Em escala celular, sem
              o peso para orientar a sedimentação, culturas crescem em formatos
              tridimensionais que não se reproduzem em placa de laboratório no chão — o
              que torna esses experimentos interessantes para pesquisa médica terrestre.
            </p>
            <p>
              O outro fator, menos glamouroso e mais sério, é a{" "}
              <Termo slug="radiacao-cosmica">radiação cósmica</Termo>. No solo, duas
              barreiras nos protegem: o campo magnético da Terra e a espessura da
              atmosfera. Em órbita baixa resta só a primeira; numa viagem a Marte,
              nenhuma.
            </p>
            <p className="text-muted-foreground">
              É por isso que boa parte dos conjuntos de dados listados aqui mede dano ao
              DNA e resposta celular à radiação. Blindagem eficaz é pesada, e peso é
              exatamente o que custa caro lançar — o problema é tão de engenharia quanto
              de biologia.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
