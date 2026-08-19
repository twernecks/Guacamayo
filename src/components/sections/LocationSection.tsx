"use client";

import { useState } from "react";
import type { Location } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./LocationSection.module.css";

type LocationSectionProps = {
  location: Location;
};

export function LocationSection({ location }: LocationSectionProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { t } = useLanguage();
  const canLoadMap = Boolean(location.mapEmbedUrl);

  return (
    <section id="localizacao" aria-labelledby="location-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="location-heading">
          {t.location.heading}
        </Heading>
        <p className={styles.address}>{location.address}</p>

        {isMapLoaded && canLoadMap ? (
          <div className={styles.embeds}>
            <iframe
              title={t.location.mapTitle}
              src={location.mapEmbedUrl}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className={styles.streetView}>
              {location.streetViewEmbedUrl ? (
                <iframe
                  title={t.location.streetViewTitle}
                  src={location.streetViewEmbedUrl}
                  className={styles.map}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
              <p className={styles.streetViewNotice}>{t.location.streetViewUnavailableNotice}</p>
            </div>
          </div>
        ) : (
          <div className={styles.mapPlaceholder}>
            <p className={styles.privacyNotice}>{t.location.privacyNotice}</p>

            {canLoadMap ? (
              <Button type="button" variant="secondary" onClick={() => setIsMapLoaded(true)}>
                {t.location.loadMapButton}
              </Button>
            ) : (
              <p className={styles.mapUnavailable}>{t.location.mapUnavailable}</p>
            )}

            {location.fallbackMapUrl ? (
              <a
                href={location.fallbackMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fallbackLink}
              >
                {t.location.openInGoogleMapsLink}
              </a>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
