'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ----------------------- Données ----------------------- */

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

const mod = (a: number, n: number) => ((a % n) + n) % n;

/* ----------------------- Composant ----------------------- */

export default function Solutions() {
  // index de la carte centrale “active”
  const [current, setCurrent] = useState(0);
  // animation en cours ?
  const [animating, setAnimating] = useState<false | 'next' | 'prev'>(false);

  const n = CARDS.length;
  const idxLeft    = mod(current - 1, n);
  const idxCenter  = current;
  const idxRight   = mod(current + 1, n);
  const idxIncomingRight = mod(current + 2, n); // quand on va à droite (next)
  const idxIncomingLeft  = mod(current - 2, n); // quand on va à gauche (prev)

  // paramètres d’animation globaux
  const DURATION = 700; // ms
  const EASE     = 'cubic-bezier(0.22, 1, 0.36, 1)';

  const goNext = useCallback(() => {
    if (animating) return;
    setAnimating('next');
    // après le glissement, on “valide” le nouveau centre
    setTimeout(() => {
      setCurrent(c => mod(c + 1, n));
      setAnimating(false);
    }, DURATION);
  }, [animating, n]);

  const goPrev = useCallback(() => {
    if (animating) return;
    setAnimating('prev');
    setTimeout(() => {
      setCurrent(c => mod(c - 1, n));
      setAnimating(false);
    }, DURATION);
  }, [animating, n]);

  /* ---------- Swipe mobile ---------- */
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goNext() : goPrev();
  };

  /* ---------- “Timeline” de 3 + 1 cartes visibles pendant l’anim ----------

     Positions (pourcentage de la largeur du conteneur):
     - left     : x = -34%
     - center   : x =   0%
     - right    : x = +34%
     - incoming : x = +68% (si next) / x = -68% (si prev)

     Pendant l’anim on translate tout le groupe de ±34%.
  ------------------------------------------------------------------------- */

  type Slot = 'left' | 'center' | 'right' | 'incoming';

  const slots: { slot: Slot; card: CardDef }[] = useMemo(() => {
    if (animating === 'next') {
      return [
        { slot: 'left',    card: CARDS[idxLeft] },
        { slot: 'center',  card: CARDS[idxCenter] },
        { slot: 'right',   card: CARDS[idxRight] },
        { slot: 'incoming',card: CARDS[idxIncomingRight] },
      ];
    }
    if (animating === 'prev') {
      return [
        { slot: 'incoming',card: CARDS[idxIncomingLeft] },
        { slot: 'left',    card: CARDS[idxLeft] },
        { slot: 'center',  card: CARDS[idxCenter] },
        { slot: 'right',   card: CARDS[idxRight] },
      ];
    }
    // au repos : pas d’incoming
    return [
      { slot: 'left',   card: CARDS[idxLeft] },
      { slot: 'center', card: CARDS[idxCenter] },
      { slot: 'right',  card: CARDS[idxRight] },
    ];
  }, [animating, idxLeft, idxCenter, idxRight, idxIncomingLeft, idxIncomingRight]);

  // mapping slot -> x, scale, overlay darkness, z-index
  function slotStyle(slot: Slot) {
    // positions de départ
    const xMap: Record<Slot, number> = {
      left: -34,
      center: 0,
      right: 34,
      incoming: animating === 'next' ? 68 : -68,
    };

    // pendant l’animation, on translate tout le groupe
    const groupShift =
      animating === 'next' ? -34 :
      animating === 'prev' ?  34 : 0;

    // échelles (images + carte)
    const scaleMap: Record<Slot, number> = {
      center: 1.00,     // carte
      left:   0.92,
      right:  0.92,
      incoming: 0.90,
    };
    // opacité / assombrissement des LATÉRALES (overlay)
    const shadeMap: Record<Slot, number> = {
      center: 0,
      left:   0.14,
      right:  0.14,
      incoming: 0.18,
    };
    // zIndex pour garder la centrale au dessus
    const zMap: Record<Slot, number> = {
      center: 3,
      left:   2,
      right:  2,
      incoming: 1,
    };

    return {
      x: `translateX(${xMap[slot] + groupShift}%)`,
      scale: scaleMap[slot],
      shade: shadeMap[slot],
      z: zMap[slot],
    };
  }

  /* ---------- Styles communs ---------- */

  const cardBase =
    'absolute top-0 left-1/2 -translate-x-1/2 ' + // positionnement par centre
    'rounded-2xl border bg-[#0b0b0b] ' +
    'border-white/12 ' +                          // contour blanc léger (au repos)
    'transition-[transform,box-shadow,border-color] ' +
    'hover:border-[rgba(212,175,55,0.45)] ' +     // hover doré
    'hover:shadow-[0_0_120px_rgba(212,175,55,0.22)] ' +
    'outline-none focus:outline-none focus-visible:outline-none ' +
    // largeur des cartes : on garde exactement tes proportions visuelles
    'w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%] ';

  const TRANSITION = `transform ${DURATION}ms ${EASE}, box-shadow ${DURATION}ms ${EASE}, border-color ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`;

  /* ---------- Rendu ---------- */

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div
        className="relative py-10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-16px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-30
                     h-12 w-12 rounded-full border border-white/15 bg-white/7
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-16px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-30
                     h-12 w-12 rounded-full border border-white/15 bg-white/7
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Piste : on réserve une hauteur stable pour éviter tout “saut” */}
        <div className="relative mx-auto h-[540px] sm:h-[560px] lg:h-[600px] overflow-visible">
          {/* On rend 3 ou 4 cartes (si anim) superposées, chacune avec ses propres transforms */}
          {slots.map(({ slot, card }, i) => {
            const s = slotStyle(slot);
            return (
              <article
                key={`${slot}-${card.slug}-${current}-${i}`}
                className={cardBase}
                style={{
                  transform: `${s.x} scale(${s.scale})`,
                  zIndex: s.z,
                  transition: TRANSITION,
                }}
              >
                {/* inner : masque les coins, conserve les ombres externes */}
                <div className="rounded-[inherit] overflow-hidden">
                  {/* visuel + dégradé */}
                  <div className="relative aspect-[4/5] w-full bg-black">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
                      // IMPORTANT : image proportionnelle et “grande”
                      className={
                        'object-contain object-bottom select-none ' +
                        // centre un peu plus grand que latérales, sans couper
                        (slot === 'center'
                          ? 'scale-[1.18]'   // ~ +18% — visible mais pas rogné
                          : 'scale-[1.08]')  // latérales un cran au-dessus pour éviter l’effet “petit”
                      }
                    />
                    {/* overlay sombre pour les latérales */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.10))',
                        opacity: slot === 'center' ? 0 : s.shade, // latérales plus sombres
                        transition: `opacity ${DURATION}ms ${EASE}`,
                      }}
                    />
                    {/* dégradé bas vers le texte (identique à ta version) */}
                    <div
                      className="absolute inset-x-0 bottom-0 pointer-events-none
                                 bg-gradient-to-t from-black/92 via-black/60 to-transparent"
                      style={{ height: '58%' }}
                    />
                  </div>

                  {/* contenu */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{card.name}</h3>
                    <p className={'mt-2 text-sm leading-relaxed text-muted ' + (slot === 'center' ? '' : ' line-clamp-1')}>
                      {card.blurb}
                    </p>
                    <Link
                      href={`/agents/${card.slug}`}
                      className="mt-3 inline-block text-sm text-[color:var(--gold-1)]"
                    >
                      Voir les détails →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}
