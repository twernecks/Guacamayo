import type { IconProps } from "./types";

export function PoolIcon({ className }: IconProps) {
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
      <circle cx="12" cy="7" r="2.2" />
      <path d="M12 9.2V16" />
      <path d="M9 12h6" />
      <path d="M2.5 19c1.3 1 2.6 1 3.9 0s2.6-1 3.9 0 2.6 1 3.9 0 2.6-1 3.9 0 2.6 1 3.9 0" />
    </svg>
  );
}
