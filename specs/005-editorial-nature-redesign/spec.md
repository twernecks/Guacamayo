# Feature Specification: Redesign Editorial de Natureza e Litoral

**Feature Branch**: `005-editorial-nature-redesign`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Redesenhar a identidade visual do site da pousada para deixar de
parecer um site genérico gerado por IA/template de SaaS e passar a comunicar visualmente a
proposta real do negócio: natureza, hospedagem à beira-mar, sol, casamentos e eventos em um
casarão colonial histórico (século XIX, ligado a Djavan e Maria Della Costa)." Diagnóstico incluído
pelo usuário (confirmado por análise visual do site atual e consulta à base de dados de UI/UX da
skill `ui-ux-pro-max`): hero sem nenhuma foto do local, seção de Quartos com grade uniforme
idêntica a uma seção de "features" de produto SaaS, ausência de variação editorial/textura/
movimento entre seções, depoimentos como cartões neutros repetidos, comodidades sem apoio visual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Primeira impressão fotográfica do lugar (Priority: P1)

Como visitante que abre o site pela primeira vez, quero ver imediatamente uma imagem real do
casarão, da natureza ao redor e da praia/piscina — não apenas um texto sobre um fundo liso — para
sentir, nos primeiros segundos, que estou diante de uma pousada de natureza e não de um produto de
software genérico.

**Why this priority**: A primeira impressão define se o visitante continua navegando ou sai. Hoje
o hero é só texto, o que não comunica nada da experiência sensorial (natureza, litoral, casarão
histórico) que é a proposta central do negócio — é o ponto de maior impacto e o mais rápido de
perceber como errado.

**Independent Test**: Abrir a página inicial em desktop e em mobile (375px) e confirmar que, sem
precisar rolar a página, o visitante já vê uma representação fotográfica real do local (não apenas
texto sobre cor lisa), junto com a chamada principal de contato.

**Acceptance Scenarios**:

1. **Given** um visitante novo abrindo a página inicial em desktop, **When** a página carrega,
   **Then** a área visível sem rolar (hero) inclui uma imagem fotográfica do casarão, da piscina
   ou do entorno natural, não apenas texto sobre uma cor de fundo lisa.
2. **Given** o mesmo visitante em um celular (375px de largura), **When** a página carrega,
   **Then** a mesma apresentação fotográfica está presente e legível, sem cortar a imagem de forma
   que perca o reconhecimento do que está sendo mostrado.
3. **Given** um visitante com a preferência de movimento reduzido ativada no dispositivo, **When**
   a página carrega, **Then** qualquer efeito de entrada da imagem/texto do hero é removido ou
   reduzido a uma transição instantânea, sem prejudicar a leitura do conteúdo.

---

### User Story 2 - Seção de Quartos com apresentação de pousada boutique (Priority: P2)

Como visitante avaliando onde ficar, quero que a seção de Quartos pareça a vitrine de uma pousada
boutique — com fotos em destaque e variação visual entre os quartos — em vez de uma grade
repetitiva de cartões idênticos, para conseguir perceber diferenças entre os quartos rapidamente e
sentir que é um lugar cuidado, não um catálogo genérico.

**Why this priority**: Quartos é a jornada de conversão principal já estabelecida (spec
`001-pousada-landing-page`, User Story 1); a apresentação atual (grade uniforme de cartões brancos
arredondados) é visualmente indistinguível de uma seção de recursos de um produto de software, o
que reduz a percepção de qualidade do imóvel exatamente na seção mais importante para reserva.

**Why after User Story 1**: A primeira impressão (hero) determina se o visitante continua até aqui;
sem ela, melhorar a seção de Quartos tem menos efeito.

**Independent Test**: Rolar até a seção de Quartos e confirmar que os itens têm variação visual
entre si (não são todos do mesmo tamanho/proporção/tratamento) e que as comodidades de cada quarto
têm algum apoio visual além do texto.

**Acceptance Scenarios**:

1. **Given** um visitante na seção de Quartos, **When** ele observa os 7 quartos listados,
   **Then** nem todos os itens têm exatamente o mesmo tamanho/proporção/tratamento visual — há uma
   variação editorial perceptível entre eles (ex.: destaque maior para determinados quartos).
2. **Given** um visitante olhando as comodidades de um quarto (Wi-Fi, ar-condicionado, café da
   manhã, acesso à piscina etc.), **When** ele lê a lista, **Then** cada comodidade tem um
   indicador visual (ícone) além do texto, permitindo reconhecimento rápido sem ler cada palavra.
3. **Given** um visitante em qualquer um dos 3 idiomas já suportados, **When** ele acessa a seção
   de Quartos, **Then** a nova apresentação continua legível e sem cortes, mesmo com textos mais
   longos em inglês/espanhol.

