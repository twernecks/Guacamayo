"use client";

import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./LanguageSelector.module.css";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const groupLabel = `${t.languageSelector.label} (${t.languageSelector.current(LANGUAGE_LABELS[language])})`;

  return (
    <div className={styles.wrapper} role="group" aria-label={groupLabel}>
      {SUPPORTED_LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={styles.option}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
        >
          {LANGUAGE_LABELS[code]}
        </button>
      ))}
      {/* Present from first mount so only *changes* after that are announced —
          live regions do not announce their initial content (FR-010). */}
      <p aria-live="polite" className="visually-hidden">
        {t.languageSelector.switchedAnnouncement(LANGUAGE_LABELS[language])}
      </p>
    </div>
  );
}
