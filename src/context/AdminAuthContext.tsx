"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { authStore } from "@/domain/admin/auth-store";
import * as authService from "@/services/admin/auth-service";

export type AdminAuthStatus = "authenticated" | "unauthenticated";

type AdminAuthContextValue = {
  status: AdminAuthStatus;
  admin: { displayName: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

type AdminAuthProviderProps = {
  children: ReactNode;
};

/**
 * Note: unlike the plan's initial sketch, `status` has no separate "loading"
 * value. The session store reads `localStorage` synchronously (no network
 * round-trip — contracts/auth.md explicitly allows skipping a `/api/admin/me`
 * validation call), and `useSyncExternalStore`'s `getServerSnapshot` +
 * same-commit resync already guarantees the first *effect* to observe
 * `status` sees the real client value, never the transient server-rendered
 * default (same guarantee `src/i18n/LanguageContext.tsx` relies on). A
 * "loading" state that can never actually be observed would just be dead
 * code, so the route guard (`src/app/admin/layout.tsx`) only ever needs to
 * branch on "authenticated" vs "unauthenticated".
 */
export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const session = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );

  const login = useCallback(async (email: string, password: string) => {
    const newSession = await authService.login(email, password);
    authStore.setSession(newSession);
  }, []);

  const logout = useCallback(async () => {
    const current = authStore.getSession();
    try {
      if (current) {
        await authService.logout(current.refreshToken);
      }
    } finally {
      // "Sair" always ends the local session, even if the server call could
      // not be confirmed (e.g. network down) — FR-005's intent is that the
      // admin is logged out from their own point of view either way.
      authStore.clearSession();
    }
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      status: session ? "authenticated" : "unauthenticated",
      admin: session ? { displayName: session.displayName } : null,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
