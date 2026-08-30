---

description: "Task list template for feature implementation"
---

# Tasks: Painel Administrativo — Integração com a Guacamayo API

**Input**: Design documents from `/specs/006-admin-panel-integration/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Incluídos proporcionalmente ao risco (Constitution Principle IV) — não é TDD estrito
("vermelho antes do verde" não é exigido), mas lógica crítica (armazenamento/renovação de sessão,
cliente HTTP com retry/conflito, validações de negócio) e os fluxos principais de cada história têm
cobertura obrigatória via Vitest (unit/integração) e Playwright (e2e), reaproveitando as ferramentas
já configuradas no projeto — nenhuma dependência de teste nova.

**Organization**: Tarefas agrupadas por história de usuário (spec.md), na ordem de prioridade
P1 → P4, para permitir implementação e entrega incremental independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de uma tarefa ainda não
  concluída)
- **[Story]**: A qual história de usuário a tarefa pertence (US1–US4); ausente em Setup/Foundational/Polish
- Caminhos de arquivo exatos em cada descrição

## Path Conventions

Projeto único Next.js (App Router) já estabelecido — `src/`, `tests/` na raiz do repositório,
exatamente como descrito em `plan.md` § Project Structure. Nenhuma estrutura nova de alto nível é
introduzida além dos diretórios já detalhados lá (`src/**/admin/`, `src/context/`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuração mínima compartilhada por toda a área administrativa, sem dependência de
nenhuma história específica.

- [X] T001 [P] Criar `src/lib/admin-api-config.ts` exportando `ADMIN_API_BASE_URL` a partir de
      `process.env.NEXT_PUBLIC_API_BASE_URL`, com fallback `"http://localhost:5249"`
      (research.md Decision 9; mesmo padrão de `src/lib/site.ts`).
- [X] T002 [P] Atualizar `src/app/robots.ts` adicionando uma regra `disallow: "/admin"` ao objeto
      de retorno (research.md Decision 6) — não afeta a regra `allow: "/"` já existente para o
      restante do site.

**Checkpoint**: Nenhuma dependência pendente para o início da Fase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sessão do administrador, cliente HTTP e proteção de rota — infraestrutura sem a qual
**nenhuma** das quatro histórias de usuário pode ser implementada ou testada (login é a própria
US1, mas o mecanismo de token/refresh/guarda de rota é compartilhado por todas as telas
subsequentes, US2–US4).

**⚠️ CRITICAL**: Nenhuma tarefa de história de usuário começa antes desta fase estar completa.

- [X] T003 [P] Criar tipos compartilhados `LocalizedText`, `RowVersion`, `ApiError` em
      `src/domain/admin/shared.ts` (data-model.md § Tipos compartilhados).
- [X] T004 [P] Criar o tipo `AdminSession` (`accessToken`, `accessTokenExpiresAt`, `refreshToken`,
      `displayName`) em `src/domain/admin/auth.ts` (data-model.md § Sessão do Administrador).
- [X] T005 Criar a store de sessão em `src/domain/admin/auth-store.ts`: singleton em módulo,
      persistência em `localStorage`, leitura/escrita compatíveis com `useSyncExternalStore`
      (mesmo padrão de `src/i18n/LanguageContext.tsx#createLanguageStore`), e agendamento via
      `setTimeout` da renovação automática a partir de `accessTokenExpiresAt` — nunca do relógio
      local (FR-003; research.md Decision 3). Depende de T004.
- [X] T006 [P] Criar `src/services/admin/auth-service.ts` com `login(email, password)`,
      `refresh(refreshToken)` e `logout(refreshToken)`, chamando `POST /api/auth/login`,
      `/api/auth/refresh`, `/api/auth/logout` diretamente (sem passar pelo cliente genérico da
      T007, para evitar dependência circular) e decodificando o envelope de erro em `ApiError`
      (contracts/auth.md). Depende de T003.
