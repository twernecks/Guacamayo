# Accessibility Validation: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Date**: 2026-07-27
**Scope**: WCAG 2.2 AA for the two mobile changes, re-validating against the baseline established
in `specs/002-media-gallery-modal/validation/accessibility.md`.

## Method

Same combination used for the two prior features: automated axe-core scan against the real
rendered page (`@axe-core/playwright`), component-level `jest-axe` checks (`tests/integration/
carousel-controls.test.tsx`, updated `media-gallery-lightbox.test.tsx` and
`testimonials-section.test.tsx`), and a scripted keyboard/focus walkthrough — extended here to
re-verify focus containment after extracting `CarouselControls` out of `MediaGalleryLightbox`.

## Results

### Automated axe scan (real browser, mobile 375px)

**Lightbox open on "Quarto Duplo Deluxe com Vista do Mar" (5 photos, mobile size): 0 violations**
across `wcag2a/2aa/21a/21aa/22aa`.

**Testimonials carousel: 1 real violation found and fixed, then 0**

- `scrollable-region-focusable` (Safari-specific keyboard access): the scrollable `<ul>` carousel
  track had `overflow-x: auto` but was not itself in the tab order, so Safari keyboard users
  could not scroll it directly (separately from the always-available prev/next buttons).
- **Fix applied**: `tabIndex={0}` (only when there is more than one testimonial) and
  `aria-label="Lista de relatos"` on the carousel `<ul>` in `TestimonialsSection.tsx`.
- **Re-scan after fix**: 0 violations, both at mobile (carousel) and desktop 1280px (grid).

### Focus containment re-check after the CarouselControls extraction (real finding from feature
002, re-verified here since T003 refactored the exact markup involved)

An 8-press Tab cycle starting at the lightbox's close button stayed within the dialog on every
press (`Fechar → Foto anterior → Próxima foto → Fechar → …`, repeating cleanly) — confirming the
`CarouselControls` extraction did not regress the focus-trap fix already recorded in feature 002's
validation.

### Component-level tests (jsdom)

**72/72 tests pass**, 0 axe violations, covering: the new `CarouselControls` in isolation
(previous/next buttons, position indicator, `aria-live`, no controls when `total <= 1`),
`MediaGalleryLightbox` with the header/legenda/indicator-always-visible requirement (FR-002), and
`TestimonialsSection`'s carousel (controls presence, keyboard navigation without a swipe gesture,
no circular wrap, every testimonial still rendered regardless of carousel state).

### End-to-end (real browser, chromium + mobile-chrome)

**44/44 pass**, including the two new specs added by this feature: modal proportion (≥90% of
viewport height at 375px, SC-001) and tappable backdrop margin at mobile size; testimonials
carousel navigation via buttons, keyboard-only operation, direct-scroll position sync, and the
desktop grid preserving the previous behavior with controls hidden.

### Not yet covered (explicit exception, same as the two prior features)

Real screen-reader software (NVDA/VoiceOver) was not run in this session; recommended before
public launch, alongside the same recommendation already tracked in
`specs/001-pousada-landing-page/validation/accessibility.md`.

## Outcome

**PASS**, with one real Safari-specific keyboard-access defect found and fixed in the new
testimonials carousel. No regression to either prior feature's accessibility evidence.
