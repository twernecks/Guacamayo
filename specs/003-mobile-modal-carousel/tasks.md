# Tasks: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Input**: Design documents from `specs/003-mobile-modal-carousel/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`,
`checklists/ux.md`

**Tests**: A experiência mobile concentra o maior risco de acessibilidade/interação desta feature
(ver `checklists/ux.md`), por isso tem cobertura de teste dedicada, seguindo o mesmo padrão de
proporcionalidade ao risco já usado nas features `001-pousada-landing-page` e
`002-media-gallery-modal`.

**Nota sobre o checklist**: Vários itens de `checklists/ux.md` (quantificação de margem/fundo,
alvo de toque mínimo, `prefers-reduced-motion`, altura máxima de card, foco acompanhando o
scroll) são resolvidos abaixo com valores concretos nas tarefas de implementação — a spec
permanece no nível "o quê"; as tarefas fixam o "quanto". Os itens que não são resolvidos por uma
tarefa (CHK003, CHK008, CHK009) são de baixo impacto ou dizem respeito a processo futuro, não a
esta entrega — ver o resumo ao final da execução.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta).
- **[Story]**: Mapeia a tarefa para a user story em `spec.md`.
- Toda tarefa inclui o caminho exato do arquivo.

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Extrair o par "botões anterior/próxima + indicador de posição" já usado em
`MediaGalleryLightbox` para um componente compartilhado, sem mudar seu comportamento atual, para
que o carrossel de relatos (US2) possa reaproveitá-lo em vez de duplicá-lo.

**⚠️ CRITICAL**: Nenhuma user story pode ser considerada pronta antes desta fase estar completa,
pois ambas dependem (direta ou indiretamente) do arquivo `MediaGalleryLightbox.tsx` tocado aqui.

- [X] T001 [P] Criar testes de componente para `CarouselControls` (botões anterior/próxima com
      `aria-label`, alvo de toque mínimo 2,75rem/44px, indicador de posição "N de M" com
      `aria-live="polite"`, ausência de controles quando `total <= 1`) em
      `tests/integration/carousel-controls.test.tsx`
- [X] T002 Implementar `CarouselControls` (componente de apresentação reutilizável, sem lógica de
      navegação própria — recebe `onPrevious`/`onNext`/`activeIndex`/`total` via props) em
      `src/components/ui/CarouselControls.tsx` e `src/components/ui/CarouselControls.module.css`
      (depende de T001 estar escrito e falhando)
- [X] T003 Refatorar `MediaGalleryLightbox` para renderizar `CarouselControls` no lugar dos botões
      e do indicador de posição hoje inline, preservando exatamente o comportamento e a marcação
      já testados (navegação circular, `aria-label`s "Foto anterior"/"Próxima foto", `aria-live`)
      em `src/components/sections/MediaGalleryLightbox.tsx` (depende de T002); os testes
      existentes em `tests/integration/media-gallery-lightbox.test.tsx` e
      `tests/e2e/media-gallery-lightbox.spec.ts` devem continuar passando sem nenhuma alteração

**Checkpoint**: `CarouselControls` existe e `MediaGalleryLightbox` já o usa sem regressão de
comportamento; as duas user stories podem prosseguir.

---

## Phase 2: User Story 1 - Ver a foto ampliada de um quarto em tela cheia no celular (Priority: P1) 🎯 MVP

**Goal**: Em viewports mobile, a visualização ampliada de foto ocupa uma proporção bem maior da
tela do que hoje, mantendo o fechamento por clique fora e o cabeçalho/legenda/indicador sempre
visíveis e compactos.

**Independent Test**: Em um celular (ou emulação de viewport ~375px), tocar em uma foto de quarto
com fotos aprovadas (ex.: "Quarto Duplo Deluxe com Vista do Mar"), confirmar que a visualização
ocupa quase toda a tela, e fechar pelas três formas já existentes.

### Tests for User Story 1

- [X] T004 [P] [US1] Estender os testes de componente de `MediaGalleryLightbox` para confirmar que
      cabeçalho, legenda e indicador de posição permanecem no DOM e visíveis (nenhum recebe
      `hidden`/estilo de ocultação) na apresentação mobile, em
      `tests/integration/media-gallery-lightbox.test.tsx`
