# Feature Specification: Seletor de Idioma e Mapa com Google Maps/Street View

**Feature Branch**: `004-translation-google-maps`

**Created**: 2026-07-28

**Status**: Draft

**Input**: User description: "quero que adicione ao site a opção de tradução para outras línguas
além do português, ficando na parte superior direita. Serão possíveis ser selecionados a opção de
site em inglês ou espanhol além do português. As opções de linguagem devem ficar disponíveis para
todos as funcionalidades do site, inclusive na montagem de texto e comunição via whatsapp.
Gostaria de saber se o mapa poderia ser o do google maps, com a localização exata da pousada e que
possa até ser visualizado a chegada do local via google street ou algo do tipo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escolher o idioma do site (Priority: P1)

Como visitante que não fala português, quero trocar o idioma de todo o site para inglês ou
espanhol a partir de um seletor sempre visível no canto superior direito, para entender o
conteúdo da pousada e conseguir entrar em contato sem depender de tradução externa.

**Why this priority**: Sem esta troca, um visitante que não lê português não consegue avaliar
quartos, casamentos/eventos nem iniciar contato — é a barreira mais direta à conversão para esse
público, por isso é a prioridade mais alta desta feature.

**Independent Test**: A partir de qualquer página do site, acionar o seletor de idioma no canto
superior direito, escolher "English" ou "Español" e confirmar que todo o texto visível (menu,
seções de quartos, casamentos/eventos, relatos, localização, rodapé e chamadas de contato) passa a
ser exibido no idioma escolhido, incluindo a mensagem pré-preenchida ao iniciar um contato via
WhatsApp.

**Acceptance Scenarios**:

1. **Given** um visitante em qualquer página do site, **When** ele abre o seletor de idioma no
   canto superior direito, **Then** ele vê as três opções (Português, English, Español) com o
   idioma atual indicado.
2. **Given** um visitante seleciona "English" ou "Español", **When** a troca é aplicada, **Then**
   100% do texto visível em todas as seções do site passa a ser exibido nesse idioma, sem misturar
   idiomas na mesma tela.
3. **Given** um visitante com "English" selecionado, **When** ele inicia um contato via WhatsApp a
   partir de qualquer chamada do site (quarto, casamento/evento ou contato geral), **Then** a
   mensagem pré-preenchida é montada em inglês.
4. **Given** um visitante trocou o idioma e está navegando o site (ex.: com uma foto ampliada
   aberta ou em determinada seção), **When** a troca de idioma é aplicada, **Then** ele permanece
   no mesmo ponto da navegação, sem ser levado de volta ao topo da página nem perder o que estava
   vendo.
5. **Given** um visitante já escolheu um idioma em uma visita anterior, **When** ele volta ao site
   no mesmo navegador, **Then** o site já é exibido no idioma escolhido anteriormente, sem exigir
   nova seleção.

---

### User Story 2 - Ver a localização exata e a chegada ao local (Priority: P2)

Como visitante planejando a viagem até a pousada, quero ver a localização exata em um mapa
completo e visualizar a chegada ao local em nível de rua, para me orientar melhor antes da viagem,
especialmente por a pousada ficar em uma estrada (BR-101).

**Why this priority**: Ajuda a decisão e o planejamento da viagem, mas depende de reserva/decisão
já tomada com base no conteúdo principal (quartos/casamentos) coberto pela User Story 1; por isso
fica em segundo plano.

**Independent Test**: Acessar a seção de Localização e confirmar que o mapa mostra a posição exata
da pousada e que existe uma forma de visualizar a chegada ao local em nível de rua/imagem do
entorno, sem sair da página.

**Acceptance Scenarios**:

1. **Given** um visitante na seção de Localização, **When** o mapa é carregado, **Then** ele mostra
   a posição exata da pousada, não apenas uma região aproximada.
2. **Given** um visitante na seção de Localização, **When** ele aciona a opção de visualização em
   nível de rua/chegada ao local, **Then** ele consegue ver uma imagem do entorno/via de acesso sem
   sair da página.
