"use client";

import { useEffect, useState } from "react";
import type { ContactChannels } from "@/domain/content";
import { buildContextualWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "./Button";
import { Container } from "./Container";
import styles from "./SiteHeader.module.css";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#quartos", label: "Quartos" },
  { href: "#casamentos", label: "Casamentos" },
  { href: "#eventos", label: "Eventos" },
  { href: "#relatos", label: "Relatos" },
  { href: "#localizacao", label: "Localização" },
];

const DESKTOP_MEDIA_QUERY = "(min-width: 60rem)";

type SiteHeaderProps = {
  contact: ContactChannels;
};

export function SiteHeader({ contact }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = buildContextualWhatsAppUrl(contact.whatsappNumber, "stay");

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
        Pular para o conteúdo principal
      </a>
      <header className={styles.header}>
        <Container className={styles.inner}>
          <a href="#inicio" className={styles.brand}>
            Pousada
          </a>

          <nav
            id="primary-navigation"
            aria-label="Navegação principal"
            className={styles.nav}
            data-open={isOpen}
          >
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button
              href={whatsappUrl}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappAction}
            >
              Falar no WhatsApp
            </Button>

            <button
              type="button"
              className={styles.menuToggle}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span className="visually-hidden">
                {isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
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
