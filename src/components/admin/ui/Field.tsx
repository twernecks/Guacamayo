import type { ReactNode } from "react";
import styles from "./Field.module.css";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Label + native control wrapper. Never generates `id`/`htmlFor` itself —
 * the caller keeps full ownership of that association (and of the control's
 * own props), so every existing `getByLabelText(...)` query keeps resolving
 * exactly as before (contracts/admin-ui-components.md).
 */
export function Field({ label, htmlFor, error, children, className }: FieldProps) {
  const classes = [styles.field, className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>{children}</div>
      {error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
