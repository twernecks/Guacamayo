"use client";

import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./ContactSection.module.css";

type ContactSectionProps = {
  whatsappNumber: string;
};

export function ContactSection({ whatsappNumber }: ContactSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="contato" aria-labelledby="contact-heading" className={styles.contactSection}>
      <Container>
        <Heading as="h2" size="lg" id="contact-heading">
          {t.contactPage.heading}
        </Heading>
        <ContactForm whatsappNumber={whatsappNumber} defaultInterest="stay" />
      </Container>
    </section>
  );
}
