import type { IconProps } from "./types";

export function AirConditioningIcon({ className }: IconProps) {
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
      <path d="M12 3v18" />
      <path d="M5.5 6.5 12 9l6.5-2.5" />
      <path d="M5.5 17.5 12 15l6.5 2.5" />
      <path d="M4 12h16" />
    </svg>
  );
}