- [X] T005 [P] [US1] Criar cobertura ponta a ponta em viewport 375px cobrindo: a visualização
      ampliada ocupa ao menos 90% da altura da viewport (SC-001), fecha pelas três formas (botão,
      clique fora, Esc) com foco restaurado ao controle de origem, e o tamanho/comportamento em
      viewport desktop (≥768px) permanece igual ao já validado na feature `002`, em
      `tests/e2e/media-gallery-lightbox.spec.ts`

### Implementation for User Story 1

- [X] T006 [US1] Adicionar uma media query mobile (`max-width: 47.9375rem`, abaixo do breakpoint
      de 48rem já usado no projeto) a `MediaGalleryLightbox.module.css`: `.dialog` passa a
      `width: 92vw; height: 92vh; max-height: 92vh` (mantém ≥90% de altura com uma margem de
      fundo escurecido de ~8% visível e tocável em todos os lados, resolvendo a tensão entre
      "quase tela cheia" e "fechar por clique fora" mesmo em telas de 320px); `.header`, `.body`
      e `.position` recebem espaçamento reduzido, mas `.closeButton` e `.navButton` MUST manter
      `min-width`/`min-height: 2,75rem` (44px) mesmo compactados (depende de T003)
- [X] T007 [US1] Ajustar o atributo `sizes` do `next/image` em `MediaGalleryLightbox.tsx` para
      refletir a nova largura mobile (`92vw` abaixo de 48rem) em vez do `90vw` atual (depende de
      T006)

**Checkpoint**: US1 é independentemente testável — abrir uma foto de quarto em 375px mostra a
visualização quase em tela cheia, com fechamento e navegação preservados; nada muda em desktop.

---

## Phase 3: User Story 2 - Navegar pelos relatos por swipe no celular (Priority: P2)

**Goal**: Em viewports mobile, os relatos aparecem como um carrossel horizontal navegável por
swipe (com alternativa sem gesto), em vez da lista empilhada verticalmente; a grade atual é
preservada em tablet/desktop.

**Independent Test**: Em um celular (ou emulação de viewport ~375px), acessar Relatos, confirmar
o carrossel horizontal com indicação de mais conteúdo, navegar por swipe e por teclado.

### Tests for User Story 2

- [X] T008 [P] [US2] Criar/estender testes de componente de `TestimonialsSection` cobrindo:
      `CarouselControls` presente no mobile quando há 2+ relatos, ausente quando há 0 ou 1 relato
      (mesmo padrão já usado para galerias com uma única foto), navegação por teclado via os
      botões de `CarouselControls` sem depender de gesto, em
      `tests/integration/testimonials-section.test.tsx`
- [X] T009 [P] [US2] Criar cobertura ponta a ponta em viewport 375px cobrindo: carrossel horizontal
      com swipe entre os 3 relatos aprovados, indicador de posição acompanhando o card em foco,
      navegação completa só por teclado, e preservação da grade atual em viewport desktop, em
      `tests/e2e/testimonials-carousel.spec.ts`

### Implementation for User Story 2

- [X] T010 [US2] Implementar o container do carrossel em `TestimonialsSection.module.css`:
      `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-behavior: smooth` com
      `@media (prefers-reduced-motion: reduce) { scroll-behavior: auto }`; cada card com
      `scroll-snap-align` e largura (~88% do container) que deixa o próximo card parcialmente
      visível como indicador adicional; texto do relato com altura máxima e `overflow-y: auto`
      interno para relatos excepcionalmente longos, evitando estourar a altura do carrossel;
      ativo abaixo de 48rem, substituído pela grade atual (`grid-template-columns`) em viewports
      maiores (depende de T003)
- [X] T011 [US2] Atualizar `TestimonialsSection.tsx` para renderizar `CarouselControls` no mobile
      quando `testimonials.length > 1`: os botões anterior/próxima chamam `scrollIntoView` (ou
      `scrollTo` equivalente) no card alvo com `block: "nearest", inline: "center"`, garantindo
      que o card ativo/focado fique sempre visível dentro da área rolável; `activeIndex` é
      atualizado tanto pelos botões quanto por um listener de rolagem (para refletir o swipe do
      usuário) (depende de T010, T002)

**Checkpoint**: US2 é independentemente testável — em 375px, Relatos aparece como carrossel
navegável por swipe e por teclado, com indicador de posição; nada muda em tablet/desktop.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Confirmar que as duas mudanças não introduzem regressão de acessibilidade,
performance ou responsividade em relação à linha de base já registrada pelas features 001/002.

- [X] T012 [P] Reexecutar a auditoria de acessibilidade (`jest-axe` + varredura real de
      navegador) incluindo o modal em tamanho mobile e o carrossel de relatos aberto, e registrar
      evidência em `specs/003-mobile-modal-carousel/validation/accessibility.md`
