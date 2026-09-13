import { Terminal } from "lucide-react";

import { EntendaSection } from "@/src/components/content/EntendaSection";
import { Termo } from "@/src/components/content/Termo";
import { ModuleScope, Scanline } from "@/src/components/hud";
import { SITE_NAME, SITE_URL } from "@/src/lib/config";
import { getModule } from "@/src/lib/modules";

import { TleConsole } from "./TleConsole";

const MODULE = getModule("tle")!;

/**
 * Módulo TLE — piloto do padrão "casca server + ilha client".
 *
 * A página inteira era `"use client"`, o que deixava o HTML servido vazio.
 * Agora o cabeçalho, a prosa didática e os dados estruturados são renderizados
 * no servidor, e só a busca por satélite continua no cliente (`TleConsole`).
 * É este o molde a replicar nos outros 18 módulos.
 */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Decodificador de TLE — ${SITE_NAME}`,
  description:
    "O que é um conjunto de elementos de duas linhas e o que cada elemento orbital significa, com dados ao vivo do catálogo CelesTrak.",
  url: `${SITE_URL}${MODULE.href}`,
  educationalLevel: "Beginner",
  inLanguage: "pt-BR",
  learningResourceType: "Interactive resource",
  teaches: [
    "Inclinação orbital",
    "Ascensão reta do nodo ascendente",
    "Excentricidade",
    "Anomalia média",
    "Movimento médio",
  ],
};

export default function TlePage() {
  return (
    <ModuleScope
      theme={MODULE.theme}
      className="relative min-h-screen px-4 pt-12 pb-24 sm:px-8"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* CRT scanlines globais */}
      <Scanline
        className="!fixed inset-0 z-50 mix-blend-overlay opacity-50"
        intensity="subtle"
      />

      <div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col"
        style={{ color: "var(--module-accent)" }}
      >
        <header
          className="mb-8 flex items-end justify-between border-b-2 pb-4 font-mono"
          style={{
            borderColor: "color-mix(in oklch, var(--module-accent) 40%, transparent)",
          }}
        >
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-[0.2em]">
              <Terminal className="h-6 w-6" />
              TLE_ORBITAL_DECODER
            </h1>
            <p className="mt-2 text-xs tracking-[0.25em] uppercase opacity-60">
              Codinome: {MODULE.codename} · CelesTrak Interface
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <span className="mb-1 block text-xs opacity-60">STATUS</span>
            <span className="flex items-center gap-2 text-sm">
              [
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ background: "var(--module-accent)" }}
              />
              ONLINE ]
            </span>
          </div>
        </header>

        <TleConsole />

        <EntendaSection moduleId="tle">
          <p>
            Todo objeto artificial em órbita da Terra tem sua trajetória publicada em um{" "}
            <Termo slug="tle">TLE</Termo> — duas linhas de 69 caracteres em que cada
            posição carrega um dado. É um formato dos anos 1960, pensado para caber em
            cartões perfurados, e continua sendo o padrão universal do rastreamento
            orbital. O console acima busca esses dados no catálogo público e decodifica
            a segunda linha, que é onde mora a geometria da órbita.
          </p>
          <p>
            Seis números descrevem por completo o caminho de um satélite. A{" "}
            <Termo slug="inclinacao">inclinação</Termo> diz o quanto a órbita é tombada
            em relação ao equador: perto de 0° ela acompanha a linha do equador, perto
            de 90° passa sobre os polos. O <Termo slug="raan">RAAN</Termo> diz para que
            lado esse plano tombado está girado no céu — juntos, os dois fixam o plano
            da órbita no espaço.
          </p>
          <p>
            Dentro desse plano, a <Termo slug="excentricidade">excentricidade</Termo>{" "}
            define o formato: 0 é um círculo perfeito, e quanto mais perto de 1, mais
            alongada a elipse. O argumento do <Termo slug="perigeu">perigeu</Termo>{" "}
            indica onde fica o ponto mais próximo da Terra, e a{" "}
            <Termo slug="anomalia-media">anomalia média</Termo> diz em que trecho da
            volta o satélite estava no instante do registro.
          </p>
          <p>
            Por fim, o <Termo slug="movimento-medio">movimento médio</Termo> conta
            quantas voltas o objeto dá por dia — é a leitura mais direta da altitude. A
            Estação Espacial Internacional, o alvo padrão do console (NORAD 25544),
            aparece com algo próximo de 15,5 voltas diárias, uma a cada 93 minutos. Um
            satélite <Termo slug="orbita-geoestacionaria">geoestacionário</Termo>{" "}
            mostraria aproximadamente 1,0.
          </p>
          <p className="text-muted-foreground">
            Um detalhe que engana quem está começando: o TLE descreve a órbita em um
            instante específico, a <Termo slug="epoca-orbital">época</Termo>. Como o
            arrasto atmosférico e o achatamento da Terra alteram a trajetória
            continuamente, um conjunto de elementos com alguns dias de idade já acumula
            erro de quilômetros na posição prevista — por isso os catálogos são
            republicados várias vezes ao dia.
          </p>
        </EntendaSection>
      </div>
    </ModuleScope>
  );
}
