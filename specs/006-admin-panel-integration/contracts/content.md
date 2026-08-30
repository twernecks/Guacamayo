# Contrato consumido: Gestão de Conteúdo (Quartos, Espaços de Evento, Depoimentos, Configurações do Site)

**Fonte da verdade**: `D:/Dev/codex/guacamayo-api/specs/001-admin-auth-whatsapp-bot/contracts/admin-content-api.md`
— resumo do ponto de vista do frontend. Em caso de divergência, o arquivo acima prevalece.

Todos os endpoints abaixo exigem `Authorization: Bearer <accessToken>`. `401 UNAUTHORIZED` em
qualquer um deles segue o fluxo padrão de refresh-then-retry (`contracts/auth.md`).

## Quartos — `/api/admin/rooms`

| Método | Rota | Uso no frontend |
|---|---|---|
| GET | `/api/admin/rooms` | popula a listagem (`/admin/rooms`), incluindo não publicados |
| GET | `/api/admin/rooms/{id}` | popula o formulário de edição (`/admin/rooms/edit?id=`) |
| POST | `/api/admin/rooms` | submissão do formulário de criação (`/admin/rooms/new`) |
| PUT | `/api/admin/rooms/{id}` | submissão do formulário de edição — **sempre** reenvia o
  `rowVersion` lido no GET |
| DELETE | `/api/admin/rooms/{id}` | ação "Excluir" após confirmação (FR-013) |

**Espaços de Evento** (`/api/admin/event-spaces`) e **Depoimentos** (`/api/admin/testimonials`)
seguem exatamente o mesmo shape de operações — mesma tabela, trocando o path.

### Erros tratados

| Status | `error.code` | Tratamento no frontend |
|---|---|---|
| 404 | `NOT_FOUND` | ao editar/excluir um item que não existe mais (ex.: já excluído por outra pessoa) — mensagem "item não encontrado", não um erro genérico |
| 422 | `VALIDATION_ERROR` | `error.details[].field` (ex.: `"name.pt"`) mapeado para o campo/idioma correspondente no formulário (FR-026); ver `data-model.md` |
| 409 | `CONCURRENT_MODIFICATION` | dispara o fluxo de conflito (FR-014): bloqueia o salvamento, avisa, oferece recarregar |

## Configurações do Site — `/api/admin/site-settings`

| Método | Rota | Uso no frontend |
|---|---|---|
| GET | `/api/admin/site-settings` | popula a tela única (`/admin/site-settings`) |
| PUT | `/api/admin/site-settings` | única ação de escrita — sem criação/exclusão (FR-016) |

Mesmos códigos de erro de validação/conflito da tabela acima, aplicados a este único registro
(FR-017; ver `data-model.md` sobre a suposição de `rowVersion` aqui, marcada para confirmar).

## Exemplo de erro de validação (referência exata do contrato de origem)

```json
{
  "isSuccess": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [{ "field": "name.pt", "message": "Name (pt) is required." }]
  }
}
```