- [X] T013 [P] Remedir Core Web Vitals (LCP, CLS) com as duas mudanças, comparando com a linha de
      base em `specs/002-media-gallery-modal/validation/performance.md`, e registrar evidência em
      `specs/003-mobile-modal-carousel/validation/performance.md`
- [X] T014 [P] Executar QA responsivo em 375px real, 320px (largura mínima citada nos Edge Cases),
      tablet e desktop, incluindo rotação de orientação com o modal ou o carrossel abertos, e
      registrar evidência em `specs/003-mobile-modal-carousel/validation/frontend-qa.md`
- [X] T015 Executar a suíte completa de lint, checagem de tipos, testes unitários, de integração e
      ponta a ponta documentada em `specs/003-mobile-modal-carousel/quickstart.md`

## Execution Notes (deviations from plan found during implementation)

- **T007 foi além do planejado**: em vez de só trocar `90vw` por `92vw` no atributo `sizes`, o
  `sizes` foi **removido** do `<Image>` do lightbox. Motivo: durante o T014 (QA responsivo), a
  foto ampliada renderizou minúscula e borrada (chegando a ~46×69px reais) em vez de "quase tela
  cheia", violando FR-001. Causa raiz: o loader customizado de imagem (da feature de deploy no
  GitHub Pages) devolve a mesma URL para toda largura pedida pelo `srcset`; combinado com um
  `sizes` baseado em `vw`, o navegador ficava sem sinal confiável de tamanho antes de decodificar
  o JPEG e escolhia uma escala de decodificação adaptativa muito menor que o arquivo real. Ver
  `validation/frontend-qa.md` para a investigação completa e a captura de tela antes/depois.
- **T006 ganhou um ajuste que não estava na tarefa original**: além do `width`/`height`/
  `max-height` do `.dialog`, `.image` recebeu um `height` definido (68vh) **só na media query
  mobile** — necessário para quebrar a cadeia de auto-sizing circular que causava o mesmo bug
  acima. A regra base (desktop) foi deliberadamente mantida como `max-height`/`auto` (inalterada),
  para não regredir o FR-003; uma primeira tentativa de aplicar `height` fixo também na regra base
  inflou a altura do modal no desktop (26–41% → 84–88% da viewport) e foi revertida.
- Nenhuma das duas mudanças acima alterou o escopo das duas user stories — ambas continuam CSS/
  atributo apenas, sem nova dependência, consistente com `research.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: Sem dependências externas; bloqueia as duas user stories, pois
  ambas dependem de `MediaGalleryLightbox.tsx` (US1 diretamente, US2 via `CarouselControls`).
- **US1 (Phase 2)**: Depende apenas da Foundational.
- **US2 (Phase 3)**: Depende apenas da Foundational; independente de US1.
- **Polish (Phase 4)**: Depende de US1 e US2 estarem completas.

### User Story Dependencies

- **US1**: Requer T001–T003.
- **US2**: Requer T001–T003; sem dependência de US1.

### Parallel Opportunities

- T001 é a única tarefa paralela dentro da Foundational (T002–T003 têm dependência sequencial
  entre si).
- Após a Foundational, US1 (T004–T007) e US2 (T008–T011) podem rodar em paralelo entre si.
- Dentro de cada story, as tarefas de teste marcadas [P] podem rodar em paralelo entre si.
- T012, T013 e T014 (Polish) podem rodar em paralelo entre si.

## Parallel Example: Após a Foundational

```text
Task: "Estender testes de MediaGalleryLightbox para cabeçalho/legenda/indicador sempre visíveis (US1)"
Task: "Criar/estender testes de componente do carrossel de TestimonialsSection (US2)"
```

## Implementation Strategy

### MVP First

1. Completar a Fase 1 (Foundational): extrair `CarouselControls` sem regressão em
   `MediaGalleryLightbox`.
2. Completar a Fase 2 (US1): validar o modal quase em tela cheia no mobile.
3. Demonstrar a mudança do modal antes de seguir para o carrossel de relatos.

### Incremental Delivery

1. Entregar o modal redimensionado no mobile (US1) — maior prioridade por afetar a jornada
   central de hospedagem.
2. Entregar o carrossel de relatos por swipe (US2).
3. Completar a validação cruzada (acessibilidade, performance, QA responsivo em 375px/320px)
   antes de considerar a feature pronta para entrega.
