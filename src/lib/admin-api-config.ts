/**
 * Base URL for the Guacamayo API (admin backend). Resolved at build time
 * (`NEXT_PUBLIC_*` vars are inlined into the static export — see
 * next.config.ts `output: "export"`), with a local-dev fallback so the admin
 * area works out of the box against the API running on the developer's
 * machine (research.md Decision 9).
 */
export const ADMIN_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5249";
