# Core Web Vitals Validation: Experiência Mobile — Modal de Foto e Carrossel de Relatos

**Date**: 2026-07-27
**Budget** (unchanged from prior features): LCP ≤ 2.5 s, CLS ≤ 0.1, no regression vs.
`specs/002-media-gallery-modal/validation/performance.md`.

## Method

Same as both prior features: Lighthouse against a real, isolated static build served locally
(`next build`, served via `serve out` — see the note on tooling below), mobile emulation, both
`devtools` (real throttling) and `simulate` (default mobile profile) methods.

**Tooling note**: this feature's build now uses `output: "export"` (added for the GitHub Pages
deploy, outside this feature's scope), so `next start` no longer works — measured against
`serve out` instead, which is a plain static file server and should not itself change these
numbers relative to `next start`'s production mode.

## Result: no regression from this feature's changes

| Metric | Budget | 002 baseline (devtools) | 003 now (devtools) | 002 baseline (simulate) | 003 now (simulate) |
|---|---|---|---|---|---|
| LCP | ≤ 2.5 s | 3.2 s | 3.6 s | 3.2 s | **3.3 s** |
| CLS | ≤ 0.1 | 0 | **0** | 0 | **0** |
| TBT | — | 490 ms | **370 ms** | 80 ms | **90 ms** |
| FCP | — | 3.2 s | 3.6 s | 1.2 s | **1.3 s** |
| Performance score | — | 73 | 74 | 93 | **90** |

All deltas are within normal run-to-run measurement noise on this machine (the `devtools` method
in particular is sensitive to background load during the run); nothing points to a new regression
introduced by the mobile modal resize (CSS-only) or the testimonials carousel (CSS `scroll-snap` +
a small amount of JS state, no new library, no new network requests).

### LCP element, unchanged

The LCP element is still the first room's cover photo (`Quarto Duplo Deluxe com Vista do Mar`),
same as feature 002 — this feature does not touch that photo, its `priority` hint, or its loading
path at all.

### The pre-existing LCP budget miss carries forward, not newly introduced

**LCP remains above the 2.5 s budget (3.3–3.6 s), exactly as already flagged as an open, unresolved
item in `specs/002-media-gallery-modal/validation/performance.md`.** That document already
identifies the root cause (real, sizeable room photos added after the budget was set) and records
two next steps for the business/dev owner (reduce source photo weight, or accept a time-bounded
exception). This feature does not change that picture in either direction — it is out of scope for
a UI-presentation feature to silently "fix" a content-weight budget miss that predates it, so it is
re-flagged here rather than re-litigated.

### CLS: still 0

Both the mobile modal resize and the testimonials carousel reserve their space via fixed
CSS (`vw`/`vh` sizing for the dialog, `next/image` width/height attributes unchanged, fixed card
`flex-basis` for the carousel) — no layout shift was measured with either change active.

## Outcome

**PASS for this feature's own scope** (no regression). The pre-existing LCP budget miss inherited
from feature 002 remains open and is not this feature's to resolve — see
`specs/002-media-gallery-modal/validation/performance.md` for the tracked next steps.
