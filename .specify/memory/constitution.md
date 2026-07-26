<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: none; initial constitution created.
- Added sections: Architecture and Technology; Delivery Workflow and Quality Gates.
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md
  ✅ .specify/templates/spec-template.md
  ✅ .specify/templates/tasks-template.md
  ✅ .specify/templates/commands/ (directory does not exist; no command templates to update)
  ✅ AGENTS.md (no principle-specific change required)
- Follow-up TODOs: none.
-->

# Guacamayo Constitution

## Core Principles

### I. React Components with Clear Boundaries

The frontend MUST use React with strict TypeScript. Pages and sections MUST compose
small, domain-oriented, reusable and accessible components. Presentation, page/section
composition, hooks, typed services and types MUST be separated by responsibility.
Components MUST NOT own unrelated business logic or grow without a documented reason.
This preserves readability and permits future product capabilities without rewriting the UI.

### II. Local State and Replaceable Data Sources

State MUST remain local unless shared state has a documented consumer, lifetime and
reason that local composition cannot satisfy. Static data MUST be typed and accessed
through a service or repository boundary when it represents information expected to
come from an API. Async integrations MUST expose consistent loading, error and empty
states. This phase MUST NOT implement a backend, authentication or business rules
outside the frontend; the boundary exists to enable them later, not to anticipate them.

### III. Accessible, Mobile-First Conversion Experience

Public experiences MUST be mobile-first, responsive and meet WCAG 2.2 AA criteria
applicable to their scope. Every page MUST provide semantic structure, keyboard access,
visible focus, sufficient contrast and useful text alternatives. The primary conversion
path—reservation, WhatsApp, form or another approved contact channel—MUST be clear,
operable and tested. Images MUST serve a content purpose, include contextual alt text
and be optimized. The interface MUST communicate hospitality and trust without reducing
clarity, accessibility or speed.

### IV. Measurable Quality, SEO and Performance

Strict TypeScript, linting and automatic formatting MUST be configured. Tests MUST be
proportional to risk and cover critical logic, interactive components and conversion
flows. Public pages MUST have semantic HTML, unique metadata, indexable content and
friendly URLs. Each feature plan MUST state a performance budget and Core Web Vitals
targets; unnecessary dependencies, render-blocking work and oversized assets MUST be
removed or justified. Analytics and monitoring integration points MUST respect privacy,
consent and the minimum data required.

### V. Evolution Without Premature Backend Complexity

Presentation, domain concepts and external integrations MUST have explicit boundaries.
New data contracts MUST be typed and designed so APIs, authentication, payments,
reservations and administration can be added without a UI rewrite. Teams MUST choose
the simplest architecture satisfying the current feature and MUST document any added
complexity. This prevents speculative backend design while keeping the SaaS path open.

## Architecture and Technology

React and TypeScript are mandatory. The initial application MUST use Next.js with the
App Router and static rendering wherever content permits. This is the selected React
framework because its production-grade metadata, image optimization and static rendering
directly support a discoverable, fast landing page, while its routing and rendering model
can accommodate future application surfaces. Next.js MUST NOT be used as a pretext to
implement the deferred backend in this phase.

The source layout MUST distinguish page/section composition, reusable UI, hooks, typed
domain data and external services. Global client state, a dependency, a rendering mode
that harms indexability, or an external integration requires a documented justification
in the feature plan. Technology choices MUST be stable, actively maintained and selected
for an identified requirement rather than novelty.

## Delivery Workflow and Quality Gates

Specifications MUST identify the conversion path, responsive behavior, content facts,
accessibility implications, image sources and measurable performance outcomes. Plans
MUST pass the Constitution Check before research and after design. Tasks MUST include
the required verification work rather than deferring it to an unspecified final review.

Before delivery of a public page, accessibility, SEO/performance and frontend QA MUST
be completed with recorded evidence or a documented exception approved by the project
owner. For material UI work, teams MUST apply React frontend, UX/UI and conversion
content capabilities as relevant to the scope. The constitution defines quality outcomes;
it MUST NOT duplicate the operating instructions of individual skills. Generic skills
may be reused globally. Skills that encode this product's domain, brand, APIs or business
rules MUST be versioned with the repository.

MCPs and other external integrations MUST be introduced only for a concrete need, with
authorization/credentials, privacy assessment and an accountable owner. Reviews MUST
assess accessibility, responsiveness, performance, basic security and maintainability.

## Governance

This constitution supersedes conflicting project guidance. A change MUST be proposed in
writing, reviewed for its impact on existing plans, specifications, tasks and templates,
and recorded with the required semantic version bump: MAJOR for incompatible principle
changes or removals, MINOR for new or materially expanded requirements, and PATCH for
clarifications that preserve meaning. Every plan and implementation review MUST verify
compliance or record an approved, time-bounded exception.

The project owner approves amendments. The amendment author MUST update the Sync Impact
Report and all affected templates in the same change. Compliance is reviewed at feature
planning, before implementation, and before public-page delivery.

**Version**: 1.0.0 | **Ratified**: 2026-07-22 | **Last Amended**: 2026-07-22
