import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { SpacexConsole } from "./SpacexConsole";

const MODULE = getModule("spacex")!;

/** Módulo SpaceX — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Como se chega à órbita — ${SITE_NAME}`,
  description:
    "Por que foguetes têm estágios, o que é uma janela de lançamento e por que ir para o espaço é muito mais fácil que ficar lá.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Estágio de foguete",
    "Janela de lançamento",
    "Órbita de transferência",
    "Velocidade de escape",
  ],
};

export default function SpacexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SpacexConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <EntendaSection
            moduleId="spacex"
            title="O que é preciso para chegar à órbita"
          >
            <p>
              Existe um mal-entendido comum sobre foguetes: o difícil não é subir, é
              ficar lá em cima. Um avião a jato já voa alto; o que separa um voo de um
              satélite é a velocidade horizontal. Estar em órbita significa cair em
              direção à Terra e errar o planeta o tempo todo, porque se está indo rápido
              demais para o lado — algo em torno de 7,8 km/s em{" "}
              <Termo slug="orbita-baixa">órbita baixa</Termo>. A altitude é a parte
              barata da conta.
            </p>
            <p>
              Daí a divisão em <Termo slug="estagio-de-foguete">estágios</Termo>.
              Carregar tanques vazios custa combustível, então o veículo joga fora cada
              seção assim que ela se esgota. O primeiro estágio atravessa a atmosfera
              densa; o segundo, já no vácuo, faz o trabalho que de fato importa, que é
              acelerar até a velocidade orbital. Escapar de vez da gravidade da Terra —
              a <Termo slug="velocidade-de-escape">velocidade de escape</Termo> —
              exigiria cerca de 11,2 km/s.
            </p>
            <p>
              Os horários de lançamento na lista acima não são escolha de conveniência.
              A <Termo slug="janela-de-lancamento">janela de lançamento</Termo> é o
              intervalo em que a geometria fecha: para alcançar a Estação Espacial ela
              pode durar segundos, porque o plano orbital dela precisa passar sobre a
              base. Para Marte, abre-se a cada 26 meses. É por isso que um adiamento por
              vento ou por uma válvula teimosa custa tão caro.
            </p>
            <p className="text-muted-foreground">
              Missões a destinos mais altos raramente vão direto. O caminho econômico é
              uma <Termo slug="orbita-de-transferencia">órbita de transferência</Termo>:
              um empurrão estica a órbita até tocar a altitude desejada, outro a
              arredonda na chegada. É assim que satélites alcançam a{" "}
              <Termo slug="orbita-geoestacionaria">órbita geoestacionária</Termo> — e
              também como uma sonda leva sete meses até Marte aproveitando o movimento
              dos planetas, em vez de lutar contra ele.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
