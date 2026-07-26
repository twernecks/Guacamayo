import type { Room } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { MediaGallery } from "./MediaGallery";
import styles from "./RoomsSection.module.css";

type RoomsSectionProps = {
  rooms: Room[];
};

function RoomCard({ room, priority }: { room: Room; priority: boolean }) {
  const headingId = `room-${room.id}-heading`;

  return (
    <li className={styles.card} aria-labelledby={headingId}>
      <MediaGallery
        images={room.images}
        emptyLabel="Foto do quarto em breve"
        ariaLabel={`Fotos de ${room.name}`}
        priority={priority}
      />
      <div className={styles.cardBody}>
        <Heading as="h3" size="sm" id={headingId}>
          {room.name}
        </Heading>
        <p>{room.summary}</p>
        {room.amenities.length > 0 ? (
          <ul className={styles.amenities} aria-label={`Comodidades de ${room.name}`}>
            {room.amenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  return (
    <section id="quartos" aria-labelledby="rooms-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="rooms-heading">
          Quartos
        </Heading>

        {rooms.length === 0 ? (
          <p className={styles.empty}>
            Em breve, novos quartos serão apresentados aqui. Fale conosco para saber mais sobre a
            hospedagem disponível.
          </p>
        ) : (
          <ul className={styles.grid}>
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} priority={index === 0} />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
