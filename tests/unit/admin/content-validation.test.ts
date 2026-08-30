import { describe, expect, it } from "vitest";
import { validateRequiredPerLanguage } from "@/domain/admin/content-validation";

describe("validateRequiredPerLanguage", () => {
  it("returns an empty list when every language is filled in", () => {
    expect(validateRequiredPerLanguage({ pt: "Quarto", en: "Room", es: "Habitación" })).toEqual([]);
  });

  it("returns the languages with an empty string", () => {
    expect(validateRequiredPerLanguage({ pt: "Quarto", en: "", es: "" })).toEqual(["en", "es"]);
  });

  it("treats whitespace-only text as empty", () => {
    expect(validateRequiredPerLanguage({ pt: "Quarto", en: "   ", es: "Habitación" })).toEqual(["en"]);
  });

  it("returns all three languages when the whole field is empty", () => {
    expect(validateRequiredPerLanguage({ pt: "", en: "", es: "" })).toEqual(["pt", "en", "es"]);
  });
});
