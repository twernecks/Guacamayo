import { describe, expect, it } from "vitest";
import type { LanguageCode } from "@/i18n/languages";
import {
  buildContextualWhatsAppMessage,
  buildWhatsAppMessage,
  interestLabel,
} from "@/lib/whatsapp";

const LANGUAGES: LanguageCode[] = ["pt", "en", "es"];

describe("interestLabel", () => {
  it("returns a label in each supported language", () => {
    expect(interestLabel("stay", "pt")).toBe("hospedagem");
    expect(interestLabel("stay", "en")).toBe("a stay");
    expect(interestLabel("stay", "es")).toBe("alojamiento");
  });
});

describe("buildContextualWhatsAppMessage", () => {
  it.each(LANGUAGES)("builds a message entirely in %s", (language) => {
    const message = buildContextualWhatsAppMessage("wedding", language);
    expect(message).toContain(interestLabel("wedding", language));
  });

  it("does not mix languages when building the message", () => {
    const enMessage = buildContextualWhatsAppMessage("event", "en");
    const esMessage = buildContextualWhatsAppMessage("event", "es");

    expect(enMessage).not.toBe(esMessage);
    expect(enMessage).toContain("Hello!");
    expect(esMessage).toContain("¡Hola!");
  });
});

describe("buildWhatsAppMessage", () => {
  it.each(LANGUAGES)("builds a full contact message in %s", (language) => {
    const message = buildWhatsAppMessage(
      {
        name: "Maria Silva",
        phone: "11912345678",
        interest: "stay",
        message: "Test message",
      },
      language,
    );

    expect(message).toContain("Maria Silva");
    expect(message).toContain("11912345678");
    expect(message).toContain(interestLabel("stay", language));
  });
});
