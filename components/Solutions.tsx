'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
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
  const firstCardRef = useRef<HTMLDivElement>(null);
  const cardStepRef = useRef<number>(0); // largeur d’UNE carte + gap

  // Mesure une carte (largeur + gap) => défilement “par carte”
  useLayoutEffect(() => {
    const calc = () => {
      const el = trackRef.current;
      const first = firstCardRef.current;
      if (!el || !first) return;
      const style = getComputedStyle(el);
      const gap = parseFloat(style.gap || '0');
      const w = first.getBoundingClientRect().width;
      cardStepRef.current = w + gap;
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Met à jour l’état des flèches (toujours actives → boucle)
  const scrollByOne = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    const step = cardStepRef.current || 300;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    const pos = el.scrollLeft;

    if (dir === 'next') {
      // si on est (presque) au bout → wrap au début
      if (pos + step >= max - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    } else {
      // si on est (presque) au début → wrap à la fin
      if (pos - step <= 2) {
        el.scrollTo({ left: max, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* CONTENEUR élargi pour que l’ombre ne soit pas “cassée” */}
      <div className="relative py-6">

        {/* Flèche GAUCHE/DROITE – toujours actives, défilement par carte */}
        <button
          onClick={() => scrollByOne('prev')}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-14px] lg:left-[-20px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Voir les précédents"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scrollByOne('next')}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-14px] lg:right-[-20px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:bg-white/10 backdrop-blur transition"
          aria-label="Voir les suivants"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* PISTE SCROLLABLE — padding vertical pour laisser respirer le glow */}
        <div
          ref={trackRef}
          className="
            flex gap-5 overflow-x-auto overflow-y-visible overscroll-x-contain scroll-smooth
            [scrollbar-width:none] [-ms-overflow-style:none]
            snap-x snap-mandatory px-1 py-2
          "
          style={{ scrollPaddingLeft: 4, scrollPaddingRight: 4 }}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

          {CARDS.map((c, idx) => (
            <article
              key={c.slug}
              ref={idx === 0 ? firstCardRef : undefined}
              className="
                snap-start shrink-0
                w-[85%] sm:w-[60%] md:w-[48%] lg:w-[32%]
              "
            >
              {/* Conteneur EXTERNE : contour gris fin 360°, glow large au survol */}
              <div
                className="
                  rounded-2xl ring-1 ring-white/12 bg-[#0b0b0b]
                  hover:ring-[rgba(212,175,55,0.50)]
                  hover:shadow-[0_0_140px_rgba(212,175,55,0.20)]
                  transition
                "
              >
                {/* INTERNE : arrondis nets, dégradé profond comme Limova */}
                <div className="rounded-[inherit] overflow-hidden">
                  <div className="relative aspect-[4/5] w-full bg-black">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 48vw, 32vw"
                      className="object-contain object-bottom select-none"
                      priority
                    />
                    {/* Dégradé plus long (≈ 60%) qui fond dans le texte */}
                    <div
                      className="absolute inset-x-0 bottom-0 pointer-events-none
                                 bg-gradient-to-t from-black/92 via-black/60 to-transparent"
                      style={{ height: '60%' }}
                    />
                  </div>

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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
