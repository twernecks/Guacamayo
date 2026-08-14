# Feature Specification: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Feature Branch**: `003-mobile-modal-carousel`

**Created**: 2026-07-27

**Status**: Draft

**Input**: User description: "Melhorar a experiência mobile em dois pontos da interface: (1) o modal de
foto de quarto abre pequeno demais em telas mobile e deve ocupar uma proporção maior da tela,
próxima de tela cheia, mantendo a imagem legível; (2) os relatos são exibidos empilhados
verticalmente em mobile, exigindo muito scroll, e devem virar um carrossel horizontal navegável
por swipe, similar ao padrão de navegação de fotos já usado na aplicação."

## Clarifications

### Session 2026-07-27

- Q: Como o modal ampliado deve se comportar no mobile em relação a margem/fundo visível e à
  forma de fechar, já que "quase tela cheia" tensiona com o requisito existente de fechar por
  clique fora? → A: Quase tela cheia com margem/fundo escurecido visível o suficiente para
  tocar fora e fechar, como hoje — só proporcionalmente maior.
- Q: No mobile em quase-tela-cheia, o cabeçalho (título/fechar), a legenda e o indicador de
  posição "N de M" devem permanecer sempre visíveis ou virar sobreposição que aparece/some? →
  A: Sempre visíveis, porém compactos (espaçamento/altura reduzidos) — sem elementos que somem
  por inatividade.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver a foto ampliada de um quarto em tela cheia no celular (Priority: P1)

Como visitante acessando a pousada pelo celular, quero que a foto ampliada de um quarto ocupe
quase toda a tela ao ser aberta, para conseguir ver os detalhes do ambiente sem forçar a vista.

**Why this priority**: As fotos dos quartos são o principal conteúdo de decisão da jornada de
hospedagem (US1 da spec `001-pousada-landing-page`); um modal pequeno demais no celular
prejudica diretamente essa jornada central, tornando esta a prioridade mais alta.

**Independent Test**: Em um celular (ou emulação de viewport ~375px), tocar em uma foto de
quarto, casamento ou evento e confirmar que a visualização ampliada ocupa quase toda a tela,
com a foto legível e os controles de navegação (anterior/próxima/fechar) continuando
funcionais.

**Acceptance Scenarios**:

1. **Given** um visitante em um viewport mobile (até ~768px de largura), **When** ele toca em
   uma foto para ampliá-la, **Then** a visualização ampliada ocupa uma proporção
   significativamente maior da tela do que hoje, próxima de tela cheia, com a foto inteira
   visível e legível.
2. **Given** a visualização ampliada aberta no celular, **When** o visitante navega para a
   próxima ou a foto anterior, **Then** a apresentação ampliada é mantida para todas as fotos
   da mesma galeria, sem voltar ao tamanho pequeno atual.
3. **Given** um visitante em tablet ou desktop, **When** ele abre a visualização ampliada de
   uma foto, **Then** o tamanho e o comportamento atuais são preservados, sem regressão.

---

### User Story 2 - Navegar pelos relatos por swipe no celular (Priority: P2)

Como visitante acessando a pousada pelo celular, quero percorrer os relatos de hóspedes
arrastando o dedo lateralmente, para não precisar rolar a página verticalmente por uma lista
longa de depoimentos.

**Why this priority**: Relatos são prova social de apoio à decisão, não o caminho principal de
conversão (que é hospedagem/casamento), por isso ficam em segundo plano em relação ao ajuste do
modal de fotos — mas o excesso de rolagem vertical hoje ainda prejudica a experiência mobile.

**Independent Test**: Em um celular (ou emulação de viewport ~375px), acessar a seção de
Relatos e confirmar que os depoimentos aparecem em um carrossel horizontal navegável por swipe,
com indicação de que há mais cards além do visível.

**Acceptance Scenarios**:

1. **Given** um visitante em um viewport mobile, **When** a seção de Relatos é exibida,
   **Then** os depoimentos aparecem em um carrossel horizontal em vez de uma lista totalmente
   empilhada verticalmente.
2. **Given** o carrossel de relatos no celular, **When** o visitante arrasta/desliza o dedo
   lateralmente, **Then** ele navega entre os cards de depoimento, com indicação visual (card
   seguinte parcialmente visível, indicadores de posição ou equivalente) de que há mais
   conteúdo.
3. **Given** um visitante em tablet ou desktop, **When** ele acessa a seção de Relatos,
   **Then** o layout atual em grade é preservado, a menos que um ajuste traga benefício claro
   sem quebrar a experiência existente.
4. **Given** um visitante navegando somente por teclado (sem toque), **When** ele chega ao
   carrossel de relatos, **Then** ele consegue avançar e voltar entre os cards sem depender do
   gesto de swipe.

---

### Edge Cases

- Quando uma galeria de fotos tem apenas 1 foto, os controles de anterior/próxima continuam
  ocultos como hoje; apenas o tamanho da visualização muda no mobile.
- Quando há 0 ou 1 relato aprovado, o estado vazio/único atual é preservado (sem carrossel
  desnecessário para um único item).
- Em telas muito estreitas (ex.: 320px) ou em tablets próximos ao limite do breakpoint mobile,
  tanto o modal quanto o carrossel devem permanecer utilizáveis, sem cortar conteúdo nem gerar
  rolagem horizontal da página inteira.
- Ao girar o dispositivo (retrato ↔ paisagem) com o modal de foto ou o carrossel de relatos já
  abertos, a apresentação deve se adaptar sem quebrar a navegação em andamento.
