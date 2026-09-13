# Universo

> Portal de astronomia para entusiastas. Conceitos explicados do zero, glossário com fontes verificáveis e telemetria ao vivo de 20 instrumentos reais — para quem entra sem saber o que é um periélio e sai sabendo.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## O que é

A maioria dos painéis de dados espaciais mostra números sem explicar nenhum. Este projeto faz o contrário: cada módulo exibe dados reais **e** ensina o que eles significam.

Um exemplo concreto. A página de TLE mostra os elementos orbitais de qualquer satélite — inclinação, RAAN, excentricidade, anomalia média. Cada um desses termos é um link para sua definição, e a página termina explicando, em prosa, o que é um conjunto de elementos de duas linhas e por que ele perde precisão com o tempo.

### Três camadas de conteúdo

| Camada        | O que é                                                 | Onde            |
| ------------- | ------------------------------------------------------- | --------------- |
| **Trilhas**   | Artigos longos que ensinam um conceito do zero          | `/aprender`     |
| **Glossário** | 67 verbetes de uma frase, com explicação longa e fonte  | `/glossario`    |
| **Módulos**   | 20 painéis de dados ao vivo, cada um com seção didática | `/tle`, `/mars` |

As três se ligam entre si automaticamente: um artigo aponta para o módulo onde o conceito aparece ao vivo, o módulo aponta de volta para o artigo, e ambos linkam os verbetes citados. Nenhuma dessas listas é escrita à mão — todas derivam dos catálogos, e testes quebram o CI se algum slug apontar para o vazio.

## Stack

| Camada    | Tecnologia                                            |
| --------- | ----------------------------------------------------- |
| Framework | Next.js 16 (App Router, RSC, Route Handlers)          |
| UI        | React 19, Tailwind CSS v4, Framer Motion              |
| Conteúdo  | MDX para artigos, catálogos TS tipados para glossário |
| 3D        | Three.js, React Three Fiber, Drei                     |
| Dados     | TanStack Query v5, Axios                              |
| Testes    | Vitest (unitários), Playwright (e2e + axe-core)       |

## Arquitetura

```
src/
├── app/
│   ├── (pages)/            # 20 módulos de dados ao vivo
│   ├── aprender/           # Trilhas e artigos
│   ├── glossario/          # Índice A–Z e página por verbete
│   ├── api/                # BFF — route handlers com ISR
│   └── opengraph-image.tsx # Imagens de compartilhamento geradas
├── content/aprender/       # Artigos em MDX
├── components/
│   ├── content/            # Termo, EntendaSection
│   └── hud/                # Primitives visuais
└── lib/
    ├── content/            # glossary.ts, concepts.ts, types.ts, og.tsx
    ├── modules.ts          # Catálogo dos módulos
    ├── solar-system.ts     # Catálogo dos corpos celestes
    └── upstream.ts         # Helper compartilhado das rotas BFF
```

### Decisões que valem explicar

**Casca server + ilha client.** Cada página de módulo é um server component que renderiza metadados, JSON-LD e a prosa didática; a interatividade e a busca de dados ficam num componente cliente separado. O motivo é direto: quem procura "o que é anomalia média" no Google precisa encontrar texto, não uma casca vazia. Antes dessa mudança, as páginas serviam cerca de 25 palavras cada; hoje servem entre 264 e 733.

**Definição no HTML, não injetada por JS.** O componente `<Termo>` mantém a definição no DOM o tempo todo, revelada por CSS no hover ou no foco. Isso atende buscador, leitor de tela e navegação por teclado de uma vez só — e um teste falha se alguém trocar isso por carregamento sob demanda.

**Catálogos tipados como fonte de verdade.** Glossário, artigos, módulos e corpos celestes são arrays TypeScript. Navegação, sitemap, metadados e links cruzados derivam deles. Um id errado quebra o CI em vez de virar link morto em produção.

**BFF com ISR.** Toda API externa passa por um route handler em `/api/*`, que esconde a chave, normaliza o formato de erro e define `revalidate` por rota. O helper compartilhado aplica timeout de 10s e mapeia falhas para status HTTP corretos.

## Como rodar

Requisitos: Node 22 (ver `.nvmrc`).

```bash
npm ci
cp exemplo.env .env.local   # preencha KEY_NASA e NEXT_PUBLIC_SITE_URL
npm run dev
```

A chave da NASA sai de [api.nasa.gov](https://api.nasa.gov/) em um minuto. Sem ela o site sobe normalmente — as páginas renderizam e o conteúdo didático funciona —, mas os painéis de dados ao vivo mostram erro.

### Scripts

| Comando             | O que faz                           |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento         |
| `npm run build`     | Build de produção                   |
| `npm test`          | Testes unitários (Vitest)           |
| `npm run test:e2e`  | Smoke e acessibilidade (Playwright) |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | TypeScript sem emitir               |
| `npm run format`    | Prettier                            |

## Testes

O CI roda formatação, lint, tipos, testes unitários, build e a suíte end-to-end a cada push.

Dois testes merecem destaque por serem os que mais pegam regressão:

- **Varredura do sitemap.** O e2e lê `/sitemap.xml` e visita toda rota anunciada, falhando se alguma responder 4xx ou acionar o error boundary. Como o sitemap é gerado a partir dos catálogos, qualquer conteúdo novo entra na varredura sozinho.
- **Integridade de conteúdo.** Os testes unitários percorrem glossário e artigos verificando que todo `related`, `prerequisites`, `modules`, `bodies` e `terms` resolve para algo que existe — e que nenhum artigo exige um pré-requisito de nível mais avançado que ele próprio.

A suíte de acessibilidade roda axe-core sobre um exemplar de cada tipo de layout e falha em violação séria ou crítica. Foi ela que detectou que o contraste do botão primário estava em 3,99:1, abaixo do mínimo de 4,5:1 da WCAG AA.

## Como adicionar conteúdo

**Um verbete:** acrescente um objeto em `src/lib/content/glossary.ts`. Os campos `modules` e `bodies` fazem o termo aparecer sozinho nas páginas correspondentes.

**Um artigo:** crie o `.mdx` em `src/content/aprender/`, adicione os metadados em `src/lib/content/concepts.ts` e registre o carregador em `ARTICLE_LOADERS`. Os testes avisam se você esquecer alguma das três partes.

Em ambos os casos, `sources` é obrigatório — conteúdo científico sem citação não entra.

## Estado do projeto

O conteúdo é **PT-first**. O modelo de dados já tem campo `en` opcional em cada verbete e artigo, mas a tradução ainda não foi escrita. O seletor de idioma no cabeçalho cobre a interface, não o conteúdo.

Roteamento por idioma (`/pt/`, `/en/`) está previsto, mas só faz sentido quando houver texto em inglês de verdade: URLs em inglês servindo prosa em português seriam tratadas como conteúdo raso pelos buscadores.

## Fontes de dados

NASA Open APIs · NASA EONET · NASA GIBS · NASA InSight · NASA OSDR · NASA Trek (WMTS) · NASA Image and Video Library · NASA TechPort · NASA TechTransfer · DONKI Space Weather · NeoWs · CNEOS Sentry · DSCOVR EPIC · IPAC Caltech Exoplanet Archive · NOAA Space Weather Prediction Center · SpaceX REST · CelesTrak (TLE) · Spaceflight News API · Wikipedia REST

## Licença

Projeto educacional sem fins lucrativos. Todos os dados pertencem às respectivas agências e fornecedores. Veja [`LICENSE`](LICENSE).

## Autor

Construído por **João Vitor** — uma carta de amor ao cosmos, escrita em TypeScript.
