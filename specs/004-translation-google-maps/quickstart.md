# Quickstart: Seletor de Idioma e Mapa com Google Maps/Street View

## Prerequisites

- Ambiente já configurado pelas features `001`–`003` (Node.js 22 LTS, dependências instaladas,
  testes/e2e configurados). Nenhuma dependência nova é adicionada por esta feature
  (`research.md` Decisions 1 e 3).
- Coordenada exata da pousada já confirmada: latitude -23.1819646, longitude -44.7164933
  (`spec.md` > Key Entities > Localização da Pousada).

## Local workflow

1. Inicie o ambiente de desenvolvimento (`npm run dev`) ou uma build de produção
   (`npm run build && npm run start`).
2. **Seletor de idioma**: em qualquer página, confirme que o seletor aparece no canto superior
   direito (desktop e mobile — em mobile pode estar recolhido no menu de navegação já
   responsivo), mostrando Português, English e Español, com o idioma atual indicado.
3. Selecione "English": confirme que 100% do texto visível (menu, quartos, casamentos/eventos,
   relatos, localização, rodapé, chamadas de contato) muda para inglês, sem mistura de idiomas e
   sem recarregar a página.
4. Com uma foto ampliada (lightbox) ou o carrossel de relatos aberto, troque o idioma e confirme
   que a janela/posição não fecha nem reseta.
5. Inicie um contato via WhatsApp (quarto, casamento/evento e contato geral) com "English"
   selecionado; confirme que a mensagem pré-preenchida está em inglês. Repita para "Español".
6. Recarregue a página (F5): confirme que o idioma escolhido é aplicado automaticamente, sem
   exigir nova seleção (aceitando o comportamento documentado em `research.md` Decision 2: o
   primeiro pixel pode aparecer brevemente em português antes de trocar, por se tratar de um site
   100% estático sem servidor para ler a preferência antes do primeiro render).
7. **Mapa e Street View**: acesse "Localização", acione "Carregar mapa" e confirme que o mapa é do
   Google Maps, centrado na coordenada exata da pousada (não uma região aproximada).
8. Confirme que existe uma forma de visualizar a chegada em nível de rua (Street View) sem sair da
   página, com um aviso visível de que a imagem mostra o trecho de acesso e pode não corresponder
   exatamente à fachada.
9. Confirme que o link "abrir no Google Maps" (fallback já existente) continua funcionando como
   alternativa.
10. Troque entre os 3 idiomas na seção de Localização e confirme que os textos ao redor do mapa
    (título, aviso, rótulos de botão) mudam de idioma; o mapa/Street View em si (conteúdo de um
    serviço externo) pode continuar no idioma do navegador/conta do visitante.
11. Emule uma viewport 320px e uma 768px+ e confirme que nenhum texto traduzido (tipicamente mais
    longo em inglês/espanhol) corta ou quebra o layout de botões, cabeçalhos e cartões.
12. **Acessibilidade do seletor**: usando somente teclado, confirme que o seletor é alcançável em
    uma posição previsível perto dos demais itens de navegação, tem um nome acessível que indica o
    idioma atual, e que trocar de idioma é anunciado a um leitor de tela (ex.: NVDA/VoiceOver) sem
    precisar de confirmação visual. Confirme que o foco do teclado não é perdido/resetado ao trocar
    de idioma.
13. Confirme que os embeds de mapa e de Street View têm um título/nome acessível descritivo (ex.:
    identificável por um leitor de tela como "mapa da localização da pousada").

## Required validation before delivery

1. Execute lint, checagem de tipos e testes de componentes (incluindo `jest-axe`) para o novo
   seletor de idioma, o provider de idioma e a seção de Localização atualizada.
2. Confirme em build-time que os três catálogos de mensagens (`pt`/`en`/`es`) satisfazem o mesmo
   tipo `Messages` (nenhuma chave de UI faltando em nenhum idioma) e que todo `LocalizedText` em
   `pousada-content.ts` tem as três línguas preenchidas.
3. Execute os fluxos ponta a ponta cobrindo: troca de idioma a partir de qualquer seção, mensagens
   de WhatsApp nos 3 idiomas, persistência entre recarregamentos, e a nova experiência de mapa
   (Google Maps + Street View) na seção de Localização.
4. Reexecute a auditoria de acessibilidade automatizada (`jest-axe` + varredura real de navegador)
   incluindo o seletor de idioma e o conteúdo traduzido nos 3 idiomas.
5. Reexecute a medição de Core Web Vitals da página e confirme ausência de regressão em relação ao
   já registrado em `specs/003-mobile-modal-carousel/validation/performance.md`.
6. Execute o QA responsivo em 320px/375px/768px/desktop nos 3 idiomas (atenção especial a textos
   mais longos em inglês/espanhol) e registre evidência em
   `specs/004-translation-google-maps/validation/`, seguindo o mesmo formato já usado nas features
   001–003.
7. Registre no `validation/` desta feature se o Street View tem cobertura visível no ponto exato
   ou se o aviso de "trecho de acesso aproximado" é o que aparece na prática — informação útil
   para o proprietário decidir se ajusta o pino no futuro.
