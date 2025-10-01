'use client';

import { useCallback, useRef, useState, type TouchEvent } from 'react';
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
  const onTouchStart = (e: TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40;
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
  };

  /* ===== Styles par rôle ===== */
  const roleClass = (role: 'left' | 'center' | 'right') => {
    const base =
      // group -> permet le hover doré
      'group relative rounded-2xl ring-1 transition ' +
      'outline-none focus:outline-none focus-visible:outline-none ' +
      'bg-[#0b0b0b] overflow-hidden';
    const anim = 'duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform,opacity';

    if (role === 'center') {
      return base + ' ' + anim +
        ' ring-white/15 group-hover:ring-[rgba(212,175,55,0.50)] ' + // ring dorée au hover
        ' group-hover:shadow-[0_0_120px_rgba(212,175,55,0.28)] ' +
        ' scale-100 opacity-100 z-[2]';
    }
    const shift = role === 'left' ? '-translate-x-2 md:-translate-x-3' : 'translate-x-2 md:translate-x-3';
    return base + ' ' + anim +
      ' ring-white/10 group-hover:ring-[rgba(212,175,55,0.38)] ' +
      ' group-hover:shadow-[0_0_100px_rgba(212,175,55,0.22)] ' +
      ' scale-[0.95] opacity-90 ' + shift;
  };

  /* ===== Carte (compacte + animaux XXL + glow doré) ===== */
  const Card = ({ data, role }: { data: CardDef; role: 'left' | 'center' | 'right' }) => (
    <div className={roleClass(role)} tabIndex={-1}>
      {/* Halo doré (radial) derrière la carte */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0
                   group-hover:opacity-100 transition duration-300 -z-[1]"
        style={{
          background:
            'radial-gradient(120% 140% at 50% 0%, rgba(212,175,55,0.22), rgba(246,231,178,0.10), rgba(0,0,0,0) 70%)'
        }}
      />

      {/* CONTENU */}
      <div className="relative z-10">
        {/* Zone image (cartes compactes) */}
        <div className="relative h-[360px] sm:h-[400px] lg:h-[440px] bg-black">
          {/* Boîte de calage : quasi sans marge haut, petite réserve bas */}
          <div className="absolute inset-0 pt-0 pb-12 md:pb-14">
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority={role === 'center'}
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className={[
                'object-contain object-bottom select-none pointer-events-none',
                'transition-transform duration-300',
                // >>> ANIMAUX ENCORE PLUS GRANDS <<<
                role === 'center'
                  ? 'scale-[1.60] -translate-y-[1.2%]'
                  : 'scale-[1.44] -translate-y-[0.8%]',
              ].join(' ')}
            />
          </div>

          {/* Gradient bas aligné avec la réserve bas (protège la zone texte) */}
          <div
            className="absolute inset-x-0 bottom-0 h-12 md:h-14 bg-gradient-to-b from-transparent to-black/70"
            aria-hidden
          />
        </div>

        {/* Texte */}
        <div className="p-5">
          <h3 className="text-white text-lg font-semibold">{data.name}</h3>
          <p className={'mt-2 text-sm leading-relaxed text-muted ' + (role === 'center' ? '' : 'line-clamp-1')}>
            {data.blurb}
          </p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>
      </div>

      {/* Assombrissement des cartes latérales (laisse passer un peu le glow) */}
      {role !== 'center' && <div className="pointer-events-none absolute inset-0 bg-black/45 z-20" aria-hidden />}
    </div>
  );

  const visible: { data: CardDef; role: 'left' | 'center' | 'right' }[] = [
    { data: CARDS[idxLeft], role: 'left' },
    { data: CARDS[idxCenter], role: 'center' },
    { data: CARDS[idxRight], role: 'right' },
  ];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8 px-2 md:px-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches avec glow doré */}
        <button
          onClick={goPrev}
          className="group/arrow hidden sm:flex items-center justify-center
                   absolute left-[6%] md:left-[7%] top-[42%] -translate-y-1/2 z-10
                   h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10
                   hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] relative overflow-hidden transition"
          aria-label="Précédent"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0
                       group-hover/arrow:opacity-100 transition duration-300"
            style={{ background: 'radial-gradient(45% 45% at 50% 50%, rgba(212,175,55,0.38), rgba(0,0,0,0))' }}
          />
          <ChevronLeft className="relative z-10 h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="group/arrow hidden sm:flex items-center justify-center
                   absolute right-[6%] md:right-[7%] top-[42%] -translate-y-1/2 z-10
                   h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:ring-[rgba(212,175,55,0.55)] hover:bg-white/10
                   hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] relative overflow-hidden transition"
          aria-label="Suivant"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0
                       group-hover/arrow:opacity-100 transition duration-300"
            style={{ background: 'radial-gradient(45% 45% at 50% 50%, rgba(212,175,55,0.38), rgba(0,0,0,0))' }}
          />
          <ChevronRight className="relative z-10 h-6 w-6" />
        </button>

        {/* Trois cartes visibles */}
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
