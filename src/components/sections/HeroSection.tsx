"use client";

import type { ContactChannels } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  contact: ContactChannels;
};

export function HeroSection({ contact }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="inicio" aria-labelledby="hero-heading" className={styles.hero}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{t.hero.eyebrow}</p>
        <Heading as="h1" size="xl" id="hero-heading">
          {t.hero.title}
        </Heading>
        <p className={styles.lead}>{t.hero.lead}</p>
        <WhatsAppContact contact={contact} interest="stay" label={t.hero.whatsappCta} />
      </Container>
    </section>
  );
}