- [X] T007 Criar `src/services/admin/api-client.ts`: monta a URL a partir de
      `ADMIN_API_BASE_URL` (T001), injeta `Authorization: Bearer <accessToken>` lido de
      `auth-store` (T005), decodifica o envelope `{isSuccess, data, error}`; em `401` fora do
      login/refresh, chama `auth-service.refresh()` (T006) uma única vez e repete a chamada
      original — se o refresh falhar, força logout via `auth-store` (FR-004); em `409` com
      `error.code === "CONCURRENT_MODIFICATION"`, lança um `ConflictError` distinto; qualquer
      outra falha lança `ApiError` (T003). Depende de T003, T005, T006 (research.md Decision 4).
- [X] T008 Criar `src/context/AdminAuthContext.tsx`: `AdminAuthProvider` + hook `useAdminAuth()`
      expondo `{ status: "loading" | "authenticated" | "unauthenticated", admin, login, logout }`,
      envolvendo `auth-store` (T005) e `auth-service` (T006). Depende de T005, T006.
- [X] T009 Criar `src/components/admin/AdminNav.tsx`: cabeçalho/nav do painel com o nome do
      administrador (`useAdminAuth().admin`) e botão "Sair" (`useAdminAuth().logout` — FR-005); a
      lista de links de navegação começa vazia e cada história de usuário subsequente adiciona seu
      próprio link (T043/T054/T060 abaixo). Depende de T008.
- [X] T010 Criar `src/app/admin/layout.tsx` (Client Component): envolve `children` em
      `AdminAuthProvider` (T008) + `AdminNav` (T009); redireciona para `/admin/login` quando
      `status === "unauthenticated"` em qualquer rota `/admin/**` exceto a própria
      `/admin/login` (FR-007), **anexando o caminho atual como `?from=<pathname>`** ao redirecionar
      (ex.: `/admin/login?from=%2Fadmin%2Frooms%2Fedit%3Fid%3D123`) — é esse parâmetro que T014
      lê para cumprir FR-008 ("levar à tela originalmente pretendida"); redireciona
      já-autenticados para longe de `/admin/login` (FR-007a); exporta
      `metadata = { robots: { index: false, follow: false } }` (research.md Decision 6).
      Depende de T008, T009.
- [X] T011 [P] Teste unitário de `auth-store` em `tests/unit/admin/auth-store.test.ts`:
      persiste/lê de `localStorage`, agenda a renovação a partir de `accessTokenExpiresAt`
      (não do relógio local), limpa tudo em logout/logout forçado. Depende de T005.
- [X] T012 [P] Teste unitário de `api-client` em `tests/unit/admin/api-client.test.ts`
      (mockando `global.fetch` — research.md Decision 5): sucesso decodifica `data`; `422` vira
      `ApiError` com `details`; `401` dispara refresh e repete a chamada original com sucesso;
      `401` com refresh também falhando força logout; `409 CONCURRENT_MODIFICATION` vira
      `ConflictError`. Depende de T007.

**Checkpoint**: Fundação pronta — autenticação, cliente HTTP e proteção de rota funcionam de ponta
a ponta; as histórias de usuário podem começar.

---

## Phase 3: User Story 1 - Login e sessão persistente do administrador (Priority: P1) 🎯 MVP

**Goal**: Um administrador autentica com email/senha, permanece logado enquanto usa o painel (com
renovação automática e transparente do token) e consegue encerrar a sessão explicitamente.

**Independent Test**: Abrir `/admin/login`, autenticar com credenciais válidas e inválidas,
permanecer além da expiração do token de acesso (renovação automática), acessar `/admin`
diretamente sem sessão (redireciona ao login) e, por fim, sair pelo botão "Sair".

### Implementação da User Story 1

- [X] T013 [US1] Criar `src/components/admin/LoginForm.tsx`: campos de email/senha, chama
      `useAdminAuth().login()`, exibe a mensagem genérica de credenciais inválidas em `401
      INVALID_CREDENTIALS` sem distinguir a causa (FR-001, FR-006).
