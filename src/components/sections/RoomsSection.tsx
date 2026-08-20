"use client";

import type { Room } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { AMENITY_ICONS } from "@/components/ui/icons/amenity-icons";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Messages } from "@/i18n/messages";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MediaGallery } from "./MediaGallery";
import styles from "./RoomsSection.module.css";

type RoomsSectionProps = {
  rooms: Room[];
};

function RoomCard({
  room,
  priority,
  t,
  localize,
}: {
  room: Room;
  priority: boolean;
  t: Messages;
  localize: (text: Room["name"]) => string;
}) {
  const headingId = `room-${room.id}-heading`;
  const name = localize(room.name);
  const isFeatured = room.visualEmphasis === "featured";
  const { ref, isVisible } = useScrollReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={[
        styles.card,
        isFeatured ? styles.featured : "",
        "scrollReveal",
        isVisible ? "isRevealed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={headingId}
    >
      <MediaGallery
        images={room.images}
        emptyLabel={t.rooms.galleryEmptyLabel}
        ariaLabel={t.mediaGallery.photosAriaLabel(name)}
        priority={priority}
      />
      <div className={styles.cardBody}>
        <Heading as="h3" size="sm" id={headingId}>
          {name}
        </Heading>
        <p>{localize(room.summary)}</p>
        {room.amenities.length > 0 ? (
          <ul className={styles.amenities} aria-label={t.rooms.amenitiesAriaLabel(name)}>
            {room.amenities.map((amenity) => {
              const AmenityIcon = AMENITY_ICONS[amenity.key];
              return (
                <li key={amenity.key}>
                  <AmenityIcon className={styles.amenityIcon} />
                  <span>{localize(amenity.label)}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  const { t, localize } = useLanguage();

  return (
    <section
      id="quartos"
      aria-labelledby="rooms-heading"
      className={`${styles.section} textureGrain`}
    >
      <Container>
        <Heading as="h2" size="lg" id="rooms-heading">
          {t.rooms.heading}
        </Heading>

        {rooms.length === 0 ? (
          <p className={styles.empty}>{t.rooms.empty}</p>
        ) : (
          <ul className={styles.grid}>
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} priority={index === 0} t={t} localize={localize} />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
