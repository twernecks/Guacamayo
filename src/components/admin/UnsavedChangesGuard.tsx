"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

type UnsavedChangesGuardProps = {
  isDirty: boolean;
};

/**
 * FR-017a: confirms before discarding unsaved changes.
 *
 * Covers two distinct escape routes:
 * - Closing the tab/window or typing a new URL: the native `beforeunload`
 *   prompt (fully reliable, standard behavior).
 * - Clicking an in-app link (e.g. AdminNav): intercepted in the capture
 *   phase, before `next/link`'s own click handler runs, so it can be paused
 *   and replayed via `router.push` only after confirming.
 *
 * Known gap: the browser's own Back/Forward buttons aren't intercepted —
 * the App Router has no supported API for canceling a `popstate`-driven
 * navigation, so this is a deliberate, documented limitation rather than an
 * oversight.
 */
export function UnsavedChangesGuard({ isDirty }: UnsavedChangesGuardProps) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const isDirtyRef = useRef(isDirty);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    }

    function handleClickCapture(event: MouseEvent) {
      if (!isDirtyRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(href);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClickCapture, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, []);

  function handleConfirmDiscard() {
    const href = pendingHref;
    setPendingHref(null);
    if (href) router.push(href);
  }

  return (
    <ConfirmDialog
      open={pendingHref !== null}
      variant="discard"
      onConfirm={handleConfirmDiscard}
      onCancel={() => setPendingHref(null)}
    />
  );
}
