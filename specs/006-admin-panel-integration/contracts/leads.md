# Contrato consumido: Gestão de Leads

**Fonte da verdade**: `D:/Dev/codex/guacamayo-api/specs/003-admin-leads-management/contracts/admin-leads-api.md`
— resumo do ponto de vista do frontend. Em caso de divergência, o arquivo acima prevalece.

Todos os endpoints exigem `Authorization: Bearer <accessToken>`, mesmo tratamento de 401 do
`contracts/auth.md`.

## `GET /api/admin/leads?status=&from=&to=&skip=&take=`

- **Chamado por**: `/admin/leads` (listagem). `take` fixo em `20` (spec.md Clarifications
  2026-08-25 — sem seletor de tamanho de página nesta versão); `skip` avança conforme paginação.
- `status`: omitido = todos; caso contrário `0` (Novo), `1` (Contatado) ou `2` (Fechado).
- `from`/`to`: validados no cliente antes de enviar (`from <= to` — FR-020); se ainda assim a API
  retornar `422 VALIDATION_ERROR`, a mensagem da API é exibida (não deveria acontecer na prática,
  já que o cliente pré-valida).
- **200**: `{ items: Lead[], totalCount: number }` — `items` já vem ordenado mais recente primeiro.

## `GET /api/admin/leads/{id}`

- **Chamado por**: `/admin/leads/detail?id=` (detalhe).
- **200**: mesmo shape de um item de `items[]` acima, mais `messages: LeadMessage[]` — **sempre um
  array**, `[]` quando a conversa de origem não existe mais (FR-022), nunca erro nesse caso.
- **404 `NOT_FOUND`**: lead não existe (ex.: link direto para um ID inválido).

## `PUT /api/admin/leads/{id}/status`

- **Chamado por**: ação "Marcar como Contatado/Fechado/Novo" no detalhe e/ou na listagem
  (transição livre entre os três — spec.md Clarifications 2026-08-25).
- **Request**: `{ status: 0 | 1 | 2, rowVersion: string }` — `rowVersion` é sempre o valor lido na
  última leitura do lead (listagem ou detalhe).
- **200**: lead atualizado; a UI reflete o novo status tanto no detalhe quanto na listagem em cache.
- **404 `NOT_FOUND`**: lead não existe mais.
- **422 `VALIDATION_ERROR`**: `take` fora de 1–100 (não deve ocorrer, `take` é fixo em 20),
  `from > to` (não deve ocorrer, pré-validado), `rowVersion` ausente (bug do cliente, não deveria
  acontecer com a implementação correta do `api-client.ts`).
- **409 `CONCURRENT_MODIFICATION`**: mesmo fluxo de conflito das demais entidades (FR-024).

## Enums

| Enum | Valores confirmados no contrato | Observação |
|---|---|---|
| `status` (Lead) | `0` Novo, `1` Contatado, `2` Fechado | confirmado — usar diretamente |
| `interest` (Lead) | 🔶 não confirmado | contrato de origem não lista os valores; **obter a definição real do enum antes de implementar o mapeamento para rótulo legível** (`data-model.md`) |
| `direction` (LeadMessage) | 🔶 inferido (`0`=recebida, `1`=enviada) pela ordem do exemplo | confirmar rótulos exatos ao implementar |
