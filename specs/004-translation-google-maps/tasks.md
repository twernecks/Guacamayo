# Tasks: Seletor de Idioma e Mapa com Google Maps/Street View

**Input**: Design documents from `specs/004-translation-google-maps/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`,
`checklists/requirements.md`, `checklists/localization.md`, `checklists/accessibility.md`
(todos os checklists resolvidos — ver `plan.md` > Checklist Resolution)

**Tests**: A troca de idioma toca 100% das seções públicas e a seção de Localização ganha uma
dependência externa nova (Google Maps/Street View) — ambas concentram risco de regressão e de
acessibilidade, por isso têm cobertura de teste dedicada, seguindo o mesmo padrão de
proporcionalidade ao risco já usado nas features `001`–`003`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta).
- **[Story]**: Mapeia a tarefa para a user story em `spec.md`.
- Toda tarefa inclui o caminho exato do arquivo.

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Construir a infraestrutura de i18n (tipos, Context, catálogo de mensagens) da qual
as duas user stories dependem — US1 usa diretamente para todo o conteúdo do site; US2 usa para os
próprios textos da seção de Localização (cabeçalho, botão, avisos), mesmo antes de trocar o
provedor de mapa (ver Acceptance Scenario 3 da US2 e o Independent Test da US1, que já lista
"localização" entre as seções a traduzir).

**⚠️ CRITICAL**: Nenhuma user story pode ser considerada pronta antes desta fase estar completa.

- [X] T001 [P] Criar `LanguageCode`, `DEFAULT_LANGUAGE`, `SUPPORTED_LANGUAGES` em
      `src/i18n/languages.ts` (`data-model.md`)
- [X] T002 [P] Criar o tipo `Messages` em `src/i18n/messages/types.ts`, cobrindo todo texto de UI
      hoje fixo nos componentes: navegação, seletor de idioma, quartos, casamentos/eventos,
      relatos, localização (cabeçalho, botão "Carregar mapa", aviso de privacidade, link
      alternativo, aviso de cobertura do Street View), rodapé, contato/WhatsApp, e os nomes
      acessíveis/`aria-label` já usados (`CarouselControls` anterior/próxima, "Fechar" do
      lightbox, "Lista de relatos") — FR-002
- [X] T003 [P] Popular `src/i18n/messages/pt.ts` com o catálogo completo em português (fonte de
      verdade, inventariando o texto hoje hardcoded em cada componente listado em T002) — depende
      de T002
- [X] T004 [P] Popular `src/i18n/messages/en.ts` com a tradução em inglês do mesmo catálogo
      (TypeScript garante paridade de chaves com `pt.ts` via o tipo `Messages`) — depende de T002
- [X] T005 [P] Popular `src/i18n/messages/es.ts` com a tradução em espanhol do mesmo catálogo —
      depende de T002
- [X] T006 Implementar `LanguageProvider`, `useLanguage()`, `useTranslations()` e `localize()` em
      `src/i18n/LanguageContext.tsx`: `setLanguage` síncrono (FR-012) que atualiza o Context sem
      desmontar a árvore de componentes (preserva o foco do teclado por construção — FR-005,
      `research.md` Decision 6); persiste em `localStorage` com leitura/escrita protegidas por
      `try/catch` e fallback silencioso em memória quando indisponível (FR-011); atualiza o
      atributo `lang` do documento na mesma operação que troca o conteúdo (FR-010); `localize()`
      cai para `"pt"` quando uma chave de `LocalizedText` estiver ausente (FR-007) — depende de
      T001, T002
- [X] T007 [P] Testes de componente para `LanguageContext`/`useLanguage` (idioma inicial `"pt"`,
      troca síncrona sem re-montar os filhos, fallback silencioso quando `localStorage` lança,
      `lang` do documento atualizado junto com o conteúdo, `localize()` cai para `"pt"` em chave
      ausente) em `tests/integration/language-context.test.tsx` — depende de T006

**Checkpoint**: Infraestrutura de i18n pronta e testada; US1 e US2 podem prosseguir.

---

## Phase 2: User Story 1 - Escolher o idioma do site (Priority: P1) 🎯 MVP

**Goal**: Um seletor de idioma no canto superior direito troca 100% do texto do site — incluindo
nomes acessíveis e as mensagens de WhatsApp — para inglês ou espanhol, sem recarregar a página e
sem perder o ponto de navegação atual.

**Independent Test**: A partir de qualquer página, acionar o seletor, escolher "English" ou
"Español" e confirmar que todo o texto visível de todas as seções (incluindo Localização) e a
mensagem pré-preenchida de WhatsApp aparecem no idioma escolhido.

### Tests for User Story 1

