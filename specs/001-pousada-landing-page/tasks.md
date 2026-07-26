# Tasks: Landing Page da Pousada

**Input**: Design documents from `specs/001-pousada-landing-page/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/contact-intent.md`, `contracts/content-repository.md`, `quickstart.md`

**Tests**: Tests are required for critical interactions, conversion flows and accessibility
risks according to the constitution and implementation plan.

**Organization**: Tasks are grouped by user story so each journey can be implemented and
validated independently after the shared foundation is complete.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it affects different files with no incomplete dependency.
- **[Story]**: Maps the task to a user story in `spec.md`.
- Every task includes an exact file path.

## Phase 1: Setup

**Purpose**: Initialize the frontend project and its validation tooling.

- [X] T001 Initialize the Next.js App Router project with TypeScript in `package.json` and `src/app/`
- [X] T002 [P] Configure strict TypeScript, ESLint and formatting in `tsconfig.json`, `eslint.config.mjs` and `.prettierrc.json`
- [X] T003 [P] Configure unit and component testing in `vitest.config.ts` and `tests/setup.ts`
- [X] T004 [P] Configure end-to-end testing in `playwright.config.ts` and `tests/e2e/`
- [X] T005 [P] Create the approved local-asset structure and usage guidance in `public/images/pousada/.gitkeep` and `public/images/pousada/README.md`

---

## Phase 2: Foundational

**Purpose**: Establish shared domain contracts, visual system and conversion primitives.

**⚠️ CRITICAL**: Complete this phase before starting user-story work.

- [X] T006 Create shared content, media, location and testimonial types in `src/domain/content.ts`
- [X] T007 Create contact-intent types and field-validation rules in `src/domain/contact-intent.ts`
- [X] T008 Create approved placeholder content matching the content repository contract in `src/data/pousada-content.ts`
- [X] T009 Implement the asynchronous local content repository with loading, error and empty-state support in `src/services/content-repository.ts`
- [X] T010 Implement WhatsApp message composition and safe URL generation in `src/lib/whatsapp.ts`
- [X] T011 Define global design tokens, mobile-first base styles, focus states and font loading in `src/app/globals.css` and `src/app/layout.tsx`
- [X] T012 [P] Implement reusable semantic heading, button and container primitives in `src/components/ui/`
- [X] T013 [P] Implement responsive header, navigation and footer with contextual contact actions in `src/components/ui/SiteHeader.tsx` and `src/components/ui/SiteFooter.tsx`
- [X] T014 Implement the reusable contact form with name, phone, service/event type, message, validation and focus handling in `src/components/contact/ContactForm.tsx`
- [X] T015 Implement the reusable WhatsApp contact CTA and fallback contact display in `src/components/contact/WhatsAppContact.tsx`
- [X] T016 [P] Create unit tests for content repository states in `tests/unit/content-repository.test.ts`
- [X] T017 Create unit tests for contact validation and WhatsApp message generation in `tests/unit/contact-intent.test.ts`

**Checkpoint**: Shared content, visual and contact foundations are ready; no data is persisted
or sent to a remote service.

---

## Phase 3: User Story 1 - Conhecer a pousada e seus quartos (Priority: P1) 🎯 MVP

**Goal**: Present the pousada, its rooms, amenities and location so a potential guest can
understand the offer and contact the business.

**Independent Test**: In a fresh visit, a guest can identify the value proposition, inspect
rooms and amenities, use a contextual contact action, and access location details on mobile.

### Tests for User Story 1

- [X] T018 [P] [US1] Create component tests for hero, room cards and amenity content in `tests/integration/rooms-section.test.tsx`
- [X] T019 [P] [US1] Create end-to-end mobile navigation and room-discovery coverage in `tests/e2e/guest-discovery.spec.ts`
- [X] T020 [P] [US1] Create keyboard and consent-gated map coverage in `tests/e2e/location-map.spec.ts`

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement the value-proposition hero with contextual stay contact action in `src/components/sections/HeroSection.tsx`
- [X] T022 [P] [US1] Implement accessible room cards, amenities and responsive room gallery in `src/components/sections/RoomsSection.tsx`
- [X] T023 [US1] Implement the location section with textual address, privacy notice, explicit "Carregar mapa" action and fallback link in `src/components/sections/LocationSection.tsx`
- [X] T024 [US1] Compose the public route with repository loading, error and empty states in `src/app/page.tsx`

**Checkpoint**: A guest can independently discover rooms, inspect the location and start a
contact journey without loading map resources before consent.

---

## Phase 4: User Story 2 - Planejar um casamento na pousada (Priority: P1)

**Goal**: Make the wedding offer the strongest conversion path while preserving the refined,
natural and romantic visual direction.

