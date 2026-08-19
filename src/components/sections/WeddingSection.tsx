"use client";

import type { ContactChannels, EventSpace } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { WhatsAppContact } from "@/components/contact/WhatsAppContact";
import { ContactForm } from "@/components/contact/ContactForm";
import { useLanguage } from "@/i18n/LanguageContext";
import { MediaGallery } from "./MediaGallery";
import styles from "./WeddingSection.module.css";

type WeddingSectionProps = {
  wedding: EventSpace | undefined;
  contact: ContactChannels;
};

export function WeddingSection({ wedding, contact }: WeddingSectionProps) {
  const { t, localize } = useLanguage();

  if (!wedding) {
    return null;
  }

  const name = localize(wedding.name);

  return (
    <section id="casamentos" aria-labelledby="wedding-heading" className={styles.section}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t.wedding.eyebrow}</p>
          <Heading as="h2" size="lg" id="wedding-heading">
            {name}
          </Heading>
          <p className={styles.purpose}>{localize(wedding.purpose)}</p>
          <ul className={styles.highlights}>
            {t.wedding.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <div className={styles.ctas}>
            <WhatsAppContact contact={contact} interest="wedding" label={t.wedding.whatsappCta} />
            <ContactForm
              whatsappNumber={contact.whatsappNumber}
              defaultInterest="wedding"
              submitLabel={t.wedding.formSubmitLabel}
            />
          </div>
        </div>

        <MediaGallery
          images={wedding.images}
          emptyLabel={t.wedding.galleryEmptyLabel}
          ariaLabel={t.mediaGallery.photosAriaLabel(name)}
          sizes="(min-width: 60rem) 40vw, 100vw"
        />
      </Container>
    </section>
  );
}
