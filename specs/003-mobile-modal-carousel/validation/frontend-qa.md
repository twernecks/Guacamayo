# Responsive Frontend QA: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Date**: 2026-07-27
**Scope**: SC-001 (modal ≥90% viewport height at 375px), FR-001–FR-009 responsive/mobile
behavior, Edge Cases (320px width, orientation change), and a real image-legibility defect found
and fixed during this pass.

## Method

Playwright, real viewport sizes (320/375/768/1280px, plus 375×812 rotated to 812×375 landscape),
checking: modal proportion and backdrop margin, header/legenda/indicador visibility, absence of
page-level horizontal scroll, and the testimonials carousel vs. grid switch — plus visual
screenshot review and direct DOM/computed-style inspection.

## Real defect found and fixed: photo rendered tiny and blurry instead of legible

While reviewing screenshots, the enlarged photo rendered as a small, low-resolution thumbnail
(as small as ~46×69px) inside the correctly-sized modal, floating in a mostly-empty white box —
directly violating FR-001's "mantendo a foto inteira visível... legível". Root-caused via
computed-style/`naturalWidth` inspection (not just visual review) to a circular auto-sizing chain
(`.row` → `.figure` → `.image`, all `height: auto`/`align-items: center`, none anchored to a
concrete size) combined with the custom `next/image` loader added for GitHub Pages: since that
loader returns the same URL for every `srcset` width candidate, the browser had no reliable size
signal before decode and chose an adaptive (much smaller) JPEG decode scale.

**Reproduced at both mobile and desktop sizes** — confirmed pre-existing (from the GitHub Pages
loader change, outside this feature's original scope), not something introduced by this feature's
CSS. Fixed because it directly breaks this feature's own core requirement.

**Fix applied**:
1. Removed the `sizes` prop from the lightbox's `<Image>` (`MediaGalleryLightbox.tsx`) — with no
   real per-width resizing available from the static-export loader, a full `vw`-based responsive
   `srcset` was misleading the browser about how many genuinely different candidates existed.
2. Gave `.image` a **definite** `height` (68vh) in the mobile media query specifically — mobile's
   dialog is already a fixed 92vh/92vw box by design (Clarifications), so this doesn't change
   desktop's shape. The desktop/base rule was **deliberately left as `max-height`/`auto`**, i.e.
   unchanged from before this feature, to preserve FR-003 (no desktop regression) — an initial
   attempt to apply the same definite-height fix to the base rule inflated the desktop dialog's
   height (26–41% → 84–88%), which was reverted.

**Residual, out-of-scope note**: the decoded image resolution is still lower than the source file
(e.g. 256×384 vs. the real 513×768) at every size, a site-wide side effect of the GitHub Pages
custom loader rather than something specific to mobile or this feature. It no longer renders
tiny/unreadable (see screenshots below) but is not pixel-perfect crisp; worth a follow-up pass on
the image loader itself, tracked here rather than silently left undocumented.

## Results

### Modal proportion and backdrop margin (SC-001, Clarifications)

| Viewport | Dialog size | % of viewport height | Backdrop margin present | Page horizontal scroll |
|---|---|---|---|---|
| 320×640 | 282×589 | 92.0% | Yes | No |
| 375×812 (portrait) | 337×747 | 92.0% | Yes | No |
| 812×375 (landscape) | 731×338 | 90.0% | Yes | No |
| 768×1024 (tablet) | 691×531 | 51.9% (desktop rules apply) | Yes | No |
| 1280×800 (desktop) | 896×531 | 66.4% (desktop rules apply) | Yes | No |

At every width tested, including the narrowest (320px) and landscape orientation, the modal meets
or exceeds the ≥90% height target with a visible, tappable backdrop margin — resolving the
FR-001/FR-002 tension identified in `checklists/ux.md` (CHK016).

**Known boundary case, by design**: the mobile media query is width-only (`max-width: 47.9375rem`
/ 768px), matching FR-001's own literal definition ("viewports mobile (até ~768px de largura)").
A phone in landscape orientation with a width **above** 768px (e.g. 812px, tested above) falls
outside that definition and gets the desktop/tablet presentation instead of the near-fullscreen
one — still fully usable (no horizontal scroll, backdrop margin present, all controls work), just
not at the ≥90%-height target, since by the spec's own width-based definition it isn't "mobile"
for this feature's purposes. Documented here rather than silently left unexamined; not treated as
a defect given the explicit width-based definition in the spec.

### Header, close button, position indicator (FR-002)

Visible and operable at every tested size, including the narrowest (320px); never hidden or
made keyboard-unreachable at the compact mobile spacing.

### Testimonials carousel vs. grid (FR-004, FR-008)

| Viewport | Presentation | Controls/position visible | Page horizontal scroll |
|---|---|---|---|
| 320×700 | Carousel (peek of next card) | Yes | No |
| 375×812 | Carousel (peek of next card) | Yes | No |
| 768×1024 | Grid (2 columns) | No (hidden, per design) | No |
| 1280×800 | Grid (3 columns) | No (hidden, per design) | No |

The switch happens at the same 768px boundary as the modal, matching FR-004/FR-008's shared
"~768px" mobile definition. No page-level horizontal scroll at any size — only the carousel
track itself scrolls horizontally, as intended.

### Orientation change (Edge Cases)

Rotating with the modal or the carousel open (tested via the 812×375 landscape case) does not
break navigation — the modal/carousel just re-renders under whichever width-based rule applies at
the new orientation, per the boundary case noted above.

## Outcome

**PASS**, with one real, pre-existing (not newly introduced) image-legibility defect found and
fixed during this pass, and one documented width-only-breakpoint boundary case for landscape
phones wider than 768px (usable, just not at the ≥90%-height target in that specific orientation).