- [X] T014 [US1] Criar `src/app/admin/login/page.tsx` renderizando `LoginForm` (T013); ao
      autenticar com sucesso, lê `?from=` (anexado pelo redirecionamento de T010, se a visita veio
      de uma tentativa de acesso não autenticada) e navega para lá; se `?from=` estiver ausente
      (login direto, não via redirecionamento), navega para `/admin` (FR-008). Depende de T010.
- [X] T015 [US1] Criar `src/app/admin/page.tsx`: landing pós-login, redireciona para
      `/admin/rooms` assim que `status === "authenticated"`.
- [X] T016 [P] [US1] Teste de integração em `tests/integration/admin/login.test.tsx`: login
      válido redireciona; login inválido mostra mensagem genérica; acesso direto a uma rota
      protegida sem sessão redireciona ao login.
- [X] T017 [P] [US1] Teste e2e em `tests/e2e/admin/auth.spec.ts` (mockando a API via
      `page.route()`): fluxo completo de login → uso → logout → tentativa de voltar a uma rota
      administrativa exige novo login; renovação automática simulada não interrompe a navegação;
      falha simulada de refresh força volta ao login (SC-001, SC-002, SC-007).

**Checkpoint**: User Story 1 completa e testável de forma independente — é o MVP.

---

## Phase 4: User Story 2 - Gestão de conteúdo do site: Quartos, Espaços de Evento e Depoimentos (Priority: P2)

**Goal**: Listar, criar, editar (com bloqueio de publicação por campo obrigatório vazio em algum
idioma e detecção de conflito de edição simultânea) e excluir (com confirmação) Quartos, Espaços de
Evento e Depoimentos.

**Independent Test**: A partir de uma sessão autenticada (US1), abrir a listagem de um dos três
tipos de conteúdo, criar um item preenchendo os três idiomas, editá-lo, tentar publicá-lo com um
idioma vazio (deve bloquear), e excluí-lo confirmando a ação — repetir para os outros dois tipos.

### Domínio e validação (User Story 2)

- [X] T018 [P] [US2] Criar tipo `AdminRoom` em `src/domain/admin/rooms.ts` (data-model.md § Quarto administrativo).
- [X] T019 [P] [US2] Criar tipo `AdminEventSpace` em `src/domain/admin/event-spaces.ts` (data-model.md).
- [X] T020 [P] [US2] Criar tipo `AdminTestimonial` em `src/domain/admin/testimonials.ts` (data-model.md).
- [X] T021 [P] [US2] Criar `validateRequiredPerLanguage(text: LocalizedText): LanguageCode[]` em
      `src/domain/admin/content-validation.ts` — retorna os idiomas com o campo vazio; usado para
      bloquear a publicação (FR-012).
- [X] T022 [P] [US2] Teste unitário em `tests/unit/admin/content-validation.test.ts` (todos os
      idiomas preenchidos → `[]`; um ou mais vazios → lista correta).

### Serviços (User Story 2)

- [X] T023 [P] [US2] Criar `src/services/admin/rooms-service.ts` (`list`, `get`, `create`,
      `update`, `remove`, via `api-client` — T007) cobrindo `/api/admin/rooms*`
      (contracts/content.md). Depende de T007, T018.
- [X] T024 [P] [US2] Criar `src/services/admin/event-spaces-service.ts` (mesmo shape, T007,
      T019, `/api/admin/event-spaces*`).
- [X] T025 [P] [US2] Criar `src/services/admin/testimonials-service.ts` (mesmo shape, T007,
      T020, `/api/admin/testimonials*`).

### Componentes compartilhados (introduzidos aqui, reusados por US3/US4)

- [X] T026 [P] [US2] Criar `src/components/admin/LanguageTabs.tsx`: abas pt/en/es
      (`SUPPORTED_LANGUAGES` de `src/i18n/languages.ts`) para alternar o campo de texto ativo de
      um `LocalizedText`.
- [X] T027 [P] [US2] Criar `src/components/admin/LoadingIndicator.tsx` (FR-024a).
- [X] T028 [P] [US2] Criar `src/components/admin/ErrorToast.tsx` e
      `src/components/admin/FieldError.tsx`: `ErrorToast` para mensagens genéricas a partir de
      `ApiError.code`/`message` (FR-025, FR-027); `FieldError` para exibir
      `ApiError.details[].field` junto ao campo do formulário correspondente (FR-026).