3. **Given** um visitante em qualquer um dos três idiomas, **When** ele acessa a seção de
   Localização, **Then** os textos ao redor do mapa (endereço, instruções, rótulos dos controles)
   aparecem no idioma selecionado, mesmo que o mapa em si seja de um serviço externo.

---

### Edge Cases

- Quando um visitante troca de idioma enquanto uma janela de foto ampliada (lightbox) ou o
  carrossel de relatos está aberto, a troca não deve fechar ou resetar essa interação em andamento.
- Quando o texto traduzido é maior que o original (comum em inglês/espanhol vs. português), os
  botões, cabeçalhos e cartões MUST continuar legíveis, sem cortar texto nem quebrar o layout em
  nenhuma largura de tela já suportada (320px–desktop). O texto MUST quebrar linha normalmente
  (reflow) em vez de ser truncado com reticências ou cortado; esta feature não impõe um número
  máximo de caracteres para as traduções — a legibilidade é garantida pelo comportamento de quebra
  de linha, não por limitar o tamanho do texto.
- Quando um mecanismo de busca ou link externo aponta diretamente para uma página do site, o
  visitante MUST ver o conteúdo em um idioma coerente (o padrão do site ou o idioma já salvo em
  visitas anteriores), nunca uma mistura de idiomas.
- Quando a visualização em nível de rua não tem cobertura exata do ponto informado (situação comum
  em estradas/áreas rurais), o site MUST informar isso de forma clara em vez de mostrar um mapa
  quebrado ou uma tela em branco. Como o site não verifica a cobertura em tempo real (evitando
  depender de uma API paga só para essa checagem), esse aviso MUST ser exibido sempre, de forma
  estática, junto à visualização em nível de rua — não apenas quando uma falha for detectada.
- Quando o visitante está em uma conexão lenta, o mapa (e sua eventual visualização em nível de
  rua) MUST continuar carregando sob demanda/interação explícita, preservando o padrão já usado
  hoje na seção de Localização, em vez de carregar automaticamente e pesar a página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O site MUST exibir um seletor de idioma fixo/sempre acessível no canto superior
  direito, presente em todas as páginas e visível em qualquer ponto da navegação, oferecendo
  Português (padrão atual), English e Español. Por ser um controle novo (sem um padrão de
  interação pré-existente a preservar), o seletor MUST ser operável por teclado e ter um nome
  acessível que comunique tanto sua função quanto o idioma atualmente selecionado; sua posição na
  ordem de navegação por teclado MUST ficar próxima aos demais itens de navegação já existentes
  (ex.: logo, menu), em um ponto único e previsível, sem exigir que o visitante percorra conteúdo
  não relacionado para alcançá-lo.
- **FR-002**: Ao selecionar um idioma, o site MUST atualizar 100% do texto em todas as seções e
  funcionalidades para o idioma escolhido — isso inclui explicitamente tanto texto visível (menu,
  quartos, casamentos/eventos, relatos, localização, rodapé, chamadas de contato, texto alternativo
  de imagens, avisos de privacidade, mensagens de estado vazio/erro) quanto texto não-visível usado
  apenas por tecnologia assistiva (nomes acessíveis/`aria-label` de controles como os botões de
  navegação de fotos e relatos) — um nome acessível MUST NOT permanecer em português quando o
  restante da interface já está em outro idioma. Título e descrição da página (metadata) seguem a
  regra específica definida em Public Experience and Quality Requirements > SEO and metadata.
- **FR-003**: O site MUST montar as mensagens pré-preenchidas de contato via WhatsApp (interesse em
  quarto, casamento/evento, contato geral) no idioma atualmente selecionado pelo visitante. Quando
  a mensagem incorpora um dado do conteúdo do site (ex.: o nome de um quarto), esse dado MUST
  também estar no idioma selecionado, preservando a gramática da frase completa.