**Independent Test**: A couple can find the highlighted wedding offer, explore its gallery
and open a correctly contextualized WhatsApp request or short contact form.

### Tests for User Story 2

- [X] T025 [P] [US2] Create component tests for wedding emphasis and CTA context in `tests/integration/wedding-section.test.tsx`
- [X] T026 [P] [US2] Create end-to-end wedding WhatsApp and form conversion coverage in `tests/e2e/wedding-conversion.spec.ts`

### Implementation for User Story 2

- [X] T027 [US2] Add approved wedding experience content and media metadata in `src/data/pousada-content.ts`
- [X] T028 [US2] Implement the featured wedding narrative, gallery and conversion CTAs in `src/components/sections/WeddingSection.tsx`
- [X] T029 [US2] Integrate wedding-specific preselection with the contact form and WhatsApp CTA in `src/components/contact/ContactForm.tsx` and `src/components/contact/WhatsAppContact.tsx`

**Checkpoint**: A couple can independently complete the primary conversion journey with
the `wedding` service/event type preselected.

---

## Phase 5: User Story 3 - Avaliar o espaço para outros eventos (Priority: P2)

**Goal**: Explain the event-space offering without competing with wedding prominence.

**Independent Test**: An organizer can identify supported event use, inspect its imagery and
start a contact journey preselected for other events.

### Tests for User Story 3

- [X] T030 [P] [US3] Create component tests for event-space content and distinct CTA context in `tests/integration/events-section.test.tsx`
- [X] T031 [P] [US3] Create end-to-end event inquiry coverage in `tests/e2e/event-inquiry.spec.ts`

### Implementation for User Story 3

- [X] T032 [US3] Add approved non-wedding event-space content and media metadata in `src/data/pousada-content.ts`
- [X] T033 [US3] Implement the event-space section and event-context contact actions in `src/components/sections/EventsSection.tsx`

**Checkpoint**: An organizer can independently distinguish other events from weddings and
start the relevant contact flow.

---

## Phase 6: User Story 4 - Construir confiança por relatos (Priority: P2)

**Goal**: Display approved, contextualized testimonials as trustworthy proof without public
submission or moderation features.

**Independent Test**: A visitor can read attributed testimonials with an experience type;
if none exist, the page remains truthful and usable.

### Tests for User Story 4

- [X] T034 [P] [US4] Create component tests for testimonial attribution, context and empty state in `tests/integration/testimonials-section.test.tsx`

### Implementation for User Story 4

- [X] T035 [US4] Add only approved testimonial records and their experience context in `src/data/pousada-content.ts`
- [X] T036 [US4] Implement testimonials and its no-testimonials fallback in `src/components/sections/TestimonialsSection.tsx`

**Checkpoint**: Visitors can independently evaluate proof of experience without encountering
invented or unattributed reviews.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Complete public-page quality gates across all stories.

- [X] T037 [P] Add route metadata, Open Graph data, semantic landmarks and sitemap support in `src/app/layout.tsx`, `src/app/page.tsx` and `src/app/sitemap.ts`
- [X] T038 [P] Optimize image loading, dimensions, priorities and failure fallbacks in `src/components/sections/`
- [X] T039 [P] Add automated accessibility coverage for primary sections and form errors in `tests/integration/accessibility.test.tsx`
- [X] T040 Run manual WCAG 2.2 AA keyboard, focus, contrast, zoom and screen-reader checks and record evidence in `specs/001-pousada-landing-page/validation/accessibility.md`
- [X] T041 Run responsive frontend QA for mobile, tablet and desktop and record outcomes in `specs/001-pousada-landing-page/validation/frontend-qa.md`
- [X] T042 Measure Core Web Vitals against the plan budget and record results in `specs/001-pousada-landing-page/validation/performance.md`
- [X] T043 Validate SEO metadata, indexability, URL output and social preview and record evidence in `specs/001-pousada-landing-page/validation/seo.md`
- [X] T044 Run the complete lint, type, unit, integration and end-to-end suites documented in `specs/001-pousada-landing-page/quickstart.md`

---

## Phase 8: Content Updates (Amendments after initial delivery)

**Purpose**: Incorporate business-approved room and wedding-venue photos, confirm the
property address for the map, and standardize shared amenities across all rooms.

- [X] T045 Add business-approved photos for all 7 rooms (replacing the 4 remaining
  placeholder rooms) and standardize room names/galleries in
  `src/data/pousada-content.ts`, matching assets already in
  `public/images/pousada/quartos/`
- [X] T046 Add business-approved example photos of the wedding venue/grounds to the
  casamentos gallery in `src/data/pousada-content.ts`
- [X] T047 Update the property address to "BR-101 - Km 570, Paraty, CEP 23970-000"
  and the map location (embed + fallback) in `src/data/pousada-content.ts`
