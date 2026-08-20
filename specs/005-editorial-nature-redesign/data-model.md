# Data Model: Redesign Editorial de Natureza e Litoral

**Input**: `specs/005-editorial-nature-redesign/spec.md`, `research.md`

Este redesign é **apenas de apresentação** (ver Assumptions da spec): não introduz nenhum backend,
API ou entidade persistida nova. As mudanças de modelo abaixo são extensões pontuais aos tipos já
existentes em `src/domain/content.ts`, necessárias para que a camada de dados carregue a
informação que os novos componentes visuais precisam (imagem do hero, chave de ícone por
comodidade, destaque editorial por quarto) — sem introduzir lógica de negócio nos componentes.

## Entidades alteradas

### `PousadaContent` (estendida)

| Campo | Tipo | Mudança | Motivo |
|---|---|---|---|
| `hero` | `{ image: Media }` | **Novo** | FR-001/SC-002: o hero precisa de uma imagem real; reaproveita o tipo `Media` já existente (mesmo formato usado em `Room.images`/`EventSpace.images`), preenchido em `pousada-content.ts` com uma das fotos já aprovadas (`research.md` Decision 1). |

### `Room` (estendida)

| Campo | Tipo | Mudança | Motivo |
|---|---|---|---|
| `amenities` | `LocalizedText[]` → `RoomAmenity[]` | **Alterado (breaking)** | FR-004: cada comodidade precisa de um ícone; combinar texto localizado com uma chave estável de ícone (ver `RoomAmenity` abaixo) em vez de casar texto (`research.md` Decision 3). |
| `visualEmphasis` | `"standard" \| "featured"` (opcional, padrão implícito `"standard"`) | **Novo** | FR-002: variação editorial decidida pelo conteúdo, não randômica (`research.md` Decision 5). |

### `RoomAmenity` (novo tipo)

```ts
export type AmenityKey =
  | "wifi"
  | "airConditioning"
  | "breakfast"
  | "pool"
  | "seaView"
  | "gardenView"
  | "parking"
  | "tv";

export type RoomAmenity = {
  key: AmenityKey;
  label: LocalizedText;
};
```

- `key` é a chave estável usada só para escolher o ícone (`src/components/ui/icons/`) — nunca
  exibida ao usuário.
- `label` continua sendo o texto localizado já existente (PT/EN/ES), exibido normalmente.
- O conjunto de `AmenityKey` é fechado (união literal), então um valor não mapeado é um erro de
  tipo em tempo de build, não uma falha silenciosa em runtime.

**Impacto em dados existentes**: os 7 quartos em `src/data/pousada-content.ts` precisam ter suas
listas de `amenities: LocalizedText[]` reescritas para `RoomAmenity[]`, atribuindo a `key`
apropriada a cada comodidade já existente (ex. `"Wi-Fi"` → `{ key: "wifi", label: {...} }`,
`"Café da manhã incluso"`/`"Breakfast included"`/`"Desayuno incluido"` → `{ key: "breakfast",
label: {...} }`). Nenhum texto de comodidade muda de conteúdo, só de formato de armazenamento.

**Impacto em componentes**: `RoomsSection.tsx` passa a renderizar, para cada `RoomAmenity`, o ícone
correspondente a `key` (via um mapa `AmenityKey → IconComponent`) ao lado do `label` localizado,
com o ícone marcado `aria-hidden="true"` (o texto do `label` já carrega o significado para leitor
de tela, evitando duplicação de anúncio).

## Entidades não alteradas

- `EventSpace`, `Testimonial`, `ContactChannels`, `Location`, `Media`, `GeoCoordinates`: sem
  mudança de forma. `Testimonial`/`EventSpace` recebem apenas tratamento visual novo (CSS/
  tipografia), sem novos campos — ver `research.md` Decisions 6 e 7.

## Fluxo de dados (sem mudança de arquitetura)

Os dados continuam estáticos e tipados, carregados de `src/data/pousada-content.ts` e passados por
props para os Client Components de seção, exatamente como hoje (Princípio II da constituição —
nenhum novo serviço, repositório ou chamada assíncrona introduzida por este redesign).
