import type { IconProps } from "./types";

export function SeaViewIcon({ className }: IconProps) {
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
      <circle cx="12" cy="7" r="3" />
      <path d="M2.5 13.5c1.3-1 2.6-1 3.9 0s2.6 1 3.9 0 2.6-1 3.9 0 2.6 1 3.9 0 2.6-1 3.9 0" />
      <path d="M2.5 18c1.3-1 2.6-1 3.9 0s2.6 1 3.9 0 2.6-1 3.9 0 2.6 1 3.9 0 2.6-1 3.9 0" />
    </svg>
  );
}
