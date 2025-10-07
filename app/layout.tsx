// app/layout.tsx
import "../../styles/globals.css";
import "../../styles/tokens.css";

import { Sora, Inter } from "next/font/google";
import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import CookieConsent from "@/components/CookieConsent";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aziome – Agents IA pour automatiser vos tâches (SAV, CRM, Reporting)",
  description:
    "Aziome déploie des agents IA responsables qui s’intègrent à vos outils et automatisent vos tâches clés.",
  openGraph: {
    title: "Aziome – Agents IA",
    description:
      "Agents IA responsables qui s’intègrent à vos outils.",
    type: "website",
    url: "https://aziome.com",
  },
  metadataBase: new URL("https://aziome.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {/* Plausible (remplace le domain si besoin) */}
        <script
          defer
          data-domain="aziome.com"
          src="https://plausible.io/js/script.js"
        />

        {children}

        {/* Widgets / Overlays en bas de body */}
        <ChatWidget />
        <CookieConsent />
      </body>
    </html>
  );
}