- **FR-004**: O site MUST lembrar o idioma escolhido pelo visitante entre páginas/seções durante a
  mesma visita e em visitas futuras no mesmo navegador, sem exigir nova seleção a cada acesso. Como
  o site é publicado como páginas estáticas sem servidor, uma breve exibição inicial no idioma
  padrão (português) antes da preferência salva ser aplicada é um comportamento aceito, desde que
  não exija nenhuma ação do visitante para corrigir (ver Assumptions).
- **FR-005**: A troca de idioma MUST preservar o estado de navegação em andamento do visitante
  (seção atual, janela de foto ampliada aberta, posição no carrossel de relatos, posição do foco do
  teclado), sem reiniciar a experiência nem devolver o foco a um ponto padrão da página.
- **FR-006**: Todo texto traduzido — incluindo tanto o conteúdo visível de negócio (nomes e
  comodidades dos quartos, textos de casamentos/eventos, relatos) quanto nomes acessíveis e texto
  alternativo de imagens — MUST refletir com exatidão as informações factuais já aprovadas em
  português (inclusão de café da manhã e acesso à piscina, endereço, número de WhatsApp,
  valores/condições), sem alterar o significado entre idiomas. O conteúdo em inglês e espanhol MAY
  ser gerado automaticamente para permitir um lançamento rápido, mas MUST passar por uma revisão
  humana assíncrona após a publicação, para corrigir eventuais erros de tradução ou tom, sem
  bloquear a entrega inicial da feature.
- **FR-007**: Se um texto ainda não tiver tradução disponível para o idioma selecionado, o site
  MUST mostrar um conteúdo de reserva legível (ex.: o texto em português) em vez de deixar espaço
  em branco ou exibir um identificador técnico da tradução ausente; esse trecho de reserva MUST ser
  identificado com seu próprio idioma (distinto do idioma selecionado pelo visitante), para que
  tecnologia assistiva o leia corretamente em vez de pronunciá-lo como se estivesse no idioma
  selecionado.
- **FR-008**: A seção de Localização MUST exibir um mapa centrado na coordenada geográfica exata
  da pousada — já confirmada pelo proprietário (ver Key Entities > Localização da Pousada:
  latitude -23.1819646, longitude -44.7164933) — em vez de apenas o endereço textual do marco de
  rodovia já usado, e MUST oferecer uma forma de visualizar imagens em nível de rua/chegada ao
  local sem sair da página.
- **FR-009**: A nova exibição do Google Maps — tratando a visão de mapa e a visualização em nível
  de rua como uma única experiência integrada de localização — MUST substituir o mapa atual
  (OpenStreetMap) da seção de Localização; o requisito de não coexistir como "um segundo widget
  separado" se refere a não manter o mapa antigo ao lado do novo, não a uma restrição sobre o
  próprio Google Maps oferecer as duas visões (mapa e nível de rua) juntas. O padrão já existente
  de carregamento sob demanda a partir de uma ação explícita do visitante é preservado.
- **FR-010**: Todo o conteúdo já existente no site MUST preservar o compromisso de acessibilidade
  WCAG 2.2 AA já estabelecido (nomes acessíveis, operação por teclado). O seletor de idioma, por
  ser um componente novo, MUST atender ao mesmo padrão desde sua introdução (não há uma versão
  anterior dele para "preservar" — ver FR-001). A troca de idioma MUST ser anunciada a tecnologia
  assistiva (ex.: por uma região `aria-live`, como já usado no indicador de posição do carrossel de
  relatos), e o idioma atualmente selecionado MUST ser comunicado tanto pelo atributo `lang` do
  documento quanto pelo próprio estado do seletor (ex.: a opção ativa exposta como tal a
  tecnologia assistiva) — não apenas um dos dois. A atualização do atributo `lang` do documento
  MUST acontecer na mesma operação que atualiza o conteúdo visível, sem uma janela perceptível em
  que um esteja desatualizado em relação ao outro.
- **FR-011**: O site MUST continuar funcional mesmo se o navegador do visitante bloquear ou não
  suportar armazenamento local (ex.: navegação privada): a troca de idioma continua funcionando
  durante a sessão atual; apenas a lembrança entre visitas fica indisponível nesse caso, sem gerar
  erro visível ao visitante.
