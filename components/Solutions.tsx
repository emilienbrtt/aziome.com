'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

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

export default function Solutions() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1: → , -1: ←
  const n = CARDS.length;

  const goNext = useCallback(() => { setDir(1); setCurrent(c => mod(c + 1, n)); }, [n]);
  const goPrev = useCallback(() => { setDir(-1); setCurrent(c => mod(c - 1, n)); }, [n]);

  // swipe mobile
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (dx < -40) goNext();
    else if (dx > 40) goPrev();
  };

  // set visible trio
  const left   = CARDS[mod(current - 1, n)];
  const center = CARDS[current];
  const right  = CARDS[mod(current + 1, n)];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* rangée */}
        <LayoutGroup id="agents-row">
          <div className="flex items-stretch justify-center gap-5 overflow-visible">
            <Slot position="left"  item={left}  dir={dir} >
              <AgentCard data={left} role="side" />
            </Slot>
            <Slot position="center" item={center} dir={dir}>
              <AgentCard data={center} role="center" />
            </Slot>
            <Slot position="right" item={right} dir={dir}>
              <AgentCard data={right} role="side" />
            </Slot>
          </div>
        </LayoutGroup>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}

/* ---------- Slot : gère entrée/sortie directionnelle par position ---------- */

function Slot({
  position,
  item,
  dir,
  children,
}: {
  position: 'left' | 'center' | 'right';
  item: CardDef;
  dir: 1 | -1;
  children: React.ReactNode;
}) {
  // largeurs (centre plus large)
  const width =
    position === 'center'
      ? 'w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]'
      : 'w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]';

  // variantes d’entrée/sortie selon la position et la direction
  const enter = (() => {
    if (position === 'left')  return dir === -1 ? { x: -40, opacity: 0 } : { x: 0, opacity: 1 };
    if (position === 'right') return dir ===  1 ? { x:  40, opacity: 0 } : { x: 0, opacity: 1 };
    // center
    return dir === 1 ? { x: 40,  scale: 0.94, opacity: 0.9 } : { x: -40, scale: 0.94, opacity: 0.9 };
  })();

  const exit = (() => {
    if (position === 'left')  return dir ===  1 ? { x: -40, opacity: 0 } : { x: 0, opacity: 1 };
    if (position === 'right') return dir === -1 ? { x:  40, opacity: 0 } : { x: 0, opacity: 1 };
    // center
    return dir === 1 ? { x: -40, scale: 0.94, opacity: 0.9 } : { x: 40, scale: 0.94, opacity: 0.9 };
  })();

  const trans = { type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] } as const;

  return (
    <div className={width}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={position + '-' + item.slug}
          initial={enter}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={exit}
          transition={trans}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ----------------------- Carte visuelle ----------------------- */

function AgentCard({ data, role }: { data: CardDef; role: 'center' | 'side' }) {
  const isCenter = role === 'center';

  return (
    <motion.article
      layout
      initial={false}
      animate={isCenter ? { scale: 1.0, opacity: 1, filter: 'saturate(1) brightness(1)' }
                        : { scale: 0.9, opacity: 0.66, filter: 'saturate(.75) brightness(.92)' }}
      transition={{ layout: { type: 'spring', stiffness: 320, damping: 30 }, type: 'spring', stiffness: 260, damping: 26 }}
      className={[
        'rounded-2xl border border-white/14 bg-[#0b0b0b] transition',
        'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)]',
        'outline-none focus:outline-none',
      ].join(' ')}
      style={
        {
          // Images plus grandes et proportionnelles (sans couper)
          ['--imgScale' as any]: isCenter ? 1.16 : 1.08, // ← ajuste finement ici si besoin
        } as React.CSSProperties
      }
    >
      <div className="rounded-[inherit] overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/5] w-full bg-black">
          <motion.div
            className="absolute inset-0 [transform-origin:50%_100%]"
            animate={{ scale: isCenter ? 1 : 0.985 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className="object-contain object-bottom select-none
                         [transform-origin:50%_100%] [transform:scale(var(--imgScale))]"
            />
          </motion.div>

          {/* voile léger sur les côtés */}
          {!isCenter && <div className="absolute inset-0 bg-black/10 pointer-events-none" />}

          {/* dégradé vers le texte */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
            style={{ height: '56%' }}
          />
        </div>

        {/* Texte */}
        <div className="p-5">
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <p className={'mt-2 text-sm leading-relaxed text-muted ' + (isCenter ? '' : 'line-clamp-1')}>
            {data.blurb}
          </p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
