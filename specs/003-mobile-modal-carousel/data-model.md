# Data Model: Experiência Mobile — Modal de Foto e Carrossel de Relatos

## Entidades de domínio

Nenhuma entidade de domínio nova. Esta feature reutiliza, sem alteração de forma, as entidades já
definidas em `specs/001-pousada-landing-page/data-model.md`:

- **Media** (`src/domain/content.ts`): consumida sem alteração pelo `MediaGalleryLightbox`; só a
  apresentação (proporção de tela) muda no mobile.
- **Testimonial** (`src/domain/content.ts`): consumida sem alteração pelo novo carrossel de
  relatos; nenhum campo novo (ex.: imagem, avatar) é necessário para o swipe ou o indicador de
  posição.

## Estado de interface (efêmero, não persistido)

### Visualização em foco de foto (já existente, sem mudança de forma)

Reaproveita o estado já documentado em `specs/002-media-gallery-modal/data-model.md`
(`isOpen`, `activeIndex`, `images`). Esta feature não adiciona nem altera esses campos — apenas
a apresentação visual no mobile muda.

### Carrossel de relatos (novo)

| Campo | Tipo | Regra |
|-------|------|-------|
| `activeIndex` | number | Índice do relato em foco/centralizado, `0`-based, dentro do array `testimonials`. Usado para o indicador de posição textual e para calcular o deslocamento de rolagem dos botões anterior/próxima. |

Regras de transição:

- Avançar: `activeIndex = min(activeIndex + 1, testimonials.length - 1)` (sem navegação circular
  — a spec não pede esse comportamento para relatos, diferente da visualização de fotos).
- Voltar: `activeIndex = max(activeIndex - 1, 0)`.
- Swipe/gesto do usuário: o navegador reporta a posição de rolagem nativamente (`scroll-snap`);
  `activeIndex` é derivado do card mais próximo do início visível do container após o gesto, para
  manter o indicador de posição sincronizado com o que o visitante está vendo.
- Com 0 relatos aprovados: nenhum carrossel é renderizado; o estado vazio já existente
  (`specs/001-.../data-model.md`) permanece.
- Com 1 relato aprovado: o card único é exibido sem controles de navegação nem indicador de
  posição (mesmo padrão já usado quando uma galeria de fotos tem 1 única foto).

## Relacionamentos e estados de conteúdo

- O carrossel de relatos e a visualização em foco de fotos permanecem independentes; nenhuma
  navegação ou estado é compartilhado entre eles além do padrão visual/estrutural de controles
  (ver `research.md`).
- Em tablet/desktop, `testimonials` continua renderizado na grade já existente
  (`TestimonialsSection.module.css`); o estado `activeIndex` do carrossel só é relevante na
  apresentação mobile.
