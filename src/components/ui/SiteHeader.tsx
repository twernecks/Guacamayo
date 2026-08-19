"use client";

import { useEffect, useState } from "react";
import type { ContactChannels } from "@/domain/content";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "./Button";
import { Container } from "./Container";
import styles from "./SiteHeader.module.css";

const DESKTOP_MEDIA_QUERY = "(min-width: 60rem)";

type SiteHeaderProps = {
  contact: ContactChannels;
};

export function SiteHeader({ contact }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  const whatsappUrl = buildContextualWhatsAppUrl(contact.whatsappNumber, "stay", language);

  const navItems = [
    { href: "#quartos", label: t.nav.rooms },
    { href: "#casamentos", label: t.nav.weddings },
    { href: "#eventos", label: t.nav.events },
    { href: "#relatos", label: t.nav.testimonials },
    { href: "#localizacao", label: t.nav.location },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", closeOnDesktop);
    return () => mediaQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <a href="#conteudo-principal" className={styles.skipLink}>
        {t.skipLink}
      </a>
      <header className={styles.header}>
        <Container className={styles.inner}>
          <a href="#inicio" className={styles.brand}>
            {t.brand}
          </a>

          <nav
            id="primary-navigation"
            aria-label={t.nav.ariaLabel}
            className={styles.nav}
            data-open={isOpen}
          >
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <LanguageSelector />

            <Button
              href={whatsappUrl}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappAction}
            >
              {t.header.whatsappCta}
            </Button>

            <button
              type="button"
              className={styles.menuToggle}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span className="visually-hidden">
                {isOpen ? t.menuToggle.close : t.menuToggle.open}
              </span>
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                {isOpen ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </svg>
            </button>
          </div>
        </Container>
      </header>
    </>
  );
}
