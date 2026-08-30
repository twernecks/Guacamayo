# Data Model: Painel Administrativo — Integração com a Guacamayo API

**Feature**: [spec.md](./spec.md) | **Date**: 2026-08-26 (revisado e confirmado ao vivo em 2026-08-26)

Fonte da verdade original dos contratos: `D:/Dev/codex/guacamayo-api/specs/001-admin-auth-whatsapp-bot/contracts/`
(`auth-api.md`, `admin-content-api.md`) e
`D:/Dev/codex/guacamayo-api/specs/003-admin-leads-management/contracts/admin-leads-api.md`.

**Atualização importante (T063 — validação manual contra a API local real, 2026-08-26)**: com a
API rodando de verdade (Postgres containerizado + `dotnet run`), todos os campos antes marcados 🔶
foram confirmados diretamente contra o código-fonte da API
(`Guacamayo.Domain.Entities`/`Guacamayo.Application.Content.*.{Room,EventSpace,Testimonial,SiteSettings}Models.cs`,
`Guacamayo.Application.Leads.LeadModels.cs`) e contra chamadas HTTP reais (login, `GET`/`POST`/`PUT`
em cada entidade, incluindo um `409` real). **Vários divergiam do que o contrato/documentação
sugeria** — as tabelas abaixo já refletem o formato real confirmado, não mais suposições. Onde algo
mudou de verdade em relação à primeira versão deste documento, uma nota "⚠️ Corrigido" explica o
que era assumido antes.

Todas as entidades abaixo vivem em `src/domain/admin/*.ts`, **separadas** dos tipos já existentes em
`src/domain/content.ts` (que descrevem o conteúdo estático da vitrine pública, uma fonte de dados
diferente — `src/data/pousada-content.ts` — e sem `rowVersion`/`isPublished`/etc.). Reutilizar o
mesmo tipo para as duas fontes acopraria dois modelos com ciclos de vida e formatos diferentes
(Constitution Principle I: "Components MUST NOT own unrelated business logic").

## Enums — todos numéricos, não strings

⚠️ **Corrigido**: a API não registra `JsonStringEnumConverter` nas opções globais de JSON dos
controllers (`Program.cs` só configura `PropertyNamingPolicy = CamelCase`) — **todo enum C#
serializa como um número inteiro puro**, na ordem de declaração do enum. A primeira versão deste
documento assumiu strings (`"standard"`, `"event"`, `"stay"`) por analogia com os tipos da vitrine
pública — errado. Ver `src/domain/admin/enums.ts`.

| Enum C# (`Guacamayo.Domain.Enums`) | Usado em | Valores confirmados |
|---|---|---|
| `ContactInterest` | `EventSpace.contactContext`, `Testimonial.experienceType`, `Lead.interest` | `0 Stay`, `1 Event`, `2 Wedding` — um único enum compartilhado pelos três; `Stay` nunca é usado do lado de Espaço de Evento |
| `AmenityKey` | `Room.amenityKeys[]` | `0 Wifi`, `1 AirConditioning`, `2 Breakfast`, `3 Pool`, `4 PrivateBathroom`, `5 MiniFridge`, `6 SeaView` |
| `VisualEmphasis` | `Room.visualEmphasis` | `0 Standard`, `1 Featured` |
| `LeadStatus` | `Lead.status` | `0 New`, `1 Contacted`, `2 Closed` (já estava correto) |
| `MessageDirection` | `LeadMessage.direction` | `0 Inbound` (do lead), `1 Outbound` (do bot) (já estava correto) |

## Tipos compartilhados

```ts
// src/domain/admin/shared.ts
export type LocalizedText = { pt: string; en: string; es: string };
// Confirmado ao vivo: LocalizedTextDto(Pt, En, Es) → camelCase → { pt, en, es }. Correto desde a
// primeira versão.

export type RowVersion = string; // string opaca (uint do Postgres formatado como string pela API — ex.: "1035")

export type ApiError = {
  code: string;
  message: string;
  details: Array<{ field: string; message: string }> | null;
};
```

⚠️ **Corrigido — casing de `details[].field`**: o contrato mostrava o exemplo `"field": "name.pt"`
(lowerCamelCase). A API real retorna **PascalCase**: `"field": "Name.Pt"` (confirmado com um `POST
/api/admin/rooms` real disparando validação). `FieldError.tsx` foi ajustado para comparar
case-insensitive em vez de assumir uma casing fixa.

## Sessão do Administrador (`src/domain/admin/auth.ts`)

