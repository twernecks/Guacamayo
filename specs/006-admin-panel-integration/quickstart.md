# Quickstart: Painel Administrativo — Integração com a Guacamayo API

## Rodando localmente

1. **Suba a Guacamayo API** (repositório separado, `D:/Dev/codex/guacamayo-api`) localmente —
   deve responder em `http://localhost:5249`, com CORS já liberado para `http://localhost:3000`
   (nenhuma configuração adicional necessária do lado da API para desenvolver o frontend).
2. Neste repositório, garanta que `.env.local` (não versionado) tenha, se quiser sobrescrever o
   default:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5249
   ```
   Sem essa variável, `src/lib/admin-api-config.ts` já usa esse valor como fallback (research.md
   Decision 9) — só é necessário definir explicitamente ao apontar para outro ambiente.
3. `npm run dev` — o admin fica disponível em `http://localhost:3000/admin/login`.
4. Autentique com um usuário administrador válido já existente na API local (fora do escopo desta
   feature criar o primeiro usuário — ver `Assumptions` da spec sobre provisionamento de
   credenciais).

## Trocando para o ambiente de produção (quando o deploy AWS estiver pronto)

Definir `NEXT_PUBLIC_API_BASE_URL` para a URL real da API no step de build de
`.github/workflows/deploy.yml` (mesmo padrão já usado para `NEXT_PUBLIC_SITE_URL`) — como o build é
estático (`output: "export"`), a URL fica embutida no bundle publicado; qualquer troca exige um
novo build/deploy, não é configurável em runtime.

## Roteiro de validação manual (fluxos críticos)

Rodar contra a API local real antes de qualquer entrega (os testes automatizados de e2e usam
`page.route()` para mockar a API — ver `research.md` Decision 5 — então não substituem esta
validação):

1. **Login/sessão**: login com credenciais válidas → chega à área administrativa; login com
   credenciais inválidas → mensagem genérica; deixar a aba aberta além do tempo de expiração do
   token de acesso → nenhuma interrupção perceptível (renovação automática); "Sair" → nova tentativa
   de acessar `/admin/rooms` diretamente volta para o login.
2. **CRUD de conteúdo** (repetir para Quartos, Espaços de Evento, Depoimentos): listar → criar
   preenchendo os três idiomas → editar → tentar publicar com um idioma vazio (deve bloquear) →
   excluir com confirmação (e cancelar uma vez, confirmando que nada muda).
3. **Conflito de concorrência**: abrir o mesmo item de conteúdo em duas abas, salvar na primeira,
   depois tentar salvar na segunda sem recarregar → deve bloquear com aviso de conflito.
4. **Configurações do Site**: editar um campo e salvar; confirmar que não há opção de criar/excluir.
5. **Leads**: abrir a listagem (deve estar vazia ou populada dependendo dos dados de teste da API
   local) → filtrar por status e por intervalo de datas (incluindo um intervalo inválido, `from >
   to`, que deve ser bloqueado no cliente) → abrir o detalhe de um lead com conversa e de um lead
   sem conversa (histórico vazio, sem erro) → marcar um lead como Contatado e depois de volta como
   Novo (transição livre).
6. **Rede fora do ar**: derrubar a API local momentaneamente e tentar carregar uma listagem →
   mensagem clara de falha de comunicação, distinta de um erro de validação.

## Verificações antes de entregar (gates da Constitution aplicáveis)

- `npm run typecheck`, `npm run lint`, `npm run test` (unit/integration) e `npm run test:e2e`
  passando. ✅ Reconfirmado em 2026-08-26 (após a correção de schema desta seção) — 157 testes
  unitários/integração e 90 testes e2e (chromium + mobile-chrome, site público + admin) passando,
  `npm run build` gerando as 20 rotas estáticas sem erro.
- Nenhuma nova violação de acessibilidade **crítica/séria** introduzida nas páginas públicas
  existentes (o admin em si está fora do gate formal de WCAG — research.md Decision 7).
  ✅ Passe básico (`jest-axe`, `tests/integration/admin/accessibility.test.tsx`) sem violações
  automaticamente detectáveis em login, listagens, formulário de criação e Configurações do Site.
- `/admin/**` ausente do `sitemap.xml` gerado e presente como `disallow` em `robots.txt`
  (research.md Decision 6). ✅ Confirmado no `out/` gerado em 2026-08-26.
- **SC-009** (listagens ≤100 itens prontas em ≤3s): medido via
  `tests/e2e/admin/performance.spec.ts` contra uma API mockada (research.md Decision 5) —
  `/admin/rooms` com 100 itens: ~337ms; `/admin/leads` com uma página de 20 itens: ~283ms. Ambos
  bem dentro do orçamento, mas isso mede o caminho client-side contra uma API mockada quase
  instantânea, **não** a rede real — o roteiro manual abaixo, contra a API local de verdade, é o
  que efetivamente valida SC-009 em condições reais.
- **✅ Executado em 2026-08-26 contra a API local real** (Postgres containerizado + `dotnet run`,
  não mais mockado): login/logout reais (incluindo revogação de sessão confirmada no servidor),
  CRUD completo de Quarto via UI (criar, listar, editar, excluir), listagens reais de Espaços de
  Evento e Depoimentos, Configurações do Site carregando/salvando o formato **plano** real, leads
  vazio tratado como estado normal, e um **409 real** disparado com duas sessões de navegador
  concorrentes editando o mesmo Quarto — a segunda sessão recebeu o banner de conflito, nunca
  sobrescreveu silenciosamente a primeira. Essa rodada revelou e corrigiu diversas divergências
  reais entre o que a spec/contratos documentavam e o que a API de fato retorna — ver
  `data-model.md` (seção "Atualização importante") para o detalhamento completo de cada correção
  (nomes de campo, enums numéricos vs. string, estrutura de Configurações do Site, nulabilidade de
  Lead, casing dos erros de campo).
