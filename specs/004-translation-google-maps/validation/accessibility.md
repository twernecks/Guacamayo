# Accessibility Validation: Seletor de Idioma e Mapa com Google Maps/Street View

**Date**: 2026-08-18
**Scope**: WCAG 2.2 AA for the language selector, the site-wide translation (including
non-visible accessible names, per `checklists/accessibility.md`), and the Google Maps/Street View
embeds — re-validating against the baseline established in
`specs/003-mobile-modal-carousel/validation/accessibility.md`. Confirms SC-006.

## Method

Same combination used for the three prior features: automated axe-core scan against the real
rendered page (`@axe-core/playwright`), component-level `jest-axe` checks (all `tests/
integration/*.test.tsx`), and the Playwright e2e keyboard-operability assertions in
`tests/e2e/language-switching.spec.ts` and `tests/e2e/location-map.spec.ts`.

## Results

### Automated axe scan (real browser)

| Scenario | Violations |
|---|---|
| Home page, mobile 375px, pt | 0 |
| Photo lightbox open, mobile 375px, pt | 0 |
| Home page, mobile 375px, en | 0 |
| Photo lightbox open, mobile 375px, en | 0 |
| Home page, mobile 375px, es | 0 |
| Photo lightbox open, mobile 375px, es | 0 |
| Localização section, map + Street View loaded, desktop 1280px, en | 0 |

**0 violations across all 7 scenarios** (`wcag2a`/`2aa`/`21a`/`21aa`/`22aa` tags), including with
the Google Maps/Street View iframes present — `iframes: false` was NOT needed for the real-browser
scan (only for the jsdom-based component tests, where jsdom cannot model iframe content windows).

### FR-010 requirements, specifically verified

- **`lang` attribute + selector state, both signals present**: `tests/e2e/language-switching.spec.ts`
  ("is fully keyboard-operable...") asserts `<html lang="en">` AND `aria-pressed="true"` on the
  active option after a keyboard-triggered switch — FR-010 requires both, not just one.
- **`aria-live` announcement**: `tests/integration/language-selector.test.tsx` confirms the
  switch-announcement text updates inside a `aria-live="polite"` region.
- **No component remount / focus preserved (FR-005)**: `tests/integration/language-context.test.tsx`
  proves a child's local `useState` survives a language switch (would reset to 0 if remounted);
  `tests/e2e/language-switching.spec.ts` confirms the lightbox stays open and the testimonials
  carousel keeps its position across a switch.
- **Fallback text lang-marking (FR-007)**: not implemented as per-element `lang` marking — see
  "Known gap" below.

### FR-014 (map/Street View accessible names)

`tests/integration/location-section.test.tsx` and the real-browser scan both confirm the map
iframe (`title="Mapa da localização da pousada"`/translated) and the Street View iframe
(`title="Visualização em nível de rua..."`/translated) have descriptive accessible names, and that
the coverage disclaimer is shown in place of an iframe when `streetViewEmbedUrl` is absent (never
an empty/untitled iframe).

### Component-level tests (jsdom)

**99/99 tests pass** (up from 93 in feature 003 + 6 new for `LocationSection`), 0 axe violations,
across every section, the new `LanguageSelector`, `LanguageContext`, and the WhatsApp/contact-form
builders in all 3 languages.

### End-to-end (real browser, chromium + mobile-chrome)

**60/60 pass**, including the two new specs added by this feature (`language-switching.spec.ts`,
and `location-map.spec.ts` extended for Google Maps).

### Known gap (documented, not fixed — see `checklists/accessibility.md` CHK010's resolution)

FR-007's fallback text is rendered via `localize()`, which returns a plain string with no
indication a fallback occurred, so a fallback segment is not wrapped with its own `lang` attribute
distinct from the page's current language. This is a defensive-only code path: `data-model.md`'s
validation rule requires all three languages to be filled in the approved content
(`pousada-content.ts`), and every string shipped in this feature satisfies that rule, so the
fallback never actually triggers with the current content. Tracked here rather than silently
dropped, consistent with `/speckit-analyze`'s U1 finding — worth a follow-up if/when content with
a genuinely missing translation is ever introduced.

### Not yet covered (explicit exception, same as the three prior features)

Real screen-reader software (NVDA/VoiceOver) was not run in this session; recommended before
public launch, alongside the same recommendation already tracked in
`specs/001-pousada-landing-page/validation/accessibility.md`.

## Outcome

**PASS** (SC-006 confirmed: 0 critical/serious violations across languages). One documented,
low-risk gap (FR-007 fallback lang-marking) carried forward as a defensive-code-path note, not a
regression or an active defect in shipped content.
