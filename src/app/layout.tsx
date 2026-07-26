import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  // "optional" (not "swap"): the H1 is the LCP element on this page, and a
  // font swap after first paint can delay the LCP timestamp. This keeps the
  // fallback font on slow connections instead of trading LCP for brand font.
  display: "optional",
});

const SITE_TITLE = "Pousada — Hospedagem, Casamentos e Eventos";
const SITE_DESCRIPTION =
  "Pousada com quartos aconchegantes, espaço para casamentos em destaque, eventos e " +
  "contato direto por WhatsApp, cercada pela natureza.";

/**
 * Copy below is placeholder marketing text pending business-approved wording
 * (see src/data/pousada-content.ts). SITE_URL is a placeholder domain (see
 * src/lib/site.ts) until the pousada's real domain is available.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Pousada",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Pousada",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
