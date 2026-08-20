# Quickstart: Redesign Editorial de Natureza e Litoral

## Prerequisites

- Ambiente já configurado pelas features `001`–`004` (Node.js, dependências instaladas, testes/e2e
  configurados). Nenhuma dependência de runtime nova é adicionada por este redesign — ícones são
  SVGs locais e o efeito de rolagem usa `IntersectionObserver` nativo (`research.md` Decisions 3 e
  4).
- Foto do hero escolhida e pré-otimizada (dimensão/compressão adequadas para tela cheia) antes de
  iniciar a implementação visual — ver `research.md` Decision 1 sobre a ausência de otimização de
  imagem em tempo de requisição neste projeto (export estático + loader customizado).

## Local workflow

1. Inicie o ambiente de desenvolvimento (`npm run dev`) ou uma build de produção
   (`npm run build && npm run start`).
2. **Hero (User Story 1)**: abra a página inicial em desktop e confirme que, sem rolar, há uma
   imagem fotográfica real do casarão/piscina/entorno natural (não apenas texto sobre cor lisa) e
   que o texto do hero permanece legível sobre ela (contraste AA preservado). Repita em 375px.
   Ative "reduzir movimento" no sistema operacional, recarregue e confirme que qualquer efeito de
   entrada do hero é removido/reduzido a uma transição instantânea.
3. **Quartos (User Story 2)**: role até "Quartos" e confirme que nem todos os 7 itens têm o mesmo
   tamanho/proporção — os quartos marcados como destaque (`visualEmphasis: "featured"` em
   `pousada-content.ts`) ocupam mais espaço visual que os demais. Confirme que cada comodidade
   (Wi-Fi, ar-condicionado, café da manhã, piscina etc.) mostra um ícone além do texto. Troque para
   English/Español e confirme que a nova apresentação continua legível e sem cortes com textos mais
   longos.
4. **Linguagem visual coesa (User Story 3)**: role a página inteira (Casamentos, Eventos, Relatos,
   Localização) e confirme: (a) um efeito sutil de entrada ao rolar em cada seção principal,
   consistente entre elas; (b) a mesma paleta terrosa/textura orgânica em todas as seções, sem
   nenhuma seção usando gradiente vítreo/estética "glassmorphism"; (c) os depoimentos com
   tratamento tipográfico de destaque (citação em fonte de título, aspas decorativas), não cartões
   neutros repetidos.
5. Role para cima e para baixo repetidamente sobre uma mesma seção já revelada e confirme que o
   efeito de entrada não repete a cada pequena rolagem (Edge Case da spec).
6. Ative "reduzir movimento" e confirme que **nenhuma** seção anima ao rolar — todo o conteúdo
   aparece direto.
7. Alterne entre modo claro e escuro (preferência do sistema) e confirme que a nova paleta/textura
   permanece legível e com contraste adequado nos dois modos.
8. Confirme que nada mudou no **comportamento** das funcionalidades já existentes: seletor de
   idioma, modal de foto ampliada (lightbox), carrossel de relatos em mobile, mapa/Street View da
   Localização — apenas a apresentação visual ao redor delas.
9. Emule 320px/375px/768px/1280px nos 3 idiomas e confirme ausência de rolagem horizontal em
   qualquer seção redesenhada (SC-005).

## Required validation before delivery

1. Execute lint, checagem de tipos e testes de componentes (incluindo `jest-axe`) para as seções
   alteradas (Hero, Rooms, Wedding/Events, Testimonials) e para o novo hook `useScrollReveal`.
2. Confirme em build-time que a mudança de `Room.amenities` (`LocalizedText[]` → `RoomAmenity[]`,
   ver `data-model.md`) está refletida em todos os 7 quartos de `pousada-content.ts` e que nenhum
   `AmenityKey` usado é inválido (união literal fechada — erro de tipo, não de runtime).
3. Reexecute a suíte de testes ponta a ponta já existente (funcional, responsivo, acessibilidade)
   sem nenhuma nova falha — SC-003 exige 100% de aprovação e zero novas violações
   críticas/sérias.
4. Reexecute a auditoria de acessibilidade automatizada (`jest-axe` + varredura real de navegador)
   nas seções redesenhadas, incluindo o novo texto alternativo da imagem de hero e os ícones de
   comodidade (`aria-hidden` correto, sem duplicar anúncio do que o texto já diz).
5. Reexecute a medição de Core Web Vitals (Lighthouse, mesmo método `devtools`+`simulate` já usado)
   e compare contra a linha de base registrada em
   `specs/004-translation-google-maps/validation/performance.md` (LCP 3.3–3.8s, CLS 0, TBT
   elevado/pré-existente) — SC-004 exige igual ou melhor, com atenção especial ao LCP porque o hero
   passa a ser uma imagem (elemento LCP mais provável) em vez de texto.
6. Execute o QA responsivo em 320/375/768/1280px nos 3 idiomas e registre evidência em
   `specs/005-editorial-nature-redesign/validation/`, seguindo o mesmo formato já usado nas
   features 001–004.
7. Registre no `validation/` desta feature o peso final (KB) do arquivo de imagem do hero e a
   justificativa de que ele foi pré-otimizado antes do commit (não há otimização em tempo de
   requisição neste projeto — `research.md` Decision 1).
