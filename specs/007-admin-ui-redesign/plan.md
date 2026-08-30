# Implementation Plan: Redesign Visual do Painel Administrativo

**Branch**: `007-admin-ui-redesign` | **Date**: 2026-08-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-admin-ui-redesign/spec.md`

## Summary

Aplicar estilo visual profissional a todas as telas de `/admin/**` (login, casca de navegação,
listagens/formulários de Quartos/Espaços de Evento/Depoimentos, Configurações do Site, Leads), que
hoje renderizam HTML semântico sem nenhum `className` (confirmado em `LoginForm.tsx` e em todas as
páginas de `src/app/admin/**`). A abordagem técnica reaproveita integralmente o sistema de design já
maduro do site público — variáveis CSS customizadas em `src/app/globals.css` (cor, tipografia,
espaçamento, raio, sombra, modo escuro) e o padrão CSS Modules por componente já usado em
`src/components/ui/*.module.css` — sem introduzir Tailwind, um UI kit de terceiros ou qualquer nova
dependência de runtime (`research.md` Decision 1). Um pequeno conjunto de componentes de apresentação
reutilizáveis é adicionado em `src/components/admin/ui/` (Field, Card, Table, Banner) e o `Button`
público existente ganha uma variante `destructive`, evitando duplicar estilos entre ~15 telas
(`research.md` Decision 2). Nenhuma lógica, contrato de API, rota ou regra de negócio já entregue na
feature `006-admin-panel-integration` é alterada — apenas marcação e estilo (FR-012).

## Technical Context

**Language/Version**: TypeScript 5 (strict mode), React 19.2.4, Next.js 16.2.11 (App Router) — mesma
stack já em uso, nenhuma versão nova.

**Primary Dependencies**: Nenhuma dependência de runtime nova (`research.md` Decision 1). Apenas
`next`/`react`/`react-dom`, já existentes. Estilização via CSS Modules nativo do Next.js + variáveis
CSS customizadas já definidas em `src/app/globals.css` — confirmado que o projeto **não usa
Tailwind** nem qualquer UI kit (`package.json` não lista nenhum), então não há framework CSS a
migrar, só a aplicar pela primeira vez ao admin.

**Storage**: N/A — feature puramente de apresentação, nenhum dado novo, nenhuma mudança em
`localStorage`/API.

**Testing**: Vitest + React Testing Library + `jest-axe` (unit/integração), Playwright (e2e) — as
mesmas ferramentas já configuradas pela feature 006. Nenhuma dependência de teste nova (sem
Chromatic/Percy/visual regression — `research.md` Decision 7). A suíte existente deve continuar
passando com no máximo ajustes de seletor ligados à nova marcação (FR-012/SC-007); cobertura de
`jest-axe` é estendida às telas que ainda não tinham asserção de acessibilidade dedicada.

**Target Platform**: Export estático (`output: "export"`), GitHub Pages, sem servidor em produção —
inalterado. Diferente da decisão de escopo da feature 006 (admin não mobile-first "por requisito"),
esta feature eleva deliberadamente a barra: FR-010/FR-011 agora exigem ausência de rolagem horizontal
de 375px a 1440px e contraste/foco WCAG 2.2 AA em todo o admin — um refinamento de escopo desta
feature, não uma violação da decisão anterior (que apenas dizia "sem orçamento dedicado", não
proibia melhorá-lo).

**Project Type**: Aplicação web única (Next.js App Router), mesma estrutura de projeto já
estabelecida — Opção 1 do template, sem separação frontend/backend.

**Performance Goals**: Nenhuma regressão de performance sobre a linha de base já medida em
`006-admin-panel-integration/quickstart.md` (listagens de 100 itens ~337ms, 20 itens ~283ms contra
API mockada). CSS Modules do Next.js já faz tree-shaking/escopo por componente, então o custo
esperado é marginal (poucos KB de CSS adicional por rota). Sem orçamento formal de Core Web
Vitals/LCP — rotas não-públicas e não-indexáveis (`006-admin-panel-integration/research.md`
Decision 6, que permanece válida).

**Constraints**: FR-014/SC-006 — nenhuma nova dependência de `package.json`. FR-012 — nenhuma
mudança de comportamento, contrato de API, rota ou regra de negócio; a marcação semântica usada
pelos testes existentes (`role`, `aria-*`, associação `label`/`htmlFor`, estrutura de `<table>`)
deve ser preservada exatamente, apenas com `className` e wrappers puramente visuais adicionados.
FR-010/011 — responsividade 375–1440px sem rolagem horizontal e contraste/foco AA.

**Scale/Scope**: ~15 rotas/páginas sob `/admin/**`, ~17 componentes de apresentação existentes em
`src/components/admin/` a estilizar, 4 histórias de usuário (spec.md), sem novas entidades de dados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — Feature é puramente de apresentação: nenhum hook, tipo de
      domínio ou serviço é criado/alterado; os novos arquivos são exclusivamente componentes de
      apresentação (`src/components/admin/ui/*`) e arquivos `.module.css`, mantendo a separação já
      estabelecida pela feature 006.
- [x] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — Nenhum estado novo é introduzido (nem
      local nem global); nenhuma dependência nova é adicionada (`research.md` Decision 1).
- [x] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — **N/A para as rotas `/admin/**`** pela mesma razão já
      registrada em `006-admin-panel-integration/plan.md` (Principle III regula experiências
      públicas; admin não é indexável nem público). Esta feature, por decisão própria de produto
      (não por exigência da Principle III), ainda assim especifica responsividade (FR-010) e
      contraste/foco AA (FR-011) como requisitos — um padrão de qualidade voluntariamente mais alto
      que o mínimo constitucional aplicável.
- [x] A performance budget and Core Web Vitals targets are measurable for this feature. —
      Orçamento aplicável: nenhuma regressão sobre a linha de base de `006-admin-panel-integration`
      (ver Technical Context acima); Core Web Vitals/LCP não se aplicam (rota não-pública).
- [x] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — Nenhum contrato de dados é alterado. Os estados
      de loading/erro/vazio já existentes (`LoadingIndicator`, `ErrorToast`, `ContentTable` empty
      state) são apenas restilizados (FR-007/008), nunca reimplementados com lógica nova.
- [x] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — SEO: inalterado, `/admin/**`
      continua excluído (decisão da feature 006). Acessibilidade: `jest-axe` estendido a todas as
      telas redesenhadas (`research.md` Decision 7) + verificação manual de contraste/foco por
      `quickstart.md`. Frontend QA: `quickstart.md` desta feature define o roteiro de verificação
      visual e de regressão funcional.

**Resultado**: Nenhuma violação — nada a registrar em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/007-admin-ui-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output (N/A — sem novas entidades)
├── quickstart.md         # Phase 1 output
├── contracts/
│   └── admin-ui-components.md   # Contrato dos novos componentes de apresentação
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output (/speckit-tasks — não criado por este comando)
```

### Source Code (repository root)

```text
src/
├── app/globals.css                          # INALTERADO na estrutura de tokens — é a fonte de
│                                            #   verdade reaproveitada (cores, espaçamento, tipografia,
│                                            #   raio, sombra, modo escuro); nenhum token novo previsto
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx                       # MODIFICADO: novo ButtonVariant "destructive"
│   │   ├── Button.module.css                # MODIFICADO: nova classe .destructive (usa
│   │   │                                    #   --color-accent/--color-accent-strong já existentes)
│   │   └── icons/                           # Local já estabelecido para ícones SVG à mão
│   │       ├── EditIcon.tsx                 # NOVO — mesmo padrão de WifiIcon.tsx etc.
│   │       ├── TrashIcon.tsx                # NOVO
│   │       ├── LogoutIcon.tsx               # NOVO
│   │       └── WarningIcon.tsx              # NOVO — usado por ConflictBanner/ErrorToast
│   │
│   └── admin/
│       ├── ui/                              # NOVO diretório — design system interno do admin,
│       │   │                                #   mesmo padrão de src/components/ui/ (componente +
│       │   │                                #   .module.css irmão)
│       │   ├── Field.tsx                    # NOVO — wrapper de label+input/textarea/select/date;
│       │   │                                #   encaminha todos os atributos nativos (htmlFor/id
│       │   │                                #   preservados), não introduz nenhum comportamento
│       │   ├── Field.module.css
│       │   ├── Card.tsx                     # NOVO — container com borda/raio/sombra (login,
│       │   │                                #   agrupamento de campos extras, Configurações do Site)
│       │   ├── Card.module.css
│       │   ├── Table.tsx                    # NOVO — wrapper puramente visual em torno de
│       │   │                                #   table/thead/tbody/tr/th/td nativos (mesma semântica
│       │   │                                #   e roles ARIA implícitos, só com classNames)
│       │   ├── Table.module.css
│       │   ├── Banner.tsx                   # NOVO — variantes error/warning/empty/info, usado por
│       │   │                                #   ErrorToast, ConflictBanner e o estado vazio de
│       │   │                                #   ContentTable/Leads
│       │   └── Banner.module.css
│       │
│       ├── AdminShell.tsx                   # MODIFICADO: apenas className (layout header+main)
│       ├── AdminShell.module.css            # NOVO
│       ├── AdminNav.tsx                     # MODIFICADO: os className BEM já existentes
│       │                                    #   (`admin-nav`, `admin-nav__links`, etc.) hoje não
│       │                                    #   têm CSS correspondente em lugar nenhum — este
│       │                                    #   arquivo novo os estiliza; troca "Sair" por Button
│       │                                    #   variant="secondary" + LogoutIcon
│       ├── AdminNav.module.css              # NOVO
│       ├── LoginForm.tsx                    # MODIFICADO: envolve os campos com <Field>, botão com
│       │                                    #   <Button>, erro com <Banner variant="error">
│       ├── LoginForm.module.css             # NOVO — layout do cartão centralizado (usa <Card>)
│       ├── ContentForm.tsx                  # MODIFICADO: campos com <Field>, ações com <Button>
│       ├── ContentForm.module.css           # NOVO
│       ├── LanguageTabs.tsx                 # MODIFICADO: aba ativa com destaque visual
│       ├── LanguageTabs.module.css          # NOVO
│       ├── ContentTable.tsx                 # MODIFICADO: usa <Table>, ações com <Button
│       │                                    #   variant="secondary"|"destructive">, vazio com
│       │                                    #   <Banner variant="empty">
│       ├── ContentTable.module.css          # NOVO
│       ├── RoomExtraFields.module.css       # NOVO (campos com <Field>, sem lógica nova)
│       ├── EventSpaceExtraFields.module.css # NOVO
│       ├── TestimonialExtraFields.module.css # NOVO
│       ├── ConfirmDialog.tsx                # MODIFICADO: usa <Card>/<Button>
│       ├── ConfirmDialog.module.css         # NOVO
│       ├── ConflictBanner.tsx               # MODIFICADO: usa <Banner variant="warning">
│       ├── ErrorToast.tsx                   # MODIFICADO: usa <Banner variant="error">
│       ├── FieldError.tsx                   # MODIFICADO: estilo de texto de erro inline
│       ├── FieldError.module.css            # NOVO
│       ├── LoadingIndicator.tsx             # MODIFICADO: spinner visual (CSS puro, sem GIF/lib)
│       ├── LoadingIndicator.module.css      # NOVO
│       ├── LeadFilters.tsx                  # MODIFICADO: usa <Field>/<Button>
│       ├── LeadFilters.module.css           # NOVO
│       ├── LeadStatusControl.tsx            # MODIFICADO: rádios estilizados como segmented control
│       ├── LeadStatusControl.module.css     # NOVO
│       └── UnsavedChangesGuard.tsx          # INALTERADO (não renderiza UI própria)
│
└── app/admin/**/page.tsx                    # MODIFICADOS (15 arquivos): título envolto em <Card>/
    (login, page, rooms/*, event-spaces/*,   #   container consistente via AdminShell; nenhuma
     testimonials/*, site-settings, leads/*) #   mudança de fetch/estado/roteamento

tests/
├── integration/admin/accessibility.test.tsx  # ESTENDIDO — cobre agora também detalhe de lead,
│                                              #   formulários de event-spaces/testimonials
│                                              #   (telas que ainda não tinham asserção dedicada)
└── (demais arquivos de tests/unit|integration|e2e/admin/**: INALTERADOS na lógica; apenas
    seletores que dependiam de texto/estrutura visual antiga são ajustados caso quebrem — FR-012)
```

**Structure Decision**: Reaproveita a árvore de diretórios já estabelecida pela feature 006
(`src/app/admin/**`, `src/components/admin/**`), sem criar um novo diretório de alto nível. A única
adição estrutural é `src/components/admin/ui/` — espelhando exatamente `src/components/ui/` (o
precedente direto do projeto para "componente de apresentação reutilizável + `.module.css` irmão")
— e novos arquivos de ícone em `src/components/ui/icons/`, reaproveitando o local onde os ícones de
amenidades já vivem. Nenhum arquivo de domínio (`src/domain/admin/**`) ou serviço
(`src/services/admin/**`) é tocado.

## Complexity Tracking

*Sem violações do Constitution Check — seção não aplicável.*
