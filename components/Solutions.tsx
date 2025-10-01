'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ===== Réglages =====
   Desktop ne bouge pas. Mobile : on descend le perso (offsetY).
*/
const TUNE_DESKTOP = {
  center: { scale: 1.62, offsetY: 6,  pb: 84 },
  side:   { scale: 1.52, offsetY: 4,  pb: 84 },
};
const TUNE_MOBILE = {
  // scale = taille, offsetY = déplacement vertical (px, + = vers le BAS)
  // pb = marge basse au-dessus du texte ; pt = marge haut (évite tête coupée)
  center: { scale: 1.35, offsetY: 24, pb: 88, pt: 12 }, // ← perso plus BAS
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

  /* ===== Styles cartes (desktop inchangé) ===== */
  const roleClass = (role: 'left' | 'center' | 'right') => {
    const base =
      'group relative rounded-2xl ring-1 transition outline-none focus:outline-none ' +
      'bg-[#0b0b0b] overflow-hidden';
    const anim = 'duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]';

    if (role === 'center') {
      return base + ' ' + anim +
        ' ring-white/15 hover:ring-[rgba(212,175,55,0.50)] ' +
        ' hover:shadow-[0_0_120px_rgba(212,175,55,0.28)] scale-100 opacity-100 z-[2]';
    }
    const shift = role === 'left' ? '-translate-x-2 md:-translate-x-3' : 'translate-x-2 md:translate-x-3';
    return base + ' ' + anim +
      ' ring-white/10 hover:ring-[rgba(212,175,55,0.38)] ' +
      ' hover:shadow-[0_0_100px_rgba(212,175,55,0.22)] scale-[0.95] opacity-90 ' + shift;
  };

  /* ===== Carte réutilisable ===== */
  function Card({
    data,
    role,
    cfg,
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right';
    cfg: { scale: number; offsetY: number; pb: number; pt?: number };
  }) {
    const isCenter = role === 'center';

    return (
      <div className={roleClass(role)} tabIndex={-1}>
        {/* Halo doré radial */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition duration-300 -z-[1]"
          style={{
            background:
              'radial-gradient(120% 140% at 50% 0%, rgba(212,175,55,0.22), rgba(246,231,178,0.10), rgba(0,0,0,0) 70%)'
          }}
        />

        {/* Bloc image : hauteur fixe (stable build) */}
        <div className="relative bg-black h-[340px] sm:h-[380px] lg:h-[420px]">
          <div
            className="absolute inset-0"
            style={{ paddingTop: cfg.pt ?? 0, paddingBottom: cfg.pb }}
          >
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

        {/* Assombrissement des cartes latérales */}
        {role !== 'center' && <div className="pointer-events-none absolute inset-0 bg-black/45 z-20" aria-hidden />}
      </div>
    );
  }

  /* ====== Rendu ====== */
  const visible = [
    { data: CARDS[idxLeft],   role: 'left' as const },
    { data: CARDS[idxCenter], role: 'center' as const },
    { data: CARDS[idxRight],  role: 'right' as const },
  ];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* ===== Desktop (>= md) : INCHANGÉ — 3 cartes ===== */}
      <div className="hidden md:flex items-stretch justify-center gap-5 overflow-visible">
        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          <button
            onClick={goPrev}
            className="hidden sm:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <Card data={visible[0].data} role={visible[0].role} cfg={TUNE_DESKTOP.side} />
        </div>

        <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
          <Card data={visible[1].data} role={visible[1].role} cfg={TUNE_DESKTOP.center} />
        </div>

        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          <button
            onClick={goNext}
            className="hidden sm:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <Card data={visible[2].data} role={visible[2].role} cfg={TUNE_DESKTOP.side} />
        </div>
      </div>

      {/* ===== Mobile (< md) : 1 carte + flèches + vignettes propres ===== */}
      <div className="md:hidden relative px-2" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Card data={CARDS[idxCenter]} role="center" cfg={TUNE_MOBILE.center} />

        {/* Flèches — icône parfaitement centrée */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                     flex items-center justify-center"
          aria-label="Précédent"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                     hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                     flex items-center justify-center"
          aria-label="Suivant"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Vignettes : mêmes codes visuels que le site (coins arrondis, contour blanc) */}
        <div className="mt-4">
          <ul className="flex gap-4 overflow-x-auto px-1 no-scrollbar">
            {CARDS.map((c, i) => {
              const active = i === current;
              return (
                <li key={c.slug} className="shrink-0">
                  <button
                    onClick={() => setCurrent(i)}
                    className={[
                      'h-12 w-12 rounded-2xl flex items-center justify-center ring-1 transition outline-none focus:outline-none focus-visible:outline-none',
                      active
                        ? 'ring-[rgba(212,175,55,0.65)] shadow-[0_0_22px_rgba(212,175,55,0.25)] bg-black/30'
                        : 'ring-white/18 hover:ring-white/28 bg-black/10'
                    ].join(' ')}
                    aria-label={c.name}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={34}
                      height={34}
                      className="object-contain"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 text-center text-xs text-muted">Balayez ou utilisez les flèches</div>
        </div>
      </div>
    </section>
  );
}
