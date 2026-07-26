import type { ContactChannels } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  contact: ContactChannels;
};

export function HeroSection({ contact }: HeroSectionProps) {
  return (
    <section id="inicio" aria-labelledby="hero-heading" className={styles.hero}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>Hospedagem, casamentos e eventos</p>
        <Heading as="h1" size="xl" id="hero-heading">
          Uma pousada para viver a natureza e celebrar momentos especiais
        </Heading>
        <p className={styles.lead}>
          Casarão colonial do século XIX (datado de 1865 ou 1885), que serviu de rota do ouro 
          e abrigou figuras famosas como a atriz Maria Della Costa e o cantor Djavan.
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
