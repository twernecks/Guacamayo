import { ApiError } from "@/domain/admin/shared";
import { Banner } from "@/components/admin/ui/Banner";

/**
 * FR-025/FR-027: turns any thrown value from the API layer into a message
 * the admin can actually read, distinguishing a network/connectivity
 * failure from everything else.
 */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "NETWORK_ERROR") {
      return "Não foi possível se comunicar com o servidor. Verifique sua conexão.";
    }
    return error.message || "Ocorreu um erro inesperado.";
  }
  return "Ocorreu um erro inesperado.";
}

type ErrorToastProps = {
  error: unknown;
};

export function ErrorToast({ error }: ErrorToastProps) {
  if (!error) return null;
  return (
    <Banner variant="error" role="alert">
      {describeError(error)}
    </Banner>
  );
}
