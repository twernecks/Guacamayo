"use client";

import Image from "next/image";
import type { ContactChannels, Media } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { useLanguage } from "@/i18n/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  contact: ContactChannels;
  image: Media;
};

export function HeroSection({ contact, image }: HeroSectionProps) {
  const { t, localize } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="inicio" aria-labelledby="hero-heading" className={styles.hero}>
      <Image
        src={image.src}
        alt={localize(image.alt)}
        fill
        priority
        sizes="100vw"
        className={styles.photo}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <Container className={styles.overlay}>
        <div
          ref={ref}
          className={`${styles.inner} scrollReveal ${isVisible ? "isRevealed" : ""}`}
        >
          <p className={styles.eyebrow}>{t.hero.eyebrow}</p>
          <Heading as="h1" size="xl" id="hero-heading" className={styles.title}>
            {t.hero.title}
          </Heading>
          <p className={styles.lead}>{t.hero.lead}</p>
          <WhatsAppContact contact={contact} interest="stay" label={t.hero.whatsappCta} />
        </div>
      </Container>
    </section>
  );
}