| Campo | Tipo | Origem | Notas |
|---|---|---|---|
| `accessToken` | `string` | login/refresh | enviado como `Authorization: Bearer <token>` |
| `accessTokenExpiresAt` | `string` (ISO 8601, ex.: `"2026-08-27T01:24:48.9274761+00:00"`) | login/refresh | usado para agendar a renovação (research.md Decision 3) — confirmado com offset `+00:00`, não sufixo `Z`; `new Date(...)` do JS aceita os dois igualmente |
| `refreshToken` | `string` | login/refresh | reenviado no corpo de `POST /api/auth/refresh` e `/logout` |
| `displayName` | `string` | login/refresh | exibido na UI (ex.: cabeçalho do painel) |

Sem `rowVersion` — não é uma entidade de conteúdo, é estado de sessão client-side. Formato
confirmado ao vivo, idêntico ao que já estava documentado.

## Quarto administrativo (`AdminRoom`, `src/domain/admin/rooms.ts`)

Confirmado contra `Guacamayo.Application.Content.Rooms.RoomDto` e um `POST`/`GET` reais.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` (uuid) | |
| `name` | `LocalizedText` | |
| `summary` | `LocalizedText` | ⚠️ **Corrigido**: o campo se chama `summary`, não `description` — nome exato só existe no código da API, o contrato não listava todos os campos de texto |
| `amenityKeys` | `AmenityKeyValue[]` (números, ex.: `[3, 0]`) | ⚠️ **Corrigido**: array de números (`AmenityKey`), não strings |
| `imageIds` | `string[]` (uuids) | ⚠️ **Novo campo, não previsto na primeira versão** — referências a mídias já associadas ao quarto; sem UI de upload/seleção nesta feature, a tela só reenvia o array tal como recebido (`[]` aceito na criação, confirmado ao vivo) |
| `isPublished` | `boolean` | |
| `visualEmphasis` | `VisualEmphasisValue` (`0` ou `1`) | ⚠️ **Corrigido**: número, não `"standard"`/`"featured"` |
| `displayOrder` | `number` | |
| `rowVersion` | `RowVersion` | presente em toda resposta de `GET`/`POST`/`PUT`; obrigatório no `PUT` |

**Validação (FR-012)**: publicar (`isPublished: true`) com algum campo obrigatório vazio em
`name`/`summary` para qualquer um dos três idiomas retorna `422 VALIDATION_ERROR` com
`details[].field` no formato confirmado `"Name.En"`, `"Summary.Pt"` etc. (PascalCase).

## Espaço de Evento administrativo (`AdminEventSpace`, `src/domain/admin/event-spaces.ts`)

Confirmado contra `Guacamayo.Application.Content.EventSpaces.EventSpaceDto` e um `POST` real.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` (uuid) | |
| `name` | `LocalizedText` | |
| `purpose` | `LocalizedText` | ⚠️ **Corrigido**: o campo se chama `purpose`, não `description` |
| `contactContext` | `ContactInterest` (número — `1` Event ou `2` Wedding na prática) | ⚠️ **Corrigido**: número, não `"event"`/`"wedding"` |
| `imageIds` | `string[]` (uuids) | ⚠️ **Novo campo, não previsto na primeira versão** — mesmo tratamento de `AdminRoom.imageIds` |
| `isFeatured` | `boolean` | ⚠️ **Novo campo, ausente por completo na primeira versão** |
| `isPublished` | `boolean` | |
| `displayOrder` | `number` | |
| `rowVersion` | `RowVersion` | |

## Depoimento administrativo (`AdminTestimonial`, `src/domain/admin/testimonials.ts`)

