import styles from "./LoadingIndicator.module.css";

type LoadingIndicatorProps = {
  label?: string;
};

/** FR-024a — shown while any listing or detail/edit view is fetching data. */
export function LoadingIndicator({ label = "Carregando…" }: LoadingIndicatorProps) {
  return (
    <p role="status" className={styles.loading}>
      <span className={styles.spinner} aria-hidden="true" />
      {label}
    </p>
  );
}
