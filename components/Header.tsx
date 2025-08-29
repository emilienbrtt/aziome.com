"use client";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className="glass mx-4 md:mx-6 rounded-2xl px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 py-3">
          <div className="h-8 w-8 rounded-full" style={{background: "radial-gradient(circle at 30% 30%, var(--gold-2), var(--gold-1))"}} />
          <span className="font-semibold">Aziome</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#solutions" className="hover:text-fg">Solutions</a>
          <a href="#process" className="hover:text-fg">Méthode</a>
          <a href="#trust" className="hover:text-fg">Confiance</a>
          <a href="#contact" className="hover:text-fg">Contact</a>
        </nav>
        <div className="py-3">
          <Button href="#contact" variant="primary">Demander une démo</Button>
        </div>
      </div>
    </header>
  );
}
