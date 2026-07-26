# Responsive Frontend QA: Landing Page da Pousada

**Date**: 2026-07-25
**Scope**: FR-007, SC-003 — content, galleries and actions must remain usable
on small, medium and large screens, with no horizontal scroll or content loss.

## Method

Playwright against the production build (`next build && next start`),
checking each breakpoint for horizontal overflow and presence of every
section anchor, plus full-page screenshots for visual review.

## Viewports checked

| Viewport | Size | Horizontal scroll | All sections present |
|---|---|---|---|
| Smallest supported | 320×568 | No | — (menu-toggle check) |
| Mobile | 375×812 | No | Yes |
| Tablet | 768×1024 | No | Yes |
| Desktop | 1280×800 | No | Yes |
| Desktop wide | 1920×1080 | No | Yes |

Sections checked at each breakpoint: `#inicio`, `#quartos`, `#casamentos`,
`#eventos`, `#relatos`, `#localizacao`. All present at all breakpoints.

## Visual review (screenshots)

Full-page screenshots were captured for mobile, tablet, desktop and
desktop-wide and reviewed directly:

- **Mobile (375px)**: single-column layout, room cards stack, wedding CTAs
  (WhatsApp + form) stack under the narrative, footer contact info wraps
  cleanly. No overlapping text or cut-off controls.
- **Desktop (1280px)**: header nav shows inline (mobile toggle hidden),
  Rooms renders as a 2-column grid, Wedding section uses the two-column
  layout (narrative + gallery), Events as a 2-column grid, Testimonials
  empty-state message reads clearly, Location card keeps its fixed max-width
  card of address/consent/CTA — no stretched or empty full-width sections.

## Mobile menu at the smallest supported width (320px)

Menu is collapsed by default, opens on toggle, no horizontal scroll
introduced while open. Matches `tests/e2e/guest-discovery.spec.ts` coverage,
extended here to the narrowest common device width.

## Correction made during this pass

The first screenshot round showed a floating "N" badge and was taken while
a stale `next dev` server (left running on port 3000 from earlier in the
session) was unintentionally answering requests instead of the intended
production build — the badge was Next.js's dev-mode indicator, not
something that appears in real production. That process was killed and
all screenshots referenced below were re-captured against a freshly built
`next start` server (confirmed clean: no dev-only bundle referenced in the
served HTML). Same trap as noted in `performance.md` — worth checking
`netstat`/process list before trusting any local perf or visual QA run.

## Outcome

**PASS.** No horizontal scroll or missing content at any checked breakpoint
from 320px through 1920px. Re-run this pass once real photos are added,
since real image aspect ratios/dimensions may shift card heights.
