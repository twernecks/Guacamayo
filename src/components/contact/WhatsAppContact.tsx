import type { ContactChannels } from "@/domain/content";
import type { ContactInterest } from "@/domain/contact-intent";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import styles from "./WhatsAppContact.module.css";

type WhatsAppContactProps = {
  contact: ContactChannels;
  interest: ContactInterest;
  label?: string;
  variant?: "primary" | "accent";
};

function FallbackContact({ phone, email }: { phone?: string; email?: string }) {
  if (!phone && !email) {
    return null;
  }

  return (
    <p className={styles.fallback}>
      Prefere outro canal?{" "}
      {phone ? (
        <>
          Ligue em <a href={`tel:${phone}`}>{phone}</a>
        </>
      ) : null}
      {phone && email ? " ou " : null}
      {email ? (
        <>
          envie um e-mail para <a href={`mailto:${email}`}>{email}</a>
        </>
      ) : null}
      .
    </p>
  );
}

export function WhatsAppContact({
  contact,
  interest,
  label = "Falar no WhatsApp",
  variant = "accent",
}: WhatsAppContactProps) {
  const whatsappUrl = buildContextualWhatsAppUrl(contact.whatsappNumber, interest);

  return (
    <div className={styles.wrapper}>
      <Button href={whatsappUrl} variant={variant} target="_blank" rel="noopener noreferrer">
        {label}
      </Button>
      <FallbackContact phone={contact.phone} email={contact.email} />
    </div>
  );
}
