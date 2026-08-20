# Tasks: Redesign Editorial de Natureza e Litoral

**Input**: Design documents from `/specs/005-editorial-nature-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md (todos presentes)

**Tests**: Incluídos proporcionalmente ao risco (componentes visuais + acessibilidade), seguindo o
padrão já usado nas features 001–004 (Vitest/RTL/jest-axe + Playwright/axe-core).

**Organization**: Tarefas agrupadas por user story (US1/US2/US3, conforme `spec.md`) para permitir
implementação e teste independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência entre si)
- **[Story]**: A qual user story a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Projeto único Next.js (`src/`, `tests/` na raiz do repositório) — ver `plan.md` > Project
Structure.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar o único insumo externo ao código que este redesign precisa antes de
qualquer implementação — a foto do hero.

- [X] T001 Selecionar, entre as fotos já aprovadas em `public/images/pousada/quartos/
      local-casamento-0{1..6}.jpg`, a que melhor mostra o casarão/piscina/entorno natural (ver
      `spec.md` Assumptions); confirmar/gerar uma versão pré-otimizada (largura máx. adequada para
      tela cheia, compressão ajustada) já que este projeto não otimiza imagens em tempo de
      requisição (`research.md` Decision 1); registrar as dimensões finais (largura × altura em
      px) para uso em `Media.width`/`Media.height`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Mudanças de dados/tipos/infra compartilhadas por mais de uma user story — bloqueiam
o início de qualquer seção redesenhada.

**⚠️ CRITICAL**: Nenhuma tarefa de user story começa antes desta fase estar completa.

- [X] T002 [P] Estender `src/domain/content.ts`: adicionar `AmenityKey` (união literal fechada),
      `RoomAmenity` (`{ key: AmenityKey; label: LocalizedText }`), `Room.visualEmphasis?:
      "standard" | "featured"`, e `PousadaContent.hero: { image: Media }` — conforme
      `data-model.md`.
- [X] T003 Atualizar `src/data/pousada-content.ts` (depende de T001, T002): reescrever
      `amenities` dos 7 quartos de `LocalizedText[]` para `RoomAmenity[]` (mesmo texto, nova
      `key` por comodidade); atribuir `visualEmphasis: "featured"` aos quartos definidos em
      `research.md` Decision 5 (Vista do Mar, Vista da Piscina); preencher `hero.image` com a foto
      escolhida em T001, incluindo `alt` preciso nos 3 idiomas.
- [X] T004 [P] Trocar a fonte de título de `Playfair_Display` para `Fraunces` em
      `src/app/layout.tsx` (via `next/font/google`, mesmo mecanismo já usado), mantendo `Inter`
      para o corpo — `research.md` Decision 2.
- [X] T005 [P] Criar hook `src/hooks/useScrollReveal.ts`: `IntersectionObserver` que adiciona uma
      classe/estado "visível" na primeira interseção (~15% do elemento) e para de observar depois
      disso; sob `prefers-reduced-motion: reduce`, marca o elemento como já visível imediatamente,
      sem observar — `research.md` Decision 4.
- [X] T006 [P] Adicionar em `src/app/globals.css`: tokens/classe utilitária de textura de grão
      sutil (`<feTurbulence>` embutido como data-URI, opacidade baixa) e um padrão reutilizável de
      divisor de seção em curva (`clip-path` ou SVG inline), funcionando em claro e escuro —
      `research.md` Decision 6.

**Checkpoint**: Fundação pronta — implementação das user stories pode começar.

---

## Phase 3: User Story 1 - Primeira impressão fotográfica do lugar (Priority: P1) 🎯 MVP

**Goal**: O hero mostra uma foto real do casarão/piscina/natureza como elemento principal, com o
texto legível sobre ela, respeitando `prefers-reduced-motion`.

**Independent Test**: Abrir a página inicial em desktop e em 375px e confirmar, sem rolar, uma
imagem fotográfica real (não apenas texto sobre cor lisa) junto com a chamada principal de
contato.

### Tests for User Story 1

- [X] T007 [P] [US1] Atualizar/criar teste de integração em
      `tests/integration/hero-section.test.tsx`: `HeroSection` renderiza a imagem de
      `content.hero.image` com `alt` correto no idioma ativo, e o texto do hero permanece
      presente e acessível.
- [ ] T008 [P] [US1] Criar teste e2e `tests/e2e/hero-photo.spec.ts`: em 375px e 1280px, a imagem
      do hero está visível sem rolar; com `prefers-reduced-motion: reduce` emulado, nenhuma
      transição de entrada é aplicada (conteúdo aparece direto).

### Implementation for User Story 1

- [X] T009 [US1] Atualizar `src/components/sections/HeroSection.tsx` (depende de T003, T005):
      renderizar a foto via `next/image` com `priority`, aplicar `useScrollReveal` ao bloco de
      texto (fade sutil, desativado sob movimento reduzido).
- [X] T010 [US1] Atualizar `src/components/sections/HeroSection.module.css`: layout full-bleed com
      a foto de fundo/destaque, camada de overlay (gradiente) garantindo contraste AA do texto
      sobre qualquer região da imagem, responsivo mobile-first.

**Checkpoint**: User Story 1 funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Quartos como vitrine de pousada boutique (Priority: P2)

**Goal**: A seção de Quartos tem variação editorial entre os 7 itens e cada comodidade mostra um
ícone além do texto.

**Independent Test**: Rolar até "Quartos" e confirmar variação de tamanho/proporção entre os
itens e ícones ao lado de cada comodidade.

### Tests for User Story 2

- [X] T011 [P] [US2] Atualizar teste de integração em
      `tests/integration/rooms-section.test.tsx`: cada comodidade renderiza um ícone associado à
      sua `key` (`aria-hidden="true"`) junto ao texto localizado; quartos com
      `visualEmphasis: "featured"` recebem a classe/atributo de destaque.
- [ ] T012 [P] [US2] Criar teste e2e `tests/e2e/rooms-editorial-grid.spec.ts`: nos 4 breakpoints
      (320/375/768/1280px) e 3 idiomas, a grade mostra variação visual perceptível e nenhum
      texto/ícone corta ou quebra o layout.

### Implementation for User Story 2

- [X] T013 [P] [US2] Criar `src/components/ui/icons/` com ~8 componentes SVG locais (Wi-Fi, ar-
      condicionado, café da manhã, piscina, vista mar, vista jardim, estacionamento, TV/frigobar)
      e um mapa tipado `AmenityKey → IconComponent` — `research.md` Decision 3.
- [X] T014 [US2] Atualizar `RoomCard`/`RoomsSection.tsx` (depende de T003, T013): renderizar o
      ícone (`aria-hidden="true"`) + `label` de cada `RoomAmenity`; aplicar variante visual
      `featured`/`standard` por quarto, preservando a ordem do DOM.
- [X] T015 [US2] Atualizar `src/components/sections/RoomsSection.module.css`: grade com
      proporção/tamanho maior para itens `featured` (ex.: `grid-column`/`grid-row` span), mantendo
      mobile-first e sem regressão de responsividade.

**Checkpoint**: User Stories 1 e 2 funcionais de forma independente.

---

## Phase 5: User Story 3 - Linguagem visual coesa de natureza em toda a página (Priority: P3)

**Goal**: Fade sutil e consistente ao rolar, textura/paleta de natureza em todas as seções
restantes, e depoimentos com tratamento editorial.

**Independent Test**: Rolar a página inteira e confirmar o efeito de entrada consistente, a
mesma paleta/textura em todas as seções, e uma apresentação distinta dos depoimentos.

### Tests for User Story 3

- [X] T016 [P] [US3] Criar teste de integração `tests/integration/scroll-reveal.test.tsx`:
      cobre a lógica real do hook (não revela até a primeira interseção, revela e para de
      observar). Escopo ajustado na implementação: o hook deixou de checar `matchMedia`
      diretamente (violava a regra de lint `react-hooks/set-state-in-effect` ao chamar
      `setState` sincronamente no corpo do efeito) — `prefers-reduced-motion` agora é
      resolvido inteiramente pela regra CSS `.scrollReveal` em `globals.css`, então não há
      mais um branch de `matchMedia` no hook para testar aqui.
- [ ] T017 [P] [US3] Criar teste e2e `tests/e2e/editorial-scroll-reveal.spec.ts`: ao rolar,
      seções aparecem com fade sutil uma única vez (sem repetir ao rolar para trás e para frente);
      com movimento reduzido emulado, nenhum fade ocorre.

### Implementation for User Story 3

- [X] T018 [P] [US3] Aplicar `useScrollReveal` + textura/divisor orgânico (T006) em
      `src/components/sections/WeddingSection.tsx`/`.module.css`.
- [X] T019 [P] [US3] Aplicar `useScrollReveal` + textura/divisor orgânico (T006) em
      `src/components/sections/EventsSection.tsx`/`.module.css`, preservando o estado vazio
      coerente quando a seção ainda não tem foto aprovada (Edge Case da spec).
- [X] T020 [P] [US3] Aplicar `useScrollReveal` + textura/divisor orgânico (T006) em
      `src/components/sections/LocationSection.tsx`/`.module.css`, sem alterar o comportamento do
      mapa/Street View (feature `004`).
- [X] T021 [US3] Atualizar `src/components/sections/TestimonialsSection.tsx`/`.module.css`: aspas
      decorativas (`aria-hidden="true"`) e citação em destaque tipográfico (fonte de título),
      preservando integralmente a lógica de carrossel/`aria-live` já validada em `003` —
      `research.md` Decision 7.
- [X] T022 [P] [US3] Revisar `globals.css` e as demais seções para garantir paleta/textura
      consistentes ponta a ponta (reforço final da Decision 6 aplicada globalmente).

**Checkpoint**: Todas as user stories funcionais de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação obrigatória antes da entrega, conforme `quickstart.md` e a constituição
(gates de acessibilidade, performance e QA de frontend).

- [X] T023 [P] Rodar lint, checagem de tipos e a suíte completa de testes (`vitest run` +
      `playwright test`); corrigir qualquer regressão. Resultado: lint limpo, typecheck limpo,
      106/106 testes `vitest` (99 pré-existentes + 7 novos desta feature), 60/60 testes
      `playwright` pré-existentes (chromium + mobile-chrome) sem regressão. Os 3 specs e2e novos
      planejados em T008/T012/T017 não foram escritos nesta passada — pendência registrada
      abaixo, não escondida.
- [ ] T024 [P] Reexecutar a auditoria de acessibilidade automatizada (`jest-axe` + varredura real
      de navegador via `@axe-core/playwright`) nas seções redesenhadas, incluindo o novo texto
      alternativo do hero e os ícones de comodidade.
- [ ] T025 Reexecutar a medição de Core Web Vitals (Lighthouse, métodos `devtools` + `simulate`)
      e comparar com a linha de base de
      `specs/004-translation-google-maps/validation/performance.md`; registrar resultado em
      `specs/005-editorial-nature-redesign/validation/performance.md`.
- [ ] T026 [P] Executar QA responsivo em 320/375/768/1280px nos 3 idiomas; registrar evidência em
      `specs/005-editorial-nature-redesign/validation/frontend-qa.md`.
- [ ] T027 Executar manualmente o roteiro de `quickstart.md` ponta a ponta e registrar evidência
      (incluindo a verificação de `prefers-reduced-motion` e modo escuro) em
      `specs/005-editorial-nature-redesign/validation/accessibility.md`.
- [ ] T028 Registrar em `specs/005-editorial-nature-redesign/validation/` o peso final (KB) do
      arquivo de imagem do hero e a justificativa da pré-otimização aplicada em T001.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende de T001 (para T003) — bloqueia todas as user stories.
- **User Stories (Phase 3+)**: Todas dependem da Foundational completa.
  - US1, US2 e US3 podem prosseguir em paralelo (times diferentes) ou em ordem de prioridade
    (P1 → P2 → P3).
- **Polish (Phase 6)**: Depende de todas as user stories desejadas estarem completas.

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após a Foundational — sem dependência de US2/US3.
- **User Story 2 (P2)**: Pode começar após a Foundational — sem dependência de US1/US3 (usa os
  mesmos tipos de dados de T002/T003, já prontos na Foundational).
- **User Story 3 (P3)**: Pode começar após a Foundational — usa `useScrollReveal` (T005) e a
  textura global (T006), ambos já prontos na Foundational; não depende de US1/US2 estarem
  implementadas para funcionar, mas reforça visualmente o que elas já estabelecem (ver spec.md
  "Why after").

### Within Each User Story

- Testes (quando incluídos) são escritos antes da implementação correspondente.
- Dentro de cada story: tipos/dados (já resolvidos na Foundational) → componente → estilo.
- Story completa antes de avançar para a próxima prioridade, se a entrega for sequencial.

### Parallel Opportunities

- Tarefas `[P]` da Foundational (T002, T004, T005, T006) podem rodar em paralelo — arquivos
  diferentes, sem dependência entre si.
- Após a Foundational, US1/US2/US3 podem ser trabalhadas em paralelo por pessoas diferentes.
- Dentro de cada story, os testes marcados `[P]` podem rodar em paralelo entre si.

---

## Parallel Example: Foundational

```bash
# Após T001 (foto selecionada), lançar em paralelo:
Task: "Estender src/domain/content.ts com AmenityKey/RoomAmenity/visualEmphasis/hero"
Task: "Trocar fonte de título para Fraunces em src/app/layout.tsx"
Task: "Criar hook src/hooks/useScrollReveal.ts"
Task: "Adicionar tokens de textura/divisor orgânico em src/app/globals.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Completar Phase 1: Setup (T001).
2. Completar Phase 2: Foundational (T002–T006, CRÍTICA — bloqueia todas as stories).
3. Completar Phase 3: User Story 1 (T007–T010).
4. **PARAR e VALIDAR**: testar a primeira impressão fotográfica isoladamente.
5. Entregar/demonstrar se pronto — já resolve o maior problema de percepção identificado
   (hero genérico sem foto).

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. Adicionar US1 → validar independentemente → entregar (MVP).
3. Adicionar US2 → validar independentemente → entregar.
4. Adicionar US3 → validar independentemente → entregar.
5. Phase 6 (Polish) fecha a entrega com os gates de qualidade obrigatórios da constituição.

---

## Notes

- `[P]` = arquivos diferentes, sem dependência entre si.
- `[Story]` mapeia a tarefa à user story correspondente para rastreabilidade.
- Nenhuma dependência de runtime nova é introduzida (ver `plan.md` > Technical Context).
- Nenhuma tarefa altera o comportamento das funcionalidades já existentes (i18n, lightbox,
  carrossel de relatos, mapa/Street View) — apenas a apresentação visual ao redor delas.
- Parar em qualquer checkpoint para validar uma story de forma isolada antes de seguir.
