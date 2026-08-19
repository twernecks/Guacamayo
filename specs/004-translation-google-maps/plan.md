# Implementation Plan: Seletor de Idioma e Mapa com Google Maps/Street View

**Branch**: `004-translation-google-maps` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-translation-google-maps/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Adicionar um seletor de idioma (Português/English/Español) fixo no canto superior direito,
que troca 100% do texto visível do site — incluindo as mensagens pré-preenchidas de WhatsApp —
sem recarregar a página e sem perder o ponto de navegação atual; e substituir o mapa da seção de
Localização (hoje OpenStreetMap) por um embed do Google Maps centrado na coordenada exata da
pousada, com uma forma de visualizar a chegada em nível de rua (Street View). Abordagem técnica
(ver `research.md`): nenhuma dependência nova — Context React customizado com dicionários tipados
para i18n (preferência persistida em `localStorage`, idioma inicial sempre português por se
tratar de um site 100% estático), e embeds do Google Maps/Street View via as URLs gratuitas de
"Compartilhar/Incorporar" (sem chave de API), reutilizando o padrão de carregamento sob demanda já
existente na seção de Localização.

**Revisão pós-checklist (2026-08-18)**: após gerar `checklists/localization.md` (16 itens) e,
depois, `checklists/accessibility.md` (15 itens), a spec foi revisada em duas passadas para fechar
todas as dúvidas identificadas antes do `/speckit-tasks` — ver "Checklist Resolution" abaixo. A
segunda passada (acessibilidade) ampliou o escopo de "todo o texto" (FR-002/FR-006) para cobrir
também nomes acessíveis/`alt` text, não só texto visível, e acrescentou requisitos de foco do
teclado (FR-005), anúncio da troca a leitores de tela (FR-010) e nome acessível dos embeds de mapa
(FR-014) — refletidos em `research.md` Decision 6. Nenhuma mudança na abordagem técnica de base
(Context React + dicionários, embeds sem chave de API): os ajustes ampliam o que já estava
planejado, sem trocar a arquitetura.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Next.js 16 (App Router), React 19 — inalterado em
relação às features `001`–`003`.

**Primary Dependencies**: Nenhuma dependência nova. Reutiliza `next/image`, os primitivos de UI já
existentes (`src/components/ui`) e o padrão de iframe sob demanda já usado em `LocationSection`.
i18n é um Context React + dicionários tipados escritos a mão (ver `research.md` Decision 1),
não uma biblioteca (`next-intl`/`react-i18next` avaliadas e rejeitadas). O catálogo de mensagens de
UI (`src/i18n/messages/`) cobre tanto texto visível quanto nomes acessíveis/`aria-label` (FR-002/
FR-006) — não é um catálogo separado de "textos de tela leitora".

**Storage**: `localStorage` do navegador para a preferência de idioma (client-only; ver
`research.md` Decision 2). A leitura/escrita é protegida contra falha (navegação privada/bloqueio
de armazenamento — FR-011): nesse caso, a troca de idioma continua funcionando só em memória para
a sessão atual. Nenhum armazenamento novo do lado do servidor — o site continua sem backend.

**Testing**: Vitest + React Testing Library + `jest-axe` (componentes/unitário), Playwright +
`@axe-core/playwright` (ponta a ponta / acessibilidade em navegador real) — mesma stack já
estabelecida nas features `001`–`003`. Critério de teste manual com falantes nativos quantificado
em SC-002 (≥2 falantes nativos de inglês e ≥2 de espanhol).

**Target Platform**: Web, export estático (`output: "export"`, GitHub Pages), mobile-first
(320px–desktop), navegadores modernos.

**Project Type**: Web — aplicação Next.js única (frontend), sem backend, consistente com o
Princípio V da constituição.

**Performance Goals**: Preservar o orçamento de Core Web Vitals já validado em
`specs/003-mobile-modal-carousel/validation/performance.md` (LCP ≤2.5s, CLS 0; a feature 002 já
documentou o LCP acima do orçamento como pendência pré-existente não introduzida por features de
UI — este trabalho não deve piorar esse número). Sem novas dependências de bundle: os dicionários
de tradução são dados estáticos pequenos, não uma biblioteca. A troca de idioma é síncrona e local
(FR-012, sem requisição de rede), portanto não introduz uma nova fonte de latência percebida.

