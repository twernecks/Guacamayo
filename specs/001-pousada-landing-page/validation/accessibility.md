# Accessibility Validation: Landing Page da Pousada

**Date**: 2026-07-25
**Scope**: WCAG 2.2 AA, per the plan's accessibility constraint and constitution
principle III (Accessible, Mobile-First Conversion Experience).

## Method

Given no real business-approved photos/testimonials exist yet (see
`src/data/pousada-content.ts`), this pass validates the current placeholder build.
It combines:

1. **Automated axe-core scan** against the real rendered page in Chromium
   (`@axe-core/playwright`), tagged `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`.
2. **Automated component-level axe scans** in `tests/integration/accessibility.test.tsx`
   (jsdom, `jest-axe`), covering every primary section and both the default and
   validation-error states of the contact form. Color-contrast is disabled in that
   suite because jsdom cannot compute real rendered color/layout; contrast is
   verified by the real-browser scan instead (see below).
3. **Scripted keyboard walkthrough** (Playwright) recording focus order and each
   focused element's computed `outline` style.
4. **200% zoom / reflow check** at a common desktop viewport (1280×720), reusing
   the same "no horizontal scroll" technique as the mobile e2e coverage.

## Results

### Automated axe scan (real browser)

- **Initial run**: 1 violation — `color-contrast` (serious), on the "photo
  pending" fallback text in `MediaGallery` (`#6b6058` on `#e4dcd0` = 4.49:1,
  just under the 4.5:1 AA threshold for normal text). Affected every section
  using the empty-gallery fallback (Rooms, Wedding, Events).
- **Fix applied**: `src/components/sections/MediaGallery.module.css` — fallback
  text color changed from `var(--color-muted)` to `var(--color-foreground)`.
- **Re-run after fix**: **0 violations** across `wcag2a/2aa/21a/21aa/22aa`.

### Component-level axe scans (jsdom)

**47/47 tests pass**, 0 violations, across: `HeroSection`, `RoomsSection`
(populated and empty), `WeddingSection`, `EventsSection`,
`TestimonialsSection` (populated and empty), `LocationSection` (before and
after loading the map), `SiteHeader`, `SiteFooter`, and `ContactForm`
(default and post-validation-error states).

### Keyboard walkthrough

Tab order from page load is logical and matches visual/DOM order: skip link →
brand → nav links (Quartos, Casamentos, Eventos, Relatos, Localização) →
header WhatsApp CTA → Hero WhatsApp CTA → Wedding WhatsApp CTA → Wedding
contact form fields. Every focused element showed a **visible focus
indicator** (`outline-style: solid`, `3px`, from the global
`:focus-visible` rule) — no element relied on browser-default or invisible
focus styling.

A **skip-to-content link** ("Pular para o conteúdo principal") was added as
the first focusable element, found missing during this pass — it now targets
`#conteudo-principal` on `<main>`, satisfying WCAG 2.4.1 (Bypass Blocks).

### Zoom / reflow

At 1280×720 with root font-size scaled to ~200% (16px → 32px), the page
reflows with **no horizontal scrollbar** — content remains readable and
operable, consistent with FR-007 and SC-003.

### Not yet covered (explicit exception)

- **Real screen-reader software** (NVDA/VoiceOver/TalkBack) was not run in
  this session — axe-core and the keyboard pass catch structural/ARIA and
  focus issues, but not all screen-reader-specific behavior. A human
  screen-reader pass is recommended before public launch, and **must** be
  repeated once real photos, testimonials and business copy replace the
  current placeholders (new content = new alt text, new copy length, new
  layout weight to re-check).

## Outcome

**PASS** for the current placeholder build, with the one identified
contrast issue fixed during this pass. Documented exception: final
human screen-reader verification is deferred to a pre-launch review with
real content, per the constitution's allowance for a documented, approved
exception.
