# UX/Accessibility Requirements Quality Checklist: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Purpose**: Validate that the UX and accessibility requirements in `spec.md` (and their
technical framing in `plan.md`) are complete, clear, consistent and measurable enough to move
into `/speckit-tasks` — a formal gate, not a review of any implementation.
**Created**: 2026-07-27
**Feature**: [spec.md](../spec.md)

**Note**: This checklist tests the requirements as written, not any code or UI. Every item asks
whether the spec says something clearly enough — not whether a build behaves correctly.

**Finalization pass (2026-07-28)**: Reviewed after `/speckit-implement` completed, cross-referencing
each item against the concrete values/decisions in `tasks.md`'s Execution Notes and the shipped
code/validation docs. 13/16 items are resolved by a concrete implementation or validation decision
(marked `[X]` with a **Resolved** note). 3 items (CHK003, CHK008, CHK009) are not resolved by any
task — they are genuine spec-wording gaps that implementation choices sidestepped rather than
answered, and are left unchecked with a **Requires decision** note for you.

## Requirement Completeness

- [X] CHK001 Is a minimum width proportion specified for the enlarged photo view on mobile,
      alongside the ≥90% height target already given? [Gap, Spec §SC-001]
      **Resolved**: `.dialog` sets `width: 92vw` in the mobile media query
      (`MediaGalleryLightbox.module.css`), alongside the existing `92vh` height — a concrete width
      proportion now exists, not just height.
- [X] CHK002 Does the spec define a minimum touch-target size for the compacted mobile header,
      close button and position indicator, to prevent "reduced spacing/height" from shrinking
      controls below an accessible tap size? [Gap, Spec §FR-002]
      **Resolved**: `CarouselControls.module.css`'s `.navButton` enforces `min-width`/
      `min-height: 2.75rem` unconditionally, and `.closeButton` in
      `MediaGalleryLightbox.module.css` keeps the same 2.75rem floor untouched by the mobile
      compaction (T006).
- [ ] CHK003 Is an expected/maximum testimonial count documented, to bound how well the
      carousel and its position indicator are expected to scale beyond the 3 testimonials
      approved today? [Gap, Spec §Assumptions]
      **Requires decision**: no maximum/expected count is documented anywhere. The carousel
      (`flex: 0 0 88%` cards, "N de M" indicator) scales mechanically to any count, but was only
      validated with the 3 currently-approved testimonials. Low impact today — flag if/when the
      approved testimonial count grows substantially and re-validate the carousel at that size.
- [X] CHK004 Does the spec define behavior for visitors with a reduced-motion preference, for
      either the modal's resize/open transition or the carousel's scroll-snap animation?
      [Gap, Non-Functional]
      **Resolved**: the carousel's only motion (`scroll-behavior: smooth`) is disabled via
      `@media (prefers-reduced-motion: reduce)` in `TestimonialsSection.module.css`. The modal has
      no CSS transition on open/resize (native `<dialog>` `showModal()`, no animation defined), so
      there is no motion to gate on the modal side.

## Requirement Clarity

- [X] CHK005 Is "margem/fundo escurecido visível o suficiente para tocar fora e fechar"
      (Clarifications, FR-001) quantified with a minimum size, or left to subjective judgment
      during implementation? [Clarity, Spec §FR-001]
      **Resolved**: mobile `.dialog` is fixed at `92vw`/`92vh`, giving an explicit ~8%-of-viewport
      backdrop margin on every side — measured present and tappable down to 320px width
      (`validation/frontend-qa.md`).
- [X] CHK006 Is "espaçamento/altura reduzidos" for the mobile header/legenda/indicador (FR-002)
      bounded by any minimum, or could it be reduced arbitrarily close to zero and still satisfy
      the requirement as written? [Clarity, Spec §FR-002]
      **Resolved**: the compacted header/body/position padding now uses concrete space tokens
      (not open-ended), and the interactive controls within them (`closeButton`, `navButton`)
      have an enforced 2.75rem floor the compaction cannot shrink below.
- [X] CHK007 If the "próximo card parcialmente visível" strategy is chosen to satisfy FR-006, is
      the minimum visible portion of the next card specified, so it's guaranteed to be
      perceivable as an affordance rather than an accidental sliver? [Clarity, Spec §FR-006]
      **Resolved**: `.card { flex: 0 0 88% }` in `TestimonialsSection.module.css` — leaves the
      next card ~12% visible, a concrete value rather than an unspecified "partial" affordance.

## Requirement Consistency

- [ ] CHK008 FR-003 and FR-008 both preserve desktop/tablet behavior "a menos que um ajuste
      traga benefício claro" — is there any shared, objective criterion for "benefício claro",
      so the two requirements can't be applied inconsistently with each other? [Consistency,
      Spec §FR-003, §FR-008]
      **Requires decision**: no shared objective definition of "benefício claro" was introduced.
      This delivery implemented both FR-003 and FR-008 as "preserve as-is" (no desktop/tablet
      adjustment made), which sidesteps the ambiguity for this feature but leaves the wording
      unresolved for any future feature that invokes the same clause.