---

### User Story 3 - Linguagem visual coesa de natureza em toda a página (Priority: P3)

Como visitante navegando pelo restante da página (casamentos, eventos, relatos, localização),
quero perceber a mesma linguagem visual de natureza/litoral/casarão colonial — com textura, cor e
um leve movimento ao rolar — em vez de seções neutras e estáticas que parecem desconectadas do
tema do negócio, para manter a mesma sensação de lugar do início ao fim da página.

**Why this priority**: Reforça e estende, de forma consistente, o que as User Stories 1 e 2 já
estabelecem — importante para a experiência completa, mas de menor impacto isolado do que a
primeira impressão (hero) e a seção de conversão principal (Quartos).

**Independent Test**: Rolar a página inteira e confirmar que as seções restantes (Casamentos,
Eventos, Relatos, Localização) compartilham a mesma paleta/textura de natureza already estabelecida
nas User Stories 1-2, com um efeito sutil de entrada ao rolar, e que os depoimentos têm um
tratamento visual mais distinto do que cartões de texto neutros repetidos.

**Acceptance Scenarios**:

1. **Given** um visitante rolando a página, **When** uma nova seção entra na tela, **Then** há um
   efeito sutil de entrada (ex.: aparecer suavemente) consistente entre as seções, desativado
   automaticamente quando o visitante prefere movimento reduzido.
2. **Given** um visitante na seção de Relatos, **When** ele lê os depoimentos, **Then** a
   apresentação tem um tratamento editorial mais distinto (ex.: destaque tipográfico da citação)
   do que um cartão neutro repetido idêntico para os três relatos.
3. **Given** um visitante em qualquer seção da página, **When** ele compara a paleta de cores e as
   texturas usadas, **Then** todas remetem a natureza/litoral/casarão colonial (tons terrosos,
   orgânicos), sem nenhuma seção usando uma estética genérica de tecnologia (ex.: gradientes
   vítreos/"glassmorphism").

---

### Edge Cases

- Quando uma seção ainda não tem fotos aprovadas (ex.: Eventos, hoje com placeholder), a nova
  apresentação editorial MUST degradar de forma coerente, sem parecer quebrada ou vazia.
- Em conexões lentas ou dispositivos de baixo desempenho, a nova imagem de hero e os efeitos de
  entrada ao rolar MUST NOT piorar perceptivelmente o tempo até o conteúdo principal aparecer.
- Em modo escuro (já suportado hoje via preferência do sistema), a nova paleta/textura MUST
  continuar legível e com contraste adequado.
- Ao trocar de idioma (PT/EN/ES) com uma seção redesenhada visível, a troca MUST NOT quebrar o
  layout nem interromper algum efeito de entrada em andamento de forma abrupta/confusa.
- Quando o visitante já passou por uma seção (voltou a rolar para cima), o efeito de entrada MUST
  NOT repetir de forma irritante a cada pequena rolagem para frente e para trás.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página inicial MUST apresentar, na área visível sem rolar (hero), uma
  representação fotográfica real do casarão, da piscina ou do entorno natural — não apenas texto
  sobre uma cor de fundo lisa.
- **FR-002**: A seção de Quartos MUST apresentar variação visual perceptível entre os itens (ex.:
  tamanhos/proporções diferentes, destaque maior para alguns quartos) em vez de uma grade
  totalmente uniforme repetindo o mesmo padrão de cartão para todos os 7 quartos.
- **FR-003**: A linguagem de cor e material de todo o site MUST remeter a natureza/litoral/casarão
  colonial histórico (tons terrosos e orgânicos) e MUST NOT usar uma estética genérica de
  tecnologia (ex.: gradientes vítreos/"glassmorphism", paleta azul/roxo corporativa).
- **FR-004**: As comodidades de cada quarto (Wi-Fi, ar-condicionado, café da manhã, acesso à
  piscina etc.) MUST ter um indicador visual (ícone) além do texto.
- **FR-005**: A página MUST incluir um efeito sutil e consistente de entrada ao rolar, aplicado às
  seções principais, desativado automaticamente para visitantes com preferência de movimento
  reduzido no dispositivo.
- **FR-006**: A seção de Relatos MUST ter um tratamento visual editorial mais distinto do que
  cartões de texto neutros repetidos (ex.: destaque tipográfico da citação, elemento visual de
  apoio).
- **FR-007**: Todas as seções redesenhadas MUST preservar os compromissos de acessibilidade WCAG
  2.2 AA já estabelecidos pelo site (contraste, foco visível, semântica para leitor de tela,
  operação por teclado).
- **FR-008**: Todas as seções redesenhadas MUST continuar corretas nos 3 idiomas já suportados
  (Português, English, Español), incluindo com textos mais longos em inglês/espanhol.
