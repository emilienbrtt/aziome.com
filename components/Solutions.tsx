'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LayoutGroup, motion, Transition } from 'framer-motion';

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

// modulo positif
const mod = (a: number, n: number) => ((a % n) + n) % n;

// Transition douce, un peu plus lente
const T: Transition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] };

export default function Solutions() {
  const [current, setCurrent] = useState(0); // index au centre
  const n = CARDS.length;
  const dirRef = useRef<1 | -1>(1);         // sens de la dernière action (pour l’animation)

  const goNext = useCallback(() => {
    dirRef.current = 1;
    setCurrent(c => mod(c + 1, n));
  }, [n]);

  const goPrev = useCallback(() => {
    dirRef.current = -1;
    setCurrent(c => mod(c - 1, n));
  }, [n]);

  // indices visibles
  const idxLeft   = mod(current - 1, n);
  const idxCenter = current;
  const idxRight  = mod(current + 1, n);

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

  // largeur responsive (centre > côtés)
  const W_LEFT  = 'w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]';
  const W_CENT  = 'w-[50%] md:w-[40%] lg:w-[36%] xl:w-[34%]'; // centre un poil plus large
  const W_RIGHT = W_LEFT;

  // ordre d’affichage
  const visible: { data: CardDef; role: 'left' | 'center' | 'right' }[] = [
    { data: CARDS[idxLeft],   role: 'left'   },
    { data: CARDS[idxCenter], role: 'center' },
    { data: CARDS[idxRight],  role: 'right'  },
  ];

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

        {/* Rangée de 3 cartes (glisse/scale/opacity) */}
        <LayoutGroup id="agents-row">
          <div className="flex items-stretch justify-center gap-5 overflow-visible">
            {/* Gauche */}
            <div className={W_LEFT}>
              <AgentCard data={visible[0].data} isCenter={false} dir={dirRef.current} T={T} />
            </div>
            {/* Centre */}
            <div className={W_CENT}>
              <AgentCard data={visible[1].data} isCenter={true} dir={dirRef.current} T={T} />
            </div>
            {/* Droite */}
            <div className={W_RIGHT}>
              <AgentCard data={visible[2].data} isCenter={false} dir={dirRef.current} T={T} />
            </div>
          </div>
        </LayoutGroup>

        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}

/* ---------- Carte individuelle avec animation ---------- */

function AgentCard({
  data,
  isCenter,
  dir,
  T,
}: {
  data: CardDef;
  isCenter: boolean;
  dir: 1 | -1;        // 1 = vers la droite, -1 = vers la gauche
  T: Transition;
}) {
  // États visuels
  const scale   = isCenter ? 1.0 : 0.9;
  const opacity = isCenter ? 1.0 : 0.78;
  // léger décalage horizontal pour renforcer la sensation de carrousel
  const offsetX = isCenter ? 0 : (dir === 1 ? -8 : 8);

  return (
    <motion.article
      layout
      transition={T}
      initial={{ opacity, scale, x: offsetX }}
      animate={{  opacity, scale, x: 0 }}
      className={[
        // BORD BLANC fin, pas de bleu (outline off), hover doré + glow
        'rounded-2xl border border-white/12 bg-[#0b0b0b] transition',
        'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)]',
        'outline-none focus:outline-none focus-visible:outline-none',
      ].join(' ')}
    >
      <div className="rounded-[inherit] overflow-hidden">
        {/* Image plus grande mais proportionnelle :
            - on augmente la zone image (aspect-[3/4])
            - object-contain + object-bottom pour garder l’agent entier et bien posé */}
        <div className="relative aspect-[3/4] w-full bg-black">
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="(max-width: 768px) 84vw, (max-width: 1024px) 40vw, 34vw"
            className={[
              'object-contain object-bottom select-none',
              isCenter ? 'scale-[1.06]' : 'scale-[1.02] saturate-[.92]',
              'transition-transform duration-500',
            ].join(' ')}
          />
          {/* Dégradé profond vers le texte */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none
                       bg-gradient-to-t from-black/92 via-black/60 to-transparent"
            style={{ height: '58%' }}
          />
        </div>

        {/* Texte */}
        <div className="p-5">
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <p className={['mt-2 text-sm leading-relaxed text-muted', isCenter ? '' : 'line-clamp-1'].join(' ')}>
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
