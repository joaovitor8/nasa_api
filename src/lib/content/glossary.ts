import type { GlossaryTerm } from "./types";

/**
 * Glossário do Universo.
 *
 * Critério de entrada: o termo aparece em algum módulo sem ser explicado, ou é
 * pré-requisito para entender um que aparece. Todo verbete tem `short` que faz
 * sentido isolado (é o que vai no tooltip do `<Termo>`) e pelo menos uma fonte
 * verificável — conteúdo científico sem citação não entra.
 *
 * Os campos `related`, `modules` e `bodies` são validados por teste contra os
 * catálogos reais, então um slug errado quebra o CI em vez de virar link morto.
 */
export const GLOSSARY: GlossaryTerm[] = [
  /* ─── Elementos orbitais ────────────────────────────────────────── */
  {
    slug: "tle",
    term: {
      pt: "TLE (Conjunto de Elementos de Duas Linhas)",
      en: "Two-Line Element Set",
    },
    short: {
      pt: "Formato de texto de duas linhas que descreve a órbita de um satélite em um instante específico.",
    },
    long: {
      pt: "Criado pela NORAD nos anos 1960, o TLE comprime toda a órbita de um objeto em duas linhas de 69 caracteres. Cada posição fixa da linha carrega um dado: identificador, época, inclinação, excentricidade e por aí vai. É o formato universal do rastreamento orbital — praticamente todo software de previsão de passagem de satélite come TLE. A contrapartida é que ele descreve a órbita em um instante (a época) e perde precisão com o tempo, por isso os catálogos são republicados várias vezes ao dia.",
    },
    aliases: ["two-line element", "elementos de duas linhas"],
    related: ["epoca-orbital", "norad-id", "movimento-medio", "inclinacao"],
    modules: ["tle", "ssc"],
    sources: [
      { label: "CelesTrak — TLE Format", url: "https://celestrak.org/columns/v04n03/" },
    ],
  },
  {
    slug: "inclinacao",
    term: { pt: "Inclinação orbital", en: "Orbital inclination" },
    short: {
      pt: "Ângulo entre o plano da órbita e o plano de referência — o equador, no caso de satélites da Terra.",
    },
    long: {
      pt: "Vai de 0° a 180°. Uma órbita de 0° corre sobre o equador no mesmo sentido da rotação do planeta; 90° é uma órbita polar, que passa sobre os dois polos e com o tempo sobrevoa o planeta inteiro; acima de 90° a órbita é retrógrada, ou seja, corre contra a rotação. A inclinação também limita a latitude máxima que o satélite sobrevoa: um satélite a 51,6° — a inclinação da Estação Espacial Internacional — nunca passa diretamente sobre pontos além dessa latitude.",
    },
    related: ["tle", "raan", "orbita-baixa"],
    modules: ["tle", "ssc"],
    sources: [
      {
        label: "NASA — Orbital Elements",
        url: "https://spaceflight.nasa.gov/realdata/elements/",
      },
    ],
  },
  {
    slug: "raan",
    term: {
      pt: "RAAN (Ascensão Reta do Nodo Ascendente)",
      en: "Right Ascension of the Ascending Node",
    },
    short: {
      pt: "Ângulo que diz em que direção do céu a órbita cruza o plano de referência subindo.",
    },
    long: {
      pt: "A órbita corta o plano equatorial em dois pontos; o nodo ascendente é aquele em que o objeto passa do hemisfério sul para o norte. O RAAN mede, em graus, a posição desse ponto em relação a uma direção fixa no céu (o ponto vernal). Se a inclinação diz o quanto a órbita é inclinada, o RAAN diz para que lado ela está girada — as duas juntas fixam o plano orbital no espaço. Para satélites em órbita baixa, o achatamento da Terra faz o RAAN derivar alguns graus por dia, efeito que órbitas heliossíncronas exploram de propósito.",
    },
    aliases: ["ascensão reta do nodo ascendente", "nodo ascendente"],
    related: ["inclinacao", "tle", "perigeu"],
    modules: ["tle"],
    sources: [
      {
        label: "NASA — Orbital Elements",
        url: "https://spaceflight.nasa.gov/realdata/elements/",
      },
    ],
  },
  {
    slug: "excentricidade",
    term: { pt: "Excentricidade", en: "Eccentricity" },
    short: {
      pt: "Número de 0 a 1 que mede o quanto uma órbita se afasta de um círculo perfeito.",
    },
    long: {
      pt: "Excentricidade 0 é um círculo; entre 0 e 1 é uma elipse cada vez mais alongada; exatamente 1 é uma parábola e acima de 1 uma hipérbole — nesses dois últimos casos o objeto não está preso, e escapa. A Terra tem excentricidade de cerca de 0,017, quase circular. Já os cometas de período longo chegam perto de 1, o que explica por que passam anos no frio do sistema solar externo e só ficam visíveis por algumas semanas perto do Sol.",
    },
    related: ["perigeu", "apogeu", "semieixo-maior", "cometa"],
    modules: ["tle", "asteroids"],
    bodies: ["terra", "plutao"],
    sources: [
      {
        label: "NASA Science — Orbits",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
    ],
  },
  {
    slug: "perigeu",
    term: { pt: "Perigeu", en: "Perigee" },
    short: { pt: "Ponto da órbita em que o objeto chega mais perto da Terra." },
    long: {
      pt: "É onde o objeto está mais próximo e, por consequência da segunda lei de Kepler, mais rápido. O oposto é o apogeu. Os prefixos mudam conforme o corpo central: em torno do Sol falamos de periélio, em torno da Lua de perilúnio. Em manobras orbitais o perigeu é o ponto preferido para acelerar, porque ali o ganho de energia por unidade de combustível é maior.",
    },
    related: ["apogeu", "excentricidade", "perielio"],
    modules: ["tle"],
    sources: [
      {
        label: "NASA Science — Orbits",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
    ],
  },
  {
    slug: "apogeu",
    term: { pt: "Apogeu", en: "Apogee" },
    short: { pt: "Ponto da órbita em que o objeto chega mais longe da Terra." },
    long: {
      pt: "No apogeu o objeto está no ponto mais distante e se move mais devagar. A diferença entre apogeu e perigeu é o que dá a forma da elipse: quando os dois são quase iguais, a órbita é praticamente circular.",
    },
    related: ["perigeu", "excentricidade"],
    modules: ["tle"],
    sources: [
      {
        label: "NASA Science — Orbits",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
    ],
  },
  {
    slug: "anomalia-media",
    term: { pt: "Anomalia média", en: "Mean anomaly" },
    short: {
      pt: "Ângulo que indica onde o objeto está na órbita, como se ele viajasse a velocidade constante.",
    },
    long: {
      pt: "Um corpo em órbita elíptica não se move a velocidade constante — acelera no perigeu e desacelera no apogeu. A anomalia média é uma ficção conveniente: o ângulo que o objeto teria percorrido se andasse sempre no mesmo ritmo. Por crescer de forma perfeitamente linear com o tempo, é ideal para armazenar em catálogos como o TLE; o software converte depois para a posição real resolvendo a equação de Kepler.",
    },
    related: ["tle", "movimento-medio", "excentricidade"],
    modules: ["tle"],
    sources: [
      {
        label: "NASA — Orbital Elements",
        url: "https://spaceflight.nasa.gov/realdata/elements/",
      },
    ],
  },
  {
    slug: "movimento-medio",
    term: { pt: "Movimento médio", en: "Mean motion" },
    short: { pt: "Quantas voltas completas o objeto dá em torno da Terra por dia." },
    long: {
      pt: "É a forma mais direta de ler a altitude de um satélite: quanto mais voltas por dia, mais baixa a órbita. A Estação Espacial Internacional faz cerca de 15,5 voltas diárias, uma a cada 93 minutos. Um satélite geoestacionário tem movimento médio de aproximadamente 1,0027 — uma volta por dia sideral, exatamente o que o mantém parado sobre o mesmo ponto do equador.",
    },
    related: ["tle", "anomalia-media", "orbita-geoestacionaria", "semieixo-maior"],
    modules: ["tle", "ssc"],
    sources: [
      { label: "CelesTrak — TLE Format", url: "https://celestrak.org/columns/v04n03/" },
    ],
  },
  {
    slug: "semieixo-maior",
    term: { pt: "Semieixo maior", en: "Semi-major axis" },
    short: {
      pt: "Metade do eixo mais longo da elipse orbital — na prática, o 'tamanho' da órbita.",
    },
    long: {
      pt: "É o parâmetro que determina o período orbital: pela terceira lei de Kepler, o quadrado do período é proporcional ao cubo do semieixo maior. Ou seja, duas órbitas com o mesmo semieixo maior levam o mesmo tempo para completar uma volta, por mais diferentes que sejam seus formatos.",
    },
    related: ["excentricidade", "movimento-medio"],
    modules: ["tle", "exoplanets"],
    sources: [
      {
        label: "NASA Science — Kepler's Laws",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
    ],
  },
  {
    slug: "epoca-orbital",
    term: { pt: "Época", en: "Epoch" },
    short: {
      pt: "Instante exato a que se referem os elementos orbitais de um catálogo.",
    },
    long: {
      pt: "Órbitas mudam: o arrasto atmosférico, a pressão da radiação solar e o achatamento da Terra alteram continuamente os parâmetros. Por isso todo conjunto de elementos vem carimbado com uma época. Quanto mais velha a época, menos confiável a previsão — para objetos em órbita baixa, um TLE com mais de alguns dias já acumula erro de quilômetros na posição prevista.",
    },
    related: ["tle", "norad-id"],
    modules: ["tle", "ssc"],
    sources: [
      { label: "CelesTrak — TLE Format", url: "https://celestrak.org/columns/v04n03/" },
    ],
  },
  {
    slug: "norad-id",
    term: { pt: "NORAD ID (número de catálogo)", en: "NORAD Catalog Number" },
    short: {
      pt: "Número único atribuído a cada objeto artificial rastreado em órbita da Terra.",
    },
    long: {
      pt: "Atribuído em ordem de catalogação desde o início da era espacial, é o identificador universal de satélites e detritos. O Sputnik 1 recebeu o número 2; a Estação Espacial Internacional é o objeto 25544. Hoje o catálogo público passa de dezenas de milhares de objetos, a maior parte deles detritos — fragmentos de foguetes e de colisões, não satélites ativos.",
    },
    aliases: ["número de catálogo", "satcat"],
    related: ["tle", "epoca-orbital"],
    modules: ["tle", "ssc"],
    sources: [
      { label: "CelesTrak — SATCAT", url: "https://celestrak.org/satcat/search.php" },
    ],
  },

  /* ─── Regimes de órbita ─────────────────────────────────────────── */
  {
    slug: "orbita-baixa",
    term: { pt: "Órbita terrestre baixa (LEO)", en: "Low Earth Orbit" },
    short: { pt: "Faixa de órbitas até cerca de 2.000 km de altitude." },
    long: {
      pt: "É onde está a maior parte da atividade espacial: a Estação Espacial Internacional (por volta de 400 km), o telescópio Hubble, as constelações de internet e quase todos os satélites de observação da Terra. Objetos em LEO completam uma volta em 90 minutos aproximadamente e sofrem arrasto atmosférico residual — sem correções periódicas, acabam reentrando.",
    },
    aliases: ["LEO", "órbita baixa"],
    related: ["orbita-geoestacionaria", "movimento-medio", "inclinacao"],
    modules: ["ssc", "tle"],
    bodies: ["terra"],
    sources: [
      {
        label: "ESA — Low Earth orbit",
        url: "https://www.esa.int/ESA_Multimedia/Images/2020/03/Low_Earth_orbit",
      },
    ],
  },
  {
    slug: "orbita-geoestacionaria",
    term: { pt: "Órbita geoestacionária (GEO)", en: "Geostationary Orbit" },
    short: {
      pt: "Órbita equatorial a 35.786 km onde o satélite acompanha a rotação da Terra e parece parado no céu.",
    },
    long: {
      pt: "Nessa altitude específica o período orbital coincide com o dia sideral, então o satélite fica sobre o mesmo ponto do equador. É por isso que antenas de TV por satélite podem ser fixas — não precisam rastrear nada. A desvantagem é a distância: o sinal leva cerca de 0,24 segundo para ir e voltar, latência perceptível em chamadas e inaceitável para jogos online.",
    },
    aliases: ["GEO", "geoestacionária"],
    related: ["orbita-baixa", "movimento-medio"],
    modules: ["ssc", "tle"],
    bodies: ["terra"],
    sources: [
      {
        label: "ESA — Types of orbits",
        url: "https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits",
      },
    ],
  },
  {
    slug: "ponto-de-lagrange",
    term: { pt: "Ponto de Lagrange", en: "Lagrange point" },
    short: {
      pt: "Uma das cinco posições em que a gravidade de dois corpos permite a um terceiro acompanhá-los sem gastar combustível.",
    },
    long: {
      pt: "No sistema Sol–Terra existem cinco desses pontos, de L1 a L5. O L1, a cerca de 1,5 milhão de km na direção do Sol, é ideal para monitorar o vento solar antes que ele chegue até nós — é onde fica o satélite DSCOVR, que fotografa a Terra iluminada por inteiro. O L2, do lado oposto, abriga telescópios como o James Webb, que precisam ficar na sombra térmica da Terra. L1, L2 e L3 são instáveis e exigem pequenas correções; L4 e L5 são estáveis e acumulam asteroides naturalmente.",
    },
    aliases: ["L1", "L2", "ponto de libração"],
    related: ["vento-solar", "unidade-astronomica"],
    modules: ["epic", "donki"],
    bodies: ["terra", "sol"],
    sources: [
      {
        label: "NASA Science — What Is a Lagrange Point?",
        url: "https://science.nasa.gov/resource/what-is-a-lagrange-point/",
      },
    ],
  },

  /* ─── Distâncias e escalas ──────────────────────────────────────── */
  {
    slug: "unidade-astronomica",
    term: { pt: "Unidade astronômica (UA)", en: "Astronomical unit" },
    short: {
      pt: "Distância média entre a Terra e o Sol, definida como exatamente 149.597.870.700 metros.",
    },
    long: {
      pt: "É a régua padrão do sistema solar. Marte fica a cerca de 1,5 UA do Sol, Júpiter a 5,2 UA, Netuno a 30 UA. Desde 2012 a União Astronômica Internacional fixou o valor como uma constante exata em metros, em vez de defini-lo pela órbita real da Terra — que varia. Para distâncias entre estrelas a UA fica pequena demais, e passa-se a usar anos-luz ou parsecs.",
    },
    aliases: ["UA", "AU"],
    related: ["ano-luz", "parsec", "distancia-lunar"],
    modules: ["solar-system", "exoplanets", "asteroids"],
    bodies: ["terra", "sol", "netuno"],
    sources: [
      {
        label: "IAU — Resolution B2 (2012)",
        url: "https://www.iau.org/static/resolutions/IAU2012_English.pdf",
      },
    ],
  },
  {
    slug: "ano-luz",
    term: { pt: "Ano-luz", en: "Light-year" },
    short: {
      pt: "Distância que a luz percorre em um ano no vácuo — cerca de 9,46 trilhões de quilômetros.",
    },
    long: {
      pt: "É medida de distância, não de tempo, apesar do nome. A estrela mais próxima do Sol, Proxima Centauri, está a 4,2 anos-luz: a luz que vemos dela hoje partiu há mais de quatro anos. Essa é a consequência mais bonita da unidade — olhar longe é sempre olhar para o passado.",
    },
    related: ["unidade-astronomica", "parsec"],
    modules: ["exoplanets", "apod"],
    sources: [
      {
        label: "NASA Science — Light Years",
        url: "https://science.nasa.gov/exoplanets/light-years/",
      },
    ],
  },
  {
    slug: "parsec",
    term: { pt: "Parsec (pc)", en: "Parsec" },
    short: {
      pt: "Distância em que uma estrela mostra paralaxe de um segundo de arco — cerca de 3,26 anos-luz.",
    },
    long: {
      pt: "O nome vem de 'paralaxe de um segundo'. É a unidade preferida da astronomia profissional porque sai direto da medida observacional: mede-se o quanto a estrela parece se deslocar ao longo do ano e a distância cai por trigonometria simples. Múltiplos comuns são o kiloparsec, para escalas galácticas, e o megaparsec, para distâncias entre galáxias.",
    },
    aliases: ["pc"],
    related: ["ano-luz", "paralaxe", "unidade-astronomica"],
    modules: ["exoplanets"],
    sources: [
      {
        label: "ESA — Gaia and the parsec",
        url: "https://www.esa.int/Science_Exploration/Space_Science/Gaia",
      },
    ],
  },
  {
    slug: "paralaxe",
    term: { pt: "Paralaxe", en: "Parallax" },
    short: {
      pt: "Deslocamento aparente de um objeto quando observado de dois pontos diferentes.",
    },
    long: {
      pt: "É o mesmo efeito de fechar um olho e depois o outro e ver o dedo 'pular' contra o fundo. Na astronomia, os dois pontos de vista são posições opostas da órbita da Terra, com seis meses de intervalo. Quanto mais perto a estrela, maior o salto aparente — e foi assim que se mediu pela primeira vez, em 1838, a distância de uma estrela que não o Sol.",
    },
    related: ["parsec", "ano-luz"],
    modules: ["exoplanets"],
    sources: [
      {
        label: "ESA — Gaia mission",
        url: "https://www.esa.int/Science_Exploration/Space_Science/Gaia",
      },
    ],
  },
  {
    slug: "distancia-lunar",
    term: { pt: "Distância lunar (LD)", en: "Lunar distance" },
    short: {
      pt: "Distância média entre a Terra e a Lua, cerca de 384.400 km, usada como régua para aproximações de asteroides.",
    },
    long: {
      pt: "Comunicados sobre asteroides quase sempre expressam a aproximação em distâncias lunares porque é a escala que dá intuição: um objeto que passa a 0,5 LD passou mais perto que a Lua, o que é notável mas não raro. Para comparação, satélites geoestacionários orbitam a menos de 0,1 LD.",
    },
    aliases: ["LD", "distância lunar"],
    related: ["neo", "pha", "unidade-astronomica"],
    modules: ["asteroids", "cneos"],
    bodies: ["terra"],
    sources: [
      { label: "NASA CNEOS — Close Approaches", url: "https://cneos.jpl.nasa.gov/ca/" },
    ],
  },

  /* ─── Brilho ────────────────────────────────────────────────────── */
  {
    slug: "magnitude-aparente",
    term: { pt: "Magnitude aparente", en: "Apparent magnitude" },
    short: {
      pt: "Medida de brilho de um objeto visto da Terra — quanto menor o número, mais brilhante.",
    },
    long: {
      pt: "A escala é invertida e logarítmica, herdada dos gregos: Hiparco chamou as estrelas mais brilhantes de primeira grandeza e as mais fracas de sexta. Cada cinco magnitudes correspondem a um fator de exatamente 100 em brilho. O Sol tem magnitude aparente de cerca de −26,7; Vênus chega a −4,6; a olho nu, em céu escuro, enxergamos até aproximadamente +6.",
    },
    related: ["magnitude-absoluta", "albedo"],
    modules: ["apod", "asteroids"],
    bodies: ["sol", "venus"],
    sources: [
      {
        label: "NASA Science — Magnitude",
        url: "https://science.nasa.gov/learn/basics-of-space-flight/",
      },
    ],
  },
  {
    slug: "magnitude-absoluta",
    term: { pt: "Magnitude absoluta", en: "Absolute magnitude" },
    short: {
      pt: "Brilho que um objeto teria a uma distância padronizada — permite comparar objetos de verdade.",
    },
    long: {
      pt: "A magnitude aparente confunde brilho com proximidade: uma vela perto parece mais brilhante que um farol longe. A magnitude absoluta resolve isso colocando todos à mesma distância — 10 parsecs, para estrelas. O Sol, que domina nosso céu com −26,7 aparente, tem magnitude absoluta de apenas +4,83: uma estrela bem comum. Para asteroides usa-se uma convenção diferente (a magnitude H), base da classificação de objetos potencialmente perigosos.",
    },
    related: ["magnitude-aparente", "parsec", "pha"],
    modules: ["asteroids", "exoplanets"],
    bodies: ["sol"],
    sources: [
      {
        label: "NASA CNEOS — Asteroid Size Estimator",
        url: "https://cneos.jpl.nasa.gov/tools/ast_size_est.html",
      },
    ],
  },
  {
    slug: "albedo",
    term: { pt: "Albedo", en: "Albedo" },
    short: {
      pt: "Fração da luz recebida que uma superfície reflete, de 0 (negra) a 1 (espelho perfeito).",
    },
    long: {
      pt: "Determina tanto o brilho aparente quanto a temperatura de um corpo. A Lua reflete só cerca de 12% da luz que recebe — é quase tão escura quanto asfalto, embora pareça prateada contra o céu noturno. Vênus, coberta de nuvens, reflete mais de 70%, e é por isso que brilha tanto. O albedo é também a maior fonte de incerteza ao estimar o tamanho de um asteroide a partir do seu brilho.",
    },
    related: ["magnitude-aparente", "asteroide"],
    modules: ["asteroids", "gibs", "solar-system"],
    bodies: ["venus", "terra"],
    sources: [
      {
        label: "NASA Earth Observatory — Albedo",
        url: "https://earthobservatory.nasa.gov/images/84499/measuring-earths-albedo",
      },
    ],
  },

  /* ─── Exoplanetas ───────────────────────────────────────────────── */
  {
    slug: "exoplaneta",
    term: { pt: "Exoplaneta", en: "Exoplanet" },
    short: { pt: "Planeta que orbita uma estrela diferente do Sol." },
    long: {
      pt: "O primeiro exoplaneta confirmado em torno de uma estrela parecida com o Sol foi anunciado em 1995 — descoberta que rendeu o Nobel de Física de 2019. Hoje o catálogo confirmado passa de cinco mil mundos, com variedade que a ficção não previu: 'Júpiteres quentes' que orbitam em dias, super-Terras rochosas maiores que a nossa, planetas em sistemas de estrelas duplas.",
    },
    related: ["transito", "velocidade-radial", "zona-habitavel"],
    modules: ["exoplanets"],
    sources: [
      {
        label: "NASA Exoplanet Archive",
        url: "https://exoplanetarchive.ipac.caltech.edu/",
      },
    ],
  },
  {
    slug: "transito",
    term: { pt: "Trânsito", en: "Transit" },
    short: {
      pt: "Passagem de um planeta na frente de sua estrela, causando uma pequena queda no brilho observado.",
    },
    long: {
      pt: "É o método que mais descobriu exoplanetas. A queda de brilho é minúscula — a Terra vista de fora reduziria o brilho do Sol em cerca de 0,008% — mas é periódica, e a profundidade da queda revela o tamanho do planeta. Melhor ainda: quando a luz da estrela atravessa a atmosfera do planeta durante o trânsito, ela carrega a assinatura química desse ar, o que permite analisar atmosferas a anos-luz de distância.",
    },
    related: ["exoplaneta", "velocidade-radial", "zona-habitavel"],
    modules: ["exoplanets"],
    sources: [
      {
        label: "NASA — 5 Ways to Find a Planet",
        url: "https://science.nasa.gov/exoplanets/ways-to-find-a-planet/",
      },
    ],
  },
  {
    slug: "velocidade-radial",
    term: { pt: "Velocidade radial", en: "Radial velocity" },
    short: {
      pt: "Método que detecta planetas pelo bamboleio que eles provocam na estrela.",
    },
    long: {
      pt: "Planeta e estrela orbitam um centro de massa comum, então a estrela também se move um pouco. Esse movimento desloca as linhas do espectro estelar para o azul quando ela se aproxima e para o vermelho quando se afasta. Júpiter faz o Sol oscilar a cerca de 12 metros por segundo — velocidade de corrida — e é isso que os espectrógrafos medem. Foi assim que se confirmou o primeiro exoplaneta, e o método continua essencial porque fornece a massa, que o trânsito sozinho não dá.",
    },
    aliases: ["doppler", "bamboleio estelar"],
    related: ["exoplaneta", "transito"],
    modules: ["exoplanets"],
    sources: [
      {
        label: "NASA — 5 Ways to Find a Planet",
        url: "https://science.nasa.gov/exoplanets/ways-to-find-a-planet/",
      },
    ],
  },
  {
    slug: "zona-habitavel",
    term: { pt: "Zona habitável", en: "Habitable zone" },
    short: {
      pt: "Faixa de distâncias de uma estrela onde água líquida poderia existir na superfície de um planeta.",
    },
    long: {
      pt: "Também chamada de 'zona de Cachinhos Dourados' — nem quente demais, nem fria demais. A faixa depende do brilho da estrela: em torno de uma anã vermelha, fraca, ela fica muito mais perto que a órbita de Mercúrio. Estar na zona habitável não garante nada: Vênus está na borda interna da nossa e é um forno de 460 °C. Atmosfera, campo magnético e história do planeta pesam tanto quanto a distância.",
    },
    aliases: ["zona de cachinhos dourados", "goldilocks"],
    related: ["exoplaneta", "transito", "unidade-astronomica"],
    modules: ["exoplanets"],
    bodies: ["terra", "venus", "marte"],
    sources: [
      {
        label: "NASA — Habitable Zone",
        url: "https://science.nasa.gov/exoplanets/habitable-zone/",
      },
    ],
  },

  /* ─── Defesa planetária ─────────────────────────────────────────── */
  {
    slug: "neo",
    term: { pt: "NEO (Objeto Próximo da Terra)", en: "Near-Earth Object" },
    short: {
      pt: "Asteroide ou cometa cuja órbita o traz a menos de 1,3 unidade astronômica do Sol.",
    },
    long: {
      pt: "A definição é puramente geométrica e não implica risco: a imensa maioria dos mais de 30 mil NEOs conhecidos nunca chegará perto da Terra. O interesse é duplo — monitorar os poucos que merecem atenção e estudar os demais, que são fósseis químicos da formação do sistema solar, mais acessíveis a sondas do que o cinturão principal.",
    },
    aliases: ["objeto próximo da terra", "near-earth object"],
    related: ["pha", "escala-de-torino", "distancia-lunar", "asteroide"],
    modules: ["asteroids", "cneos"],
    sources: [
      {
        label: "NASA CNEOS — NEO Basics",
        url: "https://cneos.jpl.nasa.gov/about/neo_groups.html",
      },
    ],
  },
  {
    slug: "pha",
    term: {
      pt: "PHA (Asteroide Potencialmente Perigoso)",
      en: "Potentially Hazardous Asteroid",
    },
    short: {
      pt: "Asteroide grande o bastante e com órbita próxima o bastante para merecer monitoramento contínuo.",
    },
    long: {
      pt: "Dois critérios objetivos definem a classe: a órbita precisa chegar a 0,05 UA (cerca de 7,5 milhões de km) da órbita terrestre, e a magnitude absoluta tem de ser 22,0 ou menor — o que corresponde grosseiramente a mais de 140 metros de diâmetro. 'Potencialmente perigoso' é rótulo de vigilância, não previsão: nenhum PHA conhecido está em rota de colisão nos próximos cem anos.",
    },
    aliases: ["asteroide potencialmente perigoso"],
    related: ["neo", "escala-de-torino", "magnitude-absoluta"],
    modules: ["asteroids", "cneos"],
    sources: [
      {
        label: "NASA CNEOS — NEO Groups",
        url: "https://cneos.jpl.nasa.gov/about/neo_groups.html",
      },
    ],
  },
  {
    slug: "escala-de-torino",
    term: { pt: "Escala de Torino", en: "Torino Scale" },
    short: {
      pt: "Escala de 0 a 10 que comunica ao público o risco de impacto de um objeto.",
    },
    long: {
      pt: "Combina probabilidade de impacto e energia liberada em um único número com código de cores. Zero (branco) significa risco desprezível e cobre praticamente tudo que já foi catalogado; de 8 a 10 (vermelho) são colisões certas com dano crescente. Foi desenhada justamente para evitar manchetes alarmistas: valores costumam cair para zero conforme novas observações refinam a órbita, como aconteceu com Apophis, que chegou a 4 em 2004 e hoje está descartado por pelo menos um século.",
    },
    aliases: ["torino"],
    related: ["escala-de-palermo", "neo", "pha"],
    modules: ["cneos"],
    sources: [
      {
        label: "NASA CNEOS — Torino Scale",
        url: "https://cneos.jpl.nasa.gov/sentry/torino_scale.html",
      },
    ],
  },
  {
    slug: "escala-de-palermo",
    term: { pt: "Escala de Palermo", en: "Palermo Scale" },
    short: {
      pt: "Escala logarítmica técnica que compara o risco de um objeto com o risco de fundo.",
    },
    long: {
      pt: "Enquanto a de Torino fala com o público, a de Palermo fala com especialistas. Ela compara a ameaça de um objeto específico com a probabilidade média de um impacto semelhante acontecer por acaso no mesmo intervalo de tempo. Valor 0 significa risco equivalente ao de fundo; abaixo de −2, o caso não merece atenção especial. Quase todos os objetos monitorados pelo sistema Sentry ficam bem abaixo disso.",
    },
    aliases: ["palermo"],
    related: ["escala-de-torino", "neo"],
    modules: ["cneos"],
    sources: [
      {
        label: "NASA CNEOS — Palermo Scale",
        url: "https://cneos.jpl.nasa.gov/sentry/palermo_scale.html",
      },
    ],
  },

  /* ─── Clima espacial ────────────────────────────────────────────── */
  {
    slug: "vento-solar",
    term: { pt: "Vento solar", en: "Solar wind" },
    short: {
      pt: "Fluxo contínuo de partículas carregadas que o Sol expele em todas as direções.",
    },
    long: {
      pt: "A coroa solar é quente demais para ficar presa pela gravidade do Sol, então escapa permanentemente, a velocidades entre 300 e 800 km/s. Esse vento molda a magnetosfera terrestre, empurra a cauda dos cometas para longe do Sol e, ao encontrar nosso campo magnético, alimenta as auroras. A bolha que ele cria em torno do sistema solar, a heliosfera, foi atravessada pelas sondas Voyager.",
    },
    related: ["cme", "aurora", "ponto-de-lagrange"],
    modules: ["donki"],
    bodies: ["sol", "terra"],
    sources: [
      {
        label: "NASA Science — Solar Wind",
        url: "https://science.nasa.gov/sun/solar-storms-and-flares/",
      },
    ],
  },
  {
    slug: "cme",
    term: { pt: "CME (Ejeção de Massa Coronal)", en: "Coronal Mass Ejection" },
    short: {
      pt: "Bolha gigante de plasma e campo magnético arremessada pelo Sol para o espaço.",
    },
    long: {
      pt: "Uma CME pode carregar bilhões de toneladas de matéria e cruzar a distância até a Terra em um a três dias. Quando atinge nosso campo magnético, provoca tempestades geomagnéticas: auroras em latitudes baixas, interferência em rádio e GPS, e no pior caso indução de correntes em redes elétricas. O evento de Carrington, em 1859, incendiou estações de telégrafo — e um equivalente hoje teria consequências bem maiores.",
    },
    aliases: ["ejeção de massa coronal", "coronal mass ejection"],
    related: ["vento-solar", "flare-solar", "aurora"],
    modules: ["donki"],
    bodies: ["sol", "terra"],
    sources: [
      {
        label: "NOAA SWPC — Coronal Mass Ejections",
        url: "https://www.swpc.noaa.gov/phenomena/coronal-mass-ejections",
      },
    ],
  },
  {
    slug: "flare-solar",
    term: { pt: "Erupção solar (flare)", en: "Solar flare" },
    short: {
      pt: "Explosão súbita de radiação no Sol, classificada por letras de A a X conforme a intensidade.",
    },
    long: {
      pt: "Diferente da CME, que é matéria, o flare é principalmente luz e raios X — e por isso chega em oito minutos, à velocidade da luz. A escala é logarítmica: cada letra (A, B, C, M, X) representa dez vezes mais energia que a anterior, e dentro da classe X a numeração continua aberta. Flares fortes ionizam a alta atmosfera e derrubam comunicações de rádio de alta frequência no lado diurno do planeta quase instantaneamente.",
    },
    aliases: ["flare", "erupção solar", "classe X"],
    related: ["cme", "mancha-solar", "vento-solar"],
    modules: ["donki"],
    bodies: ["sol"],
    sources: [
      {
        label: "NOAA SWPC — Solar Flares",
        url: "https://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts",
      },
    ],
  },
  {
    slug: "mancha-solar",
    term: { pt: "Mancha solar", en: "Sunspot" },
    short: {
      pt: "Região mais fria e escura da superfície do Sol, onde o campo magnético é intenso.",
    },
    long: {
      pt: "São escuras só por contraste: com cerca de 3.500 °C contra os 5.500 °C ao redor, brilhariam intensamente se isoladas. O campo magnético concentrado ali freia a convecção que traria calor de baixo. A quantidade de manchas sobe e desce em um ciclo de aproximadamente 11 anos, e é perto do máximo desse ciclo que flares e CMEs se tornam frequentes.",
    },
    related: ["flare-solar", "cme"],
    modules: ["donki"],
    bodies: ["sol"],
    sources: [
      {
        label: "NASA Science — Sunspots",
        url: "https://science.nasa.gov/sun/solar-storms-and-flares/",
      },
    ],
  },
  {
    slug: "aurora",
    term: { pt: "Aurora", en: "Aurora" },
    short: {
      pt: "Brilho no céu polar causado por partículas solares colidindo com gases da alta atmosfera.",
    },
    long: {
      pt: "O campo magnético da Terra canaliza as partículas do vento solar para as regiões polares, onde elas excitam átomos a mais de 100 km de altitude. A cor denuncia o gás e a altura: oxigênio produz o verde característico por volta de 100–250 km e um vermelho mais raro acima disso; nitrogênio dá tons de azul e roxo. Durante tempestades geomagnéticas fortes o oval auroral se expande e auroras chegam a ser vistas em latitudes bem menores que o normal.",
    },
    aliases: ["aurora boreal", "aurora austral"],
    related: ["vento-solar", "cme"],
    modules: ["donki", "gibs"],
    bodies: ["terra"],
    sources: [
      {
        label: "NOAA SWPC — Aurora",
        url: "https://www.swpc.noaa.gov/phenomena/aurora",
      },
    ],
  },

  /* ─── Corpos do sistema solar ───────────────────────────────────── */
  {
    slug: "asteroide",
    term: { pt: "Asteroide", en: "Asteroid" },
    short: {
      pt: "Corpo rochoso ou metálico que orbita o Sol, pequeno demais para ser um planeta.",
    },
    long: {
      pt: "A maioria vive no cinturão principal, entre Marte e Júpiter — não os destroços de um planeta destruído, como se imaginava, mas material que a gravidade de Júpiter impediu de se juntar. Variam de poucos metros a quase mil quilômetros, no caso de Ceres. Por terem mudado pouco desde a formação do sistema solar, funcionam como cápsulas do tempo químicas.",
    },
    related: ["neo", "pha", "cometa", "albedo"],
    modules: ["asteroids", "cneos"],
    bodies: ["marte", "jupiter"],
    sources: [
      {
        label: "NASA Science — Asteroids",
        url: "https://science.nasa.gov/solar-system/asteroids/",
      },
    ],
  },
  {
    slug: "cometa",
    term: { pt: "Cometa", en: "Comet" },
    short: {
      pt: "Corpo de gelo e poeira que desenvolve cauda ao se aproximar do Sol.",
    },
    long: {
      pt: "Longe do Sol é apenas um núcleo escuro de gelo e rocha, de poucos quilômetros. Ao se aproximar, o gelo sublima direto para gás e forma a coma, um envelope difuso, e duas caudas: uma de poeira, curvada ao longo da órbita, e outra de íons, empurrada pelo vento solar e sempre apontada para longe do Sol — independentemente da direção em que o cometa viaja.",
    },
    related: ["asteroide", "excentricidade", "vento-solar", "neo"],
    modules: ["asteroids", "apod"],
    sources: [
      {
        label: "NASA Science — Comets",
        url: "https://science.nasa.gov/solar-system/comets/",
      },
    ],
  },
  {
    slug: "meteoro",
    term: { pt: "Meteoro, meteoroide e meteorito", en: "Meteor, meteoroid, meteorite" },
    short: {
      pt: "Três nomes para o mesmo objeto em fases diferentes: no espaço, riscando o céu e no chão.",
    },
    long: {
      pt: "Meteoroide é o fragmento enquanto viaja pelo espaço. Meteoro é o risco luminoso que ele produz ao se desintegrar na atmosfera — a 'estrela cadente', que na verdade é o ar comprimido e incandescente à frente do objeto, não o objeto queimando. Meteorito é o que sobra e chega ao solo, o que só acontece com uma fração pequena.",
    },
    aliases: ["meteorito", "meteoroide", "estrela cadente"],
    related: ["asteroide", "cometa"],
    modules: ["asteroids"],
    bodies: ["terra"],
    sources: [
      {
        label: "NASA Science — Meteors & Meteorites",
        url: "https://science.nasa.gov/solar-system/meteors-meteorites/",
      },
    ],
  },
  {
    slug: "planeta-anao",
    term: { pt: "Planeta anão", en: "Dwarf planet" },
    short: {
      pt: "Corpo redondo que orbita o Sol mas não limpou a vizinhança de sua órbita.",
    },
    long: {
      pt: "A categoria nasceu da resolução da União Astronômica Internacional de 2006, a mesma que reclassificou Plutão. Um planeta pleno precisa cumprir três critérios: orbitar o Sol, ter gravidade suficiente para ser aproximadamente esférico e ter dominado gravitacionalmente sua órbita. Plutão cumpre os dois primeiros mas divide o Cinturão de Kuiper com muitos outros corpos. Ceres, Éris, Haumea e Makemake completam a lista reconhecida.",
    },
    related: ["asteroide", "unidade-astronomica"],
    modules: ["solar-system"],
    bodies: ["plutao"],
    sources: [
      {
        label: "IAU — Resolution B5 (2006)",
        url: "https://www.iau.org/static/resolutions/Resolution_GA26-5-6.pdf",
      },
    ],
  },
  {
    slug: "perielio",
    term: { pt: "Periélio e afélio", en: "Perihelion and aphelion" },
    short: {
      pt: "Pontos da órbita mais próximo e mais distante do Sol.",
    },
    long: {
      pt: "A Terra passa pelo periélio no início de janeiro, a cerca de 147 milhões de km, e pelo afélio no início de julho, a cerca de 152 milhões. A diferença é pequena demais para causar as estações — quem as causa é a inclinação do eixo do planeta, e não a distância. Prova disso: é verão no hemisfério sul justamente quando a Terra está mais perto do Sol.",
    },
    aliases: ["afélio", "periélio"],
    related: ["perigeu", "apogeu", "excentricidade", "unidade-astronomica"],
    modules: ["solar-system", "asteroids"],
    bodies: ["terra", "sol"],
    sources: [
      {
        label: "NASA Science — Orbits",
        url: "https://science.nasa.gov/resource/orbits-and-keplers-laws/",
      },
    ],
  },
  {
    slug: "ecliptica",
    term: { pt: "Eclíptica", en: "Ecliptic" },
    short: {
      pt: "Plano da órbita da Terra em torno do Sol, usado como referência para o sistema solar.",
    },
    long: {
      pt: "Visto da Terra, é a linha que o Sol percorre no céu ao longo do ano — e por onde também caminham a Lua e os planetas, já que suas órbitas ficam quase no mesmo plano. As constelações atravessadas por essa faixa são as do zodíaco. O nome vem dos eclipses: eles só acontecem quando a Lua cruza esse plano no momento certo.",
    },
    related: ["raan", "inclinacao"],
    modules: ["solar-system"],
    bodies: ["terra", "sol"],
    sources: [
      {
        label: "NASA Science — The Ecliptic",
        url: "https://science.nasa.gov/solar-system/",
      },
    ],
  },

  /* ─── Gravitação extrema ────────────────────────────────────────── */
  {
    slug: "buraco-negro",
    term: { pt: "Buraco negro", en: "Black hole" },
    short: {
      pt: "Região onde a gravidade é tão intensa que nem a luz consegue escapar.",
    },
    long: {
      pt: "Forma-se quando massa suficiente se concentra num volume pequeno demais — tipicamente no colapso de uma estrela muito maior que o Sol. Não é um 'aspirador cósmico': a gravidade a distância é a mesma de qualquer massa equivalente, e se o Sol virasse um buraco negro de mesma massa, as órbitas dos planetas não mudariam. Em 2019 o Event Horizon Telescope produziu a primeira imagem da sombra de um deles, no centro da galáxia M87.",
    },
    related: ["horizonte-de-eventos"],
    modules: ["singularity"],
    sources: [
      {
        label: "NASA Science — Black Holes",
        url: "https://science.nasa.gov/universe/black-holes/",
      },
    ],
  },
  {
    slug: "horizonte-de-eventos",
    term: { pt: "Horizonte de eventos", en: "Event horizon" },
    short: {
      pt: "Fronteira de um buraco negro além da qual nada mais pode voltar.",
    },
    long: {
      pt: "Não é uma superfície física, e sim um limite geométrico: o raio a partir do qual a velocidade de escape supera a da luz. Para um buraco negro sem rotação esse raio é proporcional à massa — o Sol precisaria ser comprimido a cerca de 3 km para ter um. Visto de fora, um objeto caindo parece congelar cada vez mais devagar no horizonte, avermelhado, sem nunca ser visto atravessá-lo.",
    },
    aliases: ["raio de Schwarzschild"],
    related: ["buraco-negro"],
    modules: ["singularity"],
    sources: [
      {
        label: "NASA Science — Anatomy of a Black Hole",
        url: "https://science.nasa.gov/universe/black-holes/anatomy/",
      },
    ],
  },

  /* ─── Marte ─────────────────────────────────────────────────────── */
  {
    slug: "sol-marciano",
    term: { pt: "Sol (dia marciano)", en: "Sol (Martian day)" },
    short: {
      pt: "Duração de um dia em Marte: 24 horas, 39 minutos e 35 segundos.",
    },
    long: {
      pt: "Como o sol marciano é só 39 minutos mais longo que o dia terrestre, equipes de missão que operam em horário de Marte vão dormindo cada vez mais tarde — o turno desliza cerca de 40 minutos por dia e dá a volta completa no relógio a cada cinco semanas. Os registros das sondas são numerados por sol desde o pouso, e não por data terrestre: o sol 1 é sempre o dia da chegada.",
    },
    aliases: ["sol marciano", "dia marciano"],
    related: ["atmosfera-marciana", "estacoes-marcianas"],
    modules: ["mars"],
    bodies: ["marte"],
    sources: [
      {
        label: "NASA Mars — Mars Facts",
        url: "https://science.nasa.gov/mars/facts/",
      },
    ],
  },
  {
    slug: "atmosfera-marciana",
    term: { pt: "Atmosfera de Marte", en: "Martian atmosphere" },
    short: {
      pt: "Envelope de gás cem vezes mais rarefeito que o da Terra, composto sobretudo de dióxido de carbono.",
    },
    long: {
      pt: "A pressão na superfície fica em torno de 610 pascals — menos de 1% dos cerca de 101.300 Pa ao nível do mar na Terra, e abaixo do limite em que a água líquida ferve à temperatura ambiente. A composição é de aproximadamente 95% de gás carbônico, com traços de nitrogênio e argônio. Por ser tão rarefeita, essa atmosfera retém pouquíssimo calor: a mesma tarde marciana pode marcar temperaturas amenas ao meio-dia e despencar dezenas de graus negativos à noite.",
    },
    related: ["sol-marciano", "tempestade-de-poeira", "estacoes-marcianas"],
    modules: ["mars"],
    bodies: ["marte", "terra"],
    sources: [
      {
        label: "NASA Mars — Mars Facts",
        url: "https://science.nasa.gov/mars/facts/",
      },
    ],
  },
  {
    slug: "tempestade-de-poeira",
    term: { pt: "Tempestade de poeira marciana", en: "Martian dust storm" },
    short: {
      pt: "Fenômeno que pode cobrir Marte inteiro de poeira e bloquear a luz solar por semanas.",
    },
    long: {
      pt: "Tempestades locais são comuns, mas de tempos em tempos elas se fundem e envolvem o planeta todo. A de 2018 escureceu tanto o céu que o rover Opportunity, movido a energia solar, ficou sem carga e nunca mais respondeu. Apesar da força aparente, o ar rarefeito significa que ventos de 100 km/h em Marte empurram com menos força que uma brisa na Terra — o risco está na poeira que se deposita nos painéis, não no impacto do vento.",
    },
    aliases: ["tempestade de areia"],
    related: ["atmosfera-marciana", "sol-marciano"],
    modules: ["mars"],
    bodies: ["marte"],
    sources: [
      {
        label: "NASA Science — Mars Dust Storms",
        url: "https://science.nasa.gov/mars/",
      },
    ],
  },
  {
    slug: "estacoes-marcianas",
    term: { pt: "Estações de Marte", en: "Martian seasons" },
    short: {
      pt: "Ciclo sazonal quase o dobro do terrestre e visivelmente desigual entre os hemisférios.",
    },
    long: {
      pt: "Marte tem inclinação axial de cerca de 25°, muito parecida com os 23,4° da Terra, então também tem estações. A diferença está em dois pontos: o ano marciano dura quase dois anos terrestres, e a órbita é bem mais excêntrica. Como resultado, o planeta está bem mais perto do Sol durante o verão do hemisfério sul, o que torna essa estação mais curta e intensa — e é justamente quando as grandes tempestades de poeira costumam começar.",
    },
    related: ["atmosfera-marciana", "excentricidade", "perielio", "sol-marciano"],
    modules: ["mars"],
    bodies: ["marte", "terra"],
    sources: [
      {
        label: "NASA Mars — Mars Facts",
        url: "https://science.nasa.gov/mars/facts/",
      },
    ],
  },

  /* ─── Observação da Terra e cartografia ─────────────────────────── */
  {
    slug: "orbita-heliossincrona",
    term: { pt: "Órbita heliossíncrona (SSO)", en: "Sun-synchronous orbit" },
    short: {
      pt: "Órbita polar que faz o satélite cruzar o equador sempre na mesma hora solar local.",
    },
    long: {
      pt: "É o truque mais elegante da observação da Terra. O achatamento do planeta faz o plano de qualquer órbita derivar aos poucos; escolhendo altitude e inclinação certas — tipicamente algo em torno de 700 km e 98°, portanto levemente retrógrada —, essa deriva fica igual ao avanço da Terra em torno do Sol, cerca de um grau por dia. O satélite passa então sobre cada ponto sempre no mesmo horário local, com a mesma iluminação, e imagens de datas diferentes ficam diretamente comparáveis.",
    },
    aliases: ["SSO", "heliossíncrona", "sol-síncrona"],
    related: ["raan", "inclinacao", "orbita-baixa", "sensoriamento-remoto"],
    modules: ["eonet", "gibs", "ssc"],
    bodies: ["terra"],
    sources: [
      {
        label: "ESA — Types of orbits",
        url: "https://www.esa.int/Enabling_Support/Space_Transportation/Types_of_orbits",
      },
    ],
  },
  {
    slug: "sensoriamento-remoto",
    term: { pt: "Sensoriamento remoto", en: "Remote sensing" },
    short: {
      pt: "Medir características de um objeto a distância, pela radiação que ele reflete ou emite.",
    },
    long: {
      pt: "Todo satélite de observação faz isso: em vez de tocar o que estuda, lê a luz e o calor que chegam até ele. Cada faixa do espectro conta algo diferente — o visível mostra o que o olho veria, o infravermelho próximo denuncia vegetação saudável, o infravermelho térmico revela focos de incêndio, e micro-ondas atravessam nuvens. Combinar faixas é o que transforma uma imagem em medição.",
    },
    related: [
      "orbita-heliossincrona",
      "resolucao-espacial",
      "albedo",
      "anomalia-termica",
    ],
    modules: ["eonet", "gibs", "trek", "epic"],
    bodies: ["terra"],
    sources: [
      {
        label: "NASA Earthdata — What is Remote Sensing?",
        url: "https://www.earthdata.nasa.gov/learn/backgrounders/remote-sensing",
      },
    ],
  },
  {
    slug: "anomalia-termica",
    term: { pt: "Anomalia térmica", en: "Thermal anomaly" },
    short: {
      pt: "Ponto que aparece muito mais quente que a vizinhança nas imagens de infravermelho.",
    },
    long: {
      pt: "É assim que satélites detectam incêndios e erupções sem enxergar chama alguma. Sensores comparam a temperatura de cada pixel com a dos vizinhos em faixas do infravermelho médio; um foco de calor se destaca mesmo quando é bem menor que o pixel, porque a energia emitida cresce com a quarta potência da temperatura. Nem toda anomalia é fogo — chaminés industriais e queima de gás também acendem no mapa.",
    },
    related: ["sensoriamento-remoto", "resolucao-espacial"],
    modules: ["eonet"],
    bodies: ["terra"],
    sources: [
      {
        label: "NASA FIRMS — Fire Information",
        url: "https://www.earthdata.nasa.gov/data/tools/firms",
      },
    ],
  },
  {
    slug: "resolucao-espacial",
    term: { pt: "Resolução espacial", en: "Spatial resolution" },
    short: {
      pt: "Tamanho no terreno que cada pixel de uma imagem de satélite representa.",
    },
    long: {
      pt: "Uma imagem de 30 metros por pixel significa que cada quadradinho resume uma área de 30 por 30 metros — nela, um caminhão simplesmente não existe como objeto distinto. Resolução mais fina não é automaticamente melhor: sensores de alta resolução cobrem faixas estreitas e revisitam o mesmo ponto raramente, enquanto os de resolução grosseira varrem o planeta inteiro todo dia. Monitorar incêndios globais pede o segundo tipo, não o primeiro.",
    },
    aliases: ["GSD", "metros por pixel"],
    related: ["sensoriamento-remoto", "projecao-cartografica", "anomalia-termica"],
    modules: ["gibs", "trek", "epic"],
    sources: [
      {
        label: "NASA Earthdata — Remote Sensing Resolutions",
        url: "https://www.earthdata.nasa.gov/learn/backgrounders/remote-sensing",
      },
    ],
  },
  {
    slug: "projecao-cartografica",
    term: { pt: "Projeção cartográfica", en: "Map projection" },
    short: {
      pt: "Método de achatar uma superfície esférica num plano — sempre à custa de alguma distorção.",
    },
    long: {
      pt: "Nenhuma projeção preserva ao mesmo tempo áreas, ângulos e distâncias; escolher uma é escolher o que sacrificar. A Mercator, usada na maioria dos mapas deslizantes da web, preserva ângulos e por isso é boa para navegação, mas infla as regiões polares de forma absurda — é dela que vem a impressão de que a Groenlândia rivaliza com a África, quando na verdade cabe nela catorze vezes. Mapas planetários costumam preferir a equirretangular, mais simples de fatiar em ladrilhos.",
    },
    aliases: ["mercator", "equirretangular"],
    related: ["cartografia-planetaria", "resolucao-espacial"],
    modules: ["trek", "gibs"],
    bodies: ["terra"],
    sources: [
      {
        label: "USGS — Map Projections",
        url: "https://www.usgs.gov/programs/national-geospatial-program/map-projections",
      },
    ],
  },
  {
    slug: "cartografia-planetaria",
    term: { pt: "Cartografia planetária", en: "Planetary cartography" },
    short: {
      pt: "Disciplina que mapeia outros mundos e dá nome oficial aos seus acidentes geográficos.",
    },
    long: {
      pt: "Mapear um corpo sem oceanos nem meridiano histórico exige convenções novas: em Marte, a longitude zero passa por uma cratera de 500 metros escolhida justamente por ser pequena e bem definida. A União Astronômica Internacional mantém o registro oficial de nomes, com regras temáticas por corpo — crateras de Mercúrio homenageiam artistas, as de Vênus levam nomes de mulheres. Sem esse cadastro, duas equipes descreveriam o mesmo vale com nomes diferentes.",
    },
    related: ["projecao-cartografica", "sensoriamento-remoto", "resolucao-espacial"],
    modules: ["trek"],
    bodies: ["marte", "mercurio", "venus"],
    sources: [
      {
        label: "IAU — Gazetteer of Planetary Nomenclature",
        url: "https://planetarynames.wr.usgs.gov/",
      },
    ],
  },
  {
    slug: "angulo-de-fase",
    term: { pt: "Ângulo de fase", en: "Phase angle" },
    short: {
      pt: "Ângulo formado entre o Sol, o objeto observado e quem observa.",
    },
    long: {
      pt: "É ele que decide quanto de um corpo aparece iluminado. Com ângulo próximo de zero, o observador está praticamente entre o Sol e o objeto, e vê a face cheia — é exatamente a posição do satélite DSCOVR, parado no ponto de Lagrange L1, que por isso fotografa a Terra sempre inteiramente iluminada. Ângulos grandes produzem crescentes finos, e é por isso que Vênus, mesmo muito mais perto de nós em certas épocas, nem sempre é mais brilhante.",
    },
    related: ["ponto-de-lagrange", "albedo", "magnitude-aparente"],
    modules: ["epic", "solar-system", "apod"],
    bodies: ["terra", "venus", "sol"],
    sources: [
      {
        label: "NASA EPIC — DSCOVR",
        url: "https://epic.gsfc.nasa.gov/about/epic",
      },
    ],
  },
];

/** Índice por slug, montado uma vez no carregamento do módulo. */
const BY_SLUG = new Map(GLOSSARY.map((t) => [t.slug, t]));

export const getTerm = (slug: string): GlossaryTerm | undefined => BY_SLUG.get(slug);

/** Todos os slugs — usado por `generateStaticParams` e pelo sitemap. */
export const GLOSSARY_SLUGS = GLOSSARY.map((t) => t.slug);

/**
 * Verbetes agrupados pela letra inicial, em ordem alfabética pt-BR
 * (`localeCompare` cuida de acentos, para que "Órbita" caia em O).
 */
export function glossaryByLetter(): { letter: string; terms: GlossaryTerm[] }[] {
  const groups = new Map<string, GlossaryTerm[]>();

  for (const term of [...GLOSSARY].sort((a, b) =>
    a.term.pt.localeCompare(b.term.pt, "pt-BR"),
  )) {
    // NFD separa o acento da letra; o range remove os diacríticos combinantes,
    // para que "Órbita" agrupe sob O em vez de criar uma letra "Ó" própria.
    const letter = term.term.pt
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .charAt(0)
      .toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), term]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
    .map(([letter, terms]) => ({ letter, terms }));
}

/** Verbetes que citam um módulo — alimenta a seção "Entenda" das páginas. */
export const termsForModule = (moduleId: string): GlossaryTerm[] =>
  GLOSSARY.filter((t) => t.modules?.includes(moduleId));
