'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* =========================
   Réglages généraux
   ========================= */
type CardDef = {
  slug: 'max' | 'lea' | 'jules' | 'mia' | 'chris';
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

/* =========================
   Tunings selon rôle (carte centre vs côtés)
   Desktop (>=768px) + Mobile (<768px)
   ========================= */
type Tune = { scale: number; offsetY: number; pt?: number; pb: number };

const DESKTOP_CENTER: Tune = { scale: 1.58, offsetY: 8,  pb: 90 };
const DESKTOP_SIDE:   Tune = { scale: 1.48, offsetY: 6,  pb: 90 };

const MOBILE_CENTER:  Tune = { scale: 1.35, offsetY: 32, pt: 16, pb: 98 };
const MOBILE_IMG_H = 440;

/* =========================
   Ajustements iPad + par agent
   - iPad = largeurs 820–1180 px (Air/Pro)
   - BUMP_AGENT = petit décalage de confort pour chaque avatar
   ========================= */
const IPAD_EXTRA_BUMP = 18; // pousse TOUT un peu vers le bas sur iPad

const BUMP_AGENT: Record<CardDef['slug'], number> = {
  max: 10,
  lea: 28,
  jules: 12,
  mia: 20,
  chris: 14,
};

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [isTablet, setIsTablet] = useState(false);

  // Détection iPad (paysage & portrait)
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsTablet(w >= 820 && w <= 1180);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const n = CARDS.length;
  const idxLeft   = mod(current - 1, n);
  const idxCenter = current;
  const idxRight  = mod(current + 1, n);

  const goNext = useCallback(() => setCurrent(c => mod(c + 1, n)), [n]);
  const goPrev = useCallback(() => setCurrent(c => mod(c - 1, n)), [n]);

  /* =========================
     Styles des cartes
     ========================= */
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

  // Calcule les tunings finaux selon rôle + agent + iPad
  function tuneFor(role: 'left'|'center'|'right', slug: CardDef['slug']): Tune {
    const base = role === 'center' ? DESKTOP_CENTER : DESKTOP_SIDE;
    const t: Tune = { ...base };

    if (isTablet) {
      t.offsetY += IPAD_EXTRA_BUMP; // pousse tout un peu vers le bas sur iPad
      // Les têtes sont différentes : on ajoute un petit bump par agent
      t.offsetY += BUMP_AGENT[slug] ?? 0;
      // Sur iPad, on réduit très légèrement l’échelle pour éviter toute coupe haute
      t.scale = t.scale * 0.98;
    }
    return t;
  }

  /* =========================
     Carte générique
     ========================= */
  function Card({
    data,
    role,
    cfg,
    mobile = false,
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right';
    cfg: Tune;
    mobile?: boolean;
  }) {
    const isCenter = role === 'center';
    return (
      <div className={roleClass(role)} tabIndex={-1}>
        {/* halo doré au survol */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 group-hover:opacity-100 transition duration-300 -z-[1]"
          style={{
            background:
              'radial-gradient(120% 140% at 50% 0%, rgba(212,175,55,0.22), rgba(246,231,178,0.10), rgba(0,0,0,0) 70%)'
          }}
        />
        {/* bloc image */}
        <div
          className={mobile ? 'relative bg-black' : 'relative bg-black h-[360px] lg:h-[420px]'}
          style={mobile ? { height: MOBILE_IMG_H } : undefined}
        >
          <div
            className="absolute inset-0"
            style={{ paddingTop: cfg.pt ?? 0, paddingBottom: cfg.pb }}
          >
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority={isCenter}
              sizes="(max-width: 768px) 84vw, (max-width: 1180px) 36vw, 32vw"
              className="object-contain select-none pointer-events-none origin-bottom transition-transform duration-300"
              style={{
                transform: `translateY(${cfg.offsetY}px) scale(${cfg.scale})`,
                objectPosition: 'center bottom'
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/70"
            aria-hidden
            style={{ height: cfg.pb }}
          />
        </div>

        {/* texte */}
        <div className="p-5">
          <h3 className="text-white text-lg font-semibold">{data.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{data.blurb}</p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>

        {role !== 'center' && <div className="pointer-events-none absolute inset-0 bg-black/45 z-20" aria-hidden />}
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

      {/* Desktop / Tablet (>= md) */}
      <div className="hidden md:flex items-stretch justify-center gap-5 overflow-visible">
        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          <button
            onClick={goPrev}
            className="hidden sm:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <Card data={visible[0].data} role={visible[0].role} cfg={tuneFor('left', visible[0].data.slug)} />
        </div>

        <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
          <Card data={visible[1].data} role={visible[1].role} cfg={tuneFor('center', visible[1].data.slug)} />
        </div>

        <div className="relative w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
          <button
            onClick={goNext}
            className="hidden sm:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5 hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] transition"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <Card data={visible[2].data} role={visible[2].role} cfg={tuneFor('right', visible[2].data.slug)} />
        </div>
      </div>

      {/* Mobile (< md) : 1 carte + flèches + vignettes */}
      <MobileCarousel
        current={current}
        setCurrent={setCurrent}
        goPrev={goPrev}
        goNext={goNext}
      />
    </section>
  );
}

/* =========================
   Sous-composant Mobile (inchangé niveau logique)
   avec halo doré derrière les vignettes
   ========================= */
function MobileCarousel({
  current, setCurrent, goPrev, goNext,
}: {
  current: number;
  setCurrent: (i: number) => void;
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="md:hidden relative px-2">
      <CardMobile data={CARDS[current]} />

      <button
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                   flex items-center justify-center outline-none focus:outline-none"
        aria-label="Précédent"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10 hover:shadow-[0_0_70px_rgba(212,175,55,0.35)]
                   flex items-center justify-center outline-none focus:outline-none"
        aria-label="Suivant"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="mt-4">
        <ul className="flex gap-4 overflow-x-auto px-1 no-scrollbar">
          {CARDS.map((c, i) => {
            const active = i === current;
            return (
              <li key={c.slug} className="group relative shrink-0">
                {/* halo doré DERRIÈRE le cadre (pas dans le cadre) */}
                <span
                  aria-hidden
                  className={[
                    'absolute -inset-3 rounded-3xl z-0 transition-opacity duration-200',
                    active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  ].join(' ')}
                  style={{
                    background:
                      'radial-gradient(140% 140% at 50% 50%, rgba(212,175,55,0.55), rgba(212,175,55,0.22), rgba(0,0,0,0) 72%)',
                    filter: 'blur(14px)'
                  }}
                />
                <button
                  onClick={() => setCurrent(i)}
                  className={[
                    'relative z-10 h-12 w-12 rounded-2xl flex items-center justify-center',
                    'border border-white/24 bg-black/10',
                    'outline-none focus:outline-none select-none'
                  ].join(' ')}
                  aria-label={c.name}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Image src={c.image} alt={c.name} width={34} height={34} className="object-contain" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* Mobile card (réutilise les mêmes réglages que plus haut, version compacte) */
function CardMobile({ data }: { data: CardDef }) {
  const cfg = MOBILE_CENTER;
  return (
    <div className="group relative rounded-2xl ring-1 ring-white/15 bg-[#0b0b0b] overflow-hidden">
      <div className="relative bg-black" style={{ height: MOBILE_IMG_H }}>
        <div className="absolute inset-0" style={{ paddingTop: cfg.pt ?? 0, paddingBottom: cfg.pb }}>
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="84vw"
            className="object-contain select-none pointer-events-none origin-bottom transition-transform duration-300"
            style={{
              transform: `translateY(${cfg.offsetY}px) scale(${cfg.scale})`,
              objectPosition: 'center bottom'
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/70"
          aria-hidden
          style={{ height: cfg.pb }}
        />
      </div>
      <div className="p-5">
        <h3 className="text-white text-lg font-semibold">{data.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{data.blurb}</p>
        <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
          Voir les détails →
        </Link>
      </div>
    </div>
  );
}
