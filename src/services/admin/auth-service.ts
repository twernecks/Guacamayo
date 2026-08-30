import { ADMIN_API_BASE_URL } from "@/lib/admin-api-config";
import type { AdminSession } from "@/domain/admin/auth";
import { ApiError, fetchOrNetworkError, parseEnvelope } from "@/domain/admin/shared";

/**
 * Login/refresh/logout calls, kept separate from api-client.ts (T007): those
 * three endpoints don't carry (or don't require) an access token, and
 * api-client's reactive refresh-on-401 needs to call `refresh()` here without
 * this module depending back on api-client (contracts/auth.md).
 */

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetchOrNetworkError(`${ADMIN_API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseEnvelope<T>(response);
}

export function login(email: string, password: string): Promise<AdminSession> {
  return postJson<AdminSession>("/api/auth/login", { email, password });
}

export function refresh(refreshToken: string): Promise<AdminSession> {
  return postJson<AdminSession>("/api/auth/refresh", { refreshToken });
}

/**
 * Ends the session server-side. An already-invalid refresh token
 * (`INVALID_REFRESH_TOKEN`) is treated as success from the UI's point of
 * view — the desired end state (no active session) already holds either way
 * (contracts/auth.md).
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await postJson<null>("/api/auth/logout", { refreshToken });
  } catch (error) {
    if (!(error instanceof ApiError) || error.code !== "INVALID_REFRESH_TOKEN") {
      throw error;
    }
  }
}
