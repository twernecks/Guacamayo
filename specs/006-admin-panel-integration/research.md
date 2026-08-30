# Research: Painel Administrativo — Integração com a Guacamayo API

**Feature**: [spec.md](./spec.md) | **Date**: 2026-08-26

## Contexto de partida

O projeto é um site Next.js 16 (App Router) com `output: "export"` (`next.config.ts`) — build
totalmente estático, publicado no GitHub Pages via `.github/workflows/deploy.yml`, **sem servidor
em produção**. Isso elimina de saída várias opções "padrão" de Next.js para autenticação/dados
dinâmicos (middleware, API routes, server actions, server components com fetch por requisição) —
todas exigem um runtime Node.js que não existe no destino de deploy. As decisões abaixo partem
dessa restrição.

## Decision 1: Arquitetura geral — SPA client-side dentro do App Router, sem mudar `output: "export"`

**Decision**: A área administrativa é implementada como rotas do App Router
(`src/app/admin/**`) cujas páginas são Client Components (`"use client"`). Todo carregamento de
dados, autenticação e chamadas à Guacamayo API acontecem no navegador via `fetch`, após a
hidratação — não há fetch no servidor/build-time para nada específico do admin. O HTML estático
gerado no build para essas rotas é apenas um shell (loading state); o conteúdo real chega depois,
client-side, exatamente como a listagem pública já faz hoje com `LocalContentRepository` (mesmo
padrão de estados loading/error/empty da Principle II, aplicado agora a uma fonte remota real em
vez de um arquivo estático local).