- [X] T029 [P] [US2] Criar `src/components/admin/ConflictBanner.tsx`: aviso de
      `ConflictError` com ação "Recarregar" (FR-014/017/024).
- [X] T030 [P] [US2] Criar `src/components/admin/ConfirmDialog.tsx` com duas variantes de
      mensagem — exclusão permanente (mais enfática, FR-013) e descarte de alterações não salvas
      (FR-017a) — nunca a mesma redação para as duas.
- [X] T031 [US2] Criar `src/components/admin/UnsavedChangesGuard.tsx`: intercepta navegação
      interna (App Router) e fechamento de aba (`beforeunload`) quando há alterações não salvas,
      usando `ConfirmDialog` (T030) na variante de descarte (FR-017a). Depende de T030.
- [X] T032 [US2] Criar `src/components/admin/ContentForm.tsx`: formulário genérico
      parametrizável (campos multilíngues via `LanguageTabs` — T026, `isPublished`,
      `displayOrder`, um slot para o campo específico do tipo — comodidades/contexto de
      contato/atribuição), integrado a `validateRequiredPerLanguage` (T021) e
      `UnsavedChangesGuard` (T031); em submissão que retornar `422 VALIDATION_ERROR` da própria
      API (validação client-side não cobre tudo — a API continua sendo a fonte de verdade,
      data-model.md), mapeia `ApiError.details[].field` para `FieldError` (T028) no campo/idioma
      correspondente (FR-026). Usado pelas telas de criação/edição dos três tipos de conteúdo.
      Depende de T021, T026, T028, T031.
- [X] T033 [US2] Criar `src/components/admin/ContentTable.tsx`: listagem genérica (colunas
      configuráveis) com ação de excluir via `ConfirmDialog` (T030) na variante de exclusão,
      `LoadingIndicator` (T027) durante o carregamento, e `ErrorToast` (T028) quando o `GET` da
      listagem falhar (Principle II — "consistent loading, error and empty states"; mesmo padrão
      já usado em T052/T059). Depende de T027, T028, T030.

### Páginas — Quartos

- [X] T034 [US2] Criar `src/app/admin/rooms/page.tsx` (listagem via `ContentTable` + `rooms-service`).
- [X] T035 [US2] Criar `src/app/admin/rooms/new/page.tsx` (`ContentForm` + `rooms-service.create`).
- [X] T036 [US2] Criar `src/app/admin/rooms/edit/page.tsx` (lê `?id=` via `useSearchParams`;
      exibe `LoadingIndicator` — T027 — enquanto `rooms-service.get(id)` carrega; em
      `404 NOT_FOUND` (item excluído por outra pessoa nesse meio-tempo), mostra "item não
      encontrado" em vez do formulário — FR-008 Edge Case, contracts/content.md; renderiza
      `ContentForm` + `rooms-service.update`, exibindo `ConflictBanner` — T029 — em `409`).

### Páginas — Espaços de Evento

- [X] T037 [US2] Criar `src/app/admin/event-spaces/page.tsx` (mesmo padrão de T034, `event-spaces-service`).
- [X] T038 [US2] Criar `src/app/admin/event-spaces/new/page.tsx` (mesmo padrão de T035, `event-spaces-service`).
- [X] T039 [US2] Criar `src/app/admin/event-spaces/edit/page.tsx` (`?id=`, mesmo padrão de T036 —
      `LoadingIndicator` ao buscar, `404 NOT_FOUND` tratado, `ConflictBanner` em `409` —
      `event-spaces-service`).

### Páginas — Depoimentos

