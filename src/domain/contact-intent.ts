export type ContactInterest = "stay" | "event" | "wedding";

export type ContactIntent = {
  name: string;
  phone: string;
  interest: ContactInterest;
  message?: string;
};

export type ContactIntentInput = {
  name: string;
  phone: string;
  interest: string;
  message?: string;
};

export type ContactIntentFieldErrors = Partial<Record<keyof ContactIntent, string>>;

export const CONTACT_INTERESTS: readonly ContactInterest[] = ["stay", "event", "wedding"];

export const CONTACT_INTENT_FIELD_ORDER: readonly (keyof ContactIntent)[] = [
  "name",
  "phone",
  "interest",
  "message",
];

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const MESSAGE_MAX_LENGTH = 1000;
const PHONE_MIN_DIGITS = 10;
const PHONE_PATTERN = /^[0-9()+\-.\s]+$/;

export function isContactInterest(value: string): value is ContactInterest {
  return (CONTACT_INTERESTS as readonly string[]).includes(value);
}

export function validateContactIntent(input: ContactIntentInput): ContactIntentFieldErrors {
  const errors: ContactIntentFieldErrors = {};

  const name = input.name.trim();
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `Informe um nome com ${NAME_MIN_LENGTH} a ${NAME_MAX_LENGTH} caracteres.`;
  }

  const phone = input.phone.trim();
  const phoneDigitCount = phone.replace(/\D/g, "").length;
  if (!PHONE_PATTERN.test(phone) || phoneDigitCount < PHONE_MIN_DIGITS) {
    errors.phone = "Informe um telefone válido, com DDD.";
  }

  if (!isContactInterest(input.interest)) {
    errors.interest = "Selecione o tipo de evento ou serviço.";
  }

  if (input.message && input.message.length > MESSAGE_MAX_LENGTH) {
    errors.message = `A mensagem deve ter no máximo ${MESSAGE_MAX_LENGTH} caracteres.`;
  }

  return errors;
}

export function isContactIntentValid(errors: ContactIntentFieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function getFirstInvalidField(
  errors: ContactIntentFieldErrors,
): keyof ContactIntent | undefined {
  return CONTACT_INTENT_FIELD_ORDER.find((field) => Boolean(errors[field]));
}

export function toContactIntent(input: ContactIntentInput): ContactIntent {
  if (!isContactInterest(input.interest)) {
    throw new Error(`Invalid contact interest: ${input.interest}`);
  }

  const message = input.message?.trim();

  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    interest: input.interest,
    ...(message ? { message } : {}),
  };
}
