# Data Model: Visualização de Fotos em Foco (Modal de Galeria)

## Entidades de domínio

Nenhuma entidade de domínio nova. Esta feature reutiliza, sem alteração de forma, as entidades já
definidas em `specs/001-pousada-landing-page/data-model.md`:

- **Media** (`src/domain/content.ts`): `src`, `alt`, `width`, `height`, `caption?`. A visualização
  em foco exibe exatamente esses campos por foto; nenhum campo novo é necessário.
- **Room** / **EventSpace**: fornecem a lista `images: Media[]` que a visualização em foco consome
  por item. A visualização em foco é sempre aberta no contexto de um único `Room` ou `EventSpace`
  por vez.

## Estado de interface (efêmero, não persistido)

Este estado vive apenas no componente que renderiza a galeria/modal, nunca no repositório de
conteúdo nem em armazenamento do navegador:

| Campo | Tipo | Regra |
|-------|------|-------|
| `isOpen` | boolean | Indica se a visualização em foco está aberta para o item atual. |
| `activeIndex` | number | Índice da foto exibida, `0`-based, dentro do array `images` do item em foco. |
| `images` | Media[] | O conjunto de fotos do item que está em foco (nunca misturado com o de outro item). |

Regras de transição:

- Abrir: `isOpen` passa a `true` e `activeIndex` é definido como o índice da foto clicada/ativada
  (não necessariamente `0`).
- Avançar: `activeIndex = (activeIndex + 1) % images.length` (navegação circular, conforme
  clarificação da spec).
- Voltar: `activeIndex = (activeIndex - 1 + images.length) % images.length`.
- Fechar: `isOpen` volta a `false`; o foco do teclado retorna ao elemento que abriu a visualização
  (FR-009). O estado não precisa ser preservado entre aberturas — cada abertura recomeça pelo
  índice da foto clicada.

## Relacionamentos e estados de conteúdo

- Um item sem fotos aprovadas (`images: []`) nunca produz um controle capaz de abrir a
  visualização em foco (FR-007); o fallback "foto em breve" já existente permanece como está.
- Uma foto que falha ao carregar dentro da visualização em foco usa a mesma alternativa
  compreensível já aplicada na página (ver `MediaGallery` em `specs/001-.../data-model.md` e
  `plan.md`), sem introduzir um novo estado de erro específico do modal.
