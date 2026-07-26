# Core Web Vitals Validation: Visualização de Fotos em Foco (Modal de Galeria)

**Date**: 2026-07-26
**Budget** (unchanged from the base feature): LCP ≤ 2.5 s, CLS ≤ 0.1, no regression vs.
`specs/001-pousada-landing-page/validation/performance.md`.

## Method

Same as the base feature: Lighthouse against a real, isolated production build
(`next build && next start`, run on a separate port to avoid interfering with any other server
already running locally), mobile emulation, both `devtools` (real throttling) and `simulate`
(default mobile profile) methods.

## Result: a real LCP regression, root-caused and partially fixed

| Metric | Budget | 001 baseline (simulate) | 002 before fix (devtools) | 002 after fix (devtools) | 002 after fix (simulate) |
|---|---|---|---|---|---|
| LCP | ≤ 2.5 s | 2.7 s (text) | 4.6 s | **3.2 s** | **3.2 s** |
| CLS | ≤ 0.1 | 0 | 0 | **0** | **0** |
| TBT | — | 155–190 ms | 480 ms | 490 ms | **80 ms** |
| FCP | — | 1.0–1.1 s | 3.7 s | 3.2 s | **1.2 s** |
| Performance score | — | 94–95 | 62 | 73 | **93** |

### Root cause

This is the exact risk flagged as a follow-up in the base feature's own validation: *"Re-run
this full validation once real photos are added, since image weight and dimensions are the
biggest realistic risk to this budget."* Between the two validation passes, real approved photos
were added for two rooms (`specs/001-pousada-landing-page`, and this feature's own T001–T004).
The LCP element **changed from the Hero heading text (no image existed) to the first room's cover
photo** — a real, decoded image now has to load and paint before LCP is recorded, where before
there was only text.

### Fix applied during this pass

The room's cover photo (`MediaGallery`) had no `priority` prop wired up anywhere, so `next/image`
defaulted it to `loading="lazy"` — a well-known anti-pattern for an above-the-fold, LCP-candidate
image. `RoomsSection` now passes `priority` to only the **first** room card
(`src/components/sections/RoomsSection.tsx`), which removes the lazy-loading delay and hints high
fetch priority for that one image. This recovered LCP from 4.6 s to 3.2 s under `devtools`
throttling (and dropped TBT back down to 80 ms under `simulate`, in line with the 001 baseline).

### Outcome: still over budget — flagged, not silently accepted

**LCP remains at 3.2 s in both throttling methods, above the 2.5 s budget.** Image format is
already optimal (`next/image` confirmed serving WebP at ~32 KiB for the LCP photo — verified via
response headers), and CLS is unaffected (still 0). The remaining gap is intrinsic to now loading
a real, sizeable photo before first meaningful paint, which a purely code-level fix cannot fully
close.

**This is a genuine, unresolved budget miss, not something I judged acceptable on my own
authority.** Per the constitution ("accessibility, SEO/performance and frontend QA MUST be
completed with recorded evidence **or a documented exception approved by the project owner**"),
this needs one of:

1. **Reduce source photo weight further** before/at upload (e.g., resize to the actual maximum
   display width needed, ~1200px, and re-compress) — likely the highest-leverage next step, since
   the current source files were uploaded at their original camera/export size.
2. **Accept a time-bounded exception** for the current 2 photographed rooms, with a firm
   commitment to re-measure once all approved photos are in place project-wide (rooms, wedding,
   events), since the budget was set before any real content existed.

Both CLS (0) and accessibility (see `validation/accessibility.md`) are unaffected and pass
cleanly — this finding is scoped specifically to LCP timing from real image weight.
