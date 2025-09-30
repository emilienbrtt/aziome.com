'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Marque */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-6 w-6 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,214,102,0.85), rgba(212,175,55,0.65) 60%, rgba(212,175,55,0.15) 100%)',
              boxShadow: '0 0 22px rgba(212,175,55,0.45)',
            }}
          />
          <span className="text-white/90">Aziome — Agents IA pour PME</span>
        </div>

        {/* Navigation légale */}
        <nav aria-label="Liens légaux" className="flex items-center gap-8">
          <Link
            href="/legal/terms"
            className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-1)]/50 rounded"
          >
            Mentions
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-1)]/50 rounded"
          >
            Confidentialité
          </Link>
          <Link
            href="/legal/ai-charter"
            className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-1)]/50 rounded"
          >
            Charte IA
          </Link>
          <Link
            href="#contact"
            className="hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-1)]/50 rounded"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-white/70">© {year} Aziome</div>
      </div>
    </footer>
  );
}
