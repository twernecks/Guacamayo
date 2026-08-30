import type { IconProps } from "./types";

export function WarningIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      focusable="false"
      aria-hidden="true"
    >
      <path d="M12 3.5 22 20.5H2Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
