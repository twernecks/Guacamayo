"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import type { Media } from "@/domain/content";
import styles from "./MediaGalleryLightbox.module.css";

type MediaGalleryLightboxProps = {
  images: Media[];
  itemLabel: string;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function MediaGalleryLightbox({
  images,
  itemLabel,
  initialIndex,
  isOpen,
  onClose,
}: MediaGalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [failedSrcs, setFailedSrcs] = useState<ReadonlySet<string>>(new Set());
  const [wasOpen, setWasOpen] = useState(isOpen);
  const titleId = useId();
  const total = images.length;

  // Reset to the clicked photo each time the lightbox transitions to open.
  // Adjusted during render (React's recommended pattern for state derived
  // from a prop change) rather than in an effect, to avoid an extra render.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dialogRef.current?.close();
        return;
      }

      // Native showModal() does not reliably keep Tab from reaching elements
      // outside the dialog (verified with a real-browser focus-trap check),
      // so the wrap-around at the boundaries is enforced explicitly here.
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) {
          return;
        }

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    dialog?.addEventListener("keydown", handleKeyDown);
    return () => dialog?.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (total === 0) {
    return null;
  }

  function goNext() {
    setActiveIndex((index) => (index + 1) % total);
  }

  function goPrevious() {
    setActiveIndex((index) => (index - 1 + total) % total);
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }

  const image = images[activeIndex]!;
  const imageFailed = failedSrcs.has(image.src);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {itemLabel}
          </h2>
          <button
            type="button"
            ref={closeButtonRef}
            className={styles.closeButton}
            onClick={() => dialogRef.current?.close()}
          >
            <span className="visually-hidden">Fechar</span>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          {total > 1 ? (
            <button
              type="button"
              className={styles.navButton}
              aria-label="Foto anterior"
              onClick={goPrevious}
            >
              ‹
            </button>
          ) : null}

          <figure className={styles.figure}>
            {imageFailed ? (
              <div className={styles.imageFallback}>
                <p>Não foi possível carregar esta foto.</p>
              </div>
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 60rem) 56rem, 90vw"
                className={styles.image}
                onError={() =>
                  setFailedSrcs((previous) => {
                    const next = new Set(previous);
                    next.add(image.src);
                    return next;
                  })
                }
              />
            )}
            {image.caption ? (
              <figcaption className={styles.caption}>{image.caption}</figcaption>
            ) : null}
          </figure>

          {total > 1 ? (
            <button
              type="button"
              className={styles.navButton}
              aria-label="Próxima foto"
              onClick={goNext}
            >
              ›
            </button>
          ) : null}
        </div>

        {total > 1 ? (
          <p className={styles.position} aria-live="polite">
            {activeIndex + 1} de {total}
          </p>
        ) : null}
      </div>
    </dialog>
  );
}
