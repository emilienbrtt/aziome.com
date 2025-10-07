// app/layout.tsx
import "../styles/globals.css";   // ✅ bon chemin (dossier frère de `app`)
import "../styles/tokens.css";    // ✅ si tu utilises tokens.css (il est présent dans /styles)

import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";

import CookieConsent from "../components/CookieConsent"; // ✅ dossier frère de `app`
import ChatWidget from "../components/ChatWidget";       // facultatif, stub “safe”

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aziome.com"),
  title: "Aziome – Agents IA pour automatiser vos tâches (SAV, CRM, Reporting)",
  description:
    "Aziome déploie des agents IA responsables qui s’intègrent à vos outils et automatisent vos tâches clés.",
  openGraph: {
    title: "Aziome – Agents IA",
    description: "Agents IA responsables qui s’intègrent à vos outils.",
    url: "https://aziome.com",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {children}

        {/* Overlays globaux */}
        <CookieConsent />
        <ChatWidget />

        {/* Si tu avais un script Plausible ici, déplace-le plutôt
            dans un composant client qui lit le consentement avant de l’injecter. */}
      </body>
    </html>
  );
}