- **FR-012**: A troca de idioma MUST ser aplicada de forma síncrona, sem exigir uma requisição de
  rede nem exibir um estado de carregamento — o conteúdo dos três idiomas já está disponível
  localmente no momento em que a página é carregada.
- **FR-013**: Se a abertura do seletor de idioma usar alguma transição visual (ex.: um menu que se
  expande), essa transição MUST respeitar a preferência de movimento reduzido do visitante
  (`prefers-reduced-motion`), como já exigido para o carrossel de relatos na feature
  `003-mobile-modal-carousel`.
- **FR-014**: Os embeds de mapa e de visualização em nível de rua (FR-008/FR-009) MUST ter um nome
  acessível descritivo (ex.: um título identificando o conteúdo como o mapa/a visualização de rua
  da localização da pousada); a responsabilidade de acessibilidade do site cobre os controles ao
  redor do embed (botão de carregar, aviso, link alternativo) — o comportamento interno do serviço
  de mapa em si é de responsabilidade do provedor externo.

### Public Experience and Quality Requirements *(required for public UI)*

- **Conversion path**: As chamadas de contato via WhatsApp continuam sendo o CTA principal em
  todos os idiomas, com a mensagem pré-preenchida coerente com o idioma selecionado.
- **Responsive behavior**: O seletor de idioma MUST permanecer alcançável e utilizável em mobile,
  tablet e desktop, mesmo que sua apresentação se adapte (ex.: recolhido dentro do menu de
  navegação já responsivo em telas estreitas), respeitando o mesmo alvo de toque mínimo (2,75rem/
  44px) já usado nos demais controles interativos do site.
- **Accessibility**: O seletor de idioma e o conteúdo traduzido preservam o padrão WCAG 2.2 AA já
  exigido pelo projeto (nomes acessíveis, foco visível conforme os critérios de foco do WCAG 2.2 AA
  já adotados — sem quantificação adicional específica desta feature —, operação por teclado); ver
  FR-010 para os requisitos específicos de indicação de idioma e anúncio da troca a tecnologia
  assistiva.
- **SEO and metadata**: Título e descrição da página refletem o idioma selecionado sempre que isso
  não exigir reestruturar as rotas estáticas do site (ex.: via atualização client-side do título
  da página). Se a técnica escolhida na implementação não conseguir atualizar essas tags antes da
  primeira indexação por um mecanismo de busca, a versão indexada permanece em português, e ter
  título/descrição indexados em inglês/espanhol fica fora do escopo desta entrega (o conteúdo
  continua correto para quem já está no site, apenas a indexação em outro idioma não é garantida).
  Preserva a indexabilidade já estabelecida pela feature `001-pousada-landing-page`.
- **Performance budget**: A troca de idioma e a nova exibição de mapa não devem introduzir
  regressão perceptível no orçamento de Core Web Vitals (LCP, CLS) já validado para a página.
- **Content and media facts**: Fotos, legendas de mídia e informações de contato (endereço, número
  de WhatsApp) permanecem as mesmas já aprovadas, apenas o texto ao redor é traduzido.
- **Data states**: O carregamento do mapa/visualização em nível de rua continua sob demanda
  (carregado a partir de uma ação explícita do visitante), preservando o padrão de privacidade e
  performance já usado hoje na seção de Localização.

### Key Entities *(include if feature involves data)*

- **Preferência de Idioma**: o idioma atualmente selecionado pelo visitante (Português, English ou
  Español), lembrado entre visitas no mesmo navegador.
- **Conteúdo Localizado**: cada texto voltado ao visitante (nomes/descrições de quarto, textos de
  casamentos/eventos, relatos, rótulos de interface, mensagens de WhatsApp) passa a ter uma versão
  por idioma, mantendo os mesmos fatos (comodidades, endereço, contato) em todas as versões.
