# Feature Specification: Redesign Visual do Painel Administrativo

**Feature Branch**: `007-admin-ui-redesign`

**Created**: 2026-08-29

**Status**: Draft

**Input**: User description: "consulte o /ui-ux-pro-max sobre as condições e design e qualidade das telas de login e demais telas administrativas... quero que analise e gere um plano para corrigir o design dessas telas pois pra mim estão MUITO ruins .. veja como está o print! Quero qualidades de telas profissionais e com qualidade, se for ausência de alguma tecnologia ou restrição do react/typescript ou CSS que estamos utilizando sinalize"

## Diagnóstico (consulta `/ui-ux-pro-max` + inspeção do código)

O print anexado pelo usuário (tela `/admin/login`) mostra um formulário totalmente sem estilo: título serifado grande sem hierarquia, campos `<input>` nativos do navegador sem padding/borda/foco visível, botão com estilo padrão do navegador, tudo colado no canto superior esquerdo sem container, cor de marca ou espaçamento. A inspeção do código confirma a causa exata: `src/components/admin/LoginForm.tsx` e todas as páginas em `src/app/admin/**` renderizam HTML semântico puro — **nenhum `className` é usado em nenhum componente administrativo**. O mesmo padrão se repete em `AdminNav`, `ContentTable`, `ContentForm`, listagens e formulários de Quartos/Espaços de Evento/Depoimentos, Configurações do Site e Leads.

**Não há lacuna de tecnologia.** O projeto **não usa Tailwind** (confirmado em `package.json`) — o padrão real, já maduro e usado em ~12 componentes do site público (`src/components/ui/Button.module.css`, `Container.module.css`, `Heading.module.css`, etc.), é **CSS Modules + variáveis CSS customizadas** (`src/app/globals.css`): paleta de cor completa com suporte a modo escuro via `prefers-color-scheme`, escala tipográfica (`--font-heading`/`--font-body`), escala de espaçamento (`--space-*`), raios (`--radius-*`) e sombras (`--shadow-*`). Esse sistema de design já é usado com qualidade profissional no site público — ele simplesmente nunca foi aplicado às telas administrativas. React 19 + TypeScript + CSS Modules são inteiramente capazes de produzir a qualidade visual pedida; não é necessário adicionar Tailwind, um UI kit (shadcn/Radix/MUI) ou qualquer nova dependência.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login profissional e alinhado à marca (Priority: P1)

Como administrador, ao acessar `/admin/login` eu vejo uma tela com identidade visual profissional e consistente com a marca do site (mesma paleta, tipografia e espaçamento usados nas páginas públicas), em vez de um formulário de navegador sem estilo.

**Why this priority**: É a primeira tela que qualquer administrador vê, a mais visível externamente (inclusive para stakeholders avaliando a qualidade do produto) e foi o ponto explicitamente sinalizado pelo usuário como "MUITO ruim". Corrigi-la sozinha já produz um ganho de percepção de qualidade imediato e é independente das demais telas.

**Independent Test**: Acessar `/admin/login` em um navegador e verificar visualmente que o formulário está centralizado em um container com espaçamento e bordas definidas, os campos têm rótulo, borda, padding e destaque de foco visíveis, e o botão usa um estilo consistente com os botões do site público — sem depender de nenhuma outra tela estar pronta.

**Acceptance Scenarios**:

1. **Given** um administrador não autenticado acessa `/admin/login`, **When** a página carrega, **Then** o formulário aparece centralizado dentro de um cartão/container visualmente delimitado, com espaçamento adequado ao redor, usando a paleta de cores e tipografia já definidas em `globals.css`.
2. **Given** o formulário de login está visível, **When** o campo de email ou senha recebe foco via teclado, **Then** um indicador de foco visível é exibido (mantendo o `:focus-visible` já definido globalmente).
3. **Given** o administrador envia credenciais inválidas, **When** o erro é exibido, **Then** a mensagem aparece em um componente visualmente destacado (não um `<p>` sem estilo), mantendo o anúncio via `role="alert"` já implementado.

---

### User Story 2 - Navegação e casca administrativa consistentes (Priority: P2)

