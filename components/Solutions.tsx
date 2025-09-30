'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CardDef = {
  slug: string;
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;
  blurb: string;
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

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth - 1;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < maxScroll);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    const onScroll = () => updateArrows();
    const onResize = () => updateArrows();
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
    const amount = el.clientWidth; // 1 écran de cartes (1/2/3 selon la largeur)
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* CONTENEUR RELATIF pour placer les flèches aux DEUX côtés */}
      <div className="relative">
        {/* Flèche GAUCHE */}
        <button
          onClick={() => scrollByViewport('prev')}
          disabled={!canPrev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-8px] lg:left-[-14px] top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 rounded-full border border-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur disabled:opacity-40 disabled:hover:bg-white/5 transition"
          aria-label="Voir les précédents"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Flèche DROITE */}
        <button
          onClick={() => scrollByViewport('next')}
          disabled={!canNext}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-8px] lg:right-[-14px] top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 rounded-full border border-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur disabled:opacity-40 disabled:hover:bg-white/5 transition"
          aria-label="Voir les suivants"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* PISTE SCROLLABLE */}
        <div
          ref={trackRef}
          className="
            flex gap-5 overflow-x-auto overscroll-x-contain scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none]
            snap-x snap-mandatory px-1
          "
          style={{ scrollPaddingLeft: 4, scrollPaddingRight: 4 }}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

          {CARDS.map((c) => (
            <article
              key={c.slug}
              className="
                snap-start shrink-0
                w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]
                rounded-2xl overflow-hidden
                border border-white/12 bg-[#0b0b0b]
                hover:border-[rgba(212,175,55,0.45)]
                hover:shadow-[0_0_80px_rgba(212,175,55,0.25)]
                transition
              "
            >
              {/* IMAGE HAUTE + DÉGRADÉ BAS LARGE */}
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 48vw, 32vw"
                  className="object-cover object-top select-none"
                  priority
                />
                {/* Dégradé qui remonte haut (≈45%) pour couvrir jusqu'au milieu des jambes */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"
                  style={{ height: '45%' }}
                />
              </div>

              {/* CONTENU */}
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
      </div>
    </section>
  );
}
