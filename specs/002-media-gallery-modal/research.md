# Research: Visualização de Fotos em Foco (Modal de Galeria)

## Decision: `<dialog>` nativo como base do modal, sem biblioteca de lightbox

**Rationale**: O elemento HTML `<dialog>` (via `showModal()`) já resolve, nativamente e em todos
os navegadores modernos suportados pelo projeto, boa parte dos requisitos de acessibilidade da
spec: papel de `dialog` para tecnologia assistiva, fechamento pela tecla Esc e contenção de foco
dentro do elemento enquanto aberto. Isso reduz a superfície de JavaScript customizado necessária
para atender FR-005 e FR-008, e evita adicionar uma dependência nova só para isso — alinhado ao
princípio de arquitetura do projeto de evitar dependências sem necessidade comprovada. O que o
`<dialog>` não resolve sozinho (fechar ao clicar fora, restaurar foco ao elemento de origem,
navegação anterior/próxima com posição, navegação circular) é pouco código e fica encapsulado em
um único componente reutilizável.

**Alternatives considered**:

- **Biblioteca de lightbox de terceiros** (ex.: `yet-another-react-lightbox`,
  `react-photo-view`): rejeitada porque adiciona uma dependência de execução e uma superfície de
  configuração maior do que o necessário para os requisitos atuais (abrir, navegar, fechar,
  posição, teclado); o projeto não tem hoje nenhuma dependência de UI externa além das já
  adotadas (Next.js, React), e a constituição exige justificar dependências novas por necessidade
  identificada, não conveniência.
- **`div` customizado com `role="dialog"` e trap de foco manual**: rejeitada como escolha
  principal porque reimplementa, com mais código e mais risco de bugs de acessibilidade, o que o
  `<dialog>` nativo já garante (contenção de foco, Esc, papel semântico). Pode ainda ser necessária
  como fallback interno de estilização, mas não como mecanismo de acessibilidade.

## Decision: Componente compartilhado único para a visualização em foco

**Rationale**: `RoomsSection`, `WeddingSection` e `EventsSection` já compartilham o componente
`MediaGallery` (introduzido durante a Fase 4 da feature 001) para exibir fotos com fallback de
"foto em breve". Estender esse mesmo ponto compartilhado — em vez de duplicar lógica de abertura
de modal em cada seção — mantém a paridade de comportamento entre quartos, casamentos e eventos
exigida pela História 2 da spec, e preserva o princípio de componentes com responsabilidade clara.

**Alternatives considered**:

- **Implementar a visualização em foco separadamente em cada seção**: rejeitada por duplicar
  lógica de acessibilidade (a parte mais sensível a erros) três vezes e arriscar divergência de
  comportamento entre seções, o que a própria spec (User Story 2) explicitamente quer evitar.

## Decision: Estado do modal como estado local do componente, sem gerenciador global

**Rationale**: Apenas um item (quarto, casamento ou espaço de evento) pode estar em foco por vez,
e essa necessidade é sempre local à seção/página atual. Não há consumidor fora da árvore de
componentes que precise desse estado. Isso é consistente com o princípio de estado local do
projeto: estado global só é justificado quando há consumidor, tempo de vida e razão documentados
que a composição local não resolve — não é o caso aqui.

**Alternatives considered**:

- **Contexto React global para o item em foco**: rejeitado por não haver necessidade de
  compartilhar esse estado entre partes não relacionadas da árvore; adicionaria complexidade sem
  benefício.

## Decision: Testes reaproveitam a stack já estabelecida (Vitest + Testing Library + jest-axe +
Playwright)

**Rationale**: A feature 001 já validou essa combinação para os mesmos tipos de risco (interação,
acessibilidade, fluxos ponta a ponta). Não há motivo técnico para introduzir outra ferramenta só
para esta feature; manter a mesma stack reduz custo de manutenção e mantém a suíte de testes
coesa.

**Alternatives considered**:

- **Ferramenta de teste visual/screenshot dedicada para o modal**: considerada, mas não necessária
  nesta entrega; a verificação visual manual documentada em `quickstart.md` e a evidência já
  produzida em `specs/001-.../validation/` cobrem esse risco de forma proporcional ao tamanho da
  mudança.

## Decision: Sem mudança no orçamento de performance; reutiliza o já definido pela feature 001

**Rationale**: A spec (SC-004) exige apenas ausência de regressão no orçamento já medido e
documentado em `specs/001-pousada-landing-page/validation/performance.md` (LCP ≤ 2,5 s,
CLS ≤ 0,1). Como a visualização em foco é renderizada sob demanda (só monta ao ser aberta) e reusa
imagens já carregadas/otimizadas pelo `next/image`, não se espera impacto relevante; a validação
disso é uma tarefa de verificação, não uma nova meta a definir.

**Alternatives considered**: N/A — não há orçamento alternativo a avaliar; o objetivo é preservar
o existente.
