"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type LanguageCode } from "./languages";
import { MESSAGES, type Messages } from "./messages";
import type { LocalizedText } from "@/domain/content";

const STORAGE_KEY = "guacamayo:language";

function readStoredLanguage(): LanguageCode | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as string[]).includes(stored)) {
      return stored as LanguageCode;
    }
  } catch {
    // Storage blocked (e.g. private browsing) or not yet available (SSR) —
    // session-only state applies (FR-011).
  }
  return null;
}

// A tiny external store for the language preference, one instance per
// `LanguageProvider` mount, read via `useSyncExternalStore` instead of a
// `useEffect` that calls setState on mount — the React-recommended way to
// sync external state that may legitimately differ from the server-rendered
// value. React itself guarantees the first client paint still matches
// `getServerSnapshot()` (always Portuguese) and only resyncs to the real
// stored value right after, which is exactly the "server/first render is
// always Portuguese, the saved preference applies right after" behavior
// research.md Decision 2 calls for — without a hydration mismatch.
function createLanguageStore() {
  let currentLanguage: LanguageCode = readStoredLanguage() ?? DEFAULT_LANGUAGE;
  const listeners = new Set<() => void>();

  return {
    setLanguage(next: LanguageCode) {
      currentLanguage = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Best-effort only — the switch itself must not fail when storage is blocked (FR-011).
      }
      listeners.forEach((listener) => listener());
    },
    subscribe(callback: () => void) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot(): LanguageCode {
      return currentLanguage;
    },
    getServerSnapshot(): LanguageCode {
      return DEFAULT_LANGUAGE;
    },
  };
}

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: Messages;
  localize: (text: LocalizedText) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [store] = useState(createLanguageStore);
  const language = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  // Keeps the document's `lang` attribute in step with the rendered content
  // (FR-010) — both are driven by the same `language` value.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: LanguageCode) => store.setLanguage(next), [store]);

  // Falls back to the default language when a key is missing (FR-007). Valid,
  // approved content always has all three languages filled in (data-model.md
  // validation rule), so this fallback is a defensive safety net rather than
  // an expected runtime path.
  const localize = useCallback(
    (text: LocalizedText) => text[language] || text[DEFAULT_LANGUAGE],
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, t: MESSAGES[language], localize }),
    [language, setLanguage, localize],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslations(): Messages {
  return useLanguage().t;
}
