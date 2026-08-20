"use client";

import type { ContactChannels, EventSpace } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { useLanguage } from "@/i18n/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MediaGallery } from "./MediaGallery";
import styles from "./EventsSection.module.css";

type EventsSectionProps = {
  events: EventSpace[];
  contact: ContactChannels;
};

export function EventsSection({ events, contact }: EventsSectionProps) {
  const { t, localize } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  if (events.length === 0) {
    return null;
  }

  const sectionClassName = [styles.section, "textureGrain", "scrollReveal", isVisible ? "isRevealed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section ref={ref} id="eventos" aria-labelledby="events-heading" className={sectionClassName}>
      <Container>
        <Heading as="h2" size="lg" id="events-heading">
          {t.events.heading}
        </Heading>

        <ul className={styles.grid}>
          {events.map((event) => {
            const headingId = `event-${event.id}-heading`;
            const name = localize(event.name);

            return (
              <li key={event.id} className={styles.card} aria-labelledby={headingId}>
                <MediaGallery
                  images={event.images}
                  emptyLabel={t.events.galleryEmptyLabel}
                  ariaLabel={t.mediaGallery.photosAriaLabel(name)}
                  sizes="(min-width: 40rem) 50vw, 100vw"
                />
                <div className={styles.cardBody}>
                  <Heading as="h3" size="sm" id={headingId}>
                    {name}
                  </Heading>
                  <p>{localize(event.purpose)}</p>
                  <WhatsAppContact
                    contact={contact}
                    interest="event"
                    label={t.events.whatsappCta}
                    variant="primary"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
