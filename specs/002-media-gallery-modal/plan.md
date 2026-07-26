# Implementation Plan: Visualização de Fotos em Foco (Modal de Galeria)

**Branch**: `002-media-gallery-modal` | **Date**: 2026-07-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-media-gallery-modal/spec.md`

## Summary

Substituir a faixa de rolagem horizontal de fotos (usada hoje em Quartos, Casamentos e Eventos)
por uma foto de destaque clicável que abre uma visualização ampliada e em foco (modal/lightbox)
com todas as fotos do item clicado. A visualização permite navegar entre fotos (com navegação
circular nas extremidades, conforme clarificação da spec), mostra a posição atual, é totalmente
operável por teclado, identificada como janela modal para tecnologia assistiva, e pode ser fechada
por botão, clique fora ou Esc, sempre devolvendo o foco ao controle de origem. Reaproveita
integralmente as fotos, textos alternativos e o repositório de conteúdo já existentes da feature
`001-pousada-landing-page`; não introduz backend, dependência nova nem mudança nos canais de
contato.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js 22 LTS (mesmo ambiente da feature 001)

**Primary Dependencies**: Next.js (App Router), React, `next/image`; elemento HTML `<dialog>`
nativo para a visualização em foco (sem biblioteca de lightbox nova — ver `research.md`)

**Storage**: N/A — reutiliza os dados estáticos tipados já existentes em
`src/data/pousada-content.ts`; nenhuma persistência nova

**Testing**: Vitest + React Testing Library + `jest-axe` para o componente de visualização em
foco; Playwright para os fluxos de abrir/navegar/fechar e para o requisito de teclado (mesma stack
da feature 001)

**Target Platform**: Navegadores modernos em dispositivos móveis e desktop, mesmo alvo da feature
001

**Project Type**: Aplicação web frontend única (mesmo projeto Next.js da feature 001; nenhum
projeto novo)

**Performance Goals**: Nenhuma meta nova; preserva o orçamento já medido em
`specs/001-pousada-landing-page/validation/performance.md` (LCP ≤ 2,5 s, CLS ≤ 0,1). Abertura da
visualização deve ser percorrida sem navegação de página.

**Constraints**: WCAG 2.2 AA para a visualização em foco (foco contido, foco restaurado, Esc,
papel de modal); sem rolagem horizontal em telas pequenas; sem alteração nos canais de contato;
sem novas chamadas de rede além das imagens já referenciadas.

**Scale/Scope**: Um componente compartilhado de visualização em foco, consumido pelas três seções
com galeria já existentes (Quartos, Casamentos, Eventos); nenhuma entidade de domínio nova.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — Novo componente de visualização em foco fica em
      `src/components/sections/`, junto de `MediaGallery`, sem lógica de negócio própria.
- [x] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — Estado (aberto/fechado, índice da
      foto) é local ao componente; ver `research.md` para a rejeição documentada de contexto
      global e de biblioteca externa.
- [x] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — Especificados na spec (Public Experience and Quality
      Requirements) e detalhados em `contracts/media-gallery-lightbox.md`.
- [x] A performance budget and Core Web Vitals targets are measurable for this feature. —
      Reutiliza o orçamento já medido pela feature 001; critério de sucesso é "sem regressão"
      (SC-004), verificável reexecutando a mesma medição.
- [x] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — Nenhuma entidade nova; estados de vazio
      ("foto em breve") e falha de carregamento reaproveitados sem alteração de contrato.
- [x] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — Planejados nas tasks de
      validação (accessibility, performance, frontend QA), reexecutando a evidência já
      documentada na feature 001 com a visualização em foco incluída.

## Project Structure

### Documentation (this feature)

```text
specs/002-media-gallery-modal/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── media-gallery-lightbox.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── sections/
│       ├── MediaGallery.tsx           # Alterado: passa a exibir uma foto de destaque
│       │                               # clicável (+ indicação de quantidade) em vez da
│       │                               # faixa de rolagem horizontal
│       ├── MediaGallery.module.css    # Alterado: estilos da foto de destaque/indicador
│       ├── MediaGalleryLightbox.tsx   # Novo: visualização em foco (modal), compartilhada
│       │                               # por Quartos, Casamentos e Eventos
│       └── MediaGalleryLightbox.module.css  # Novo
├── components/sections/RoomsSection.tsx      # Inalterado na interface pública; consome
│                                               # MediaGallery normalmente
├── components/sections/WeddingSection.tsx    # Inalterado na interface pública
└── components/sections/EventsSection.tsx     # Inalterado na interface pública

tests/
├── integration/
│   └── media-gallery-lightbox.test.tsx  # Novo: componente + axe
└── e2e/
    └── media-gallery-lightbox.spec.ts   # Novo: abrir/navegar/fechar/teclado/circular
```

**Structure Decision**: Nenhum projeto novo. A visualização em foco é um componente novo
(`MediaGalleryLightbox`) dentro da mesma pasta `src/components/sections/` onde `MediaGallery` já
vive, mantendo o padrão já estabelecido pela feature 001 de agrupar componentes de seção por
pasta. `MediaGallery` passa a ser o gatilho (foto de destaque clicável) e delega a exibição
completa ao `MediaGalleryLightbox`; `RoomsSection`, `WeddingSection` e `EventsSection` não
precisam mudar sua própria interface pública, pois continuam apenas passando `images`,
`emptyLabel` e `ariaLabel` para `MediaGallery`.

## Complexity Tracking

*Nenhuma violação da Constitution Check identificada; seção não aplicável nesta feature.*
