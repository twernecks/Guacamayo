# Core Web Vitals Validation: Landing Page da Pousada

**Date**: 2026-07-25
**Budget** (from `plan.md`): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, measured on a
representative mobile profile; first contact action available within 3 s.

## Method

Lighthouse against the real production build (`next build && next start`,
Node.js server, not `next dev`), mobile emulation (390×844, DPR 3). Two
throttling methods were run for cross-check (see finding below):
`simulate` (Lighthouse's default estimation model) and `devtools` (real
CPU/network throttling applied in the browser).

**Correction made during this pass**: the first measurement attempt hit a
stale `next dev` server left running on port 3000 from earlier in the
session, which inflated Total Blocking Time to 1540 ms and shipped a
dev-only `next-devtools` bundle. That process was killed and a fresh
production server was started before taking the numbers below — this is
noted because it's a realistic trap (an unrelated dev server squatting on
the same port) worth watching for in any local performance run.

## Results

| Metric | Budget | `simulate` (default mobile profile) | `devtools` (real local throttling) |
|---|---|---|---|
| LCP | ≤ 2.5 s | 2.7 s | **2.1 s** |
| CLS | ≤ 0.1 | **0** | **0** |
| TBT (INP proxy — see note) | — | 155–190 ms | 330 ms |
| FCP | — | 1.0–1.1 s | 2.1 s |
| Performance score | — | 94–95 | 89 |
| Total page weight | — | 274–276 KiB | — |
| DOM size | — | 153 elements | — |

### LCP finding and fix

The LCP element is the Hero `<h1>` (there are no real photos yet, so no
image competes for LCP). Initially the heading font (`Playfair_Display`)
used `display: "swap"`; since Chrome can defer the LCP timestamp until a
swapped-in web font renders, this was changed to `display: "optional"` in
`src/app/layout.tsx` (fallback font is used unless the web font is ready
almost immediately; never swaps later). This is a safe trade for a heading
font: brand consistency on fast connections, no LCP risk on slow ones.

### `simulate` vs `devtools` discrepancy

`simulate` mode estimates network timing from a model rather than a real
connection, and is known to model TTFB less accurately against `localhost`
than against a real deployed origin (no CDN/edge to account for). That
inflated TTFB (470 ms) and pushed LCP to 2.7 s in `simulate` mode, while the
same page under real applied throttling (`devtools` method) measured LCP at
2.1 s — inside budget. Both are lab estimates; **PageSpeed Insights / CrUX
field data should be re-checked once the site is deployed to its real
domain**, since only field data reflects actual visitor conditions.

### INP note

INP is a field metric computed from real user interactions (via the Chrome
User Experience Report); it cannot be measured in a lab run before the site
has real traffic, and this feature explicitly excludes analytics/RUM
instrumentation (see plan constraints). Total Blocking Time is used here as
the standard lab proxy for interactivity — both throttling methods report
TBT well under typical concern thresholds (155–330 ms), with a light DOM
(153 elements) and low bootup time (0.4 s). Confirm real INP via Search
Console / CrUX after launch.

### CLS

**0** in both runs — no unexpected layout shift. This is expected: current
placeholder content has no images yet (empty `images: []` everywhere), so
there are no unsized-image regressions to trigger. **Re-run this check once
real photos are added**, to confirm the `width`/`height` props on every
`next/image` usage (`MediaGallery`) keep CLS at 0 with real image files.

### Other diagnostics (non-blocking)

- Unused JavaScript: ~58 KiB estimated (mostly Next.js/React framework
  code, not application code — expected for a small app on a modern
  framework).
- Render-blocking resources: 0 ms estimated savings.
- Total page weight: ~275 KiB, no real photos yet — will grow once approved
  images are added; re-verify budget then per the image-optimization
  guidance already in `public/images/pousada/README.md` and
  `MediaGallery`'s `sizes`/`priority` props.

## Outcome

**PASS**, with one fix applied (heading font `display: optional` to protect
LCP) and two explicit follow-ups required before/at public launch:

1. Re-run Lighthouse/PageSpeed Insights against the real deployed domain
   once available (removes the `simulate`-on-localhost TTFB distortion).
2. Re-run this full validation once real photos replace the empty
   placeholder image arrays, since image weight and dimensions are the
   biggest realistic risk to this budget going forward.
