# Accessibility Validation: Visualização de Fotos em Foco (Modal de Galeria)

**Date**: 2026-07-25
**Scope**: WCAG 2.2 AA for the new focused photo view, re-validating against the baseline
established in `specs/001-pousada-landing-page/validation/accessibility.md`.

## Method

Same combination used for the base feature: automated axe-core scan against the real rendered
page (`@axe-core/playwright`), component-level `jest-axe` checks (`tests/integration/
media-gallery-lightbox.test.tsx` and the updated `accessibility.test.tsx`), and a scripted
keyboard/focus walkthrough — extended here with an explicit focus-containment check, since that
is the highest-risk new behavior this feature introduces.

## Results

### Automated axe scan (real browser, lightbox open)

**0 violations** across `wcag2a/2aa/21a/21aa/22aa` with the focused photo view open on a room
with real approved photos ("Quarto Duplo Deluxe com Vista do Mar").

### Focus containment (real finding, fixed during this pass)

An explicit Tab-cycling check (8 consecutive Tab presses with the view open) initially showed
focus **escaping the dialog**: native `showModal()` did not reliably prevent Tab from reaching
the page's skip link outside the dialog in this browser, breaking the expected 3-button cycle
(Fechar → Foto anterior → Próxima foto → Fechar → …).

**Fix applied**: `MediaGalleryLightbox` now enforces the wrap-around explicitly — on `Tab` at the
last focusable control, or `Shift+Tab` at the first, focus is moved programmatically to the other
end, rather than relying solely on the native dialog's focus containment.

**Re-run after fix**: 8/8 Tab presses stayed within the dialog; the cycle is a clean 3-element
loop. This is a good general lesson: native `<dialog>` semantics (Esc-adjacent behavior aside)
should not be assumed sufficient for full keyboard focus trapping without verifying in a real
browser — component-level (jsdom) tests cannot catch this, since jsdom does not implement
`showModal()`'s focus/inert behavior at all.

### Component-level tests (jsdom)

**61/61 tests pass**, 0 axe violations, covering: `MediaGalleryLightbox` in isolation (open/close,
circular navigation, position indicator, close button, Escape, backdrop click vs. photo click,
per-photo load-failure fallback), `RoomsSection` with the new cover-photo trigger and the focused
view open, and `WeddingSection`/`EventsSection` parity with fixture photos.

### End-to-end (real browser, chromium + mobile-chrome)

**12/12 pass**, covering: open from cover photo, circular navigation at both ends, close via
button/backdrop-click/Escape with focus restoration to the trigger, and a keyboard-only path
(Tab to trigger → Enter to open → Tab through controls → Enter to navigate → Escape to close).

### Not yet covered (explicit exception, same as the base feature)

Real screen-reader software (NVDA/VoiceOver) was not run in this session; recommended before
public launch, alongside the same recommendation already tracked in
`specs/001-pousada-landing-page/validation/accessibility.md`.

## Outcome

**PASS**, with one real focus-trap defect found and fixed during this pass. No regression to the
base feature's accessibility evidence — the rest of the page (header, sections, forms) is
unchanged by this feature.
