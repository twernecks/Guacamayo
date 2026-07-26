# Tasks: Visualização de Fotos em Foco (Modal de Galeria)

**Input**: Design documents from `specs/002-media-gallery-modal/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/media-gallery-lightbox.md`, `quickstart.md`

**Tests**: A visualização em foco concentra o maior risco de acessibilidade/interação da feature
(ver `checklists/review.md`), por isso tem cobertura de teste dedicada, seguindo o mesmo padrão de
proporcionalidade ao risco já usado na feature `001-pousada-landing-page`.

**Organization**: Como quase todo o comportamento novo mora em um componente compartilhado, a fase
Foundational concentra a implementação; as fases de user story validam esse comportamento em cada
seção consumidora de forma independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta).
- **[Story]**: Mapeia a tarefa para a user story em `spec.md`.
- Toda tarefa inclui o caminho exato do arquivo.

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Construir a visualização em foco compartilhada e o novo gatilho de foto de destaque
que Quartos, Casamentos e Eventos vão consumir. Nenhuma user story pode ser validada de forma
independente antes desta fase estar completa.

**⚠️ CRITICAL**: Esta feature não introduz projeto, dependência ou infraestrutura nova (reutiliza
o app Next.js e a stack de testes já existentes da feature 001); por isso não há uma fase de Setup
separada.

- [X] T001 [P] Criar testes de componente para `MediaGalleryLightbox` (abrir, navegação circular
      próxima/anterior, indicador de posição "N de M", fechar por botão/clique fora/Esc, foco
      restaurado ao controle de origem, operação somente por teclado, sem violações de acessibilidade
      via `jest-axe`) em `tests/integration/media-gallery-lightbox.test.tsx`
- [X] T002 Implementar `MediaGalleryLightbox` usando o elemento `<dialog>` nativo (`showModal`/
      `close`), com navegação circular, indicador de posição, nomes acessíveis explícitos para os
      controles de fechar ("Fechar"), avançar ("Próxima foto") e voltar ("Foto anterior"), exibição
      do `alt` (e do `caption`, quando presente) de cada foto, e o mesmo fallback de falha de
      carregamento já usado pela página, em `src/components/sections/MediaGalleryLightbox.tsx` e
      `src/components/sections/MediaGalleryLightbox.module.css` (depende de T001 estar escrito e
      falhando)
- [X] T003 Atualizar `MediaGallery` para renderizar uma foto de destaque clicável (a primeira do
      array) com indicador de quantidade quando houver mais de uma foto, abrindo o
      `MediaGalleryLightbox` a partir do índice da foto clicada, em substituição à faixa de rolagem
      horizontal atual, em `src/components/sections/MediaGallery.tsx` e
      `src/components/sections/MediaGallery.module.css` (depende de T002); itens sem foto aprovada
      continuam usando o fallback "foto em breve" sem nenhum controle interativo novo
- [X] T004 Atualizar os testes existentes da feature 001 que verificam a renderização anterior do
      `MediaGallery` (faixa de rolagem com todas as fotos) para refletir o novo comportamento de
      foto de destaque clicável, em `tests/integration/rooms-section.test.tsx`,
      `tests/integration/wedding-section.test.tsx`, `tests/integration/events-section.test.tsx` e
      `tests/integration/accessibility.test.tsx` (depende de T003)

**Checkpoint**: A visualização em foco e o novo gatilho estão prontos; Quartos, Casamentos e
Eventos já herdam o comportamento sem precisar de mudança na própria seção.

---

## Phase 2: User Story 1 - Ver as fotos de um quarto em destaque (Priority: P1) 🎯 MVP

**Goal**: Um visitante consegue clicar na foto de um quarto e ver todas as fotos daquele quarto
ampliadas, navegando entre elas e fechando a visualização normalmente.