**Rationale**: Preserva `output: "export"` (nenhuma mudança de infraestrutura de deploy, nenhum
novo serviço a operar) e é exatamente o que a Constitution já antecipa como o próximo passo natural
(Principle V: "APIs, authentication, payments, reservations and administration can be added without
a UI rewrite"). Não há necessidade de SSR aqui — dados administrativos nunca precisam ser
indexáveis nem otimizados para LCP.

**Alternatives considered**:
- *Remover `output: "export"` e usar `next start` com servidor Node* — rejeitado: exigiria trocar
  toda a infraestrutura de deploy (GitHub Pages → um host com servidor) só para o admin, quebrando
  a entrega já existente do site público sem necessidade; a Guacamayo API já resolve o papel de
  backend.
- *Next.js Route Handlers como proxy para a API* — rejeitado pelo mesmo motivo (exige servidor) e
  por adicionar uma camada sem valor: CORS já está liberado para chamar a API diretamente do
  navegador.

## Decision 2: Rotas dinâmicas por ID via query string, não segmentos `[id]`

**Decision**: Telas de detalhe/edição que dependem de um ID vindo da API (edição de Quarto/Espaço
de Evento/Depoimento, detalhe de Lead) usam uma rota estática fixa + `useSearchParams()`, não
`app/admin/rooms/[id]/edit/page.tsx`. Ex.: `/admin/rooms/edit?id=<uuid>`,
`/admin/leads/detail?id=<uuid>`.

**Rationale**: Com `output: "export"`, uma rota dinâmica (`[id]`) exige `generateStaticParams()`
enumerando todos os valores possíveis em build-time — inviável aqui, pois os IDs vêm de dados que
mudam em runtime na API externa (quartos cadastrados, leads capturados). Uma rota estática com
query string não tem esse problema: é um único arquivo HTML gerado no build, e o valor do `id` é
lido inteiramente no cliente.

**Alternatives considered**:
- *`[id]` com `generateStaticParams` vazio + fallback* — não suportado por `output: "export"`
  (não existe fallback em runtime sem servidor).
- *Um roteador client-side próprio (ex. React Router) por cima do App Router* — rejeitado: duplica
  a responsabilidade de roteamento que o App Router já cobre para todas as outras rotas do projeto,
  contrariando a simplicidade exigida pela Constitution (Architecture and Technology).

## Decision 3: Sessão e tokens — client store singleton com `localStorage`, mesmo padrão de `LanguageContext`

**Decision**: Um módulo `src/domain/admin/auth-store.ts` mantém o par de tokens (acesso +
atualização) e o `displayName` do admin em uma store singleton em memória, persistida em
`localStorage`, exposta via `useSyncExternalStore` — o mesmo padrão já usado por
`src/i18n/LanguageContext.tsx` (`createLanguageStore`) para estado client-only persistido. Um
`AdminAuthProvider` (Context) expõe `useAdminAuth()` com `{ status, admin, login, logout }`. A
própria store agenda a renovação automática (um `setTimeout` calculado a partir do
`accessTokenExpiresAt` retornado pela API, não do relógio local — ver FR-003) e faz o refresh em
segundo plano, atualizando os tokens persistidos.

**Rationale**: Reaproveita um padrão já validado no código-base (não introduz um novo paradigma de
estado), funciona sem servidor (tudo client-side), e sobrevive a navegações entre rotas por ser um
módulo singleton (não perde o timer de refresh ao trocar de página, diferente de um `useEffect`
local por componente).

**Alternatives considered**:
- *Cookies HttpOnly setados pelo backend* — rejeitado: exigiria a Guacamayo API rodar no mesmo
  domínio/origem do site ou um proxy com servidor (que não existe); os contratos fornecidos
  (`auth-api.md`) já devolvem os tokens no corpo JSON para o cliente gerenciar, não via `Set-Cookie`.
- *Uma biblioteca de gerenciamento de estado (Zustand/Redux) só para isso* — rejeitado: nenhuma
  dependência de estado global existe hoje no projeto; o padrão nativo já usado
  (`useSyncExternalStore` + módulo singleton) resolve sem dependência nova (Principle II: "State
  MUST remain local unless... a documented need").

## Decision 4: Cliente HTTP tipado para o envelope `{isSuccess, data, error}`

**Decision**: Um módulo `src/services/admin/api-client.ts` centraliza toda chamada à Guacamayo API:
monta a URL a partir de `NEXT_PUBLIC_API_BASE_URL`, injeta o header `Authorization: Bearer
<accessToken>`, decodifica o envelope padrão, e:
- em `isSuccess: false` com `error.code`, lança um `ApiError` tipado (`code`, `message`, `details?`)
  que os componentes usam para popular toasts/mensagens de campo (FR-025/FR-026);
- em `401` fora do fluxo de login/refresh, dispara uma única tentativa de refresh (via
  Decision 3) e repete a requisição original; se o refresh também falhar, força logout (FR-004);
- em `409` com `error.code === "CONCURRENT_MODIFICATION"`, propaga um erro distinto
  (`ConflictError`) para a tela tratar (pedir reload — FR-014/FR-017/FR-024).

**Rationale**: Evita duplicar parsing de envelope e tratamento de erro em cada tela; centraliza a
única lógica realmente arriscada (retry de refresh) num único lugar testável isoladamente.

**Alternatives considered**:
- *Uma biblioteca de data-fetching (TanStack Query, SWR)* — considerada, mas não adotada nesta
  fase: o volume de chamadas é pequeno (uma listagem por tela, sem necessidade de cache
  cross-tela sofisticado) e o projeto não usa nenhuma dependência de data-fetching hoje; introduzir
  uma exigiria justificativa que o escopo atual não sustenta (Constitution: "unnecessary
  dependencies... removed or justified"). Pode ser revisitada se uma fase futura precisar de cache
  compartilhado entre telas.

## Decision 5: Testes — mocking via `fetch` stub (unit) e `page.route()` do Playwright (e2e), sem MSW

**Decision**: Testes unitários/integração (Vitest + Testing Library, já configurados) mockam
`global.fetch` diretamente (`vi.fn()`/`vi.spyOn`) para exercitar `api-client.ts` e os componentes
de tela contra respostas de envelope controladas (sucesso, erro de validação, 401, 409). Testes e2e
(Playwright, já configurado) usam `page.route("**/api/**")` para interceptar e responder chamadas
à API com fixtures determinísticas, sem depender da Guacamayo API real estar rodando em CI. Uma
seção do `quickstart.md` documenta como rodar manualmente contra a API local real
(`http://localhost:5249`) para validação de integração de verdade antes de cada entrega.

**Rationale**: Mantém zero dependências de teste novas (nem MSW, nem um servidor de mock dedicado)
— tanto `vi.fn()` quanto `page.route()` já vêm com as ferramentas hoje instaladas. CI determinística
não depende de um segundo repositório (`guacamayo-api`) estar disponível/rodando.

**Alternatives considered**:
- *Mock Service Worker (MSW)* — rejeitado por ora: adicionaria uma dependência nova para resolver
  um problema que os mocks nativos das ferramentas já instaladas resolvem neste volume de chamadas.
- *E2E sempre contra a API local real* — rejeitado como estratégia de CI: acopla o pipeline deste
  repositório à disponibilidade e ao estado de dados de outro repositório; mantido como prática
  manual documentada, não como gate automatizado.

## Decision 6: Rotas administrativas fora de SEO/indexação

**Decision**: `src/app/robots.ts` passa a incluir uma regra `disallow: "/admin"`; o layout de
`src/app/admin/layout.tsx` define `export const metadata = { robots: { index: false, follow: false
} }`. As rotas `/admin/**` não entram em `src/app/sitemap.ts`.

**Rationale**: São telas internas autenticadas, sem valor de indexação; a Constitution (Principle
IV) trata SEO como requisito das páginas públicas — excluir explicitamente o admin é a aplicação
correta desse princípio para uma área que não é conversão pública, evitando que o Google indexe uma
tela de login administrativa.

**Alternatives considered**: Nenhuma — é a prática padrão para áreas administrativas em qualquer
site com SEO relevante; não há trade-off real a avaliar.

## Decision 7: Escopo de acessibilidade e responsividade do admin

**Decision**: A Principle III da Constitution ("Public experiences MUST be mobile-first... WCAG 2.2
AA") aplica-se às páginas públicas de conversão (reserva, WhatsApp, contato) — não à área
administrativa, que a própria spec (`Assumptions`) já delimita como uso interno, majoritariamente
desktop, sem exigência formal de WCAG nesta versão. O plano trata isso como **N/A por escopo**, não
como uma exceção/violação da Constitution: a Principle III fala de "public experiences" e a área
administrativa não é uma delas. Como boa prática mínima (não como gate formal), os componentes de
formulário ainda usam elementos semânticos nativos (`<label>`, `<button>`, `<table>`) e navegação
por teclado básica decorrente disso, sem trabalho dedicado de auditoria de acessibilidade.

**Rationale**: Evita tanto (a) aplicar um gate da Constitution fora do seu domínio declarado quanto
(b) fingir que não há nenhum cuidado de acessibilidade — a spec já fez essa chamada de escopo
deliberadamente (ver `spec.md` Assumptions e `checklists/spec-audit.md` CHK028).

## Decision 8: Idioma da UI do painel vs. idiomas do conteúdo

**Decision**: A interface do painel (menus, botões, mensagens de erro, rótulos do sistema) é escrita
diretamente em português nos componentes — **não** reaproveita `LanguageProvider`/`useTranslations`
do site público (que existe para alternar pt/en/es na vitrine pública). Os *formulários de
conteúdo* (Quarto/Espaço de Evento/Depoimento) usam um componente de abas de idioma
(`LanguageTabs`) que itera sobre `SUPPORTED_LANGUAGES` (já exportado por `src/i18n/languages.ts`)
para renderizar um campo de texto por idioma — reaproveitando o tipo `LanguageCode` já existente,
mas sem acoplar o admin ao sistema de troca de idioma da vitrine.

**Rationale**: Aplica a decisão já registrada na spec (Assumption: interface do painel em
português) sem introduzir uma dependência desnecessária entre o admin e o mecanismo de i18n do site
público, que tem um propósito diferente (idioma de exibição para visitantes, não do formulário do
administrador).

## Decision 9: Variável de ambiente da URL base da API

**Decision**: `NEXT_PUBLIC_API_BASE_URL` (mesmo padrão de `NEXT_PUBLIC_SITE_URL` já usado em
`src/lib/site.ts`), com fallback para `http://localhost:5249` quando não definida (dev local). O
`.github/workflows/deploy.yml` ganha essa variável no step de build assim que o deploy AWS da API
estiver pronto — até lá, o build de produção do site simplesmente não tem uma tela de admin
funcional contra um backend real (aceitável: o admin não é usado pelos hóspedes, só pela equipe, e
hoje a equipe testa contra a API local).

**Rationale**: Consistente com o único outro exemplo de configuração de ambiente já existente no
projeto; como o build é estático, a URL é resolvida em build-time (esperado e aceitável para uma
variável `NEXT_PUBLIC_*`, documentado explicitamente para não surpreender ninguém depois).

## Resumo das decisões

| # | Área | Decisão |
|---|------|---------|
| 1 | Arquitetura | Client Components dentro do App Router, sem SSR/servidor, mantendo `output: "export"` |
| 2 | Roteamento | IDs dinâmicos via query string, não segmentos `[id]` |
| 3 | Sessão | Store singleton `localStorage` + `useSyncExternalStore`, mesmo padrão de `LanguageContext` |
| 4 | HTTP/erros | `api-client.ts` único, com retry de refresh em 401 e `ConflictError` em 409 |
| 5 | Testes | `fetch` mockado (unit) + `page.route()` do Playwright (e2e); sem MSW |
| 6 | SEO | `/admin` fora de `robots.ts`/sitemap, `noindex` no layout |
| 7 | A11y/responsivo | Fora do escopo formal (Principle III não se aplica a área não-pública) |
| 8 | Idioma | UI do painel em pt fixo; abas de idioma só nos formulários de conteúdo |
| 9 | Config | `NEXT_PUBLIC_API_BASE_URL`, fallback `localhost:5249` |
