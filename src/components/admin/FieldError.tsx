import type { ApiErrorDetail } from "@/domain/admin/shared";
import styles from "./FieldError.module.css";

type FieldErrorProps = {
  details: ApiErrorDetail[] | null | undefined;
  /** Field path in our own casing, e.g. `"name.pt"`. */
  field: string;
};

/**
 * FR-026: a validation error the API attaches to one specific field.
 * Case-insensitive on purpose — live probing against the real API
 * (2026-08-26) found it returns PascalCase paths (`"Name.Pt"`), not the
 * lowerCamelCase the contracts doc example showed (`"name.pt"`); matching
 * case-insensitively is robust to either without hardcoding one casing.
 */
export function FieldError({ details, field }: FieldErrorProps) {
  const detail = details?.find((item) => item.field.toLowerCase() === field.toLowerCase());
  if (!detail) return null;
  return (
    <p role="alert" className={styles.fieldError}>
      {detail.message}
    </p>
  );
}
