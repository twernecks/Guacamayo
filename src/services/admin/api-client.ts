import { ADMIN_API_BASE_URL } from "@/lib/admin-api-config";
import { authStore } from "@/domain/admin/auth-store";
import {
  ApiError,
  ConflictError,
  fetchOrNetworkError,
  parseEnvelope,
  type ApiErrorPayload,
} from "@/domain/admin/shared";
import * as authService from "@/services/admin/auth-service";

type Method = "GET" | "POST" | "PUT" | "DELETE";

async function send(
  path: string,
  method: Method,
  body: unknown,
  accessToken: string | undefined,
): Promise<Response> {
  return fetchOrNetworkError(`${ADMIN_API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function handle<T>(response: Response): Promise<T> {
  if (response.status === 409) {
    const envelope = (await response.json().catch(() => null)) as { error?: ApiErrorPayload } | null;
    throw new ConflictError(
      envelope?.error?.message ??
        "Este item foi alterado por outra pessoa nesse meio-tempo. Recarregue antes de tentar novamente.",
    );
  }
  return parseEnvelope<T>(response);
}

/**
 * Generic authenticated request: injects the current access token, and on a
 * `401` (fora do fluxo de login/refresh, que passa por auth-service.ts
 * diretamente) tenta renovar a sessão exatamente uma vez antes de repetir a
 * chamada original — se a renovação falhar, força logout (FR-004,
 * research.md Decision 4). Um `409 CONCURRENT_MODIFICATION` sempre vira um
 * `ConflictError` distinto, nunca um `ApiError` genérico.
 */
export async function request<T>(path: string, method: Method = "GET", body?: unknown): Promise<T> {
  const session = authStore.getSession();
  const response = await send(path, method, body, session?.accessToken);

  if (response.status === 401 && session) {
    let renewed;
    try {
      renewed = await authService.refresh(session.refreshToken);
    } catch {
      authStore.clearSession();
      throw new ApiError({
        code: "UNAUTHORIZED",
        message: "Sua sessão expirou. Faça login novamente.",
        details: null,
      });
    }
    authStore.setSession(renewed);
    const retryResponse = await send(path, method, body, renewed.accessToken);
    return handle<T>(retryResponse);
  }

  return handle<T>(response);
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body?: unknown) => request<T>(path, "PUT", body),
  remove: <T>(path: string) => request<T>(path, "DELETE"),
};
