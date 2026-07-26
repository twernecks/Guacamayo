# Quickstart: Visualização de Fotos em Foco (Modal de Galeria)

## Prerequisites

- Ambiente já configurado pela feature `001-pousada-landing-page` (Node.js 22 LTS, dependências
  instaladas, testes/e2e configurados).
- Ao menos um quarto com fotos aprovadas (já existe: "Quarto Duplo Deluxe com Vista do Mar" e
  "Quarto Triplo Clássico" em `src/data/pousada-content.ts`).

## Local workflow

1. Inicie o ambiente de desenvolvimento (`npm run dev`) ou uma build de produção
   (`npm run build && npm run start`).
2. Acesse a seção "Quartos" e clique em uma foto de um quarto com fotos aprovadas.
3. Confirme que a visualização em foco abre mostrando a foto clicada, com indicação de posição
   (ex.: "1 de 2") quando houver mais de uma foto.
4. Navegue para a próxima/anterior foto; confirme a navegação circular (última → primeira e
   primeira → última).
5. Feche pela tecla Esc, por clique fora da foto e pelo controle de fechar; confirme que o foco do
   teclado retorna ao elemento que abriu a visualização em cada caso.
6. Repita o mesmo fluxo, com o teclado apenas (sem mouse), confirmando indicação visível de foco
   em todos os controles.
7. Repita em largura móvel (ex.: 375px) e confirme ausência de rolagem horizontal da página com a
   visualização aberta.
8. Confirme que quartos sem foto aprovada (estado "foto em breve") não têm nenhum controle
   clicável associado.

## Required validation before delivery

1. Execute lint, checagem de tipos e testes de componentes (incluindo axe) para o novo componente
   de visualização em foco.
2. Execute os fluxos ponta a ponta cobrindo: abrir a partir de uma foto, navegar (incluindo
   navegação circular nas extremidades), fechar pelas três formas (botão, clique fora, Esc), e
   operação somente por teclado.
3. Confirme que Casamentos e Eventos usam o mesmo componente e comportamento assim que tiverem
   fotos aprovadas (verificação de paridade, não exige fotos reais imediatas para ambas as
   seções).
4. Reexecute a auditoria de acessibilidade automatizada (`jest-axe` + varredura real de navegador)
   incluindo a visualização em foco aberta.
5. Reexecute a medição de Core Web Vitals da página e confirme ausência de regressão em relação ao
   já registrado em `specs/001-pousada-landing-page/validation/performance.md`.
