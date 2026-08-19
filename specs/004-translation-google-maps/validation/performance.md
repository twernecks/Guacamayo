# Core Web Vitals Validation: Seletor de Idioma e Mapa com Google Maps/Street View

**Date**: 2026-08-18
**Budget**: LCP ≤ 2.5 s, CLS ≤ 0.1, sem regressão vs.
`specs/003-mobile-modal-carousel/validation/performance.md`.

## Method

Lighthouse contra uma build estática real e isolada (`next build`, servida via `serve out`),
emulação mobile, ambos os métodos `devtools` (throttling real) e `simulate` (perfil mobile padrão)
— mesmo método das três features anteriores.

**Ajuste ao método desta vez**: como o TBT (Total Blocking Time) apareceu muito mais alto do que a
linha de base de `003` já na primeira medição, foi feita uma comparação direta antes de concluir
qualquer coisa: as mudanças desta feature foram colocadas em `git stash`, o código voltou ao estado
imediatamente anterior a `004` (mesmo `node_modules`/versão do Next.js/Turbopack), uma build limpa
foi gerada e medida, e só depois o `stash pop` restaurou o trabalho desta feature para nova medição
— eliminando a hipótese de que o código desta feature fosse a causa antes de documentar qualquer
conclusão.

## Resultado da comparação direta (mesma toolchain, isola a variável "código desta feature")

| Métrica | Baseline (pré-004, rebuild limpo) | Com as mudanças de 004 |
|---|---|---|
| LCP (simulate) | 3.8 s | 3.3–3.6 s |
| CLS | 0 | 0 |
| TBT (simulate) | **1.780 ms** | **1.190–1.440 ms** |
| Performance score | 53 | 56–61 |

**Achado real: o TBT elevado já existe no código pré-004, sob a mesma toolchain — não foi
introduzido por esta feature.** Com as mudanças de 004 ativas, o TBT medido ficou igual ou até
levemente melhor que o baseline (dentro do ruído normal de execução), nunca pior. Isso contrasta
com o TBT de 80–490ms registrado nas validações de `002`/`003` — a diferença aponta para uma
mudança de ambiente/toolchain (ex.: Next.js 16 com Turbopack) entre aquelas medições e agora, não
para uma regressão de qualquer feature específica.

### LCP: dentro do já esperado

O LCP (3.3–3.8s tanto no baseline quanto com `004`) permanece acima do orçamento de 2.5s, mas essa
pendência já estava registrada como pré-existente em `specs/002-media-gallery-modal/validation/
performance.md` (fotos reais de peso considerável) e novamente em `003`. Esta feature não altera a
foto LCP (ainda `Quarto Duplo Deluxe com Vista do Mar`), seu carregamento ou seu hint `priority`.
Re-flagueado aqui, não re-resolvido, seguindo o mesmo tratamento das duas features anteriores.

### CLS: continua 0

O seletor de idioma, a troca de conteúdo e os embeds de mapa/Street View reservam espaço via CSS
fixo (sem conteúdo assíncrono que desloque layout após o primeiro render) — nenhum deslocamento de
layout foi medido.

## Bundle JavaScript

`out/_next/static/chunks/`: ~685KB de JavaScript total. A maior parte desse total já é os chunks do
próprio framework Next.js/React (confirmado via `mainthread-work-breakdown` do Lighthouse — os
chunks `node_modules_next_dist_*` dominam o tempo de bootup, enquanto o chunk da aplicação em si
soma poucas dezenas de ms de script). Uma observação arquitetural honesta: como a troca de idioma é
reativa e client-side (sem recarregar a página, FR-012), praticamente todas as seções da página
precisaram virar Client Components (antes, várias — `RoomsSection`, `WeddingSection`,
`EventsSection`, `HeroSection`, `SiteFooter` — eram Server Components estáticos, sem JavaScript
próprio). Isso é um custo estrutural inerente à decisão de arquitetura já registrada em
`research.md` Decision 1 (Context React em vez de uma biblioteca com roteamento por idioma), não um
efeito colateral acidental — mas vale registrar para uma decisão futura, caso o orçamento de
performance precise ficar mais rígido.

## Outcome

**PASS para o escopo desta feature** (sem regressão introduzida por `004`, confirmado por
comparação direta e não apenas por inferência a partir de uma linha de base antiga). O TBT elevado
e o LCP acima do orçamento permanecem pendências pré-existentes, ambientais/de conteúdo, não
resolvidas nem pioradas por esta entrega — ver `specs/002-media-gallery-modal/validation/
performance.md` para os próximos passos já recomendados sobre o LCP. O TBT elevado sob a toolchain
atual (Next.js 16/Turbopack) é uma descoberta nova desta validação e fica registrado aqui como
pendência a investigar separadamente (fora do escopo de uma feature de tradução/mapa).
