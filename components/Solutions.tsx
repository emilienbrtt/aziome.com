'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ===== Réglages faciles =====
   scale   : taille du personnage
   offsetY : déplacement vertical (px)  (+ = plus BAS)
   pb      : marge basse (px) au-dessus du texte (le gradient suit)
*/
const TUNE = {
  desktop: {
    center: { scale: 1.62, offsetY: 10, pb: 84 }, // ↓ un peu plus bas, taille inchangée
    side:   { scale: 1.48, offsetY: 8,  pb: 84 }, // ↓ plus bas + plus petit que centre
  },
  mobile: {
    center: { scale: 1.72, offsetY: 16, pb: 96 }, // ↓ descend l’image pour éviter qu’elle soit trop haute
  },
};

type CardDef = {
  slug: string;
  name: 'Max' | 'Léa' | 'Jules' | 'Mia' | 'Chris';
  image: string;
  blurb: string;
};

const CARDS: CardDef[] = [
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: 'Relance les clients au bon moment et récupère des ventes perdues.' },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: 'Répond vite, suit les commandes et passe à l’humain si besoin.' },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: 'Réunit vos chiffres et vous alerte quand quelque chose cloche.' },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: 'Accueil instantané : pose les bonnes questions et oriente bien.' },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: 'Gère les demandes internes et la paperasse sans retard.' },
];

const mod = (a: number, n: number) => ((a % n) + n) % n;

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const n = CARDS.length;

  const idxLeft   = mod(current - 1, n);
  const idxCenter = current;
  const idxRight  = mod(current + 1, n);

  const goNext = useCallback(() => setCurrent(c => mod(c + 1, n)), [n]);
  const goPrev = useCallback(() => setCurrent(c => mod(c - 1, n)), [n]);

  // Swipe mobile
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: any) => { touchStartX.current = e.touches?.[0]?.clientX ?? null; };
  const onTouchEnd   = (e: any) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40;
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
  };

  /* ===== Styles cartes ===== */
  const baseCard =
    'group relative rounded-2xl ring-1 bg-[#0b0b0b] overflow-hidden ' +
    'transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus:outline-none';

  const centerCard = baseCard + ' ring-white/15 hover:ring-[rgba(212,175,55,0.50)] hover:shadow-[0_0_120px_rgba(212,175,55,0.28)] z-[2]';
  const sideCard   = baseCard + ' ring-white/10 hover:ring-[rgba(212,175,55,0.38)] hover:shadow-[0_0_90px_rgba(212,175,55,0.22)]';

  /* ===== Carte réutilisable ===== */
  function Card({
    data,
    role,
    variant = 'desktop', // 'desktop' | 'mobile'
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right';
    variant?: 'desktop' | 'mobile';
  }) {
    const isCenter = role === 'center';
    const cfg =
      variant === 'mobile'
        ? TUNE.mobile.center
        : isCenter
          ? TUNE.desktop.center
          : TUNE.desktop.side;

    return (
      <div className={isCenter ? centerCard : sideCard} tabIndex={-1}>
        {/* Halo doré radial */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition duration-300 -z-[1]"
          style={{
            background:
              'radial-gradient(120% 140% at 50% 0%, rgba(212,175,55,0.22), rgba(246,231,178,0.10), rgba(0,0,0,0) 70%)',
          }}
        />

        {/* Bloc image — classes stables (pas de dynamique Tailwind) */}
        <div className={variant === 'mobile'
            ? 'relative bg-black h-[420px]'
            : 'relative bg-black h-[340px] sm:h-[380px] lg:h-[420px]'
        }>
          {/* Placement fin : offsetY (px) + scale ; espace bas protégé par pb */}
          <div className="absolute inset-0 pt-0" style={{ paddingBottom: cfg.pb }}>
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority={isCenter}
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className="object-contain select-none pointer-events-none origin-bottom transition-transform duration-300"
              style={{
                transform: `translateY(${cfg.offsetY}px) scale(${cfg.scale})`,
                objectPosition: 'center bottom'
              }}
            />
          </div>

          {/* Gradient = même hauteur que la réserve bas */}
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/70"
            aria-hidden
            style={{ height: cfg.pb }}
          />
        </div>

        {/* Texte */}
        <div className="p-5">
          <h3 className="text-white text-lg font-semibold">{data.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{data.blurb}</p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>

        {/* Assombrissement des cartes latérales (desktop seulement) */}
        {variant === 'desktop' && !isCenter && (
          <div className="pointer-events-none absolute inset-0 bg-black/45 z-20" aria-hidden />
        )}
      </div>
    );
  }

  const visible = [
    { data: CARDS[idxLeft],   role: 'left' as const },
    { data: CARDS[idxCenter], role: 'center' as const },
    { data: CARDS[idxRight],  role: 'right' as const },
  ];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* ===== Desktop / Tablet large : 3 cartes ===== */}
      <div className="hidden md:flex items-stretch justify-center gap-5 overflow-visible">
        {/* LEFT */}
        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          {/* Flèche gauche */}
          <button
            onClick={goPrev}
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition
                       items-center justify-center p-0"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <Card data={visible[0].data} role={visible[0].role} variant="desktop" />
        </div>

        {/* CENTER */}
        <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
          <Card data={visible[1].data} role={visible[1].role} variant="desktop" />
        </div>

        {/* RIGHT */}
        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          {/* Flèche droite */}
          <button
            onClick={goNext}
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition
                       items-center justify-center p-0"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <Card data={visible[2].data} role={visible[2].role} variant="desktop" />
        </div>
      </div>

      {/* ===== Mobile : 1 seule carte + flèches ===== */}
      <div className="md:hidden relative px-2" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Card data={CARDS[idxCenter]} role="center" variant="mobile" />

        {/* Flèches mobiles — icône centrée dans le cercle */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                     flex items-center justify-center p-0"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                     flex items-center justify-center p-0"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="mt-3 text-center text-xs text-muted">Balayez ou utilisez les flèches</div>
      </div>
    </section>
  );
}
