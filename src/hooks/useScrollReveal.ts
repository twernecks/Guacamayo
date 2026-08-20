"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element with a subtle fade the first time it enters the
 * viewport, then stops observing it — the fade never re-triggers on
 * scroll-back (FR-012). Under `prefers-reduced-motion: reduce`, the global
 * `.scrollReveal` CSS rule (globals.css) shows the element immediately
 * regardless of `isVisible`, so this hook does not need to special-case it —
 * that would require calling setState synchronously in the effect body,
 * which the project's lint rules disallow.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
