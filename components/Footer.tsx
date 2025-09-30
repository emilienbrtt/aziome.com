'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Logo + baseline (clic = retour accueil) */}
        <Link
          href="/"
          aria-label="Aziome — retour à l’accueil"
          className="inline-flex items-center gap-3"
        >
          <Image
            src="/logo-aziome.png"   // <- ton fichier dans /public
            alt="Aziome"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          <span className="text-fg">Aziome — Agents IA pour PME</span>
        </Link>

        {/* Liens légaux */}
        <nav className="flex gap-6">
          <Link href="/legal/terms" className="hover:text-fg transition">Mentions</Link>
          <Link href="/legal/privacy" className="hover:text-fg transition">Confidentialité</Link>
          <Link href="/legal/ai-charter" className="hover:text-fg transition">Charte IA</Link>
          <Link href="#contact" className="hover:text-fg transition">Contact</Link>
        </nav>

        {/* © */}
        <div className="opacity-80">
          © {new Date().getFullYear()} Aziome
        </div>
      </div>
    </footer>
  );
}
