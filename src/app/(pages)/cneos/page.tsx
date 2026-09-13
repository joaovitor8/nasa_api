import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { CneosConsole } from "./CneosConsole";

const MODULE = getModule("cneos")!;

/** Módulo Sentry — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Matriz de risco de impacto — ${SITE_NAME}`,
  description:
    "Como se mede o risco de um asteroide atingir a Terra: escala de Torino para o público, escala de Palermo para especialistas, e por que os números quase sempre caem.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Intermediate",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Escala de Torino",
    "Escala de Palermo",
    "Asteroide potencialmente perigoso",
  ],
};

export default function CneosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CneosConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection moduleId="cneos" title="Como se mede risco de impacto">
            <p>
              Esta é a lista que o sistema Sentry mantém sob vigilância automática:
              objetos cuja órbita ainda não está determinada com precisão suficiente
              para descartar uma colisão futura. Estar aqui não é sinal de alarme — é
              sinal de que faltam observações.
            </p>
            <p>
              Existem duas escalas, com públicos diferentes. A{" "}
              <Termo slug="escala-de-torino">escala de Torino</Termo> vai de 0 a 10, tem
              código de cores e foi desenhada para falar com o público sem alarmismo:
              combina probabilidade e energia num número só. Praticamente tudo que já
              foi catalogado é zero.
            </p>
            <p>
              A <Termo slug="escala-de-palermo">escala de Palermo</Termo> é a ferramenta
              técnica. Ela é logarítmica e compara a ameaça de um objeto específico com
              a probabilidade de fundo — a chance de um impacto semelhante acontecer por
              acaso no mesmo intervalo de tempo. Valor 0 significa risco equivalente ao
              de fundo; abaixo de −2, o caso não merece atenção especial. Quase todos
              ficam bem abaixo disso.
            </p>
            <p className="text-muted-foreground">
              O padrão histórico é tranquilizador e vale conhecer: valores sobem quando
              um objeto é descoberto com poucas observações, e caem conforme o arco
              orbital se estende. Apophis chegou a 4 na escala de Torino em 2004 — o
              maior valor já registrado — e hoje está descartado por pelo menos um
              século. Mais dados quase sempre significam menos risco, não mais.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
