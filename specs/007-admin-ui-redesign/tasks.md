# Tasks: Redesign Visual do Painel Administrativo

**Input**: Design documents from `/specs/007-admin-ui-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md (N/A), contracts/admin-ui-components.md, quickstart.md

**Tests**: Esta feature não adiciona lógica nova (FR-012), então não gera tarefas de teste novas por
padrão. As tarefas de teste aqui existentes são de dois tipos: (1) **regressão** — rodar a suíte já
existente da feature 006 após cada história para confirmar que nenhuma asserção de comportamento
quebrou (SC-007), e (2) **extensão de cobertura de acessibilidade** — `jest-axe` ainda não cobria
algumas telas tocadas em profundidade agora (formulários de Event Space/Testimonial, detalhe de
Lead); essas ficam explícitas por história.

**Organization**: Tarefas agrupadas por história de usuário (spec.md), permitindo implementação e
teste independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência entre si)
- **[Story]**: A qual história de usuário a tarefa pertence (US1–US4)
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Projeto único Next.js (`src/`, `tests/` na raiz do repositório) — sem mudança de estrutura de alto
nível; ver `plan.md` § Project Structure para a árvore completa.

---

## Phase 1: Setup

**Purpose**: Estabelecer a linha de base de regressão antes de qualquer mudança visual

- [X] T001 Rodar `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e` e
      `npm run build` no estado atual do admin e registrar o resultado (contagem de testes
      passando, ausência de erros de build) como linha de base de regressão para SC-007 —
      nenhuma dependência nova ainda existe em `package.json` neste ponto (linha de base para
      SC-006 também). ✅ typecheck e lint limpos antes de qualquer edição; suíte completa 157/157
      (uma falha isolada em `login.test.tsx` foi confirmada como flake de contenção de recursos —
      passa 4/4 isoladamente); `npm run build` gera o export estático sem erros.

**Checkpoint**: Linha de base registrada — qualquer falha nova encontrada depois de uma história é
comparável contra este resultado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design system interno do admin (Field/Card/Table/Banner), extensão do `Button` público,
novos ícones SVG, e restilização dos componentes de estado (erro/carregamento/conflito/confirmação)
compartilhados por 2+ histórias — nada nesta fase depende de nenhuma história, e todas as histórias
(US1–US4) dependem dela.

**⚠️ CRITICAL**: Nenhuma história pode começar antes desta fase estar completa.

- [X] T002 [P] Adicionar a variante `destructive` a `src/components/ui/Button.tsx`
      (`ButtonVariant = "primary" | "accent" | "secondary" | "destructive"`) e a classe
      `.destructive` correspondente em `src/components/ui/Button.module.css`, usando
      `--color-accent`/`--color-accent-strong` (contracts/admin-ui-components.md)
- [X] T003 [P] Criar `src/components/ui/icons/EditIcon.tsx` — ícone SVG de lápis, seguindo
      exatamente o padrão de `src/components/ui/icons/WifiIcon.tsx`
- [X] T004 [P] Criar `src/components/ui/icons/TrashIcon.tsx` — ícone SVG de lixeira, mesmo padrão
- [X] T005 [P] Criar `src/components/ui/icons/LogoutIcon.tsx` — ícone SVG de saída, mesmo padrão
- [X] T006 [P] Criar `src/components/ui/icons/WarningIcon.tsx` — ícone SVG de aviso, mesmo padrão
- [X] T007 [P] Criar `src/components/admin/ui/Field.tsx` + `src/components/admin/ui/Field.module.css`
      — wrapper de rótulo+controle nativo per contracts/admin-ui-components.md; NUNCA gera
      `id`/`htmlFor` (quem chama continua responsável, preservando `getByLabelText` nos testes)
- [X] T008 [P] Criar `src/components/admin/ui/Card.tsx` + `src/components/admin/ui/Card.module.css`
      — container com borda/raio/sombra usando `--color-surface`/`--color-border`/`--radius-md`/
      `--shadow-sm`
- [X] T009 [P] Criar `src/components/admin/ui/Table.tsx` + `src/components/admin/ui/Table.module.css`
      — wrapper `<div overflow-x:auto><table>{children}</table></div>` puramente visual;
      `thead`/`tbody`/`tr`/`th`/`td` continuam nativos (preserva roles ARIA implícitos)
- [X] T010 [P] Criar `src/components/admin/ui/Banner.tsx` + `src/components/admin/ui/Banner.module.css`
      — variantes `error`/`warning`/`empty`/`info`; `role` não tem default, quem chama decide
      (contracts/admin-ui-components.md)
- [X] T011 Restilizar `src/components/admin/ErrorToast.tsx` para renderizar via
      `<Banner variant="error" role="alert">` — `describeError()` e a assinatura de `ErrorToastProps`
      permanecem inalteradas (depende de T010)
- [X] T012 Restilizar `src/components/admin/FieldError.tsx` + criar
      `src/components/admin/FieldError.module.css` (texto de erro inline junto ao campo) —
      preservar o `role="alert"` e o matching case-insensitive de `field` já existente
- [X] T013 Restilizar `src/components/admin/LoadingIndicator.tsx` + criar
      `src/components/admin/LoadingIndicator.module.css` (spinner visual em CSS puro) — preservar
      `role="status"` e a prop `label`
- [X] T014 Restilizar `src/components/admin/ConflictBanner.tsx` para renderizar via
      `<Banner variant="warning" role="alert">` + `<Button variant="secondary">` para "Recarregar"
      — preservar a prop `onReload` e o texto (depende de T002, T010)
- [X] T015 Restilizar `src/components/admin/ConfirmDialog.tsx` + criar
      `src/components/admin/ConfirmDialog.module.css` (conteúdo do `<dialog>` nativo com aparência
      de cartão, botões via `<Button variant="secondary">` para Cancelar e
      `<Button variant="destructive">` para Excluir/Descartar) — preservar `showModal()`/`close()`/
      `aria-label` (depende de T002)

**Checkpoint**: Fundação pronta — implementação das histórias de usuário pode começar.

---

## Phase 3: User Story 1 - Login profissional e alinhado à marca (Priority: P1) 🎯 MVP

**Goal**: `/admin/login` apresenta um formulário centralizado em um cartão, com campos, foco e erro
estilizados, consistente com a marca do site.

**Independent Test**: Acessar `/admin/login` e verificar visualmente cartão centralizado, campos com
rótulo/borda/foco, e mensagem de erro destacada — sem depender de nenhuma outra tela.

### Implementation for User Story 1

- [X] T016 [P] [US1] Criar `src/components/admin/LoginForm.module.css` (layout do cartão
      centralizado, espaçamento entre campos)
- [X] T017 [US1] Restilizar `src/components/admin/LoginForm.tsx`: envolver os dois campos em
      `<Field>` (T007), envolver o formulário em `<Card>` (T008), erro em
      `<Banner variant="error" role="alert">` (T010), botão de envio em `<Button>` — preservar os
      `id`s `admin-email`/`admin-password`, `autoComplete`, `required` e a lógica de
      `handleSubmit`/mensagens de erro exatamente como estão (depende de T007, T008, T010, T002)
- [X] T018 [US1] Atualizar `src/app/admin/login/page.tsx`: envolver `<h1>` + `<LoginForm />` em um
      container de página centralizado (reaproveitando `LoginForm.module.css` ou uma classe local),
      sem alterar a estrutura semântica (`<main><h1>...` permanece) (depende de T017)
- [X] T019 [US1] Rodar `npm run test -- login` e `npm run test:e2e -- auth` e corrigir qualquer
      quebra de seletor em `tests/integration/admin/login.test.tsx` e `tests/e2e/admin/auth.spec.ts`
      — nenhuma asserção de comportamento deve mudar (FR-012/SC-007) (depende de T018) ✅ 4/4 e
      12/12 passando isoladamente; falhas vistas em execução paralela plena foram confirmadas como
      contenção de recursos/latência de compilação sob demanda do dev server, não regressão

**Checkpoint**: US1 completa — tela de login com qualidade profissional, testável isoladamente.

---

## Phase 4: User Story 2 - Navegação e casca administrativa consistentes (Priority: P2)

**Goal**: Toda página autenticada mostra um cabeçalho/menu estilizado, com seção ativa identificável
e um botão de logout reconhecível.

**Independent Test**: Fazer login e navegar entre `/admin/rooms`, `/admin/leads`,
`/admin/site-settings`, verificando consistência visual do cabeçalho/menu e do botão "Sair" — sem
depender do redesenho interno de cada tela de conteúdo.

### Implementation for User Story 2

- [X] T020 [P] [US2] Criar `src/components/admin/AdminShell.module.css` (container de página usando
      `--container-max-width`, espaçamento entre cabeçalho e conteúdo)
- [X] T021 [US2] Atualizar `src/components/admin/AdminShell.tsx` para aplicar as classes de
      `AdminShell.module.css` ao wrapper de layout — nenhuma mudança na lógica de
      `AdminRouteGuard`/redirects (depende de T020)
- [X] T022 [P] [US2] Criar `src/components/admin/AdminNav.module.css` estilizando as classes BEM já
      presentes em `AdminNav.tsx` (`admin-nav`, `admin-nav__links`, `admin-nav__title`,
      `admin-nav__session`) — destaque visual do link ativo, colapso responsivo abaixo de ~640px
      (research.md Decision 5)
- [X] T023 [US2] Atualizar `src/components/admin/AdminNav.tsx`: importar `AdminNav.module.css`,
      marcar o link ativo via `usePathname()`, trocar o `<button>` "Sair" por
      `<Button variant="secondary">` + `<LogoutIcon>` — preservar `handleLogout`/`NAV_LINKS`/
      `aria-label="Navegação administrativa"` (depende de T022, T002, T005)
- [X] T024 [US2] Rodar `npm run test:e2e -- auth` e a suíte de acessibilidade
      (`tests/integration/admin/accessibility.test.tsx`) para confirmar que a navegação renderiza
      em todas as páginas sem regressão funcional (depende de T023) ✅ 12/12 (chromium+mobile-chrome).
      Diagnosticadas e removidas duas interferências ambientais pré-existentes não relacionadas a
      este redesenho: (1) a API/Postgres locais de uma sessão anterior ainda rodando, respondendo
      401 real a chamadas não-mockadas de `/api/admin/rooms` e derrubando a sessão; (2) um servidor
      `next dev` remanescente na porta 3000 sendo reaproveitado por `reuseExistingServer` em vez do
      `npm run build && serve out` que `playwright.config.ts` espera, causando lentidão de
      compilação sob paralelismo. Ambos parados: suíte volta a ficar 100% determinística.

**Checkpoint**: US1+US2 completas — login e navegação consistentes em todo o painel.

---

## Phase 5: User Story 3 - Listagens e formulários de conteúdo com qualidade profissional (Priority: P3)

**Goal**: Quartos, Espaços de Evento e Depoimentos (listar/criar/editar/excluir) usam tabelas e
formulários estilizados, consistentes com o restante do painel.

**Independent Test**: Abrir `/admin/rooms` (e repetir para event-spaces/testimonials): tabela com
cabeçalhos e ações estilizadas; formulário multilíngue com abas, campos e botão de salvar seguindo o
mesmo sistema visual — sem depender das telas de Leads/Configurações.

### Implementation for User Story 3

- [X] T025 [P] [US3] Criar `src/components/admin/ContentForm.module.css`
- [X] T026 [US3] Restilizar `src/components/admin/ContentForm.tsx`: campo "Publicado" e "Ordem de
      exibição" via `<Field>`, botão de envio via `<Button>`, mensagens de bloqueio de publicação e
      erro de submissão via `<Banner variant="warning"|"error" role="alert">` — preservar toda a
      lógica de `blocksPublish`/`missingByField`/`onSubmit` (depende de T007, T010, T002, T025)
- [X] T027 [P] [US3] Criar `src/components/admin/LanguageTabs.module.css` (barra de abas com
      destaque da aba ativa, indicador de idioma faltante)
- [X] T028 [US3] Atualizar `src/components/admin/LanguageTabs.tsx` para aplicar as classes de
      `LanguageTabs.module.css` ao `fieldset`/botões de aba/input — preservar `aria-pressed`,
      `role="group"` e a associação `htmlFor`/`id` (depende de T027)
- [X] T029 [P] [US3] Criar `src/components/admin/ContentTable.module.css`
- [X] T030 [US3] Restilizar `src/components/admin/ContentTable.tsx`: trocar o `<table>` nativo pelo
      wrapper `<Table>` (T009), ações de linha por `<Button variant="secondary"><EditIcon/></Button>`
      e `<Button variant="destructive"><TrashIcon/></Button>`, estado vazio via
      `<Banner variant="empty">` — preservar `editHref`/`onDelete`/render de colunas/uso de
      `ConfirmDialog` (depende de T009, T002, T003, T004, T010, T029)
- [X] T031 [P] [US3] Criar `src/components/admin/RoomExtraFields.module.css` e aplicar em
      `src/components/admin/RoomExtraFields.tsx` (lista de checkboxes de comodidades + `<Field>`
      para o select de destaque visual) (depende de T007)
- [X] T032 [P] [US3] Criar `src/components/admin/EventSpaceExtraFields.module.css` e aplicar em
      `src/components/admin/EventSpaceExtraFields.tsx` (depende de T007)
- [X] T033 [P] [US3] Criar `src/components/admin/TestimonialExtraFields.module.css` e aplicar em
      `src/components/admin/TestimonialExtraFields.tsx` (depende de T007)
- [X] T034 [P] [US3] Aplicar container de página consistente (título + `<Card>`/wrapper) em
      `src/app/admin/rooms/page.tsx`, `src/app/admin/rooms/new/page.tsx` e
      `src/app/admin/rooms/edit/page.tsx` — sem mudança de fetch/estado/roteamento (depende de T008)
- [X] T035 [P] [US3] Aplicar o mesmo padrão de container de página em
      `src/app/admin/event-spaces/page.tsx`, `src/app/admin/event-spaces/new/page.tsx` e
      `src/app/admin/event-spaces/edit/page.tsx` (depende de T008)
- [X] T036 [P] [US3] Aplicar o mesmo padrão de container de página em
      `src/app/admin/testimonials/page.tsx`, `src/app/admin/testimonials/new/page.tsx` e
      `src/app/admin/testimonials/edit/page.tsx` (depende de T008)
- [X] T037 [US3] Estender `tests/integration/admin/accessibility.test.tsx` com cobertura `jest-axe`
      para os formulários de criação/edição de Espaço de Evento e Depoimento (ainda não cobertos
      per `006-admin-panel-integration/quickstart.md`) (depende de T032, T033, T035, T036)
- [X] T038 [US3] Rodar `npm run test -- rooms-crud` e `npm run test:e2e -- content-crud` e corrigir
      qualquer quebra de seletor — nenhuma asserção de comportamento deve mudar (FR-012/SC-007)
      (depende de T030, T034, T035, T036) ✅ 53/53 unit+integration, 8/8 e2e (chromium+mobile-chrome)

**Checkpoint**: US1+US2+US3 completas — CRUD de conteúdo com qualidade visual profissional.

---

## Phase 6: User Story 4 - Configurações do Site e Leads com o mesmo padrão visual (Priority: P4)

**Goal**: Configurações do Site e Leads (listar/filtrar/detalhe/status) seguem o mesmo sistema
visual das demais telas.

**Independent Test**: Abrir `/admin/site-settings` e confirmar campos estilizados; abrir
`/admin/leads`, aplicar um filtro e abrir o detalhe de um lead, confirmando consistência visual —
sem depender de nenhuma tela adicional.

### Implementation for User Story 4

- [X] T039 [P] [US4] Criar `src/components/admin/LeadFilters.module.css` e aplicar em
      `src/components/admin/LeadFilters.tsx` (campos via `<Field>`, botão via `<Button>`, mensagem
      de intervalo inválido com destaque de erro) — preservar `validateDateRange`/`onChange`
      (depende de T007, T002)
- [X] T040 [P] [US4] Criar `src/components/admin/LeadStatusControl.module.css` e aplicar em
      `src/components/admin/LeadStatusControl.tsx` como um controle segmentado (rádios agrupados
      visualmente, estado desabilitado-durante-salvamento visível) — preservar
      `name="lead-status"`/`checked`/`onChange`/uso de `ConflictBanner` (depende de T014)
- [X] T041 [US4] Restilizar `src/app/admin/site-settings/page.tsx`: cada campo envolto em `<Field>`,
      formulário dentro de `<Card>`, botão de envio via `<Button>`, erro via `ErrorToast` já
      restilizado — preservar cada `id`/`onChange`/tratamento de campo anulável exatamente como
      está (depende de T007, T008, T002, T011)
- [X] T042 [US4] Restilizar `src/app/admin/leads/page.tsx`: tabela via `<Table>` (T009), estado
      vazio via `<Banner variant="empty">`, botões de paginação via `<Button variant="secondary">`
      — preservar `skip`/`take`/lógica de `disabled` (depende de T009, T010, T002, T039)
- [X] T043 [US4] Restilizar `src/app/admin/leads/detail/page.tsx`: `<dl>` e histórico de conversa
      (`<ul>`) dentro de um `<Card>`, tipografia consistente — preservar toda renderização
      condicional (`NOT_FOUND`, conversa vazia, id inválido) (depende de T008, T040)
- [X] T044 [US4] Estender `tests/integration/admin/accessibility.test.tsx` com cobertura `jest-axe`
      para a tela de detalhe de Lead (ainda não coberta) (depende de T043)
- [X] T045 [US4] Rodar `npm run test -- leads` e `npm run test:e2e -- leads` e corrigir qualquer
      quebra de seletor — nenhuma asserção de comportamento deve mudar (FR-012/SC-007) (depende de
      T041, T042, T043) ✅ 54/54 unit+integration, 6/6 e2e (chromium+mobile-chrome)

**Checkpoint**: Todas as 4 histórias completas e independentemente funcionais.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificação final contra os critérios de sucesso mensuráveis de spec.md

- [X] T046 [P] Verificação visual manual per `quickstart.md` nas quatro larguras (375/768/1024/1440px)
      em todas as ~15 rotas de `/admin/**` (SC-002/SC-003) ✅ Substituída por um script Playwright
      ad-hoc (não permanente, mesmo padrão do T063 da feature 006): 0 rolagem horizontal em 8 rotas
      representativas × 4 larguras + login, e um proxy computado confirmando que inputs/botões não
      usam mais o estilo padrão do navegador.
- [X] T047 [P] Verificação manual de navegação por teclado (foco visível) e contraste em todos os
      elementos interativos redesenhados (SC-004/SC-005, FR-011) ✅ Elevada de manual para
      automatizada: `@axe-core/playwright` (devDependency já instalada, nenhuma nova) rodando em
      Chromium real com as regras `color-contrast`/wcag2a/wcag2aa habilitadas (diferente do
      `jest-axe`/jsdom, que não avalia contraste de forma confiável) — 0 violações em
      login/listagem/formulário/detalhe de lead; mais uma verificação de foco visível via teclado
      real no formulário de login.
- [X] T048 Confirmar via `git diff -- package.json` que nenhuma dependência nova foi adicionada a
      `dependencies` (SC-006) ✅ Diff vazio.
- [X] T049 Rodar a suíte completa (`npm run typecheck && npm run lint && npm run test && npm run
      test:e2e && npm run build`) e comparar contra a linha de base de T001 (SC-007) ✅ typecheck e
      lint limpos; 160/160 unit+integração (157 da linha de base + 3 novos testes de acessibilidade
      desta feature); 90/90 e2e (chromium+mobile-chrome), incluindo SC-009 dentro do orçamento
      (682–1085ms, bem abaixo dos 3000ms); build estático gera as mesmas 20 rotas sem erro.
- [X] T050 Atualizar `specs/007-admin-ui-redesign/quickstart.md` com os resultados finais da
      verificação (datas, contagens de teste, achados de contraste/responsividade), no mesmo padrão
      usado em `006-admin-panel-integration/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as histórias
- **User Stories (Phase 3–6)**: Todas dependem da conclusão da Foundational
  - Podem prosseguir em paralelo (se houver capacidade) ou sequencialmente por prioridade (P1→P2→P3→P4)
- **Polish (Phase 7)**: Depende de todas as histórias desejadas estarem completas

### User Story Dependencies

- **US1 (P1)**: Pode começar após a Foundational — sem dependência de outras histórias
- **US2 (P2)**: Pode começar após a Foundational — independente de US1 (embora US1 já exercite o
  `AdminShell`/`Suspense` indiretamente por estar sob o mesmo layout)
- **US3 (P3)**: Pode começar após a Foundational — usa `Button`/`Field`/`Card`/`Table`/`Banner` da
  Foundational, não de US1/US2; visualmente mais coerente se US2 (nav) já estiver pronta, mas não é
  um bloqueio técnico
- **US4 (P4)**: Pode começar após a Foundational — mesma observação de US3; `LeadStatusControl`
  depende de `ConflictBanner` (T014, Foundational), não de US3

### Within Each User Story

- Arquivos `.module.css` (marcados `[P]`) antes ou em paralelo com a atualização do `.tsx`
  correspondente que os importa
- Componentes de apresentação antes das páginas que os consomem
- Tarefa de teste/regressão por último em cada história

### Parallel Opportunities

- Todas as tarefas `[P]` da Foundational (T002–T010) podem rodar em paralelo — arquivos distintos,
  sem dependência entre si
- Dentro de US3: T031/T032/T033 (extra-fields) e T034/T035/T036 (páginas) podem rodar todas em
  paralelo entre si
- US3 e US4 podem ser implementadas em paralelo por pessoas diferentes, ambas dependendo apenas da
  Foundational

---

## Parallel Example: Foundational Phase

```bash
# Lançar em paralelo (arquivos independentes):
Task: "Add destructive variant to src/components/ui/Button.tsx + Button.module.css"
Task: "Create src/components/ui/icons/EditIcon.tsx"
Task: "Create src/components/ui/icons/TrashIcon.tsx"
Task: "Create src/components/ui/icons/LogoutIcon.tsx"
Task: "Create src/components/ui/icons/WarningIcon.tsx"
Task: "Create src/components/admin/ui/Field.tsx + Field.module.css"
Task: "Create src/components/admin/ui/Card.tsx + Card.module.css"
Task: "Create src/components/admin/ui/Table.tsx + Table.module.css"
Task: "Create src/components/admin/ui/Banner.tsx + Banner.module.css"
```

## Parallel Example: User Story 3

```bash
# Após T007–T010, T002–T004, T029 estarem prontos, lançar em paralelo:
Task: "Create RoomExtraFields.module.css and apply to RoomExtraFields.tsx"
Task: "Create EventSpaceExtraFields.module.css and apply to EventSpaceExtraFields.tsx"
Task: "Create TestimonialExtraFields.module.css and apply to TestimonialExtraFields.tsx"
Task: "Apply page container to rooms/{page,new,edit}.tsx"
Task: "Apply page container to event-spaces/{page,new,edit}.tsx"
Task: "Apply page container to testimonials/{page,new,edit}.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia todas as histórias)
3. Completar Phase 3: User Story 1 (Login)
4. **PARAR e VALIDAR**: testar a tela de login isoladamente
5. Demonstrar se pronto — já resolve o ponto mais visível sinalizado pelo usuário

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 (Login) → validar → demo (MVP!)
3. US2 (Navegação) → validar → demo
4. US3 (Conteúdo) → validar → demo
5. US4 (Site Settings/Leads) → validar → demo
6. Cada história soma qualidade visual sem quebrar as anteriores (FR-012)

### Parallel Team Strategy

Com mais de uma pessoa disponível:

1. Completar Setup + Foundational em conjunto
2. Depois da Foundational:
   - Pessoa A: US1 (Login) → US2 (Navegação)
   - Pessoa B: US3 (Conteúdo)
   - Pessoa C: US4 (Site Settings/Leads)
3. Histórias completam e se integram de forma independente (todas consomem apenas os componentes
   da Foundational, nunca umas às outras)

---

## Notes

- `[P]` = arquivos diferentes, sem dependência entre si
- Rótulo `[Story]` mapeia a tarefa à história de usuário correspondente
- FR-012 é a restrição mais importante desta feature: toda tarefa de UI preserva literalmente
  `id`/`htmlFor`/`role`/`aria-*`/estrutura semântica já existente — apenas `className` e wrappers
  puramente visuais são adicionados
- Rodar a suíte de testes (ao menos os arquivos relevantes) ao final de cada história, não só no
  final de tudo — quebras de seletor são mais baratas de corrigir perto de onde foram introduzidas
- Fazer commit após cada tarefa ou grupo lógico de tarefas
- Parar em qualquer checkpoint para validar uma história isoladamente
- Evitar: tarefas vagas, conflito no mesmo arquivo entre tarefas `[P]`, dependências entre histórias
  que quebrem a independência (US3/US4 nunca devem importar um do outro — ambas só dependem da
  Foundational)
