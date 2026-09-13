import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { NewsConsole } from "./NewsConsole";

const MODULE = getModule("news")!;

/** Módulo News — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Como ler notícia de espaço — ${SITE_NAME}`,
  description:
    "O vocabulário por trás das manchetes: por que quase toda notícia de asteroide é menos assustadora do que parece e o que significa adiar um lançamento.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Objeto próximo da Terra", "Escala de Torino", "Janela de lançamento"],
};

export default function NewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <NewsConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <EntendaSection moduleId="news" title="Como ler notícia de espaço">
            <p>
              Manchete de asteroide é o gênero mais distorcido do noticiário espacial.
              &quot;Asteroide passa raspando pela Terra&quot; quase sempre descreve um{" "}
              <Termo slug="neo">objeto próximo da Terra</Termo> — uma classificação
              puramente geométrica, que não implica risco nenhum. Há mais de 30 mil
              deles catalogados, e passagens a milhões de quilômetros são rotina
              semanal.
            </p>
            <p>
              Quando o risco é real, existe um número para ele. A{" "}
              <Termo slug="escala-de-torino">escala de Torino</Termo> vai de 0 a 10 e
              foi criada justamente para conter o alarmismo. Praticamente tudo que já
              foi catalogado é zero, e valores costumam cair conforme novas observações
              refinam a órbita — foi o que aconteceu com Apophis, que chegou a 4 em 2004
              e hoje está descartado por pelo menos um século. Se a notícia não menciona
              a escala, desconfie.
            </p>
            <p>
              Do lado dos lançamentos, adiamentos rendem manchetes de fracasso que
              raramente são justas. A{" "}
              <Termo slug="janela-de-lancamento">janela de lançamento</Termo> pode durar
              segundos quando o destino é a Estação Espacial, porque o plano orbital
              dela precisa passar sobre a base. Perder a janela por causa de vento não é
              incompetência — é a física do problema.
            </p>
            <p className="text-muted-foreground">
              Um último detalhe de vocabulário: &quot;chegar ao espaço&quot; e
              &quot;entrar em órbita&quot; são coisas diferentes. Voos suborbitais sobem
              além da linha de Kármán e caem de volta em minutos. Ficar em{" "}
              <Termo slug="orbita-baixa">órbita</Termo> exige velocidade horizontal de
              cerca de 7,8 km/s — um problema muito maior, e a razão de tantos foguetes
              parecerem exagerados para a carga que levam.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
