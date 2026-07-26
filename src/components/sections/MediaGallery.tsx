"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Media } from "@/domain/content";
import { MediaGalleryLightbox } from "./MediaGalleryLightbox";
import styles from "./MediaGallery.module.css";

type MediaGalleryProps = {
  images: Media[];
  emptyLabel: string;
  ariaLabel: string;
  sizes?: string;
  priority?: boolean;
};

const DEFAULT_SIZES = "(min-width: 60rem) 33vw, (min-width: 40rem) 50vw, 100vw";

export function MediaGallery({
  images,
  emptyLabel,
  ariaLabel,
  sizes = DEFAULT_SIZES,
  priority = false,
}: MediaGalleryProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const coverImage = images[0];

  if (!coverImage || coverFailed) {
    return (
      <div className={styles.fallback}>
        <p>{emptyLabel}</p>
      </div>
    );
  }

  const photoCount = images.length;

  function handleClose() {
    setIsLightboxOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={coverImage.src}
          alt={coverImage.alt}
          width={coverImage.width}
          height={coverImage.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
          onError={() => setCoverFailed(true)}
        />
        {photoCount > 1 ? (
          <span className={styles.count} aria-hidden="true">
            +{photoCount - 1}
          </span>
        ) : null}
        <span className="visually-hidden">
          {photoCount > 1 ? `Ver ${photoCount} fotos de ${ariaLabel}` : `Ver foto de ${ariaLabel}`}
        </span>
      </button>

      <MediaGalleryLightbox
        images={images}
        itemLabel={ariaLabel}
        initialIndex={0}
        isOpen={isLightboxOpen}
        onClose={handleClose}
      />
    </>
  );
}
