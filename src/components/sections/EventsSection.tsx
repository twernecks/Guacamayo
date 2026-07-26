import type { ContactChannels, EventSpace } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { MediaGallery } from "./MediaGallery";
import styles from "./EventsSection.module.css";

type EventsSectionProps = {
  events: EventSpace[];
  contact: ContactChannels;
};

export function EventsSection({ events, contact }: EventsSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section id="eventos" aria-labelledby="events-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="events-heading">
          Eventos
        </Heading>

        <ul className={styles.grid}>
          {events.map((event) => {
            const headingId = `event-${event.id}-heading`;

            return (
              <li key={event.id} className={styles.card} aria-labelledby={headingId}>
                <MediaGallery
                  images={event.images}
                  emptyLabel="Fotos do espaço de eventos em breve"
                  ariaLabel={`Fotos de ${event.name}`}
                  sizes="(min-width: 40rem) 50vw, 100vw"
                />
                <div className={styles.cardBody}>
                  <Heading as="h3" size="sm" id={headingId}>
                    {event.name}
                  </Heading>
                  <p>{event.purpose}</p>
                  <WhatsAppContact
                    contact={contact}
                    interest="event"
                    label="Falar sobre este evento"
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
