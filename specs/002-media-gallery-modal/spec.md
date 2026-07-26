# Feature Specification: Visualização de Fotos em Foco (Modal de Galeria)

**Feature Branch**: `002-media-gallery-modal`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "atualize a exibição dos quartos e demais funcionalidades de exibição de
imagem de forma que fique entendido que o usuário pode clicar na imagem e ao clicar ela abra uma nova
telinha/popup ou modal para exibir as fotos daquele conteúdo que ele clicou. Ex.: clicou no quarto1,
abre a telinha e mostra as fotos daquele quarto. Fica melhor de visualizar do que o scrollbar que está
sendo mostrado hoje. Se implicar em mudanças, atualize o plano e tasks, por favor."

## Clarifications

### Session 2026-07-25

- Q: Ao navegar nas extremidades da galeria (avançar na última foto ou voltar na primeira), o
  que deve acontecer? → A: Volta ao início (wrap-around) — avançar na última foto volta para a
  primeira; voltar na primeira vai para a última.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver as fotos de um quarto em destaque (Priority: P1)

Como potencial hóspede, quero clicar na foto de um quarto e ver essa e as demais fotos daquele
quarto em uma visualização ampliada, para avaliar o quarto com mais clareza do que a faixa de
rolagem horizontal atual permite.

**Why this priority**: Quartos já possuem fotos reais aprovadas e são o primeiro ponto de contato
visual da pousada; a rolagem horizontal atual dificulta comparar detalhes e sinaliza baixa
qualidade de apresentação, prejudicando a confiança do visitante.

**Independent Test**: Em um quarto com fotos aprovadas, o visitante clica em uma foto, vê uma
visualização ampliada com todas as fotos daquele quarto (e apenas daquele quarto), navega entre
elas e a fecha, retornando à página normalmente.

**Acceptance Scenarios**:

1. **Given** um quarto com uma ou mais fotos aprovadas, **When** o visitante clica ou ativa por
   teclado a foto do quarto, **Then** uma visualização em foco abre mostrando as fotos daquele
   quarto, começando pela foto clicada.
2. **Given** a visualização em foco aberta para um quarto com mais de uma foto, **When** o
   visitante avança ou volta entre as fotos, **Then** a foto correspondente do mesmo quarto é
   exibida e a posição atual (ex.: "2 de 4") fica visível.
3. **Given** a visualização em foco aberta, **When** o visitante a fecha (botão de fechar, clique
   fora da imagem ou tecla Esc), **Then** ela fecha e o foco do teclado retorna ao elemento que a
   abriu.
4. **Given** um quarto com apenas uma foto aprovada, **When** o visitante a abre, **Then** a
   visualização em foco mostra essa única foto sem controles de "próxima/anterior" quebrados ou
   sem função.
5. **Given** a visualização em foco mostrando a última foto de um quarto, **When** o visitante
   avança para a próxima, **Then** a primeira foto do quarto é exibida (navegação circular); o
   mesmo vale ao voltar a partir da primeira foto, mostrando a última.

---

### User Story 2 - Mesma experiência para casamentos e eventos (Priority: P2)

Como casal ou organizador de evento, quero a mesma experiência de ampliar fotos ao clicar nelas
nas seções de Casamentos e Eventos, para ter uma navegação visual consistente em todo o site.

**Why this priority**: Reforça a confiança e a qualidade percebida em todas as seções com fotos,
mas depende de fotos aprovadas para casamentos/eventos, que ainda não existem — por isso vem depois
da prioridade dos quartos, que já têm fotos reais.

**Independent Test**: Assim que uma seção de casamento ou evento tiver fotos aprovadas, o mesmo
fluxo de clicar, ampliar, navegar e fechar funciona da mesma forma que nos quartos, sem
comportamento divergente entre seções.

**Acceptance Scenarios**:

1. **Given** um espaço de casamento ou evento com fotos aprovadas, **When** o visitante clica em
   uma foto, **Then** a visualização em foco mostra as fotos daquele espaço específico, com o
   mesmo comportamento de navegação e fechamento descrito na História 1.
2. **Given** um espaço de casamento ou evento sem fotos aprovadas (estado atual), **When** a
   página é exibida, **Then** o aviso "foto em breve" continua sendo apresentado sem nenhum
   controle clicável ou interativo associado.

---

### Edge Cases

- Quarto ou espaço sem nenhuma foto aprovada: o aviso "foto em breve" permanece não interativo;
  não deve abrir uma visualização vazia ou quebrada.
- Uma das fotos falha ao carregar dentro da visualização em foco: o mesmo comportamento de
  alternativa compreensível já usado na página (sem ícone de imagem quebrada, sem travar a
  navegação) deve se aplicar também dentro da visualização ampliada.
- Visitante usando apenas teclado: deve conseguir abrir, navegar entre fotos e fechar a
  visualização sem precisar de mouse, com indicação visível de foco em todo o percurso.
- Visitante usando leitor de tela: a visualização em foco deve ser identificada como uma janela
  modal, anunciada de forma compreensível, sem permitir que o foco "escape" para o conteúdo por
  trás dela enquanto estiver aberta.
- Visitante em tela pequena: a visualização em foco deve caber na tela sem gerar rolagem horizontal
  da página e sem cortar controles de navegação/fechamento.
