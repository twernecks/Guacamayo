"use client";

import { useId, useRef, useState, type FormEvent, type RefObject } from "react";
import {
  CONTACT_INTERESTS,
  getFirstInvalidField,
  isContactIntentValid,
  toContactIntent,
  validateContactIntent,
  type ContactInterest,
  type ContactIntent,
  type ContactIntentFieldErrors,
} from "@/domain/contact-intent";
import { buildContactIntentWhatsAppUrl, interestLabel } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import styles from "./ContactForm.module.css";

type ContactFormProps = {
  whatsappNumber: string;
  defaultInterest?: ContactInterest;
  submitLabel?: string;
};

type FieldRefs = {
  [K in keyof ContactIntent]: RefObject<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
  >;
};

export function ContactForm({
  whatsappNumber,
  defaultInterest = "stay",
  submitLabel,
}: ContactFormProps) {
  const formId = useId();
  const { language, t } = useLanguage();
  const resolvedSubmitLabel = submitLabel ?? t.contactForm.submitLabel;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<ContactInterest>(defaultInterest);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactIntentFieldErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const interestRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: FieldRefs = {
    name: nameRef,
    phone: phoneRef,
    interest: interestRef,
    message: messageRef,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fieldErrors = validateContactIntent({ name, phone, interest, message }, language);
    setErrors(fieldErrors);

    if (!isContactIntentValid(fieldErrors)) {
      const firstInvalidField = getFirstInvalidField(fieldErrors);
      if (firstInvalidField) {
        fieldRefs[firstInvalidField]?.current?.focus();
      }
      return;
    }

    const intent = toContactIntent({ name, phone, interest, message });
    const whatsappUrl = buildContactIntentWhatsAppUrl(whatsappNumber, intent, language);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor={`${formId}-name`}>{t.contactForm.nameLabel}</label>
        <input
          id={`${formId}-name`}
          ref={nameRef}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
        />
        {errors.name ? (
          <p id={`${formId}-name-error`} role="alert" className={styles.error}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-phone`}>{t.contactForm.phoneLabel}</label>
        <input
          id={`${formId}-phone`}
          ref={phoneRef}
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
        />
        {errors.phone ? (
          <p id={`${formId}-phone-error`} role="alert" className={styles.error}>
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-interest`}>{t.contactForm.interestLabel}</label>
        <select
          id={`${formId}-interest`}
          ref={interestRef}
          value={interest}
          onChange={(event) => setInterest(event.target.value as ContactInterest)}
          aria-invalid={Boolean(errors.interest)}
          aria-describedby={errors.interest ? `${formId}-interest-error` : undefined}
        >
          {CONTACT_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {interestLabel(option, language)}
            </option>
          ))}
        </select>
        {errors.interest ? (
          <p id={`${formId}-interest-error`} role="alert" className={styles.error}>
            {errors.interest}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-message`}>{t.contactForm.messageLabel}</label>
        <textarea
          id={`${formId}-message`}
          ref={messageRef}
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
        />
        {errors.message ? (
          <p id={`${formId}-message-error`} role="alert" className={styles.error}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" variant="accent">
        {resolvedSubmitLabel}
      </Button>
    </form>
  );
}
