import type { AdminSession } from "@/domain/admin/auth";
import * as authService from "@/services/admin/auth-service";

const STORAGE_KEY = "guacamayo:admin-session";

/**
 * How long before the real expiry to proactively renew (FR-003: "antes que
 * expire", with enough margin that a slow network round-trip still finishes
 * before the access token is actually rejected).
 */
const RENEWAL_MARGIN_MS = 60_000;

function readStoredSession(): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    // Storage blocked (private browsing) or not yet available (SSR) — treated
    // as "no session", same defensive fallback as LanguageContext.
    return null;
  }
}

function writeStoredSession(session: AdminSession | null) {
  try {
    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Best-effort only — an in-memory session still works for this page load
    // even when persistence is blocked.
  }
}

export type AuthStore = {
  getSession(): AdminSession | null;
  setSession(session: AdminSession): void;
  clearSession(): void;
  subscribe(listener: () => void): () => void;
  getSnapshot(): AdminSession | null;
  getServerSnapshot(): AdminSession | null;
};

/**
 * Factory kept separate from the singleton below purely for test isolation
 * (`tests/unit/admin/auth-store.test.ts` can create a fresh instance per
 * test instead of sharing module state). The running app always uses the
 * single `authStore` instance exported at the bottom of this file — plain
 * service modules like api-client.ts read/write session state directly from
 * it, outside of React, the same way `AdminAuthContext` does via
 * `useSyncExternalStore` (research.md Decision 3).
 */
export function createAuthStore(): AuthStore {
  let session: AdminSession | null =
    typeof window === "undefined" ? null : readStoredSession();
  const listeners = new Set<() => void>();
  let renewalTimer: ReturnType<typeof setTimeout> | null = null;

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function clearRenewalTimer() {
    if (renewalTimer !== null) {
      clearTimeout(renewalTimer);
      renewalTimer = null;
    }
  }

  function clearSession() {
    clearRenewalTimer();
    session = null;
    writeStoredSession(null);
    notify();
  }

  function setSession(next: AdminSession) {
    session = next;
    writeStoredSession(next);
    scheduleRenewal(next);
    notify();
  }

  function scheduleRenewal(current: AdminSession) {
    clearRenewalTimer();
    if (typeof window === "undefined") return;

    // Based on the server-issued expiry timestamp, never the local clock
    // (FR-003) — a skewed device clock never causes an early/late renewal.
    const expiresAtMs = new Date(current.accessTokenExpiresAt).getTime();
    const delay = Math.max(0, expiresAtMs - Date.now() - RENEWAL_MARGIN_MS);

    renewalTimer = setTimeout(async () => {
      try {
        const renewed = await authService.refresh(current.refreshToken);
        setSession(renewed);
      } catch {
        // Refresh token invalid/expired/reused — force logout (FR-004). The
        // UI never distinguishes the technical cause (spec.md Assumptions).
        clearSession();
      }
    }, delay);
  }

  // A session restored from localStorage on load still needs its renewal
  // timer armed — if it's already past the margin (e.g. the tab was closed
  // for a while), this fires the refresh almost immediately.
  if (session) {
    scheduleRenewal(session);
  }

  return {
    getSession: () => session,
    setSession,
    clearSession,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => session,
    getServerSnapshot: () => null,
  };
}

/** The app-wide singleton — see the note on `createAuthStore` above. */
export const authStore: AuthStore = createAuthStore();