- Um texto de depoimento incomumente longo deve continuar legível dentro do card do carrossel,
  sem estourar o layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Em viewports mobile (até ~768px de largura), a visualização ampliada de foto
  MUST ocupar uma proporção significativamente maior da tela do que a apresentação atual,
  mantendo a foto inteira visível, sem corte, e preservando uma margem/fundo escurecido
  visível o suficiente para o visitante tocar fora da foto e fechar a visualização (ver
  Clarifications).
- **FR-002**: A navegação já existente na visualização ampliada (foto anterior/próxima,
  indicador de posição "N de M", fechar por botão/clique fora/Esc, foco restaurado ao controle
  de origem) MUST continuar funcionando sem alteração no tamanho maior do mobile. No mobile, o
  cabeçalho (título e botão fechar), a legenda e o indicador de posição MUST permanecer sempre
  visíveis, com espaçamento/altura reduzidos para priorizar espaço para a foto — nenhum desses
  elementos deve depender de um gesto ou de um período de inatividade para aparecer (ver
  Clarifications).
- **FR-003**: Em viewports tablet/desktop, o tamanho e o comportamento atuais da visualização
  ampliada MUST ser preservados, a menos que um ajuste traga benefício claro à experiência.
- **FR-004**: Em viewports mobile, os relatos MUST ser apresentados como um carrossel
  horizontal navegável, em vez da lista totalmente empilhada verticalmente usada hoje.
- **FR-005**: Visitantes em dispositivos touch MUST conseguir navegar entre os cards de
  depoimento por gesto de arrastar/deslizar horizontal (swipe).
- **FR-006**: O carrossel de relatos MUST indicar visualmente que existem mais cards além do
  atualmente em foco (por exemplo: próximo card parcialmente visível, indicadores de posição,
  ou equivalente).
- **FR-007**: O carrossel de relatos MUST permanecer totalmente navegável sem depender de
  gesto de toque (por exemplo, por teclado e/ou controles visíveis), preservando o compromisso
  de acessibilidade WCAG 2.2 AA já estabelecido pela spec `001-pousada-landing-page`.
- **FR-008**: Em viewports tablet/desktop, os relatos MUST permanecer legíveis e utilizáveis,
  preservando o layout em grade atual a menos que um ajuste traga benefício claro.
- **FR-009**: As duas mudanças MUST preservar os nomes acessíveis, papéis (roles) e
  comportamento de foco já estabelecidos para a visualização de foto e para os relatos, sem
  regressão no suporte a leitor de tela.

### Public Experience and Quality Requirements *(required for public UI)*

- **Responsive behavior**: Mobile é definido como viewports de até ~768px de largura; validar
  explicitamente em uma resolução mobile real de ~375px, conforme os critérios de aceite.
  Comportamento em tablet/desktop deve ser preservado, exceto onde um ajuste tenha benefício
  claro.
- **Accessibility**: Toda interação por gesto (swipe) MUST ter um equivalente sem gesto
  (teclado e/ou controles visíveis), mantendo o padrão WCAG 2.2 AA já exigido pela feature
  `001-pousada-landing-page`; foco e leitura por leitor de tela não podem regredir.
- **Performance budget**: A mudança é de apresentação e navegação, sem novos ativos pesados;
  não deve introduzir regressão perceptível no orçamento de Core Web Vitals já validado (LCP,
  CLS) para a página.
- **Data states**: Os estados já existentes (galeria sem foto aprovada, ausência de relatos
  aprovados, falha ao carregar imagem) permanecem inalterados por esta feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em um viewport mobile de 375px de largura, a visualização ampliada de foto ocupa
  ao menos 90% da altura da tela, com a foto inteira visível e sem corte.
- **SC-002**: Em teste com cinco pessoas usando um celular, todas conseguem percorrer todos os
  relatos aprovados usando apenas o gesto de arrastar/deslizar horizontal, sem precisar rolar a
  página verticalmente além do necessário para alcançar a seção de Relatos.
- **SC-003**: Em telas tablet e desktop, 100% dos comportamentos atuais do modal de foto e da
  seção de Relatos continuam funcionando, sem regressão perceptível em nenhum teste manual.
- **SC-004**: 100% das interações novas ou alteradas (navegação na visualização ampliada e no
  carrossel de relatos) permanecem operáveis somente por teclado, sem depender de mouse ou
  toque.

## Assumptions

- "Mobile", para esta feature, é definido como viewports de até ~768px de largura, alinhado aos
  breakpoints já usados na feature `001-pousada-landing-page`.
- O comportamento acessível já existente na visualização ampliada de foto (foco preso ao
  diálogo, fechar por Esc/clique fora, foco restaurado ao controle de origem, indicador de
  posição) é preservado; apenas o tamanho ocupado na tela muda no mobile.
- "Carrossel horizontal similar ao já usado na aplicação" se refere ao padrão de navegação já
  existente nas galerias de fotos (um item por vez, com indicador de posição e
  anterior/próxima), não a uma implementação técnica específica sendo reaproveitada tal como
  está.
- Nenhum novo conteúdo ou campo de dado é necessário; os relatos usados são os mesmos já
  aprovados e definidos na feature `001-pousada-landing-page`.
- Como o gesto de swipe não é, por si, acessível a quem navega por teclado ou tecnologia
  assistiva, esta spec assume que uma forma alternativa de navegar o carrossel (teclado e/ou
  controles visíveis) é necessária, mesmo não tendo sido explicitada nos critérios de aceite
  originais — consistente com o compromisso de acessibilidade já adotado pelo projeto.