- **FR-009**: O redesign MUST NOT regredir nenhuma funcionalidade já existente (seletor de idioma,
  modal de foto ampliada, carrossel de relatos, mapa/Street View da Localização).
- **FR-010**: O redesign MUST preservar ou melhorar o orçamento de Core Web Vitals (LCP, CLS) já
  estabelecido, mesmo com a nova imagem de hero e os efeitos de entrada ao rolar.
- **FR-011**: A tipografia MUST ser refinada para uma dupla de fontes mais quente/orgânica dentro
  da mesma categoria já usada hoje (serif de destaque para títulos + sans humanista para corpo),
  reforçando a identidade de natureza sem descaracterizar a personalidade tipográfica já
  estabelecida — não uma substituição radical nem a manutenção idêntica das fontes atuais.
- **FR-012**: O efeito de entrada ao rolar (FR-005) MUST se limitar a um fade suave e consistente
  entre seções, sem efeitos de paralaxe ou sequências de revelação mais elaboradas — prioriza o
  orçamento de performance (Core Web Vitals) já estabelecido sobre um movimento mais elaborado.

### Public Experience and Quality Requirements *(required for public UI)*

- **Conversion path**: As chamadas de contato via WhatsApp continuam sendo o CTA principal, claras
  e com destaque visual pelo menos igual ao atual — o redesign MUST NOT diminuir sua
  proeminência.
- **Responsive behavior**: Mobile-first preservado; sem regressão nos breakpoints e larguras já
  validados (320/375/768/1280px).
- **Accessibility**: WCAG 2.2 AA preservado; o efeito de entrada ao rolar (FR-005) respeita
  `prefers-reduced-motion`.
- **SEO and metadata**: Sem impacto negativo na indexabilidade já estabelecida; toda nova imagem
  usada MUST ter texto alternativo preciso, seguindo o mesmo padrão já usado no site.
- **Performance budget**: Sem regressão perceptível de Core Web Vitals (ver FR-010); novas imagens
  MUST seguir o mesmo padrão de otimização/responsividade já usado (`next/image`, tamanhos
  apropriados por breakpoint).
- **Content and media facts**: O redesign usa fotografia já aprovada existente, salvo decisão em
  contrário do proprietário (ver Assumptions); nenhuma legenda/texto alternativo pode
  descrever algo que não é factualmente correto sobre o que a imagem mostra.
- **Data states**: Quando uma seção ainda não tem foto aprovada (ex.: Eventos), a nova
  apresentação editorial degrada para um estado vazio coerente com o restante do redesign, não
  para o placeholder genérico atual isolado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em um teste não moderado de primeira impressão, ao menos 80% dos participantes que
  veem a página inicial por 5 segundos identificam corretamente que se trata de uma pousada de
  natureza/litoral, sem serem informados do tipo de negócio antecipadamente.
- **SC-002**: O maior elemento visual da página inicial (hero) é uma representação fotográfica do
  imóvel, visível sem rolar, tanto em mobile (375px) quanto em desktop.
- **SC-003**: 100% da suíte de testes automatizados já existente (acessibilidade, funcional,
  responsivo, ponta a ponta) continua passando após o redesign, com zero novas violações de
  acessibilidade críticas/sérias.
- **SC-004**: Core Web Vitals (LCP, CLS) medidos após o redesign são iguais ou melhores que a linha
  de base já registrada, usando o mesmo método já estabelecido.
- **SC-005**: Todas as seções redesenhadas permanecem sem rolagem horizontal nem corte de texto nos
  3 idiomas, em 320/375/768/1280px.

## Assumptions

- O redesign é apenas de apresentação (camada visual) — não introduz páginas novas, não altera a
  arquitetura de informação (mesmas seções/âncoras) nem exige mudanças de backend/CMS, consistente
  com a arquitetura estática já estabelecida do site.
- A fotografia já aprovada existente (incluindo as fotos do espaço de casamento — ex.: a vista
  aérea da sede com telhado colonial, piscina e jardim, e o gramado/jardim com vista para a água —
  já em formato panorâmico) é suficiente como ponto de partida para a nova imagem de hero e para
  as demais seções; encomendar nova fotografia profissional fica fora do escopo desta entrega, a
  menos que o proprietário decida o contrário.
- A paleta de cores é refinada/estendida a partir da paleta terrosa (verde e terracota) já parcial
  mente presente hoje, não substituída por uma paleta inteiramente nova.
- As funcionalidades já implementadas (tradução em 3 idiomas, modal de fotos, carrossel de
  relatos, mapa do Google/Street View) continuam funcionando exatamente como hoje — o redesign
  muda apenas a apresentação visual dessas funcionalidades, não seu comportamento.
