# SEO Validation: Landing Page da Pousada

**Date**: 2026-07-25
**Scope**: FR-009, and the plan's "SEO and metadata" quality requirement —
title/description, indexable content, friendly URLs, consistent business
information, social preview.

## Method

Direct inspection of the served HTML/`sitemap.xml`/`robots.txt` from the
real production build (`next build && next start`), plus a Lighthouse SEO
category audit against the same server.

## Results

### Lighthouse SEO category

**100/100**, 0 failing audits.

### Title and description

- `<title>`: "Pousada — Hospedagem, Casamentos e Eventos" — present, unique
  (single-page site), descriptive.
- `<meta name="description">`: present, mentions the three core offers
  (quartos, casamentos, eventos) and the WhatsApp contact channel.
- Both are still **placeholder marketing copy** pending business-approved
  wording (see `src/app/layout.tsx` and `src/data/pousada-content.ts`) —
  functionally correct and indexable now, but must be replaced with real
  copy before public launch.

### Indexability

- `<meta name="robots" content="index, follow">` present.
- `robots.txt` (`src/app/robots.ts`) serves `Allow: /` for all user agents
  and references the sitemap.
- `sitemap.xml` (`src/app/sitemap.ts`) lists the homepage with `lastmod`,
  `changefreq` and `priority`.
- The route is statically prerendered (`next build` reports `○ (Static)` for
  `/`), so content is available without client-side JavaScript — fully
  crawlable.

### URL and canonical

- `<link rel="canonical">` present, pointing at the site root.
- Single clean URL (`/`) for the whole experience; no query-string or
  duplicate-content routes.

### Open Graph / social preview

- `og:title`, `og:description`, `og:type`, `og:site_name`, `og:url`,
  `og:locale` are all present and consistent with the page title/description.
- **Gap (explicit, not fabricated)**: there is **no `og:image`**. No
  business-approved logo or hero photo exists yet to use as a social
  preview image (see `public/images/pousada/README.md` — only approved
  photos may be added). Adding a placeholder/stock image here would misrepresent
  the business on social shares, so it was intentionally left out rather
  than faked. **Follow-up**: add an `og:image` (ideally a real, approved hero
  photo or logo, sized 1200×630) once available.

### Heading structure

Single `<h1>` (Hero), followed by `<h2>` for every section (Quartos,
Casamentos, Eventos, Relatos, Localização, Fale conosco), with `<h3>` only
for individual room/event cards nested under their section's `<h2>`. No
skipped heading levels — this also directly supports the accessibility
pass (`accessibility.md`).

### Business information consistency

Contact info (WhatsApp number, address) is placeholder pending business
approval (see `src/data/pousada-content.ts`), but the **same** repository
values are used consistently across the header, footer, hero, wedding,
events and contact sections — no divergent phone numbers or addresses
anywhere on the page, so this will be consistent automatically once real
values are approved.

## Outcome

**PASS**, with two explicit, tracked follow-ups (not defects in the current
placeholder scope):

1. Replace placeholder title/description/OG copy and the placeholder
   `SITE_URL` (`src/lib/site.ts`) with business-approved, real-domain values
   before public launch.
2. Add a real, approved `og:image` once branded photography/logo exists.
