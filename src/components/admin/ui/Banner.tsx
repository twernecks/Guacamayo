import type { ReactNode } from "react";
import styles from "./Banner.module.css";

export type BannerVariant = "error" | "warning" | "empty" | "info";

type BannerProps = {
  variant: BannerVariant;
  children: ReactNode;
  /** No default on purpose — callers keep the exact `role` they already used
   * (e.g. `ErrorToast` keeps `role="alert"`), preserving existing
   * `getByRole`/`getByText` queries (contracts/admin-ui-components.md). */
  role?: "alert" | "status";
  className?: string;
};

export function Banner({ variant, children, role, className }: BannerProps) {
  const classes = [styles.banner, styles[variant], className].filter(Boolean).join(" ");
  return (
    <div className={classes} role={role}>
      {children}
    </div>
  );
}