- [X] T040 [US2] Criar `src/app/admin/testimonials/page.tsx` (mesmo padrão de T034, `testimonials-service`).
- [X] T041 [US2] Criar `src/app/admin/testimonials/new/page.tsx` (mesmo padrão de T035, `testimonials-service`).
- [X] T042 [US2] Criar `src/app/admin/testimonials/edit/page.tsx` (`?id=`, mesmo padrão de T036 —
      `LoadingIndicator` ao buscar, `404 NOT_FOUND` tratado, `ConflictBanner` em `409` —
      `testimonials-service`).

### Integração e testes (User Story 2)

- [X] T043 [US2] Atualizar `src/components/admin/AdminNav.tsx` (criado em T009) adicionando os
      links "Quartos", "Espaços de Evento" e "Depoimentos".
- [X] T044 [P] [US2] Teste de integração em `tests/integration/admin/rooms-crud.test.tsx`:
      listar, criar, bloquear publicação com idioma vazio, editar, excluir com confirmação,
      cancelar exclusão, conflito de concorrência, aviso de alterações não salvas — este arquivo
      é o padrão a replicar manualmente para Espaços de Evento e Depoimentos (mesma cobertura,
      trocando o serviço/rota).
- [X] T045 [P] [US2] Teste e2e em `tests/e2e/admin/content-crud.spec.ts` cobrindo o roteiro do
      `quickstart.md` passo 2 e 3 para os três tipos de conteúdo.

**Checkpoint**: User Stories 1 e 2 funcionam de forma independente e conjunta.

---

## Phase 5: User Story 3 - Gestão de leads capturados pelo bot de WhatsApp (Priority: P3)

**Goal**: Listar leads paginados/filtrados por status e data, ver o detalhe com o histórico
completo de mensagens, e alterar o status livremente entre Novo/Contatado/Fechado.

**Independent Test**: A partir de uma sessão autenticada (US1), abrir a listagem de leads, filtrar
por status e por um intervalo de datas, abrir o detalhe de um lead com e sem conversa associada, e
alterar seu status — sem depender das telas de conteúdo (US2).

### Domínio, validação e serviço (User Story 3)

- [X] T046 [P] [US3] Criar tipos `Lead`, `LeadMessage`, `LeadStatus` em
      `src/domain/admin/leads.ts` (data-model.md § Lead — `status`: `0` Novo, `1` Contatado,
      `2` Fechado).
- [X] T047 [P] [US3] Criar `validateDateRange(from?, to?): boolean` em
      `src/domain/admin/leads-validation.ts` (FR-020 — `from` não pode ser posterior a `to`).
- [X] T048 [P] [US3] Teste unitário em `tests/unit/admin/leads-validation.test.ts`.
- [X] T049 [US3] Criar `src/services/admin/leads-service.ts` (`list({status, from, to, skip,
      take: 20})`, `get(id)`, `updateStatus(id, status, rowVersion)`, via `api-client` — T007;
      contracts/leads.md). Depende de T007, T046.

### Componentes e páginas (User Story 3)

- [X] T050 [P] [US3] Criar `src/components/admin/LeadFilters.tsx` (filtro de status + intervalo
      de datas, usando `validateDateRange` — T047 — antes de disparar a busca).
- [X] T051 [P] [US3] Criar `src/components/admin/LeadStatusControl.tsx` (transição livre entre
      os três status — spec.md Clarifications 2026-08-25 —, integrado a `ConflictBanner` — T029
      — em `409`).
- [X] T052 [US3] Criar `src/app/admin/leads/page.tsx`: listagem paginada (20/página),
      `LeadFilters` (T050), `LoadingIndicator`/`ErrorToast` (T027/T028), mais recentes primeiro.
- [X] T053 [US3] Criar `src/app/admin/leads/detail/page.tsx` (`?id=`): exibe `LoadingIndicator`
      (T027) enquanto `leads-service.get(id)` carrega; em `404 NOT_FOUND` (lead não existe mais),
      mostra "item não encontrado" em vez do detalhe (contracts/leads.md); nome/telefone com
      indicador "não informado" quando ausentes (FR-021), histórico de mensagens (vazio tratado
      como estado normal — FR-022), `LeadStatusControl` (T051). Depende de T027, T049, T051.
