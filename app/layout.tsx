import "../globals.css";
import ChatWidget from "../components/ChatWidget"; // chemin RELATIF

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
