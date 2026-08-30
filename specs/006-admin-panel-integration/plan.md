# Implementation Plan: Painel Administrativo — Integração com a Guacamayo API

**Branch**: `006-admin-panel-integration` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-admin-panel-integration/spec.md`

## Summary

Adicionar uma área administrativa (`/admin/**`) ao site Next.js existente, consumindo a Guacamayo
API (repositório separado, já pronta e testada) para: autenticação com renovação automática de
sessão (JWT + refresh token rotativo); CRUD multilíngue (pt/en/es) de Quartos, Espaços de Evento e
Depoimentos com concorrência otimista via `rowVersion`; edição do registro único de Configurações
do Site; e uma gestão de Leads (listagem paginada/filtrada, detalhe com histórico de conversa,
alteração de status) hoje completamente ausente de qualquer tela. Como o projeto usa
`output: "export"` (build 100% estático, GitHub Pages, sem servidor em produção — ver
`next.config.ts`), toda a área administrativa é implementada como Client Components dentro do App
Router: autenticação, chamadas à API e proteção de rota acontecem inteiramente no navegador, sem
middleware, API routes ou SSR (`research.md` Decision 1). Nenhuma dependência de runtime nova é
necessária — o padrão de store client-side já usado por `LanguageContext` é reaproveitado para a
sessão do administrador (`research.md` Decision 3).

## Technical Context

**Language/Version**: TypeScript 5 (strict mode já configurado), React 19.2.4, Next.js 16.2.11
(App Router, Turbopack) — mesma stack já em uso, nenhuma versão nova.

**Primary Dependencies**: Apenas as já existentes no projeto (`next`, `react`, `react-dom`).
Nenhuma dependência de runtime nova: sem biblioteca de data-fetching (TanStack Query/SWR — avaliada
e rejeitada, `research.md` Decision 4), sem gerenciador de estado global (Zustand/Redux — rejeitado,
Decision 3), sem cliente HTTP de terceiros (`fetch` nativo, tipado em `src/services/admin/`).

**Storage**: N/A no servidor (site estático, sem backend próprio). Client-side: `localStorage` para
a sessão do administrador (tokens + `displayName`), mesmo mecanismo já usado por
`src/i18n/LanguageContext.tsx` para a preferência de idioma. Todos os dados de negócio (quartos,
leads, etc.) vivem exclusivamente na Guacamayo API remota — nenhum dado administrativo é persistido
localmente além da sessão.

**Testing**: Vitest + React Testing Library (unit/integração dos componentes e do `api-client.ts`,
mockando `fetch` — `research.md` Decision 5), Playwright (e2e dos fluxos críticos de
`quickstart.md`, mockando a API via `page.route()` para determinismo em CI). Mesmas ferramentas já
configuradas no projeto; nenhuma dependência de teste nova (MSW avaliado e rejeitado).

**Target Platform**: Export estático (`output: "export"`) servido pelo GitHub Pages, sem servidor em
produção; navegadores evergreen. Diferente das páginas públicas, o admin **não** é mobile-first por
requisito (spec.md Assumptions: uso interno, majoritariamente desktop) — mas nada impede que
funcione em telas menores, apenas não há orçamento dedicado a isso nesta versão.

**Project Type**: Aplicação web única (Next.js App Router), sem separação frontend/backend — Opção
1 do template de plano, mesma estrutura já em uso pelas features anteriores. O "backend" desta
feature é um serviço externo já pronto (Guacamayo API), não algo implementado neste repositório.

**Performance Goals**: SC-009 da spec — listagens de até 100 itens prontas para interação em até 3s
sob condições normais de rede. Sem orçamento de Core Web Vitals/LCP formal (não é página pública
indexável) — `robots.ts`/`sitemap.ts` excluem `/admin/**` explicitamente (`research.md` Decision 6).

**Constraints**: Compatibilidade obrigatória com `output: "export"` — nenhuma rota administrativa
pode depender de `generateStaticParams` dinâmico para IDs vindos da API; detalhes/edições por ID
usam query string, não segmentos de rota `[id]` (`research.md` Decision 2). Renovação de sessão
nunca pode derrubar um formulário em preenchimento (FR-003/SC-002). Todo `PUT` de entidade com
`rowVersion` deve reenviá-lo e tratar `409 CONCURRENT_MODIFICATION` de forma uniforme (FR-014/017/024).

**Scale/Scope**: 4 histórias de usuário, ~10 rotas novas sob `/admin`, 6 entidades de domínio (Sessão,
Quarto, Espaço de Evento, Depoimento, Configurações do Site, Lead), 27+ requisitos funcionais já
detalhados em `spec.md`. Escala de uso: equipe interna pequena de uma pousada, não milhares de
usuários simultâneos.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — Camadas separadas: `src/domain/admin/*` (tipos),
      `src/services/admin/*` (chamadas HTTP tipadas), `src/domain/admin/auth-store.ts` +
      `AdminAuthContext` (estado de sessão), `src/components/admin/*` (apresentação),
      `src/app/admin/**` (composição de página/rota). Nenhum componente de apresentação chama
      `fetch` diretamente.
- [x] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — Único estado "global" é a sessão do
      administrador (necessidade documentada: sobreviver a navegação entre rotas para o timer de
      renovação automática funcionar — `research.md` Decision 3), reaproveitando um padrão já
      existente no projeto (`LanguageContext`) em vez de uma biblioteca nova. Zero dependências de
      runtime/teste novas (Decisions 3–5).
- [x] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — **N/A para as rotas `/admin/**`**: esta Principle regula
      "public experiences" (caminho de conversão de hóspedes); a área administrativa não é uma
      experiência pública e a própria spec já delimita esse escopo (`Assumptions`) —
      `research.md` Decision 7 documenta o raciocínio. As páginas públicas existentes permanecem
      inalteradas por esta feature.
- [x] A performance budget and Core Web Vitals targets are measurable for this feature. —
      SC-009 (listagens ≤100 itens prontas em ≤3s) é o orçamento aplicável; Core Web
      Vitals/LCP não se aplicam a rotas não-públicas e não-indexáveis (Decision 6).
- [x] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — Esta feature É a integração futura que a
      Principle II/V previa ("APIs, authentication... administration can be added without a UI
      rewrite"); nenhum backend é implementado neste repositório — a Guacamayo API já existe e é
      externa. Estados de loading/erro/vazio são requisito de primeira classe (FR-024a, FR-025–027,
      FR-022) e centralizados em `api-client.ts` (Decision 4), não implementados ad-hoc por tela.
- [x] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — SEO: `/admin/**` explicitamente
      excluído (Decision 6). Acessibilidade formal (WCAG) e responsividade mobile: fora do escopo
      documentado por decisão de produto (spec.md Assumptions + Decision 7), não uma exceção velada
      — boas práticas semânticas mínimas ainda se aplicam. Frontend QA: `quickstart.md` define o
      roteiro de validação manual contra a API local, além dos testes automatizados.

**Resultado**: Nenhuma violação — nada a registrar em Complexity Tracking. A única leitura que
exige justificativa (Principle III aparentemente não coberta) foi resolvida como **não aplicável a
esta feature** por escopo (área não-pública), não como uma exceção às custas de qualidade.

## Project Structure

### Documentation (this feature)

```text
specs/006-admin-panel-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/
│   ├── auth.md
│   ├── content.md
│   └── leads.md
├── checklists/
│   ├── requirements.md
│   └── spec-audit.md
└── tasks.md              # Phase 2 output (/speckit-tasks — not created by this command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── admin/
│       ├── layout.tsx                     # Client Component: AdminAuthProvider + guard
│       │                                  #   (redireciona para /admin/login se sem sessão —
│       │                                  #   exceto na própria rota de login, FR-007/FR-007a);
│       │                                  #   metadata { robots: { index: false, follow: false } }
│       ├── login/
│       │   └── page.tsx                   # FR-001, FR-002, FR-006
│       ├── page.tsx                       # Redireciona para /admin/rooms (landing pós-login)
│       ├── rooms/
│       │   ├── page.tsx                   # Listagem (FR-009)
│       │   ├── new/page.tsx               # Criação (FR-010)
│       │   └── edit/page.tsx              # ?id= — edição (FR-011/012), FR-017a
│       ├── event-spaces/                  # Mesmo padrão de rooms/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── edit/page.tsx
│       ├── testimonials/                  # Mesmo padrão de rooms/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── edit/page.tsx
│       ├── site-settings/
│       │   └── page.tsx                   # FR-015/016/017, FR-017a
│       └── leads/
│           ├── page.tsx                   # Listagem + filtros (FR-018/019/020)
│           └── detail/page.tsx            # ?id= — detalhe + status (FR-021–024)
│
├── domain/
│   └── admin/
│       ├── shared.ts                      # LocalizedText, RowVersion, ApiError (data-model.md)
│       ├── auth.ts                        # AdminSession
│       ├── auth-store.ts                  # Store singleton (localStorage + useSyncExternalStore,
│       │                                  #   agenda renovação — research.md Decision 3)
│       ├── rooms.ts                       # AdminRoom
│       ├── event-spaces.ts                # AdminEventSpace
│       ├── testimonials.ts                # AdminTestimonial
│       ├── content-validation.ts          # validateRequiredPerLanguage (FR-012)
│       ├── site-settings.ts               # AdminSiteSettings
│       ├── leads.ts                       # Lead, LeadMessage, LeadStatus
│       └── leads-validation.ts            # validateDateRange (FR-020)
│
├── services/
│   └── admin/
│       ├── api-client.ts                  # fetch tipado, envelope, refresh-then-retry, ConflictError
│       ├── auth-service.ts                # login/refresh/logout
│       ├── rooms-service.ts
│       ├── event-spaces-service.ts
│       ├── testimonials-service.ts
│       ├── site-settings-service.ts
│       └── leads-service.ts
│
├── context/
│   └── AdminAuthContext.tsx               # Provider + useAdminAuth() (consome auth-store.ts)
│
├── components/
│   └── admin/
│       ├── AdminNav.tsx                   # cabeçalho/nav + botão "Sair" (FR-005); cada história
│       │                                  #   adiciona seu próprio link de navegação
│       ├── LoginForm.tsx
│       ├── LanguageTabs.tsx               # abas pt/en/es reutilizadas pelos 3 formulários de conteúdo
│       ├── ContentForm.tsx                # formulário multilíngue genérico (Quarto/Espaço/Depoimento);
│       │                                  #   valida FR-012 no cliente e mapeia 422 da API via FieldError
│       ├── ContentTable.tsx               # listagem genérica (colunas configuráveis); loading + error state
│       ├── ConfirmDialog.tsx              # FR-013 (exclusão) e FR-017a (descarte) — mensagens distintas
│       ├── UnsavedChangesGuard.tsx        # FR-017a — intercepta navegação/fechamento de aba
│       ├── ConflictBanner.tsx             # FR-014/017/024 — aviso de 409 + ação "recarregar"
│       ├── ErrorToast.tsx / FieldError.tsx # FR-025/026/027
│       ├── LoadingIndicator.tsx           # FR-024a — usado em listagens E telas de detalhe/edição
│       ├── LeadStatusControl.tsx          # FR-023 — transição livre entre os 3 status
│       └── LeadFilters.tsx                # FR-019/020
│
└── lib/
    └── admin-api-config.ts                # NEXT_PUBLIC_API_BASE_URL + fallback (research.md Decision 9)

tests/
├── unit/
│   └── admin/
│       ├── auth-store.test.ts             # agendamento de renovação, persistência, logout
│       ├── api-client.test.ts             # envelope, 401→refresh→retry, 409→ConflictError, 422
│       ├── content-validation.test.ts     # FR-012
│       └── leads-validation.test.ts       # FR-020
├── integration/
│   └── admin/
│       ├── login.test.tsx                 # FR-001/002/006
│       ├── rooms-crud.test.tsx            # FR-009–014 (padrão repetido para event-spaces/testimonials)
│       ├── site-settings.test.tsx         # FR-015–017
│       └── leads.test.tsx                 # FR-018–024
└── e2e/
    └── admin/
        ├── auth.spec.ts                   # login, renovação simulada, logout, proteção de rota
        ├── content-crud.spec.ts           # criar/editar/publicar bloqueado/excluir/cancelar/conflito
        └── leads.spec.ts                  # listar/filtrar/detalhe/status/conflito
```

**Structure Decision**: Projeto único Next.js já estabelecido (Opção 1 do template) — a área
administrativa é um novo diretório de alto nível (`admin/`) espelhado em `app/`, `domain/`,
`services/` e `components/`, seguindo exatamente os mesmos princípios de separação por
responsabilidade já usados pelo restante do código (`content.ts`/`content-repository.ts`/
`LanguageContext.tsx` como precedentes diretos), sem introduzir um padrão arquitetural novo. Um
novo diretório `src/context/` é adicionado por ser o primeiro Context do projeto que não é
puramente de i18n (o padrão de `LanguageContext` vivia dentro de `src/i18n/` por ser específico
dali); manter o Context de autenticação em `src/context/` evita sugerir que autenticação é parte do
sistema de i18n.

## Complexity Tracking

*Sem violações do Constitution Check — seção não aplicável.*

## Correções pós-análise (2026-08-26)

O `/speckit-analyze` encontrou 3 achados CRITICAL (Constitution Principle II — "Async integrations
MUST expose consistent loading, error and empty states" — não honrada de forma consistente em
todas as telas), 2 HIGH (inconsistências entre tarefas) e 1 MEDIUM (esta própria árvore de arquivos
desatualizada em relação ao `tasks.md`). Todos foram corrigidos diretamente em `tasks.md` e nesta
árvore de arquivos (adição de `AdminNav.tsx`, `ContentForm.tsx`, `content-validation.ts`,
`leads-validation.ts` acima, que já existiam nas tarefas mas não aqui) — nenhuma decisão
arquitetural deste plano mudou, apenas o nível de detalhe de wiring por tela ficou explícito.