- [X] T054 [US3] Atualizar `AdminNav` (T009) adicionando o link "Leads".

### Testes (User Story 3)

- [X] T055 [P] [US3] Teste de integração em `tests/integration/admin/leads.test.tsx`: listar,
      filtrar (incluindo intervalo de datas inválido bloqueado no cliente), abrir detalhe com e
      sem conversa, alterar status em ambas as direções, conflito de concorrência.
- [X] T056 [P] [US3] Teste e2e em `tests/e2e/admin/leads.spec.ts` cobrindo o roteiro do
      `quickstart.md` passo 5.

**Checkpoint**: User Stories 1, 2 e 3 funcionam de forma independente e conjunta.

---

## Phase 6: User Story 4 - Edição das Configurações do Site (Priority: P4)

**Goal**: Visualizar e editar o registro único de Configurações do Site, sem opção de
criar/excluir, com a mesma proteção de conflito de concorrência das demais entidades.

**Independent Test**: A partir de uma sessão autenticada (US1), abrir a tela de Configurações do
Site, alterar um campo e salvar, confirmando que não há nenhuma ação de criar/excluir — sem
depender de US2 ou US3.

- [X] T057 [P] [US4] Criar tipo `AdminSiteSettings` em `src/domain/admin/site-settings.ts`
      (data-model.md § Configurações do Site — campos 🔶 a confirmar contra o primeiro `GET`
      real).
- [X] T058 [US4] Criar `src/services/admin/site-settings-service.ts` (`get`, `update`, via
      `api-client` — T007; contracts/content.md). Depende de T007, T057.
- [X] T059 [US4] Criar `src/app/admin/site-settings/page.tsx`: formulário único (sem
      `LanguageTabs`, campos não multilíngues), reusando `UnsavedChangesGuard` (T031),
      `ConflictBanner` (T029), `LoadingIndicator`/`ErrorToast` (T027/T028) — nenhuma ação de
      criar/excluir renderizada (FR-016).
- [X] T060 [US4] Atualizar `AdminNav` (T009) adicionando o link "Configurações do Site".
- [X] T061 [P] [US4] Teste de integração em `tests/integration/admin/site-settings.test.tsx`:
      carregar, editar, salvar, conflito de concorrência, aviso de alterações não salvas,
      ausência de ações de criar/excluir.

**Checkpoint**: As quatro histórias de usuário funcionam de forma independente e conjunta — escopo
completo da spec implementado.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificações finais que atravessam todas as histórias, antes de considerar a feature
pronta para revisão.

- [X] T062 Rodar `npm run typecheck`, `npm run lint`, `npm run test` e `npm run test:e2e` —
      todos passando, cobrindo T011–T061.
- [X] T063 [P] Executar o roteiro de validação manual do `quickstart.md` (§ Roteiro de validação
      manual) contra a Guacamayo API local real (`http://localhost:5249`).
- [X] T064 [P] Confirmar que `/admin/**` está ausente de `out/sitemap.xml` e presente como
      `Disallow` em `out/robots.txt` após `npm run build` (research.md Decision 6, T002).
- [X] T065 [P] Revisão mínima de acessibilidade nos formulários/tabelas do admin (labels
      associados, foco visível, semântica de `<button>`/`<table>`) — escopo de boa prática
      definido em research.md Decision 7, não uma auditoria formal WCAG.
- [X] T066 [P] Medir o tempo de carregamento das listagens de `/admin/rooms` e `/admin/leads`
      (DevTools/Lighthouse ou uma asserção de tempo no Playwright) com até 100 itens, contra o
      orçamento de SC-009 (≤3s sob condições normais de rede); registrar o resultado no
      `quickstart.md` ou em uma nota de validação — se o orçamento não for atingido, abrir um
      item de acompanhamento em vez de silenciar a falha.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: Depende de Setup. **Bloqueia** todas as histórias de usuário.
- **User Story 1 (Phase 3)**: Depende só de Foundational.
- **User Story 2 (Phase 4)**: Depende só de Foundational — não depende de US1 estar "pronta" em
  produção, mas na prática precisa de uma sessão autenticada para ser exercitada manualmente (US1
  fornece essa sessão).
