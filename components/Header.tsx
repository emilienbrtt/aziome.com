"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className="glass mx-4 md:mx-6 rounded-2xl px-4 md:px-6 flex items-center justify-between">
        {/* LOGO (plus grand + lisible) */}
        <Link href="/" aria-label="Aziome" className="group flex items-center gap-3 md:gap-4 shrink-0 py-3">
          <Image
            src="/logo-aziome.svg"   // <-- adapte si ton fichier a un autre nom
            alt=""
            width={56}
            height={56}
            priority
            className="h-12 w-12 md:h-14 md:w-14 [filter:drop-shadow(0_0_30px_rgba(212,175,55,.35))] transition-transform group-hover:scale-105"
          />
          <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#D4AF37] to-[#F6E7B2] bg-clip-text text-transparent tracking-tight">
            Aziome
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#solutions" className="hover:text-fg">Solutions</a>
          <a href="#process" className="hover:text-fg">Méthode</a>
          <a href="#trust" className="hover:text-fg">Confiance</a>
          <a href="#contact" className="hover:text-fg">Contact</a>
        </nav>

        {/* CTA */}
        <div className="py-3">
          <Button href="#contact" variant="primary">Demander une démo</Button>
        </div>
      </div>
    </header>
  );
}
