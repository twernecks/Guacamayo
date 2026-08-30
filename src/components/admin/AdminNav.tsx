"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import { LogoutIcon } from "@/components/ui/icons/LogoutIcon";
import styles from "./AdminNav.module.css";

type NavLink = { href: string; label: string };

const NAV_LINKS: NavLink[] = [
  { href: "/admin/rooms", label: "Quartos" },
  { href: "/admin/event-spaces", label: "Espaços de Evento" },
  { href: "/admin/testimonials", label: "Depoimentos" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/site-settings", label: "Configurações do Site" },
];

export function AdminNav() {
  const { admin, logout } = useAdminAuth();
  const pathname = usePathname();

  function handleLogout() {
    // FR-005: the local session is always cleared by logout() itself (see
    // AdminAuthContext); a failed server-side revoke (e.g. network down) has
    // nothing further for this button to react to, so it's swallowed here
    // rather than left as an unhandled promise rejection.
    logout().catch(() => {});
  }

  return (
    <header className={`admin-nav ${styles.header}`}>
      <nav aria-label="Navegação administrativa" className={`admin-nav__links ${styles.nav}`}>
        <span className={`admin-nav__title ${styles.title}`}>Painel administrativo</span>
        <ul className={styles.list}>
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href) ?? false;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={`admin-nav__session ${styles.session}`}>
        {admin ? <span className={styles.displayName}>{admin.displayName}</span> : null}
        <Button type="button" variant="secondary" onClick={handleLogout}>
          <LogoutIcon className={styles.icon} />
          Sair
        </Button>
      </div>
    </header>
  );
}
