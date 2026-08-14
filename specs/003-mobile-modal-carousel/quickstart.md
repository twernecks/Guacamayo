# Quickstart: Experiência Mobile — Modal de Foto e Carrossel de Relatos

## Prerequisites

- Ambiente já configurado pelas features `001-pousada-landing-page` e `002-media-gallery-modal`
  (Node.js 22 LTS, dependências instaladas, testes/e2e configurados).
- Ao menos um quarto com fotos aprovadas e ao menos 2 relatos aprovados (já existe em
  `src/data/pousada-content.ts`: 7 quartos com fotos e 3 relatos).

## Local workflow

1. Inicie o ambiente de desenvolvimento (`npm run dev`) ou uma build de produção
   (`npm run build && npm run start`).
2. Emule uma viewport mobile real de 375px de largura (DevTools do navegador ou Playwright).
3. **Modal de foto**: acesse "Quartos", toque em uma foto para ampliá-la. Confirme que a
   visualização ocupa uma proporção bem maior da tela do que antes (≥90% da altura), com
   cabeçalho, legenda e indicador de posição sempre visíveis e compactos, e uma margem/fundo
   visível o suficiente para tocar fora e fechar.
4. Repita o fechamento pelas três formas (botão, clique/toque fora, Esc) e confirme que o foco
   retorna ao controle de origem em cada caso.
5. Alargue a viewport para tablet/desktop (≥768px) e confirme que o tamanho e o comportamento do
   modal permanecem como antes desta feature (sem regressão).
6. **Carrossel de relatos**: role até "Relatos" em 375px. Confirme que os depoimentos aparecem
   como um carrossel horizontal (não mais empilhados verticalmente), com indicação de que há mais
   cards (próximo card parcialmente visível e/ou indicador de posição).
7. Arraste/deslize horizontalmente entre os cards; confirme que o indicador de posição acompanha
   o card em foco.
8. Usando somente o teclado (sem toque), confirme que é possível navegar entre os relatos sem
   depender do gesto de swipe.
9. Alargue a viewport para tablet/desktop e confirme que a grade atual de relatos é preservada.
10. Gire a emulação para paisagem com o modal ou o carrossel abertos e confirme que nenhum dos
    dois quebra a navegação em andamento.

## Required validation before delivery

1. Execute lint, checagem de tipos e testes de componentes (incluindo `jest-axe`) para
   `MediaGalleryLightbox` e para o novo carrossel de relatos.
2. Execute os fluxos ponta a ponta em viewport 375px cobrindo: proporção de tela do modal,
   fechamento pelas três formas, swipe e navegação por teclado no carrossel de relatos.
3. Confirme, nas mesmas suítes, que o comportamento em tablet/desktop permanece equivalente ao
   já validado nas features 001 e 002 (sem regressão).
4. Reexecute a auditoria de acessibilidade automatizada (`jest-axe` + varredura real de
   navegador) incluindo o modal em tamanho mobile e o carrossel de relatos.
5. Reexecute a medição de Core Web Vitals da página e confirme ausência de regressão em relação
   ao já registrado em `specs/002-media-gallery-modal/validation/performance.md`.
6. Registre evidência em `specs/003-mobile-modal-carousel/validation/` (accessibility, frontend
   QA incluindo 375px, performance), seguindo o mesmo formato já usado nas features 001 e 002.
