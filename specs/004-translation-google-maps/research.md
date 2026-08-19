# Research: Seletor de Idioma e Mapa com Google Maps/Street View

**Input**: `specs/004-translation-google-maps/spec.md`

## Decision 1: Abordagem de internacionalização (i18n)

**Decision**: Context React customizado (`LanguageProvider`/`useLanguage()`/`useTranslations()`)
com dicionários tipados por idioma (`src/i18n/messages/{pt,en,es}.ts`), sem biblioteca de i18n.

**Rationale**: O site é uma landing page estática única (`output: "export"`, sem backend,
sem rotas dinâmicas por página), com um conjunto fixo e pequeno de textos (rótulos de UI,
conteúdo de 7 quartos, 1 seção de casamento/eventos, 3 relatos). Uma biblioteca como `next-intl`
ou `react-i18next` adiciona roteamento por locale, middleware, negociação de idioma no
servidor e configuração de build — nenhum dos quais este site tem hoje (não há servidor Node em
produção, apenas arquivos estáticos no GitHub Pages) e nenhum é exigido pela spec (a troca é
client-side, sem necessidade de URLs por idioma). Consistente com o padrão já estabelecido pelo
projeto de preferir mecanismos nativos/leves a bibliotecas (`<dialog>` nativo em vez de biblioteca
de modal, `scroll-snap` nativo em vez de biblioteca de carrossel — features `002`/`003`) e com o
princípio da constituição de escolher a arquitetura mais simples que atende o requisito atual.

