'use client';

import { useCallback, useRef, useState } from 'react';
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

// util modulo positif
const mod = (a: number, n: number) => ((a % n) + n) % n;

export default function Solutions() {
  const [current, setCurrent] = useState(0); // index de la carte au centre
  const n = CARDS.length;

  // indices visibles (gauche, centre, droite)
  const idxLeft   = mod(current - 1, n);
  const idxCenter = current;
  const idxRight  = mod(current + 1, n);

  const goNext = useCallback(() => setCurrent(c => mod(c + 1, n)), [n]);
  const goPrev = useCallback(() => setCurrent(c => mod(c - 1, n)), [n]);

  // swipe mobile simple
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40; // px
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
  };

  // ---- Styles cartes (contour BLANC + pas de halo bleu au focus/tap) ----
  const baseCard =
    'rounded-2xl ring-1 ring-white/12 bg-[#0b0b0b] transition ' +
    'hover:ring-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ' +
    'tap-transparent'; // classe utilitaire ajoutée ci-dessous

  const anim = 'duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform,opacity,filter';

  const roleClass = (role: 'left' | 'center' | 'right') => {
    if (role === 'center') return baseCard + ' ' + anim + ' scale-100 opacity-100 z-[2]';
    if (role === 'left')
      return baseCard + ' ' + anim + ' scale-[0.88] opacity-70 -translate-x-2 md:-translate-x-3 lg:-translate-x-4';
    return baseCard + ' ' + anim + ' scale-[0.88] opacity-70 translate-x-2 md:translate-x-3 lg:translate-x-4';
  };

  // ---- Carte (image agrandie, même cadre) ----
  const Card = ({ data, role }: { data: CardDef; role: 'left' | 'center' | 'right' }) => (
    <div className={roleClass(role)} style={{ WebkitTapHighlightColor: 'transparent' }}>
      <div className="rounded-[inherit] overflow-hidden">
        {/* Bloc image avec hauteur fixe (cadre identique), image plus grande */}
        <div className="relative w-full bg-black">
          <div className="h-[360px] sm:h-[420px] lg:h-[460px] relative">
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className={
                // Plus grand, sans changer la carte : scale et pas de padding
                // Centre un peu plus grand que les latérales
                'object-contain object-bottom select-none transition duration-200 origin-bottom ' +
                (role === 'center' ? 'scale-[1.10]' : 'scale-[1.05] saturate-[.9]')
              }
            />
            {/* Dégradé profond qui rejoint le texte (≈58–60%) */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none
                         bg-gradient-to-t from-black/92 via-black/60 to-transparent"
              style={{ height: '60%' }}
            />
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <p className={'mt-2 text-sm leading-relaxed text-muted ' + (role === 'center' ? '' : ' line-clamp-1')}>
            {data.blurb}
          </p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>
      </div>
    </div>
  );

  // ordre d’affichage : gauche — centre — droite
  const visible: { data: CardDef; role: 'left' | 'center' | 'right' }[] = [
    { data: CARDS[idxLeft], role: 'left' },
    { data: CARDS[idxCenter], role: 'center' },
    { data: CARDS[idxRight], role: 'right' },
  ];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* util globale locale pour iOS : pas de flash bleu au tap */}
      <style jsx>{`
        .tap-transparent { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* 3 cartes visibles */}
        <div className="flex items-stretch justify-center gap-5 overflow-visible">
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <Card data={visible[0].data} role="left" />
          </div>
          <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
            <Card data={visible[1].data} role="center" />
          </div>
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <Card data={visible[2].data} role="right" />
          </div>
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}
