export type LanguageCode = "pt" | "en" | "es";

export const DEFAULT_LANGUAGE: LanguageCode = "pt";

export const SUPPORTED_LANGUAGES: LanguageCode[] = ["pt", "en", "es"];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};