- [X] T008 [P] [US1] Testes de componente para `LanguageSelector` (operável por teclado, nome
      acessível comunicando função + idioma atual, alvo de toque mínimo 2,75rem, região
      `aria-live="polite"` anunciando a troca, nenhuma transição quando `prefers-reduced-motion`
      está ativo) em `tests/integration/language-selector.test.tsx`
- [X] T009 [P] [US1] Teste unitário para os builders de mensagem do WhatsApp com idioma (mensagem
      correta nos 3 idiomas; nome de quarto/espaço interpolado já no idioma selecionado) em
      `tests/unit/whatsapp.test.ts`
- [X] T010 [P] [US1] Cobertura ponta a ponta em viewport 375px e desktop cobrindo: troca de idioma
      a partir de qualquer seção, texto e mensagens de WhatsApp nos 3 idiomas, preservação de
      foco/estado (lightbox e carrossel de relatos abertos) durante a troca, e persistência do
      idioma após recarregar a página, em `tests/e2e/language-switching.spec.ts`

### Implementation for User Story 1

- [X] T011 [US1] Estender `src/domain/content.ts` com `LocalizedText` e converter os campos de
      texto voltados ao visitante de `Media`/`Room`/`EventSpace`/`Testimonial` para
      `LocalizedText`/`LocalizedText[]`, conforme `data-model.md` — depende de T001
- [X] T012 [US1] Atualizar `src/data/pousada-content.ts`: todo texto voltado ao visitante dos 7
      quartos, do espaço de casamento/eventos e dos 3 relatos (nomes, resumos, comodidades,
      legendas/`alt` de fotos, citações) ganha as 3 línguas, mantendo os mesmos fatos em todas
      (FR-006) — depende de T011
- [X] T013 [US1] Implementar `LanguageSelector.tsx`/`LanguageSelector.module.css` em
      `src/components/ui/` (posição única e previsível na ordem de tabulação, nome acessível
      dinâmico, alvo de toque 2,75rem, transição de abertura — se houver — respeitando
      `prefers-reduced-motion`, região `aria-live` anunciando a troca — FR-001/FR-010/FR-013) —
      depende de T006
- [X] T014 [US1] Atualizar `src/components/ui/SiteHeader.tsx`: inserir `LanguageSelector` no canto
      superior direito (recolhendo para o menu responsivo em mobile) e resolver os rótulos de
      navegação via `useTranslations()` (FR-001/FR-002) — depende de T013
- [X] T015 [US1] Atualizar `src/lib/whatsapp.ts`: builders recebem `LanguageCode`, usam os
      templates de `src/i18n/messages/`, e interpolam nome de quarto/espaço já localizado (FR-003)
      — depende de T003, T004, T005, T011
- [X] T016 [P] [US1] Atualizar `src/components/sections/RoomsSection.tsx` e
      `src/components/sections/MediaGallery.tsx` para resolver nome/resumo/comodidades/legendas
      via `localize()` e passar o `itemLabel` já localizado ao lightbox; ajustar
      `tests/integration/rooms-section.test.tsx` se alguma asserção depender de texto fixo em
      português — depende de T006, T012
- [X] T017 [P] [US1] Atualizar `src/components/sections/WeddingSection.tsx` e
      `src/components/sections/EventsSection.tsx` para resolver nome/propósito/legendas via
      `localize()`; ajustar `tests/integration/wedding-section.test.tsx` e
      `tests/integration/events-section.test.tsx` se necessário — depende de T006, T012
- [X] T018 [P] [US1] Atualizar `src/components/sections/TestimonialsSection.tsx` para resolver a
      citação via `localize()` (a atribuição permanece em português — é nome de pessoa) e os
      rótulos de UI ("Relato anterior"/"Próximo relato", "Lista de relatos") via
      `useTranslations()`; ajustar `tests/integration/testimonials-section.test.tsx` se necessário
      — depende de T006, T012
- [X] T019 [P] [US1] Atualizar `src/components/sections/MediaGalleryLightbox.tsx` e
      `src/components/ui/CarouselControls.tsx` (via os rótulos passados pelos chamadores) para que
      "Foto anterior"/"Próxima foto"/"Fechar" venham de `useTranslations()` em vez de texto fixo
      (FR-002, nomes acessíveis); ajustar `tests/integration/media-gallery-lightbox.test.tsx` e
      `tests/integration/carousel-controls.test.tsx` se necessário — depende de T006
- [X] T020 [P] [US1] Atualizar `src/components/sections/HeroSection.tsx`,
      `src/components/ui/SiteFooter.tsx`, `src/components/contact/ContactForm.tsx` e
      `src/components/contact/WhatsAppContact.tsx` para resolver todo texto visível e
      rótulos/`aria-label` via `useTranslations()`/`localize()` — depende de T006
