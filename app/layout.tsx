// app/layout.tsx
import "./globals.css"; // on met le CSS global DANS app/ (voir fichier plus bas)

import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";

// Ces deux composants sont des "client components"
import CookieConsent from "../components/CookieConsent";
import ChatWidget from "../components/ChatWidget"; // safe stub fourni plus bas

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
      </body>
    </html>
  );
}
