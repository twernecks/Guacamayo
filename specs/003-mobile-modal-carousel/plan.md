# Implementation Plan: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Branch**: `003-mobile-modal-carousel` | **Date**: 2026-07-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-mobile-modal-carousel/spec.md`

## Summary

Ajustar dois pontos da experiência mobile já em produção: (1) a visualização em foco de fotos
(`MediaGalleryLightbox`, feature `002-media-gallery-modal`) passa a ocupar uma proporção bem
maior da tela em viewports mobile (~768px ou menos, ≥90% da altura em 375px), mantendo o mesmo
`<dialog>` nativo, o fechamento por clique fora/Esc/botão e uma margem/fundo visível suficiente
para isso — apenas a proporção ocupada e a compactação do cabeçalho/legenda/indicador mudam,
sem novo mecanismo; (2) a seção de Relatos passa a ser um carrossel horizontal navegável por
swipe no mobile, usando rolagem nativa com CSS `scroll-snap` (sem biblioteca de carrossel nova) e
reaproveitando o mesmo padrão visual/acessível de botões anterior/próxima + indicador de posição
já usado na visualização de fotos, com um pequeno componente de controles extraído para os dois
compartilharem. Comportamento em tablet/desktop é preservado nos dois casos. Nenhuma entidade de
domínio, dependência nova ou mudança de conteúdo é introduzida.

## Technical Context

**Language/Version**: TypeScript 5.x; Node.js 22 LTS (mesmo ambiente das features 001 e 002)

**Primary Dependencies**: Next.js (App Router), React; CSS Modules com media query mobile-first
em 48rem (768px, breakpoint já usado no projeto); rolagem nativa com CSS `scroll-snap` para o
swipe dos relatos — sem biblioteca de carrossel/gestos nova (ver `research.md`)

**Storage**: N/A — reutiliza os dados estáticos tipados já existentes (`Media`, `Testimonial`)
em `src/data/pousada-content.ts`; nenhuma persistência nova

**Testing**: Vitest + React Testing Library + `jest-axe` para os componentes alterados/novos;
Playwright para os fluxos ponta a ponta, incluindo emulação de viewport mobile real (375px) para
os critérios de aceite — mesma stack das features 001 e 002

**Target Platform**: Navegadores modernos em dispositivos móveis e desktop, mesmo alvo das
features 001 e 002

**Project Type**: Aplicação web frontend única (mesmo projeto Next.js; nenhum projeto novo)

**Performance Goals**: Nenhuma meta nova; preserva o orçamento já medido em
`specs/002-media-gallery-modal/validation/performance.md` (LCP ≤ 2,5 s, CLS ≤ 0,1). Mudança é de
apresentação/interação, sem novos ativos pesados nem dependência de execução nova.

**Constraints**: WCAG 2.2 AA (toda interação por gesto precisa de alternativa sem gesto; foco e
leitura por leitor de tela não podem regredir); breakpoint mobile ~768px (48rem, já usado no
projeto); modal mobile mantém margem/fundo visível suficiente para fechar por clique fora (ver
Clarifications da spec); sem rolagem horizontal da página inteira fora do carrossel de relatos.

**Scale/Scope**: Dois componentes existentes alterados (`MediaGalleryLightbox`,
`TestimonialsSection`) mais um pequeno componente de controles de navegação (botões
anterior/próxima + indicador de posição) extraído para os dois compartilharem; nenhuma entidade
de domínio nova.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — Mudanças ficam em `src/components/sections/` (e um
      pequeno componente de controles compartilhado em `src/components/ui/`), sem lógica de
      negócio nova; nenhum tipo de domínio muda.
- [x] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — `activeIndex` do carrossel de
      relatos é local ao componente; nenhuma dependência nova (CSS `scroll-snap` nativo em vez de
      biblioteca de carrossel — ver `research.md` para a rejeição documentada das alternativas).
- [x] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — Especificados na spec (Public Experience and Quality
      Requirements) e nas duas Clarifications sobre o comportamento mobile do modal.
- [x] A performance budget and Core Web Vitals targets are measurable for this feature. —
      Reutiliza o orçamento já medido pelas features 001/002; critério de sucesso é "sem
      regressão" (Performance budget, SC-003), verificável reexecutando a mesma medição.
- [x] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — Nenhuma entidade nova; estados vazios/de
      falha já existentes (galeria sem foto, ausência de relatos) reaproveitados sem alteração de
      contrato.
- [x] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — Planejados nas tasks de
      validação (accessibility, performance, frontend QA em 375px), reexecutando a evidência já
      documentada nas features 001/002 com as duas mudanças incluídas.

## Project Structure

### Documentation (this feature)

```text
specs/003-mobile-modal-carousel/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Sem `contracts/`: esta feature não expõe nem altera nenhuma interface/contrato de domínio (ver
`research.md`) — é inteiramente apresentação e interação sobre entidades já existentes.

### Source Code (repository root)

```text
src/
├── components/
│   ├── ui/
│   │   └── CarouselControls.tsx        # Novo: botões anterior/próxima + indicador de posição
│   │                                     # "N de M", extraído de MediaGalleryLightbox para ser
│   │                                     # compartilhado com o carrossel de relatos
│   │   └── CarouselControls.module.css # Novo
│   └── sections/
│       ├── MediaGalleryLightbox.tsx          # Alterado: usa CarouselControls; ajusta `sizes`
│       │                                       # do next/image para o novo tamanho mobile
│       ├── MediaGalleryLightbox.module.css   # Alterado: media query mobile (48rem) para
│       │                                       # proporção de tela maior + cabeçalho compacto
│       ├── TestimonialsSection.tsx           # Alterado: carrossel horizontal (scroll-snap) +
│       │                                       # CarouselControls no mobile; grade preservada
│       │                                       # em tablet/desktop
│       └── TestimonialsSection.module.css    # Alterado: container com scroll-snap, tamanho de
│                                               # card com "peek" do próximo, estilos do mobile

tests/
├── integration/
│   ├── media-gallery-lightbox.test.tsx   # Alterado: cobertura do cabeçalho/legenda/indicador
│   │                                       # sempre visíveis no tamanho mobile
│   └── testimonials-section.test.tsx     # Alterado: cobertura do carrossel (controles,
│                                           # navegação por teclado, estado com 0/1 relato)
└── e2e/
    ├── media-gallery-lightbox.spec.ts    # Alterado: asserção de proporção de tela em 375px
    └── testimonials-carousel.spec.ts     # Novo: swipe, navegação por teclado e indicador de
                                            # posição em 375px; grade preservada em desktop
```

**Structure Decision**: Nenhum projeto novo. As duas mudanças ficam nos componentes de seção já
existentes (`src/components/sections/`), seguindo o padrão já estabelecido pelas features 001 e
002. O único elemento novo é `CarouselControls`, um componente de apresentação pequeno em
`src/components/ui/` (mesma pasta de outros primitivos reutilizáveis como `Button`,
`Container`) que encapsula o par "botões anterior/próxima + indicador de posição" hoje só
implementado dentro de `MediaGalleryLightbox`; extraí-lo evita duplicar esse padrão acessível ao
implementar o carrossel de relatos e reduz risco de divergência entre os dois (ver
`research.md`). `RoomsSection`, `WeddingSection` e `EventsSection` não mudam — continuam apenas
consumindo `MediaGallery`/`MediaGalleryLightbox` normalmente.

## Complexity Tracking

*Nenhuma violação da Constitution Check identificada; seção não aplicável nesta feature.*
