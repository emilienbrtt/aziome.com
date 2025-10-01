'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
const DURATION = 0.72; // ~0.65–0.75s
const EASING = [0.22, 1, 0.36, 1] as const; // cubic-bezier(0.22,1,0.36,1)

type Slot = 'left' | 'center' | 'right';

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const n = CARDS.length;

  // Indices visibles
  const idxLeft   = mod(current - 1, n);
  const idxCenter = current;
  const idxRight  = mod(current + 1, n);
  const idxIncoming = dir === 1 ? mod(current + 2, n) : mod(current - 2, n);

  // Gestes tactiles
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40;
    if (dx < -threshold) goNext();
    else if (dx > threshold) goPrev();
  };

  const goNext = useCallback(() => {
    if (isAnimating) return;
    setDir(1);
    setIsAnimating(true);
    // on laisse Framer Motion animer le layout, puis on valide le nouvel index après la durée
    window.setTimeout(() => {
      setCurrent(c => mod(c + 1, n));
      setIsAnimating(false);
    }, DURATION * 1000);
  }, [isAnimating, n]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    setDir(-1);
    setIsAnimating(true);
    window.setTimeout(() => {
      setCurrent(c => mod(c - 1, n));
      setIsAnimating(false);
    }, DURATION * 1000);
  }, [isAnimating, n]);

  // Configuration visuelle par slot
  const slotConfig: Record<Slot, { scaleImg: number; overlay: number; opacity: number }> = {
    center: { scaleImg: 1.08, overlay: 0,   opacity: 1 },
    left:   { scaleImg: 0.96, overlay: 0.18, opacity: 0.82 },
    right:  { scaleImg: 0.96, overlay: 0.18, opacity: 0.82 },
  };

  // Pour l'animation "carte entrante"
  const incomingFrom = dir === 1 ? 'right' : 'left';
  const incomingSideX = useMemo(() => {
    // On place l’entrante juste au-delà du slot opposé, sans couper l’ombre
    return dir === 1 ? 56 : -56; // en % du conteneur (approx propre et réactive)
  }, [dir]);

  // Classes communes
  const baseCard =
    'rounded-2xl border bg-[#0b0b0b] ' +
    'border-white/12 transition-shadow outline-none focus:outline-none focus-visible:outline-none ' +
    'hover:border-[rgba(212,175,55,0.45)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)]';

  // Wrapper d’une carte visible (slot = left/center/right)
  const SlotCol = ({ children, slot }: { children: React.ReactNode; slot: Slot }) => {
    // On garde EXACTEMENT tes largeurs de colonnes
    const width =
      slot === 'center'
        ? 'w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]'
        : 'w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]';
    return (
      <motion.div
        className={width}
        layout
        transition={{ duration: DURATION, ease: EASING }}
      >
        {children}
      </motion.div>
    );
  };

  // Carte stylée (avec variations de slot)
  const Card = ({
    data,
    slot,
    layoutId,
  }: {
    data: CardDef;
    slot: Slot;
    layoutId: string;
  }) => {
    const cfg = slotConfig[slot];

    return (
      <motion.div
        layoutId={layoutId}
        layout
        transition={{ duration: DURATION, ease: EASING }}
        className={baseCard}
        style={{
          opacity: cfg.opacity,
          willChange: 'transform, opacity, filter',
        }}
      >
        <div className="rounded-[inherit] overflow-hidden">
          <div className="relative aspect-[4/5] w-full bg-black">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: cfg.scaleImg }}
              transition={{ duration: DURATION, ease: EASING }}
              style={{ willChange: 'transform' }}
            >
              <Image
                src={data.image}
                alt={data.name}
                fill
                priority
                sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
                className="object-contain object-bottom select-none"
                draggable={false}
              />
            </motion.div>

            {/* Overlay sombre pour les latérales */}
            {cfg.overlay > 0 && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: cfg.overlay }}
                transition={{ duration: DURATION, ease: EASING }}
                style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.24), rgba(0,0,0,0.24))' }}
              />
            )}

            {/* Dégradé vers le texte (inchangé) */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
              style={{ height: '56%' }}
            />
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className={'mt-2 text-sm leading-relaxed text-muted ' + (slot === 'center' ? '' : ' line-clamp-1')}>
              {data.blurb}
            </p>
            <Link
              href={`/agents/${data.slug}`}
              className="mt-3 inline-block text-sm text-[color:var(--gold-1)] outline-none focus:outline-none focus-visible:outline-none"
            >
              Voir les détails →
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  // Liste des 3 cartes visibles (ordre gauche → centre → droite)
  const visible = [
    { data: CARDS[idxLeft], slot: 'left' as const, key: `left-${CARDS[idxLeft].slug}` },
    { data: CARDS[idxCenter], slot: 'center' as const, key: `center-${CARDS[idxCenter].slug}` },
    { data: CARDS[idxRight], slot: 'right' as const, key: `right-${CARDS[idxRight].slug}` },
  ];

  // Carte entrante (rendu temporaire pendant l’anim)
  const incoming = CARDS[idxIncoming];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      {/* Container non clippé pour laisser respirer l’ombre/glow */}
      <div
        className="relative py-8 px-2 md:px-4 overflow-visible"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-20
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-20
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Rangée des 3 colonnes visibles (ta mise en page d’origine) */}
        <motion.div
          className="flex items-stretch justify-center gap-5 overflow-visible relative"
          layout
          transition={{ duration: DURATION, ease: EASING }}
        >
          {visible.map(({ data, slot, key }) => (
            <SlotCol slot={slot} key={key}>
              <Card data={data} slot={slot} layoutId={data.slug} />
            </SlotCol>
          ))}

          {/* Carte entrante : glisse depuis l’extérieur côté opposé pendant l’anim */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div
                className="absolute top-0 bottom-0 my-auto"
                style={{
                  // largeur identique au slot latéral
                  width: '28%',
                  // alignement côté opposé à l’animation
                  left: incomingFrom === 'left' ? undefined : '100%',
                  right: incomingFrom === 'left' ? '100%' : undefined,
                }}
                initial={{ x: incomingFrom === 'left' ? -incomingSideX : incomingSideX, opacity: 0.0001 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: incomingFrom === 'left' ? -incomingSideX : incomingSideX, opacity: 0 }}
                transition={{ duration: DURATION, ease: EASING }}
              >
                <Card
                  data={incoming}
                  slot={incomingFrom === 'left' ? 'left' : 'right'}
                  layoutId={incoming.slug}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}