- [X] T048 Add shared amenities ("Café da manhã incluso", "Acesso à piscina") to
  every room in `src/data/pousada-content.ts`

**Checkpoint**: Every room shows real photos and the standardized breakfast/pool
amenities; the location section points at the confirmed address.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Has no dependencies.
- **Foundational (Phase 2)**: Depends on setup and blocks all user stories.
- **US1 and US2 (P1)**: Start after foundational work. US2 is independent of US1 except for
  shared route composition in `src/app/page.tsx`; integrate that route change serially.
- **US3 and US4 (P2)**: Start after foundational work; each can proceed independently.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1**: Requires T006–T017; its location section supplies shared public-page location.
- **US2**: Requires T006–T017; requires T024 before final route verification.
- **US3**: Requires T006–T017; requires T024 before final route verification.
- **US4**: Requires T006–T017; requires T024 before final route verification.

### Parallel Opportunities

- T002–T005 can run in parallel after T001.
- T012, T013 and T016 can run in parallel after T006–T011 as applicable.
- Test tasks marked `[P]` in each user story can be authored in parallel before their
  corresponding implementation work.
- US2, US3 and US4 sections can be built in parallel after the foundation, provided each
  change to `src/app/page.tsx` is coordinated.

## Parallel Example: User Story 2

```text
Task: "Create component tests for wedding emphasis and CTA context in tests/integration/wedding-section.test.tsx"
Task: "Create end-to-end wedding WhatsApp and form conversion coverage in tests/e2e/wedding-conversion.spec.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Complete US1 and US2, both P1 journeys.
3. Validate guest discovery and wedding conversion independently.
4. Demo the landing page with approved content before adding P2 sections.

### Incremental Delivery

1. Deliver rooms, location and wedding conversion (US1 + US2).
2. Add the broader event-space offer (US3).
3. Add curated testimonials (US4).
4. Complete cross-cutting validation before public delivery.

## Pending Before Public Launch (Not Implementation Tasks)

All tasks above (T001–T048) are complete against placeholder content. The
items below are **not code work** — they need business input, real assets,
or a human pass — and are tracked here so they are not lost. Each links to
the validation doc with full detail.

- [X] **Real approved content**: room descriptions (all 7 rooms), wedding
  and event narratives, and hero copy are filled in with business-approved
  text in `src/data/pousada-content.ts` and
  `src/components/sections/HeroSection.tsx`. *(Owner: business)*
- [X] **Real approved photos**: **7 of 7 rooms done**, all with real names
  and galleries in `public/images/pousada/quartos/`, referenced from
  `src/data/pousada-content.ts`. Wedding venue/grounds also has 6 approved
  example photos. Still pending: photos for non-wedding events. *(Owner:
  business)*
- [X] **Real contact info**: WhatsApp number confirmed in
  `src/data/pousada-content.ts` (address confirmed too — see below). Phone
  and email are optional fields on `ContactChannels` and remain unset; add
  them if/when the business wants those channels shown. *(Owner: business)*
- [~] **Real location**: address confirmed as "BR-101 - Km 570, Paraty, CEP
  23970-000" in `src/data/pousada-content.ts`; the map embed/fallback are
  centered on the CEP's geocoded area as an approximation. Still pending: an
  exact GPS pin for the BR-101 Km 570 marker, confirmed by the business.
  *(Owner: business)*
- [X] **Real testimonials**: all 3 supplied quotes are approved and
  attributed (Camila Andrade, Helena Werneck, João Paulo). *(Owner:
  business)*
- [ ] **Production domain**: set `NEXT_PUBLIC_SITE_URL` (or update the
  fallback in `src/lib/site.ts`) once the real domain is chosen — fixes
  sitemap, canonical and Open Graph URLs. *(Owner: business + dev, depends
  on hosting decision)*
- [ ] **Social preview image (`og:image`)**: needs an approved logo/photo,
  1200×630 — see `validation/seo.md`. *(Owner: business)*
- [ ] **Human screen-reader pass** (NVDA/VoiceOver) before launch, and
  again after real content/photos land — see `validation/accessibility.md`.
  *(Owner: QA/dev)*
- [ ] **Re-run performance validation** once real photos are added (image
  weight and CLS are the main risk to the LCP/CLS budget) — see
  `validation/performance.md`. *(Owner: dev)*
- [ ] **Re-run Lighthouse/PageSpeed Insights against the real deployed
  domain** — current numbers are from `localhost` and known to be an
  imperfect stand-in — see `validation/performance.md`. *(Owner: dev)*
- [ ] **Choose a hosting/deploy target** — nothing is deployed yet; this
  blocks the domain and real-device performance items above.
  *(Owner: business + dev)*
