import type { IconProps } from "./types";

export function PrivateBathroomIcon({ className }: IconProps) {
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
      <path d="M7 8.5V6a2.5 2.5 0 0 1 4.9-.7" />
      <rect x="4.5" y="8.5" width="15" height="4" rx="1.5" />
      <path d="M6 12.5 5.3 19.5" />
      <path d="M18 12.5l.7 7" />
      <path d="M10.5 16.5h3" />
    </svg>
  );
}
