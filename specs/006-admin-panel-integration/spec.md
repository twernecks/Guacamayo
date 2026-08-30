# Feature Specification: Painel Administrativo — Integração com a Guacamayo API

**Feature Branch**: `006-admin-panel-integration`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Preciso implementar as telas administrativas que consomem a Guacamayo API (repositório separado, já pronta e testada — 128 testes passando). Autenticação por login (JWT + refresh token rotativo). Testar contra a API local por enquanto (http://localhost:5249, CORS já liberado para http://localhost:3000), trocando só a URL base quando o deploy AWS estiver pronto. Escopo: (1) Login persistindo o access/refresh token e renovando automaticamente antes de expirar; (2) CRUD completo de Quartos, Espaços de Evento e Depoimentos — formulário multilíngue (pt/en/es), listagem, criação, edição respeitando controle de concorrência otimista via rowVersion (409 em conflito), exclusão com confirmação; (3) Edição das Configurações do Site — registro único; (4) Gestão de Leads — listagem paginada com filtros de status e data, tela de detalhe com histórico de conversa, marcação de status com controle de rowVersion/409; (5) Tratamento de erro genérico a partir do envelope padrão da API; (6) Proteção de todas as rotas administrativas exigindo login válido."

## Clarifications

### Session 2026-08-25

- Q: Um lead pode transitar livremente entre os três status (Novo/Contatado/Fechado) a qualquer momento, ou só é permitido avançar, sem retroceder? → A: Transição livre — o administrador pode mudar para qualquer um dos três status a qualquer momento, inclusive reabrir um lead marcado como Fechado.
- Q: Se o administrador tentar sair de um formulário de conteúdo com alterações não salvas, o sistema deve avisar antes de descartar o trabalho? → A: Sempre avisar — qualquer navegação para outra tela ou fechamento da aba com alterações pendentes exige confirmação explícita antes de descartar.
- Q: Qual deve ser o tamanho de página padrão (quantidade de leads por página) na listagem de Leads? → A: 20 por página.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login e sessão persistente do administrador (Priority: P1)

Um administrador da pousada acessa o painel administrativo, informa suas credenciais e permanece
autenticado enquanto trabalha, sem precisar refazer login a cada poucos minutos nem perder o
trabalho em andamento por causa da expiração do token de acesso.

**Why this priority**: É a base de tudo. Nenhuma outra tela administrativa pode existir sem uma
sessão autenticada, e uma renovação de sessão malfeita quebra a confiança do administrador no
sistema inteiro (perder um formulário no meio do preenchimento por sessão expirada é o pior tipo de
falha aqui).

**Independent Test**: Pode ser testado sozinho: abrir a tela de login, autenticar com credenciais
válidas e inválidas, permanecer na aplicação além do tempo de expiração do token de acesso e
confirmar que a sessão continua ativa sem interrupção perceptível, e por fim encerrar a sessão pelo
botão de logout.

**Acceptance Scenarios**:

1. **Given** um administrador na tela de login, **When** ele informa email e senha válidos,
   **Then** ele é autenticado e levado à área administrativa.
2. **Given** um administrador na tela de login, **When** ele informa email ou senha incorretos,
   **Then** o sistema mostra uma mensagem genérica de credenciais inválidas, sem indicar se o email
   existe ou não.
3. **Given** um administrador autenticado e com a área administrativa aberta, **When** o tempo de
   vida do token de acesso está prestes a se esgotar, **Then** o sistema renova a sessão
   automaticamente em segundo plano, sem que nenhum dado digitado em formulários abertos seja
   perdido e sem forçar nenhum recarregamento de página.
4. **Given** um administrador autenticado, **When** a sessão não pode mais ser renovada (token de
   atualização expirado, revogado ou reaproveitado), **Then** o sistema encerra a sessão local e
   leva o administrador de volta à tela de login.
5. **Given** um administrador autenticado, **When** ele aciona "Sair", **Then** a sessão é encerrada
   tanto localmente quanto no servidor, e uma tentativa de voltar a uma tela administrativa exige
   novo login.

---

### User Story 2 - Gestão de conteúdo do site: Quartos, Espaços de Evento e Depoimentos (Priority: P2)

Um administrador mantém atualizado o conteúdo público do site — quartos disponíveis, espaços para
eventos e depoimentos de hóspedes — podendo listar, criar, editar e remover itens, sempre
preenchendo o conteúdo nos três idiomas do site (português, inglês e espanhol).

**Why this priority**: É a atividade de maior volume e recorrência do dia a dia administrativo, e é
o valor central pedido: substituir a edição manual/direta de dados por telas de gestão de conteúdo.

**Independent Test**: Pode ser testado sozinho: a partir de uma sessão autenticada, abrir a
listagem de Quartos (ou Espaços de Evento, ou Depoimentos), criar um item novo preenchendo os três
idiomas, editá-lo, e por fim excluí-lo confirmando a ação — sem depender de nenhuma outra história
deste conjunto.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado, **When** ele abre a listagem de Quartos, **Then** vê
   todos os quartos cadastrados, publicados ou não.
2. **Given** um administrador preenchendo o formulário de um novo Quarto, **When** ele deixa um
   campo obrigatório vazio em algum dos três idiomas e tenta publicar, **Then** o sistema impede o
   envio e indica exatamente qual campo, em qual idioma, precisa ser preenchido.
3. **Given** um administrador editando um item que outra pessoa também está editando, **When** ele
   salva depois que a outra pessoa já salvou uma alteração no mesmo item, **Then** o sistema recusa
   o salvamento, avisa que o item foi alterado por outra pessoa nesse meio-tempo, e oferece
   recarregar a versão mais recente antes de tentar salvar de novo.
4. **Given** um administrador na listagem de um item, **When** ele aciona excluir, **Then** o
   sistema pede confirmação explícita, avisando que a exclusão é permanente, antes de remover o
   item definitivamente.
5. **Given** a confirmação de exclusão aberta, **When** o administrador cancela, **Then** o item
   permanece inalterado e nenhuma chamada de exclusão é feita à API.
6. **Given** as mesmas capacidades de listar, criar, editar e excluir, **When** aplicadas a Espaços
   de Evento ou a Depoimentos, **Then** o comportamento é equivalente ao de Quartos, respeitando os
   campos próprios de cada tipo de conteúdo.
7. **Given** um administrador com alterações não salvas em um formulário de Quarto, Espaço de
   Evento ou Depoimento, **When** ele tenta navegar para outra tela do painel ou fechar a aba,
   **Then** o sistema pede confirmação explícita antes de descartar as alterações.

---

### User Story 3 - Gestão de leads capturados pelo bot de WhatsApp (Priority: P3)

Um administrador consulta os contatos que o bot de WhatsApp capturou — hoje sem nenhuma tela para
vê-los —, filtra por status e por período, abre o detalhe de um lead para ver a conversa completa
que o originou, e marca o lead como "Contatado" ou "Fechado" conforme o atendimento avança.

**Why this priority**: Hoje esses leads são efetivamente invisíveis para a equipe: dados sendo
capturados sem nenhuma forma de consulta. Depois da sessão autenticada, é a lacuna de maior valor
de negócio a fechar, pois afeta diretamente a capacidade da pousada de responder a interessados.

**Independent Test**: Pode ser testado sozinho: a partir de uma sessão autenticada, abrir a
listagem de leads, aplicar um filtro de status e um intervalo de datas, abrir o detalhe de um lead
específico para ver a conversa de origem, e alterar seu status — sem depender das telas de
conteúdo do site.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado, **When** ele abre a listagem de leads, **Then** vê os
   leads mais recentes primeiro, podendo navegar por páginas adicionais.
2. **Given** a listagem de leads, **When** o administrador filtra por status (Novo, Contatado ou
   Fechado) e/ou por um intervalo de datas de criação, **Then** apenas os leads que atendem aos
   filtros aparecem.
3. **Given** um intervalo de datas onde a data inicial é posterior à data final, **When** o
   administrador aplica o filtro, **Then** o sistema recusa o filtro e explica o problema, em vez
   de retornar uma lista vazia ou incorreta silenciosamente.
4. **Given** um lead específico, **When** o administrador abre seu detalhe, **Then** vê nome,
   telefone, interesse, mensagem e o histórico completo de mensagens trocadas na conversa que
   originou o lead.
5. **Given** um lead cuja conversa de origem não existe mais, **When** o administrador abre seu
   detalhe, **Then** o histórico de mensagens aparece vazio, apresentado como uma condição normal
   e não como uma falha.
6. **Given** um lead com status "Novo", **When** o administrador o marca como "Contatado" ou
   "Fechado", **Then** o novo status é salvo e refletido tanto no detalhe quanto na listagem.
7. **Given** um lead com status "Fechado", **When** o administrador o marca de volta como "Novo"
   ou "Contatado", **Then** a transição é aceita normalmente — a mudança de status não segue uma
   ordem obrigatória e pode ser revertida a qualquer momento.
8. **Given** um lead que outra pessoa alterou entre o carregamento da tela e a tentativa de salvar
   um novo status, **When** o administrador tenta salvar, **Then** o sistema recusa o salvamento e
   pede para recarregar o lead antes de tentar novamente — mesmo comportamento de conflito das
   telas de conteúdo.

---

### User Story 4 - Edição das Configurações do Site (Priority: P4)

Um administrador atualiza as informações gerais do site — dados de contato, localização e mídia de
destaque da página inicial — em um único lugar, sem opção de criar ou excluir esse registro, já
que ele é único por definição.

**Why this priority**: É uma tela simples, de baixa frequência de uso e de menor complexidade
relativa (um único registro, sem listagem nem exclusão), por isso vem por último — mas ainda é
parte do valor central de dar autonomia ao administrador sobre o conteúdo do site.

**Independent Test**: Pode ser testado sozinho: a partir de uma sessão autenticada, abrir a tela de
Configurações do Site, alterar um campo e salvar, confirmando que a mudança persiste — sem
depender de nenhuma das outras histórias.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado, **When** ele abre a tela de Configurações do Site,
   **Then** vê os valores atuais de contato, localização e mídia de destaque, sem nenhuma opção de
   "criar novo" ou "excluir".
2. **Given** a tela de Configurações do Site com alterações pendentes, **When** o administrador
   salva, **Then** os novos valores passam a valer para o site.
3. **Given** o registro de configurações alterado por outra ação entre a leitura e o salvamento,
   **When** o administrador tenta salvar, **Then** o sistema recusa o salvamento e pede para
   recarregar antes de tentar novamente, do mesmo modo que nas demais telas de conteúdo.
4. **Given** um administrador com alterações não salvas nas Configurações do Site, **When** ele
   tenta navegar para outra tela do painel ou fechar a aba, **Then** o sistema pede confirmação
   explícita antes de descartar as alterações.

---

### Edge Cases

- O que acontece quando o administrador está preenchendo um formulário longo (ex.: um Quarto em
  três idiomas) e a renovação automática da sessão falha nesse meio-tempo? O sistema deve permitir
  a ele copiar/preservar o que já digitou ou, no mínimo, avisar antes de descartar o formulário ao
  redirecionar para o login.
- O que acontece se a API administrativa estiver fora do ar ou inacessível (ex.: ambiente local
  desligado)? O sistema deve informar claramente que não conseguiu se comunicar com o servidor,
  distinguindo isso de um erro de validação ou de permissão.
- O que acontece quando o administrador tenta acessar diretamente uma URL administrativa (por
  exemplo, colando o link) sem estar autenticado? Ele deve ser redirecionado ao login e, após
  autenticar-se, levado à página que originalmente tentou acessar.
- O que acontece quando um filtro de paginação de leads pede uma quantidade de itens fora da faixa
  aceita pela API? O sistema deve ajustar para um valor válido ou explicar o limite ao
  administrador, em vez de repassar um erro técnico bruto.
- O que acontece quando dois administradores estão logados ao mesmo tempo e um deles exclui um item
  que o outro está editando? Ao tentar salvar, o segundo administrador deve receber uma mensagem
  clara de que o item não existe mais, em vez de um erro genérico.
- O que acontece quando o administrador reabre o navegador depois que o token de atualização já
  expirou enquanto ele estava fechado? O sistema deve simplesmente apresentar a tela de login,
  tratando isso como início de uma nova sessão, não como um erro.
- O que acontece quando a tela para a qual o administrador seria redirecionado após o login (FR-008)
  deixou de existir nesse meio-tempo (ex.: o item foi excluído por outra pessoa)? O sistema deve
  tratar isso como o erro correspondente da própria tela de destino (ex.: "item não encontrado"),
  em vez de falhar o redirecionamento em si.
- O que acontece quando a renovação automática da sessão falha justamente no momento em que o
  administrador está enviando um formulário (não apenas navegando)? O sistema deve informar que a
  sessão precisou ser renovada e pedir para tentar salvar novamente, em vez de descartar o envio
  silenciosamente ou reportar um erro genérico.
- O que acontece quando um lead vem com nome ou telefone ausente? O sistema deve exibir um
  indicador claro de "não informado" nesse campo, em vez de deixá-lo em branco sem explicação.
- O que acontece ao editar um Quarto, Espaço de Evento ou Depoimento criado antes desta
  funcionalidade existir, com apenas alguns dos três idiomas preenchidos? O sistema deve permitir
  abrir e editar o item normalmente, indicando quais idiomas estão vazios — o bloqueio do FR-012
  só se aplica no momento de publicar, não no de simplesmente salvar um rascunho.

## Requirements *(mandatory)*

### Functional Requirements

**Autenticação e sessão**

- **FR-001**: O sistema MUST permitir que um administrador se autentique informando email e senha.
- **FR-002**: O sistema MUST manter o administrador autenticado entre recarregamentos de página,
  sem exigir novo login, enquanto a sessão continuar válida.
- **FR-003**: O sistema MUST renovar a sessão automaticamente antes que o token de acesso expire, de
  forma que nenhuma chamada à API seja rejeitada por expiração enquanto a sessão estiver ativa. A
  renovação MUST se basear no horário de expiração informado pelo servidor na resposta de
  autenticação, não no relógio local do dispositivo do administrador.
- **FR-004**: O sistema MUST detectar quando a sessão não pode mais ser renovada (token de
  atualização inválido, expirado, revogado ou reaproveitado) e, nesse caso, encerrar a sessão local
  e levar o administrador de volta ao login.
- **FR-005**: O sistema MUST permitir que o administrador encerre a sessão explicitamente
  ("Sair"), invalidando-a tanto localmente quanto no servidor.
- **FR-006**: O sistema MUST exibir uma mensagem genérica de credenciais inválidas em caso de
  falha de login, sem revelar se o email informado existe.

**Proteção de rotas**

- **FR-007**: O sistema MUST bloquear o acesso a qualquer tela administrativa para quem não estiver
  autenticado, redirecionando para o login.
- **FR-007a**: O sistema MUST redirecionar um administrador já autenticado para a área
  administrativa caso ele tente acessar diretamente a tela de login, em vez de exibir o formulário
  de login novamente.
- **FR-008**: O sistema MUST, após um login bem-sucedido feito a partir de um redirecionamento,
  levar o administrador à tela que ele originalmente tentou acessar; se essa tela não existir mais,
  o sistema MUST mostrar o erro correspondente da própria tela de destino, em vez de falhar o
  redirecionamento.

**Gestão de conteúdo (Quartos, Espaços de Evento, Depoimentos)**

- **FR-009**: O sistema MUST permitir listar todos os itens de cada tipo de conteúdo (Quartos,
  Espaços de Evento, Depoimentos), incluindo os ainda não publicados.
- **FR-010**: O sistema MUST permitir criar um novo item de cada tipo de conteúdo, capturando o
  conteúdo textual nos três idiomas do site (português, inglês, espanhol).
- **FR-011**: O sistema MUST permitir editar um item existente, incluindo seu estado de publicação
  e sua ordem de exibição.
- **FR-012**: O sistema MUST impedir a publicação de um item que esteja com algum campo obrigatório
  vazio em qualquer um dos três idiomas, indicando claramente qual campo e idioma faltam.
- **FR-013**: O sistema MUST permitir excluir um item somente após confirmação explícita do
  administrador, deixando claro nessa confirmação que a exclusão é permanente e não pode ser
  desfeita — uma mensagem distinta e mais enfática do que o aviso de descarte de alterações não
  salvas (FR-017a). Cancelar a confirmação MUST deixar o item inalterado, sem nenhuma chamada à
  API.
- **FR-014**: O sistema MUST detectar quando o item sendo salvo foi alterado por outra pessoa desde
  que foi carregado, recusar o salvamento nesse caso, e orientar o administrador a recarregar a
  versão mais recente antes de tentar novamente.

**Configurações do Site**

- **FR-015**: O sistema MUST permitir visualizar e editar o registro único de configurações do
  site (contato, localização e mídia de destaque).
- **FR-016**: O sistema MUST NOT oferecer ações de criação ou exclusão para as configurações do
  site, por se tratar de um registro único.
- **FR-017**: O sistema MUST aplicar a mesma detecção de conflito de edição simultânea (FR-014) às
  configurações do site.

**Proteção contra perda de dados não salvos**

- **FR-017a**: O sistema MUST pedir confirmação explícita antes de descartar alterações não
  salvas em qualquer formulário administrativo (Quarto, Espaço de Evento, Depoimento ou
  Configurações do Site), seja ao navegar para outra tela do painel ou ao fechar a aba/janela. Essa
  proteção não se aplica à alteração de status de um lead (FR-023), por ser uma ação pontual de um
  clique, sem formulário com múltiplos campos.

**Gestão de Leads**

- **FR-018**: O sistema MUST permitir listar os leads capturados pelo bot de WhatsApp, ordenados do
  mais recente para o mais antigo, com navegação por páginas de 20 leads por página.
- **FR-019**: O sistema MUST permitir filtrar a listagem de leads por status (Novo, Contatado,
  Fechado) e por um intervalo de datas de criação.
- **FR-020**: O sistema MUST validar que a data inicial de um filtro de período não seja posterior
  à data final, informando o problema ao administrador quando isso ocorrer.
- **FR-021**: O sistema MUST permitir abrir o detalhe de um lead individual, mostrando nome,
  telefone, interesse, mensagem e o histórico completo de mensagens da conversa que o originou. Um
  nome ou telefone ausente MUST ser exibido com um indicador claro de "não informado", nunca como
  um espaço em branco sem explicação.
- **FR-022**: O sistema MUST apresentar um histórico de conversa vazio como uma condição normal
  (não como erro) quando a conversa de origem do lead não existir mais.
- **FR-023**: O sistema MUST permitir alterar o status de um lead livremente entre "Novo",
  "Contatado" e "Fechado", em qualquer ordem, incluindo reabrir um lead já marcado como "Fechado".
- **FR-024**: O sistema MUST aplicar a mesma detecção de conflito de edição simultânea (FR-014) à
  alteração de status de um lead.

**Estados de carregamento**

- **FR-024a**: O sistema MUST exibir um indicador de carregamento enquanto os dados de qualquer
  listagem ou tela de detalhe (Quartos, Espaços de Evento, Depoimentos, Configurações do Site,
  Leads) ainda estão sendo obtidos da API.

**Tratamento de erros**

- **FR-025**: O sistema MUST traduzir qualquer resposta de falha da API em uma mensagem clara e
  compreensível para o administrador, usando o código, a mensagem e os detalhes do erro quando
  disponíveis.
- **FR-026**: O sistema MUST exibir erros de validação junto ao campo do formulário a que se
  referem, quando a resposta da API indicar qual campo específico falhou.
- **FR-027**: O sistema MUST informar o administrador, de forma distinta de um erro de validação ou
  de permissão, quando o sistema administrativo não conseguir se comunicar com o servidor.

### Key Entities *(include if feature involves data)*

- **Sessão do Administrador**: representa um administrador autenticado; guarda a identidade
  (nome/email) e o par de tokens (acesso e atualização) que controlam por quanto tempo e com que
  privilégios ele pode operar as telas administrativas.
- **Quarto**: item de conteúdo publicável do site com nome, descrição e comodidades em três
  idiomas, estado de publicação, destaque visual e ordem de exibição.
- **Espaço de Evento**: item de conteúdo publicável equivalente ao Quarto, com um contexto de
  contato próprio no lugar de comodidades.
- **Depoimento**: item de conteúdo publicável com citação e atribuição em três idiomas, tipo de
  experiência relatada, data de aprovação e estado de publicação.
- **Configurações do Site**: registro único com informações de contato, localização e a mídia de
  destaque usada na página inicial.
- **Lead**: contato capturado pelo bot de WhatsApp, com nome, telefone, interesse (categoria
  definida por um enum já existente na API, cujos valores exatos serão confirmados no
  planejamento técnico), mensagem inicial, status (Novo, Contatado, Fechado) e data de criação.
- **Conversa do Lead**: histórico de mensagens (direção enviada/recebida, conteúdo e horário) trocadas
  com o lead, associado a ele; pode estar vazio quando a conversa original não existe mais.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um administrador com credenciais válidas consegue entrar na área administrativa em
  até 2 tentativas, sem consultar documentação ou suporte.
- **SC-002**: Um administrador que continua interagindo com o painel (qualquer ação — navegar,
  digitar, salvar) ao longo de uma sessão de trabalho de ao menos 4 horas nunca é desconectado por
  expiração de token; a única forma de perder a sessão é ficar sem realizar nenhuma ação por um
  período prolongado de inatividade completa.
- **SC-003**: 100% das tentativas de salvar um item de conteúdo ou lead que foi alterado por outra
  pessoa nesse meio-tempo são bloqueadas e claramente sinalizadas ao administrador, nunca
  sobrescrevendo silenciosamente a mudança alheia.
- **SC-004**: Um administrador consegue localizar um lead específico e visualizar sua conversa
  completa de origem em até 3 passos a partir da listagem de leads — um "passo" é uma navegação de
  página ou a aplicação de um filtro (ex.: listagem → aplicar filtro → abrir detalhe conta como 2).
- **SC-005**: Leads capturados pelo bot de WhatsApp, hoje sem nenhuma forma de consulta, tornam-se
  visíveis e classificáveis (Novo/Contatado/Fechado) por um administrador em uma única sessão de
  uso, sem apoio técnico externo.
- **SC-006**: 100% das respostas de falha vindas da API resultam em uma mensagem legível para o
  administrador, nunca em uma tela em branco ou travada.
- **SC-007**: Nenhuma tela administrativa é acessível por um usuário sem uma sessão válida,
  verificado por tentativa direta de acesso a qualquer URL administrativa.
- **SC-008**: Um administrador consegue corrigir e publicar com sucesso um Quarto, Espaço de Evento
  ou Depoimento após um erro de validação em no máximo uma tentativa adicional de reenvio, sem
  precisar adivinhar qual campo ou idioma faltava.
- **SC-009**: Listagens com até 100 itens (Quartos, Espaços de Evento, Depoimentos ou uma página de
  Leads) ficam totalmente carregadas e prontas para interação em até 3 segundos sob condições
  normais de rede.

## Assumptions

- Existe um único papel de administrador ("mantenedor"), sem níveis diferentes de permissão dentro
  da área administrativa — todas as telas descritas ficam disponíveis a qualquer administrador
  autenticado. Se no futuro surgir a necessidade de papéis diferenciados, isso exige uma nova
  análise de escopo, não coberta por esta especificação.
- A sessão do administrador (tokens de acesso e atualização) persiste no navegador entre
  recarregamentos e reaberturas da aba/janela, até que o token de atualização expire, seja
  revogado, ou o administrador saia explicitamente — o padrão usual de aplicações que usam
  atualização automática de token (refresh rotativo).
- Não há autoatendimento de recuperação de senha no escopo desta funcionalidade; a criação e a
  redefinição de credenciais de administrador acontecem por fora das telas aqui descritas.
- O controle de concorrência otimista (detecção de edição simultânea) se aplica da mesma forma às
  Configurações do Site e à atualização de status de Leads, tal como já é explícito para Quartos,
  Espaços de Evento e Depoimentos. Essa suposição deve ser confirmada contra o comportamento real
  da API durante o planejamento técnico, já que o contrato consultado não deixa isso 100% explícito
  para Configurações do Site.
- Não há bloqueio de conta por tentativas repetidas de login incorreto no escopo desta
  funcionalidade de UI; a tela apenas repassa o erro genérico de credenciais inválidas (FR-006) a
  cada tentativa, sem impor limite próprio.
- A listagem de leads é consultada sob demanda (o administrador precisa abrir ou atualizar a tela);
  não há notificação em tempo real de novos leads no escopo desta funcionalidade.
- Os filtros da listagem de leads se limitam a status e a um intervalo de datas de criação,
  conforme o contrato de origem da API; busca por nome/telefone e outras ordenações não fazem parte
  do escopo desta funcionalidade.
- Por segurança, a mensagem exibida ao administrador quando a sessão termina de forma forçada não
  distingue a causa técnica (token expirado, revogado ou reaproveitado por outra pessoa) — todas
  resultam no mesmo comportamento de retorno ao login (FR-004).
- O histórico de mensagens de um lead é exibido por completo, sem paginação adicional na tela, pois
  a API retorna a lista completa de mensagens no detalhe do lead; volumes muito grandes de
  mensagens não são esperados para o perfil de uso da pousada e ficam fora do escopo de otimização
  desta versão.
- Mensagens da conversa podem conter qualquer texto Unicode, incluindo emojis; a tela deve exibi-las
  como texto simples, sem exigir tratamento especial de direção de texto, já que os três idiomas do
  site (pt/en/es) são todos escritos da esquerda para a direita.
- Requisitos formais de acessibilidade (WCAG) não são obrigatórios nesta versão, dado o uso interno
  por equipe conhecida e de confiança; os formulários devem seguir boas práticas básicas de
  rotulagem, mas testes de acessibilidade formais ficam fora do escopo.
- A interface do próprio painel (menus, botões, rótulos do sistema) é apresentada em português, já
  que a equipe administrativa é brasileira; isso é independente dos três idiomas de conteúdo
  (pt/en/es) capturados nos formulários de Quartos, Espaços de Evento e Depoimentos.
- O histórico de mensagens do lead depende inteiramente dos dados que o bot de WhatsApp já gravou;
  a área administrativa não gera, edita nem corrige essas mensagens, apenas as exibe tal como
  vieram da API.
- A área administrativa é usada por equipe interna e de confiança, majoritariamente em
  desktop/notebook; suporte otimizado para telas móveis não é um requisito desta funcionalidade.
- A URL base da API é um detalhe de configuração de ambiente (local hoje, produção quando o deploy
  na AWS estiver pronto) e não altera nenhum comportamento funcional descrito nesta especificação.
- Os valores de enumeração retornados pela API (por exemplo, interesse e status do lead, direção da
  mensagem) chegam como códigos numéricos; cabe à área administrativa apresentá-los como rótulos
  legíveis para o administrador.
