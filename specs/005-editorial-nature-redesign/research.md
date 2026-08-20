# Research: Redesign Editorial de Natureza e Litoral

**Input**: `specs/005-editorial-nature-redesign/spec.md`

## Decision 1: Imagem do hero — fotografia existente com legenda editorial, sem nova sessão de fotos

**Decision**: Reaproveitar uma das fotos já aprovadas em `public/images/pousada/quartos/
local-casamento-0{1..6}.jpg` (vista aérea da sede com telhado colonial, piscina e jardim, ou o
gramado com vista para a água) como imagem de fundo/destaque do hero, carregada via `next/image`
com `priority` — ela passa a ser o elemento LCP da página, substituindo o `<h1>` atual.

**Rationale**: A spec já resolve isso em Assumptions: encomendar fotografia nova está fora do
escopo desta entrega, salvo decisão em contrário do proprietário. As fotos de casamento disponíveis
já são panorâmicas e mostram exatamente o que FR-001 pede (casarão, piscina, entorno natural).
Reutilizar conteúdo já aprovado evita um novo ciclo de aprovação de mídia e mantém o escopo
"apenas de apresentação" (Assumptions).

**Consequência de performance a tratar na implementação**: o `next.config.ts` usa
`images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" }` porque o GitHub Pages não
tem servidor para a API de otimização do Next — o loader atual (`image-loader.ts`) apenas
reescreve a URL com o `basePath`, **sem** redimensionar nem recomprimir. Isso significa que
qualquer arquivo usado como hero precisa ser pré-otimizado manualmente (dimensão máxima e
compressão adequadas para tela cheia, ex. ≤ 2560px de largura, JPEG/WebP already comprimido) antes
de entrar em `public/images/`, ou o hero vira a maior regressão de LCP possível — o oposto do que
FR-010/SC-004 exigem. Este é um passo de implementação (verificar/reexportar o arquivo escolhido),
não uma decisão de arquitetura nova.

**Alternatives considered**:
- Nova sessão de fotos profissional: rejeitada pela Assumption already resolvida — fora de escopo
  a menos que o proprietário decida o contrário.
- Galeria/carrossel de múltiplas fotos no hero (em vez de uma única imagem de destaque): a spec
  permite ("fotografia grande (ou galeria)") mas uma única imagem estática é suficiente para
  satisfazer FR-001/SC-002 com o menor custo de performance/complexidade (sem JS de carrossel no
  elemento LCP) — uma galeria pode ser considerada depois, fora do escopo mínimo desta entrega.

## Decision 2: Tipografia refinada — Fraunces (títulos) + Inter mantido (corpo)

**Decision**: Trocar a fonte de título de `Playfair Display` para `Fraunces` (via `next/font/
google`, mesmo mecanismo já usado), mantendo `Inter` para o corpo de texto.

