# Research: Redesign Visual do Painel Administrativo

## Decision 1: Continuar sem framework CSS/UI kit — CSS Modules + variáveis CSS customizadas

**Decision**: Nenhuma dependência de runtime nova é adicionada. A estilização usa exclusivamente CSS
Modules do Next.js (já nativo, zero configuração) consumindo as variáveis CSS customizadas já
definidas em `src/app/globals.css`.

**Rationale**: `package.json` confirma que o projeto nunca usou Tailwind nem qualquer UI kit
(shadcn/Radix/MUI/Chakra) — o padrão real e já maduro, usado em ~12 componentes do site público
(`src/components/ui/*.module.css`, `src/components/sections/*.module.css`), é CSS Modules + tokens
em `:root`. Esse sistema já cobre cor (com modo escuro via `prefers-color-scheme`), tipografia,
espaçamento, raio e sombra com qualidade profissional comprovada nas páginas públicas. Não há
nenhuma lacuna técnica a preencher — só a aplicação, pela primeira vez, ao admin. Isso também
satisfaz diretamente FR-014/SC-006 (nenhuma nova dependência) e mantém o build 100% estático
(`output: "export"`) sem custo adicional de bundle de um framework CSS ou biblioteca de componentes.

**Alternatives considered**:
- **Introduzir Tailwind**: rejeitado — exigiria configurar um novo pipeline de build, reescrever o
  design system existente do zero (a paleta/espaçamento/tipografia já definidos teriam que ser
  portados para `tailwind.config`), e produziria dois sistemas de estilo divergentes convivendo no
  mesmo repositório (público em CSS Modules, admin em Tailwind) — o oposto de FR-009 (consistência
  de marca).
- **UI kit pronto (shadcn/ui, Radix, MUI)**: rejeitado — adiciona dependência de runtime (viola
  FR-014), traz sua própria linguagem visual que precisaria ser retemada para bater com a paleta
  sage/terracota já estabelecida, e é desproporcional para ~15 telas internas de uma equipe pequena.
- **CSS-in-JS (styled-components/emotion)**: rejeitado — dependência de runtime nova, nenhum
  precedente no projeto, e CSS Modules já resolve escopo/isolamento sem custo de JS em runtime.

## Decision 2: Design system interno do admin em `src/components/admin/ui/` + extensão do `Button` público

**Decision**: Criar um pequeno conjunto de componentes de apresentação reutilizáveis
(`Field`, `Card`, `Table`, `Banner`) em `src/components/admin/ui/`, e estender o `Button` já
existente em `src/components/ui/Button.tsx` com uma nova variante `destructive`, reaproveitado
diretamente pelo admin em vez de duplicado.

**Rationale**: Há ~15 telas e ~17 componentes administrativos que precisam do mesmo padrão de
label+input, cartão, tabela e banner de aviso. Centralizar esse padrão em componentes reutilizáveis
segue a Constitution Principle I ("small, domain-oriented, reusable and accessible components") e
evita que cada arquivo reimplemente (e diverja) o mesmo CSS. Reaproveitar o `Button` público em vez
de criar um `AdminButton` paralelo evita duplicação de estilo/lógica para um elemento que é
visualmente idêntico entre site público e admin (mesma marca, mesmos tokens).

**Alternatives considered**:
- **Estilizar cada arquivo ad hoc, sem componentes compartilhados**: rejeitado — alto risco de
  inconsistência (o mesmo problema que já existe hoje, só que com CSS em vez de ausência de CSS) e
  duplicação de ~15 blocos de CSS quase idênticos para inputs/tabelas/banners.
- **Duplicar um `AdminButton` próprio em vez de reaproveitar `Button`**: rejeitado — motivo é
  puramente de escopo interno (admin vs. público), não uma diferença de marca real; duplicar
  convidaria as duas variantes a divergirem com o tempo.

## Decision 3: Ícones SVG à mão em `src/components/ui/icons/`, sem biblioteca de ícones

**Decision**: Novos ícones necessários (editar, excluir, sair, aviso) são componentes SVG
hand-rolled, seguindo exatamente o padrão já estabelecido pelos ícones de amenidades
(`WifiIcon.tsx`, `PoolIcon.tsx` etc.) no mesmo diretório.

**Rationale**: O projeto já tem um precedente direto e maduro para isso; adicionar `lucide-react`,
`heroicons` ou qualquer pacote de ícones violaria FR-014/SC-006 (nenhuma nova dependência) sem
necessidade — os poucos ícones exigidos (FR-013) são simples o suficiente para não justificar um
pacote inteiro.

