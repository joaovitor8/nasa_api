# Universo

> Sistema operacional do cosmos — uma console unificada para telemetria, defesa planetária, cartografia e arquivos espaciais, conectando 20+ APIs públicas em uma única jornada interativa.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Visão geral

Universo é uma plataforma imersiva que reúne em uma única interface os principais feeds e arquivos de exploração espacial — da poeira ancestral de Marte aos exoplanetas mais distantes confirmados. Cada módulo é uma janela calibrada para um instrumento real, com estética de console operacional (HUD, telemetria ao vivo, scanlines).

- **20 módulos** ativos, agrupados em 4 categorias: Mídia, Defesa, Cartografia, Ciência
- **10 corpos celestes** catalogados (Sol + 8 planetas + Plutão) com dossiê físico via Wikipedia
- **PWA** instalável com service worker, offline page e manifest
- **i18n PT/EN** com persistência em `localStorage`
- **49 rotas** prerendered estaticamente (ISR onde faz sentido)

## Stack

| Camada              | Tecnologia                                   |
| ------------------- | -------------------------------------------- |
| Framework           | Next.js 16 (App Router, RSC, Route Handlers) |
| UI                  | React 19, Tailwind CSS v4, Framer Motion 12  |
| 3D                  | Three.js, React Three Fiber, Drei            |
| Estado / Cache      | TanStack Query v5, Axios                     |
| Tipagem             | TypeScript 5 (strict)                        |
| Ícones / Tipografia | Lucide, Inter, Cinzel, JetBrains Mono        |
| PWA                 | Service Worker custom, Web App Manifest      |

## Arquitetura

```
app/
├── src/
│   ├── app/                     # App Router (rotas, layouts, route handlers)
│   │   ├── (pages)/             # Páginas dos módulos (group route)
│   │   ├── api/                 # BFF — 20 route handlers proxiando APIs externas
│   │   ├── error.tsx            # Error boundary global
│   │   ├── not-found.tsx        # 404 customizado
│   │   ├── sitemap.ts / robots.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── hud/                 # Primitives — ModuleScope, HudPanel, TelemetrySpinner...
│   │   ├── scenes/              # Cenas R3F (BlackHole, ExoplanetOrbit)
│   │   ├── Header.tsx / Footer.tsx
│   │   └── Stars.tsx            # Canvas de partículas no fundo
│   └── lib/
│       ├── modules.ts           # Catálogo dos 20 módulos
│       ├── solar-system.ts      # Catálogo dos 10 corpos
│       ├── i18n.ts              # Context + dicionário PT/EN
│       ├── config.ts            # SITE_URL, SITE_NAME centralizados
│       └── types/               # Contratos NASA / SpaceX / News
├── public/                      # Manifest, ícones SVG, sw.js
├── next.config.ts               # Headers de segurança + remotePatterns
└── package.json
```

### Decisões-chave

- **BFF pattern** — todas as APIs externas passam por route handlers (`/api/*`) para esconder chaves, normalizar tipos e habilitar ISR via `export const revalidate`
- **Module theming** — cada módulo declara seu `accent` em `oklch()`; o componente `<ModuleScope>` injeta CSS vars (`--module-accent`, `--module-accent-soft`, `--module-glow`) no escopo da página
- **i18n leve** — Context + dicionário tipado, sem dependências externas. Preferência salva em `localStorage`
- **PWA-first** — service worker custom com cache de tiles e thumbnails, install prompt nativo, página offline
- **Headers de segurança** — `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` aplicados globalmente

## Módulos disponíveis

### Mídia & Arquivos

- **APOD** — A imagem astronômica do dia
- **Library** — Busca multimídia no acervo histórico da NASA
- **EPIC** — Time-lapse da Terra do ponto Lagrange L1
- **Mars** — Telemetria de superfície do lander InSight
- **News** — Feed agregado do setor (Spaceflight News)

### Defesa & Monitoramento

- **NEO Radar** — Asteroides próximos da Terra (NeoWs)
- **Sentry** — Matriz de risco de impacto (CNEOS)
- **DONKI** — Erupções e tempestades solares
- **EONET** — Eventos geológicos e climáticos severos

### Sondas & Cartografia

- **SSC** — Tráfego orbital e cruzamento de frota
- **TLE** — Decodificador de elementos de duas linhas
- **SpaceX** — Frota Falcon/Starship, próximos lançamentos
- **GIBS** — Sobreposição global de dados climáticos
- **Trek WMTS** — Slippy map da Lua, Marte e Vesta

### Ciência & Engenharia

- **Exoplanets** — Catálogo profundo de mundos confirmados (Caltech)
- **TechPort** — Blueprints de P&D da agência (TRL)
- **TechTransfer** — Patentes, código aberto e spinoffs
- **OSDR** — Bioinformática e vida em microgravidade
- **Singularity** — Simulador volumétrico de buraco negro (R3F)
- **Sistema Solar** — Mapa orbital de 10 corpos com dossiê físico

## Fontes de dados

NASA Open APIs · NASA EONET · NASA GIBS · NASA InSight · NASA OSDR · NASA Trek (WMTS) · NASA Image and Video Library · NASA TechPort · NASA TechTransfer · DONKI Space Weather · NeoWs · CNEOS Sentry · DSCOVR EPIC · IPAC Caltech Exoplanet Archive · NOAA Space Weather Prediction Center · ESA EONET · SpaceX REST · CelesTrak (TLE) · Spaceflight News API · Wikipedia REST

## Performance

- Build de produção: **49 rotas estáticas + 10 ISR + route handlers**
- Service worker com cache inteligente para tiles e thumbnails
- Imagens via `next/image` (incluindo CDNs externas em `remotePatterns`)
- TanStack Query com `staleTime` 5min e `refetchOnWindowFocus: false`
- Defaults: bundle inicial enxuto, fontes self-hosted via `next/font`

## Roadmap

Acompanhe o desenvolvimento em [/sobre](http://localhost:3000/sobre) (timeline de Ondas 1–9). Próximas iterações cobrem expansão de cenas 3D, novas fontes de dados e refinamento de acessibilidade.

## Licença

Projeto educacional sem fins lucrativos. Todos os dados pertencem às respectivas agências e fornecedores. Veja [`LICENSE`](LICENSE).

## Autor

Construído por **João Vitor** — uma carta de amor ao cosmos, escrita em TypeScript.
