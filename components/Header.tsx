"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
        {/* LOGO */}
        <Link
          href="/"
          aria-label="Aziome"
          className="group flex items-center gap-3 md:gap-4 shrink-0 py-3"
        >
          <Image
            src="/logo-aziome.png"
            alt="Aziome"
            width={56}
            height={56}
            priority
            className="h-12 w-12 md:h-14 md:w-14 object-contain"
          />
          <span className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#D4AF37] to-[#D6C07B] bg-clip-text text-transparent tracking-tight">
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

        {/* CTA — mène au formulaire, même gradient doré */}
        <div className="py-3">
          <a
            href="/#contact"
            className="inline-flex items-center rounded-md px-4 py-2 font-medium text-black
                       bg-gradient-to-r from-[#D4AF37] via-[#EAD588] to-white
                       shadow hover:shadow-lg transition"
          >
            Demander une démo
          </a>
        </div>
      </div>
    </header>
  );
}
