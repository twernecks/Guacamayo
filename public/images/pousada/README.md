# Imagens da Pousada

Esta pasta contém somente imagens reais e aprovadas pelo negócio, usadas pela landing page
(`src/data/pousada-content.ts` referencia os arquivos daqui).

## Regras de uso

- Apenas fotos reais da pousada, dos quartos, dos eventos e dos casamentos realizados.
  Nunca usar fotos de banco de imagens genéricas como substituto.
- Toda imagem precisa de aprovação do negócio antes de ser adicionada.
- Prefira formatos modernos (`.avif`, `.webp`) com fallback quando necessário; evite `.bmp`
  ou arquivos não otimizados.
- Sempre informe a largura e a altura reais do arquivo ao referenciá-lo em
  `src/data/pousada-content.ts`, para reservar espaço no layout (`next/image`) e evitar CLS.
- Sempre associe um texto alternativo descritivo e contextual (não decorativo) à imagem.
- Nomeie os arquivos de forma descritiva e em minúsculas com hífen, por exemplo:
  `quarto-suite-jardim-01.avif`, `casamento-cerimonia-jardim-02.avif`.

## Estrutura sugerida

- `quartos/` — fotos de quartos e suítes.
- `casamentos/` — fotos de cerimônias, decoração e espaço para casamentos.
- `eventos/` — fotos do espaço para outros eventos (não casamentos).
- `pousada/` — fachada, áreas comuns e paisagismo.

Crie as subpastas acima somente quando houver imagens aprovadas para adicionar.

## Status atual (2026-07-26)

**Quartos: completo — os 7 quartos reais têm fotos e nomes aprovados.**

- `quartos/quarto-duplo-deluxe-vista-mar-{01..05}.jpg` — Quarto Duplo Deluxe
  com Vista do Mar. ✅
- `quartos/quarto-duplo-pedra-01.jpg` — Quarto Duplo Pedra. ✅
- `quartos/quarto-duplo-vista-jardim-{01..03}.jpg` — Quarto Duplo com Vista
  do Jardim. ✅
- `quartos/quarto-quadruplo-familia-{01..04}.jpg` — Quarto Quádruplo
  Família. ✅
- `quartos/quarto-triplo-classico-{01,02}.jpg` — Quarto Triplo Clássico. ✅
- `quartos/quarto-triplo-vista-jardim-{01..03}.jpg` — Quarto Triplo com
  Vista do Jardim. ✅
- `quartos/quarto-triplo-vista-piscina-{01..03}.jpg` — Quarto Triplo com
  Vista da Piscina. ✅

Todos os 7 quartos incluem café da manhã e acesso à piscina da pousada
(comodidades padronizadas em `src/data/pousada-content.ts`). Os textos de
`summary` de cada quarto ainda são placeholder, pendentes de descrição
aprovada pelo negócio.

Os arquivos `.jpg` acima ficam ok como estão: o `next/image` já otimiza e
serve formatos modernos (`webp`/`avif`) automaticamente ao navegador, então
não é obrigatório reconverter manualmente antes de subir a foto.

**Casamentos**: `quartos/local-casamento-{01..06}.jpg` — fotos de exemplo do
local (jardim, praia/píer, gramado, espaço coberto e vista aérea da sede com
piscina). ✅ Aprovadas para uso; a narrativa de casamentos em
`src/data/pousada-content.ts` (`purpose`) ainda é placeholder.

**Eventos** (não-casamento) ainda não têm nenhuma foto aprovada.

Nota: apesar do nome da pasta (`quartos/`), as fotos de casamento (`local-
casamento-*.jpg`) também ficam aqui por ora; mover para uma subpasta
`casamentos/` dedicada é uma limpeza futura, não um bloqueio.
