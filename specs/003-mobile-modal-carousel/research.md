# Research: Experiência Mobile — Modal de Foto e Carrossel de Relatos

## Decision: Redimensionar o modal existente via CSS (media query), sem novo componente

**Rationale**: `MediaGalleryLightbox` já usa o elemento `<dialog>` nativo com foco contido, Esc,
fechar por clique fora e foco restaurado ao controle de origem (feature `002-media-gallery-modal`).
As duas clarificações desta spec resolvem o tamanho mobile mantendo exatamente esse mesmo
mecanismo — só a proporção de tela ocupada muda. Isso significa que a mudança é inteiramente de
apresentação (CSS) em `MediaGalleryLightbox.module.css`, dentro de uma media query mobile-first
consistente com o padrão já usado no projeto (`Container.module.css`, `SiteFooter.module.css`
usam `@media (min-width: 48rem)` = 768px como o mesmo corte "mobile vs. maior" adotado aqui).
Nenhuma lógica de foco/teclado/fechamento precisa mudar.

**Alternatives considered**:

- **Um segundo componente "MobileLightbox" dedicado**: rejeitada — duplicaria a lógica de
  acessibilidade mais sensível a erros (foco, Esc, restauração de foco) já testada no componente
  existente, violando o princípio de componentes com responsabilidade clara e arriscando
  divergência de comportamento entre mobile e desktop.
- **Reescrever o modal com uma biblioteca de UI para folhas modais ("bottom sheet")**: rejeitada
  — adicionaria uma dependência nova para um resultado que a mesma CSS já entrega (maior
  proporção de tela, mantendo o `<dialog>` nativo); contraria o princípio de arquitetura do
  projeto de evitar dependências sem necessidade comprovada.

## Decision: Rolagem nativa com CSS `scroll-snap` para o swipe dos relatos, sem biblioteca de carrossel

**Rationale**: Um container com `overflow-x: auto` e `scroll-snap-type: x mandatory` (cards com
`scroll-snap-align`) já entrega arrastar/deslizar horizontal nativo em todos os navegadores
mobile suportados, sem nenhum código de gesto customizado — satisfazendo FR-005 sem dependência
nova. O projeto hoje não tem nenhuma dependência de carrossel/gestos (`package.json`: só
`next`, `react`, `react-dom` em produção), e a constituição exige justificar dependências novas
por necessidade identificada, não conveniência. Botões de anterior/próxima (chamando
`scrollBy`/`scrollTo` no container) cobrem FR-007 (navegação sem gesto) e replicam o padrão de
navegação já usado no `MediaGalleryLightbox`.

**Alternatives considered**:

- **Biblioteca de carrossel dedicada** (ex.: `embla-carousel-react`, `keen-slider`): rejeitada —
  adiciona peso ao bundle e uma superfície de configuração maior do que o necessário para um
  carrossel de 3 itens com swipe + botões + indicador de posição, que CSS nativo já resolve.
- **`react-swipeable` ou detecção manual de gesto por `touchstart`/`touchmove`**: rejeitada — só
  reimplementaria, com mais código e mais risco de bugs (ex.: conflito com rolagem vertical da
  página), o que a rolagem nativa com `scroll-snap` já garante de forma acessível.
- **Framer Motion (`drag`)**: rejeitada — biblioteca de animação pesada para uma necessidade que
  não envolve nenhuma outra animação no projeto hoje; desproporcional ao escopo.

## Decision: Reaproveitar o padrão visual de navegação já existente (botões anterior/próxima + indicador "N de M") no carrossel de relatos

**Rationale**: O próprio pedido do usuário referencia explicitamente o "padrão de carrossel de
imagens já usado na aplicação". `MediaGalleryLightbox` já implementa botões de navegação
acessíveis (`aria-label`, alvo de toque ≥44×44px) e um indicador de posição textual
(`aria-live="polite"`) para leitores de tela. Replicar essa mesma linguagem visual/semântica no
carrossel de relatos — em vez de inventar um novo padrão (ex.: bolinhas/dots) — mantém
consistência de produto e reaproveita uma decisão de acessibilidade já validada. O "peek" do
próximo card (borda parcialmente visível) soma-se como reforço visual, sem substituir o
indicador textual acessível.

Como esse par "botões + indicador de posição" passa a se repetir em dois lugares
(`MediaGalleryLightbox` e o novo carrossel de relatos), a extração de um pequeno componente de UI
compartilhado para esse cluster de controles evita duplicação e risco de divergência entre as
duas implementações, consistente com o princípio de componentes reutilizáveis da constituição.

**Alternatives considered**:

- **Indicadores de posição em bolinhas ("dots")**: considerado, mas não escolhido como padrão
  principal por não reaproveitar a linguagem já estabelecida no app e exigir sua própria decisão
  de acessibilidade (rótulo, estado atual) do zero; nada nesta decisão impede adicioná-los depois
  como reforço visual adicional.
- **Duplicar a marcação/CSS dos controles em cada lugar sem extrair componente**: rejeitada —
  mesmo padrão implementado duas vezes tende a divergir silenciosamente (ex.: um lugar recebe uma
  correção de acessibilidade e o outro não).

## Decision: Sem nova meta de performance; reutiliza o orçamento já medido

**Rationale**: A spec (SC-003, Performance budget) exige apenas ausência de regressão perceptível
no orçamento já registrado em `specs/001-pousada-landing-page/validation/performance.md` e
reconfirmado em `specs/002-media-gallery-modal/validation/performance.md`. Como esta feature não
adiciona dependência nova nem ativos pesados (decisões acima), não se espera impacto relevante; a
verificação é uma tarefa de validação, não uma nova meta a definir.

**Alternatives considered**: N/A — o objetivo é preservar o orçamento existente, não redefini-lo.

## Decision: Testes reaproveitam a stack já estabelecida, com Playwright cobrindo a viewport 375px

**Rationale**: Vitest + Testing Library + `jest-axe` (componentes) e Playwright (fluxos ponta a
ponta) já validaram os mesmos tipos de risco nas features 001 e 002. O critério de aceite "testar
em pelo menos uma resolução mobile real (~375px)" é melhor coberto por Playwright, que já emula
viewport real para os testes de teclado/navegação da feature 002 — basta estender essa mesma
abordagem para as duas mudanças desta feature, sem ferramenta nova.

**Alternatives considered**:

- **Ferramenta de teste visual/screenshot dedicada**: considerada, mas não necessária; a
  verificação visual manual documentada em `quickstart.md` mais a asserção programática de
  proporção de tela (ex.: altura do modal vs. altura da viewport) via Playwright cobrem o risco de
  forma proporcional ao tamanho da mudança.
