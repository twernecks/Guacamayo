"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminNav } from "@/components/admin/AdminNav";
import styles from "./AdminShell.module.css";

const LOGIN_PATH = "/admin/login";
const POST_LOGIN_LANDING_PATH = "/admin";

type AdminRouteGuardProps = {
  children: ReactNode;
};

function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { status } = useAdminAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.toString();
  const currentPath = query ? `${pathname}?${query}` : pathname;
  const isLoginRoute = pathname === LOGIN_PATH;
  const shouldRedirectToLogin = status === "unauthenticated" && !isLoginRoute;
  const shouldRedirectAwayFromLogin = status === "authenticated" && isLoginRoute;

  useEffect(() => {
    if (shouldRedirectToLogin) {
      // FR-007: block every admin screen for an unauthenticated visitor.
      // The full path (including query — e.g. `?id=` on an edit/detail page,
      // research.md Decision 2) is preserved via `?from=` so FR-008 can send
      // the admin back to exactly where they were trying to go.
      router.replace(`${LOGIN_PATH}?from=${encodeURIComponent(currentPath)}`);
    } else if (shouldRedirectAwayFromLogin) {
      // FR-007a/FR-008: an already-authenticated admin on /admin/login —
      // whether from visiting it directly or from just having logged in —
      // is sent to `?from=` if present, otherwise the default landing page.
      // This is the ONLY place that decides the post-login destination
      // (LoginForm itself does not redirect) so there is no race between two
      // independent redirects landing in a different order.
      const from = searchParams.get("from");
      const safeFrom = from && !from.startsWith(LOGIN_PATH) ? from : null;
      router.replace(safeFrom ?? POST_LOGIN_LANDING_PATH);
    }
  }, [shouldRedirectToLogin, shouldRedirectAwayFromLogin, currentPath, searchParams, router]);

  if (shouldRedirectToLogin || shouldRedirectAwayFromLogin) {
    // A redirect is in flight for this render — render nothing rather than
    // flash protected content at a logged-out visitor, or the login form at
    // someone already authenticated.
    return null;
  }

  return (
    <div className={styles.shell}>
      {status === "authenticated" && !isLoginRoute ? <AdminNav /> : null}
      {children}
    </div>
  );
}

type AdminShellProps = {
  children: ReactNode;
};

/**
 * Wraps every `/admin/**` route: session provider + route guard + nav chrome.
 * Split out from `src/app/admin/layout.tsx` (a Server Component) because
 * Next.js only allows a route's `metadata` export from a Server Component —
 * this shell is where the actual Client Component logic (session state,
 * `useSearchParams`/`useRouter`) lives instead.
 */
export function AdminShell({ children }: AdminShellProps) {
  return (
    <AdminAuthProvider>
      {/* `useSearchParams()` requires a Suspense boundary under `output: "export"`
          (next.config.ts) — otherwise the static build fails. */}
      <Suspense fallback={null}>
        <AdminRouteGuard>{children}</AdminRouteGuard>
      </Suspense>
    </AdminAuthProvider>
  );
}
