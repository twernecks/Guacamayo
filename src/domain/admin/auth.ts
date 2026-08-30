/**
 * Admin session state, as returned by `POST /api/auth/login` and
 * `POST /api/auth/refresh` (contracts/auth.md). Held client-side only — see
 * auth-store.ts.
 */
export type AdminSession = {
  accessToken: string;
  /** ISO 8601 timestamp; renewal is scheduled from this, never the local clock (FR-003). */
  accessTokenExpiresAt: string;
  refreshToken: string;
  displayName: string;
};