Como administrador autenticado, eu vejo em todas as páginas do painel uma navegação persistente e estilizada (cabeçalho/menu) que identifica a seção atual, lista os links para todas as áreas administrativas e oferece uma forma clara de sair, em vez de uma lista de links de texto simples.

**Why this priority**: A navegação aparece em 100% das páginas autenticadas; corrigi-la eleva a qualidade percebida em todo o painel de uma vez e é pré-requisito visual para as telas de conteúdo (US3/US4) parecerem parte do mesmo produto.

**Independent Test**: Fazer login e navegar entre `/admin/rooms`, `/admin/leads`, `/admin/site-settings` etc., verificando que o cabeçalho/menu permanece visualmente consistente, estilizado, com a seção ativa perceptível e o botão "Sair" claramente identificável — sem depender do redesenho interno de cada página de conteúdo.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado em qualquer página de `/admin/**`, **When** a página renderiza, **Then** um cabeçalho/menu estilizado (cores, espaçamento, tipografia do sistema de design) aparece com links para todas as seções administrativas.
2. **Given** o administrador está em uma seção específica (ex: `/admin/leads`), **When** olha para a navegação, **Then** consegue identificar visualmente qual seção está ativa.
3. **Given** o administrador quer encerrar a sessão, **When** localiza o controle de logout no cabeçalho/menu, **Then** ele é reconhecível como um botão de ação (não um link de texto solto) e no mínimo 44×44px de área clicável.

---

### User Story 3 - Listagens e formulários de conteúdo com qualidade profissional (Priority: P3)

Como administrador, ao gerenciar Quartos, Espaços de Evento e Depoimentos (listar, criar, editar, excluir), eu vejo tabelas legíveis com ações claramente estilizadas e formulários organizados (abas de idioma, campos agrupados, botões de ação) em vez de HTML sem estilo.

**Why this priority**: É onde o administrador passa a maior parte do tempo operacional (CRUD de conteúdo), mas depende visualmente da casca de navegação (US2) para parecer parte do mesmo produto — por isso vem depois.

**Independent Test**: Abrir `/admin/rooms` (e repetir para event-spaces/testimonials): a listagem mostra uma tabela com cabeçalhos, espaçamento entre linhas e botões de ação estilizados para editar/excluir; abrir "Novo Quarto" e confirmar que o formulário multilíngue (abas pt/en/es), campos extras e botão de salvar seguem o mesmo sistema visual — testável independentemente das telas de Leads/Configurações.

**Acceptance Scenarios**:

1. **Given** uma listagem de conteúdo (Quartos/Espaços de Evento/Depoimentos) com itens, **When** a tabela renderiza, **Then** as linhas têm espaçamento e alinhamento consistentes e as ações (editar/excluir) aparecem como botões/ícones estilizados, não texto puro.
2. **Given** uma listagem sem itens, **When** a página renderiza, **Then** o estado vazio é exibido como um componente visual estilizado, não apenas texto solto.
3. **Given** o formulário de criação/edição multilíngue, **When** o administrador troca entre as abas pt/en/es, **Then** a aba ativa é visualmente destacada e os campos mantêm rótulos, bordas e espaçamento consistentes.
4. **Given** uma tentativa de salvar que resulta em conflito de concorrência (409), **When** o banner de conflito aparece, **Then** ele é visualmente destacado como aviso (cor/ícone de atenção), consistente com o restante do sistema de design.

---

### User Story 4 - Configurações do Site e Leads com o mesmo padrão visual (Priority: P4)

Como administrador, ao acessar Configurações do Site e a área de Leads (listar, filtrar, ver detalhe, mudar status), eu vejo o mesmo padrão visual profissional já aplicado às demais telas, incluindo filtros, formulário plano de configurações e detalhe de conversa do lead.

**Why this priority**: Telas de menor frequência de uso que as de CRUD de conteúdo, mas igualmente visíveis; ficam por último porque reaproveitam os mesmos componentes estilizados criados nas histórias anteriores (formulário, tabela, botões, banners), reduzindo o esforço quando chegam nesta fase.

**Independent Test**: Abrir `/admin/site-settings` e confirmar que o formulário plano usa os mesmos inputs/labels estilizados das demais telas; abrir `/admin/leads`, aplicar um filtro de status/data e abrir o detalhe de um lead, confirmando que a lista, os filtros e o painel de conversa seguem o mesmo sistema visual — sem depender de nenhuma tela adicional.

