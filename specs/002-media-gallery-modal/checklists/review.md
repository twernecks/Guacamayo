# Requirements Review Checklist: Visualização de Fotos em Foco (Modal de Galeria)

**Purpose**: Reviewer-facing validation of requirements quality (completeness, clarity,
consistency, measurability, coverage) across spec.md, plan.md and supporting design docs, before
`/speckit-tasks` breaks the feature into implementation work.
**Created**: 2026-07-25
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md)

**Note**: This checklist tests the requirements as written — not the implementation. Items ask
whether something is specified clearly enough to build and test against, not whether it works.

## Requirement Completeness

- [ ] CHK001 - Is the precise click/activation target specified (whole photo area vs. a specific
      icon/badge) for opening the focused view? [Completeness, Spec §FR-001, Assumptions]
- [ ] CHK002 - Is an accessible name/label requirement defined for the close control? [Gap, Spec
      §FR-005, §FR-008]
- [ ] CHK003 - Is an accessible name/label requirement defined for the next/previous navigation
      controls? [Gap, Spec §FR-003, §FR-004]
- [ ] CHK004 - Does the spec state whether touch gestures (e.g., swipe to navigate) are required,
      optional, or explicitly out of scope on touch devices? [Gap, Spec §Responsive behavior]
- [ ] CHK005 - Does the spec state whether pinch-zoom or other in-place zoom of a single photo is
      in scope? [Gap]
- [ ] CHK006 - Is the participant profile for the usability check in SC-002 specified (e.g.,
      potential guests, as in the base feature), or left generic? [Completeness, Spec §SC-002]
- [ ] CHK007 - Does the spec confirm whether no new security/privacy requirements apply (no new
      data collected), or is this left implicit? [Completeness, Assumption]

## Requirement Clarity

- [ ] CHK008 - Is "percebida como instantânea" (Performance budget) quantified with a specific
      timing threshold, or left as a subjective description? [Clarity, Ambiguity, Spec
      §Performance budget]
- [ ] CHK009 - Does FR-006 clarify whether "texto alternativo/descritivo" includes the optional
      `caption` field (per data-model.md) in addition to `alt`, or only `alt`? [Clarity,
      Ambiguity, Spec §FR-006, data-model.md]
- [ ] CHK010 - Is "clique fora da foto" defined precisely enough for a full-screen mobile layout,
      where there may be little or no visible area outside the photo? [Clarity, Ambiguity, Spec
      §FR-005, Edge Cases]
- [ ] CHK011 - Is "quantidade" of photos (indicator on the cover photo, per Assumptions) specified
      as always visible, or only when there is more than one photo? [Clarity, Spec §Assumptions]

## Requirement Consistency

- [ ] CHK012 - Is the focus-containment requirement stated consistently between the Edge Cases
      section (screen-reader bullet) and the Functional Requirements list (FR-008), or only
      implied in one place? [Consistency, Spec §Edge Cases, §FR-008]
- [ ] CHK013 - Do the User Story 1 acceptance scenarios and FR-003 agree on the exact circular
      navigation behavior at both ends of the photo set? [Consistency, Spec §User Story 1
      Scenario 5, §FR-003]
- [ ] CHK014 - Does plan.md's description of `MediaGallery` as the "trigger" remain consistent
      with the base feature's (`001-pousada-landing-page`) documentation of that same component,
      or does this feature's plan explicitly note it supersedes that description? [Consistency,
      Traceability, plan.md §Project Structure]

## Acceptance Criteria Quality

- [ ] CHK015 - Can "posição atual... fica visível" (FR-004) be objectively verified without
      ambiguity about format (e.g., is "2 de 4" the required format, or just an example)?
      [Measurability, Spec §FR-004]
- [ ] CHK016 - Can SC-003 ("100% dos fluxos... funcionam apenas por teclado") be verified without
      further definition of which specific flows count, beyond open/navigate/close already listed
      in the User Stories? [Measurability, Spec §SC-003]
