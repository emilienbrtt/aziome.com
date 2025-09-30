'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LayoutGroup, motion } from 'framer-motion';

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
  const [current, setCurrent] = useState(0);   // index central
  const [dir, setDir] = useState<1 | -1>(1);   // sens (1 = →, -1 = ←)
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

  // trio visible
  const left   = CARDS[mod(current - 1, n)];
  const center = CARDS[current];
  const right  = CARDS[mod(current + 1, n)];
  const trio = [left, center, right];

  // transition unique, plus LENTE et FLUIDE (règle tout : position, taille, opacité, image)
  const T = { duration: 0.55, ease: [0.22, 1, 0.36, 1] } as const;

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Les mêmes cartes glissent réellement (layout) : pas de pop, pas de fade parasite */}
        <LayoutGroup id="agents-row">
          <motion.div
            layout
            className="flex items-stretch justify-center gap-5 overflow-visible"
            transition={{ layout: T }}
          >
            {trio.map((card) => {
              const isCenter = card.slug === center.slug;
              return (
                <motion.div
                  layout
                  layoutId={`slot-${card.slug}`} // identifiant partagé pour un glissement propre
                  key={card.slug}
                  className={isCenter
                    ? "w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]"
                    : "w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]"
                  }
                  transition={{ layout: T }}
                >
                  <AgentCard data={card} isCenter={isCenter} dir={dir} T={T} />
                </motion.div>
              );
            })}
          </motion.div>
        </LayoutGroup>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}

/* ===================== Carte ===================== */

function AgentCard({
  data,
  isCenter,
  dir,
  T,
}: {
  data: CardDef;
  isCenter: boolean;
  dir: 1 | -1;
  T: { duration: number; ease: number[] };
}) {
  return (
    <motion.article
      layout
      initial={false}
      animate={{
        // Les cartes changent en DOUCEUR d’échelle/opacité/lumière pendant le glissement
        scale: isCenter ? 1.0 : 0.92,
        opacity: isCenter ? 1 : 0.72,
        filter: isCenter ? 'saturate(1) brightness(1)' : 'saturate(.78) brightness(.92)',
        zIndex: isCenter ? 2 : 1,
      }}
      transition={{ layout: T, ...T }}
      className={[
        // Contour blanc discret (pas de bleu) + glow doré au hover
        'rounded-2xl border border-white/14 bg-[#0b0b0b] transition',
        'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)]',
        'outline-none focus:outline-none',
      ].join(' ')}
      style={
        {
          // Images plus grandes et proportionnelles (sans couper)
          // (ajusté un cran au-dessus comme demandé)
          ['--imgScale' as any]: isCenter ? 1.20 : 1.12,
          // petit hint directionnel (infime) pour ancrer le sens de rotation
          ['--hintX' as any]: isCenter ? 0 : (dir === 1 ? -3 : 3),
        } as React.CSSProperties
      }
    >
      <div className="rounded-[inherit] overflow-hidden">
        {/* Bloc image (ratio constant) */}
        <motion.div layout className="relative aspect-[4/5] w-full bg-black" transition={{ layout: T }}>
          <motion.div
            layout
            className="absolute inset-0 [transform-origin:50%_100%]"
            animate={{ x: 'var(--hintX)' as any, scale: isCenter ? 1.0 : 0.985 }}
            transition={T}
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

          {/* Voile léger sur les côtés (simplifier) */}
          {!isCenter && <div className="absolute inset-0 bg-black/10 pointer-events-none" />}

          {/* Dégradé vers le texte */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
            style={{ height: '54%' }} // un peu moins haut pour laisser “respirer” l’image agrandie
          />
        </motion.div>

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
