"use client";

import { useState } from "react";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n/languages";
import type { LocalizedText } from "@/domain/admin/shared";
import { Field } from "@/components/admin/ui/Field";
import styles from "./LanguageTabs.module.css";

type LanguageTabsProps = {
  id: string;
  label: string;
  value: LocalizedText;
  onChange: (next: LocalizedText) => void;
  multiline?: boolean;
  /** Languages to visually flag (e.g. missing a required value — FR-012). */
  missingLanguages?: LanguageCode[];
};

/**
 * One multilingual field (name, description, quote, ...): a language
 * selector plus the text input for whichever language is currently active.
 * Reused by every content form (Room/Event Space/Testimonial — FR-010).
 */
export function LanguageTabs({
  id,
  label,
  value,
  onChange,
  multiline,
  missingLanguages = [],
}: LanguageTabsProps) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const fieldId = `${id}-${activeLanguage}`;

  function handleTextChange(text: string) {
    onChange({ ...value, [activeLanguage]: text });
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
      <div role="group" aria-label={`Idioma de ${label}`} className={styles.tabs}>
        {SUPPORTED_LANGUAGES.map((language) => (
          <button
            key={language}
            type="button"
            aria-pressed={language === activeLanguage}
            onClick={() => setActiveLanguage(language)}
            className={
              language === activeLanguage ? `${styles.tab} ${styles.tabActive}` : styles.tab
            }
          >
            {LANGUAGE_LABELS[language]}
            {missingLanguages.includes(language) ? <span className={styles.missing}> *</span> : null}
          </button>
        ))}
      </div>
      <Field label={`${label} (${LANGUAGE_LABELS[activeLanguage]})`} htmlFor={fieldId}>
        {multiline ? (
          <textarea id={fieldId} value={value[activeLanguage]} onChange={(event) => handleTextChange(event.target.value)} />
        ) : (
          <input
            id={fieldId}
            type="text"
            value={value[activeLanguage]}
            onChange={(event) => handleTextChange(event.target.value)}
          />
        )}
      </Field>
    </fieldset>
  );
}
