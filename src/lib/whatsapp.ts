import type { ContactIntent, ContactInterest } from "@/domain/contact-intent";

const INTEREST_LABELS: Record<ContactInterest, string> = {
  stay: "hospedagem",
  event: "evento",
  wedding: "casamento",
};

export function interestLabel(interest: ContactInterest): string {
  return INTEREST_LABELS[interest];
}

export function buildWhatsAppMessage(intent: ContactIntent): string {
  const lines = [
    `Olá! Meu nome é ${intent.name}.`,
    `Tenho interesse em: ${interestLabel(intent.interest)}.`,
    `Telefone para contato: ${intent.phone}.`,
  ];

  if (intent.message) {
    lines.push(`Mensagem: ${intent.message}`);
  }

  return lines.join("\n");
}

export function buildContextualWhatsAppMessage(interest: ContactInterest): string {
  return `Olá! Tenho interesse em ${interestLabel(interest)} na pousada.`;
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
): string {
  return buildWhatsAppUrl(whatsappNumber, buildWhatsAppMessage(intent));
}

export function buildContextualWhatsAppUrl(
  whatsappNumber: string,
  interest: ContactInterest,
): string {
  return buildWhatsAppUrl(whatsappNumber, buildContextualWhatsAppMessage(interest));
}