**Constraints**: Site 100% estático (sem servidor em produção) ⇒ a troca de idioma e a leitura da
preferência salva só podem acontecer no navegador (ver `research.md` Decision 2, incluindo o
trade-off aceito de um possível flash inicial em português, agora explícito em FR-004). O embed de
Street View depende da cobertura do Google no ponto exato, que não é garantida (Edge Case da spec)
e não é verificável em build/runtime sem uma API paga (`research.md` Decision 4) — tratado com um
aviso estático sempre visível, não uma checagem dinâmica (agora explícito no próprio Edge Case).
Metadata (título/descrição) por idioma é best-effort client-side; se a técnica de implementação não
conseguir atualizar essas tags antes da primeira indexação, a indexação em inglês/espanhol fica
fora do escopo desta entrega (limite agora explícito em Public Experience > SEO and metadata). O
foco do teclado (FR-005) é preservado por construção — a troca de idioma não desmonta/remonta
componentes, apenas atualiza texto via Context (`research.md` Decision 6) — em vez de exigir
gerenciamento manual de foco. Qualquer transição visual de abertura do seletor MUST respeitar
`prefers-reduced-motion` (FR-013), mesmo padrão já aplicado ao carrossel de relatos na feature
`003`.

**Scale/Scope**: 3 idiomas (pt padrão, en, es); ~7 quartos + 1 espaço de casamento/eventos + 3
relatos com texto a traduzir; um catálogo de mensagens de UI (navegação, seção de Localização,
templates de WhatsApp, demais rótulos a inventariar na fase de tasks); um componente de seletor de
idioma; a seção de Localização atualizada para o novo provedor de mapa.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] React with strict TypeScript is used; presentation, hooks, typed services and
      domain types have clear boundaries. — `LanguageProvider`/hooks isolados em `src/i18n/`,
      dicionários como dados tipados, `LanguageSelector` como componente de UI dedicado,
      extensões de tipo em `src/domain/content.ts` (ver `data-model.md`).
- [X] State is local by default; every global state, dependency or added complexity has
      a documented need and simpler alternative considered. — A preferência de idioma é o único
      estado verdadeiramente global desta feature; justificada porque toda seção da página
      consome o mesmo valor (não há composição local viável) — documentado em `research.md`
      Decision 1. Nenhuma dependência nova adicionada (Decisions 1 e 3 rejeitam bibliotecas).
- [X] Public-page conversion, responsive behavior, WCAG 2.2 AA implications, metadata
      and image strategy are specified. — Ver spec.md > Public Experience and Quality
      Requirements (conversion path via WhatsApp traduzido, responsive behavior do seletor com
      alvo de toque de 2,75rem, SEO/metadata com limite explícito de escopo, content/media facts,
      data states do mapa) e FR-001/FR-005/FR-006/FR-007/FR-010/FR-013/FR-014 para os requisitos
      de acessibilidade aprofundados via `checklists/accessibility.md` (nome acessível do
      seletor, foco do teclado preservado, anúncio `aria-live` da troca, `lang` sincronizado,
      `prefers-reduced-motion`, nome acessível dos embeds de mapa).
- [X] A performance budget and Core Web Vitals targets are measurable for this feature. — Ver
      Technical Context > Performance Goals; reexecução planejada em `quickstart.md` passo 5 dos
      requisitos de validação, contra a linha de base de `003`.
- [X] Data contracts and loading, error and empty states preserve future API integration
      without implementing deferred backend scope. — `Location.streetViewEmbedUrl` opcional
      modela explicitamente o estado "sem cobertura confirmada" (data-model.md); FR-011 modela o
      estado "sem `localStorage`"; o conteúdo localizado continua dado estático tipado, sem
      introduzir backend.
- [X] Required capability gates (accessibility, SEO/performance and frontend QA) are
      planned, or an approved, time-bounded exception is recorded. — Planejado em
      `quickstart.md` > Required validation before delivery (itens 4–7); execução real e
      evidência ficam para as tasks de Polish geradas por `/speckit-tasks`, seguindo o mesmo
      padrão das features `001`–`003`.

