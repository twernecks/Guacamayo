import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminSession } from "@/domain/admin/auth";

vi.mock("@/services/admin/auth-service", () => ({
  refresh: vi.fn(),
}));

import { refresh } from "@/services/admin/auth-service";
import { createAuthStore } from "@/domain/admin/auth-store";

const STORAGE_KEY = "guacamayo:admin-session";
const FIVE_MINUTES_MS = 5 * 60_000;
const RENEWAL_MARGIN_MS = 60_000;

function makeSession(overrides: Partial<AdminSession> = {}): AdminSession {
  return {
    accessToken: "access-token",
    accessTokenExpiresAt: new Date(Date.now() + FIVE_MINUTES_MS).toISOString(),
    refreshToken: "refresh-token",
    displayName: "Admin",
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
  vi.mocked(refresh).mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createAuthStore", () => {
  it("persists a session to localStorage and reflects it via getSnapshot", () => {
    const store = createAuthStore();
    const session = makeSession();

    store.setSession(session);

    expect(store.getSnapshot()).toEqual(session);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual(session);
  });

  it("a new store instance picks up a session persisted by a previous one", () => {
    const first = createAuthStore();
    const session = makeSession();
    first.setSession(session);

    const second = createAuthStore();

    expect(second.getSnapshot()).toEqual(session);
  });

  it("clearSession removes the persisted session", () => {
    const store = createAuthStore();
    store.setSession(makeSession());

    store.clearSession();

    expect(store.getSnapshot()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("notifies subscribers when the session changes", () => {
    const store = createAuthStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.setSession(makeSession());

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not call refresh before the scheduled renewal margin has elapsed", () => {
    const store = createAuthStore();
    store.setSession(makeSession());

    // Renewal is scheduled for (expiry - 60s) = 4min from now; advance just short of that.
    vi.advanceTimersByTime(FIVE_MINUTES_MS - RENEWAL_MARGIN_MS - 1_000);

    expect(refresh).not.toHaveBeenCalled();
  });

  it("renews from accessTokenExpiresAt and applies the refreshed session", async () => {
    const store = createAuthStore();
    const renewedSession = makeSession({ accessToken: "renewed-access-token" });
    vi.mocked(refresh).mockResolvedValue(renewedSession);

    store.setSession(makeSession());

    await vi.advanceTimersByTimeAsync(FIVE_MINUTES_MS - RENEWAL_MARGIN_MS + 1_000);

    expect(refresh).toHaveBeenCalledWith("refresh-token");
    expect(store.getSnapshot()).toEqual(renewedSession);
  });

  it("forces logout (clears the session) when the scheduled refresh fails", async () => {
    const store = createAuthStore();
    vi.mocked(refresh).mockRejectedValue(new Error("invalid refresh token"));

    store.setSession(makeSession());

    await vi.advanceTimersByTimeAsync(FIVE_MINUTES_MS - RENEWAL_MARGIN_MS + 1_000);

    expect(store.getSnapshot()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("reschedules its own renewal for a session restored from localStorage on creation", async () => {
    const bootstrapStore = createAuthStore();
    bootstrapStore.setSession(makeSession());

    const renewedSession = makeSession({ accessToken: "renewed-after-reload" });
    vi.mocked(refresh).mockResolvedValue(renewedSession);

    // Simulates a page reload: a fresh store instance reads the same persisted session.
    const reloadedStore = createAuthStore();
    await vi.advanceTimersByTimeAsync(FIVE_MINUTES_MS - RENEWAL_MARGIN_MS + 1_000);

    expect(reloadedStore.getSnapshot()).toEqual(renewedSession);
  });
});
