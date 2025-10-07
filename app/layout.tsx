// app/layout.tsx
import "../styles/globals.css";
// ⬇️ Si vous n'avez pas tokens.css, supprimez simplement cette ligne.
import "../styles/tokens.css";

import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";

// Ces composants sont des Client Components : on les charge sans SSR
const ChatWidget = dynamic(() => import("../components/ChatWidget"), { ssr: false });
const CookieConsent = dynamic(() => import("../components/CookieConsent"), { ssr: false });

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aziome – Agents IA pour automatiser vos tâches (SAV, CRM, Reporting)",
  description:
    "Aziome déploie des agents IA responsables qui s’intègrent à vos outils et automatisent vos tâches clés.",
  metadataBase: new URL("https://aziome.com"),
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
        {/* Plausible analytics */}
        <Script
          defer
          data-domain="aziome.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />

        {children}

        {/* Overlays globaux */}
        <ChatWidget />
        <CookieConsent />
      </body>
    </html>
  );
}
