import { describe, expect, it } from "vitest";
import {
  getFirstInvalidField,
  isContactIntentValid,
  toContactIntent,
  validateContactIntent,
} from "@/domain/contact-intent";
import {
  buildContactIntentWhatsAppUrl,
  buildContextualWhatsAppUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  interestLabel,
} from "@/lib/whatsapp";

const VALID_INPUT = {
  name: "Maria Silva",
  phone: "(11) 91234-5678",
  interest: "wedding",
  message: "Gostaria de um orçamento.",
};

describe("validateContactIntent", () => {
  it("returns no errors for valid input", () => {
    const errors = validateContactIntent(VALID_INPUT, "pt");

    expect(errors).toEqual({});
    expect(isContactIntentValid(errors)).toBe(true);
  });

  it("requires a name between 2 and 80 characters", () => {
    expect(validateContactIntent({ ...VALID_INPUT, name: "A" }, "pt").name).toBeDefined();
    expect(
      validateContactIntent({ ...VALID_INPUT, name: "a".repeat(81) }, "pt").name,
    ).toBeDefined();
  });

  it("rejects a phone without enough digits", () => {
    const errors = validateContactIntent({ ...VALID_INPUT, phone: "123" }, "pt");

    expect(errors.phone).toBeDefined();
  });

  it("rejects an interest outside stay, event or wedding", () => {
    const errors = validateContactIntent({ ...VALID_INPUT, interest: "invalid" }, "pt");

    expect(errors.interest).toBeDefined();
  });

  it("rejects a message longer than 1000 characters", () => {
    const errors = validateContactIntent({ ...VALID_INPUT, message: "a".repeat(1001) }, "pt");

    expect(errors.message).toBeDefined();
  });

  it("allows an empty optional message", () => {
    const errors = validateContactIntent({ ...VALID_INPUT, message: "" }, "pt");

    expect(errors.message).toBeUndefined();
  });

  it("returns error messages in the requested language", () => {
    const errors = validateContactIntent({ ...VALID_INPUT, name: "A" }, "en");

    expect(errors.name).toBe("Enter a name with 2 to 80 characters.");
  });
});

describe("getFirstInvalidField", () => {
  it("returns fields in name, phone, interest, message order", () => {
    const errors = validateContactIntent(
      {
        name: "",
        phone: "",
        interest: "invalid",
        message: "",
      },
      "pt",
    );

    expect(getFirstInvalidField(errors)).toBe("name");
  });

  it("returns undefined when there are no errors", () => {
    expect(getFirstInvalidField({})).toBeUndefined();
  });
});

describe("toContactIntent", () => {
  it("trims fields and omits an empty message", () => {
    const intent = toContactIntent({
      name: "  Maria Silva  ",
      phone: " (11) 91234-5678 ",
      interest: "wedding",
      message: "   ",
    });

    expect(intent).toEqual({
      name: "Maria Silva",
      phone: "(11) 91234-5678",
      interest: "wedding",
    });
  });

  it("throws for an invalid interest", () => {
    expect(() => toContactIntent({ ...VALID_INPUT, interest: "invalid" })).toThrow();
  });
});

describe("buildWhatsAppMessage", () => {
  it("includes name, interest label, phone and message", () => {
    const message = buildWhatsAppMessage(
      {
        name: "Maria Silva",
        phone: "11912345678",
        interest: "wedding",
        message: "Gostaria de um orçamento.",
      },
      "pt",
    );

    expect(message).toContain("Maria Silva");
    expect(message).toContain(interestLabel("wedding", "pt"));
    expect(message).toContain("11912345678");
    expect(message).toContain("Gostaria de um orçamento.");
  });

  it("omits the message line when there is no message", () => {
    const message = buildWhatsAppMessage(
      {
        name: "Maria Silva",
        phone: "11912345678",
        interest: "stay",
      },
      "pt",
    );

    expect(message).not.toContain("Mensagem:");
  });
});

describe("buildWhatsAppUrl", () => {
  it("strips non-numeric characters from the phone number and encodes the message", () => {
    const url = buildWhatsAppUrl("+55 (11) 91234-5678", "Olá! Preço?");

    expect(url).toBe("https://wa.me/5511912345678?text=Ol%C3%A1!%20Pre%C3%A7o%3F");
  });
});

describe("buildContextualWhatsAppUrl", () => {
  it("builds a wa.me link with a message mentioning the interest", () => {
    const url = buildContextualWhatsAppUrl("+5500000000000", "event", "pt");

    expect(url).toMatch(/^https:\/\/wa\.me\/5500000000000\?text=/);
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toContain(
      interestLabel("event", "pt"),
    );
  });
});

describe("buildContactIntentWhatsAppUrl", () => {
  it("builds a wa.me link carrying the full contact intent message", () => {
    const url = buildContactIntentWhatsAppUrl(
      "+5500000000000",
      {
        name: "Maria Silva",
        phone: "11912345678",
        interest: "wedding",
      },
      "pt",
    );

    const decoded = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(decoded).toContain("Maria Silva");
    expect(decoded).toContain(interestLabel("wedding", "pt"));
  });
});