- [ ] CHK017 - Is SC-004 ("sem regressão") paired with a concrete comparison baseline (the existing
      `validation/performance.md` from the base feature), making it objectively checkable?
      [Measurability, Spec §SC-004]

## Scenario Coverage

- [ ] CHK018 - Are requirements defined for the primary flow (open → navigate → close) for all
      three consuming sections (Quartos, Casamentos, Eventos), not only Quartos? [Coverage, Spec
      §User Story 1, §User Story 2]
- [ ] CHK019 - Are exception/failure flows (image fails to load inside the focused view) addressed
      with a defined fallback, distinct from the zero-photos case? [Coverage, Spec §FR-011, Edge
      Cases]
- [ ] CHK020 - Are recovery requirements defined for what the visitor sees if they reopen the
      focused view after a previous photo failed to load (does it retry, or keep showing the
      fallback)? [Gap, Coverage]
- [ ] CHK021 - Are non-functional scenarios (keyboard-only, screen-reader, small-screen, zoomed
      text) each backed by at least one explicit requirement or acceptance scenario, rather than
      only appearing in Edge Cases prose? [Coverage, Spec §Edge Cases, §Accessibility]

## Edge Case Coverage

- [ ] CHK022 - Is the single-photo case (no navigation controls needed) explicitly distinguished
      from the "controls exist but are disabled" alternative? [Clarity, Spec §User Story 1
      Scenario 4]
- [ ] CHK023 - Is there a stated upper bound, or explicit "no bound," on the number of photos a
      single item may have, relevant to the position indicator remaining legible? [Gap, Spec
      §Edge Cases]
- [ ] CHK024 - Does the spec address what happens if the visitor triggers open/close/navigate in
      rapid succession (e.g., double-activation), or is this considered an implementation-level
      concern only? [Gap, Edge Case]

## Non-Functional Requirements

- [ ] CHK025 - Are the WCAG 2.2 AA success criteria this feature must satisfy named specifically
      (e.g., focus order, bypass blocks, name/role/value), or only referenced generically as "WCAG
      2.2 AA"? [Clarity, Spec §Accessibility]
- [ ] CHK026 - Does plan.md's research.md document a fallback or degraded experience for browsers
      that do not support the chosen modal mechanism, or is full support assumed without a stated
      justification? [Gap, research.md]
- [ ] CHK027 - Is the "no new network calls" guarantee (contracts/media-gallery-lightbox.md)
      consistent with the Performance budget requirement in spec.md, or stated only in one
      document? [Consistency, Traceability, spec.md §Performance budget, contracts/]

## Dependencies & Assumptions

- [ ] CHK028 - Is the assumption that "the current horizontal-scroll strip is fully replaced by a
      single cover photo" validated against every current consumer (Rooms, Wedding, Events), or
      only asserted generally in Assumptions? [Assumption, Spec §Assumptions]
- [ ] CHK029 - Is the dependency on already-approved photos/alt text from the base feature
      explicit enough that this feature cannot be scoped/estimated independently of that content's
      state? [Dependency, Spec §Assumptions]

## Ambiguities & Conflicts

- [ ] CHK030 - Is there any requirement in this spec that conflicts with the base feature's
      (`001-pousada-landing-page`) already-recorded accessibility validation evidence, requiring
      that evidence to be explicitly re-scoped rather than assumed still valid? [Conflict,
      Traceability]

## Notes

- Q1=B (cobertura completa), Q2=A (padrão), Q3=B (revisor) — escopo, profundidade e público
  confirmados pelo usuário antes da geração deste checklist.
- Itens marcados `[Gap]` indicam requisito ausente, não um requisito mal escrito; recomenda-se
  decidir e registrar a resposta em spec.md (via `/speckit-clarify` se o impacto justificar) antes
  de gerar as tasks, ou documentá-la como suposição aceita.
