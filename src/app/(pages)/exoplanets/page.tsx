import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { ExoplanetsConsole } from "./ExoplanetsConsole";

const MODULE = getModule("exoplanets")!;

/** Módulo Exoplanets — casca server + ilha client (padrão em `eonet/page.tsx`). */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Como se descobre um exoplaneta — ${SITE_NAME}`,
  description:
    "Trânsito e velocidade radial explicados: como se detecta um planeta a anos-luz de distância sem nunca vê-lo, e o que a zona habitável realmente significa.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: ["Trânsito", "Velocidade radial", "Zona habitável", "Ano-luz"],
};

export default function ExoplanetsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ExoplanetsConsole />

      <ModuleScope theme={MODULE.theme} className="px-4 pb-24 sm:px-8">
        <div className="mx-auto w-full max-w-[100rem]">
          <EntendaSection
            moduleId="exoplanets"
            title="Como se descobre um mundo que ninguém viu"
          >
            <p>
              Quase nenhum dos <Termo slug="exoplaneta">exoplanetas</Termo> deste
              catálogo foi fotografado. Eles foram detectados por efeito indireto — e
              conhecer o método explica por que o catálogo tem a cara que tem.
            </p>
            <p>
              O <Termo slug="transito">trânsito</Termo> responde pela maioria das
              descobertas. Quando o planeta passa na frente da estrela, o brilho dela
              cai um tiquinho, de forma periódica. A queda é minúscula — a Terra vista
              de fora reduziria o brilho do Sol em cerca de 0,008% — mas a profundidade
              revela o tamanho do planeta. Melhor ainda: durante a passagem, a luz
              atravessa a atmosfera do planeta e carrega a assinatura química desse ar.
            </p>
            <p>
              O outro método principal é a{" "}
              <Termo slug="velocidade-radial">velocidade radial</Termo>. Planeta e
              estrela orbitam um centro de massa comum, então a estrela também
              bamboleia; esse movimento desloca as linhas do espectro. Júpiter faz o Sol
              oscilar a uns 12 metros por segundo — velocidade de corrida. O método
              continua essencial porque fornece a massa, que o trânsito sozinho não dá.
            </p>
            <p className="text-muted-foreground">
              Um alerta sobre a coluna mais empolgante: estar na{" "}
              <Termo slug="zona-habitavel">zona habitável</Termo> não significa
              habitável. A faixa é definida só pela distância em que água líquida
              poderia existir na superfície, dado o brilho da estrela. Vênus está na
              borda interna da nossa e é um forno de 460 °C. Atmosfera, campo magnético
              e história do planeta pesam tanto quanto a órbita.
            </p>
          </EntendaSection>
        </div>
      </ModuleScope>
    </>
  );
}