- **User Story 3 (Phase 5)**: Depende só de Foundational; reusa componentes criados em US2
  (`ConflictBanner`, `LoadingIndicator`, `ErrorToast`) — se US2 ainda não foi implementada, essas
  tarefas específicas (T029, T027, T028) precisam ser adiantadas antes de T050–T053.
- **User Story 4 (Phase 6)**: Depende só de Foundational; reusa `UnsavedChangesGuard` (T031),
  `ConflictBanner` (T029), `LoadingIndicator`/`ErrorToast` (T027/T028) de US2 pela mesma razão.
- **Polish (Phase 7)**: Depende de todas as histórias desejadas estarem completas.

### User Story Dependencies

- **US1 (P1)**: Nenhuma dependência de outra história — é a base técnica, mas não bloqueia US2–US4
  no código (só na prática de teste manual, que exige login).
- **US2 (P2)**: Nenhuma dependência funcional de US1/US3/US4; introduz os componentes
  compartilhados (`LanguageTabs`, `LoadingIndicator`, `ErrorToast`/`FieldError`, `ConflictBanner`,
  `ConfirmDialog`, `UnsavedChangesGuard`) que US3 e US4 reutilizam.
- **US3 (P3)**: Reusa componentes de US2 (ver acima) — se implementada antes de US2, essas poucas
  tarefas de componente precisam ser adiantadas.
- **US4 (P4)**: Mesma observação de reuso de US2 que US3.

### Dentro de cada história

- Tipos de domínio antes de serviços; serviços antes de páginas; componentes compartilhados antes
  das páginas que os consomem; implementação antes dos testes de integração/e2e daquela história.

### Parallel Opportunities

- T001/T002 (Setup) em paralelo.
- T003/T004 (Foundational) em paralelo; T006 pode rodar em paralelo com T005 (dependem só de
  T003/T004); T011/T012 (testes fundacionais) em paralelo entre si após T005/T007.
- Dentro de US2: T018–T020 (tipos) em paralelo; T023–T025 (serviços) em paralelo; T026–T030
  (componentes sem dependência entre si) em paralelo; T044/T045 (testes) em paralelo.
- Dentro de US3: T046/T047/T048 em paralelo; T050/T051 em paralelo; T055/T056 em paralelo.
- Dentro de US4: T057 isolado; T061 em paralelo com nada mais na fase (única tarefa `[P]` restante
  depois das dependências sequenciais T058–T060).
- Uma vez Foundational completa, US2, US3 e US4 podem ser trabalhadas por pessoas diferentes em
  paralelo, desde que os componentes compartilhados de US2 (T026–T031) sejam adiantados primeiro
  para quem pegar US3/US4.

---

## Parallel Example: User Story 2

