import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Heading.module.css";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "xl" | "lg" | "md" | "sm";

type HeadingProps = {
  as: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLHeadingElement>, "className" | "children">;

export function Heading({ as, size = "md", className, children, ...rest }: HeadingProps) {
  const Tag = as as ElementType;
  const sizeClass = styles[size];
  const classes = [styles.heading, sizeClass, className].filter(Boolean).join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
