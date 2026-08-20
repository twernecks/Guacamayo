import type { IconProps } from "./types";

export function WifiIcon({ className }: IconProps) {
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
      <path d="M3 8.5c5-4.2 13-4.2 18 0" />
      <path d="M6.2 12.4c3.4-2.9 8.2-2.9 11.6 0" />
      <path d="M9.5 16.2c1.6-1.3 3.4-1.3 5 0" />
      <circle cx="12" cy="19.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
