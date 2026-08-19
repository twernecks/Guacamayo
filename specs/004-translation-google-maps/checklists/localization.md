# Localization & Map Requirements Quality Checklist: Seletor de Idioma e Mapa com Google Maps/Street View

**Purpose**: Validate that the i18n/translation requirements and the Google Maps/Street View
requirements in `spec.md` (and their technical framing in `plan.md`/`research.md`/
`data-model.md`) are complete, clear, consistent and measurable enough to move into
`/speckit-tasks` — a formal gate, not a review of any implementation.
**Created**: 2026-08-18
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the requirements as written, not any code or UI. Every item asks
whether the spec says something clearly enough — not whether a build behaves correctly.

**Scope**: Um único checklist cobrindo as duas frentes da feature (i18n/tradução e mapa/Street
View), já que compartilham requisitos entrelaçados (ex.: FR-008/FR-009 do mapa dependem de FR-002
para os textos ao redor). Profundidade: gate formal antes do `/speckit-tasks`, mesmo padrão da
feature `003`.

**Finalization pass (2026-08-18)**: Revisado a pedido do usuário ("analise novamente os planos
para mitigar possíveis dúvidas") — todos os 16 itens foram fechados com edições diretas em
`spec.md` (e pequenos ajustes em `research.md`/`data-model.md` onde a resolução era técnica). Ver
também `plan.md` > Checklist Resolution para a tabela-resumo.

## Requirement Completeness

- [X] CHK001 Está enumerado com precisão o que "todas as seções e funcionalidades" (FR-002) inclui
      — por exemplo, título/descrição da página (metadata), texto alternativo de imagens, avisos
      de privacidade do mapa e mensagens de estado vazio/erro já existentes — ou fica implícito
      apenas pelo nome das seções? [Completeness, Spec §FR-002]
      **Resolvido**: FR-002 agora lista explicitamente metadata, alt text, avisos de privacidade
      e mensagens de estado vazio/erro, com a metadata remetendo à regra específica de SEO.
- [X] CHK002 A "revisão humana assíncrona" do conteúdo traduzido (FR-006) tem um processo ou
      responsável definido, ou apenas o fato de que ela deve acontecer? [Gap, Spec §FR-006]
      **Resolvido (aceito conscientemente)**: nova Assumption define o proprietário da pousada
      como responsável, sem prazo formal — proporcional ao volume de conteúdo desta feature.
- [X] CHK003 Existe um requisito para o caso em que o navegador do visitante bloqueia/não suporta
      `localStorage` (ex.: navegação privada) — o site MUST continuar funcional com algum
      comportamento definido, ou este caso não está coberto? [Gap, Coverage]
      **Resolvido**: novo FR-011 — degrada para memória-apenas durante a sessão, sem erro visível.

## Requirement Clarity

- [X] CHK004 O aviso de possível falta de cobertura do Street View (Edge Cases) é definido como
      sempre visível, ou como algo que só aparece quando uma falha é detectada — considerando que
      `research.md` (Decision 4) já optou por não verificar cobertura em tempo de execução, essa
      escolha está refletida com a mesma clareza no texto da spec? [Clarity, Spec §Edge Cases]
      **Resolvido**: o Edge Case correspondente agora especifica que o aviso é sempre exibido, de
      forma estática, não apenas quando uma falha é detectada.
- [X] CHK005 A revisão humana pós-lançamento do conteúdo traduzido (FR-006) tem um prazo, ou pode
      permanecer indefinidamente sem revisão e ainda assim ser lida como conforme ao requisito?
      [Ambiguity, Spec §FR-006]
      **Resolvido (mesmo tratamento de CHK002)**: sem prazo formal, aceito conscientemente via
      Assumption — risco baixo para o volume de conteúdo desta entrega.
- [X] CHK006 Além de "MUST continuar legível... sem cortar texto nem quebrar o layout" (Edge
      Cases), existe algum limite mensurável (ex.: comprimento máximo de string, política de
      truncamento) para textos em inglês/espanhol tipicamente mais longos que o original em
      português? [Clarity, Spec §Edge Cases]
      **Resolvido**: o Edge Case agora exige quebra de linha (reflow) em vez de truncamento, e
      declara explicitamente que não há limite máximo de caracteres imposto por esta feature.

## Requirement Consistency

- [X] CHK007 FR-004/SC-004 garantem que um visitante recorrente vê o site no idioma já escolhido;
      isso é consistente com o comportamento de primeiro-render sempre em português documentado em
      `research.md` (Decision 2), ou o texto da spec dá a entender uma troca instantânea sem
      nenhuma janela de português visível? [Consistency, Spec §FR-004/§SC-004]
      **Resolvido**: FR-004 agora aceita explicitamente o breve flash inicial em português como
      trade-off do site 100% estático, remetendo a Assumptions.
- [X] CHK008 FR-008 exige que a coordenada exata "MUST ser confirmada... antes do início da
      implementação", tratando-a como uma pré-condição em aberto — mas a mesma coordenada já
      aparece confirmada em Key Entities/Assumptions do mesmo documento; o texto do requisito
      ainda reflete corretamente o estado atual, ou ficou desatualizado em relação ao resto da
      spec? [Consistency, Spec §FR-008 vs. §Key Entities]
      **Resolvido**: FR-008 reescrito para declarar a coordenada já confirmada (com o valor
      citado inline), em vez de tratá-la como pré-condição futura.

## Acceptance Criteria Quality (Measurability)

- [X] CHK009 SC-002 ("teste com falantes nativos de inglês e de espanhol... consegue entender")
      define quantas pessoas, qual critério de "conseguir entender" e qual taxa de sucesso conta
      como aprovado, ou o resultado depende do julgamento de quem conduz o teste? [Measurability,
      Spec §SC-002]
      **Resolvido**: SC-002 quantificado — ≥2 falantes nativos por idioma, 100% completam duas
      tarefas objetivas (identificar comodidades, descrever como contatar).
- [X] CHK010 SC-005 ("visualizar uma imagem de nível de rua... sem sair da página") pode ser
      objetivamente verificado independentemente de o Google ter ou não cobertura de Street View
      no ponto exato — já que `research.md` (Decision 4) documenta que essa cobertura não é
      garantida — ou o critério de sucesso poderia falhar por um motivo fora do controle da
      implementação? [Measurability, Spec §SC-005]
      **Resolvido**: SC-005 reformulado — o aviso de falta de cobertura (Edge Case) conta
      explicitamente como atendimento do critério, tornando-o independente da cobertura real do
      Google.

## Scenario/Edge Case Coverage

- [X] CHK011 Existe um requisito para o estado da interface enquanto a troca de idioma está sendo
      aplicada (por menor que seja o tempo), ou a troca é assumida como instantânea sem nenhum
      estado de transição a especificar? [Gap, Non-Functional]
      **Resolvido**: novo FR-012 — a troca é síncrona, sem requisição de rede nem estado de
      carregamento.
- [X] CHK012 Para mensagens de WhatsApp que combinam texto de interface com dado de conteúdo
      interpolado (ex.: nome de um quarto dentro da frase de interesse), a spec define que o dado
      interpolado também deve estar no idioma selecionado para preservar a gramática da frase, ou
      isso fica implícito apenas por Key Entities do plano técnico? [Gap, Spec §FR-003]
      **Resolvido**: FR-003 agora exige explicitamente que dado interpolado também esteja no
      idioma selecionado.
- [X] CHK013 Existe um requisito para o caso de um visitante compartilhar/salvar o link do site
      enquanto está em inglês ou espanhol — o próximo visitante que abrir esse link MUST ver o
      idioma preservado, ou é aceitável que sempre volte ao padrão (português) por não haver
      idioma codificado na URL? [Gap, Coverage]
      **Resolvido (aceito conscientemente)**: nova Assumption declara que links compartilhados não
      preservam idioma entre visitantes diferentes, consistente com a Decision 1 (sem URL por
      idioma).

## Dependencies & Assumptions

- [X] CHK014 O uso do recurso gratuito/sem chave de API do Google Maps para os embeds (decisão
      técnica documentada em `research.md`, Decision 3) está registrado como uma dependência ou
      risco assumido também no `spec.md` (ex.: em Assumptions), ou essa dependência de um serviço
      externo sem contrato/SLA só existe na documentação técnica? [Assumption, Gap]
      **Resolvido**: nova Assumption no spec.md documenta essa dependência e aponta o
      `fallbackMapUrl` já existente como mitigação.
- [X] CHK015 A condição "quando tecnicamente viável" para metadata/SEO por idioma (Public
      Experience Requirements) tem algum critério que defina o que tornaria inviável, ou a decisão
      fica inteiramente a critério de quem implementa? [Ambiguity, Spec §Public Experience and
      Quality Requirements]
      **Resolvido**: reescrito com critério explícito (atualização client-side sem reestruturar
      rotas estáticas) e um limite de escopo declarado (indexação em EN/ES fica fora de escopo se
      a técnica escolhida não conseguir atualizar as tags a tempo).

## Ambiguities & Conflicts

- [X] CHK016 FR-009 exige que o novo mapa "não coexista como um segundo widget de mapa separado";
      isso é consistente com a própria seção de Localização oferecer, ao mesmo tempo, tanto a
      visão de mapa quanto a visão de Street View (dois embeds distintos), ou o requisito poderia
      ser lido como proibindo essa combinação também? [Conflict, Spec §FR-009]
      **Resolvido**: FR-009 reescrito para esclarecer que a restrição é sobre não manter o mapa
      antigo (OpenStreetMap) ao lado do novo — mapa + Street View do Google juntos são tratados
      como uma única experiência integrada, não dois widgets concorrentes.

## Notes

- Focus: i18n/tradução + mapa/Street View em um único checklist (escolhido pelo usuário) — cobre
  as duas frentes da feature por compartilharem requisitos entrelaçados.
- Profundidade: gate formal antes de `/speckit-tasks` (escolhido pelo usuário, mesmo padrão da
  feature `003`) — recomenda-se resolver ou conscientemente aceitar os itens acima antes de gerar
  as tasks.
- **Status final**: 16/16 resolvidos (13 por precisão de requisito direta no spec.md, 3 aceitos
  conscientemente via Assumption: CHK002, CHK005, CHK013). Nenhuma pendência bloqueia
  `/speckit-tasks`.
- Check items off as completed: `[x]`
- Add comments or findings inline
- Items are numbered sequentially for easy reference