**Alternatives considered**:
- `next-intl`: padrão de mercado para Next.js App Router, mas pressupõe roteamento por locale
  (`/en/...`, `/es/...`) ou middleware de negociação — incompatível de forma simples com
  `output: "export"` sem reestruturar todas as rotas/sitemap/robots já validados nas features
  `001`/`002`, para um ganho (URLs por idioma) que a spec não pede (SEO por idioma é "quando
  tecnicamente viável", não obrigatório).
- `react-i18next`: resolve interpolação/pluralização avançada que este site não usa (textos
  estáticos, sem plural complexo); adiciona uma dependência e uma API de inicialização assíncrona
  desnecessárias para 3 dicionários estáticos.

## Decision 2: Persistência da preferência de idioma

**Decision**: `localStorage` (client-only), lido em um efeito após a montagem; o primeiro
render (servidor/estático) sempre usa português, e a UI troca para o idioma salvo assim que o
efeito roda no navegador.

**Rationale**: Não há servidor em produção para ler um cookie antes de renderizar (export
estático), então qualquer leitura de preferência só pode acontecer no navegador. Isso implica um
efeito colateral aceito: em uma visita recorrente com idioma salvo diferente de português, o
primeiro pixel pode aparecer brevemente em português antes de trocar — um trade-off inerente à
arquitetura 100% estática, documentado aqui em vez de deixado como surpresa durante a
implementação. FR-004 ("lembrar o idioma... sem exigir nova seleção") continua satisfeito porque a
troca acontece automaticamente, sem interação do visitante.

**Alternatives considered**:
- Cookie lido no servidor: exigiria SSR/middleware, incompatível com `output: "export"`.
- Detecção automática do idioma do navegador (`navigator.language`) como padrão inicial: rejeitada
  como comportamento *default* porque a spec define português como padrão explícito para todo
  visitante novo (Assumptions); pode ser considerada no futuro como uma sugestão não-obrigatória,
  fora do escopo desta entrega.

**Falha de acesso ao `localStorage` (FR-011)**: a leitura/escrita MUST estar protegida (ex.:
`try/catch`) para navegação privada ou políticas que bloqueiam armazenamento local — nesse caso, a
troca de idioma continua funcionando apenas em memória (via o Context) durante a sessão atual; a
falha ao persistir é silenciosamente ignorada, sem erro visível ao visitante nem log de console
ruidoso.

## Decision 3: Provedor de mapa e Street View sem chave de API

**Decision**: Reutilizar o padrão de iframe já usado para o mapa atual (OpenStreetMap, carregado
sob demanda), trocando a URL pelo padrão legado, sem chave de API, que o próprio Google
redireciona (`301`) para a URL canônica de embed (`https://www.google.com/maps/embed?pb=...`)
quando usado dentro de um `<iframe>`:
- Mapa: `https://maps.google.com/maps?q={lat},{lng}&z={zoom}&output=embed`
- Street View: `https://maps.google.com/maps?cbll={lat},{lng}&layer=c&cbp=11,0,0,0,0&output=svembed`

**Verificado durante a implementação** (T025/T026): ambos os padrões foram testados em um
`<iframe>` real (Playwright + arquivo HTML local) — o padrão de mapa renderiza o mapa real
centrado no pino; o padrão de Street View renderiza um passeio 360°/fotoesfera real já publicado
para "Enseada Do Jatobá" (o nome do próprio local, conforme o endereço). Duas variantes
inicialmente tentadas (`output=embed` com `layer=c`/`cbll=`, e o parâmetro `cbp=12,...`) **não
funcionavam** — redirecionavam para uma especificação `pb=` vazia (`pb=!1m0`), causando um mapa-múndi
em branco em vez do Street View; a causa raiz só foi confirmada seguindo os redirecionamentos reais
com `curl -L` e testando em um `<iframe>` de verdade (não apenas a URL solta, que o próprio Google
recusa fora de um iframe: "The Google Maps Embed API must be used in an iframe").

**Rationale**: A API oficial "Maps Embed API" (via `google.com/maps/embed/v1/...`) e a "Maps
JavaScript API" exigem uma chave de API vinculada a um projeto no Google Cloud, potencialmente com
faturamento habilitado mesmo dentro do nível gratuito — isso introduz uma dependência
operacional (conta Google Cloud, dono responsável pela chave, rotação/revogação) que a
constituição do projeto trata como algo a evitar "a menos que exista uma necessidade concreta, com
autorização/credenciais, avaliação de privacidade e um dono responsável" definido. O recurso
gratuito de incorporação por `pb=` não exige nada disso e preserva o mesmo modelo de
"funciona sem infraestrutura própria" já usado para o OpenStreetMap.

**Alternatives considered**:
- Google Maps JavaScript API (mapa interativo completo, com pino customizável, InfoWindow etc.):
  rejeitada por exigir chave de API/faturamento para um ganho (interatividade extra) que a spec
  não pede — a spec pede "ver a localização exata" e "visualizar a chegada via Street View", ambos
  satisfeitos por um iframe estático.
- Manter o mapa atual (OpenStreetMap) e adicionar só um link para o Google Maps: era a Opção B da
  Question 3 durante `/speckit-specify`; não escolhida — o usuário confirmou a recomendação de
  substituir o mapa atual (FR-009).

## Decision 4: Cobertura do Street View no ponto exato

**Decision**: Não há verificação em tempo de execução de que o Street View tem cobertura no pino
exato (`-23.1819646, -44.7164933`); a seção sempre mantém o link "abrir no Google Maps" já
existente como alternativa, e a área de Street View recebe um texto de apoio avisando que a
imagem mostra o trecho de acesso e pode não ser exatamente a fachada da pousada.

**Rationale**: O iframe do Street View é de origem cruzada (cross-origin) — o site não consegue
detectar programaticamente, de forma confiável, se o Google não tem cobertura no ponto exato e
está mostrando a posição mais próxima disponível. Verificar isso exigiria uma chamada a uma API
paga do Google (Street View Static API/metadata), o que reintroduz o problema da Decision 3. Em
vez disso, o Edge Case já identificado na spec ("quando a visualização em nível de rua não tem
cobertura exata... o site MUST informar isso de forma clara") é resolvido com um aviso de texto
estático sempre visível, não com uma verificação dinâmica — consistente com a simplicidade já
adotada no restante do projeto.

**Alternatives considered**: Street View Static API para checar metadata de cobertura antes de
renderizar o iframe — rejeitada pela mesma razão da Decision 3 (exige chave de API/faturamento) e
por adicionar uma chamada de rede extra a um serviço pago só para decidir se mostra um aviso.

## Decision 5: Produção do conteúdo traduzido (EN/ES)

**Decision**: Os textos em inglês e espanhol são escritos como dados estáticos tipados (parte do
mesmo commit de implementação), não gerados em tempo de execução por um serviço de tradução.

**Rationale**: FR-006 já define que a tradução inicial pode ser automática e revisada depois de
forma assíncrona — isso descreve a *origem* do texto (rascunho gerado automaticamente durante a
implementação, revisado por uma pessoa depois), não uma dependência de tradução em tempo real no
site. Manter os textos como dados estáticos evita qualquer chamada de rede/custo/latência em
produção e é consistente com o restante do conteúdo do site, que já é 100% estático e tipado.

**Alternatives considered**: Serviço de tradução automática em tempo de execução (ex.: chamando
uma API de tradução no carregamento da página): rejeitado — adiciona uma dependência externa paga,
latência perceptível na troca de idioma (viola a Assumption "aplicada imediatamente... sem
recarregamento perceptível") e um novo risco de privacidade/disponibilidade para um requisito que
não pede tradução dinâmica de conteúdo gerado pelo usuário.

## Decision 6: Preservação de foco e anúncio da troca de idioma (acessibilidade)

**Decision**: A troca de idioma atualiza apenas o conteúdo textual dos nós já existentes na
árvore React (via o Context, sem `key` derivada do idioma nem desmontagem/remontagem condicional
de seções por idioma) — o React preserva a identidade dos elementos do DOM, e com ela o foco do
teclado, automaticamente (FR-005). A troca em si é anunciada por uma região `aria-live="polite"`
visualmente oculta, no mesmo componente do seletor (`LanguageSelector`), lida por leitores de tela
sem precisar de confirmação visual (FR-010/FR-011 do accessibility gate).

**Rationale**: Preservar foco "de graça" via reconciliação do React é mais simples e robusto do
que qualquer solução manual de restaurar foco após a troca — não exige guardar/restaurar
referências, e funciona mesmo em componentes que o desenvolvedor esqueça de tratar explicitamente.
O anúncio via `aria-live` reaproveita o mesmo padrão já usado no indicador de posição do carrossel
de relatos (`aria-live="polite"`, feature `003-mobile-modal-carousel`), evitando inventar um
mecanismo novo de comunicação com tecnologia assistiva.

**Alternatives considered**: Gerenciar foco manualmente (salvar `document.activeElement` antes da
troca e restaurá-lo depois): rejeitado como desnecessário — como nenhum componente é
desmontado/remontado pela troca de idioma, o foco nunca é perdido em primeiro lugar. Anunciar a
troca via `alert`/mudança de título da página: rejeitado por ser mais intrusivo que uma região
`aria-live="polite"` para uma mudança que não é um erro nem crítica.
