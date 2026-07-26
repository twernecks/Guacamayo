import type { ContactChannels } from "@/domain/content";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { Container } from "./Container";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  contact: ContactChannels;
};

export function SiteFooter({ contact }: SiteFooterProps) {
  const whatsappUrl = buildContextualWhatsAppUrl(contact.whatsappNumber, "stay");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div>
          <p className={styles.address}>{contact.address}</p>
          <ul className={styles.channels}>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {contact.phone ? (
              <li>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </li>
            ) : null}
            {contact.email ? (
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            ) : null}
          </ul>
        </div>
        <p className={styles.copyright}>© {year} Pousada. Todos os direitos reservados.</p>
      </Container>
    </footer>
  );
}
