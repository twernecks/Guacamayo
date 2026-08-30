import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/i18n/languages";
import type { LocalizedText } from "@/domain/admin/shared";

/**
 * Languages where `text` is empty/blank — used to block publishing a
 * content item with a required field missing in any of the three languages
 * (FR-012). An empty result means every language is filled in.
 */
export function validateRequiredPerLanguage(text: LocalizedText): LanguageCode[] {
  return SUPPORTED_LANGUAGES.filter((language) => !text[language]?.trim());
}
