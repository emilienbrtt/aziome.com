// /app/layout.tsx
import "./globals.css";                       // ← IMPORTANT (./, pas ../)
import ChatWidget from "../components/ChatWidget"; // ton widget global

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
