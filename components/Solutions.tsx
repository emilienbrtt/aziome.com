'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, Transition } from 'framer-motion';

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

// Transition douce, plus lente et très fluide
const T: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

export default function Solutions() {
  const [current, setCurrent] = useState(0);    // index de la carte au centre
  const [dir, setDir] = useState<1 | -1>(1);    // sens de défilement (affecte l’animation)
  const n = CARDS.length;

  const goNext = useCallback(() => {
    setDir(1);
    setCurrent(c => mod(c + 1, n));
  }, [n]);

  const goPrev = useCallback(() => {
    setDir(-1);
    setCurrent(c => mod(c - 1, n));
  }, [n]);

  // indices utiles
  const left   = mod(current - 1, n);
  const center = current;
  const right  = mod(current + 1, n);
  // carte qui arrive (hors champ) pendant l’animation
  const incoming = dir === 1 ? mod(current + 2, n) : mod(current - 2, n);

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

  // Largeurs : centre > côtés
  const W_LEFT  = 'w-[42%] md:w-[34%] lg:w-[30%] xl:w-[28%]';
  const W_CENT  = 'w-[50%] md:w-[40%] lg:w-[36%] xl:w-[34%]';
  const W_RIGHT = W_LEFT;

  // Offsets horizontaux (en px) pour le glissement absolu
  // On calculera en CSS à partir de la largeur du conteneur (utilisation de % + translate).
  const pos = {
    left:   '-33.5%', // approximations visuelles pour 3 colonnes + gap
    center: '0%',
    right:  '33.5%',
    offL:   '-67%',   // hors champ gauche
    offR:   '67%',    // hors champ droit
  };

  // Génère une carte animée positionnée absolument à l’emplacement voulu
  const CardSlot = ({
    role, data, dim
  }: {
    role: 'left' | 'center' | 'right' | 'incoming';
    data: CardDef;
    dim: 'left' | 'center' | 'right';
  }) => {
    // style de fond + bord (blanc) + hover doré/glow, commun
    const shell =
      'rounded-2xl border border-white/12 bg-[#0b0b0b] ' +
      'transition hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
      'outline-none focus:outline-none focus-visible:outline-none overflow-hidden';

    // assombrir les côtés (overlay + légère désaturation)
    const sideOverlay =
      role === 'center'
        ? ''
        : 'after:absolute after:inset-0 after:bg-black/20 after:pointer-events-none';

    // scale/opacity selon rôle
    const scale   = role === 'center' ? 1.0 : 0.9;
    const opacity = role === 'center' ? 1.0 : 0.82;

    // position (x) au repos
    const toX =
      dim === 'left' ? pos.left : dim === 'right' ? pos.right : pos.center;

    // position de départ (selon sens + rôle incoming)
    let fromX = toX;
    if (role === 'incoming') {
      fromX = dir === 1 ? pos.offR : pos.offL;
    } else if (role === 'left' && dir === 1) {
      // la carte de gauche sort vers offL pendant un NEXT
      fromX = pos.left;
    } else if (role === 'right' && dir === -1) {
      // la carte de droite sort vers offR pendant un PREV
      fromX = pos.right;
    }

    return (
      <motion.article
        key={`${role}-${data.slug}`}
        className={`${shell} ${sideOverlay} absolute top-0 left-1/2 -translate-x-1/2`}
        initial={{ x: fromX, scale, opacity }}
        animate={{ x: toX,   scale, opacity }}
        exit={{ x: dir === 1 ? pos.offL : pos.offR, scale: 0.88, opacity: 0 }}
        transition={T}
        style={{ width: dim === 'center' ? '36%' : '30%' }} // miroir des classes W_* sur desktop
      >
        {/* IMAGE — plus grande mais entière et proportionnelle */}
        <div className="relative aspect-[3/4] w-full bg-black">
          <Image
            src={data.image}
            alt={data.name}
            fill
            priority
            sizes="(max-width: 768px) 84vw, (max-width: 1024px) 40vw, 34vw"
            className={[
              'object-contain object-bottom select-none',
              role === 'center' ? 'scale-[1.12]' : 'scale-[1.06] saturate-[.92]',
              'transition-transform duration-500',
            ].join(' ')}
          />
          {/* Dégradé vers le texte */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none
                       bg-gradient-to-t from-black/92 via-black/60 to-transparent"
            style={{ height: '58%' }}
          />
        </div>

        {/* Texte */}
        <div className="p-5">
          <h3 className="text-xl font-semibold">{data.name}</h3>
          <p className={['mt-2 text-sm leading-relaxed text-muted', role === 'center' ? '' : 'line-clamp-1'].join(' ')}>
            {data.blurb}
          </p>
          <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
            Voir les détails →
          </Link>
        </div>
      </motion.article>
    );
  };

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Flèches */}
        <button
          onClick={goPrev}
          className="hidden sm:flex items-center justify-center
                     absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-20
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={goNext}
          className="hidden sm:flex items-center justify-center
                     absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-20
                     h-12 w-12 rounded-full ring-1 ring-white/15 bg-white/6
                     hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Scène : hauteur auto, largeur 100%, on place les cartes en absolu au centre */}
        <div className="relative h-[560px] md:h-[580px]">
          <LayoutGroup id="carousel-3">
            <AnimatePresence initial={false} custom={dir}>
              {/* ordre de rendu : on affiche 4 “rôles” pour obtenir le vrai glissement (entrée/sortie) */}
              <CardSlot role="left"     data={CARDS[left]}   dim="left"   />
              <CardSlot role="center"   data={CARDS[center]} dim="center" />
              <CardSlot role="right"    data={CARDS[right]}  dim="right"  />
              <CardSlot role="incoming" data={CARDS[incoming]} dim={dir === 1 ? 'right' : 'left'} />
            </AnimatePresence>
          </LayoutGroup>
        </div>

        {/* Astuce responsive mobile : on garde l’indication */}
        <div className="mt-3 md:hidden text-center text-xs text-muted">
          Balayez pour changer d’agent
        </div>
      </div>
    </section>
  );
}
