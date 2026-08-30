# Contrato consumido: Autenticação

**Fonte da verdade**: `D:/Dev/codex/guacamayo-api/specs/001-admin-auth-whatsapp-bot/contracts/auth-api.md`
— este arquivo é um resumo do ponto de vista do frontend (o que `src/services/admin/auth-service.ts`
consome), não uma cópia normativa. Em caso de divergência, o arquivo acima prevalece.

Base URL: `NEXT_PUBLIC_API_BASE_URL` (fallback `http://localhost:5249`). Todas as respostas seguem o
envelope `{ isSuccess, data, error }`.

## `POST /api/auth/login`

- **Chamado por**: tela de login (`/admin/login`).
- **Request**: `{ email: string, password: string }`.
- **200**: `{ accessToken, accessTokenExpiresAt, refreshToken, displayName }` → grava na sessão
  (research.md Decision 3), agenda renovação, redireciona (FR-008).
- **401 `INVALID_CREDENTIALS`**: exibe mensagem genérica (FR-006), sem distinguir email inexistente
  de senha errada.

## `POST /api/auth/refresh`

- **Chamado por**: (a) `auth-store.ts`, proativamente, via um `setTimeout` agendado a partir de
  `accessTokenExpiresAt` (FR-003, research.md Decision 3); (b) `api-client.ts`, reativamente, uma
  única vez, ao receber `401` de qualquer outra chamada autenticada (research.md Decision 4).
- **Request**: `{ refreshToken: string }` (sem header `Authorization`).
- **200**: mesmo shape do login → substitui os tokens armazenados.
- **401 `INVALID_REFRESH_TOKEN`** ou **401 `REFRESH_TOKEN_REUSE_DETECTED`**: ambos tratados de forma
  idêntica no frontend — força logout local e redireciona ao login (FR-004; spec.md Assumptions:
  "a mensagem exibida... não distingue a causa técnica").

## `POST /api/auth/logout`

- **Chamado por**: botão "Sair" (FR-005).
- **Request**: `{ refreshToken: string }`.
- **200**: limpa a sessão local independentemente do corpo da resposta.
- **401 `INVALID_REFRESH_TOKEN`**: tratado como sucesso do ponto de vista da UI — o objetivo (sessão
  encerrada) já está satisfeito; não exibe erro ao usuário.

## `GET /api/admin/me`

- **Chamado por**: opcionalmente, para validar a sessão ao montar o layout autenticado
  (`/admin/layout.tsx`) antes de confiar em um token restaurado do `localStorage` — decisão de
  implementação (tasks.md), não obrigatória: `accessTokenExpiresAt` já local pode bastar para
  decidir se tenta renderizar otimisticamente e deixar a primeira chamada de dado real revelar um
  401, se houver.
- **200**: `{ email, name }`.
- **401 `UNAUTHORIZED`**: mesmo tratamento de qualquer 401 fora do fluxo de login/refresh.
