import type { ContactChannels, EventSpace } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { ContactForm } from "@/components/contact/ContactForm";
import { MediaGallery } from "./MediaGallery";
import styles from "./WeddingSection.module.css";

type WeddingSectionProps = {
  wedding: EventSpace | undefined;
  contact: ContactChannels;
};

/**
 * Highlights are structural marketing copy (placeholder pending business
 * approval), not business facts, so they live in the component rather than
 * the content repository.
 */
const HIGHLIGHTS = [
  "Cenário natural para cerimônia e recepção",
  "Ambientação romântica e personalizável",
  "Equipe dedicada do início ao grande dia",
];

export function WeddingSection({ wedding, contact }: WeddingSectionProps) {
  if (!wedding) {
    return null;
  }

  return (
    <section id="casamentos" aria-labelledby="wedding-heading" className={styles.section}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Casamentos</p>
          <Heading as="h2" size="lg" id="wedding-heading">
            {wedding.name}
          </Heading>
          <p className={styles.purpose}>{wedding.purpose}</p>
          <ul className={styles.highlights}>
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className={styles.ctas}>
            <WhatsAppContact
              contact={contact}
              interest="wedding"
              label="Pedir orçamento pelo WhatsApp"
            />
            <ContactForm
              whatsappNumber={contact.whatsappNumber}
              defaultInterest="wedding"
              submitLabel="Pedir orçamento pelo formulário"
            />
          </div>
        </div>

        <MediaGallery
          images={wedding.images}
          emptyLabel="Fotos de casamentos em breve"
          ariaLabel={`Fotos de ${wedding.name}`}
          sizes="(min-width: 60rem) 40vw, 100vw"
        />
      </Container>
    </section>
  );
}
