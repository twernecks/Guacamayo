# Responsive Frontend QA: Seletor de Idioma e Mapa com Google Maps/Street View

**Date**: 2026-08-18
**Scope**: FR-002 (100% do texto, incluindo textos mais longos em EN/ES não quebrarem o layout),
seletor de idioma alcançável em todas as larguras, e a nova experiência de mapa/Street View da
seção de Localização — nos 4 breakpoints já usados nas features 001–003 (320/375/768/1280px) e nos
3 idiomas.

## Method

Playwright, 4 larguras reais (320/375/768/1280px) × 3 idiomas (pt/en/es) = 12 combinações,
verificando: ausência de rolagem horizontal em nível de página (o teste de i18n mais comum de
quebrar — texto em inglês/espanhol tende a ser mais longo que o português), o seletor de idioma
cabendo nas larguras mais estreitas, e a seção de Localização com o mapa e o Street View carregados
sob demanda. Revisão visual via screenshot em cada combinação.

## Real defect found and fixed: URL de Street View incorreta

Durante esta passada, a área de Street View renderizava um mapa-múndi em branco (zoom out para o
Ártico) em vez de uma imagem de nível de rua. Investigado com `curl -L` (para seguir os
redirecionamentos reais do Google) e um teste isolado em `<iframe>`: os padrões inicialmente usados
(`output=embed` combinado com `layer=c`/`cbll=`/`cbp=12,...`) redirecionavam para uma especificação
`pb=` vazia (`pb=!1m0`) — uma URL que parece válida mas não carrega imagem nenhuma.

**Causa raiz**: o parâmetro correto para o modo Street View do redirecionador legado do Google é
`output=svembed` (não `output=embed`), com `cbp=11,0,0,0,0`. Descoberto testando o URL fora do
contexto de iframe primeiro (o próprio Google recusa com "The Google Maps Embed API must be used
in an iframe" — confirmando que a URL em si é válida, só precisa estar dentro de um iframe) e depois
dentro de um `<iframe>` real.

**Resultado, já em produção**: a URL corrigida
(`https://maps.google.com/maps?cbll={lat},{lng}&layer=c&cbp=11,0,0,0,0&output=svembed`) carrega uma
fotoesfera 360° real já publicada para "Enseada Do Jatobá" — o próprio nome do local no endereço —
mostrando um ambiente interno da pousada (não apenas uma foto genérica de rua), um resultado melhor
do que o mínimo exigido pela spec. `research.md` Decision 3 e `src/data/pousada-content.ts`
atualizados com a URL correta e uma nota da investigação.

## Results

### Rolagem horizontal (FR-002, textos mais longos em EN/ES)

**0 ocorrências** de rolagem horizontal em nível de página, nas 12 combinações de largura×idioma,
tanto no topo da página quanto após carregar o mapa/Street View — inglês e espanhol, mesmo sendo
tipicamente mais longos que o português (ex.: "Deluxe Double Room with Sea View" vs "Quarto Duplo
Deluxe com Vista do Mar"), quebram linha normalmente sem estourar nenhum cartão, botão ou
cabeçalho.

### Seletor de idioma em todas as larguras

Em 320px (a largura mínima testada), os três botões (Português/English/Español) mais o alternador
de menu cabem lado a lado no cabeçalho, sem sobreposição nem corte, com o idioma ativo
visualmente destacado (fundo escuro) — confirmado nos 3 idiomas como ponto de partida.

### Seção de Localização (mapa + Street View, FR-008/FR-009/FR-014)

| Viewport | Idioma | Mapa carrega | Street View carrega | Textos ao redor traduzidos |
|---|---|---|---|---|
| 320px | pt/en/es | Sim, pino exato | Sim, fotoesfera real | Sim |
| 375px | pt/en/es | Sim | Sim | Sim |
| 768px | pt/en/es | Sim | Sim | Sim |
| 1280px | pt/en/es | Sim | Sim | Sim |

O aviso de cobertura ("a imagem... pode não corresponder exatamente à fachada") aparece sempre,
nos 3 idiomas, junto à área de Street View — mesmo com uma imagem real carregada, conforme
FR-008/Edge Cases exige (não é um aviso condicional).

### Testes automatizados (referência cruzada)

Os 93 testes de componente (`vitest`) e os 60 testes ponta a ponta (`playwright`, chromium +
mobile-chrome) já cobrem, de forma determinística, os mesmos cenários — este QA visual confirma
que não há uma regressão visual que os testes (que verificam DOM/atributos, não pixels) não
capturariam sozinhos.

## Outcome

**PASS**, com um defeito real de URL do Street View encontrado e corrigido durante esta passada
(documentado acima e em `research.md` Decision 3). Nenhuma quebra de layout por texto mais longo
em inglês/espanhol em nenhuma das 12 combinações testadas.
