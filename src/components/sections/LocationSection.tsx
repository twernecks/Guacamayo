"use client";

import { useState } from "react";
import type { Location } from "@/domain/content";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./LocationSection.module.css";

type LocationSectionProps = {
  location: Location;
};

export function LocationSection({ location }: LocationSectionProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const canLoadMap = Boolean(location.mapEmbedUrl);

  return (
    <section id="localizacao" aria-labelledby="location-heading" className={styles.section}>
      <Container>
        <Heading as="h2" size="lg" id="location-heading">
          Localização
        </Heading>
        <p className={styles.address}>{location.address}</p>

        {isMapLoaded && canLoadMap ? (
          <iframe
            title="Mapa da localização da pousada"
            src={location.mapEmbedUrl}
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={styles.mapPlaceholder}>
            <p className={styles.privacyNotice}>
              O mapa interativo é fornecido por um serviço externo e só é carregado após sua
              autorização.
            </p>

            {canLoadMap ? (
              <Button type="button" variant="secondary" onClick={() => setIsMapLoaded(true)}>
                Carregar mapa
              </Button>
            ) : (
              <p className={styles.mapUnavailable}>O mapa interativo estará disponível em breve.</p>
            )}

            {location.fallbackMapUrl ? (
              <a
                href={location.fallbackMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fallbackLink}
              >
                Abrir localização em outro serviço de mapas
              </a>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
