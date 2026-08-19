# Accessibility (WCAG 2.2 AA) Requirements Quality Checklist: Seletor de Idioma e Mapa com Google Maps/Street View

**Purpose**: Validate that the accessibility requirements in `spec.md` for the new language
selector and the translated/multi-language content are complete, clear, consistent and
measurable enough to move into `/speckit-tasks` — a formal gate, not a review of any
implementation.
**Created**: 2026-08-18
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the requirements as written, not any code or UI. Every item asks
whether the spec says something clearly enough — not whether a build behaves correctly.

**Scope**: Foco em acessibilidade (WCAG 2.2 AA) do seletor de idioma (componente novo, sem
padrão pré-existente a "preservar") e do conteúdo multi-idioma, complementando
`checklists/localization.md` (i18n/mapa, já resolvido) e `checklists/requirements.md` (qualidade
geral da spec, já resolvido). Profundidade: gate formal antes do `/speckit-tasks`, mesmo padrão já
usado nos checklists anteriores desta feature.

**Finalization pass (2026-08-18)**: Revisado a pedido do usuário ("analise os checklists gerados
e faça as devidas alterações na especificação") — todos os 15 itens foram fechados com edições
diretas em `spec.md` (FR-001, FR-002, FR-005, FR-006, FR-007, FR-010 reescrito, novos FR-013/
FR-014, Responsive behavior, Accessibility, nova SC-006).

## Requirement Completeness

- [X] CHK001 O seletor de idioma é um componente novo, sem um padrão de interação pré-existente
      para "preservar" — a spec define o comportamento acessível esperado dele (ex.: controle
      operável por teclado, com nome acessível que comunica tanto sua função quanto o idioma
      atualmente selecionado), ou apenas remete genericamente ao compromisso WCAG 2.2 AA já
      estabelecido para outros componentes? [Gap, Spec §FR-001/§FR-010]
      **Resolvido**: FR-001 agora exige explicitamente operação por teclado e um nome acessível
      que comunique função + idioma selecionado, próprio do componente novo.
- [X] CHK002 Está definida a posição do seletor de idioma na ordem de navegação por teclado em
      relação aos elementos de navegação já existentes (logo, menu, eventual skip link), ou isso
      fica inteiramente a critério de quem implementa? [Gap, Spec §FR-001]
      **Resolvido**: FR-001 agora exige uma posição única e previsível próxima aos demais itens de
      navegação, sem exigir percorrer conteúdo não relacionado.
- [X] CHK003 FR-005 enumera o que MUST ser preservado ao trocar de idioma (seção atual, janela de
      foto ampliada, posição no carrossel) — a posição do foco do teclado também está incluída
      nessa lista, ou um visitante navegando só por teclado pode perder seu ponto de foco atual ao
      trocar de idioma? [Gap, Spec §FR-005]
      **Resolvido**: FR-005 agora inclui explicitamente "posição do foco do teclado" na lista de
      estados preservados.

## Requirement Clarity

- [X] CHK004 O alvo de toque mínimo do seletor de idioma (especialmente em sua apresentação
      recolhida em mobile) está vinculado ao mesmo padrão mensurável já usado em outros controles
      do site (2,75rem/44px, estabelecido nas features anteriores), ou fica apenas implícito pela
      exigência genérica de "utilizável em mobile"? [Clarity, Spec §Responsive behavior]
      **Resolvido**: "Responsive behavior" agora cita explicitamente o padrão de 2,75rem/44px já
      usado nos demais controles do site.
- [X] CHK005 "Foco visível" (Public Experience > Accessibility) está quantificado de alguma forma
      (ex.: contraste mínimo do indicador de foco), ou permanece um termo qualitativo sem critério
      objetivo de aceite? [Clarity, Ambiguity, Spec §Accessibility]
      **Resolvido (aceito conscientemente)**: "Accessibility" agora remete explicitamente aos
      critérios de foco visível já do WCAG 2.2 AA adotado pelo projeto, sem quantificação adicional
      específica desta feature — consistente com como o restante do site já trata esse critério.

## Requirement Consistency

- [X] CHK006 FR-002 define o escopo da tradução como "100% do texto **visível**", enquanto FR-010
      exige preservar "nomes acessíveis" — muitos nomes acessíveis do site (ex.: rótulos de botões
      de navegação de carrossel/lightbox) são texto visualmente oculto (`aria-label`/texto
      visually-hidden), não texto visível. Uma leitura literal de FR-002 deixa claro que esse texto
      também MUST ser traduzido, ou um nome acessível poderia permanecer em português enquanto o
      texto visível ao redor já está em outro idioma? [Conflict, Spec §FR-002 vs §FR-010]
      **Resolvido**: FR-002 reescrito para cobrir explicitamente texto visível E texto não-visível
      usado por tecnologia assistiva, com uma frase MUST NOT explícita contra nomes acessíveis
      "presos" em português.
- [X] CHK007 O atributo de idioma do documento (Accessibility: "atributo `lang` do documento
      atualizado") é definido como atualizado em sincronia com o conteúdo visível, ou existe uma
      janela em que um poderia mudar antes/depois do outro — considerando que FR-004 já aceita um
      flash inicial em português como trade-off, o comportamento do atributo `lang` durante essa
      janela específica está coberto? [Consistency, Spec §FR-004 vs §Accessibility]
      **Resolvido**: FR-010 agora exige que a atualização do `lang` aconteça na mesma operação que
      atualiza o conteúdo visível, sem janela perceptível de descompasso.

## Acceptance Criteria Quality (Measurability)

- [X] CHK008 Existe um Success Criterion (SC) mensurável dedicado a acessibilidade para esta
      feature (ex.: zero violações críticas/sérias em varredura automatizada no seletor e no
      conteúdo traduzido), ou o compromisso de acessibilidade depende inteiramente da frase
      genérica em Public Experience > Accessibility, sem um critério de sucesso próprio? [Gap,
      Measurability, Spec §Success Criteria]
      **Resolvido**: nova SC-006 — zero violações críticas/sérias em varredura automatizada, nos
      três idiomas.
- [X] CHK009 "Preservar o compromisso WCAG 2.2 AA já estabelecido" pode ser objetivamente
      verificado para um componente **novo** (o seletor de idioma não existia antes — não há uma
      linha de base própria dele para "preservar"), ou o requisito precisa de um critério de
      aceite próprio em vez de remeter a uma preservação? [Measurability, Ambiguity, Spec §FR-010]
      **Resolvido**: FR-010 reescrito distinguindo "preservar" (conteúdo já existente) de
      "atender desde a introdução" (o seletor, componente novo) — mesmo tratamento de CHK001.

## Scenario/Edge Case Coverage

- [X] CHK010 Quando um texto de reserva em português é exibido (FR-007) enquanto o restante da
      página está em inglês/espanhol, a spec exige que esse trecho específico seja identificado
      com seu próprio idioma (para leitura correta por tecnologia assistiva), ou o requisito trata
      apenas do idioma do documento como um todo? [Gap, Spec §FR-007]
      **Resolvido**: FR-007 agora exige que o trecho de reserva seja identificado com seu próprio
      idioma, distinto do idioma selecionado pelo visitante.
- [X] CHK011 Existe um requisito de que a troca de idioma seja anunciada a um leitor de tela (ex.:
      região `aria-live`, como já usado no indicador de posição do carrossel de relatos), ou o
      único sinal da troca é o conteúdo subsequente já aparecer no novo idioma, sem confirmação
      explícita? [Gap, Coverage]
      **Resolvido**: FR-010 agora exige que a troca de idioma seja anunciada a tecnologia
      assistiva, citando o padrão `aria-live` já usado no carrossel de relatos como referência.
- [X] CHK012 Se o seletor de idioma abrir como um menu/dropdown com alguma transição visual, a
      spec exige que essa transição respeite a preferência de movimento reduzido do visitante
      (`prefers-reduced-motion`), como já exigido para o carrossel de relatos na feature `003`, ou
      esse caso não está coberto por não haver menção a uma interação de abrir/fechar? [Gap,
      Non-Functional]
      **Resolvido**: novo FR-013 — qualquer transição de abertura do seletor MUST respeitar
      `prefers-reduced-motion`, citando o precedente da feature `003`.

## Dependencies & Assumptions

- [X] CHK013 Os embeds do Google Maps/Street View (conteúdo de um iframe de terceiros) têm um
      requisito de acessibilidade próprio (ex.: um título/nome acessível para o iframe em si, já
      que o conteúdo interno do serviço externo está fora do controle do site), ou a
      responsabilidade de acessibilidade do mapa termina nos controles do próprio site ao redor
      dele (botão "Carregar mapa", aviso, link alternativo)? [Gap, Assumption]
      **Resolvido**: novo FR-014 — os embeds MUST ter nome acessível descritivo; a responsabilidade
      do site é explicitamente delimitada aos controles ao redor do embed, não ao comportamento
      interno do serviço externo.
- [X] CHK014 O processo de produção de conteúdo traduzido descrito em FR-006 (tradução automática
      inicial + revisão humana assíncrona) está definido como cobrindo também texto não-visível
      (nomes acessíveis, `alt` text — já parte de `LocalizedText` no `data-model.md`), ou o
      processo descrito na spec parece se referir apenas ao conteúdo visível de negócio (quartos,
      relatos)? [Assumption, Spec §FR-006]
      **Resolvido**: FR-006 reescrito para cobrir explicitamente tanto o conteúdo visível de
      negócio quanto nomes acessíveis e texto alternativo.

## Ambiguities & Conflicts

- [X] CHK015 "Indicação do idioma atualmente selecionado a tecnologia assistiva" (Accessibility)
      poderia ser satisfeita apenas pelo atributo `lang` do documento, ou o requisito também
      espera que o próprio controle do seletor exponha seu estado selecionado (ex.: equivalente a
      `aria-current`/`aria-selected` na opção ativa)? A spec permite as duas leituras sem
      distinguir qual é exigida. [Ambiguity, Spec §Accessibility]
      **Resolvido**: FR-010 agora exige explicitamente os dois sinais — o atributo `lang` do
      documento E o próprio estado do seletor expondo a opção ativa a tecnologia assistiva.

## Notes

- Focus: Acessibilidade (WCAG 2.2 AA) do seletor de idioma e do conteúdo multi-idioma (escolhido
  pelo usuário) — complementa `localization.md` (i18n/mapa) e `requirements.md` (qualidade geral).
- Profundidade: gate formal antes de `/speckit-tasks` (escolhido pelo usuário) — recomenda-se
  resolver ou conscientemente aceitar os itens acima antes de gerar as tasks.
- **Status final**: 15/15 resolvidos (13 por precisão de requisito direta no spec.md, 2 aceitos
  conscientemente: CHK005 remete ao padrão WCAG 2.2 AA já adotado pelo projeto sem quantificação
  adicional). Nenhuma pendência bloqueia `/speckit-tasks`.
- Check items off as completed: `[x]`
- Add comments or findings inline
- Items are numbered sequentially for easy reference