- [ ] CHK009 Is the accessibility guarantee restated in FR-009 ("nomes acessíveis, papéis,
      comportamento de foco") consistent in scope with the more granular guarantees already
      itemized in FR-002 and FR-007, or could FR-009 be read as narrower/broader than intended?
      [Consistency, Spec §FR-002, §FR-007, §FR-009]
      **Requires decision**: the spec text itself was not edited to scope FR-009 explicitly
      against FR-002/FR-007. Implementation preserved all three guarantees without contradiction
      (verified via axe scans, `validation/accessibility.md`), but the wording ambiguity remains
      unedited in the spec.

## Acceptance Criteria Quality (Measurability)

- [X] CHK010 Can "regressão perceptível" in the Performance budget requirement be objectively
      verified without a stated numeric threshold in this spec, or does it rely entirely on the
      LCP/CLS budget defined in a different feature's validation doc? [Measurability, Spec
      §Public Experience and Quality Requirements]
      **Resolved in practice**: `validation/performance.md` (T013) validated against the
      concrete LCP ≤2.5s / CLS ≤0.1 budget carried over from feature 002, giving "regressão
      perceptível" an objective numeric anchor even though the spec text itself doesn't restate
      the threshold.
- [X] CHK011 Is SC-003 ("100% dos comportamentos atuais... sem regressão perceptível em nenhum
      teste manual") measurable independent of who performs the manual test, or does its
      pass/fail outcome depend on the individual tester's judgment of "perceptível"?
      [Measurability, Spec §SC-003]
      **Resolved in practice**: `validation/frontend-qa.md` (T014) operationalized SC-003 with
      objective, tester-independent measurements (dialog % of viewport height/width, presence/
      absence of page-level horizontal scroll, presence of backdrop margin) instead of relying on
      subjective "perceptível" judgment.

## Scenario/Edge Case Coverage

- [X] CHK012 Is focus-management behavior specified for when keyboard navigation of the
      testimonials carousel moves focus to a card outside the currently scrolled-into-view area
      (e.g., does the container auto-scroll to keep the focused card visible)? [Gap, Coverage]
      **Resolved**: `TestimonialsSection.tsx`'s `goPrevious`/`goNext` call `scrollToIndex`, which
      uses `scrollIntoView({ block: "nearest", inline: "center" })` on the target card —
      keyboard-triggered navigation always keeps the active card in view.
- [X] CHK013 Beyond "continuar legível... sem estourar o layout", is a maximum card
      height/overflow behavior defined for a testimonial whose text is unusually long? [Clarity,
      Spec §Edge Cases]
      **Resolved**: `.quote { max-height: 40vh; overflow-y: auto }` in
      `TestimonialsSection.module.css` — a concrete cap with internal scroll for unusually long
      testimonial text.
- [X] CHK014 Are requirements defined for an accidental horizontal swipe gesture occurring over
      the enlarged photo view itself (User Story 1 only specifies button-based prev/next), to
      rule out an unintended interaction between the two features' input handling? [Gap,
      Coverage]
      **Resolved**: the lightbox never registers touch/swipe handlers — navigation stays
      button-only (`MediaGalleryLightbox.tsx`) — so there is no gesture-handling code shared or
      contended between the modal and the testimonials carousel; the two features cannot
      conflict because only one of them listens for swipe at all.

## Dependencies & Assumptions

- [X] CHK015 The spec's own Assumptions section notes that "carrossel horizontal similar ao já
      usado na aplicação" refers to the existing photo-lightbox's visual/navigation pattern, not
      a technical implementation reused as-is — is this distinction validated against the fact
      that the referenced lightbox has no swipe/touch support today, only buttons? [Assumption,
      Spec §Assumptions]
      **Resolved/validated**: the testimonials carousel does not reuse the lightbox's
      implementation — it has its own native `scroll-snap` + `IntersectionObserver` swipe support
      (`TestimonialsSection.tsx`/`.module.css`), confirming the Assumption's own caveat that only
      the *pattern* (one item at a time, position indicator, prev/next) was reused, not the
      (swipe-less) lightbox code.

## Ambiguities & Conflicts

- [X] CHK016 FR-001 requires the enlarged view to occupy a "significativamente maior" proportion
      of the screen while also requiring a visible margin sufficient to tap outside and close —
      at very narrow widths (e.g., 320px, per Edge Cases), is there a documented minimum
      proportion (beyond SC-001's 90% height, which doesn't address width) that keeps these two
      constraints from conflicting? [Conflict, Spec §FR-001, §Edge Cases]
      **Resolved**: `validation/frontend-qa.md` documents the modal at 92%+ height with a
      present, tappable backdrop margin down to 320px width, and explicitly documents the one
      boundary case where the two constraints could appear to conflict (landscape phones wider
      than 768px falling outside the mobile media query's width-only definition) as a by-design,
      non-defect edge case.

## Notes

- Focus: UX/Acessibilidade mobile (escolhido pelo usuário) — não cobre requisitos técnicos de
  `plan.md`/`research.md` além do que já é referenciado pelas Clarifications da spec.
- Profundidade: gate formal antes de `/speckit-tasks` (escolhido pelo usuário) — recomenda-se
  resolver ou conscientemente aceitar os itens acima antes de gerar as tasks.
- **Status final**: 13/16 resolvidos pela implementação/validação (ver anotações acima). 3
  pendentes de decisão do responsável pelo produto (não são bugs de código): CHK003 (limite de
  relatos), CHK008 (critério objetivo para "benefício claro" em FR-003/FR-008), CHK009 (escopo de
  FR-009 frente a FR-002/FR-007). Nenhum bloqueia a entrega atual.
- Check items off as completed: `[x]`
- Add comments or findings inline
- Items are numbered sequentially for easy reference
