'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
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

type Role = 'left' | 'center' | 'right';

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const n = CARDS.length;

  // ——— Slots visibles : [left, center, right]
  const computeSlots = (c: number) => [mod(c - 1, n), c, mod(c + 1, n)];
  const [slots, setSlots] = useState<number[]>(computeSlots(0));

  // ——— Rôles appliqués aux 3 cartes (pour l’animation)
  const [roles, setRoles] = useState<Role[]>(['left', 'center', 'right']);
  const [animating, setAnimating] = useState(false);

  const duration = 420; // ms (doit matcher la classe duration-300/400 ci-dessous)

  const animateTo = useCallback(
    (dir: 'next' | 'prev') => {
      if (animating) return;
      setAnimating(true);

      // 1) On déclenche l’animation en faisant "tourner" les rôles
      setRoles((prev) =>
        dir === 'next'
          ? ([prev[0] === 'left' ? 'center' : prev[0] === 'center' ? 'right' : 'left',
              prev[1] === 'left' ? 'center' : prev[1] === 'center' ? 'right' : 'left',
              prev[2] === 'left' ? 'center' : prev[2] === 'center' ? 'right' : 'left'] as Role[])
          : ([prev[0] === 'left' ? 'right' : prev[0] === 'center' ? 'left' : 'center',
              prev[1] === 'left' ? 'right' : prev[1] === 'center' ? 'left' : 'center',
              prev[2] === 'left' ? 'right' : prev[2] === 'center' ? 'left' : 'center'] as Role[])
      );

      // 2) En fin d’animation, on met à jour l’index central et on réinitialise
      setTimeout(() => {
        const newCurrent = dir === 'next' ? mod(current + 1, n) : mod(current - 1, n);
        setCurrent(newCurrent);
        setSlots(computeSlots(newCurrent));
        setRoles(['left', 'center', 'right']); // prêt pour la prochaine rotation
        setAnimating(false);
      }, duration);
    },
    [animating, current, n]
  );

  const goNext = useCallback(() => animateTo('next'), [animateTo]);
  const goPrev = useCallback(() => animateTo('prev'), [animateTo]);

  // ——— Swipe mobile
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

  /* ===== Styles ===== */

  // Bordure blanche très discrète (ring) + hiérarchie 3D
  const roleClass = (role: Role) => {
    const base =
      'relative rounded-2xl ring-1 bg-[#0b0b0b] overflow-hidden ' +
      'outline-none focus:outline-none will-change-transform,opacity ' +
      'transition-[transform,opacity,filter] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]';

    if (role === 'center') {
      return base + ' ring-white/15 scale-100 opacity-100 z-[2] translate-x-0 rotate-y-0';
    }
    if (role === 'left') {
      return (
        base +
        ' ring-white/10 scale-[0.94] opacity-90 -translate-x-6 md:-translate-x-8 ' +
        '[transform:rotateY(14deg)]'
      );
    }
    return (
      base +
      ' ring-white/10 scale-[0.94] opacity-90 translate-x-6 md:translate-x-8 ' +
      '[transform:rotateY(-14deg)]'
    );
  };

  const Card = ({ data, role }: { data: CardDef; role: Role }) => (
    <div className={roleClass(role)} tabIndex={-1}>
      {/* Zone image : hauteur fixe + insets → jamais de jambes coupées */}
      <div className="relative h-[520px] sm:h-[560px] lg:h-[600px] bg-black px-4 pt-4 pb-16 sm:pb-20">
        <Image
          src={data.image}
          alt={data.name}
          fill
          priority={role === 'center'}
          sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
          className={[
            'object-contain object-bottom select-none pointer-events-none',
            'transition-transform duration-300',
            // Centre plus grand et légèrement remonté
            role === 'center'
              ? 'scale-[1.18] -translate-y-[4%]'
              : 'scale-[1.08] -translate-y-[2%]',
          ].join(' ')}
        />

        {/* Petit dégradé discret (plus bas et moins haut) */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-b from-transparent to-black/70"
          aria-hidden
        />
      </div>

      {/* Texte bien séparé */}
      <div className="p-5">
        <h3 className="text-white text-lg font-semibold">{data.name}</h3>
        <p className={'mt-2 text-sm leading-relaxed text-muted ' + (role === 'center' ? '' : 'line-clamp-1')}>
          {data.blurb}
        </p>
        <Link
          href={`/agents/${data.slug}`}
          className="mt-3 inline-block text-sm text-[color:var(--gold-1)]"
        >
          Voir les détails →
        </Link>
      </div>

      {/* Assombrissement des cartes latérales (image + texte) */}
      {role !== 'center' && <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />}
    </div>
  );

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div
        className="relative py-8 px-2 md:px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ perspective: '1200px' }} // effet roue 3D
      >
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center
                   absolute left-[6%] md:left-[7%] top-[42%] -translate-y-1/2 z-10
                   h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:bg-white/10 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center
                   absolute right-[6%] md:right-[7%] top-[42%] -translate-y-1/2 z-10
                   h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/5
                   hover:bg-white/10 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* 3 cartes visibles */}
        <div className="flex items-stretch justify-center gap-5 overflow-visible">
          {/* left / center / right -> contenus issus de slots */}
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <Card data={CARDS[slots[0]]} role={roles[0]} />
          </div>
          <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
            <Card data={CARDS[slots[1]]} role={roles[1]} />
          </div>
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <Card data={CARDS[slots[2]]} role={roles[2]} />
          </div>
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}
