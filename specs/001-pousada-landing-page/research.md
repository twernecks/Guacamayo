# Research: Landing Page da Pousada

## Decision: Next.js App Router com pré-renderização estática

**Rationale**: A página pública precisa de conteúdo indexável, metadados e carregamento
rápido. O App Router permite pré-renderizar conteúdo estático e manter uma rota pública
simples, sem introduzir backend da aplicação.

**Alternatives considered**:

- SPA somente no cliente: rejeitada porque aumenta o risco de piorar indexabilidade e
  carregamento inicial de uma página institucional.
- Backend próprio: rejeitado porque reservas, autenticação e regras de negócio pertencem
  a feature futura.

## Decision: Dados estáticos tipados por repositório

**Rationale**: Quartos, eventos, casamentos, relatos e contatos serão conteúdo curado na
primeira entrega. Um repositório local fornece formato estável para a UI e pode ser
substituído por um adaptador de API sem reescrever as seções.

**Alternatives considered**:

- Dados embutidos em cada componente: rejeitado por acoplar apresentação e conteúdo.
- CMS ou API agora: rejeitado por exigir integração, credenciais e governança de conteúdo
  antes de existir necessidade comprovada.

## Decision: Conversão por WhatsApp e formulário de intenção

**Rationale**: O WhatsApp oferece contato imediato. O formulário curto reduz a fricção para
quem prefere organizar a solicitação antes de conversar. Na ausência de backend autorizado,
o envio transforma nome, telefone, tipo de evento/serviço e mensagem em WhatsApp
pré-preenchido e não retém dados localmente após a navegação.

**Alternatives considered**:

- Serviço externo de formulários: rejeitado nesta feature, pois requer autorização,
  credenciais, privacidade e responsável operacional.
- Formulário apenas visual: rejeitado porque não entrega um caminho de contato utilizável.

## Decision: Imagens reais e otimizadas, com fallback editorial

**Rationale**: Hospitalidade e casamentos dependem de confiança visual. Usar fotos reais e
aprovadas, dimensões conhecidas, formatos modernos e texto alternativo contextual reduz
risco de baixa credibilidade, layout instável e falhas de acessibilidade.

**Alternatives considered**:

- Fotos de banco genéricas: rejeitadas como substituto de imagens do negócio, por não
  comprovarem a experiência anunciada.
- Galerias sem tamanhos reservados: rejeitadas pelo impacto em CLS e usabilidade.

## Decision: Mapa interativo com alternativa textual

**Rationale**: A localização é relevante para hóspedes, convidados e organizadores de
eventos. O mapa é incorporado como apoio visual somente após o visitante selecionar
"Carregar mapa"; o endereço e um caminho alternativo permanecem disponíveis se o serviço
externo for bloqueado, recusado ou indisponível.

**Alternatives considered**:

- Apenas endereço em texto: rejeitado porque não oferece apoio espacial suficiente para a
  decisão de viagem e visita.
- Sem alternativa ao mapa: rejeitado por acessibilidade, resiliência e privacidade.
- Carregamento automático: rejeitado porque transmite dados de navegação ao provedor antes
  de uma ação explícita do visitante.

## Decision: Estilo próprio de refúgio natural e romântico com tokens de design

**Rationale**: Variáveis CSS e estilos locais permitem uma linguagem visual que combina
natureza, romance e celebrações, acolhendo hóspedes e casais sem reduzir a clareza das
ofertas. Tokens cobrem cores, tipografia, espaçamentos, raios, sombras e estados de foco.

**Alternatives considered**:

- Biblioteca visual extensa: rejeitada por dependência e aparência genérica sem requisito
  que justifique o custo.

## Decision: Validação em camadas

**Rationale**: A maior exposição da feature está em conversão, responsividade,
acessibilidade, SEO e imagens. Testes de componentes e ponta a ponta, além de auditoria
manual, verificam esses riscos sem testar detalhes internos em excesso.

**Alternatives considered**:

- Apenas inspeção manual: rejeitada porque regressões em CTA, formulário e teclado podem
  retornar sem evidência automatizada.