```bash
# Tipos de domínio em paralelo:
Task: "Criar tipo AdminRoom em src/domain/admin/rooms.ts"
Task: "Criar tipo AdminEventSpace em src/domain/admin/event-spaces.ts"
Task: "Criar tipo AdminTestimonial em src/domain/admin/testimonials.ts"

# Serviços em paralelo (após os tipos acima):
Task: "Criar src/services/admin/rooms-service.ts"
Task: "Criar src/services/admin/event-spaces-service.ts"
Task: "Criar src/services/admin/testimonials-service.ts"

# Componentes compartilhados sem dependência entre si, em paralelo:
Task: "Criar src/components/admin/LanguageTabs.tsx"
Task: "Criar src/components/admin/LoadingIndicator.tsx"
Task: "Criar src/components/admin/ErrorToast.tsx e FieldError.tsx"
Task: "Criar src/components/admin/ConflictBanner.tsx"
Task: "Criar src/components/admin/ConfirmDialog.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Completar Fase 1: Setup
2. Completar Fase 2: Foundational (crítico — bloqueia todas as histórias)
3. Completar Fase 3: User Story 1
4. **Parar e validar**: testar login/sessão/logout independentemente
5. Já é demonstrável: acesso autenticado ao painel, mesmo sem nenhuma tela de conteúdo ainda

### Entrega incremental

1. Setup + Foundational → fundação pronta
2. + User Story 1 → testar independentemente → demo (MVP)
3. + User Story 2 → testar independentemente → demo (CRUD de conteúdo completo)
4. + User Story 3 → testar independentemente → demo (leads deixam de ser invisíveis)
5. + User Story 4 → testar independentemente → demo (escopo completo da spec)
6. Cada história agrega valor sem quebrar as anteriores.

### Estratégia de equipe paralela

Após Foundational: uma pessoa em US2 (adiantando os componentes compartilhados T026–T031), outras
duas em US3 e US4 assim que esses componentes estiverem prontos — ou as três em série, na ordem de
prioridade P1→P2→P3→P4, se for um único desenvolvedor.

---

## Notes

- `[P]` = arquivos diferentes, sem dependência entre as tarefas marcadas.
- O rótulo de história (`[US#]`) mapeia a tarefa à spec.md para rastreabilidade.
- Cada história deve ser completável e testável de forma independente.
- Fazer commit após cada tarefa ou grupo lógico de tarefas.
- Parar em qualquer checkpoint para validar uma história isoladamente.
- Os campos marcados 🔶 em `data-model.md` (schema exato de Configurações do Site, enum de
  `interest` do Lead, `attribution`/`experienceType` de Depoimento) devem ser confirmados contra a
  API local real assim que possível durante a implementação de T018–T020/T046/T057 — ajustar o
  tipo TypeScript correspondente se o formato real divergir da inferência documentada.
- **Correções aplicadas em 2026-08-26 a partir do `/speckit-analyze`**: T032/T033 ganharam
  `ErrorToast`/`FieldError` (violação da Constitution Principle II — estados de carregamento/erro
  inconsistentes); T036/T039/T042/T053 ganharam `LoadingIndicator` e tratamento de
  `404 NOT_FOUND` ao buscar um único item; T010/T014 tiveram o handoff de `?from=` corrigido
  (FR-008 não era cumprido como escrito); T066 foi adicionada para verificar SC-009
  (sem tarefa de medição de performance antes desta correção).
- **Ajustes feitos durante a implementação de Setup/Foundational/US1 (2026-08-26)**:
  - `AdminAuthContext` (T008) não tem um estado `"loading"` separado — a leitura de
    `localStorage` é síncrona e `useSyncExternalStore` já garante que o primeiro efeito a
    observar `status` vê o valor real, nunca o `getServerSnapshot` transitório; um `"loading"`
    nunca seria observável, então foi omitido.
  - `src/app/admin/layout.tsx` (T010) **não é** um Client Component como descrito — Next.js só
    permite exportar `metadata` de um Server Component. `layout.tsx` ficou como Server Component
    (só exporta `metadata`) e toda a lógica interativa (sessão, guarda de rota, `?from=`) foi
    extraída para um novo Client Component, `src/components/admin/AdminShell.tsx`.
  - A leitura do `?from=` pós-login **não** vive em `LoginForm`/`login/page.tsx` (T013/T014) —
    fica inteiramente em `AdminShell`/`AdminRouteGuard` (a mesma peça que já produz o `?from=`
    ao redirecionar para o login), para evitar uma corrida entre dois redirecionamentos
    independentes decidindo destinos diferentes. `LoginForm` não navega; só autentica.
  - `useSearchParams()` em `AdminShell` exige um `<Suspense>` sob `output: "export"` — adicionado
    (sem isso o `npm run build` falha).
  - Foi criado `src/app/admin/rooms/page.tsx` como placeholder mínimo (fora do escopo estrito de
    Setup/Foundational/US1) só para que o redirecionamento pós-login de T015 resolva para uma
    rota real dentro do layout `/admin`, em vez de um 404 fora dele — necessário para que US1
    seja testável de ponta a ponta antes de US2 existir. Será substituído pela listagem real em
    T034.
