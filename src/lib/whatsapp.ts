import type { ContactIntent, ContactInterest } from "@/domain/contact-intent";
import type { LanguageCode } from "@/i18n/languages";
import { MESSAGES } from "@/i18n/messages";

export function interestLabel(interest: ContactInterest, language: LanguageCode): string {
  return MESSAGES[language].contactInterest[interest];
}

export function buildWhatsAppMessage(intent: ContactIntent, language: LanguageCode): string {
  const t = MESSAGES[language];
  const lines = [
    t.whatsappMessage.greetingWithName(intent.name),
    t.whatsappMessage.interestLine(interestLabel(intent.interest, language)),
    t.whatsappMessage.phoneLine(intent.phone),
  ];

  if (intent.message) {
    lines.push(t.whatsappMessage.messageLine(intent.message));
  }

  return lines.join("\n");
}

export function buildContextualWhatsAppMessage(
  interest: ContactInterest,
  language: LanguageCode,
): string {
  return MESSAGES[language].whatsappMessage.contextualGreeting(interestLabel(interest, language));
}

function sanitizeWhatsAppNumber(whatsappNumber: string): string {
  return whatsappNumber.replace(/\D/g, "");
}

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digits = sanitizeWhatsAppNumber(whatsappNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encodedMessage}`;
}

export function buildContactIntentWhatsAppUrl(
  whatsappNumber: string,
  intent: ContactIntent,
  language: LanguageCode,
): string {
  return buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(intent, language));
}

export function buildContextualWhatsAppUrl(
  whatsappNumber: string,
  interest: ContactInterest,
  language: LanguageCode,
): string {
  return buildWhatsAppUrl(whatsappNumber, buildContextualWhatsAppMessage(interest, language));
}
