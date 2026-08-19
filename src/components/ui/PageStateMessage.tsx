"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./PageStateMessage.module.css";

type PageStateMessageProps =
  | { kind: "error"; message: string }
  | { kind: "empty" }
  | { kind: "loading" };

export function PageStateMessage(props: PageStateMessageProps) {
  const { t } = useLanguage();

  if (props.kind === "error") {
    return (
      <main className={styles.stateMessage}>
        <p role="alert">{t.contactStates.error(props.message)}</p>
      </main>
    );
  }

  if (props.kind === "empty") {
    return (
      <main className={styles.stateMessage}>
        <p>{t.contactStates.empty}</p>
      </main>
    );
  }

  return (
    <main className={styles.stateMessage}>
      <p>{t.contactStates.loading}</p>
    </main>
  );
}