**Independent Test**: Em um quarto com fotos aprovadas (ex.: "Quarto Duplo Deluxe com Vista do
Mar"), abrir a visualização em foco a partir de uma foto, navegar (incluindo nas extremidades) e
fechar pelas três formas descritas na spec, com e sem mouse.

### Tests for User Story 1

- [X] T005 [P] [US1] Criar cobertura ponta a ponta cobrindo, na seção Quartos: abrir a partir de
      uma foto, navegar (incluindo o comportamento circular nas extremidades), fechar pelo botão,
      por clique fora e por Esc, e o mesmo fluxo operado somente por teclado, em
      `tests/e2e/media-gallery-lightbox.spec.ts`

**Checkpoint**: A User Story 1 é validável de forma independente; um quarto com fotos aprovadas
tem a visualização em foco funcionando de ponta a ponta.

---

## Phase 3: User Story 2 - Mesma experiência para casamentos e eventos (Priority: P2)

**Goal**: Casamentos e Eventos usam exatamente o mesmo componente e comportamento de Quartos, sem
divergência, mesmo antes de existirem fotos reais aprovadas para essas seções.

**Independent Test**: Com fotos de teste (fixture) atribuídas a um item de casamento/evento, o
mesmo fluxo de abrir, navegar e fechar funciona de forma idêntica ao de Quartos.

### Tests for User Story 2

- [X] T006 [P] [US2] Atualizar os testes de componente de `WeddingSection` e `EventsSection` para
      incluir um item com fotos de teste (fixture) e verificar que o mesmo gatilho de foto de
      destaque e a mesma visualização em foco funcionam sem divergência em relação a Quartos, em
      `tests/integration/wedding-section.test.tsx` e `tests/integration/events-section.test.tsx`

**Checkpoint**: A paridade de comportamento entre as três seções está comprovada por teste, mesmo
sem fotos reais aprovadas para casamentos/eventos ainda.

> **Nota**: Cobertura ponta a ponta real para Casamentos/Eventos (equivalente a T005) depende de
> fotos aprovadas existirem em `src/data/pousada-content.ts` para essas seções — hoje `images: []`
> para ambas. Até lá, T006 é a validação automatizada disponível para esta história; adicionar o
> e2e real é um item de conteúdo, não de código (mesmo padrão já registrado em
> `specs/001-pousada-landing-page/tasks.md` → "Pending Before Public Launch").

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Confirmar que a mudança não introduz regressão de acessibilidade, performance ou
responsividade em relação à linha de base já registrada pela feature 001.

- [X] T007 [P] Reexecutar a auditoria de acessibilidade (testes de componente com `jest-axe` +
      varredura real de navegador) incluindo a visualização em foco aberta, e registrar evidência
      em `specs/002-media-gallery-modal/validation/accessibility.md`
- [X] T008 [P] Remedir Core Web Vitals (LCP, CLS) com a nova apresentação de fotos e a visualização
      em foco, comparando com a linha de base em
      `specs/001-pousada-landing-page/validation/performance.md`, e registrar evidência em
      `specs/002-media-gallery-modal/validation/performance.md`
- [X] T009 [P] Executar QA responsivo (mobile, tablet, desktop) da foto de destaque e da
      visualização em foco, incluindo o comportamento de "clique fora" em tela cheia no mobile, e
      registrar evidência em `specs/002-media-gallery-modal/validation/frontend-qa.md`
- [X] T010 Executar a suíte completa de lint, checagem de tipos, testes unitários, de integração e
      ponta a ponta documentada em `specs/002-media-gallery-modal/quickstart.md`

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: Sem dependências externas; bloqueia as duas user stories.
- **US1 (Phase 2)**: Depende apenas da Foundational.
- **US2 (Phase 3)**: Depende apenas da Foundational; independente de US1.
- **Polish (Phase 4)**: Depende de US1 e US2 estarem completas.

### User Story Dependencies

- **US1**: Requer T001–T004.
- **US2**: Requer T001–T004; sem dependência de US1.

### Parallel Opportunities

- T001 é a única tarefa paralela dentro da Foundational (T002–T004 têm dependência sequencial
  entre si).
- T005 (US1) e T006 (US2) podem rodar em paralelo entre si após a Foundational.
- T007, T008 e T009 (Polish) podem rodar em paralelo entre si.

## Parallel Example: Após a Foundational

```text
Task: "Criar cobertura ponta a ponta para Quartos em tests/e2e/media-gallery-lightbox.spec.ts"
Task: "Atualizar testes de componente de WeddingSection/EventsSection com fixture de fotos"
```

## Implementation Strategy

### MVP First

1. Completar a Fase 1 (Foundational): componente de visualização em foco + novo gatilho no
   `MediaGallery` + atualização dos testes existentes afetados.
2. Completar a Fase 2 (US1): validar Quartos de ponta a ponta.
3. Demonstrar a mudança com Quartos antes de seguir para a paridade de Casamentos/Eventos.

### Incremental Delivery

1. Entregar a visualização em foco funcionando em Quartos (US1).
2. Comprovar paridade de comportamento para Casamentos/Eventos por teste de componente (US2),
   registrando que o e2e real dessas seções aguarda fotos aprovadas.
3. Completar a validação cruzada (acessibilidade, performance, QA responsivo) antes de considerar
   a feature pronta para entrega.
