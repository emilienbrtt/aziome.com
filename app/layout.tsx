import ChatWidget from "../components/ChatWidget";
import "./../styles/globals.css";
import "./../styles/tokens.css";
import { Sora, Inter } from "next/font/google";
import type { Metadata } from "next";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aziome — Agents IA pour automatiser vos tâches (SAV, CRM, Reporting)",
  description: "Aziome déploie des agents IA responsables qui s’intègrent à vos outils et automatisent vos tâches clés.",
  openGraph: {
    title: "Aziome — Agents IA",
    description: "Agents IA responsables qui s’intègrent à vos outils.",
    type: "website"
  },
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {/* Plausible (replace domain in data-domain) */}
        <script defer data-domain="aziome.example" src="https://plausible.io/js/script.js"></script>
        {children}
      </body>
    </html>
  );
}