Confirmado contra `Guacamayo.Application.Content.Testimonials.TestimonialDto` e um `POST` real.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` (uuid) | |
| `quote` | `LocalizedText` | |
| `attribution` | `string` (não localizado) | confirmado — nome de pessoa, um único valor, não `LocalizedText` |
| `experienceType` | `ContactInterest` (número `0`/`1`/`2`) | ⚠️ **Corrigido**: número, não `"stay"`/`"event"`/`"wedding"` |
| `approvedAt` | `string` (`"yyyy-MM-dd"`, ex.: `"2026-01-15"`) | ⚠️ **Corrigido**: `DateOnly` no C# — **sem componente de hora**, não um timestamp ISO 8601 completo. `<input type="date">` já produz exatamente esse formato; nunca converter via `new Date(...).toISOString()` (isso adicionaria hora/timezone que a API não espera) |
| `isPublished` | `boolean` | |
| `rowVersion` | `RowVersion` | |

Sem `displayOrder` — confirmado ausente do DTO (já estava certo na primeira versão).

## Configurações do Site (`AdminSiteSettings`, `src/domain/admin/site-settings.ts`)

⚠️ **Corrigido — estrutura inteira**: confirmado contra
`Guacamayo.Application.Content.SiteSettings.SiteSettingsDto` e um `GET`/`PUT` reais. A primeira
versão assumiu um formato aninhado (`contact: {...}`, `location: {...}`) por analogia à vitrine
pública — **errado**: o registro real é **plano**, um único `address` (não um por seção) e
`latitude`/`longitude` soltos (não um objeto `coordinates`). Sem `id` na resposta.

| Campo | Tipo | Notas |
|---|---|---|
| `whatsappNumber` | `string` | |
| `phone` | `string \| null` | |
| `email` | `string \| null` | |
| `address` | `string` | único campo de endereço, compartilhado — não há `contact.address` e `location.address` separados |
| `latitude` | `number` | campo solto, não `coordinates.lat` |
| `longitude` | `number` | campo solto, não `coordinates.lng` |
| `mapEmbedUrl` | `string` | |
| `streetViewEmbedUrl` | `string \| null` | |
| `fallbackMapUrl` | `string` | |
| `heroMediaId` | `string \| null` (uuid) | referência a uma mídia por ID; sem endpoint de upload nesta feature — a tela só exibe/reenvia o valor recebido |
| `rowVersion` | `RowVersion` | confirmado presente e funcional (testado um `409 CONCURRENT_MODIFICATION` real reenviando o mesmo `rowVersion` duas vezes) |

## Lead (`Lead`, `src/domain/admin/leads.ts`)

Confirmado contra `Guacamayo.Application.Leads.LeadDto`/`LeadDetailDto`.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `string` (uuid) | |
| `name` | `string` | ⚠️ **Corrigido**: `required string` no C#, **nunca `null`** — a UI mantém o indicador "não informado" (FR-021) como salvaguarda defensiva para uma string vazia inesperada, não porque a API possa mandar `null` |
| `phone` | `string` | idem — não nulável |
| `interest` | `ContactInterest` (número `0` Stay/`1` Event/`2` Wedding) | ⚠️ Antes documentado como "enum desconhecido, confirmar depois" — confirmado: é o mesmo `ContactInterest` de `EventSpace.contactContext`/`Testimonial.experienceType` |
| `message` | `string \| null` | mensagem inicial do lead |
| `status` | `0 \| 1 \| 2` | `0 = Novo`, `1 = Contatado`, `2 = Fechado` — já estava correto |
| `createdAt` | `string` (ISO 8601 com hora) | já estava correto |
| `rowVersion` | `RowVersion` | |
| `messages` | `LeadMessage[]` | só no detalhe (`GET /api/admin/leads/{id}`); sempre um array, nunca `null` (FR-022) |

### Mensagem da conversa (`LeadMessage`)

| Campo | Tipo | Notas |
|---|---|---|
| `direction` | `0 \| 1` | `0 Inbound` (recebida do lead), `1 Outbound` (enviada pelo bot) — confirmado no enum `MessageDirection`, a suposição inicial (pela ordem do exemplo do contrato) estava certa |
| `body` | `string` | texto livre, Unicode (pode incluir emoji — research.md Decision 8 / spec Assumptions) |
| `timestamp` | `string` (ISO 8601) | |

## Transições de estado

```
Lead.status:  Novo (0) ⇄ Contatado (1) ⇄ Fechado (2)
              (transição livre em qualquer direção — spec.md Clarifications 2026-08-25)

Conteúdo.isPublished: false ⇄ true
              (bloqueado ao tentar true com campo obrigatório vazio em pt/en/es — FR-012;
               salvar como rascunho com false nunca é bloqueado, mesmo com idiomas incompletos —
               spec.md Edge Cases, item sobre itens legados)
```

## Regras de validação centrais (aplicadas no cliente antes de enviar, e reforçadas pela API)

- **FR-012**: publicar um item de conteúdo com `name`/`summary`/`purpose`/`quote` vazio em pt, en ou
  es é bloqueado no cliente (validação otimista, mesma regra que a API aplicaria de qualquer forma)
  — evita uma viagem de rede desnecessária, mas a API continua sendo a fonte de verdade final
  (resposta 422 tratada da mesma forma caso a validação client-side seja contornada; campo do erro
  vem em PascalCase — `FieldError.tsx` compara sem diferenciar maiúsculas/minúsculas).
- **FR-020**: filtro de leads com `from > to` é bloqueado no cliente antes da chamada (mesma lógica
  que a API rejeitaria com 422).
- **FR-014/FR-017/FR-024**: toda entidade com `rowVersion` reenvia o valor lido no `PUT`; um `409`
  com `error.code === "CONCURRENT_MODIFICATION"` nunca é tratado como erro genérico — dispara o
  fluxo específico de "recarregar antes de tentar de novo" (testado ao vivo para Site Settings).