**Acceptance Scenarios**:

1. **Given** a tela de Configurações do Site, **When** ela renderiza, **Then** todos os campos usam os mesmos componentes de input estilizados definidos nas histórias anteriores.
2. **Given** a listagem de Leads, **When** o administrador aplica um filtro de status ou intervalo de datas, **Then** os controles de filtro são visualmente estilizados e o feedback de filtro inválido (`from > to`) aparece de forma clara.
3. **Given** o detalhe de um lead, **When** a página renderiza, **Then** os controles de mudança de status e o histórico de conversa (quando existente) seguem o mesmo padrão visual (espaçamento, tipografia, cores) do restante do painel.

---

### Edge Cases

- Valores longos em células de tabela (nomes extensos) devem truncar ou quebrar linha sem distorcer o layout da tabela.
- Estados vazios (nenhum quarto, nenhum lead) devem usar um componente visual estilizado, nunca apenas texto solto sem contexto.
- Banners de erro/conflito devem ser visualmente distintos do conteúdo normal (cor/ícone de atenção) sem serem alarmantes a ponto de parecer um erro do sistema.
- Em viewports pequenos (a partir de 375px), a navegação, tabelas e formulários não podem gerar rolagem horizontal nem sobrepor conteúdo.
- Navegação via teclado deve preservar indicadores de foco visíveis em todos os elementos interativos redesenhados (inputs, botões, links de tabela, abas de idioma).
- Formulários longos (3 abas de idioma + campos extras) devem manter agrupamento visual claro para não parecerem uma lista indiferenciada de campos.
- O modo escuro do sistema operacional (já suportado via `prefers-color-scheme` em `globals.css`) deve ser herdado automaticamente pelas telas administrativas ao reutilizar os mesmos tokens — não requer um tema separado.
- Estados de carregamento (botão "Salvando…", spinner de listagem) devem ter feedback visual além da troca de texto (ex: opacidade reduzida, spinner), evitando a impressão de tela travada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE estilizar todas as telas administrativas (login, casca de navegação, listagens, formulários de criação/edição, Configurações do Site, Leads) usando os tokens de design (cores, espaçamento, raio, sombra, tipografia) já definidos em `src/app/globals.css`, eliminando toda a renderização de elementos HTML nativos sem estilo.
- **FR-002**: A tela de login DEVE apresentar o formulário dentro de um cartão/container centralizado e visualmente delimitado, com rótulos visíveis, campos com borda/padding/estado de foco estilizados, e um botão principal consistente com o componente de botão do site público.
- **FR-003**: O painel administrativo DEVE apresentar uma casca de navegação persistente e estilizada (cabeçalho e/ou menu) em toda página autenticada, indicando a seção atual, com links para todas as seções e um controle claro de logout.
- **FR-004**: Todos os botões do painel administrativo DEVEM usar um conjunto pequeno e consistente de variantes estilizadas (primário/secundário/destrutivo) — nenhum botão pode manter o estilo padrão do navegador.
- **FR-005**: Todos os campos de formulário (texto, área de texto, checkbox, rádio, data) DEVEM ter rótulo visível associado, padding/borda/raio consistentes e um estado de foco visível.
- **FR-006**: As tabelas de listagem (Quartos, Espaços de Evento, Depoimentos, Leads) DEVEM apresentar linhas com espaçamento adequado, cabeçalhos de coluna claros, e ações de linha (editar/excluir) como botões/ícones estilizados com no mínimo 44×44px de área clicável.
- **FR-007**: Estados de erro, conflito de concorrência e listas vazias DEVEM ser exibidos como componentes visuais distintos e estilizados (banners/painéis), nunca como texto `<p>` sem estilo.
- **FR-008**: Estados de carregamento DEVEM usar um indicador visual estilizado (spinner ou equivalente), consistente com o sistema de design, e não apenas um texto genérico.
- **FR-009**: O design visual administrativo DEVE reutilizar a mesma paleta de cores, tipografia e escala de espaçamento já definidas para o site público, garantindo consistência de marca em vez de uma identidade visual administrativa desconexa.
- **FR-010**: As telas administrativas redesenhadas DEVEM permanecer utilizáveis sem rolagem horizontal em larguras de viewport entre 375px e 1440px.
- **FR-011**: Todos os elementos interativos DEVEM manter um indicador de foco visível ao navegar via teclado e atender a uma relação de contraste mínima de 4.5:1 (WCAG 2.2 AA) tanto no modo claro quanto no escuro.
- **FR-012**: O redesenho NÃO DEVE alterar o comportamento funcional, os fluxos de dados ou as regras de negócio já implementados no painel administrativo (autenticação, CRUD, validações, controle de concorrência) — as mudanças ficam restritas a marcação/apresentação/estilo.
- **FR-013**: Ícones eventualmente introduzidos nas telas administrativas DEVEM ser baseados em SVG, nunca caracteres emoji.
- **FR-014**: O redesenho NÃO DEVE introduzir uma nova dependência de framework CSS ou biblioteca de componentes de UI; a implementação DEVE seguir o padrão já existente no projeto (CSS Modules + variáveis CSS customizadas).

