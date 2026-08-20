import type { IconProps } from "./types";

export function MiniFridgeIcon({ className }: IconProps) {
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
      <rect x="6" y="2.5" width="12" height="19" rx="1.5" />
      <path d="M6 9.5h12" />
      <path d="M9 5v2" />
      <path d="M9 12.5v2" />
    </svg>
  );
}