- [X] T021 [US1] Atualizar `src/components/sections/LocationSection.tsx`: cabeçalho, botão
      "Carregar mapa", aviso de privacidade e link alternativo passam a vir de
      `useTranslations()` (o mapa em si e a troca de provedor ficam para a US2) — depende de T006

**Checkpoint**: US1 é independentemente testável — trocar o idioma em qualquer página atualiza
todo o texto (incluindo Localização e nomes acessíveis) e as mensagens de WhatsApp, sem perder o
ponto de navegação; nada no mapa em si muda ainda.

---

## Phase 3: User Story 2 - Ver a localização exata e a chegada ao local (Priority: P2)

**Goal**: A seção de Localização passa a mostrar um mapa do Google centrado na coordenada exata da
pousada, com uma forma de visualizar a chegada em nível de rua (Street View), substituindo o mapa
atual (OpenStreetMap).

**Independent Test**: Acessar a seção de Localização e confirmar que o mapa mostra a posição exata
da pousada e que existe uma forma de visualizar a chegada em nível de rua sem sair da página.

### Tests for User Story 2

- [X] T022 [P] [US2] Criar testes de componente para `LocationSection` cobrindo: embed do Google
      Maps carregado sob demanda, presença do embed de Street View quando `streetViewEmbedUrl`
      existe, aviso de cobertura sempre visível quando ausente, nome acessível descritivo nos dois
      embeds, em `tests/integration/location-section.test.tsx` (arquivo novo)
- [X] T023 [P] [US2] Atualizar `tests/e2e/location-map.spec.ts`: mapa e Street View do Google (não
      mais OpenStreetMap) centrados na coordenada exata, link "abrir no Google Maps" funcional, e
      os textos ao redor do mapa traduzidos nos 3 idiomas

### Implementation for User Story 2

- [X] T024 [US2] Estender `Location`/`GeoCoordinates` em `src/domain/content.ts` (`coordinates`,
      `streetViewEmbedUrl?`) conforme `data-model.md` — depende de T011
- [X] T025 [US2] Atualizar a entrada `location` em `src/data/pousada-content.ts`: `coordinates` =
      `{ lat: -23.1819646, lng: -44.7164933 }`; `mapEmbedUrl` apontando para o embed gratuito do
      Google Maps sem chave de API (`research.md` Decision 3); `streetViewEmbedUrl` se a cobertura
      no ponto for confirmada durante a implementação, ou omitido caso contrário;
      `fallbackMapUrl` apontando para o Google Maps — depende de T024
- [X] T026 [US2] Atualizar `LocationSection.tsx`/`LocationSection.module.css`: renderizar o embed
      do Google Maps e, quando `streetViewEmbedUrl` existir, o embed de Street View, cada um com
      um título/nome acessível descritivo (FR-014); quando `streetViewEmbedUrl` estiver ausente,
      mostrar o aviso estático de cobertura definido no Edge Case (FR-008/FR-009), nunca um iframe
      vazio; preservar o carregamento sob demanda já existente — depende de T021, T025

**Checkpoint**: US2 é independentemente testável — a seção de Localização mostra o mapa do Google
na coordenada exata, com Street View ou o aviso de cobertura, e o link alternativo continua
funcionando.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Confirmar que as duas mudanças não introduzem regressão de acessibilidade,
performance ou responsividade em relação à linha de base já registrada pelas features `001`–`003`.

- [X] T027 [P] Reexecutar a auditoria de acessibilidade (`jest-axe` + varredura real de navegador)
      incluindo o seletor de idioma, o conteúdo traduzido nos 3 idiomas e os embeds de mapa/Street
      View, confirmando SC-006 (zero violações críticas/sérias); registrar evidência em
      `specs/004-translation-google-maps/validation/accessibility.md`
- [X] T028 [P] Remedir Core Web Vitals (LCP, CLS) com as duas mudanças ativas, comparando com a
      linha de base em `specs/003-mobile-modal-carousel/validation/performance.md`, e registrar
      evidência em `specs/004-translation-google-maps/validation/performance.md`
- [X] T029 [P] Executar QA responsivo em 320px/375px/768px/desktop nos 3 idiomas (atenção especial
      a textos mais longos em inglês/espanhol não cortarem nem quebrarem o layout), e registrar
      evidência — incluindo se o Street View mostrou cobertura real no ponto exato ou o aviso de
      fallback — em `specs/004-translation-google-maps/validation/frontend-qa.md`
- [X] T030 Executar a suíte completa de lint, checagem de tipos, testes unitários, de integração e
      ponta a ponta documentada em `specs/004-translation-google-maps/quickstart.md`

## Execution Notes (deviations from plan found during implementation)