**Rationale**: FR-011 pede uma dupla "mais quente/orgânica dentro da mesma categoria já usada hoje
(serif de destaque para títulos + sans humanista para corpo)... não uma substituição radical nem a
manutenção idêntica". Consultas à base de dados da skill `ui-ux-pro-max` (`--domain typography`,
`--domain google-fonts`) confirmam a direção geral — o par "Wellness Calm" (Lora + Raleway, "organic
curves... calm, natural, organic, spa") valida que serifs com curvas mais suaves/humanas e sans
menos geométricos comunicam natureza/bem-estar melhor que uma serif de alto contraste tipo Didone
(caso do Playfair Display atual) — mas nenhuma correspondência exata da base cobre o nicho
"casarão colonial + litoral + boutique", então a escolha final combina esse direcionamento com
conhecimento tipográfico direto: `Fraunces` é uma serif de exibição com eixo variável de
"optical size"/"softness"/"wonk", desenhada especificamente para ter curvas mais orgânicas e
quentes que serifs clássicas, permanecendo na mesma categoria (serif de destaque para títulos) e
já disponível no Google Fonts (compatível com o mecanismo `next/font/google` já em uso, sem custo
de infraestrutura novo). `Inter` já é uma sans humanista (não geométrica) e continua funcionando
bem para corpo de texto em 3 idiomas — trocá-la também violaria "não uma substituição radical" ao
mexer nas duas metades do par ao mesmo tempo sem necessidade.

**Alternatives considered**:
- `Lora` (heading) + `Raleway` (body) — o par "Wellness Calm" retornado pela busca: rejeitado como
  substituição direta porque Lora é uma serif de texto (menos "display"/dramática que Playfair em
  títulos grandes do hero) e Raleway é mais geométrica que Inter, então trocar os dois seria mais
  perto de uma substituição radical do que um refinamento.
- Manter Playfair Display sem alteração: rejeitado — não atende ao pedido explícito de FR-011 de
  refinar para uma opção mais quente.
- Adicionar um traço script/autoral (ex. para a seção de Casamentos): considerado no texto original
  do usuário como acento pontual opcional; fora do escopo mínimo das 3 user stories da spec
  (nenhuma FR exige um terceiro estilo tipográfico) — não incluído nesta entrega para não introduzir
  uma terceira família de fonte não pedida pelos requisitos formais.

## Decision 3: Ícones de comodidades — SVGs locais tipados, sem nova dependência de ícones

**Decision**: Adicionar um pequeno conjunto de ícones SVG locais (outline, peso leve, ~8
comodidades: Wi-Fi, ar-condicionado, café da manhã, piscina, vista mar, vista jardim,
estacionamento, TV/frigobar) como componentes React em `src/components/ui/icons/`, mapeados a
partir de uma chave estável (`AmenityKey`) associada a cada comodidade nos dados — não uma
biblioteca de ícones (`@phosphor-icons/react` ou similar) instalada como dependência de runtime.

**Rationale**: A busca na base da skill `ui-ux-pro-max` (`--domain icons`) recomenda a biblioteca
Phosphor (estilo "Outline", `weight="regular"`/`"thin"`, boa combinação com uma linguagem
orgânica/quente) como referência visual, mas o projeto já tem um padrão estabelecido de preferir
mecanismos nativos/leves a bibliotecas quando o caso de uso é pequeno e fixo (Context de i18n em
vez de `next-intl`, `<dialog>` nativo em vez de biblioteca de modal, `scroll-snap` nativo em vez de
carrossel — decisões já registradas em `specs/002` e `specs/004/research.md` Decision 1). Apenas ~8
ícones são necessários, um número fixo e pequeno; SVGs locais evitam adicionar uma dependência de
npm inteira (com seu próprio ciclo de atualização) só para 8 símbolos, mantendo o princípio da
constituição de escolher a arquitetura mais simples que atende o requisito atual (Princípio V).

**Rationale técnica adicional (FR-004)**: Comparar o texto localizado da comodidade
(`"Café da manhã incluso"` vs. `"Breakfast included"` vs. `"Desayuno incluido"`) para decidir qual
ícone mostrar seria frágil (quebra ao editar o texto em qualquer idioma) — por isso o modelo de
dados precisa de uma chave estável independente do idioma (ver `data-model.md`), não correspondência
de texto.

**Alternatives considered**:
- `@phosphor-icons/react` como dependência: rejeitada pelo motivo de simplicidade acima — o ganho
  (biblioteca completa de milhares de ícones) não se justifica para 8 símbolos fixos.
- Emojis como indicador visual: rejeitada — a própria tabela de prioridades da skill
  `ui-ux-pro-max` lista "Emoji as icons" como anti-padrão explícito (categoria "Style Selection"),
  além de não ter controle de peso/traço consistente com a linguagem visual do site.

## Decision 4: Efeito de entrada ao rolar — `IntersectionObserver` + CSS, sem biblioteca de animação

**Decision**: Um hook `useScrollReveal` baseado em `IntersectionObserver` nativo, que adiciona uma
classe CSS (`data-visible`) ao elemento na primeira vez que ele cruza um threshold (~15% visível) e
depois **para de observar esse elemento** (não reverte ao rolar de volta) — a transição em si é só
`opacity` + um pequeno `transform: translateY(...)` via CSS, dentro de uma media query que a
desativa completamente sob `prefers-reduced-motion: reduce` (troca para exibição instantânea, sem
transição).

**Rationale**: FR-012 já limita explicitamente o efeito a "um fade suave e consistente entre
seções, sem efeitos de paralaxe ou sequências de revelação mais elaboradas" — não há necessidade de
uma biblioteca de motion (GSAP, Framer Motion) para um único efeito de fade+leve deslocamento.
`IntersectionObserver` é a API nativa do browser para esse exato caso de uso, sem custo de bundle
JS adicional além do hook em si, consistente com o padrão do projeto (Decision 3 acima) e com a
prioridade "Performance" (categoria 3 da tabela de prioridades da skill `ui-ux-pro-max`: "Lazy
loading" e evitar JS desnecessário). Parar de observar após a primeira revelação resolve
diretamente o Edge Case da spec ("o efeito de entrada MUST NOT repetir de forma irritante a cada
pequena rolagem para frente e para trás").

**Alternatives considered**:
- GSAP (ScrollTrigger) — consultado via `--domain gsap` da skill: a própria base recomenda respeitar
  `prefers-reduced-motion` e evitar `ScrollTrigger` para movimento sensível, mas é uma ferramenta
  desenhada para coreografias mais complexas (pin, Flip, sequências) — over-engineering para um
  fade único por seção, e adiciona uma dependência de runtime não justificada pelo escopo de
  FR-012.
- CSS `@scroll-timeline`/`animation-timeline: view()` (nativo, sem JS): ainda não tem suporte estável
  cross-browser suficiente (Safari) para um site público sem fallback — rejeitado por risco de
  compatibilidade maior que o ganho de remover ~30 linhas de hook JS.

## Decision 5: Variação editorial dos Quartos — campo de dados `visualEmphasis`, não randomização

**Decision**: Adicionar um campo opcional `visualEmphasis?: "standard" | "featured"` ao tipo
`Room` (`src/domain/content.ts`), definido explicitamente em `src/data/pousada-content.ts` para os
quartos com maior apelo fotográfico (ex.: "Quarto Duplo Deluxe com Vista do Mar" e "Quarto Triplo
com Vista da Piscina"), e uma grade CSS (`RoomsSection.module.css`) que dá aos itens `"featured"`
um espaço maior (mais colunas/proporção de foto maior) que os `"standard"`, preservando a ordem do
DOM (sem reordenar via JS).

**Rationale**: FR-002 exige variação visual perceptível "não uma grade 100% uniforme", mas a
variação precisa ser decidida pelo conteúdo (quais quartos merecem destaque), não aleatória — um
campo de dados explícito, com um valor padrão implícito (`"standard"` quando ausente), dá controle
ao dono do conteúdo sem exigir mudança de código a cada ajuste, e é consistente com o Princípio II
da constituição (dados estáticos tipados, sem lógica de negócio nos componentes).

**Alternatives considered**:
- Variação puramente via CSS `nth-child` sem campo de dados (ex.: todo item ímpar é "grande"):
  rejeitada — a variação ficaria desconectada do conteúdo (poderia destacar visualmente um quarto
  sem vista, por coincidência de posição, e não o "Vista do Mar"/"Vista da Piscina" que a foto real
  justifica).
- Reordenar os quartos por destaque: rejeitada — mudaria a ordem hoje já estabelecida (e
  possivelmente relevante para SEO/leitura), sem necessidade; a variação é só de tamanho/proporção
  visual, não de posição.

## Decision 6: Textura e divisores orgânicos — CSS/SVG inline, sem novas imagens

**Decision**: Um overlay de textura sutil (grão/ruído) aplicado via `background-image` com um
pequeno SVG de ruído gerado (`<feTurbulence>`) embutido como data-URI em CSS, com opacidade baixa
(~3–5%) sobre `--color-background`/`--color-surface`; divisores entre seções usando `clip-path` ou
uma borda em curva (SVG inline) em vez de uma linha reta, aplicados aos limites de seção existentes.

**Rationale**: Consistente com a Decision 4 acima e com o padrão do projeto: nenhum novo arquivo de
imagem, nenhuma requisição de rede adicional, funciona em modo claro/escuro (a opacidade baixa
sobre a cor de fundo existente do tema mantém contraste, ao contrário de uma textura fotográfica
fixa que poderia não se adaptar ao dark mode já suportado). `<feTurbulence>` embutido é uma técnica
padrão para grão sutil sem custo de arquivo.

**Alternatives considered**:
- Textura fotográfica (imagem de madeira/areia como `background-image`): rejeitada — adiciona peso
  de rede (mesmo que pequeno) para um efeito puramente decorativo, e complica a adaptação ao dark
  mode (uma foto de textura clara não funciona bem sobre fundo escuro sem uma segunda versão).

## Decision 7: Depoimentos com tratamento editorial — apenas CSS/tipografia, sem mudança de
comportamento

**Decision**: Manter o componente/carrossel de `TestimonialsSection` e toda sua lógica de
acessibilidade (`aria-live`, navegação por teclado, comportamento em mobile — feature `003`)
intactos; a mudança é só visual: uma aspas de destaque tipográfica (glifo `"` grande na fonte de
título, `aria-hidden="true"` por ser puramente decorativo) e a citação em destaque tipográfico
maior (usando a nova fonte de título, Decision 2), em vez do cartão neutro atual.

**Rationale**: FR-006 pede tratamento visual mais distinto, não uma nova interação — reescrever a
lógica do carrossel arriscaria regredir FR-009 (não regredir funcionalidade existente) sem
necessidade. Separar claramente "o que muda" (CSS/tipografia) de "o que não muda" (toda a lógica de
navegação/anúncio já validada em `003`) minimiza o risco desta entrega.

**Alternatives considered**:
- Fundo fotográfico sutil por trás de cada depoimento (mencionado como possibilidade no texto
  original do usuário): considerado, mas não incluído como obrigatório — exigiria uma foto por
  depoimento (3 fotos adicionais ou uma foto genérica reaproveitada), e a spec já resolve que só a
  citação em destaque tipográfico é suficiente para "tratamento visual mais distinto" (FR-006 não
  exige fundo fotográfico especificamente). Pode ser considerado como melhoria futura.