### Key Entities

*Não aplicável — esta funcionalidade é exclusivamente de apresentação/estilo visual e não introduz, altera ou remove entidades de dados.*

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um administrador consegue identificar a ação principal da tela de login (campos de email/senha e botão de entrar) em até 3 segundos após o carregamento da página, em um teste de usabilidade informal.
- **SC-002**: Zero telas administrativas apresentam elementos de formulário ou botões com aparência padrão não estilizada do navegador — verificado por auditoria visual de todas as rotas em `/admin/**`.
- **SC-003**: Todas as telas administrativas renderizam sem rolagem horizontal e sem conteúdo cortado nas larguras de 375px, 768px, 1024px e 1440px.
- **SC-004**: 100% dos elementos interativos (botões, links, checkboxes, ações de linha em tabela) possuem uma área clicável de no mínimo 44×44px.
- **SC-005**: Textos e elementos interativos atendem a uma relação de contraste mínima de 4.5:1 em relação ao fundo, tanto no modo claro quanto no escuro.
- **SC-006**: Nenhuma nova dependência de execução (`dependencies`) é adicionada ao `package.json` para alcançar a qualidade visual pedida.
- **SC-007**: Toda a suíte de testes automatizados existente do painel administrativo (unitários, integração e e2e) continua passando após o redesenho, com no máximo ajustes de seletor/texto ligados à nova marcação — nenhuma asserção de comportamento/lógica de negócio precisa mudar.

## Assumptions

- Os tokens de design já existentes em `src/app/globals.css` (cores, espaçamento, raio, sombra, tipografia), já usados de forma consistente e madura em todo o site público, são a fonte de verdade correta e suficiente para o redesenho administrativo — não é necessário criar uma nova paleta, tipografia ou linguagem visual específica para o admin.
- **Não há lacuna de tecnologia**: o stack atual (Next.js com `output: "export"`, React 19, TypeScript, CSS Modules + variáveis CSS customizadas, sem Tailwind ou UI kit) é plenamente capaz de produzir a qualidade visual solicitada. A aparência ruim atual é causada pela total ausência de estilização nos componentes administrativos (confirmado: `LoginForm.tsx` e todas as páginas de `/admin/**` não usam nenhum `className`), não por qualquer restrição de React/TypeScript/CSS.
- Este é um redesenho exclusivamente visual/de apresentação: não deve alterar lógica de autenticação, regras de validação, contratos de API, roteamento ou qualquer comportamento de negócio já entregue na feature `006-admin-panel-integration`.
- O suporte a modo escuro é herdado automaticamente ao reutilizar os tokens existentes baseados em `prefers-color-scheme`; não é necessário nenhum trabalho de design específico para modo escuro além de reutilizar os mesmos tokens.
- Um pequeno conjunto de novos componentes de apresentação reutilizáveis (ex.: Input, Button, Card, Table, Banner, Nav estilizados para o admin) será criado seguindo o mesmo padrão de CSS Modules já usado por componentes do site público (ex.: `Button.module.css`) — isso é considerado parte do escopo desta feature, não uma nova dependência.
- O escopo cobre todas as telas sob `/admin/**`: login, casca de navegação, listagem+criação+edição de Quartos/Espaços de Evento/Depoimentos, Configurações do Site, e listagem+detalhe de Leads.