- **Localização da Pousada**: a posição geográfica exata usada para centralizar o mapa e ancorar a
  visualização em nível de rua, distinta do endereço textual (que hoje é um marco de rodovia).
  Coordenada confirmada pelo proprietário: latitude -23.1819646, longitude -44.7164933
  ("Enseada Do Jatobá, Corumbê - BR 101, Km 570, Paraty - RJ, 23970-000").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A partir de qualquer página do site, um visitante troca o idioma exibido em uma
  única interação (um toque/clique no seletor), e 100% do texto visível é atualizado para o idioma
  escolhido.
- **SC-002**: Em teste com ao menos 2 falantes nativos de inglês e 2 de espanhol, 100% deles
  conseguem, sem ajuda externa, identificar corretamente as comodidades de um quarto (incluindo
  café da manhã e piscina) e descrever como iniciar um contato, usando apenas o site no idioma
  correspondente.
- **SC-003**: Em 100% dos contatos iniciados via WhatsApp após a troca de idioma, a mensagem
  pré-preenchida está no idioma selecionado, sem mistura de idiomas.
- **SC-004**: Um visitante que já escolheu um idioma volta ao site no mesmo navegador e o
  encontra no idioma escolhido anteriormente, sem precisar selecioná-lo de novo, em 100% dos casos
  testados.
- **SC-005**: Na seção de Localização, um visitante consegue identificar a posição exata da
  pousada no mapa, e o site sempre oferece uma forma de abrir a visualização em nível de rua sem
  sair da página — independentemente de o Google ter ou não imagem exata disponível naquele ponto
  (nesse caso, o aviso definido nos Edge Cases conta como atendimento deste critério).
- **SC-006**: Uma varredura automatizada de acessibilidade no seletor de idioma e no conteúdo
  traduzido, nos três idiomas, não encontra nenhuma violação crítica ou séria.

## Assumptions

- "Toda funcionalidade do site" inclui: navegação/menu, seções de quartos, casamentos/eventos,
  relatos, localização, rodapé e todas as chamadas de contato/WhatsApp — não inclui conteúdo
  administrativo interno (fora do escopo do site público).
- Português continua sendo o idioma padrão exibido a um visitante novo, sem seleção prévia salva.
- A preferência de idioma é lembrada localmente no navegador do visitante (sem exigir criação de
  conta ou login, que não existem hoje no site).
- Os textos-fonte já aprovados em português (feature `001-pousada-landing-page` e conteúdo real
  adicionado depois) são a base factual para as versões em inglês e espanhol.
- A troca de idioma é aplicada imediatamente na página atual, sem exigir recarregamento completo
  perceptível pelo visitante.
- O carregamento sob demanda do mapa (em vez de automático), já estabelecido pela feature
  `001-pousada-landing-page` por motivos de performance/privacidade, é preservado independentemente
  do provedor de mapa escolhido.
- A coordenada geográfica exata da pousada foi fornecida pelo proprietário (ver Key Entities >
  Localização da Pousada) e MUST ser usada para centralizar o mapa e ancorar a visualização em
  nível de rua (FR-008/FR-009), em vez de uma estimativa aproximada a partir do endereço textual.
- O conteúdo em inglês/espanhol pode ser publicado com tradução automática inicialmente; a revisão
  humana desse conteúdo é um passo de qualidade posterior à entrega, não um bloqueio ao lançamento
  (FR-006).
- A revisão humana do conteúdo traduzido (FR-006) é de responsabilidade do proprietário da
  pousada, sem prazo formal definido — aceitável para o volume de conteúdo desta feature, já que
  não bloqueia o lançamento.
- Como não há URLs distintas por idioma (ver `research.md` Decision 1), um link compartilhado ou
  salvo por um visitante não preserva o idioma selecionado por outra pessoa; cada visitante recebe
  o idioma já salvo em seu próprio navegador, ou português como padrão.
- Os embeds de mapa/Street View dependem da disponibilidade contínua do recurso gratuito de
  incorporação do Google (sem chave de API); o link "abrir no Google Maps" (`fallbackMapUrl`) já
  existente cobre o caso desse recurso ficar indisponível.