Nenhuma violação identificada — seção de Complexity Tracking omitida (nada a justificar).

## Checklist Resolution

`checklists/localization.md` (16 itens, gate formal escolhido pelo usuário) foi revisado e todos
os itens foram fechados por precisão de requisito no `spec.md` antes de prosseguir:

| Item | Resolução |
|------|-----------|
| CHK001 | FR-002 agora enumera explicitamente metadata, alt text, avisos de privacidade e estados vazio/erro |
| CHK002/CHK005 | Assumptions: revisão humana (FR-006) é do proprietário, sem prazo formal — aceito conscientemente |
| CHK003 | Novo FR-011: `localStorage` indisponível degrada para memória-apenas na sessão, sem erro visível |
| CHK004 | Edge Case do Street View agora explicita que o aviso é sempre exibido (estático), não condicional |
| CHK006 | Edge Case de texto longo agora exige reflow (quebra de linha) em vez de truncar, sem limite de caracteres |
| CHK007 | FR-004 agora aceita explicitamente o flash inicial em português como trade-off do site estático |
| CHK008 | FR-008 reescrito no passado/presente — a coordenada já está confirmada, não é mais uma pré-condição |
| CHK009 | SC-002 quantificado: ≥2 falantes nativos por idioma, 100% completam as tarefas-chave |
| CHK010 | SC-005 reformulado para ser satisfeito pelo aviso de Edge Case quando não houver cobertura do Street View |
| CHK011 | Novo FR-012: a troca de idioma é síncrona, sem estado de carregamento |
| CHK012 | FR-003 agora exige que dado interpolado (ex.: nome do quarto) também esteja no idioma selecionado |
| CHK013 | Assumptions: link compartilhado não preserva idioma de quem compartilhou (sem URL por idioma) |
| CHK014 | Assumptions: dependência do recurso gratuito do Google documentada no spec.md, com o fallback já existente como mitigação |
| CHK015 | SEO and metadata reescrito com um limite de escopo explícito (best-effort client-side; indexação em EN/ES fora de escopo se inviável) |
| CHK016 | FR-009 esclarece que "não coexistir como segundo widget" se refere ao mapa antigo, não à combinação mapa+Street View do próprio Google |

`checklists/accessibility.md` (15 itens, gate formal, gerado após a resolução acima) foi revisado
da mesma forma:

| Item | Resolução |
|------|-----------|
| CHK001/CHK009 | FR-001 e FR-010 distinguem "preservar" (conteúdo existente) de "atender desde a introdução" (o seletor, componente novo) |
| CHK002 | FR-001 exige posição única/previsível do seletor na ordem de navegação por teclado |
| CHK003 | FR-005 agora inclui "posição do foco do teclado" na lista de estados preservados |
| CHK004 | Responsive behavior cita explicitamente o alvo de toque de 2,75rem/44px já usado no site |
| CHK005 | Accessibility remete ao critério de foco visível do WCAG 2.2 AA já adotado — aceito sem quantificação adicional |
| CHK006 | FR-002 reescrito para cobrir texto visível E nomes acessíveis/`aria-label`, com MUST NOT explícito |
| CHK007 | FR-010 exige que `lang` do documento atualize na mesma operação que o conteúdo visível |
| CHK008 | Nova SC-006: zero violações críticas/sérias de acessibilidade automatizada, nos 3 idiomas |
| CHK010 | FR-007 exige que o texto de reserva (fallback) seja identificado com seu próprio idioma |
| CHK011 | FR-010 exige que a troca de idioma seja anunciada a tecnologia assistiva (`aria-live`) |
| CHK012 | Novo FR-013: transição de abertura do seletor respeita `prefers-reduced-motion` |
| CHK013 | Novo FR-014: embeds de mapa/Street View têm nome acessível; responsabilidade do site delimitada aos controles ao redor |
| CHK014 | FR-006 reescrito para cobrir explicitamente nomes acessíveis e alt text, não só conteúdo de negócio |
| CHK015 | FR-010 exige tanto o `lang` do documento quanto o próprio estado do seletor expondo a opção ativa |

