import type { ContactChannels } from "@/domain/content";
import type { ContactInterest } from "@/domain/contact-intent";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Messages } from "@/i18n/messages";
import { Button } from "@/components/ui/Button";
import styles from "./WhatsAppContact.module.css";

type WhatsAppContactProps = {
  contact: ContactChannels;
  interest: ContactInterest;
  label?: string;
  variant?: "primary" | "accent";
};

function FallbackContact({
  phone,
  email,
  t,
}: {
  phone?: string;
  email?: string;
  t: Messages["whatsappContact"];
}) {
  if (!phone && !email) {
    return null;
  }

  return (
    <p className={styles.fallback}>
      {t.fallbackPrefix}{" "}
      {phone ? (
        <>
          {t.fallbackCallPrefix} <a href={`tel:${phone}`}>{phone}</a>
        </>
      ) : null}
      {phone && email ? ` ${t.fallbackConnector} ` : null}
      {email ? (
        <>
          {t.fallbackEmailPrefix} <a href={`mailto:${email}`}>{email}</a>
        </>
      ) : null}
      .
    </p>
  );
}

export function WhatsAppContact({
  contact,
  interest,
  label,
  variant = "accent",
}: WhatsAppContactProps) {
  const { language, t } = useLanguage();
  const whatsappUrl = buildContextualWhatsAppUrl(contact.whatsappNumber, interest, language);

  return (
    <div className={styles.wrapper}>
      <Button href={whatsappUrl} variant={variant} target="_blank" rel="noopener noreferrer">
        {label ?? t.whatsappContact.defaultLabel}
      </Button>
      <FallbackContact phone={contact.phone} email={contact.email} t={t.whatsappContact} />
    </div>
  );
}
