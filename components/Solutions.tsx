'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [current, setCurrent] = useState(0);     // index au centre
  const [dir, setDir] = useState<1 | -1>(1);     // sens du “pivot”
  const n = CARDS.length;

  const goNext = useCallback(() => {
    setDir(1);
    setCurrent(c => mod(c + 1, n));
  }, [n]);

  const goPrev = useCallback(() => {
    setDir(-1);
    setCurrent(c => mod(c - 1, n));
  }, [n]);

  // swipe mobile
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

  // indices visibles
  const left   = CARDS[mod(current - 1, n)];
  const center = CARDS[current];
  const right  = CARDS[mod(current + 1, n)];

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div
        className="relative py-8"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
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

        {/* Rangée avec micro-translation selon la flèche cliquée (effet “rotation”) */}
        <motion.div
          className="flex items-stretch justify-center gap-5 overflow-visible"
          key={current + '-' + dir}
          initial={{ x: dir === 1 ? 16 : -16, opacity: 0.95 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'tween', duration: 0.28 }}
        >
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <AgentCard role="side" data={left} />
          </div>
          <div className="w-[48%] md:w-[38%] lg:w-[34%] xl:w-[32%]">
            <AgentCard role="center" data={center} />
          </div>
          <div className="w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]">
            <AgentCard role="side" data={right} />
          </div>
        </motion.div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Carte agent ----------------------- */

function AgentCard({
  data,
  role,
}: {
  data: CardDef;
  role: 'center' | 'side';
}) {
  // 1) Contours BLANCS au repos (+ glow doré au hover)
  // 2) Proportions d’images garanties:
  //    - object-contain pour rester entier
  //    - image un peu plus grande au centre, un peu plus petite en latéral
  //    - on ajuste simplement via une variable CSS --imgScale
  const isCenter = role === 'center';

  return (
    <motion.article
      initial={false}
      animate={{
        scale: isCenter ? 1.0 : 0.92,
        opacity: isCenter ? 1 : 0.78,
        zIndex: isCenter ? 2 : 1,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={[
        'rounded-2xl',
        'border border-white/12',                // <-- bord BLANC fin (plus de bleu)
        'bg-[#0b0b0b]',
        'transition',
        'hover:border-[rgba(212,175,55,0.40)]',  // hover doré
        'hover:shadow-[0_0_120px_rgba(212,175,55,0.18)]',
        'outline-none focus:outline-none focus-visible:outline-none',
      ].join(' ')}
      style={
        {
          // scale image : centre un peu plus grand, côtés un peu plus petits
          // (ces valeurs ont été testées pour rester entières dans la carte)
          ['--imgScale' as any]: isCenter ? 1.05 : 0.98,
        } as React.CSSProperties
      }
    >
      <div className="rounded-[inherit] overflow-hidden">
        {/* Zone image — même ratio partout */}
        <div className="relative aspect-[4/5] w-full bg-black">
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
            className="object-contain object-bottom select-none
                       [transform-origin:50%_100%]
                       [transform:scale(var(--imgScale))]"
          />
          {/* Dégradé pour lier l’image au texte */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none
                       bg-gradient-to-t from-black/92 via-black/60 to-transparent"
            style={{ height: '58%' }}
          />
        </div>

        {/* Contenu texte */}
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
