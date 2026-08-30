Preciso implementar as telas administrativas que consomem a Guacamayo API
(repositório separado, já pronta e testada — 128 testes passando). Autenticação por login
(JWT + refresh token rotativo). Testar contra a API local por enquanto (http://localhost:5249,
CORS já liberado para http://localhost:3000), trocando só a URL base quando o deploy AWS
estiver pronto.

Escopo:

1. Login persistindo o access/refresh token e renovando automaticamente antes de expirar
   (POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout).

2. CRUD completo de Quartos, Espaços de Evento e Depoimentos (/api/admin/rooms,
   /api/admin/event-spaces, /api/admin/testimonials) — formulário multilíngue (pt/en/es),
   listagem, criação, edição respeitando controle de concorrência otimista via campo rowVersion
   (um PUT com rowVersion desatualizado retorna 409, a tela deve pedir pra recarregar), exclusão
   com confirmação.

3. Edição das Configurações do Site (/api/admin/site-settings) — registro único, sem
   criação/exclusão.

4. Gestão de Leads (/api/admin/leads) — os contatos que o bot de WhatsApp captura, hoje
   invisíveis em qualquer tela: (a) listagem paginada (skip/take) com filtro por status
   (Novo/Contatado/Fechado) e por intervalo de data de criação, mais recentes primeiro; (b) tela
   de detalhe de um lead mostrando nome/telefone/interesse/mensagem e o histórico completo de
   mensagens da conversa que o originou (pode vir vazio, é um estado normal, não um erro); (c)
   ação de marcar um lead como "Contatado" ou "Fechado", com o mesmo controle de rowVersion/409
   do item 2.

5. Tratamento de erro genérico a partir do envelope padrão da API ({isSuccess, data, error}) —
   toasts ou mensagens de formulário a partir de error.code/error.message/error.details.

6. Proteção de todas as rotas administrativas exigindo login válido.

Os contratos completos de request/response de cada endpoint estão documentados no repositório da
API em D:/Dev/codex/guacamayo-api/specs/001-admin-auth-whatsapp-bot/contracts/ (auth-api.md, admin-content-api.md) e
D:/Dev/codex/guacamayo-api/specs/003-admin-leads-management/contracts/admin-leads-api.md — usar como fonte da verdade em vez
de adivinhar o formato (nomes de campo, valores de enum como números inteiros, forma exata do
rowVersion como string opaca).