- **URL de Street View corrigida (achado real durante T025/T026)**: o padrão inicialmente planejado
  (`output=embed` com `layer=c`/`cbll=`) redirecionava para uma especificação `pb=` vazia, sem
  imagem. O padrão correto, confirmado testando os redirecionamentos reais e um `<iframe>` isolado,
  é `output=svembed` com `cbp=11,0,0,0,0` — carrega uma fotoesfera 360° real já publicada para
  "Enseada Do Jatobá". `research.md` Decision 3 e `pousada-content.ts` atualizados; ver
  `validation/frontend-qa.md` para a investigação completa.
- **T028 foi além do planejado**: como a primeira medição de TBT (Total Blocking Time) apareceu
  muito acima da linha de base de `003` (~1200-1800ms vs. 80-490ms), em vez de aceitar o número às
  cegas, o código desta feature foi colocado em `git stash` para gerar e medir uma build "limpa"
  (pré-004) sob a mesma toolchain, isolando a variável. Resultado: o TBT elevado já existe no
  código pré-004 — não foi introduzido por esta feature (ver `validation/performance.md`).
- **T015 e o "roomInquiry"/"weddingInquiry" do `data-model.md`**: o plano original antecipava
  templates de mensagem que interpolam um nome de quarto/espaço diretamente (ex.:
  `whatsapp.roomInquiry(roomName)`). Durante a implementação, foi confirmado que nenhum fluxo do
  site hoje monta uma mensagem de WhatsApp assim (as chamadas de contato usam sempre o interesse
  genérico — hospedagem/evento/casamento — nunca um quarto específico) — os dois campos não foram
  implementados no tipo `Messages` para evitar código morto; a FR-003 permanece satisfeita porque a
  condição "quando a mensagem incorpora um dado do conteúdo" nunca é acionada na aplicação atual.
- **FR-007 (marcação de idioma do texto de reserva/fallback)**: `localize()` cai para português
  quando uma chave falta, mas retorna uma string simples, sem marcar esse trecho com seu próprio
  `lang` diferente do idioma selecionado. Como todo o conteúdo aprovado (`pousada-content.ts`) tem
  as 3 línguas preenchidas (regra de validação do `data-model.md`), esse caminho é apenas uma rede
  de segurança defensiva, não um comportamento esperado em produção — documentado como gap
  conhecido em `validation/accessibility.md` (achado U1 do `/speckit-analyze`), não corrigido nesta
  entrega.
- Nenhuma das mudanças acima alterou o escopo das duas user stories.

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: Sem dependências externas; bloqueia as duas user stories.
- **US1 (Phase 2)**: Depende da Foundational.
- **US2 (Phase 3)**: Depende da Foundational **e** de T021 (US1) — a US2 estende o mesmo arquivo
  (`LocationSection.tsx`) que a US1 já preparou para consumir `useTranslations()`, seguindo o que
  o próprio Independent Test da US1 exige (texto da seção de Localização já traduzido).
- **Polish (Phase 4)**: Depende de US1 e US2 estarem completas.

### User Story Dependencies

- **US1**: Requer T001–T007 (Foundational).
- **US2**: Requer T001–T007 (Foundational) e T021 (US1) especificamente, por compartilhar
  `LocationSection.tsx`; sem outra dependência de US1.

### Parallel Opportunities

- T001, T002 podem rodar em paralelo; T003–T005 (catálogos) podem rodar em paralelo entre si após
  T002; T007 depende só de T006.
- Após a Foundational, a maior parte da US1 (T008–T010 testes; T016–T020 conteúdo/UI) pode rodar
  em paralelo, desde que T011/T012 (tipos/dados) e T006 (Context) já estejam prontos.
- US2 só pode começar de fato depois de T021 (US1) estar concluída, por causa do arquivo
  compartilhado — mas T022/T023 (testes) podem ser escritos em paralelo a T021 se necessário.
- T027, T028 e T029 (Polish) podem rodar em paralelo entre si.

## Parallel Example: Após a Foundational

```text
Task: "Testes de componente para LanguageSelector (US1)"
Task: "Teste unitário para os builders de WhatsApp com idioma (US1)"
Task: "Cobertura ponta a ponta de troca de idioma em 375px/desktop (US1)"
```

## Implementation Strategy

### MVP First

1. Completar a Fase 1 (Foundational): Context de idioma, tipos e os 3 catálogos de mensagens.
2. Completar a Fase 2 (US1): seletor de idioma funcionando em todas as seções, incluindo WhatsApp
   e os textos da seção de Localização (sem trocar o mapa ainda).
3. Demonstrar a troca de idioma completa antes de seguir para o mapa do Google.

### Incremental Delivery

1. Entregar o seletor de idioma com tradução completa do site (US1) — maior prioridade por
   remover a barreira de idioma para toda a jornada de conversão.
2. Entregar o mapa do Google com Street View (US2).
3. Completar a validação cruzada (acessibilidade, performance, QA responsivo nos 3 idiomas) antes
   de considerar a feature pronta para entrega.
