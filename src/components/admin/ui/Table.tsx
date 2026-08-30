import type { ReactNode } from "react";
import styles from "./Table.module.css";

type TableProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Purely visual wrapper — `thead`/`tbody`/`tr`/`th`/`td` passed in as
 * `children` stay native elements, preserving the implicit ARIA roles
 * (table/row/columnheader/cell) the existing test suite queries by
 * (contracts/admin-ui-components.md). The extra `div` only exists to contain
 * horizontal overflow on narrow viewports (research.md Decision 5) — it does
 * not appear in the accessibility tree.
 */
export function Table({ children, className }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={[styles.table, className].filter(Boolean).join(" ")}>{children}</table>
    </div>
  );
}
