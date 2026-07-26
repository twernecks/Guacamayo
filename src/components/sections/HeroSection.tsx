import type { ContactChannels } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  contact: ContactChannels;
};

/**
 * Copy below is placeholder marketing text pending business-approved wording
 * (see public/images/pousada/README.md and src/data/pousada-content.ts).
 */
export function HeroSection({ contact }: HeroSectionProps) {
  return (
    <section id="inicio" aria-labelledby="hero-heading" className={styles.hero}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>Hospedagem, casamentos e eventos</p>
        <Heading as="h1" size="xl" id="hero-heading">
          Uma pousada para viver a natureza e celebrar momentos especiais
        </Heading>
        <p className={styles.lead}>
          Texto de exemplo a substituir pela proposta de valor aprovada pelo negócio.
        </p>
        <WhatsAppContact
          contact={contact}
          interest="stay"
          label="Falar no WhatsApp sobre hospedagem"
        />
      </Container>
    </section>
  );
}
