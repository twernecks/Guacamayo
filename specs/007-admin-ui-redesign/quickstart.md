# Quickstart: Redesign Visual do Painel Administrativo

## Rodando localmente

1. `npm run dev` — o admin fica disponível em `http://localhost:3000/admin/login`. Nenhuma variável
   de ambiente nova é necessária (feature puramente visual).
2. Autentique com um usuário administrador válido (ver `006-admin-panel-integration/quickstart.md`
   para como provisionar um, se necessário — esta feature não muda autenticação).

## Roteiro de verificação visual (repetir em cada história implementada)

Usar as ferramentas de dispositivo do navegador (ou redimensionar a janela) nas quatro larguras de
FR-010/SC-003: **375px, 768px, 1024px, 1440px**. Em cada uma:

1. **Sem rolagem horizontal do body** em nenhuma tela visitada (SC-003).
2. **Nenhum elemento nativo sem estilo visível** — inputs, botões, tabelas e banners devem usar o
   sistema de design do admin, nunca a aparência padrão do navegador (SC-002).
3. **Foco visível** ao tabular pelo teclado por todos os elementos interativos da tela (FR-011).
4. **Modo escuro do SO**: alternar o tema do sistema operacional e confirmar que a tela reflete a
   paleta escura automaticamente, sem precisar de nenhuma ação do usuário (research.md Decision 6).

### Por história

1. **US1 — Login**: `/admin/login` aparece centralizado em um cartão, com rótulos, bordas e foco
   visíveis nos campos; erro de credenciais inválidas aparece em um banner destacado (mantendo
   `role="alert"`).
2. **US2 — Navegação**: em qualquer página autenticada, o cabeçalho/menu está estilizado, a seção
   ativa é identificável, e "Sair" é um botão reconhecível com ≥44×44px de área clicável.
3. **US3 — Conteúdo**: em `/admin/rooms` (repetir event-spaces/testimonials), a tabela tem
   cabeçalhos e linhas espaçadas, ações de editar/excluir são botões estilizados; abrir "Novo
   Quarto" e confirmar abas de idioma, campos com rótulo/borda/foco, e um banner de conflito ao
   forçar um 409 (duas abas editando o mesmo item, como no roteiro manual da feature 006).
4. **US4 — Site Settings / Leads**: `/admin/site-settings` usa os mesmos campos estilizados;
   `/admin/leads` tem filtros estilizados, mensagem clara para `from > to` inválido, e o detalhe de
   um lead segue o mesmo padrão visual do resto do painel.

## Verificações antes de entregar (gates da Constitution aplicáveis)

- ✅ **Executado em 2026-08-30.** `npm run typecheck` e `npm run lint` limpos. `npm run test`:
  160/160 (157 da linha de base da feature `006-admin-panel-integration` + 3 novos testes de
  acessibilidade desta feature — Event Space, Testimonial e detalhe de Lead). `npm run test:e2e`:
  90/90 (chromium + mobile-chrome), zero ajuste de asserção de comportamento necessário — apenas a
  extensão de cobertura em `accessibility.test.tsx` (FR-012/SC-007).
- ✅ `npm run build` gera as mesmas 20 rotas estáticas sem erro (nenhuma rota nova, nenhuma mudança
  de roteamento).
- ✅ `git diff -- package.json` vazio — nenhuma dependência nova em `dependencies` (SC-006).
- ✅ `tests/integration/admin/accessibility.test.tsx` (jest-axe) passa para todas as telas
  listadas em `plan.md` (Project Structure), incluindo as que ganharam cobertura nova nesta feature
  (detalhe de Lead, formulários de Espaços de Evento e Depoimentos).
- ✅ **SC-002/SC-003** (zero elementos sem estilo; sem rolagem horizontal 375–1440px): verificado
  via script Playwright ad-hoc (não permanente, mesmo padrão do T063 da feature `006`) — 0 rolagem
  horizontal em 8 rotas autenticadas representativas × 4 larguras, mais a tela de login; um proxy
  computado (`getComputedStyle`) confirma que inputs/botões usam os tokens do design system, não o
  estilo padrão do navegador.
- ✅ **SC-004/SC-005/FR-011** (alvo de toque, contraste AA, foco visível): elevado de verificação
  manual para automatizada — `@axe-core/playwright` (devDependency já instalada antes desta
  feature, nenhuma nova) rodando em Chromium real com as tags `wcag2a`/`wcag2aa` (incluindo
  `color-contrast`, que o `jest-axe`/jsdom do resto da suíte não avalia de forma confiável) — 0
  violações em login, listagem de Quartos, formulário de criação e detalhe de Lead. Navegação por
  teclado real confirmou indicador de foco visível em todos os campos e no botão de envio do login.
- ✅ **SC-009** (sem regressão de performance): `tests/e2e/admin/performance.spec.ts` continua
  dentro do orçamento de 3000ms após o redesenho — `/admin/rooms` com 100 itens: ~682–802ms;
  `/admin/leads` com 20 itens: ~991–1085ms.
