import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({ as = "div", className, children }: ContainerProps) {
  const Tag = as;
  const classes = [styles.container, className].filter(Boolean).join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
