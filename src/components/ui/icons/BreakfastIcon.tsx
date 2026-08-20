import type { IconProps } from "./types";

export function BreakfastIcon({ className }: IconProps) {
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
      <path d="M5 9h11v5a5.5 5.5 0 0 1-5.5 5.5H10.5A5.5 5.5 0 0 1 5 14z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8.5 3.5c-.6.9-.6 1.6 0 2.5" />
      <path d="M12 3.5c-.6.9-.6 1.6 0 2.5" />
    </svg>
  );
}
