'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CardDef = {
  slug: string;
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;      // chemin de l’image (dans /public)
  blurb: string;      // phrase courte
};

const CARDS: CardDef[] = [
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: "Relance les clients au bon moment et récupère des ventes perdues." },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: "Répond vite, suit les commandes et passe à l’humain si besoin." },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: "Réunit vos chiffres et vous alerte quand quelque chose cloche." },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: "Accueil instantané : pose les bonnes questions et oriente bien." },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: "Gère les demandes internes et la paperasse sans retard." },
];

export default function Solutions() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // met à jour l’état des flèches
  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth - 1;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < maxScroll);
  };

  useEffect(() => {
    updateArrows();
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
    const el = trackRef.current;
    el?.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      el?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollByViewport = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth; // fait défiler d’un “écran” de cartes (1/2/3 selon la taille)
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* NAV flèches */}
      <div className="flex items-center justify-end gap-3 mb-4">
        <button
          onClick={() => scrollByViewport('prev')}
          disabled={!canPrev}
          className="h-10 w-10 rounded-full ring-1 ring-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 flex items-center justify-center transition"
          aria-label="Voir les précédents"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollByViewport('next')}
          disabled={!canNext}
          className="h-10 w-10 rounded-full ring-1 ring-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 flex items-center justify-center transition"
          aria-label="Voir les suivants"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* CARROUSEL */}
      <div
        ref={trackRef}
        className="
          flex gap-5 overflow-x-auto overscroll-x-contain scroll-smooth
          [scrollbar-width:none] [-ms-overflow-style:none]
          snap-x snap-mandatory
        "
        style={{ scrollPaddingLeft: 4, scrollPaddingRight: 4 }}
      >
        {/* masque scrollbar webkit */}
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {CARDS.map((c) => (
          <article
            key={c.slug}
            className="
              snap-start shrink-0
              w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]
              rounded-2xl ring-1 ring-white/10 bg-[#0b0b0b] overflow-hidden
              hover:ring-[rgba(212,175,55,0.35)] hover:shadow-[0_0_80px_rgba(212,175,55,0.25)]
              transition
            "
          >
            {/* IMAGE TOP avec dégradé bas */}
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 85vw, (max-width: 1024px) 48vw, 32vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* CONTENU bas */}
            <div className="p-5">
              <h3 className="text-xl font-semibold">{c.name}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{c.blurb}</p>
              <Link
                href={`/agents/${c.slug}`}
                className="mt-3 inline-block text-sm text-[color:var(--gold-1)]"
              >
                Voir les détails →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
