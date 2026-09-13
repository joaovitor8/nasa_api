import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { MarsConsole } from "./MarsConsole";

const MODULE = getModule("mars")!;

/**
 * Módulo Mars — casca server + ilha client (ver `src/app/(pages)/tle/page.tsx`).
 *
 * O cabeçalho fica dentro de `MarsConsole` porque depende de `useLocale()`;
 * aqui ficam os dados estruturados e a prosa didática, que precisam estar no
 * HTML servido.
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Clima de Marte — ${SITE_NAME}`,
  description:
    "Como se lê a telemetria meteorológica de Marte: o que é um sol, por que a atmosfera é cem vezes mais rarefeita que a nossa e o que as tempestades de poeira significam.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Sol (dia marciano)",
    "Atmosfera de Marte",
    "Tempestade de poeira marciana",
    "Estações de Marte",
  ],
};

export default function MarsPage() {
  return (
    <ModuleScope
      theme={MODULE.theme}
      ambient
      className="min-h-screen px-4 pt-12 pb-24 sm:px-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarsConsole />

      <div className="mx-auto w-full max-w-6xl">
        <EntendaSection moduleId="mars" title="Entenda o clima de Marte">
          <p>
            Os registros acima não são numerados por data terrestre, e sim por{" "}
            <Termo slug="sol-marciano">sol</Termo> — o dia marciano, que dura 24 horas,
            39 minutos e 35 segundos. A contagem começa em 1 no dia do pouso da sonda, e
            é assim que toda missão de superfície marca o tempo.
          </p>
          <p>
            O número que mais choca quem olha pela primeira vez é a pressão, na casa dos
            600 pascals. A <Termo slug="atmosfera-marciana">atmosfera de Marte</Termo> é
            cerca de cem vezes mais rarefeita que a nossa e composta sobretudo de gás
            carbônico. Isso explica a amplitude térmica brutal entre o dia e a noite:
            sem ar denso o bastante para reter calor, o que o Sol aquece à tarde se
            perde quase inteiro depois do pôr do sol.
          </p>
          <p>
            A mesma raridade do ar inverte a intuição sobre vento. Uma rajada de 100
            km/h em Marte empurra com menos força que uma brisa na Terra, porque há
            pouquíssima massa de ar em movimento. O perigo de uma{" "}
            <Termo slug="tempestade-de-poeira">tempestade de poeira</Termo> não está no
            impacto, e sim no pó que se acumula sobre os painéis solares — foi o que
            silenciou o rover Opportunity em 2018.
          </p>
          <p className="text-muted-foreground">
            O campo de estação em cada registro tem mais peso do que parece. Marte tem
            inclinação axial parecida com a da Terra, então também tem{" "}
            <Termo slug="estacoes-marcianas">estações</Termo> — só que o ano dura quase
            dois anos terrestres e a órbita é bem mais{" "}
            <Termo slug="excentricidade">excêntrica</Termo>. O planeta fica bem mais
            perto do Sol no verão do hemisfério sul, o que torna essa estação curta,
            intensa e propensa às grandes tempestades globais.
          </p>
        </EntendaSection>
      </div>
    </ModuleScope>
  );
}
