import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import type { LocalizedText } from "@/domain/content";

/** Test-fixture helper: same string in all three languages (fixtures don't need real translations). */
export function loc(pt: string): LocalizedText {
  return { pt, en: pt, es: pt };
}

export function renderWithLanguage(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: LanguageProvider, ...options });
}
