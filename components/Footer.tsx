'use client';
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full" style={{background: "radial-gradient(circle at 30% 30%, var(--gold-2), var(--gold-1))"}} />
          <span>Aziome — Agents IA pour PME</span>
        </div>
        <nav className="flex gap-6">
          <a href="/legal/terms">Mentions</a>
          <a href="/legal/privacy">Confidentialité</a>
          <a href="/legal/ai-charter">Charte IA</a>
          <a href="#contact">Contact</a>
        </nav>
        <div>© {new Date().getFullYear()} Aziome</div>
      </div>
    </footer>
  );
}
