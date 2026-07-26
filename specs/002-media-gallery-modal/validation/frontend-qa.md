# Responsive Frontend QA: Visualização de Fotos em Foco (Modal de Galeria)

**Date**: 2026-07-26
**Scope**: FR-010 (no horizontal scroll with the view open), CHK010 (click-outside ambiguity on
full-screen mobile), and general visual review of the new cover-photo + lightbox presentation.

## Method

Playwright, mobile/tablet/desktop viewports (375/768/1280), checking: cover photo + count badge
render, no horizontal scroll while the focused view is open, click-outside-to-close works at every
size, plus visual screenshot review.

## Results

| Viewport | Cover + badge visible | Horizontal scroll with dialog open | Click-outside closes |
|---|---|---|---|
| Mobile (375px) | Yes | No | Yes |
| Tablet (768px) | Yes | No | Yes |
| Desktop (1280px) | Yes | No | Yes |

## Visual review

- **Mobile (375px)**: The dialog is centered with visible backdrop margin on every side (roughly
  19px on the sides, more above/below) — resolving the CHK010 concern raised in
  `checklists/review.md` about "click outside" being ambiguous on a full-screen mobile layout.
  The dialog does **not** actually go edge-to-edge, so a clear backdrop region always remains
  clickable. Close/nav controls and the position indicator are all visible without scrolling
  inside the dialog.
- **Desktop (1280px)**: The dialog is centered, comfortably sized (`min(90vw, 56rem)`), with the
  photo displayed at a large, legible size and the rest of the page dimmed and visually
  de-emphasized behind it.
- **Cover photo + badge**: The "+1" count indicator renders correctly on the room with two
  photos, positioned over the bottom-right corner of the cover image, legible against the photo.

## Outcome

**PASS.** No horizontal scroll at any breakpoint, click-outside works reliably at every size
including the narrowest mobile width, and the visual presentation matches the intent of the
feature request (a clear, enlarged view replacing the old horizontal-scroll strip).