- Quarto ou espaço com muitas fotos: a indicação de posição (ex.: "3 de 8") deve continuar legível
  e a navegação deve continuar responsiva independentemente da quantidade de fotos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o visitante abra uma visualização ampliada e em foco das
  fotos de um quarto, casamento ou espaço de evento ao clicar ou ativar por teclado qualquer foto
  daquele item.
- **FR-002**: A visualização em foco MUST mostrar somente as fotos aprovadas do item específico que
  foi clicado, nunca fotos de outro quarto ou espaço.
- **FR-003**: A visualização em foco MUST permitir avançar e voltar entre as fotos quando houver
  mais de uma foto para aquele item, com navegação circular: avançar a partir da última foto MUST
  mostrar a primeira, e voltar a partir da primeira foto MUST mostrar a última.
- **FR-004**: A visualização em foco MUST indicar a posição atual do visitante no conjunto de fotos
  (por exemplo, número da foto atual e total de fotos).
- **FR-005**: A visualização em foco MUST poder ser fechada por um controle explícito de fechar,
  por clique fora da foto e pela tecla Esc.
- **FR-006**: A visualização em foco MUST preservar o texto alternativo/descritivo de cada foto já
  definido no conteúdo aprovado.
- **FR-007**: O sistema MUST NOT apresentar um controle clicável/interativo para quartos ou espaços
  que ainda não têm foto aprovada; o aviso "foto em breve" atual permanece não interativo.
- **FR-008**: A visualização em foco MUST ser totalmente operável somente por teclado (abrir,
  navegar, fechar), com indicador de foco visível, e MUST ser identificada para tecnologia
  assistiva como uma janela modal.
- **FR-009**: Ao fechar a visualização em foco, o foco do teclado MUST retornar ao controle que a
  abriu.
- **FR-010**: A visualização em foco MUST permanecer utilizável em telas pequenas sem introduzir
  rolagem horizontal na página.
- **FR-011**: Uma foto que falhar ao carregar dentro da visualização em foco MUST apresentar a
  mesma alternativa compreensível já usada no restante do site, sem interação quebrada.

### Public Experience and Quality Requirements *(required for public UI)*

- **Conversion path**: Não é afetado — a visualização em foco é um recurso de apoio à decisão
  (ver fotos com clareza), não uma ação de conversão; os CTAs de WhatsApp e formulário permanecem
  fora da visualização e inalterados em posição e comportamento.
- **Responsive behavior**: Deve funcionar por toque, mouse e teclado em telas pequenas, médias e
  grandes, sem rolagem horizontal da página.
- **Accessibility**: WCAG 2.2 AA — foco preso dentro da visualização enquanto aberta, foco
  restaurado ao fechar, fechamento por Esc, papel e nome acessível de janela modal, contraste
  suficiente nos controles de navegação/fechamento.
- **SEO and metadata**: Sem impacto — a visualização é um recurso do lado do cliente sobre conteúdo
  já indexável; não é necessária uma URL própria por foto nesta primeira entrega.
- **Performance budget**: A abertura da visualização deve ser percebida como instantânea (sem
  navegação de página) e não deve piorar o orçamento de Core Web Vitals já definido para a página
  (LCP ≤ 2,5 s, CLS ≤ 0,1).
- **Content and media facts**: Reaproveita fotos e textos alternativos já aprovados; esta feature
  não aprova, adiciona ou substitui nenhuma foto por conta própria.
- **Data states**: Quartos/espaços sem foto aprovada continuam no estado "foto em breve" sem
  ganhar interação nova; falha de carregamento de uma foto dentro da visualização usa a mesma
  alternativa compreensível já aplicada na página.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O visitante consegue ver qualquer foto aprovada de um quarto/espaço ampliada e
  navegar por todas as fotos daquele item sem sair da página atual (zero recarregamentos de
  página).
- **SC-002**: Em teste de uso com cinco pessoas, pelo menos quatro conseguem abrir, navegar por
  mais de uma foto e fechar a visualização sem ajuda externa, em até 15 segundos a partir da
  primeira tentativa.
- **SC-003**: 100% dos fluxos de abrir, navegar e fechar a visualização funcionam apenas por
  teclado, verificado nas seções de quartos, casamentos e eventos.
- **SC-004**: A funcionalidade não introduz regressão no orçamento de performance já estabelecido
  para a página (LCP ≤ 2,5 s, CLS ≤ 0,1).

## Assumptions

- O conteúdo de fotos e textos alternativos já aprovados é reaproveitado como está; esta feature
  não inclui aprovação, adição ou remoção de fotos.
- Não há necessidade de link direto (URL) para uma foto específica nesta primeira entrega; a
  visualização em foco é uma interação local à página.
- A apresentação padrão de cada quarto/espaço passa a mostrar uma foto de destaque clicável (com
  indicação de quantidade quando houver mais de uma foto) em vez da faixa de rolagem horizontal
  com todas as fotos lado a lado; a rolagem horizontal atual é substituída por essa nova
  visualização em foco como forma principal de ver múltiplas fotos.
- Quartos ou espaços que ainda exibem "foto em breve" (sem foto aprovada) não são afetados por
  esta feature até que fotos reais sejam aprovadas.
- Não há mudança nos canais de contato (WhatsApp/formulário) nem em sua posição na página; esta
  feature trata somente de como as fotos já existentes são visualizadas.
