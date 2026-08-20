# Implementation Plan: Redesign Editorial de Natureza e Litoral

**Branch**: `005-editorial-nature-redesign` | **Date**: 2026-08-19 | **Spec**:
[spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-editorial-nature-redesign/spec.md`

## Summary

O site hoje comunica visualmente um produto de software genérico (hero só-texto, grade uniforme de
cards tipo "features", zero textura/movimento/variação editorial) em vez de uma pousada de
natureza/litoral em um casarão colonial histórico. Este redesign é **puramente de apresentação**:
reaproveita a arquitetura, os dados e as funcionalidades já implementadas (i18n em 3 idiomas,
modal de fotos, carrossel de relatos, mapa/Street View — features `001`–`004`) e altera apenas a
camada visual em 4 frentes, na ordem de prioridade da spec: (1) hero com fotografia real já
aprovada como elemento LCP; (2) seção de Quartos com variação editorial dirigida por dados
(`visualEmphasis`) e ícones de comodidade; (3) tipografia refinada (`Fraunces` + `Inter`), textura/
divisores orgânicos e um efeito único de fade-ao-rolar (`IntersectionObserver`, respeitando
`prefers-reduced-motion`); (4) tratamento tipográfico editorial nos depoimentos. Nenhuma
dependência de runtime nova é adicionada; nenhuma rota, backend ou comportamento de funcionalidade
existente muda.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode já configurado), React 19.2.4, Next.js 16.2.11
(App Router, Turbopack)

**Primary Dependencies**: Apenas as já existentes no projeto (`next`, `react`, `react-dom`).
Nenhuma dependência de runtime nova — ícones de comodidade são SVGs locais e o efeito de rolagem
usa `IntersectionObserver` nativo, não uma biblioteca de motion (`research.md` Decisions 3 e 4).
`next/font/google` (já em uso) troca `Playfair Display` por `Fraunces`, mantendo `Inter`.

**Storage**: N/A — dados estáticos tipados em `src/data/pousada-content.ts`, mesmo padrão já
estabelecido; nenhuma mudança de arquitetura de dados além de campos adicionados a tipos já
existentes (ver `data-model.md`).

**Testing**: Vitest + React Testing Library + `jest-axe` (componentes/acessibilidade), Playwright +
`@axe-core/playwright` (e2e/acessibilidade real de navegador, projetos chromium + mobile-chrome),
Lighthouse CLI (`devtools` + `simulate`, mesmo método das features 001–004) para Core Web Vitals.

**Target Platform**: Export estático (`output: "export"`) servido pelo GitHub Pages, sem servidor
em produção; navegadores evergreen; mobile-first a partir de 320px.

**Project Type**: Aplicação web única (Next.js App Router), sem separação frontend/backend — Opção
1 (projeto único) do template de plano, já em uso pelas features anteriores.

**Performance Goals**: Preservar ou melhorar a linha de base já registrada em
`specs/004-translation-google-maps/validation/performance.md` (LCP 3.3–3.8s, CLS 0 — orçamento
formal da constituição continua LCP ≤ 2.5s/CLS ≤ 0.1, com o LCP acima do orçamento já sendo uma
pendência pré-existente re-flagueada, não introduzida por esta feature). Atenção especial: o hero
passa a ter uma imagem como provável elemento LCP (hoje é o `<h1>` de texto) — a imagem escolhida
MUST ser pré-otimizada (tamanho/compressão) antes do commit, já que este projeto não tem otimização
de imagem em tempo de requisição (`research.md` Decision 1).

**Constraints**: Sem paralaxe nem sequências de revelação elaboradas (FR-012, apenas fade);
`prefers-reduced-motion` obrigatório; zero novas violações de acessibilidade críticas/sérias
(SC-003); os 3 idiomas e os 4 breakpoints já validados (320/375/768/1280px) continuam sem quebra de
layout (SC-005); nenhuma regressão em funcionalidade já existente (seletor de idioma, lightbox,
carrossel de relatos, mapa/Street View — FR-009).

**Scale/Scope**: Uma única landing page; ~8 seções afetadas visualmente (Hero, Rooms, Wedding,
Events, Testimonials, Location, Footer/textura global), 7 quartos, 3 depoimentos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — Nenhuma mudança de fronteira: o hook novo
      (`useScrollReveal`) é puramente de apresentação (UI), os ícones são componentes de
      apresentação, e a extensão de `Room`/`PousadaContent` continua em `src/domain/content.ts`.
- [x] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — Nenhum estado global novo (o
      `useScrollReveal` é local por instância de seção); zero dependências de runtime novas,
      alternativas (biblioteca de ícones, GSAP) avaliadas e rejeitadas em `research.md` Decisions
      3–4 com justificativa de simplicidade.
- [x] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — CTA de WhatsApp permanece com a mesma proeminência
      (Public Experience Requirements da spec); responsividade e WCAG 2.2 AA cobertos por FR-007/
      FR-008/SC-005; estratégia de imagem do hero coberta em `research.md` Decision 1.
- [x] A performance budget and Core Web Vitals targets are measurable for this feature. —
      Ver Performance Goals acima: LCP/CLS mensurados contra a linha de base de `004`, mesmo
      método Lighthouse.
- [x] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — `RoomAmenity`/`visualEmphasis`/`hero.image`
      continuam dados estáticos tipados, sem backend; o Edge Case de seções sem foto aprovada
      (Eventos) já é tratado como um estado vazio coerente (ver spec, Public Experience Requirements
      "Data states").
- [x] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — Planejados explicitamente em
      `quickstart.md` "Required validation before delivery" (itens 1, 3–6), replicando o padrão já
      usado nas features 001–004.

**Resultado**: Nenhuma violação — nada a registrar em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/005-editorial-nature-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created by this command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                       # Troca Playfair_Display → Fraunces (next/font/google)
│   └── globals.css                      # Novos tokens de textura/grão; ajustes de paleta
├── domain/
│   └── content.ts                       # + RoomAmenity/AmenityKey, + Room.visualEmphasis,
│                                         #   + PousadaContent.hero (ver data-model.md)
├── data/
│   └── pousada-content.ts               # amenities reescritas p/ RoomAmenity[]; visualEmphasis
│                                         #   nos quartos de destaque; hero.image apontando para
│                                         #   a foto já aprovada escolhida
├── hooks/
│   └── useScrollReveal.ts               # Novo — IntersectionObserver + prefers-reduced-motion
├── components/
│   ├── ui/
│   │   └── icons/                       # Novo — ~8 SVGs locais de comodidade (AmenityIcon.tsx
│   │                                     #   + mapa AmenityKey → componente)
│   └── sections/
│       ├── HeroSection.tsx(.module.css)       # Imagem de fundo/destaque + overlay de texto
│       ├── RoomsSection.tsx(.module.css)      # Grade editorial (visualEmphasis) + ícones
│       ├── WeddingSection.tsx(.module.css)    # Textura/divisor orgânico + useScrollReveal
│       ├── EventsSection.tsx(.module.css)     # Idem + estado vazio coerente com o novo estilo
│       ├── TestimonialsSection.tsx(.module.css) # Aspas/tipografia de destaque
│       └── LocationSection.tsx(.module.css)   # Textura/divisor consistente (sem mudar mapa)
└── i18n/                                # Sem mudança de forma (nenhuma nova chave de UI textual
                                          #   é necessária; ícones não têm texto próprio)

tests/
├── unit/                                # + useScrollReveal.test.ts
├── integration/                         # RoomsSection/HeroSection/TestimonialsSection ajustados
│                                         #   para os novos campos de dados (RoomAmenity, hero)
└── e2e/                                 # visual/a11y smoke das seções redesenhadas nos 4
                                          #   breakpoints × 3 idiomas + verificação de
                                          #   prefers-reduced-motion
```

**Structure Decision**: Projeto único Next.js já estabelecido (sem separação frontend/backend,
Opção 1 do template) — este redesign não adiciona nenhuma nova área de código de alto nível, só
estende os módulos de domínio/dados/componentes/hooks já existentes nos caminhos acima.

## Complexity Tracking

*Sem violações do Constitution Check — seção não aplicável.*