**Alternatives considered**:
- **Biblioteca de ícones (lucide-react, react-icons)**: rejeitado por FR-014/SC-006.
- **Fonte de ícones (icon font)**: rejeitada — pior acessibilidade e uma requisição de rede extra
  para algo que 4 arquivos SVG resolvem sem custo.
- **Emoji como ícone**: explicitamente proibido por FR-013.

## Decision 4: Estilização aditiva — preservar semântica/DOM existente para não quebrar os testes da feature 006

**Decision**: Toda mudança visual é aditiva sobre a marcação já existente: `className`s e wrappers
puramente visuais são adicionados, mas `label`/`htmlFor`, `role`, `aria-*`, a estrutura de
`<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>`, e o texto acessível de cada elemento permanecem
exatamente os mesmos usados pelos testes da feature 006.

**Rationale**: FR-012 exige explicitamente que nenhum comportamento mude, e SC-007 exige que a
suíte existente (Vitest/RTL/jest-axe/Playwright) continue passando com no máximo ajustes de
seletor. Como as consultas de teste (`getByRole`, `getByLabelText`, `getByText`) resolvem por nome
acessível e papel ARIA — não por estrutura de DOM — envolver um `<input>` existente em um `<div>`
estilizado ou trocar `<table>` por um wrapper que ainda renderiza `<table>` nativo não quebra essas
consultas, desde que a associação label↔input e os atributos ARIA sejam preservados literalmente.

**Alternatives considered**:
- **Reescrever os componentes do zero com uma estrutura de DOM diferente**: rejeitado — maior risco
  de quebrar testes existentes sem nenhum ganho visual adicional; viola o espírito de FR-012.

## Decision 5: Responsividade — sem rolagem horizontal do body; tabelas com scroll contido

**Decision**: Abaixo de ~640px, a navegação colapsa para uma barra compacta (links empilhados ou em
menu) e cada tabela de listagem ganha um wrapper com `overflow-x: auto` próprio, para que o
conteúdo largo role dentro do seu container em vez de forçar rolagem horizontal na página inteira.

**Rationale**: FR-010 exige apenas ausência de rolagem horizontal no nível da página entre 375px e
1440px — não exige que cada tabela vire uma lista de cartões em telas pequenas. Um wrapper
`overflow-x: auto` é a solução mais simples que satisfaz o requisito sem redesenhar a tabela como
um componente completamente diferente em mobile.

**Alternatives considered**:
- **Transformar tabelas em listas de cartões em mobile**: rejeitado nesta fase — esforço bem maior
  (duas apresentações visuais paralelas para os mesmos dados) não exigido pela spec; pode ser uma
  melhoria futura, não um requisito de FR-010.

## Decision 6: Modo escuro herdado automaticamente, sem trabalho de design separado

**Decision**: Nenhuma variável de cor nova é criada; todo novo CSS Module consome exclusivamente
`var(--color-*)` já definidas em `:root` e sob `@media (prefers-color-scheme: dark)`.

**Rationale**: Como o admin passa a usar os mesmos tokens do site público, o suporte a modo escuro
já existente é herdado automaticamente sem nenhum trabalho adicional — confirma a Assumption do
spec.md.

**Alternatives considered**:
- **Tema administrativo dedicado (ex.: sempre escuro, estilo "dashboard")**: rejeitado — introduziria
  uma segunda linguagem visual divergente da marca (FR-009) sem necessidade documentada.

## Decision 7: Sem nova ferramenta de teste — estender a cobertura de acessibilidade já existente

**Decision**: Nenhuma dependência de teste nova (sem Chromatic/Percy/Playwright visual snapshots).
A cobertura de `jest-axe` já existente (`tests/integration/admin/accessibility.test.tsx`, hoje
cobrindo login/listagens/formulário de criação/Configurações do Site) é estendida às telas que
ainda não tinham asserção dedicada (detalhe de lead, formulários de Espaços de Evento e
Depoimentos), já que o redesenho toca essas telas em profundidade pela primeira vez.

**Rationale**: Regressão visual "de olho" (revisão manual via `quickstart.md` nos quatro breakpoints
de FR-010) é suficiente para o escopo e volume desta feature (~15 telas internas); introduzir uma
ferramenta de snapshot visual seria uma nova dependência sem justificativa proporcional (violaria
FR-014) e um novo processo de manutenção (aprovação de baselines) para uma equipe pequena.

**Alternatives considered**:
- **Testes de snapshot visual automatizado**: rejeitado por desproporcionalidade e por violar
  FR-014 (novas dependências de teste).
