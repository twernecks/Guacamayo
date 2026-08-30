import type { LanguageCode } from "@/i18n/languages";

/**
 * Wire format for a multilingual field returned by the Guacamayo admin API
 * (data-model.md § Tipos compartilhados). Structurally identical to the
 * public site's `LocalizedText` (src/domain/content.ts), but kept as a
 * separate type: this one is the admin API's contract, that one is the
 * public content pipeline's — they evolve independently.
 */
export type LocalizedText = Record<LanguageCode, string>;

/** Opaque optimistic-concurrency token — never parsed, only re-sent as-is. */
export type RowVersion = string;

export type ApiErrorDetail = {
  field: string;
  message: string;
};

/** Shape of `error` in a `{isSuccess, data, error}` envelope response. */
export type ApiErrorPayload = {
  code: string;
  message: string;
  details: ApiErrorDetail[] | null;
};

/** Thrown by api-client.ts for any unsuccessful response other than a 409 conflict. */
export class ApiError extends Error {
  readonly code: string;
  readonly details: ApiErrorDetail[] | null;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.details = payload.details;
  }
}

/** Thrown by api-client.ts specifically for `409 CONCURRENT_MODIFICATION`. */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export type Envelope<T> = {
  isSuccess: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
};

/**
 * `fetch` wrapper that turns a network failure (server unreachable, DNS,
 * offline, CORS) into an `ApiError` with a distinct, stable code — this is
 * what lets the UI tell "can't reach the server" apart from a validation or
 * permission error (FR-027). Shared by auth-service.ts and api-client.ts,
 * which otherwise have no dependency on each other (avoids the circular
 * import that would come from api-client depending on auth-service's HTTP
 * plumbing directly).
 */
export async function fetchOrNetworkError(input: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new ApiError({
      code: "NETWORK_ERROR",
      message: "Não foi possível se comunicar com o servidor. Verifique sua conexão.",
      details: null,
    });
  }
}

/** Decodes the standard `{isSuccess, data, error}` envelope, throwing `ApiError` on failure. */
export async function parseEnvelope<T>(response: Response): Promise<T> {
  let envelope: Envelope<T>;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    throw new ApiError({
      code: "NETWORK_ERROR",
      message: "Não foi possível interpretar a resposta do servidor.",
      details: null,
    });
  }
  if (!envelope.isSuccess) {
    throw new ApiError(
      envelope.error ?? { code: "UNKNOWN_ERROR", message: "Erro desconhecido.", details: null },
    );
  }
  return envelope.data as T;
}
