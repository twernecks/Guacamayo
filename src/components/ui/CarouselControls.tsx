import type { ReactNode } from "react";
import styles from "./CarouselControls.module.css";

type CarouselControlsProps = {
  activeIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
  children: ReactNode;
  rowClassName?: string;
  positionClassName?: string;
};

/**
 * Shared "previous/next buttons + N of M position indicator" pattern, first
 * established by MediaGalleryLightbox and reused here so photo and
 * testimonial carousels can't silently drift from each other.
 */
export function CarouselControls({
  activeIndex,
  total,
  onPrevious,
  onNext,
  previousLabel,
  nextLabel,
  children,
  rowClassName,
  positionClassName,
}: CarouselControlsProps) {
  const hasMultiple = total > 1;
  const rowClasses = [styles.row, rowClassName].filter(Boolean).join(" ");
  const positionClasses = [styles.position, positionClassName].filter(Boolean).join(" ");

  return (
    <>
      <div className={rowClasses}>
        {hasMultiple ? (
          <button
            type="button"
            className={styles.navButton}
            aria-label={previousLabel}
            onClick={onPrevious}
          >
            ‹
          </button>
        ) : null}

        {children}

        {hasMultiple ? (
          <button
            type="button"
            className={styles.navButton}
            aria-label={nextLabel}
            onClick={onNext}
          >
            ›
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <p className={positionClasses} aria-live="polite">
          {activeIndex + 1} de {total}
        </p>
      ) : null}
    </>
  );
}