## Project Structure

### Documentation (this feature)

```text
specs/004-translation-google-maps/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── checklists/
│   ├── requirements.md   # Spec quality checklist (/speckit-specify command)
│   ├── localization.md   # i18n + mapa requirements gate (/speckit-checklist command)
│   └── accessibility.md  # WCAG 2.2 AA requirements gate (/speckit-checklist command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

Sem `contracts/`: o projeto não expõe uma interface externa (API, CLI, protocolo) — é uma
landing page estática sem backend, o mesmo padrão já seguido pelas features `002` e `003`.

### Source Code (repository root)

```text
src/
├── i18n/                                  # NOVO
│   ├── languages.ts                       # LanguageCode, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES
│   ├── LanguageContext.tsx                # LanguageProvider, useLanguage(), useTranslations();
│   │                                      # setLanguage síncrono (FR-012), persistência
│   │                                      # best-effort com fallback silencioso (FR-011); atualiza
│   │                                      # o `lang` do documento na mesma operação que o
│   │                                      # conteúdo (FR-010); nenhum componente é desmontado ao
│   │                                      # trocar de idioma, preservando o foco por construção
│   │                                      # (FR-005, research.md Decision 6)
│   └── messages/
│       ├── pt.ts                          # catálogo de UI em português (fonte)
│       ├── en.ts                          # catálogo de UI em inglês
│       └── es.ts                          # catálogo de UI em espanhol
│
├── domain/
│   └── content.ts                         # ALTERADO — LocalizedText; Room/EventSpace/Testimonial/
│                                           # Media/Location conforme data-model.md
│
├── data/
│   └── pousada-content.ts                 # ALTERADO — todo texto voltado ao visitante vira
│                                           # LocalizedText nas 3 línguas; Location ganha
│                                           # coordinates/streetViewEmbedUrl
│
├── lib/
│   └── whatsapp.ts                        # ALTERADO — builders recebem LanguageCode e interpolam
│                                           # dados de conteúdo (ex.: nome do quarto) já localizados
│                                           # (FR-003)
│
└── components/
    ├── ui/
    │   ├── SiteHeader.tsx                 # ALTERADO — insere LanguageSelector no canto superior
    │   │                                  # direito (colapsando para o menu responsivo em mobile),
    │   │                                  # em posição previsível na ordem de tabulação (FR-001)
    │   ├── LanguageSelector.tsx           # NOVO — operável por teclado, nome acessível com
    │   │                                  # idioma atual, região aria-live anunciando a troca
    │   │                                  # (FR-001/FR-010), qualquer transição de abertura
    │   │                                  # respeita prefers-reduced-motion (FR-013)
    │   └── LanguageSelector.module.css    # NOVO
    │
    └── sections/
        ├── LocationSection.tsx            # ALTERADO — embed do Google Maps + Street View com
        │                                  # título/nome acessível (FR-014; aviso de cobertura
        │                                  # sempre visível, FR-008/FR-009), preservando o
        │                                  # carregamento sob demanda
        └── LocationSection.module.css     # ALTERADO — layout para os dois embeds (mapa +
                                            # nível de rua)

tests/
├── integration/
│   ├── language-selector.test.tsx         # NOVO
│   └── location-section.test.tsx          # ALTERADO — cobre Google Maps + Street View + estado
│                                           # "sem streetViewEmbedUrl"
└── e2e/
    ├── language-switching.spec.ts         # NOVO
    └── location-map.spec.ts               # ALTERADO — mapa/Street View do Google em vez de OSM
```

**Structure Decision**: Aplicação Next.js única já existente (`src/`), sem separação
frontend/backend (não há backend). i18n entra como um módulo novo e isolado (`src/i18n/`) em vez
de espalhar lógica de tradução pelos componentes; o conteúdo de negócio (`pousada-content.ts`) e o
catálogo de textos de UI (`src/i18n/messages/`) ficam propositalmente separados — o primeiro
continua descrevendo fatos do negócio (mapeado por `src/domain/content.ts`), o segundo descreve
apenas textos de interface, seguindo a mesma separação de responsabilidades já exigida pelo
Princípio I da constituição.
