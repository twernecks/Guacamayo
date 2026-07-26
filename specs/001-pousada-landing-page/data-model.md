# Data Model: Landing Page da Pousada

## Shared media

| Field | Type | Rules |
|-------|------|-------|
| `src` | string | Caminho de imagem aprovada e otimizada |
| `alt` | string | Descreve o conteúdo ou função da imagem; não é genérico |
| `width` / `height` | number | Obrigatórios para reservar espaço visual |
| `caption` | string? | Usar quando acrescentar contexto relevante |

## Room

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Único e estável para futura API |
| `name` | string | Nome comercial aprovado |
| `summary` | string | Benefício claro, sem promessas não aprovadas |
| `amenities` | string[] | Lista de comodidades confirmadas |
| `images` | Media[] | Pelo menos uma imagem aprovada |
| `contactContext` | `stay` | Pré-seleciona a intenção de contato |

## EventSpace

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Único e estável |
| `name` | string | Nome aprovado do espaço |
| `purpose` | string | Descreve usos confirmados |
| `images` | Media[] | Galeria aprovada |
| `contactContext` | `event` or `wedding` | Define CTA contextual |
| `isFeatured` | boolean | Apenas o serviço de casamento é destacado |

## Testimonial

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Único e estável |
| `quote` | string | Relato aprovado, sem edição que altere sentido |
| `attribution` | string | Identificação autorizada pelo autor |
| `experienceType` | `stay` or `event` or `wedding` | Dá contexto ao relato |
| `approvedAt` | string | Registro de aprovação editorial |

## ContactIntent

| Field | Type | Rules |
|-------|------|-------|
| `name` | string | Obrigatório; 2 a 80 caracteres |
| `phone` | string | Obrigatório; telefone válido |
| `interest` | `stay` or `event` or `wedding` | Obrigatório; representa o tipo de evento/serviço e é pré-preenchido pelo CTA quando aplicável |
| `message` | string | Opcional; máximo de 1.000 caracteres |

## Relationships and state

- Um `Room` e um `EventSpace` possuem uma ou mais mídias.
- Um `Testimonial` referencia um tipo de experiência, sem exigir conta ou perfil público.
- Um `ContactIntent` é efêmero: é validado no cliente, transformado em mensagem e aberto
  no WhatsApp. Não possui persistência nem transições de estado de servidor.
- Conteúdo ausente usa fallback editorial e mantém o CTA de contato disponível.

## Location

| Field | Type | Rules |
|-------|------|-------|
| `address` | string | Endereço textual completo e aprovado |
| `mapEmbedUrl` | string | Origem aprovada para incorporar o mapa interativo |
| `fallbackMapUrl` | string | Link alternativo para abrir a localização externamente |
