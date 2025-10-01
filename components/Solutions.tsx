'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  { slug: 'max',   name: 'Max',   image: '/agents/max.png',   blurb: "Relance les clients au bon moment et récupère des ventes perdues." },
  { slug: 'lea',   name: 'Léa',   image: '/agents/lea.png',   blurb: "Répond vite, suit les commandes et passe à l’humain si besoin." },
  { slug: 'jules', name: 'Jules', image: '/agents/jules.png', blurb: "Réunit vos chiffres et vous alerte quand quelque chose cloche." },
  { slug: 'mia',   name: 'Mia',   image: '/agents/mia.png',   blurb: "Accueil instantané : pose les bonnes questions et oriente bien." },
  { slug: 'chris', name: 'Chris', image: '/agents/chris.png', blurb: "Gère les demandes internes et la paperasse sans retard." },
];

const mod = (a: number, n: number) => ((a % n) + n) % n;

// paramètres d’anim
const DURATION = 700; // ms
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function Solutions() {
  const [current, setCurrent] = useState(0);   // index logique
  const [dir, setDir] = useState<0 | 1 | -1>(0); // sens en cours : -1 = prev, 1 = next, 0 = repos
  const [anim, setAnim] = useState(false);

  const n = CARDS.length;

  // indices autour du centre (et la carte “entrante” pour le slide)
  const idxLeft    = useMemo(() => mod(current - 1, n), [current, n]);
  const idxCenter  = useMemo(() => mod(current, n), [current, n]);
  const idxRight   = useMemo(() => mod(current + 1, n), [current, n]);
  const idxFar     = useMemo(
    () => (dir === 1 ? mod(current + 2, n) : mod(current - 2, n)),
    [current, n, dir]
  );

  // pour swipe mobile
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
  };

  const next = useCallback(() => {
    if (anim) return;
    setDir(1);
    setAnim(true);
  }, [anim]);

  const prev = useCallback(() => {
    if (anim) return;
    setDir(-1);
    setAnim(true);
  }, [anim]);

  // quand l’anim finit, on fige le nouvel index et on remet le track au repos
  useEffect(() => {
    if (!anim) return;
    const t = setTimeout(() => {
      setCurrent(c => mod(c + dir, n));
      setDir(0);
      setAnim(false);
    }, DURATION + 20);
    return () => clearTimeout(t);
  }, [anim, dir, n]);

  /* ====== Styles des cartes : contours & hover (blanc au repos, doré au hover) ====== */
  const baseCard =
    'rounded-2xl border border-white/12 bg-[#0b0b0b] ' +
    'hover:border-[rgba(212,175,55,0.40)] hover:shadow-[0_0_120px_rgba(212,175,55,0.18)] ' +
    'outline-none focus:outline-none focus-visible:outline-none ' +
    'transition-[border-color,box-shadow]';

  /* ====== Une carte (image plus grande & overlay sur latérales) ====== */
  function Card({
    data,
    role, // 'left' | 'center' | 'right'
  }: {
    data: CardDef;
    role: 'left' | 'center' | 'right';
  }) {
    const isCenter = role === 'center';
    const isSide = !isCenter;

    // échelle carte (centre un peu plus grand, latérales un peu plus petites)
    const cardScale = isCenter ? 1.0 : 0.92;
    // image plus grande mais toujours entière (object-contain + ancrée en bas)
    const imgScale = isCenter ? 1.18 : 1.08;
    // assombrissement latérales
    const shade = isCenter ? 0 : 0.16;

    return (
      <article
        className={baseCard}
        style={{
          transform: `scale(${cardScale})`,
          transition: `transform ${DURATION}ms ${EASE}`,
        }}
      >
        <div className="rounded-[inherit] overflow-hidden">
          <div className="relative aspect-[4/5] w-full bg-black">
            <Image
              src={data.image}
              alt={data.name}
              fill
              priority
              sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
              className="object-contain object-bottom select-none"
              style={{
                transform: `scale(${imgScale})`,
                transition: `transform ${DURATION}ms ${EASE}`,
              }}
            />
            {/* assombrissement des latérales */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.16), rgba(0,0,0,0.16))',
                opacity: shade,
                transition: `opacity ${DURATION}ms ${EASE}`,
              }}
            />
            {/* dégradé bas vers le texte (identique) */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none bg-gradient-to-t from-black/92 via-black/60 to-transparent"
              style={{ height: '58%' }}
            />
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <p className={'mt-2 text-sm leading-relaxed text-muted ' + (isCenter ? '' : ' line-clamp-1')}>
              {data.blurb}
            </p>
            <Link
              href={`/agents/${data.slug}`}
              className="mt-3 inline-block text-sm text-[color:var(--gold-1)]"
            >
              Voir les détails →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  /* ====== Piste coulissante : 3 cartes visibles + 1 entrante pour l’anim ======
     — Vue “repos” : [LEFT | CENTER | RIGHT]
     — NEXT : on ajoute FAR à droite et on translate vers la gauche
     — PREV : on ajoute FAR à gauche et on translate vers la droite
     Le tout reste très proche de ta mise en page (largeurs identiques). */
  const CARD_W = { left: '28%', center: '32%', right: '28%' }; // proche de tes 28/32
  const GAP = 20; // px d’écart entre cartes

  // composition selon la direction
  const sequence = useMemo(() => {
    if (dir === 1) {
      // NEXT : [left, center, right, farRight] -> translateX - (center + gap)
      return [
        { key: `L-${idxLeft}`,   role: 'left'   as const, data: CARDS[idxLeft],   width: CARD_W.left  },
        { key: `C-${idxCenter}`, role: 'center' as const, data: CARDS[idxCenter], width: CARD_W.center},
        { key: `R-${idxRight}`,  role: 'right'  as const, data: CARDS[idxRight],  width: CARD_W.right },
        { key: `F-${idxFar}`,    role: 'right'  as const, data: CARDS[idxFar],    width: CARD_W.right },
      ];
    }
    if (dir === -1) {
      // PREV : [farLeft, left, center, right] -> translateX + (left + gap)
      return [
        { key: `F-${idxFar}`,    role: 'left'   as const, data: CARDS[idxFar],    width: CARD_W.left  },
        { key: `L-${idxLeft}`,   role: 'left'   as const, data: CARDS[idxLeft],   width: CARD_W.left  },
        { key: `C-${idxCenter}`, role: 'center' as const, data: CARDS[idxCenter], width: CARD_W.center},
        { key: `R-${idxRight}`,  role: 'right'  as const, data: CARDS[idxRight],  width: CARD_W.right },
      ];
    }
    // repos
    return [
      { key: `L-${idxLeft}`,   role: 'left'   as const, data: CARDS[idxLeft],   width: CARD_W.left  },
      { key: `C-${idxCenter}`, role: 'center' as const, data: CARDS[idxCenter], width: CARD_W.center},
      { key: `R-${idxRight}`,  role: 'right'  as const, data: CARDS[idxRight],  width: CARD_W.right },
    ];
  }, [dir, idxLeft, idxCenter, idxRight, idxFar]);

  // calcul de la translation px selon la direction (on glisse d’une carte + gap)
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    // largeur à glisser = largeur de la carte centrale (ou gauche) + gap
    if (dir === 1) {
      // NEXT : on glisse vers la gauche de (width(center)+gap)
      const centerEl = cards[1]; // [left, center, right, far]
      const w = centerEl.getBoundingClientRect().width;
      setShift(-(w + GAP));
    } else if (dir === -1) {
      // PREV : on glisse vers la droite de (width(left)+gap)
      const leftEl = cards[0]; // [far, left, center, right]
      const w = leftEl.getBoundingClientRect().width;
      setShift(w + GAP);
    } else {
      setShift(0);
    }
  }, [dir, sequence]);

  return (
    <section id="solutions" className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8">Agents prêts à travailler.</h2>
      <p className="text-muted mb-6">Mettez l’IA au travail pour vous, en quelques jours.</p>

      <div className="relative py-8" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* flèches */}
        <button
          onClick={prev}
          className="hidden sm:flex items-center justify-center absolute left-[-14px] lg:left-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={next}
          className="hidden sm:flex items-center justify-center absolute right-[-14px] lg:right-[-22px] top-1/2 -translate-y-1/2 z-10
                     h-12 w-12 rounded-full border border-white/15 bg-white/6 hover:bg-white/12 backdrop-blur transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* fenêtre : overflow visible pour laisser passer l’ombre */}
        <div className="relative mx-auto max-w-full overflow-visible">
          {/* track coulissant */}
          <div
            ref={trackRef}
            className="mx-auto flex items-stretch justify-center"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${shift}px)`,
              transition: `transform ${DURATION}ms ${EASE}`,
            }}
          >
            {sequence.map(({ key, role, data, width }) => (
              <div key={key} style={{ width }} className="shrink-0">
                <Card data={data} role={role} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 md:hidden text-center text-xs text-muted">Balayez pour changer d’agent</div>
      </div>
    </section>
  );
}
